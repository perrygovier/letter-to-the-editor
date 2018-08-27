require('dotenv').config();
const bodyParser = require('body-parser');
const express = require('express');
const app = express();
const Recaptcha = require('express-recaptcha').Recaptcha;
const utils = require('./utils');

const recaptcha = new Recaptcha(
  process.env.RECAPTCHA_SITE_KEY, 
  process.env.RECAPTCHA_SECRET_KEY
);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());


app.get('/', recaptcha.middleware.render, (req, res) => {
  res.send(utils.getFormMarkup(res.recaptcha));
});

app.post(
  '/', 
  recaptcha.middleware.verify, 
  recaptcha.middleware.render, 
  function(req, res){

  if (!req.recaptcha.error) {
    console.error(req)
  }
  let message = '';
  utils.sendEmail(
    req.body.email || 'govierp@gmail.com',
    [req.body.email, 'govierp@gmail.com'],
    `A message from ${req.body.first_name} ${req.body.last_name} on ${req.body.issue}`,
    req.body.message + '\n' + utils.objectToString(req.body)
  ).then(() => {
    res.send(utils.getFormMarkup(res.recaptcha).replace('<!-- notification -->',
      `<div class="alert alert-success" role="alert">
        <h2>Message Sent</h2>
      </div>`
    ));
  }).catch(error => {
    res.send(utils.getFormMarkup(res.recaptcha).replace('<!-- notification -->',
      `<div class="alert alert-danger" role="alert">
        <h2>Sorry, unable to send. Please Try again later.</h2>
      </div>`
    ));
  });
});

app.listen(process.env.PORT || 3000, () => console.log('Example app listening on port 3000!'))


