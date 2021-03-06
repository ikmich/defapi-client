<template>
  <div id='api-defs'>
    <div class='page-container'>
      <div class='header' id='apidefsHeader'>
        <div class='left'>
          <SiteTitle v-bind:title='repo.title' />
        </div>
        <div class='middle'>
          <!-- Search -->
          <div class='search-wrapper'>
            <div class='search-box'>
              <div class='search-box-contents'>
                <input id='input-search' class='search' type='text' @keyup='handleSearch' placeholder='Search...' />
                <div class='clear' @click='clearSearch()'>x</div>
              </div>
            </div>

            <div class='search-behaviour'>
              <div class='search-behaviour-input'>
                <input
                  id='checkbox-search-behaviour'
                  type='checkbox'
                  @change='handleSearchBehaviourChange'
                  v-bind:checked='searchBehaviourToggleOn'
                />
                <label for='checkbox-search-behaviour'>Search title and description</label>
              </div>
            </div>
          </div>
        </div>

        <div class='right'>
          <div
            id='download-json--wrapper'
            class='header-action-link--wrapper'
            @click='downloadJson()'
            title='Download full API json manifest'
          >
            <div class='download-json--text text'>Download JSON</div>
            <IconBase icon-color='#707070' class='icon icon-download'>
              <!--578ed6-->
              <IconTrayArrowDown />
            </IconBase>
          </div>

          <div style='width: 6px'></div>

          <div
            id='link--refresh-manifest'
            class='header-action-link--wrapper'
            @click='refreshManifest()'
            title='Refresh the API manifest to get updated data'
          >
            <div class='download-json--text text'>Refresh</div>
            <IconBase icon-color='#707070' class='icon icon-download'>
              <!--578ed6-->
              <RefreshIcon />
            </IconBase>
          </div>
        </div>
      </div>

      <div id='post-header'>
        <div id='sub-header'>
          <div class='highlights'>
            <div class='item highlight-item'>
              <div class='title'>
                <div>Base URI</div>
              </div>
              <div class='value'>
                {{ baseUri }}
              </div>
            </div>

            <div class='separator'></div>

            <!-- Total Endpoints -->
            <div class='item highlight-item'>
              <div class='title'>
                <div>Total Endpoints</div>
              </div>
              <div class='value'>
                {{ endpointsCount }}
              </div>
            </div>

            <div class='separator' v-if='hasApiHeaders'></div>
            <div class='item' v-if='hasApiHeaders'>
              <CodeBox title='Headers' v-bind:code='JSON.stringify(repo.headers, null, 2)' />
            </div>

            <div class='separator' v-if='hasAuthHeaders'></div>
            <div class='item' v-if='hasAuthHeaders'>
              <CodeBox title='Auth Headers' v-bind:code='JSON.stringify(repo.authenticationHeaders, null, 2)' />
            </div>
          </div>
        </div>
        <div class='endpoint-list-wrapper'>
          <div class='search-results-info'>{{ numSearchResults }}</div>
          <EndpointList v-bind:endpoints='endpointsToDisplay' />
        </div>
        <div>
          <PageFooter />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import SiteTitle from '../../SiteTitle';
import EndpointList from '../../endpoints/EndpointList';
import CodeBox from '../../CodeBox';
import { sendEvent } from '../../../helpers/send-event';
import IconBase from '../../icons/IconBase';
import IconTrayArrowDown from '../../icons/IconTrayArrowDown';

import hljs from 'highlight.js';
import 'highlight.js/styles/default.css';
import PageFooter from '../../footer/PageFooter';
import { getBaseUri, isDev } from '../../../utils';
import RefreshIcon from '../../icons/RefreshIcon';

