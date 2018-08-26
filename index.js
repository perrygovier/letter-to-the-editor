require('dotenv').config();
const bodyParser = require('body-parser');
const express = require('express');
const app = express();
const Recaptcha = require('express-recaptcha').Recaptcha;
const fs = require('fs');

const recaptcha = new Recaptcha(
  process.env.RECAPTCHA_SITE_KEY, 
  process.env.RECAPTCHA_SECRET_KEY
);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());


app.get('/', recaptcha.middleware.render, (req, res) => {
  const HTMLBase   = fs.readFileSync('templates/base.html', 'utf8');
  const HTMLForm   = fs.readFileSync('templates/form.html', 'utf8');
  const HTMLStates = fs.readFileSync('templates/states.html', 'utf8');
  const HTMLCounties = fs.readFileSync('templates/counties.html', 'utf8');
  const issues = JSON.parse(fs.readFileSync('issues.json', 'utf8'));
  const defaultPage = HTMLBase
    .replace('{{content}}', HTMLForm)
    .replace('{{states}}', HTMLStates)
    .replace('{{counties}}', HTMLCounties)
    .replace('{{issues}}', keysToOptions(issues))
    .replace('{{captcha}}', res.recaptcha);
  res.send(defaultPage);
});

app.post('/', recaptcha.middleware.verify, function(req, res){
  if (!req.recaptcha.error) {
    console.log(req)
  } else {
    console.log(req.recaptcha)
  }
});

app.listen(process.env.PORT || 3000, () => console.log('Example app listening on port 3000!'))


function keysToOptions(obj) {
  let str = '';
  const keys = Object.keys(obj);
  for(let i = 0; i < keys.length; i++) {
    str += `<option value="${keys[i]}">${keys[i]}</option>`
  }
  return str;
}