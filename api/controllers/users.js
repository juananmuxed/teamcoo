const User = require('../models/users')
const Token = require('../models/tokens')
const nodemailer = require('nodemailer')
const ejs = require('ejs')
const bcrypt = require('bcryptjs');
require('dotenv').config();

const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_DOMAIN,
    port: 465,
    secure: true,
    auth: {
        user: process.env.EMAIL_ACCOUNT,
        pass: process.env.EMAIL_PASSWORD
    }
})

// Async method to register

exports.registerNewUser = async(req,res) => {
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
        await tokenConfirmation.save((error) => {
            if(error) {res.status(500).json({ message: 'An error has ocurred', error })}
            
            ejs.renderFile(__dirname + "/../email_templates/user_new_user.ejs",{name:user.firstname + ' ' + user.lastname,link:'\nhttp:\/\/localhost:8080\/validation\/' + tokenConfirmation.token},(err,emaildata) => {
                if(err) {
                    console.log(err)
                }
                else{
                    let mailOptions = {
                        from: {
                            name: 'Catapa No-Reply',
                            address: 'no-reply@catapa.be',
                        },
                        to: {
                            name: user.firstname + ' ' + user.lastname,
                            address: user.email
                        },
                        subject: 'Welcome to Catapa, ' + user.firstname,
                        html:emaildata,
                        text: 'Hello,' + user.firstname + ' ' + user.lastname + '\n\n' + 'Please verify your account by clicking the link: \nhttp:\/\/localhost:8080\/validation\/' + tokenConfirmation.token + '.\n' 
                    };
                    transporter.sendMail(mailOptions, function (error, info) {
                        console.log("sendMail returned!");
                        if (error) {
                          console.log("ERROR!!!!!!", error);
                        } else {
                          console.log('Email sent: ' + info.response);
                        }
                    });
                }
            })
        })
        res.status(201).json({ data, token });
    } catch (error) {
        res.status(400).json({ message: 'An error has ocurred', error });
    }
};

// Async method to login

exports.loginUser = async(req,res) => {
    try {
        const email = req.body.email;
        const password = req.body.password;
        const user = await User.findByCredentials(email,password);
        if(!user) {
            return res.status(409).json({message: "Login failed! Check your credentials"});
        }
        const token = await user.generateAuthToken();
        res.status(201).json({user, token})
    } catch (error) {
        res.status(400).json({ message: 'An error has ocurred', error });
    }
};

// Async method to return Userdata

exports.getUserData = async(req,res) => {
    try {
        const email = req.userData.email
        const user = await User.findByEmail(email)
        if(!user){
            return res.status(401).json({message: "Login failed! Check your credentials"})
        }
        res.status(201).json(user)
    } catch (error) {
        res.status(400).json({ message: 'An error has ocurred', error });
    }
}

// Async method to return User

exports.getUser = async(req,res) => {
    try {
        const _id = req.params.id;
        const user = await User.findById(_id);
        if(!user){
            return res.status(409).json({message: "Login failed! Check your credentials"});
        }
        res.status(201).json(user)
    } catch (error) {
        res.status(400).json({ message: 'An error has ocurred', error });
    }
}

// Async method to return Users

exports.getUsers = async(req,res) => {
    try {
        const actionDB = await User.find()
        let datatemp = []
        for (let x = 0; x < actionDB.length; x++) {
            let tempuser = {
                lastname: actionDB[x].lastname,
                rol: actionDB[x].rol,
                avatar: actionDB[x].image,
                firstname: actionDB[x].firstname,
                id: actionDB[x]._id,
                workgroups: actionDB[x].workgroups,
                verifiedemail: actionDB[x].verifiedemail,
                privatecomments: actionDB[x].privatecomments,
                username: actionDB[x].username,
                membership: actionDB[x].membership
            }
            datatemp.push(tempuser)
        }
        res.status(201).json(datatemp)
    } catch (error) {
        return res.status(400).json({mensaje: 'An error has occurred',error})
    }
}

// Async method to update User

exports.updateUser = async(req,res) => {
    try {
        const _id = req.params.id
        
        let body = req.body
        
        delete body['roles']
        delete body['passshow']
        delete body['save']
        delete body['id']
        delete body['email']
        delete body['password']
        
        let actionDB = await User.findByIdAndUpdate(_id,body,{new:true})
        res.json(actionDB)
        
    } catch (error) {
        res.status(400).json({ message: 'Error finding user id:', error });
    }
}

// Async method to update Password

exports.updatePassword = async(req,res) => {
    try {
        const _id = req.params.id
        
        const email = req.body.email
        const password = req.body.password
        if(!req.body.newpassword){
            return res.status(401).json({error: "Need a new password"})
        }
        const newpassword = await bcrypt.hash(req.body.newpassword,8)
        const user = await User.findByCredentials(email,password)

        if(!user){
            return res.status(401).json({error: "Credentials error"})
        }
        let body = {
            password: newpassword
        }
        
        let actionDB = await User.findByIdAndUpdate(_id,body,{new:true})
        res.json(actionDB)
        
    } catch (error) {
        res.status(400).json({ message: 'Wrong password', error })
    }
}

// Function to delete user

