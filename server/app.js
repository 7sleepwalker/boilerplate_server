'use strict';

/**
 * Module dependencies.
 */

var express = require('express');
var http = require('http');
const path = require('path');

var app = express();
var server = http.createServer(app);

/* Configuration */
app.set('views', __dirname + '/views');
app.use(express.static(path.resolve(__dirname, '..', 'app/build')));
app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, '..', 'app/build', 'index.html'));
});
app.set('port', 3000);

if (process.env.NODE_ENV === 'development') {
    app.use(express.errorHandler({dumpExceptions: true, showStack: true}));
}

/* Socket.io Communication */
function randomFromArray(_array){;
    var tmpRand = Math.floor((Math.random() * (_array.length)) + 0);
    return (_array[tmpRand]);
}
var io = require('socket.io').listen(server);
var socket = require('./routes/socket.js');
//basic chat funcionality lol

var activeDrawing;
io.sockets.on('connection', socket);

//advanced
io.sockets.on('connection', function(socketTMP) {
    // pick user to draw
    socketTMP.on('chooseArtist', function(data, fn){
        activeDrawing = randomFromArray(data);
        console.log(io.sockets.adapter.rooms["PUNS"]);
        io.sockets.to("PUNS").emit('send:message', {
            user: "",
            text: "NOW DRAWING: " + activeDrawing
        });
        fn(activeDrawing);
    });



});

/* Start server */
server.listen(app.get('port'), function() {
    console.log('Express server listening on port %d in %s mode', app.get('port'), app.get('env'));
});

module.exports = app;
