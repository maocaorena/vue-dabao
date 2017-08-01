<template>
	<div id="ad-data" class="wrapper">
		<slide-bar></slide-bar>
		<div class="content">
			<h1>广告数据</h1>
			<div class="container" v-loading.body="loading" element-loading-text="拼命加载中">
				<div class="search-bar">
					<div class="search-bar-item width1">
						<el-input v-model="adName" placeholder="广告计划名称"></el-input>
					</div>
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
								<!--广告ID-->
								<col width="12">
								<!--广告名称-->
								<col width="30">
								<!--单价-->
								<col width="12">
								<!--日预算-->
								<col width="12">
								<!--曝光量-->
								<col width="12">
								<!--点击量-->
								<col width="12">
								<!--点击率-->
								<col width="12">
								<!--点击均价-->
								<col width="12">
								<!--消耗-->
								<col width="12">
							</colgroup>
							<thead>
								<tr class="list-tit">
									<th>广告ID</th>
									<th>广告名称</th>
									<th>单价</th>
									<th>日预算</th>
									<th>曝光量</th>
									<th>点击量</th>
									<th>点击率</th>
									<th>点击均价</th>
									<th>消耗</th>
								</tr>
							</thead>
						</table>
					</div>
					<div class="list-container">
						<table class="list">
							<colgroup>
								<!--广告ID-->
								<col width="12">
								<!--广告名称-->
								<col width="30">
								<!--单价-->
								<col width="12">
								<!--日预算-->
								<col width="12">
								<!--曝光量-->
								<col width="12">
								<!--点击量-->
								<col width="12">
								<!--点击率-->
								<col width="12">
								<!--点击均价-->
								<col width="12">
								<!--消耗-->
								<col width="12">
							</colgroup>
							<tbody class="list-con">
								<tr v-for="item of list" class="list-con-item">
									<!--广告ID-->
									<td>{{item.adId}}</td>
									<!--广告名称-->
									<td>{{item.adName}}</td>
									<!--单价-->
									<td>{{item.price}}</td>
									<!--日预算-->
									<td>{{item.dailyBudget}}</td>
									<!--曝光量-->
									<td>{{item.exposure}}</td>
									<!--点击量-->
									<td>{{item.clicks}}</td>
									<!--点击率-->
									<td>{{item.clickRate}}</td>
									<!--点击均价-->
									<td>{{item.clickAveragePrice}}</td>
									<!--消耗-->
									<td>{{item.consume}}</td>
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
				adName: '',
				value7: '',//开始结束时间
				currentPage3: 1,//默认第几页
				loading: false,//控制loading动画
				pageNum: 1,//页码
				pageSize: 10,//每页数量
				list: [],//列表
				startTime: '',//开始时间毫秒
				endTime: '',//结束时间毫秒
				total: 1,
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
					console.log(this.startTime,this.endTime)
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
				this.api.ajax('getAdDataList',{
					pageNum: this.pageNum,
					pageSize: this.pageSize,
					startTime: this.startTime,
					endTime: this.endTime,
					adName: this.adName,
				},function(res){
					that.loading = false;
					if(res.data.successed){
						that.list = res.data.returnValue.list;
						that.total = res.data.returnValue.total;
					}else{
						alert(res.data.errorCode)
					}
				},function(){
					that.loading = false;
					Util.myAlert("获取数据失败");
				})
			}
			
		},
		created() {
			this.getList();
		}
	}
</script>

<style lang="less">
	#ad-data {
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
		.container {
			position: absolute;
			top: 66px;
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
			padding: 0 10px;
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
		.list-wrapper{
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
			padding-right: 16px;
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
				padding-left: 5px;
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
		.t-tit{
			min-width: 1130px;
			padding-right: 34px;
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