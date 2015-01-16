'use strict';

var http = require("http");
var https = require("https");
var fs = require('fs');

var config = JSON.parse(fs.readFileSync('config.json'));

var homepage = fs.readFileSync('main_page.html');
var respage = new String(fs.readFileSync('response_page.html'));

var monthNames = [  "January", "February", "March", "April", "May", "June",
                    "July", "August", "September", "October", "November", "December" ];

var httpsOptions = {
  hostname: "api.imgur.com",
  port: 443,
  method: "GET",
  headers: { "Authorization": "Client-ID " + config.client_id }
};

function processRequest(CakeDayRequest, CakeDayResponse) {
  if (CakeDayRequest.url === "/") {
    CakeDayResponse.writeHead(200, {"Content-Type": "text/html"});
    CakeDayResponse.write(homepage);
    CakeDayResponse.end();
  } else if (CakeDayRequest.url.indexOf("getcakeday?account") != -1) {
    console.log(CakeDayRequest.url.substring(20));
    var account = CakeDayRequest.url.substring(20);
    account = account.replace("\+", "");
    var ApiResData = "";
    httpsOptions.path = "/3/account/" + account;
    var ApiReq = https.request(httpsOptions, function(ApiRes) {
      ApiRes.on('data', function(d) { 
        //console.log("Data received: " + d);
        ApiResData = ApiResData + d; 
      });
      ApiRes.on('end', function() { 
        var ApiResJSON = JSON.parse(ApiResData);
        if(ApiResJSON.success) {
          CakeDayResponse.writeHead(200, {"Content-Type": "text/html"});
          //CakeDayResponse.write(JSON.stringify(ApiResJSON, null, 2));
          var d = new Date(ApiResJSON.data.created * 1000);
          var dd = "";
          dd += d.getDate() + ", ";
          dd += monthNames[d.getMonth()];
          dd += d.getFullYear();
          var intermediateResponse = respage.replace(/:account:/g, account);
          var thisResponse = intermediateResponse.replace(":cakeday:", dd);
          CakeDayResponse.write(thisResponse);
          CakeDayResponse.end();
          console.log("response for " + account + " sent");
        } else {
          CakeDayResponse.writeHead(200, {"Content-Type": "text/html"});
          var intermediateResponse = respage.replace(":account:", "");
          intermediateResponse = intermediateResponse.replace(":account:'s cake day is <b>:cakeday:</b>.", "Sorry, no such user on imgur!");
          CakeDayResponse.write(intermediateResponse);
          CakeDayResponse.end();
          console.log("Invalid account entered");
        }
      });
    });
    ApiReq.end();
    ApiReq.on('error', function(e) {
      console.log("Error: " + e);
      CakeDayResponse.writeHead(500, {"Content-Type": "text/plain"});
      CakeDayResponse.write("500 External Server Error");
      CakeDayResponse.end();
    });
  } else {
    console.log("URL = \"" + CakeDayRequest.url + "\"");
    CakeDayResponse.writeHead(404, {"Content-Type": "text/plain"});
    CakeDayResponse.write("Page Not Found");
    CakeDayResponse.end();
  }
}


var server = http.createServer(processRequest);

server.listen(8000);

console.log("Server running on port 8000");
