require('dotenv').config();
const express = require('express');
const app = express();
const fs = require('fs');


app.get('/', (req, res) => {
  const HTMLBase   = fs.readFileSync('templates/base.html', 'utf8');
  const HTMLForm   = fs.readFileSync('templates/form.html', 'utf8');
  const HTMLStates = fs.readFileSync('templates/states.html', 'utf8');
  const HTMLCounties = fs.readFileSync('templates/counties.html', 'utf8');
  const issues = JSON.parse(fs.readFileSync('issues.json', 'utf8'));
  const defaultPage = HTMLBase
    .replace('{{content}}', HTMLForm)
    .replace('{{states}}', HTMLStates)
    .replace('{{counties}}', HTMLCounties)
    .replace('{{issues}}', keysToOptions(issues));
  res.send(defaultPage);
});

app.listen(3000, () => console.log('Example app listening on port 3000!'))


function keysToOptions(obj) {
  let str = '';
  const keys = Object.keys(obj);
  for(let i = 0; i < keys.length; i++) {
    str += `<option value="${keys[i]}">${keys[i]}</option>`
  }
  return str;
}