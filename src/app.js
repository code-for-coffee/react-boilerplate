// Server Startup Script
// =====================
// This file is responsible for creating an instance
// of Express as an app and running the server.
//
// In a real life scenario we'd spend a lot more time
// breaking routes out into controllers using .Router()
// and generally DRYing this thing out and optimizing
// it. I only created this backend because the Dronestream
// API is not set uo to accept CORS requests so sending
// AJAX requests directly to their API is not possible given
// the time constraints plus the CORS situation.

// Require dependencies
// --------------------
// Create new app as instance of `express` and
// require any dependencies first.
var express = require('express'),
    app     = express(),
    request = require('superagent');


// Middleware
// ----------
// Set up middleware and settings
app.use(express.static(__dirname + '/public'));


// Routing
// -------
// Set up routes. Normally I'd break these out into
// controllers that are set up as instances of express.Router()
// each in their own separate files.

// GET /
// -----
// Respond with a static HTML file.
app.get('/', function(req, res, next) {
  res.sendFile(__dirname + '/public/index.html');
});


// GET /strikes/
// -------------
// Request all drone strike data and respond
// with an error or array of drone strike objects (both in JSON)
app.get('/strikes/?', function(req, res, next) {
  request.get('http://api.dronestre.am/data')
    .end(function(err, response) {
      if (err)
        res.json({status: 'error', message: 'The request could not be completed', detail: err});
      else
        res.send(response.body); // We use `res.send` instead of `res.json` because response body is already a JSON string
    });
})

var server = app.listen(3000, function() {
  // For some `watch` APIs you must output or return something otherwise
  // the task will hang. This is true in Grunt but I do it in Gulp just in case.
  // Plus, it's nice to have that output in the terminal so you can see if the server
  // restarted when using a watch task.
  console.log('Server started at localhost:' + server.address().port);
});
