const express = require('express');
const path = require('path');
// const logger = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const brain = require('brain.js');
const data = require('./data.json');

var app = express();

//ejs view engine
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:false}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname + 'public')));

app.get('/', function(req, res){
  res.render('index');
});

const network = new brain.recurrent.LSTM();
const trainingData = data.map(item => ({
    input: [item.text, item.response],
    output: item.outcome
}));

network.train(trainingData, {
    iterations: 40
});
// const output = network.run([
//   "I won't do it again. Can I come over and talk?",
//   "Sure :( I don't get you."
// ]);

app.post('/', function(req, res){
  var input = {
    text: req.body.input1,
    response: req.body.input2
  };
  // console.log(req.body.input1);
  // console.log(req.body.input2);
  // const output = network.run([
  //   "I won't do it again. Can I come over and talk?",
  //   "Sorry, but I can't. We can't be friends. No, there's nothing left to say"
  // ]);
  let output = network.run([
    input.text,
    input.response
  ]);
  console.log(input.text);
  console.log(input.response);
  console.log(`outcome: ${output}`);
  res.render('results', {data: input, output})

});


app.listen(3000);
console.log('server started on 3000');
module.exports = app;
