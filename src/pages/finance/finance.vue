<template>
	<div id="ad-pay" class="wrapper">
		<slide-bar></slide-bar>
		<div class="content">
			<h1>财务数据</h1>
			<div class="earnings-list">
				<div class="earings-item">
					<p class="top">账户余额（元）</p>
					<p class="bottom">{{accountInfo.balance}}</p>
				</div>
				<div class="earings-item border1">
					<p class="top">日预算（元）</p>
					<p class="bottom color1">{{accountInfo.dailybudget}}</p>
				</div>
				<div class="earings-item">
					<p class="top">今日消耗（元）</p>
					<p class="bottom color1">{{todayConsume}}</p>
				</div>
			</div>
			<div class="container" v-loading.body="loading" element-loading-text="拼命加载中">
				<div class="search-bar">
					<div class="search-bar-item width2">
						<el-date-picker v-model="value7" type="daterange" align="right" placeholder="选择日期范围" :picker-options="pickerOptions2">
						</el-date-picker>
					</div>
					<div class="search-bar-item">
						<button @click="search">查询</button>
					</div>
				</div>
				<div class="list-wrapper">
					<div class="t-tit">
						<table class="list">
							<colgroup>
								<!--日期-->
								<col width="30">
								<!--存入-->
								<col width="25">
								<!--支出-->
								<col width="25">
								<!--备注-->
								<col width="30">
								
							</colgroup>
							<thead>
								<tr class="list-tit">
									<th>日期</th>
									<th>存入</th>
									<th>支出</th>
									<th>备注</th>
								</tr>
							</thead>
						</table>
					</div>
					<div class="list-container">
						<table class="list">
							<colgroup>
								<!--日期-->
								<col width="30">
								<!--存入-->
								<col width="25">
								<!--支出-->
								<col width="25">
								<!--备注-->
								<col width="30">
								
							</colgroup>
							<tbody class="list-con">
								<tr v-for="item of list" class="list-con-item">
									<!--日期-->
									<td>{{item.created}}</td>
									<!--存入-->
									<td>{{item.income}}</td>
									<!--支出-->
									<td>{{item.expenditure}}</td>
									<!--备注-->
									<td>{{item.remark}}</td>
								</tr>
							</tbody>
						</table>
					</div>
				</div>
				<div class="page">
					<el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="currentPage3" :page-size="this.pageSize" layout="prev, pager, next, jumper" :total="this.total">
					</el-pagination>
				</div>
			</div>
		</div>

	</div>
</template>

<script>
	import slideBar from "../../components/slidebar.vue";
	import { Util } from '../../lib/util.js';
	export default {
		data() {
			return {
				pickerOptions2: {
					shortcuts: [{
						text: '最近一周',
						onClick(picker) {
							const end = new Date();
							const start = new Date();
							start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
							picker.$emit('pick', [start, end]);
						}
					}, {
						text: '最近一个月',
						onClick(picker) {
							const end = new Date();
							const start = new Date();
							start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
							picker.$emit('pick', [start, end]);
						}
					}, {
						text: '最近三个月',
						onClick(picker) {
							const end = new Date();
							const start = new Date();
							start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
							picker.$emit('pick', [start, end]);
						}
					}]
				},
				value7: '',//开始结束时间
				currentPage3: 1,//默认第几页
				loading: false,//控制loading动画
				pageNum: 1,//页码
				pageSize: 10,//每页数量
				list: [],//列表
				startTime: '',//开始时间毫秒
				endTime: '',//结束时间毫秒
				todayConsume: '',//今日消耗
				total: 1,
				accountInfo: {}
			}
		},
		components: {
			"slide-bar": slideBar
		},
		methods: {
			search(){
				let _start = new Date(this.value7[0]) ||'';
				let _end = new Date(this.value7[1]) ||'';
				if(JSON.stringify(_start) == 'null' || _start.getFullYear() < 2015){
					this.startTime = '';
					this.endTime = '';
				}else{
					this.startTime = _start.getFullYear() + '-' + this.addZero(_start.getMonth()+1) + '-' + this.addZero(_start.getDate());
					this.endTime = _end.getFullYear() + '-' + this.addZero(_end.getMonth()+1) + '-' + this.addZero(_end.getDate());
				};
				this.pageNum = 1;
				this.getList();
			},
			addZero(num){
				if(num < 10){
					return '0' + num;
				}
				return num;
			},
			handleSizeChange(val) {
			},
			handleCurrentChange(val) {
				this.pageNum = val;
				this.getList();
			},
			getList(){
				this.loading = true;
				let that = this;
				this.api.ajax('finance',{
					pageNum: this.pageNum,
					pageSize: this.pageSize,
					startTime: this.startTime,
					endTime: this.endTime,
				},function(res){
					that.loading = false;
					if(res.data.successed){
						that.list = res.data.returnValue.list;
						that.total = res.data.returnValue.total;
						console.log(that.total)
					}else{
						alert(res.data.errorCode)
					}
				},function(){
					that.loading = false;
					Util.myAlert("获取列表失败");
				})
			},
			getTodayConsume(){
				let that = this;
				this.api.ajax('getTodayConsume',{
					pageNum: this.pageNum,
					pageSize: this.pageSize,
					startTime: this.startTime,
					endTime: this.endTime,
				},function(res){
					if(res.data.successed){
						that.todayConsume = res.data.returnValue
					}else{
						that.todayConsume = '无数据';
						alert(res.data.errorCode)
					}
				},function(){
					that.todayConsume = '无数据';
					/*Util.myAlert("获取数据失败");*/
				})
			},
			getAccountInfo(){
				let that = this;
				this.api.ajax('account/getAccountInfo',{},function(res){
					if(res.data.successed){
						that.accountInfo = res.data.returnValue
					}else{
						alert(res.data.errorCode)
					}
				},function(){
					Util.myAlert("获取数据失败");
				})
			},
		},
		created() {
			/*this.$message({
				message: '获取列表成功',
				type: 'success',
				duration: 1500
			});*/
			this.getList();
			this.getTodayConsume();
			this.getAccountInfo()
		}
	}
