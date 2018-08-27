const fs = require('fs');
const nodemailer = require('nodemailer');

const smtpTransport = nodemailer.createTransport("SMTP", {
  service: "Gmail",
  auth: {
    XOAuth2: {
      user: "govierp@gmail.com", // Your gmail address.
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      refreshToken: process.env.GOOGLE_REFRESH_TOKEN
    }
  }
});

module.exports = {
  sendEmail: function(from, to, subject, message) {
    var mailOptions = {
      from: from, // sender address
      to: to,
      subject: subject,
      text: message
    };

    // send mail
    return new Promise((resolve, reject) => {
      smtpTransport.sendMail(mailOptions, function(error, info) {
        if (error) {
          console.error(error);
          reject(error);
        } else {
          console.log(`Message ${info.messageId} sent: ${info.response}`);
          resolve();
        }
        smtpTransport.close();
      });
    });
  },

  objectToString: function(obj) {
    let str = '\n';
    Object.keys(obj).forEach(key => {
      if ([
        'g-recaptcha-response',
        'message'
      ].indexOf(key) < 0) {
        str += `${key} ::  ${obj[key]} \n`;
      }
    });
    return str;
  },

  getFormMarkup: function(captcha, addBase = true) {
    const form = fs.readFileSync('templates/form.html', 'utf8')
    const issues = fs.readFileSync('issues.json', 'utf8');
  
    let defaultPage = '';
    if (addBase) {
      defaultPage = fs.readFileSync('templates/base.html', 'utf8');
    } else {
      defaultPage = form;
    }
    const data = {
      '{{content}}': form,
      '{{states}}': fs.readFileSync('templates/states.html', 'utf8'),
      '{{counties}}': fs.readFileSync('templates/counties.html', 'utf8'),
      '{{issues}}': keysToOptions(JSON.parse(issues)),
      '{{captcha}}': captcha,
      '{{issueJSON}}': issues,
    }
    Object.keys(data).forEach(key => {
      defaultPage = defaultPage.replace(key, data[key]);
    });
  
    return defaultPage;
  }
}


function keysToOptions(obj) {
  let str = '';
  const keys = Object.keys(obj);
  for(let i = 0; i < keys.length; i++) {
    str += `<option value="${keys[i]}">${keys[i]}</option>`
  }
  return str;
}