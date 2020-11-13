var express = require('express');
var app = express();
var path = require('path');
const https = require('https');
var xml2js  = require('xml2js');
var fs = require('fs');
Stream = require('stream').Transform;



//test URL is http://localhost:3000/test?vn=Energy at Ruben Fixed&to=1
//            http://localhost:3000/test?vn=Eat Out to Help Out&to=5

app.get('/test', async function (req, res) {
  //auth to the tableau server
  var result = await sendAUTH();
  token = result.token;
  siteid = result.siteid;
  console.log("token: ", token);
  console.log("siteid: ", siteid);
  // grab the view info
  console.log("vn : ", req.query.vn);
  console.log("to : ", req.query.to);
  viewname = req.query.vn;
  refreshmins = req.query.to * 1000 * 60;
  //-- loop here and call every refreshmins
  await getTheImage(token,siteid,viewname);
  looping(token,siteid,viewname,refreshmins);
  res.sendFile(path.join(__dirname + '/public/index.html'));
  //end loop here--//
});

async function getTheImage(token,siteid,viewname){
  var result = await getView(token,siteid,viewname);
  var projectid = result.projectid;
  var workbookid = result.workbookid;
  var viewurlname = result.viewurlname;
  var viewid = result.viewid;
  console.log("project id: ", projectid);
  console.log("workbook id: ", workbookid);
  console.log("view id: ", viewid);
  console.log("getting image...");
  await getImage(token,siteid,viewid);
  console.log("...image retrieved");
}

async function looping(token, siteid,viewname,interval){
  setInterval(async () => {
    getTheImage(token,siteid,viewname);
  }, interval);
}

app.get('/display', function (req, res) {
  res.sendFile(path.join(__dirname + '/public/index.html'));
});



app.listen(3000, function () {
  console.log('Example app listening on port 3000!');
});

app.use(express.static(path.join(__dirname, "/public")));


function getImage(token, siteid, viewid) {
    return new Promise((resolve, reject)=>{
      optionspath = encodeURI("/api/3.9/sites/" + siteid + "/views/" + viewid + "/image?maxAge=1&resolution=high");
      var imgdata = new Stream();
      const https = require('https');
      const options = {
        hostname: 'eu-west-1a.online.tableau.com',
        port: 443,
        path: optionspath,
        encoding: 'null',
        method: 'GET',
        headers: {
          'x-tableau-auth': token
        }
      }

      const req = https.get(options, res => {
        res.on('data', function(chunk) {
          imgdata.push(chunk)
        })
        res.on('end', function() {
          // have my img data in imgdata
          // console.log(imgdata);
          fs.writeFileSync('public/img/image.png', imgdata.read());
          resolve()
        })

      })
      req.end()
    })
}

function getView(token, siteid, viewname) {
    return new Promise((resolve, reject)=>{
      optionspath = encodeURI("/api/3.9/sites/" + siteid + "/views?filter=name:eq:" + viewname);
      var xmldata = "";
      const https = require('https');
      const options = {
        hostname: 'eu-west-1a.online.tableau.com',
        port: 443,
        path: optionspath,
        method: 'GET',
        headers: {
          'x-tableau-auth': token
        }
      }

      const req = https.request(options, res => {
        res.on('data', function(chunk) {
          xmldata += chunk;
        })
        res.on('end', function() {
          // have my xml data in xmldata
          var parser = new xml2js.Parser();
          parser.parseString(xmldata, function(err, parsedXml) {
              var workbookid = parsedXml.tsResponse.views[0].view[0].workbook[0].$.id;
              var projectid = parsedXml.tsResponse.views[0].view[0].project[0].$.id;
              var viewurlname = parsedXml.tsResponse.views[0].view[0].$.viewUrlName;
              var viewid = parsedXml.tsResponse.views[0].view[0].$.id;
              resolve ({workbookid:workbookid,projectid:projectid,viewurlname:viewurlname,viewid:viewid})
            });
        })

      })

      req.end()


    })

}

function sendAUTH() {
  console.log("sendAUTH called");
  return new Promise((resolve, reject)=>{
  var xmldata = "";
  var postdata = "<tsRequest><credentials name='@@@username@@@' password='@@@password@@@'><site contentUrl='@@@sitename@@@' /></credentials></tsRequest>";
  var options = {
    hostname: 'eu-west-1a.online.tableau.com',
    port: 443,
    path: '/api/3.9/auth/signin',
    method: 'POST',
    headers: {
      'Content-Type': 'text/json',
      'Content-Length':postdata.length
    }
  }

  const req = https.request(options, res => {
   res.on('data', function(chunk) {
     xmldata += chunk;
   })
   res.on('end', function() {
     // have my xml data in xmldata
     var parser = new xml2js.Parser();
     parser.parseString(xmldata, function(err, parsedXml) {
           var token = parsedXml.tsResponse.credentials[0].$.token;
           var siteid = parsedXml.tsResponse.credentials[0].site[0].$.id;
           resolve ({token:token,siteid:siteid})
       });
   })
 })

 req.write(postdata)
 req.end()

})

}