</script>

<style lang="less">
	#ad-pay {
		.content {
			left: 150px;
			right: 0;
			top: 0;
			bottom: 0;
			padding: 0 12px;
			background: #ebeced;
			h1 {
				height: 65px;
				font-size: 20px;
				color: #333333;
				font-weight: 600;
				line-height: 65px;
			}
		}
		.earnings-list {
			width: 100%;
			height: 104px;
			padding: 23px 0;
			border: 1px solid #dbdbdb;
			background: #f4f4f4;
		}
		.earings-item {
			float: left;
			width: 33.3%;
			height: 100%;
			p {
				text-indent: 20%;
			}
			.top {
				font-size: 16px;
				color: #666666;
				line-height: 14px;
			}
			.bottom {
				font-size: 28px;
				color: #ff740d;
				line-height: 60px;
			}
			.color1 {
				color: #ffaf10;
			}
		}
		.border1 {
			border-left: 1px solid #e0e0e0;
			border-right: 1px solid #e0e0e0;
		}
		.container {
			position: absolute;
			top: 182px;
			bottom: 10px;
			left: 12px;
			right: 12px;
			height: auto;
			padding: 10px 12px 0;
			background: #f4f4f4;
			overflow: hidden;
		}
		.search-bar {
			min-width: 680px;
			height: 41px;
			.width1 {
				width: 160px;
			}
			.width2 {
				width: 232px;
			}
		}
		.search-bar-item {
			float: left;
			padding: 0 10px 0 0;
			button {
				width: 98px;
				height: 30px;
				text-align: center;
				line-height: 30px;
				border: none;
				background: #ff740d;
				color: #FFFFFF;
				cursor: pointer;
			}
			.el-input__inner {
				height: 30px;
			}
		}
		.list-wrapper {
			position: absolute;
			top: 84px;
			bottom: 40px;
			left: 12px;
			right: 12px;
			width: auto;
			height: auto;
			overflow-x: auto;
			background: #fff;
		}
		.list-container {
			position: absolute;
			top: 33px;
			bottom: 0;
			left: 0;
			right: 12px;
			width: 100%;
			min-width: 1130px;
			height: auto;
			overflow-y: scroll;
    		overflow-x: hidden;
			background: #fff;
		}
		table{
			table-layout: fixed;
		}
		.list {
			width: 100%;
			border-collapse: collapse;
			th,
			td {
				padding-left: 10px;
				height: 33px;
				text-align: left;
				border-bottom: 1px solid #f7f7f7;
				font-size: 14px;
				word-wrap:break-word;
			}
			th {
				color: #999999;
				font-weight: 500;
			}
			td {
				color: #666666;
			}
		}
		.t-tit {
			min-width: 1130px;
			padding-right: 19px;
			background: #eaeaea;
		}
		.list-tit {
			background: #eaeaea;
		}
		.list-con-item {
			background-color: #ffffff;
			transition: background-color .25s ease;
		}
		.list-con-item:hover {
			background-color: #d2d2d2;
		}
		.page {
			position: absolute;
			bottom: 0;
			left: 0;
			width: 100%;
			text-align: center;
		}
	}
</style>