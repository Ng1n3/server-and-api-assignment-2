const http = require("http");
const fs = require("fs");
const path = require("path");

const shoeDbPath = path.join(__dirname, "db", "items.json");
const shoeDb = JSON.parse(fs.readFileSync(shoeDbPath, "utf8"));

function checkError(err) {
	if (err) {
		console.log(err);
		res.writeHead(400);
		res.end("An error Occured");
	}
}

function getAllShoes(req, res) {
	fs.readFile(shoeDbPath, "utf8", (err, data) => {
		checkError(err);
		res.end(data);
	});
}

function addShoes(req, res) {
	const body = [];

	req.on("data", (chunk) => {
		body.push(chunk);
	});

	req.on("end", () => {
		const parsedShoe = Buffer.concat(body).toString(); // conver from buffer to string
		const newShoe = JSON.parse(parsedShoe); // now a JSON

		const lastShoe = shoeDb[shoeDb.length - 1]; // get the last shoes from db.
		const lastShoeId = lastShoe.id;
		newShoe.id = lastShoeId + 1;

		//add a new book to the existing shoe array.
		fs.readFile(shoeDbPath, "utf8", (err, data) => {
			checkError(err);
			res.end(data);

			const oldShoes = JSON.parse(data);
			const allShoes = [...oldShoes, newShoe]; // now on server but not on db

			fs.writeFile(shoeDbPath, JSON.stringify(allShoes), (err) => {
				if (err) {
					console.log(err);
					res.writeHead(500);
					res.end(
						JSON.stringify({
							message: "Internal server error, could not save shoe to database",
						})
					);
				}

				res.end(JSON.stringify(newShoe));
			});
		});
	});
}

function updateShoe(req, res) {
	const body = [];

	req.on("data", (chunk) => {
		body.push(chunk);
	});

	req.on("end", () => {
		const parsedShoe = Buffer.concat(body).toString();
		const newupdate = JSON.parse(parsedShoe);
		const shoeId = newupdate.id;
		console.log(shoeId);

		fs.readFile(shoeDbPath, "utf8", (err, shoes) => {
			checkError(err);
			const shoeObj = JSON.parse(shoes);
			const shoeIndex = shoeObj.findIndex((shoe) => shoe.id === shoeId);

			if (shoeIndex === -1) {
				res.writeHead(404);
				res.end(`Shoe with given id not found in Database`);
				return;
			}
			const updatedShoe = { ...shoeObj[shoeIndex], ...newupdate };
			console.log(updatedShoe);
			shoeObj[shoeIndex] = updatedShoe;

			fs.writeFile(shoeDbPath, JSON.stringify(shoeObj), (err) => {
				if (err) {
					console.log(err);
					res.writeHead(500);
					res.end(
						JSON.stringify({
							message:
								"Internal server error. Unable to write update to database",
						})
					);
				}
				res.writeHead(200);
				res.end("update successfull");
			});
		});
	});
}

function deleteShoe(req, res) {
    const body = [];

    req.on ("data", (chunk) => {
        body.push(chunk);
    });

    req.on("end", () => {
        const parsedShoe = Buffer.concat(body).toString();
        const newUpate = JSON.parse(parsedShoe);
        const shoeId = newUpate.id;

        fs.readFile(shoeDbPath, 'utf8', (err, shoe) => {
            checkError(err);
            const shoeObj = JSON.parse(shoe);

            const shoeIndex = shoeObj.findIndex(shoe => shoe.id === shoeId);

            if(shoeIndex === -1) {
                res.writeHead(404);
                res.end("SHoe with specified Id not found");
                return;
            }

            shoeObj.splice(shoeIndex, 1);
            fs.writeFile(shoeDbPath, JSON.stringify(shoeObj), err => {
                if(err) {
                    console.log(err);
                    res.writeHead(500);
                    res.end(JSON.stringify({
                        message: "internal Server Error. Could not save shoe to database"
                    }))
                }
                res.writeHead(200);
                res.end('deletion successful');
            })
        })
    })
}

module.exports = {
	shoeDbPath,
	getAllShoes,
	addShoes,
	updateShoe,
	deleteShoe,
};
