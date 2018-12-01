// Assumptions:
// I assume in a complex app there would be a frontend system for displaying errors, which I do not implement here, though I do keep an error state on the Vue objects "error" property
Vue.component('poll', {
  props: {
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
  <div class="poll">
    <h3>Today's Poll</h3>
    <div class="pollContent">
      <div class="pollContentText">
        <h3>{{title}} {{dateString}}</h3>
        <div class="buttonContainer">
          <div class="button"
            v-for="option in options"
          >
            {{option.label}}
          </div>
        </div>
      </div>
      <div class="pollContentGraph">
        <p>content</p>
      </div>
    </div>
    <p class="totalVotes">Total number of votes recorded: {{totalvotes}} </p>

  </div>`
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
      v-bind:key="poll.id"
      v-bind:title="poll.title"
      v-bind:date="poll.publishedDate"
      v-bind:type="poll.answer.type"
      v-bind:options="poll.answer.options"
      v-bind:months="months"
      v-on:vote="vote"
    >
    </poll>
  </div>`
});

// document.addEventListener("DOMContentLoaded", function() {
//
// });
