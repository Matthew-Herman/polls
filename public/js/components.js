// Assumptions:
// I assume in a complex app there would be a frontend system for displaying errors, which I do not implement here, though I do keep an error state on the Vue objects "error" property

// Today's poll has id === 1, I assume this info could be gotten in an API request
Vue.component('poll', {
  props: {
    id: Number,
    poll: String,
    title: String,
    date: Number,
    type: String,
    options: Array,
    months: Object
  },
  computed: {
    dateString: function() {
      const dateObj = new Date(this.date*1000);
      return `${dateObj.getDate()} ${this.months[dateObj.getMonth()]} ${dateObj.getFullYear()}`;
    },
    totalvotes: function() {
      let sum = 0;
      for (const option of this.options) {
        sum += option.votes;
      }
      return sum;
    }
  },
  template: `
  <div v-if="id == 1" class="todayPoll">
    <h3>Today's Poll</h3>
    <div class="todayPollContent">
      <div class="todayPollContentText">
        <h3>{{title}} {{dateString}}</h3>
        <div class="buttonContainer">
          <div class="button"
            v-for="(option, index) in options"
            v-bind:class="{buttonOrange: ((index+1)%2)==1, buttonBlue: ((index+1)%2)==0}"
          >
            {{option.label}}
          </div>
        </div>
      </div>
      <div class="todayPollContentGraph">
        <p>content</p>
      </div>
    </div>
    <br>
    <p class="totalVotes">Total number of votes recorded: {{totalvotes}} </p>
    <hr class="pollhr">
    <br>
  </div>
  <div v-else class="regPoll">
    <div class="regPollGraph">
    </div>
    <div class="regPollText">
      <h5>{{dateString}}</h5>
      <h5>{{title}} </h5>
    </div>
  </div>
  `
});

const pollContainer = new Vue({
  el: '#pollContainer',
  data: {
    polls: {},
    error: false,
    months: {
      '0': 'JAN',
      '1': 'FEB',
      '2': 'MAR',
      '3': 'APR',
      '4': 'MAY',
      '5': 'JUN',
      '6': 'JUL',
      '7': 'AUG',
      '8': 'SEP',
      '9': 'OCT',
      '10': 'NOV',
      '11': 'DEC'
    }
  },
  created: function() {
    fetch('/api/getpoll')
      .then(function(response) {
        return response.json();
      })
      .then((responsePolls) => {
        this.polls = responsePolls;
      })
      .catch((err) => {
        this.error = true;
      });
  },
  methods: {
    vote: function (voteSubmission) {

    }
  },
  template: `
  <div class="pollContainer">
    <poll
      v-for="poll in polls"
      v-if="poll.id == 1"
      v-bind:key="poll.id"
      v-bind:id="poll.id"
      v-bind:title="poll.title"
      v-bind:date="poll.publishedDate"
      v-bind:type="poll.answer.type"
      v-bind:options="poll.answer.options"
      v-bind:months="months"
      v-on:vote="vote"
    >
    </poll>
    <div class="regPollContainer">
      <poll
        v-for="poll in polls"
        v-if="poll.id > 1"
        v-bind:key="poll.id"
        v-bind:id="poll.id"
        v-bind:title="poll.title"
        v-bind:date="poll.publishedDate"
        v-bind:type="poll.answer.type"
        v-bind:options="poll.answer.options"
        v-bind:months="months"
        v-on:vote="vote"
      >
      </poll>
    </div>
  </div>`
});

// document.addEventListener("DOMContentLoaded", function() {
//
// });
