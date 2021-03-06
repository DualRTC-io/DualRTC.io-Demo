'use strict';

var config   = require('./server/config/env')
  , mongoose = require('mongoose')
    , fs = require('fs');


/*<MongoDB 설정>*/
var connectMongoDB = function() {
    // if (config.env === 'development') { }
    /* mongoose.connect(config.db.uri, config.db.options); */
    mongoose.connect('mongodb://localhost:27017/pollDev');
};

mongoose.connection.on('connected', function() {
    console.log('Running Mongoose Version '+mongoose.version + ', ' + Date());
});

// Error Handler
mongoose.connection.on('error', function(err) {
    console.log(err);
});

// Reconnect when Closed
mongoose.connection.on('disconnected', function() {
    console.log('Mongoose Reconnect!!');
    connectMongoDB();
});

connectMongoDB();
/*</MongoDB 설정>*/


console.log('Current Environment: ', config.env);


// Express, Models, Routes
var app = require('./bootstrap')();

// Socket.IO
//var io = require('socket.io')(app.listen(config.port, function() {
//    console.log('Express server listening on port ' + config.port);
//}));

var https = require('https');
var options = {
    key: fs.readFileSync('key/key.pem', 'utf8'),
    cert: fs.readFileSync('key/cert.pem', 'utf8')
};
var securePort = 8080;
var server = https.createServer(options, app).listen(securePort, function () {
    console.log('[+] Set [https] protocol and server running at port #' + securePort);
});

var io = require('socket.io').listen(server, function () {
    console.log('Express server listening on port ' + securePort);
});

require('./server/config/socket.io')(io);