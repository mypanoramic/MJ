var nodemailer = require('nodemailer');

async function SendMail(template, branchEmail) {

    let status
    var transporter = nodemailer.createTransport({
        host: 'smtp.office365.com',
        port: 587,
        secure: false,
        auth: {
            user: 'No-Reply@mypanoramic.com',
            pass: 'IanJacobs082324'
        }
    });

    var mailOptions = {
        from: 'No-Reply@mypanoramic.com',
        to: branchEmail,
        subject: 'Contact Request',
        text: template
    };

    try {
        const mailStatus = await transporter.sendMail(mailOptions);
        console.log('sent')
        return 'completed'
    }
    catch (e) {
        console.log(e)
        return 'something went wrong';
    }



}

module.exports = SendMail