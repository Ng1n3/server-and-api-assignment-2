const http = require("http");
const fs = require("fs");

const PORT = 5000;

const server = http.createServer((req, res) => {
	if (req.url === "/index.html") {
		res.writeHead(200, { "Content-Type": "text/html" });
		const html = fs.readFileSync("./index.html");
		res.end(html);
	} else {
		const error = fs.readFileSync("./404.html");
		res.writeHead(404);
		res.end(error);
	}
});

server.listen(PORT, () => {
	console.log(`You are listening on port ${PORT}`);
});
