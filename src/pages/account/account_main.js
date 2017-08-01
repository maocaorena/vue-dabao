import Vue from 'vue';
import App from './account';
import API from '../../api/API.js';
import '../../assets/css/common.css';
import '../../assets/css/flex.css';
import '../../assets/css/like.css';

import {
	Loading,
	Message,
} from 'element-ui';

Vue.use(Loading.directive)

Vue.prototype.$loading = Loading.service;
Vue.prototype.$message = Message;

const api = new API();
Vue.prototype.api = api;
/* eslint-disable no-new */
new Vue({
	el: '#app',
	API,
	components: {
		App
	}
})