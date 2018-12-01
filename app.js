const express = require("express");
const fs = require("fs");
const path = require('path');

const app = express();

// Assumption:
// No spec for tracking session or authentication was provided so
// I store user state, eg. userHasAlreadyVoted, in the clientside state
// I would expect this to be stored in session on a real website

// Use handlebars for simple templating
app.set('view engine', 'hbs');

// This will serve files in public statically
app.use(express.static(path.join(__dirname, 'public')));

/*
  For this assignment I will represent the polls as an array in the
  web server memory. I would expect polls to be in a database and there
  would be an API for updating polls in the database on the frontend

  Because there is no database, for each poll, I'm adding the number of votes for each option as a property on each option in the poll's "options" array
*/
const polls = JSON.parse(fs.readFileSync('./poll.json')).polls;

for (const poll of polls) {
  const options = poll.answer.options;
  for (const option of options) {
    option.votes = 0;
  }
}

app.get('/', function(req, res) {
  return res.render('poll');
});

app.get('/poll', function(req, res) {
  if (req.query && !isNaN(req.query.id)) {
    const pollid = parseInt(req.query.id, 10);
    for (const poll of polls) {
      if (poll.id === pollid) {
        console.log('pollDetailPage');
        console.log(pollid);
        return res.render('pollDetailPage', {'pollroute': pollid});
      }
    }
  }
  return res.status(404).send('404 Cannnot Get ' + req.originalURL);
});

// Returns poll data in jSON
// If no query returns all polls
// If query parameter 'id', returns poll if it is in polls, else 404 response
app.get('/api/getpoll', function(req, res) {
  // there's no api so for simplicity I'm returing whats in polls
  if (req.query && !isNaN(req.query.id)) {
    const pollid = parseInt(req.query.id, 10);
    for (const poll of polls) {
      if (poll.id === pollid) {
        return res.json(poll);
      }
    }
    return res.status(404).json({message: 'Poll not found'});
  }
  return res.json(polls);
});

// This should be a post request but for simplciity I didn't implement it that way
app.get('/api/vote', function(req, res) {
  // there's no api so for simplicity I'm returing whats in polls
  if (req.query && !isNaN(req.query.id) && req.query.optionid) {
    const pollid = parseInt(req.query.id, 10);
    const optionid = parseInt(req.query.optionid, 10);
    for (const poll of polls) {
      if (poll.id === pollid) {
        const options = poll.answer.options;
        for (const option of options) {
          if (option.id === optionid) {
            option.votes += 1;
            console.log(poll.answer.options);
            return res.redirect('/poll?id='+pollid);
          }
        }
      return res.status(404).json({message: 'Poll not found'});
      }
    }
  }
  return res.status(404).json({message: 'Poll not found'});
});

app.listen(3000);
// To run:
//   cd to scmpPolls
//   npm install
//   node app.js
// In a browser on the computer running app.js
//   navigate to "localhost:3000"
