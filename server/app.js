
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

        var io = require('socket.io').listen(server);
        var socket = require('./routes/socket.js');
        //basic chat funcionality lol

        var activeDrawing;
        io.sockets.on('connection', socket);


        /* Start server */
        server.listen(app.get('port'), function() {
            console.log('Express server listening on port %d in %s mode', app.get('port'), app.get('env'));
        });

        module.exports = app;
