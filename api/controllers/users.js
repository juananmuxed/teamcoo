const User = require('../models/users')
const Token = require('../models/tokens')
const bcrypt = require('bcryptjs');
const mailer = require("../controllers/mail");

exports.registerNewUser = async (req, res) => {
    try {
        let isUser = await User.find({ email: req.body.email });
        if (isUser.length >= 1) {
            return res.status(409).json({
                message: "E-mail already in use"
            });
        }

        const user = await User.create(req.body);
        const token = await user.generateAuthToken();
        const tokenModel = await Token.create({
            token: token,
            type: 'registration'
        })
        if (!tokenModel) {
            return res.status(500).json({ message: 'Not asigned token', error })
        }
        res.status(201).json({ user, token });
    } catch (error) {
        res.status(400).json({ message: 'An error has ocurred', error: error });
    }
};

exports.loginUser = async (req, res) => {
    try {
        const email = req.body.email;
        const password = req.body.password;
        const user = await User.findByCredentials(email, password);
        if (user instanceof Error) {
            return res.status(409).json({ message: user.message });
        }
        if (user.deleted) {
            return res.status(409).json({ message: 'Your account is closed, please contact with the administrators.' });
        }

        const token = await user.generateAuthToken();
        await Token.create({
            token: token,
            type: 'login'
        })
        res.status(201).json({ user, token })
    } catch (error) {
        res.status(400).json({ message: 'An error has ocurred', error: error });
    }
};

exports.getUser = async (req, res) => {
    try {
        const _id = req.params.id;
        const user = await User.findById(_id);
        if (!user) {
            return res.status(409).json({ message: "Login failed! Check your credentials" });
        }
        res.status(201).json(user)
    } catch (error) {
        res.status(400).json({ message: 'An error has ocurred', error: error });
    }
}

exports.getUsers = async (req, res) => {
    try {
        const userDB = await User.find()
        res.status(201).json(userDB)
    } catch (error) {
        res.status(400).json({ message: 'An error has ocurred', error: error });
    }
}

exports.updateUser = async (req, res) => {
    try {
        const _id = req.params.id

        let body = req.body

        delete body['roles']
        delete body['passshow']
        delete body['save']
        delete body['id']
        delete body['email']
        delete body['password']

        let userDB = await User.findByIdAndUpdate(_id, body, { new: true })
        res.json(userDB)

    } catch (error) {
        res.status(400).json({ message: 'An error has ocurred', error: error });
    }
}

exports.updatePassword = async (req, res) => {
    try {
        const _id = req.params.id

        const email = req.body.email
        const password = req.body.password
        if (!req.body.newpassword) {
            return res.status(401).json({ error: "Need a new password" })
        }
        const newpassword = await bcrypt.hash(req.body.newpassword, 8)
        const user = await User.findByCredentials(email, password)

        if (!user) {
            return res.status(401).json({ error: "Credentials error" })
        }
        let body = {
            password: newpassword
        }

        let userDB = await User.findByIdAndUpdate(_id, body, { new: true })
        res.json(userDB)

    } catch (error) {
        res.status(400).json({ message: 'An error has ocurred', error: error });
    }
}

exports.deleteUser = async (req, res) => {
    try {
        const _id = req.params.id
        const email = req.body.email
        const password = req.body.password
        const user = await User.findByCredentials(email, password)

        if (!user) {
            return res.status(401).json({ message: "Credentials error" });
        }

        let userDB = await User.findByIdAndDelete(_id)

        if (!userDB) {
            return res.status(401).json({ message: "Incorrect ID" });
        }

        res.json(userDB)

    } catch (error) {
        res.status(400).json({ message: 'An error has ocurred', error: error });
    }

}

exports.deleteUserSoft = async (req, res) => {
    try {
        const _id = req.params.id
        const email = req.body.email
        const password = req.body.password
        const user = await User.findByCredentials(email, password)

        if (user instanceof Error) {
            return res.status(409).json({ message: user.message });
        }

        let userDB = await User.findByIdAndUpdate(_id, { deleted: true })

        if (!userDB) {
            return res.status(401).json({ message: "Incorrect ID" });
        }

        res.json(userDB)
    } catch (error) {
        res.status(400).json({ message: 'An error has ocurred', error: error });
    }

}

exports.confirmationEmail = async (req, res) => {
    try {
        let token = await Token.findOne({ token: req.body.token });
        if (!token) {
            return res.status(400).json({ message: 'Invalid token', type: "not-verified" })
        }

        let user = await User.findOne({ _id: token._userId });
        if (!user) {
            return res.status(400).json({ message: 'We were unable to find the user for this token', type: "not-user" })
        }
        if (user.verifiedemail) {
            return res.status(400).json({ message: 'You are already verified. This token is used.', type: "already-verified" })
        }
        user.verifiedemail = true;
        await user.save()
        res.status(200).json({ message: 'Correct validation.', type: "correct" })
    } catch (error) {
        res.status(400).json({ message: 'An error has ocurred', error: error });
    }
}

exports.changepassexternal = async (req, res) => {
    try {
        let password = req.body.password

        if (!password) {
            return res.status(400).json({ message: 'No password', type: "not-pass" })
        }

        let token = await Token.findOne({ token: req.body.token });
        if (!token) {
            return res.status(400).json({ message: 'Invalid token', type: "not-verified" })
        }

        let user = await User.findOne({ _id: token._userId });
        if (!user) {
            return res.status(400).json({ message: 'We were unable to find the user for this token', type: "not-user" })
        }

        user.password = password;
        await user.save()
        res.status(200).json({ message: 'Correct password change.', type: "correct" })
    } catch (error) {
        res.status(400).json({ message: 'An error has ocurred', error: error });
    }
}

exports.sendPassEmail = async (req, res) => {
    try {
        let user = await User.findOne({ email: req.body.email })
        if (!user) {
            return res.status(400).json({ message: 'We were unable to find the user with this E-mail.', type: "not-user" })
        }

        let generatedToken = user.generateAuthToken()
        let token = new Token({ _userId: user._id, token: generatedToken })
        await token.save();
        await mailer.sendMail({
            body: {
                sendTo: req.body.email,
                userTo: user.firstname,
                template: 'user/changePass',
                subject: 'Change your password',
                variables: {
                    recoveryUrlPass: req.body.url + '/reset/password/' + generatedToken
                }
            }
        })
        return res.status(201).json({ message: 'A verification email has been sent to ' + user.email + '.', token: token });
    } catch (error) {
        res.status(400).json({ message: 'An error has ocurred', error: error });
    }
}

exports.reSendConfirmation = async (req, res) => {
    try {
        let user = await User.findOne({ email: req.body.email });
        if (!user) {
            return res.status(400).json({ message: 'We were unable to find the user with this E-mail.', type: "not-user" })
        }
        if (user.verifiedemail) {
            return res.status(400).json({ message: 'This account has already been verified.', type: "already-verified" })
        }

        let generatedToken = await user.generateAuthToken()

        let token = new Token({ _userId: user._id, token: generatedToken })
        await token.save();
        mailer.sendMail({
            body: {
                sendTo: req.body.email,
                userTo: user.firstname,
                template: 'user/validationResend',
                subject: 'Welcome ' + user.firstname,
                variables: {
                    recoveryUrlPass: req.body.url + generatedToken,
                    name: user.firstname + ' ' + user.lastname
                }
            }
        })
        res.status(201).json({ message: 'A verification email has been sent to ' + user.email + '.' });
    } catch (error) {
        res.status(400).json({ message: 'An error has ocurred', error: error });
    }
}