const Config = require('../models/configuration')
const fs = require("fs");
const path = require("path");
const nodemailer = require('nodemailer');
const hdb = require('handlebars');
const mjml2html = require('mjml');

exports.sendMail = async (req, res) => {
    try {
        const configDB = await Config.findOne({ name: "emails" });
        if (!configDB) {
            throw new Error('No configured data')
        }

        const data = configDB.values

        let body = req.body;

        if (!body.template) {
            throw new Error('No template selected');
        }

        const context = body.variables;

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
                name: data.name,
                address: data.email,
            },
            to: {
                name: body.user,
                address: body.sendTo
            },
            subject: body.subject,
            html: html,
            text: plainTemplate
        };

        transporter.sendMail(mailOptions, function (error, info) {
            if (error) {
                console.log('Error: ' + error);
                if (error.responseCode) {
                    res.status(error.responseCode).json({ message: error.response, responseCode: error.responseCode, code: error.code });
                } else {
                    res.status(400).json({ message: error.response, responseCode: 400, code: error.code });
                }
            } else {
                console.log('Email sent: ' + info.response);
                res.status(200).json({ info });
            }
        });

    } catch (error) {
        console.log(error)
        res.status(400).json({ message: error.message | 'An error has ocurred', error });
    }
}