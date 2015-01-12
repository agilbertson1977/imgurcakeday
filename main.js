var http = require("http");
var fs = require('fs');

var config = JSON.parse(fs.readFileSync('config.json'));

var homepage = fs.readFileSync('main_page.html');

function processRequest(request, response) {
  if (request.url === "/") {
    response.writeHead(200, {"Content-Type": "text/html"});
    response.write(homepage);
  } else if (request.url.indexOf("account") != -1) {
    console.log(request.url);
    response.writeHead(200, {"Content-Type": "text/html"});
    response.write(homepage);
  } else {
    console.log("URL = \"" + request.url + "\"");
    response.writeHead(404, {"Content-Type": "text/plain"});
    response.write("Page Not Found");
  }
  response.end();
}


var server = http.createServer(processRequest);

server.listen(8000);

console.log("Server running on port 8000");