export default {
  name: 'ApiPage',
  components: {
    RefreshIcon,
    PageFooter,
    IconTrayArrowDown,
    IconBase,
    SiteTitle,
    EndpointList,
    CodeBox
  },
  data() {
    return {
      /** @type {ApiManifest | {}} */
      repo: {},
      search: '',
      searchBehaviourToggleOn: false,
      apiName: this.$route.params.source
    };
  },
  computed: {
    /** @type {EndpointDef[]} */
    endpointsToDisplay() {
      const searchInput = (this.search ?? '').trim();
      if (!searchInput || !searchInput.length) {
        return this.repo.endpoints;
      }

      /** @type {EndpointDef[]} */
      let results = [];
      if (Array.isArray(this.repo.endpoints)) {
        for (let endpoint of this.repo.endpoints) {
          let inPath = endpoint.path?.toLowerCase().includes(this.search?.toLowerCase());
          let inTitle = false;
          let inDescription = false;
          if (this.searchBehaviourToggleOn) {
            inTitle = endpoint.title?.toLowerCase().includes(this.search?.toLowerCase());
            inDescription = endpoint.description?.toLowerCase().includes(this.search?.toLowerCase());
          }

          if (inPath || inTitle || inDescription) {
            results.push(endpoint);
          }
        }
      }

      return results;
    },

    numSearchResults() {
      let value = this.endpointsToDisplay?.length ?? 0;
      let word = value > 1 || value === 0 ? 'Results' : 'Result';
      return `${value} ${word}`;
    },

    endpointsCount() {
      return this.repo.endpoints?.length ?? 0;
    },

    baseUri() {
      let value = this.repo?.baseUri;
      if (value && value.trim().length) {
        let rexStartsWithHttp = /^(http)|(https):\/\//;
        if (!rexStartsWithHttp.test(value)) {
          value = `http://${value}`;
        }
      } else {
        value = 'http://0.0.0.0';
      }
      return value;
    },

    hasApiHeaders() {
      return this.repo.headers && Object.keys(this.repo.headers).length > 0;
    },

    hasAuthHeaders() {
      return this.repo.authenticationHeaders && Object.keys(this.repo.authenticationHeaders).length > 0;
    }
  },
  methods: {
    handleSearch(e) {
      this.search = e.target.value;
    },

    handleSearchBehaviourChange(e) {
      this.searchBehaviourToggleOn = e.target.checked;
    },

    clearSearch() {
      const el = document.getElementById('input-search');
      if (el) {
        el.value = '';
        el.focus();
        setTimeout(() => {
          this.search = '';
        }, 200);
      }
    },

    async fetchRepo() {
      let raw = await fetch(`${getBaseUri()}/api/manifests/${this.apiName}`);
      return JSON.parse(await raw.text());
    },

    async refreshManifest() {
      let raw = await fetch(`${getBaseUri()}/api/manifests/${this.apiName}/refresh`, {
        method: 'POST'
      });
      const payload = JSON.parse(await raw.text());
      if (payload) {
        this.repo = payload;
      }
    },

    handleHeaderOffset() {
      const headerElem = document.getElementById('apidefsHeader');
      const headerHeight = headerElem.offsetHeight;
      const postHeaderElem = document.getElementById('post-header');
      postHeaderElem.style.position = 'relative';
      postHeaderElem.style.top = `${headerHeight + 24}px`;
    },

    /**
     * Handles hover visual behaviour for the header nav action buttons/links.
     */
    handleHeaderNavActionsHover() {
      const parentEls = document.getElementsByClassName('header-action-link--wrapper');
      for (let /** @type {HTMLElement} */ parent of parentEls) {
        /** @type {HTMLElement} */
        const elText = parent.querySelector('.text');

        /** @type {HTMLElement} */
        const elIcon = parent.querySelector('.icon');

        parent.onmouseover = function() {
          elText.style.color = 'var(--pathBlue)';
          elIcon.classList.add('bordered');
        };

        parent.onmouseout = function() {
          elText.style.color = 'inherit';
          elIcon.classList.remove('bordered');
        };
      }
    },

    downloadJson() {
      let json = JSON.stringify(this.repo, null, 2);
      let linkElem = document.createElement('a');
      linkElem.setAttribute('href', 'data:text/json;charset=utf-8,' + encodeURIComponent(json));

      let filename = `${this.repo.title.toLowerCase().replace(/\s+/g, '-')}.json`;
      linkElem.setAttribute('download', filename);
      linkElem.style.display = 'none';

      document.body.appendChild(linkElem);
      linkElem.click();

      document.body.removeChild(linkElem);
    }
  },

  mounted() {
    hljs.highlightAll();

    sendEvent('app-mounted');

    this.fetchRepo()
      .then((results) => {
        this.repo = results;
        if (isDev()) {
          console.log('fetched repo::', results);
        }
        // Set site title
        document.querySelector('head title').innerHTML = this.repo.title;
      })
      .catch((e) => {
        console.error('[defapi.ERR] Error fetching data repository::', e);
      });

    this.handleHeaderOffset();
    this.handleHeaderNavActionsHover();
  }
};
</script>

<style scoped>
@import url('apidefs.css');
</style>
