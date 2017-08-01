import Vue from 'vue';
import App from './finance';
import API from '../../api/API.js';
import '../../assets/css/common.css';
import '../../assets/css/flex.css';
import '../../assets/css/like.css';

import {
	Pagination,
	Input,
	InputNumber,
	DatePicker,
	TimeSelect,
	TimePicker,
	Loading,
	Message,
} from 'element-ui';

Vue.use(Pagination)
Vue.use(Input)
Vue.use(InputNumber)
Vue.use(DatePicker)
Vue.use(TimeSelect)
Vue.use(TimePicker)
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