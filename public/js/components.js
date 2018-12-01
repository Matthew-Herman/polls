// Assumptions:
// I assume in a complex app there would be a frontend system for displaying errors, which I do not implement here, though I do keep an error state on the Vue objects "error" property

// Today's poll has id === 1, I assume this info could be gotten in an API request
Vue.component('poll', {
  props: {
    isdetail: String,
    id: Number,
    poll: String,
    title: String,
    date: Number,
    type: String,
    options: Array,
    months: Object,
    days: Object
  },
  computed: {
    dateStringDetail: function() {
      const dateObj = new Date(this.date*1000);
      return `${this.days[dateObj.getDay()]}, ${dateObj.getDate()} ${this.months[dateObj.getMonth()]}, ${dateObj.getFullYear()}, ${dateObj.getHours()}:${dateObj.getSeconds()}`;
    },
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
  <div v-if="id == 1 && !isdetail" class="todayPoll">
    <h3>Today's Poll</h3>
    <div class="todayPollContent">
      <div class="todayPollContentText">
        <h3><a class="noStyleLink" v-bind:href="'/poll?id='+id">{{title}}</a> {{dateString}}</h3>
        <div class="buttonContainer">
          <div class="button"
            v-for="(option, index) in options"
            v-bind:class="{buttonOrange: ((index+1)%2)==1, buttonBlue: ((index+1)%2)==0}"
          >
            <a class="noStyleLink" v-bind:href="'/poll?id='+id">{{option.label}}</a>
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
  <div v-else-if="!isdetail" v-else class="regPoll">
    <div class="regPollGraph">
    </div>
    <div class="regPollText">
      <h5>{{dateString}}</h5>
      <h5><a class="noStyleLink" v-bind:href="'/poll?id='+id">{{title}}</a> </h5>
    </div>
  </div>
  `
});

Vue.component('detailPoll', {
  props: {
    isdetail: String,
    id: Number,
    poll: String,
    title: String,
    date: Number,
    type: String,
    options: Array,
    months: Object,
    days: Object
  },
  computed: {
    dateStringDetail: function() {
      const dateObj = new Date(this.date*1000);
      return `${this.days[dateObj.getDay()]}, ${dateObj.getDate()} ${this.months[dateObj.getMonth()]}, ${dateObj.getFullYear()}, ${dateObj.getHours()}:${dateObj.getSeconds()}`;
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
  <div v-if="isdetail" class="detailPoll">
    <div class="detailPollTitle">
      <h1>{{title}}</h1>
      <hr class="pollhr">
      <p style="text-align: right;">{{dateStringDetail}}</p>
      <br>
    </div>
    <div class="todayPollContent detailPollContent">
      <div class="todayPollContentText">

        <div class="buttonContainer">
          <div class="button"
            v-for="(option, index) in options"
            v-bind:class="{buttonOrange: ((index+1)%2)==1, buttonBlue: ((index+1)%2)==0}"
          >
            <a class="noStyleLink" v-bind:href="'/api/vote?id='+id+'&optionid='+option.id">{{option.label}}</a>
          </div>
        </div>
      </div>
      <div class="todayPollContentGraph">

        <chart
          v-bind:id="id"
          v-bind:options="options"
        >
        </chart>
      </div>
    </div>
    <p class="totalVotes">Total number of votes recorded: {{totalvotes}} </p>
    <br>
  </div>
  `
});


Vue.component('chart', {
  props: {
    id: Number,
    options: Array
  },
  data: function () {
    return {
      chart: {}
    };
  },
  computed: {
    getLabels: function() {

    }
  },
  mounted: function() {
    const myChart = document.getElementById(this.id).getContext('2d');
    console.log(myChart);
    // Uses chartjs

    const labels = [];
    const data = [];
    const colors = [];
    for (const option of this.options) {
      labels.push(option.label);
      data.push(option.votes);
    }

    for (let i = 1; i <= data.length; i++) {
      if (i%2 === 0) {
        colors.push('rgb(0, 51, 204)');
      } else {
        colors.push('rgb(255, 153, 51)');
      }
    }
    //#ff9900;
    //#0000b3;


    this.chart = new Chart(myChart, {
      type: 'doughnut',
        // The data for our dataset
      data: {
        labels: labels,
        datasets: [{
          // label: "My First dataset",
          backgroundColor: colors,
          borderColor: 'rgb(255, 255, 255)',
          data: data,
        }]
      },
      // Configuration options go here
      options: {
        cutoutPercentage: 40,
        rotation: 0.5*Math.PI,
        legend: {
          display: false
        },
        tooltips: {
          callbacks: {
            label: function(tooltipItem, data) {
              const dataset = data.datasets[tooltipItem.datasetIndex];
              const total = dataset.data.reduce(function(previousValue, currentValue, currentIndex, array) {
                return previousValue + currentValue;
              });
              const currentValue = dataset.data[tooltipItem.index];
              const percentage = Math.floor(((currentValue/total) * 100)+0.5);
              return percentage + "%";
            }
          }
        }
      }
    });
  },
  template:`
    <canvas v-bind:id="id"></canvas>
  `
});

const pollContainer = new Vue({
  el: '#pollContainer',
  data: {
    isdetail: "",
    polls: [],
    error: false,
    months: {
      '0': 'Jan',
      '1': 'Feb',
      '2': 'Mar',
      '3': 'Apr',
      '4': 'May',
      '5': 'Jun',
      '6': 'Jul',
      '7': 'Aaug',
      '8': 'Sep',
      '9': 'Oct',
      '10': 'Nov',
      '11': 'Dec'
    },
    days: {
      '0': 'Monday',
      '1': 'Tuesday',
      '2': 'Wednesday',
      '3': 'Thursday',
      '4': 'Friday',
      '5': 'Saturday',
      '6': 'Sunday'
    }
  },
  beforeMount: function() {
    // Taking state from html, assumed to be served by backend routing system
    this.isdetail = this.$el.getAttribute('data-isdetail');
    const query = this.isdetail ? '?id='+this.isdetail : '';
    if (query) {
      console.log(query);
      fetch('/api/getpoll' + query)
        .then(function(response) {
          return response.json();
        })
        .then((responsePoll) => {
          this.polls.push(responsePoll);
        })
        .catch((err) => {
          this.error = true;
        });
    }
    else {
      fetch('/api/getpoll')
        .then(function(response) {
          return response.json();
        })
        .then((responsePolls) => {
          this.polls = responsePolls;
          console.log(this.polls);
        })
        .catch((err) => {
          this.error = true;
        });
    }

  },
  template: `
  <div class="pollContainer">
    <detailPoll
      v-for="poll in polls"
      v-if="isdetail"
      v-bind:isdetail="isdetail"
      v-bind:key="poll.id"
      v-bind:id="poll.id"
      v-bind:title="poll.title"
      v-bind:date="poll.publishedDate"
      v-bind:type="poll.answer.type"
      v-bind:options="poll.answer.options"
      v-bind:months="months"
      v-bind:days="days"
    >
    </detailPoll>
    <poll
      v-for="poll in polls"
      v-if="poll.id == 1 && !isdetail"
      v-bind:isdetail="isdetail"
      v-bind:key="poll.id"
      v-bind:id="poll.id"
      v-bind:title="poll.title"
      v-bind:date="poll.publishedDate"
      v-bind:type="poll.answer.type"
      v-bind:options="poll.answer.options"
      v-bind:months="months"
      v-bind:days="days"
    >
    </poll>
    <div v-if="!isdetail" class="regPollContainer">
      <poll
        v-for="poll in polls"
        v-if="poll.id > 1 && !isdetail"
        v-bind:key="poll.id"
        v-bind:id="poll.id"
        v-bind:title="poll.title"
        v-bind:date="poll.publishedDate"
        v-bind:type="poll.answer.type"
        v-bind:options="poll.answer.options"
        v-bind:months="months"
        v-bind:days="days"
      >
      </poll>
    </div>
  </div>`
});

// document.addEventListener("DOMContentLoaded", function() {
//
// });
