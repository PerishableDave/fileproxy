var http = require('http')
, fs = require('fs')
, transload = require('node-transloadit');

var AUTH_KEY = process.env.AUTH_KEY
	, AUTH_SECRET = process.env.AUTH_SECRET;

var server = http.createServer(function (req, res) {
	console.log(req.headers);
	req.setEncoding('binary');

	var body = '';
	req.on('data', function (chunk) {
		body += chunk;
	});

	req.on('end', function () {
		fs.writeFile('image.jpg', body, {encoding: 'binary'}, function (err) {
			if (err) {
				throw err;
			}

			console.log("Saved file!");

			var client = new transload(AUTH_KEY, AUTH_SECRET);
			client.addFile('image.jpg', 'image.jpg')
			client.send({
				template_id: 'd5bef6e578243604860c6fe198ac0add'
			}, function (res)  {
				console.log('Uploaded!');
			}, function (err) {
				console.log(err);
			});
		})

		res.statusCode = 200;
		res.end();
	});
});

console.log('Starting server.');
server.listen(8080);