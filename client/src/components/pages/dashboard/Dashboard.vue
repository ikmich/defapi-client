<template>
  <div id='dashboardPage'>
    <div id='dashboardHeader'>
      <div class='page-title'>
        <div class=''>
          Defapi Client
        </div>
        <div class='text--version'>v.{{ this.clientVersion }}</div>
      </div>
    </div>
    <div id='dashboardContent'>
      <div class='cards-deck'>
        <div v-for='item in dashboardData.sources' v-bind:key='item.source.name'>
          <router-link :to="{ name: 'apidefs', params: { source: item.source.name } }" class='card-link'>
            <div class='source-card'>
              <div class='box--apiIcon-meta'>
                <IconBase icon-color='#578ed6' width='36' height='36'>
                  <ApiIcon />
                </IconBase>
                <div class='vSep'></div>
                <div class='text--endpointsLength'>
                  <div>{{ item.manifest.endpoints.length }}</div>
                  <div>Endpoints</div>
                </div>
              </div>
              <div class='title'>{{ item.source.label }}</div>
              <!--            <div class='subtext'>Click to view api definitions for {{ item.source.label }}</div>-->
              <div class='text--baseUri'>{{ item.manifest.baseUri }}</div>
            </div>
          </router-link>
        </div>
      </div>
    </div>
    <div id='dashboardFooter'>
      <PageFooter />
    </div>
  </div>
</template>

<script>

import { getBaseUri, getVersion, isDev } from '../../../utils.js';
import IconBase from '../../icons/IconBase';
import ApiIcon from '../../icons/ApiIcon';
import PageFooter from '../../footer/PageFooter';

export default {
  name: 'Dashboard',
  components: { PageFooter, ApiIcon, IconBase },
  props: {},
  data() {
    // noinspection JSValidateTypes
    return {
      /** @type {DefapiSource[]} */
      sources: {},
      /** @type {DashboardData} */
      dashboardData: {},
      clientVersion: getVersion()
    };
  },
  computed: {
    // baseUri() {
    //   return process.env.VUE_APP_SERVER_BASE_URI ?? '';
    // }
  },
  methods: {
    async fetchSources() {
      const raw = await fetch(`${getBaseUri()}/api/sources`);
      this.sources = JSON.parse(await raw.text());

      if (isDev()) {
        console.log('sources', this.sources);
      }
    },
    async fetchDashboardData() {
      const raw = await fetch(`${getBaseUri()}/api/dashboard`);
      this.dashboardData = JSON.parse(await raw.text());

      if (isDev()) {
        console.log('dashboardData', this.dashboardData);
      }
    }
  },
  async mounted() {
    await this.fetchDashboardData();
    await this.fetchSources();
  }
};
</script>

<style scoped>
#dashboardPage {
  height: 100vh;
  display: flex;
  flex-direction: column;
}

#dashboardHeader {
  background-color: #509ee3;
  padding: 24px;
  text-align: left;
}

#dashboardHeader .page-title {
  color: #fff;
  font-weight: 700;
}

#dashboardHeader .page-title .text--version {
  font-size: 11px;
  opacity: 0.9;
}

#dashboardContent {
  flex-grow: 1;
  padding: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
}

.cards-deck {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;

  /*display: inline-grid;
  grid-template-columns: repeat(3, minmax(200px, 1fr));
  grid-auto-flow: row;
  grid-row-end: auto;
  grid-gap: 24px;
  margin: 0 48px 0 48px;*/
}

.card-link {
  color: var(--pathBlue);
  outline: none;
  text-decoration: none;
}

.source-card {
  border: 1px solid #e6e6e6;
  border-radius: 6px;
  font-family: 'Rubik', sans-serif;
  padding: 3rem 4rem;
  margin: 24px;
  display: inline-flex;
  flex-direction: column;
  align-items: center;
}

.source-card:hover {
  border-color: #6b9adc;
}

.source-card > .title {
  font-size: 2.0rem;
}

.source-card > .subtext {
  color: #dc70d7;
  font-size: 12px;
}

.source-card > .text--baseUri {
  color: #70b34f /*dc70d7*/;
  font-size: 12px;
}

.box--apiIcon-meta {
  display: flex;
  align-items: center;
}

.box--apiIcon-meta > .vSep {
  height: 48px;
  width: 1px;
  border-left: 1px solid #f0f0f0;
  margin: 0 8px;
}

.text--endpointsLength {
  color: #dc70d7;
  font-family: Nunito, sans-serif;
  font-size: 13px;
  font-weight: 700;
  text-align: left;
  line-height: 100%;
}
</style>
