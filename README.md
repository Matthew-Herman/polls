To Run:

In terminal, cd to an empty directory:
```
git clone https://github.com/Matthew-Herman/polls.git
cd to polls
npm install
node app.js
```

In a browser on the computer which is running app.js:
navigate to "localhost:3000"

Assumptions:
I represent the polls as an array in the web server memory as no API is provided. I would expect polls to be in a database and there would be an API for updating polls in the database on the frontend.

Because there is no database, for each poll, I add the number of votes for each option as a property on each option in the poll's "options" array

It wasn't in the spec so I simply didn't render the chart if votes = 0.

As I didn't use a CSS preprocessor I didn't check for browser compatibility and insert necessary prefixes. I only tested with the newest version of Chrome.

No spec for tracking session or authentication was provided so I am not properly tracking state, eg. userHasAlreadyVoted, in the clientside state. I would expect this to be stored in session on a real website. Also as there is no system for handling errors I just store state on the Vue component and there is no rendering depending on errors from AJAX calls.

I oversimplified the AJAX calls for the voting as there is no API.

I just used the compiled production vue. I didn't want to complicate this project by building vue or using a CSS preprocessor, so I wrote components and css in the same file for simplicity. On a larger project I would expect to components to be in single file components and a more complex routing system.

Given more time I would also create child components for "detailPost" instead of reusing the components for "todayPost".
