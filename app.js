const express = require('express');
const bodyParser= require('body-parser')
const app = express();
var firebase = require('firebase');
var fs = require('fs');
var request = require('request');
var config = require('./config.js');
var nodemailer = require('nodemailer');


var transporter = nodemailer.createTransport({
  'service': 'gmail',
  'auth': config.mail.auth
});

function sendEmail(options) {
  transporter.sendMail(options, function (error, info) {
    if (error) {
        return console.log(error);
    }
    console.log('Message sent: ' + info.response);
  });
}

app.set('view engine', 'ejs');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(__dirname + '/public'));

firebase.initializeApp(config.firebase);

app.get('/', (req, res) => {
  var imageRef = firebase.database().ref("ImageSets");
  imageRef.on('value', function(snapshot) {

    var data = snapshot.val();
    var result = Object.keys(data).map(function (key) { 
      var value = data[key]; 
      value['name'] = key;
      return value;
    });

    // console.log(result);

    for(var i = 0; i < result.length; i++) {
      var imgData = result[i].images;
      var images = Object.keys(imgData).map(function (key) { 
        return { name: key, img: imgData[key] }; 
      });
      result[i].images = images;
    }
    // console.log(result);
    res.render('index.ejs', { data: result})
  });
})

app.get('/image_set/:image_set_key', (req, res) => {

  var key = req.params.image_set_key;

  var imageRef = firebase.database().ref("ImageSets");
  imageRef.child(key).on('value', function(snapshot) {
    var data = snapshot.val();
    if(data) {
      var imgData = data.images;
      var images = Object.keys(imgData).map(function (key) { 
        return { name: key, img: imgData[key] }; 
      });

      data.images = images;
      res.render('index.ejs', { data: [data]});
    }
    else{
      res.render('index.ejs', {data: []});
      // console.log(result);
    }
  });
})

app.post('/download',(req, res) => {
  var url = req.body.url;

  request.head(url, function(err, resp, body){
    request(url).pipe(fs.createWriteStream("public/tmp/img.png")).on('close', function() {
      res.json("/tmp/img.png");
    });
  });

})

app.post('/send_email', (req, res) => {
  var group_key = req.body.group_key;
  var image_set_key = req.body.image_set_key;
  if(!group_key) {
    res.status(404);
    res.json({message: "group_key is required!"});
    return;
  }
  if(!image_set_key) {
    res.status(404);
    res.json({message: "image_set_key is required!"}); 
    return;
  }

  var imageSetRef = firebase.database().ref("ImageSets");
  imageSetRef.child(image_set_key).on('value', function(snap) {
    const imageSet = snap.val();

    const host_url = req.headers.host;
    console.log(req.headers);
    const image_set_url = host_url + '/image_set/' + image_set_key;

    var groupRef = firebase.database().ref("Groups");
    groupRef.child(group_key).on('value', function(snapshot){
      var data = snapshot.val();
      const created_by = data.created_by;
      Object.keys(data.users).map(function(key) {
        var user = data.users[key];

        var html = config.mail.template.html;
        var subject = "P360M : " + imageSet.title;
        var to = user.email;
        var from = created_by.email;

        html = html.replace('first_name', user.first_name);
        html = html.replace('last_name', user.last_name);
        html = html.replace('c_fir_name', created_by.first_name);
        html = html.replace('c_lst_name', created_by.last_name);
        html = html.replace('image_set_url', image_set_url);
        html = html.replace('host_url', host_url);
        html = html.replace('reply_to_email', created_by.email);
        

        var option = {
            'from': from,
            'to': to,
            'subject': subject,
            'html': html
        }

        // console.log(option);
        sendEmail(option);
      });
      res.json("success");
    });
  });
});

var allowCrossDomain = function(req, res, next) {
    res.header('Access-Control-Allow-Origin', "*");
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    next();
}

app.use(allowCrossDomain);

app.set('port', (process.env.PORT || 3000));
app.listen(app.get('port'), () => {
  console.log('Node app is running on port', app.get('port'));
});