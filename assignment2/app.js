const http = require("http");
const fs = require("fs");
const path = require("path");
const {
	shoeDbPath,
	getAllShoes,
	addShoes,
	updateShoe,
	deleteShoe,
} = require("./functionality");

const HOSTNAME = "localhost";
const PORT = 6000;

let shoeDb = [];

function requestHandler(req, res) {
	if (req.url === "/items" && req.method === "GET") {
		getAllShoes(req, res);
	} else if (req.url === "/items" && req.method === "POST") {
		addShoes(req, res);
	} else if (req.url === "/items" && req.method === "PUT") {
		updateShoe(req, res);
	} else if (req.url === "/items" && req.method === "DELETE") {
		deleteShoe(req, res);
	}
}

const server = http.createServer(requestHandler);

server.listen(PORT, HOSTNAME, () => {
	shoeDb = JSON.parse(fs.readFileSync(shoeDbPath, "utf8"));
	console.log(`Server is listening on ${HOSTNAME}:${PORT}`);
});
