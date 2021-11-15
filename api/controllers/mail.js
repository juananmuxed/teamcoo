const Config = require('../models/configuration')
const fs = require("fs");
const path = require("path");
const nodemailer = require('nodemailer');
const hdb = require('handlebars');
const mjml2html = require('mjml');
const Mail = require('../models/mail');
require('dotenv').config({ path: require('find-config')('.env') });

exports.sendMail = async (req, res) => {
    try {
        const configDB = await Config.findOne({ name: "emails" });
        if (!configDB) {
            throw new Error('No configured data')
        }

        const data = configDB.values

        let body = req.body;

        if (!body.template) {
            throw new Error('Template required');
        }

        if (!body.sendTo) {
            throw new Error('Mail to send required');
        }

        if (!body.subject) {
            throw new Error('Subject required');
        }

        if (!body.sendFrom) {
            body.sendFrom = data.email;
        }

        if (!body.userTo) {
            body.userTo = ''
        }

        if (!body.userFrom) {
            body.userFrom = data.name;
        }

        const context = body.variables;

        const configColors = await Config.findOne({ name: "colors" });
        context.primary = !configColors ? '#3271cf' : configColors.values.light.primary;
        context.secondary = !configColors ? '#179246' : configColors.values.light.secondary;

        const configWeb = await Config.findOne({ name: "web" });
        context.webpage = !configWeb ? 'TeamCoo' : configWeb.values.name;
        context.url = !configWeb ? 'http://localhost:3000' : configWeb.values.url;

        const configLogo = await Config.findOne({ name: "logos" });
        context.logoUrl = !configLogo ? url + '/uploads/TEAMCOO_LOGO.png' : configLogo.values.logo;

        context.legalText = !data.legalText ? 'Legal Text not added' : data.legalText

        const template = fs.readFileSync(path.join(__dirname, '../templates/emails/' + body.template + '.mjml'));
        const templatePlain = fs.readFileSync(path.join(__dirname, '../templates/emails/' + body.template + '.txt'));

        const mjmlHandlebars = hdb.compile(template.toString('utf8'));
        const plainHandlebars = hdb.compile(templatePlain.toString('utf8'));

        const mjmlTemplate = mjmlHandlebars(context);
        const plainTemplate = plainHandlebars(context);

        const html = mjml2html(mjmlTemplate).html;

        const transporter = nodemailer.createTransport({
            host: data.host,
            port: data.port,
            secure: data.secure,
            auth: {
                user: data.user,
                pass: data.pass
            }
        })

        let mailOptions = {
            from: {
                name: body.userFrom,
                address: body.sendFrom,
            },
            to: {
                name: body.userTo,
                address: body.sendTo
            },
            subject: body.subject,
            html: html,
            text: plainTemplate
        };

        let mailObj = {
            sendTo: body.sendTo,
            sendFrom: body.sendFrom,
            sendToName: body.userTo,
            sendFromName: body.userFrom,
            subject: body.subject,
            template: body.template,
            html: html,
            text: plainTemplate,
            sended: false,
            response: '',
            responseError: ''
        }

        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.log('Error: ' + error);
                mailObj.responseError = error.response
                Mail.create(mailObj);
                if (error.responseCode) {
                    res.status(error.responseCode).json({ message: error.response, responseCode: error.responseCode, code: error.code });
                } else {
                    res.status(400).json({ message: error.response, responseCode: 400, code: error.code });
                }
            } else {
                console.log('Email sent: ' + info.response);
                mailObj.response = info.response;
                mailObj.sended = true;
                Mail.create(mailObj);
                res.status(200).json({ info });
            }
        });

    } catch (error) {
        console.log(error)
        res.status(400).json({ message: error.message | 'An error has ocurred', error });
    }
}

exports.updateMailLog = async (req, res) => {
    const _id = req.params.id
    const body = req.body

    try {
        const interestDB = await Mail.findByIdAndUpdate(_id, body, { new: true })
        res.json(interestDB)
    } catch (error) {
        res.status(500).json({ message: 'An error has occurred: ' + error, error })
    }
}