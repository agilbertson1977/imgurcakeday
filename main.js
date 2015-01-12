'use strict';

var http = require("http");
var https = require("https");
var fs = require('fs');

var config = JSON.parse(fs.readFileSync('config.json'));

var homepage = fs.readFileSync('main_page.html');
var respage = new String(fs.readFileSync('response_page.html'));

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
        CakeDayResponse.writeHead(200, {"Content-Type": "text/html"});
        //CakeDayResponse.write(JSON.stringify(ApiResJSON, null, 2));
        var d = new Date(ApiResJSON.data.created * 1000);
        var dd = "";
        switch (d.getMonth()) {
          case  0: dd+="Jan "; break;
          case  1: dd+="Feb "; break;
          case  2: dd+="Mar "; break;
          case  3: dd+="Apr "; break;
          case  4: dd+="May "; break;
          case  5: dd+="Jun "; break;
          case  6: dd+="Jul "; break;
          case  7: dd+="Aug "; break;
          case  8: dd+="Sep "; break;
          case  9: dd+="Oct "; break;
          case 10: dd+="Nov "; break;
          case 11: dd+="Dec "; break;
        }
        dd += d.getDate() + ", ";
        dd += d.getFullYear();
        var intermediateResponse = respage.replace(":account:", account);
        intermediateResponse = intermediateResponse.replace(":account:", account);
        var thisResponse = intermediateResponse.replace(":cakeday:", dd);
        CakeDayResponse.write(thisResponse);
        CakeDayResponse.end();
        console.log("response for " + account + " sent");
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
