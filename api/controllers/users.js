const User = require('../models/users')
const Token = require('../models/tokens')
const bcrypt = require('bcryptjs');
const mailer = require("../controllers/mail");

// Async method to register

exports.registerNewUser = async (req, res) => {
    try {
        let isUser = await User.find({ email: req.body.email });
        if (isUser.length >= 1) {
            return res.status(409).json({
                message: "E-mail already in use"
            });
        }
        const user = new User({
            username: req.body.username,
            email: req.body.email,
            lastname: req.body.lastname,
            firstname: req.body.firstname,
            password: req.body.password,
            accept: req.body.accept,
            verifiedemail: req.body.verifiedemail,
            rol: req.body.rol
        });

        let data = await user.save();
        const token = await user.generateAuthToken();
        let tokenConfirmation = new Token({
            _userId: user._id,
            token: token
        })
        let tokenSaved = await tokenConfirmation.save()
        if (!tokenSaved) {
            return res.status(500).json({ message: 'An error has ocurred', error })
        }
        res.status(201).json({ data, token });
    } catch (error) {
        res.status(400).json({ message: 'An error has ocurred', error: error });
    }
};

// Async method to login

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
        res.status(201).json({ user, token })
    } catch (error) {
        res.status(400).json({ message: 'An error has ocurred', error: error });
    }
};

// Async method to return User

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

// Async method to return Users

exports.getUsers = async (req, res) => {
    try {
        const userDB = await User.find()
        let datatemp = []
        for (let x = 0; x < userDB.length; x++) {
            let tempuser = {
                lastname: userDB[x].lastname,
                rol: userDB[x].rol,
                avatar: userDB[x].image,
                firstname: userDB[x].firstname,
                id: userDB[x]._id,
                workgroups: userDB[x].workgroups,
                commonquestions: userDB[x].commonquestions,
                privatecomments: userDB[x].privatecomments,
                username: userDB[x].username,
                membership: userDB[x].membership
            }
            datatemp.push(tempuser)
        }
        res.status(201).json(datatemp)
    } catch (error) {
        return res.status(400).json({ message: 'An error has occurred', error: error })
    }
}

// Async method to update User

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
        res.status(400).json({ message: 'Error finding user id:', error });
    }
}

// Async method to update Password

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
        res.status(400).json({ message: 'Wrong password', error })
    }
}

// Function to delete user

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
        res.status(400).json({ message: 'Invalid Credentials' });
    }

}

// Function to delete user soft

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

// Function to confirm token

exports.confirmationEmail = (req, res) => {

    Token.findOne({ token: req.body.token }, (e, token) => {
        if (!token) {
            return res.status(400).json({ message: 'Invalid token', type: "not-verified" })
        }

        User.findOne({ _id: token._userId }, (e, user) => {

            if (!user) {
                return res.status(400).json({ message: 'We were unable to find the user for this token', type: "not-user" })
            }
            if (user.verifiedemail) {
                return res.status(400).json({ message: 'You are already verified. This token is used.', type: "already-verified" })
            }

            user.verifiedemail = true;
            user.save()
            res.status(200).json({ message: 'Correct validation.', type: "correct" })

        })

    })

}

// Function to external pass change

exports.changepassexternal = async (req, res) => {

    let password = req.body.password

    if (!password) {
        return res.status(400).json({ message: 'No password', type: "not-pass" })
    }

    Token.findOne({ token: req.body.token }, (e, token) => {
        if (!token) {
            return res.status(400).json({ message: 'Invalid token', type: "not-verified" })
        }

        User.findOne({ _id: token._userId }, (e, user) => {
            if (!user) {
                return res.status(400).json({ message: 'We were unable to find the user for this token', type: "not-user" })
            }

            user.password = password;
            user.save()
            res.status(200).json({ message: 'Correct password change.', type: "correct" })

        })
    })

}

// Function to send a change for pass

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
        res.status(500).json({ message: 'An error has ocurred', error })
    }
}

// Function to resend token

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
        return res.status(201).json({ message: 'A verification email has been sent to ' + user.email + '.' });
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: 'An error has ocurred', error })
    }
}