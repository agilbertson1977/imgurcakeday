var http = require("http");
var https = require("https");
var fs = require('fs');

var config = JSON.parse(fs.readFileSync('config.json'));

var homepage = fs.readFileSync('main_page.html');

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
    var ApiResData = "";
    httpsOptions.path = "/3/account/" + account;
    var ApiReq = https.request(httpsOptions, function(ApiRes) {
      ApiRes.on('data', function(d) { 
        //console.log("Data received: " + d);
        ApiResData = ApiResData + d; 
      });
      ApiRes.on('end', function() { 
        ApiResJSON = JSON.parse(ApiResData);
        CakeDayResponse.writeHead(200, {"Content-Type": "text/plain"});
        //CakeDayResponse.write(JSON.stringify(ApiResJSON, null, 2));
        CakeDayResponse.write("\n\n\n\n");
        var d = new Date(ApiResJSON.data.created * 1000);
        CakeDayResponse.write(d.toString());
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
