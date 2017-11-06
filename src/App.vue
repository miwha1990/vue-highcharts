<template>
  <v-app id="inspire">
    <v-navigation-drawer
      persistent
      v-model="drawer"
      enable-resize-watcher
      app
    >
      <v-card-media src="/static/plant.jpg" height="200px">
      </v-card-media>
      <v-subheader></v-subheader>
      <v-list-tile>
        <v-list-tile-content>
          <v-list-tile-sub-title v-html="'Terminal name'"></v-list-tile-sub-title>
          <v-list-tile-title v-html="'WEST'"></v-list-tile-title>
        </v-list-tile-content>
      </v-list-tile>
      <v-list-tile>
        <v-list-tile-content>
          <v-list-tile-sub-title v-html="'Country code'"></v-list-tile-sub-title>
          <v-list-tile-title v-html="'NLD'"></v-list-tile-title>
        </v-list-tile-content>
      </v-list-tile>
    </v-navigation-drawer>
    <v-toolbar color="indigo" dark fixed app>
      <v-toolbar-side-icon @click.stop="drawer = !drawer"></v-toolbar-side-icon>
      <v-toolbar-title>Terminal overview</v-toolbar-title>
    </v-toolbar>
    <main>
      <v-content>
        <v-container fluid fill-height>
          <v-layout
            justify-center
            align-center
            column
          >
            <highcharts :options="openData" style="width:100%" ref="highcharts1"><span>Loading...</span></highcharts>
            <hr>
            <highcharts :options="closeData" style="width:100%" ref="highcharts2"><span>Loading...</span></highcharts>
          </v-layout>
        </v-container>
      </v-content>
    </main>
    <v-footer color="indigo" app>
      <span class="white--text">&copy; 2017</span>
    </v-footer>
  </v-app>
</template>

<script>
export default {
  name: 'app',
  data: () => ({
    fetchDataUrl: 'http://wb-predictivemaintenance-api.prsp7vkew2.eu-central-1.elasticbeanstalk.com/api/TorqueValues',
    drawer: true,
    openData: {
      chart: {
        type: 'column'
      },
      title: {
        text: 'Open',
        align: 'left'
      },
      xAxis: {
        title: {
          text: 'Valve position'
        },
        crosshair: true
      },
      loading: {
        hideDuration: 1000,
        showDuration: 1000
      },
      yAxis: {
        min: 0,
        title: {
          text: 'Required torque (%)'
        }
      },
      plotOptions: {
        series: {
          turboThreshold: 9999,
          stacking: ""
        },
        column: {
          pointPadding: 0.2,
          borderWidth: 0
        },
      },
      series: []
    },
    closeData: {
      chart: {
        type: 'column'
      },
      title: {
        text: 'Closed',
        align: 'left'
      },
      xAxis: {
        title: {
          text: 'Valve position'
        },
        crosshair: true
      },
      loading: {
        hideDuration: 1000,
        showDuration: 1000
      },
      yAxis: {
        min: 0,
        title: {
          text: 'Required torque (%)'
        }
      },
      plotOptions: {
        column: {
          pointPadding: 0.2,
          borderWidth: 0
        },
        series: {
          turboThreshold: 9999,
          stacking: ""
        },
      },
      series: []
    },
  }),
  props: {
    source: String
  },
  methods: {
    fetchData(url) {
      return fetch(url).then(res => res.json())
    },
    sortData(data) {

      const avTorqueClosed = {name: 'Average Torque', data: []};
      const lastTorqueClosed = {name: 'Last Torque', data: []};
      const avTorqueOpen = {name: 'Average Torque', data: []};
      const lastTorqueOpen = {name: 'Last Torque', data: []};
      const closed = [avTorqueClosed, lastTorqueClosed];
      const opened = [avTorqueOpen, lastTorqueOpen];
      data.forEach(el => {
        if (el.Direction === 'Open') {
          avTorqueOpen.data.push({ x: el.Position, y: el.AverageTorque, });
          lastTorqueOpen.data.push({x: el.Position, y: el.LastTorque, });
        } else {
          avTorqueClosed.data.push({ y: el.AverageTorque, x: el.Position});
          lastTorqueClosed.data.push({ y: el.LastTorque, x: el.Position});
        }
      });
      avTorqueClosed.data.sort((a, b) => a.x.toString().localeCompare(b.x.toString()));
      lastTorqueClosed.data.sort((a, b) => a.x.toString().localeCompare(b.x.toString()));
      avTorqueOpen.data.sort((a, b) => a.x.toString().localeCompare(b.x.toString()));
      lastTorqueOpen.data.sort((a, b) => a.x.toString().localeCompare(b.x.toString()));
      this.closeData.series = closed;
      this.openData.series = opened;
      this.$refs.highcharts1.chart.hideLoading();
      this.$refs.highcharts2.chart.hideLoading();
    }
  },
  mounted() {
    this.$refs.highcharts1.chart.showLoading();
    this.$refs.highcharts2.chart.showLoading();
    this.fetchData(this.fetchDataUrl).then(res => this.sortData(res))
  }
}
</script>

<style>
  .layout.justify-center div > div{width: 100% !important;}
  #app {
    font-family: 'Avenir', Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: #2c3e50;
    margin-top: 60px;
  }
</style>
