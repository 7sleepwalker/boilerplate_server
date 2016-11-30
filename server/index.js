// server/index.js
'use strict';

const app = require('./app');

const PORT = process.env.PORT || 3001;

var io = require('socket.io').listen(app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}!`);
}));

app.use(require('connect-livereload')({
  port: 35729
}));


var secret = 'kittens';

// Initialize a new socket.io application

var presentation = io.on('connection', function (socket) {

	// A new client has come online. Check the secret key and
	// emit a "granted" or "denied" message.

	socket.on('load', function(data){

		socket.emit('access', {
			access: (data.key === secret ? "granted" : "denied")
		});

	});

	// Clients send the 'slide-changed' message whenever they navigate to a new slide.

	socket.on('slide-changed', function(data){

		// Check the secret key again

		if(data.key === secret) {

			// Tell all connected clients to navigate to the new slide

			presentation.emit('navigate', {
				hash: data.hash
			});
		}

	});

});
