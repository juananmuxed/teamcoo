const User = require('../models/users')
const Token = require('../models/tokens')
const bcrypt = require('bcryptjs');
const mailer = require("../controllers/mail");

exports.createUser = async (req, res) => {
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
            _userId: user._id,
            type: 'registration'
        })
        if (!tokenModel) {
            return res.status(500).json({ message: 'Not asigned token', error })
        }
        await User.findByIdAndUpdate(user._id, { $push: { tokens: tokenModel._id } });
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
        const tokenModel = await Token.create({
            token: token,
            _userId: user._id,
            type: 'login'
        })
        if (!tokenModel) {
            return res.status(500).json({ message: 'Not asigned token', error })
        }
        await User.findByIdAndUpdate(user._id, { $push: { tokens: tokenModel._id } });
        res.status(201).json({ user, token })
    } catch (error) {
        res.status(400).json({ message: 'An error has ocurred', error: error });
    }
};

exports.getUser = async (req, res) => {
    try {
        const _id = req.params.id;
        const user = await User.findById(_id)
            .populate({
                path: 'interests',
                match: { deleted: false }
            })
        if (!user) {
            return res.status(409).json({ message: "User not find" });
        }
        res.status(201).json(user)
    } catch (error) {
        res.status(400).json({ message: 'An error has ocurred', error: error });
    }
}

exports.getAllUsers = async (req, res) => {
    try {
        const userDB = await User.find({ deleted: false })
            .populate({
                path: 'interests',
                match: { deleted: false }
            });
        res.status(201).json(userDB)
    } catch (error) {
        res.status(400).json({ message: 'An error has ocurred', error: error });
    }
}

exports.getAllUsersPaged = async (req, res) => {
    try {
        const { page = 1, itemsPerPage = 10, sortBy = [], sortDesc = [], searchName = null, searchRol = null, searchInterests = [], searchMode } = req.query;
        let sort = {};
        let searchObject = {
            $and: [
                { deleted: false }
            ]
        }
        if (searchName) searchObject.$and.push({
            $or: [
                { username: { $regex: searchName, $options: 'i' } },
                { firstName: { $regex: searchName, $options: 'i' } },
                { lastName: { $regex: searchName, $options: 'i' } }
            ]
        })
        if (searchRol) searchObject.$and.push({ 'rol.value': searchRol })
        if (searchInterests.length != 0) {
            const interestsObject = {
                interests: { [!JSON.parse(searchMode.toLowerCase()) ? '$in' : '$all']: searchInterests }
            }
            searchObject.$and.push(interestsObject)
        }
        sortBy.forEach((key, i) => sort[key] = sortDesc[i] === 'true' ? -1 : 1);
        const usersDB = await User.find({
            $and: [
                { deleted: false }, searchObject
            ]
        })
            .limit(itemsPerPage * 1)
            .skip((page - 1) * itemsPerPage)
            .sort(sort)
            .populate({
                path: 'interests',
                match: { deleted: false }
            });
        const count = await User.countDocuments({ deleted: false });
        res.json({ items: usersDB, totalItems: count });
    } catch (error) {
        res.status(500).json({ message: 'An error has occurred', error: error });
    }
}

exports.getUserByString = async (req, res) => {
    try {
        const string = req.params.name;
        const regex = new RegExp(string, 'i')
        const userDB = await User.find({
            $and: [
                { deleted: false },
                {
                    $or: [
                        { username: { $regex: regex } },
                        { firstName: { $regex: regex } },
                        { lastName: { $regex: regex } }
                    ]
                }
            ]
        })
        res.status(201).json(userDB)
    } catch (error) {
        res.status(400).json({ message: 'An error has ocurred', error: error });
    }
}

exports.getAllUsersDeleted = async (req, res) => {
    try {
        const userDB = await User.find({ deleted: true })
            .populate({
                path: 'interests',
                match: { deleted: false }
            });
        res.status(201).json(userDB)
    } catch (error) {
        res.status(400).json({ message: 'An error has ocurred', error: error });
    }
}

exports.updateUser = async (req, res) => {
    try {
        const _id = req.params.id
        const userDB = await User.findByIdAndUpdate(_id, req.body, { new: true })
            .populate({
                path: 'interests',
                match: { deleted: false }
            });
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
        if (!req.body.new) {
            return res.status(401).json({ error: "Need a new password" })
        }
        const newpassword = await bcrypt.hash(req.body.new, 8)
        const user = await User.findByCredentials(email, password)

        if (user instanceof Error) {
            return res.status(409).json({ message: user.message });
        }

        const userDB = await User.findByIdAndUpdate(_id, { password: newpassword }, { new: true })
            .populate({
                path: 'interests',
                match: { deleted: false }
            });
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

        const userDB = await User.findByIdAndUpdate(_id, { deleted: true }, { new: true })
            .populate({
                path: 'interests',
                match: { deleted: false }
            });

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

exports.changePassExternal = async (req, res) => {
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
        if (!user || user.deleted) {
            return res.status(400).json({ message: 'We were unable to find the user for this token', type: "not-user" })
        }

        user.password = password;
        await user.save()
        res.status(200).json({ message: 'Correct password change', type: "correct" })
    } catch (error) {
        res.status(400).json({ message: 'An error has ocurred', error: error });
    }
}

exports.sendPassEmail = async (req, res) => {
    try {
        const email = req.body.email;
        const user = await User.findOne({ email: email });
        if (!user) {
            return res.status(409).json({ message: 'We were unable to find the user with this E-mail.' });
        }
        if (user.deleted) {
            return res.status(409).json({ message: 'Your account is closed, please contact with the administrators.' });
        }

        const token = await user.generateAuthToken();
        const tokenModel = await Token.create({
            token: token,
            _userId: user._id,
            type: 'resetPassword'
        })
        if (!tokenModel) {
            return res.status(500).json({ message: 'Not asigned token', error })
        }
        await User.findByIdAndUpdate(user._id, { $push: { tokens: tokenModel._id } });

        await mailer.sendMail({
            body: {
                sendTo: email,
                userTo: user.firstName,
                template: 'user/changePass',
                subject: 'Change your password',
                variables: {
                    recoveryUrlPass: req.body.url + '/reset/password/' + token
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
                userTo: user.firstName,
                template: 'user/validationResend',
                subject: 'Welcome ' + user.firstName,
                variables: {
                    recoveryUrlPass: req.body.url + generatedToken,
                    name: user.firstName + ' ' + user.lastName
                }
            }
        })
        res.status(201).json({ message: 'A verification email has been sent to ' + user.email + '.' });
    } catch (error) {
        res.status(400).json({ message: 'An error has ocurred', error: error });
    }
}