exports.deleteUser = async(req,res) => {
    try {
        const _id = req.params.id
        const email = req.body.email
        const password = req.body.password
        const user = await User.findByCredentials(email,password)

        if(!user){
            return res.status(401).json({error: "Credentials error"});
        }
        
        let actionDB = await User.findByIdAndDelete(_id)

        if(!actionDB){
            return res.status(401).json({error: "Incorrect ID"});
        }

        res.json(actionDB)

    } catch (error) {
        res.status(400).json({ message: 'Credentials error', error });
    }

}

// Function to confirm token

exports.confirmationEmail = (req,res) => {

    Token.findOne({token:req.body.token}, (e,token) => {
        if(!token){
            return res.status(400).json({ message: 'Invalid token', type: "not-verified"})
        }

        User.findOne({_id:token._userId}, (e,user) => {

            if(!user){
                return res.status(400).json({ message: 'We were unable to find the user for this token', type: "not-user" })
            }
            if(user.verifiedemail){
                return res.status(400).json({ message: 'You are already verified. This token is used.', type: "already-verified" })
            }
            
            user.verifiedemail = true;
            user.save()
            res.status(200).json({ message: 'Correct validation.', type: "correct" })
            
        })

    })

}

// Function to external pass change

exports.changepassexternal = async(req,res) => {

    let password = req.body.password

    if(!password){
        return res.status(400).json({ message: 'No password', type: "not-pass"})
    }

    Token.findOne({token:req.body.token}, (e,token) => {
        if(!token){
            return res.status(400).json({ message: 'Invalid token', type: "not-verified"})
        }

        User.findOne({_id:token._userId}, (e,user) => {
            if(!user){
                return res.status(400).json({ message: 'We were unable to find the user for this token', type: "not-user" })
            }

            user.password = password;
            user.save()
            res.status(200).json({ message: 'Correct password change.', type: "correct" })
            
        })
    })

}

// Function to send a change for pass

exports.sendPassEmail = (req,res) => {
    User.findOne({email:req.body.email}, (e,user) => {
        
        if(!user){
            return res.status(400).json({ message: 'We were unable to find the user with this E-mail.', type: "not-user" })
        }

        let generatedToken = user.generateAuthToken()
        
        let token = new Token({ _userId: user._id, token: generatedToken})
        token.save((error) => {
            if(error) {res.status(500).json({ message: 'An error has ocurred', error })}
            
            ejs.renderFile(__dirname + "/../email_templates/user_change_password.ejs",{name:user.firstname + ' ' + user.lastname,link:'\nhttp:\/\/localhost:8080\/reset\/password\/' + token.token},(err,emaildata) => {
                if(err) {
                    console.log(err)
                }
                else{
                    let mailOptions = {
                        from: {
                            name: 'Catapa No-Reply',
                            address: 'no-reply@catapa.be',
                        },
                        to: {
                            name: user.firstname + ' ' + user.lastname,
                            address: user.email
                        },
                        subject: 'Change your password',
                        html:emaildata,
                        text: 'Catapa Staff\n\nHello,' + user.firstname + ' ' + user.lastname + '\n\n' + 'Please go here to change your Password: \nhttp:\/\/localhost:8080\/reset\/password\/' + token.token + '.\n' 
                    };
                    transporter.sendMail(mailOptions, function (error, info) {
                        console.log("sendMail returned!");
                        if (error) {
                          console.log("ERROR!!!!!!", error);
                        } else {
                          console.log('Email sent: ' + info.response);
                        }
                    });
                }
            })
            return res.status(201).json({message: 'A verification email has been sent to ' + user.email + '.',token:token});
        })
    })
}

// Function to resend token

exports.reSendConfirmation = (req,res) => {

    User.findOne({email:req.body.email}, (e,user) => {
        
        if(!user){
            return res.status(400).json({ message: 'We were unable to find the user with this E-mail.', type: "not-user" })
        }
        if(user.verifiedemail){
            return res.status(400).json({ message: 'This account has already been verified.', type: "already-verified" })
        }

        let generatedToken = user.generateAuthToken()
        
        let token = new Token({ _userId: user._id, token: generatedToken})
        token.save((error) => {
            if(error) {res.status(500).json({ message: 'An error has ocurred', error })}
            
            ejs.renderFile(__dirname + "/../email_templates/user_validation_resend.ejs",{name:user.firstname + ' ' + user.lastname,link:'\nhttp:\/\/localhost:8080\/validation\/' + token.token},(err,emaildata) => {
                if(err) {
                    console.log(err)
                }
                else{
                    let mailOptions = {
                        from: {
                            name: 'Catapa No-Reply',
                            address: 'no-reply@catapa.be',
                        },
                        to: {
                            name: user.firstname + ' ' + user.lastname,
                            address: user.email
                        },
                        subject: 'Verify your account, ' + user.firstname,
                        html:emaildata,
                        text: 'Hello,' + user.firstname + ' ' + user.lastname + '\n\n' + 'Please verify your account by clicking the link: \nhttp:\/\/localhost:8080\/validation\/' + token.token + '.\n' 
                    };
                    transporter.sendMail(mailOptions, function (error, info) {
                        console.log("sendMail returned!");
                        if (error) {
                          console.log("ERROR!!!!!!", error);
                        } else {
                          console.log('Email sent: ' + info.response);
                        }
                    });
                }
            })
            return res.status(201).json({message: 'A verification email has been sent to ' + user.email + '.'});
        })
    })
}