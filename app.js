const express = require("express");
const fs = require("fs");
const path = require('path');

const app = express();

// Use handlebars for simple templating
app.set('view engine', 'hbs');

// This will serve files in public statically
app.use(express.static(path.join(__dirname, 'public')));

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
