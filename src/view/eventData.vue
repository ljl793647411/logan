<template>
	<div class="data-query">
		<div class="event-query-nav query-nav">
			<date-box radioProp="明细" @sendDate="receiveDate" dateTitle="日期范围："></date-box>
			<div class="queryBox">
				<span class="font-size-lg">设备事件：</span>
				<el-select
				v-model="eventVo.types"
				multiple
				collapse-tags
				style="margin-left: 20px;width: 470px;"
				placeholder="请选择"
				:filterable="true">
					<el-option
						v-for="item in deviceList"
						:key="item.code"
						:label="item.label + '(' + item.code + ')'"
						:value="item.code">
					</el-option>
				</el-select>
			</div>
			<div class="queryBox">
				<span class="font-size-lg">铺位号：</span>
				<el-select
				v-model="eventVo.bedSids"
				multiple
				collapse-tags
				style="margin-left: 20px;width: 255px;"
				placeholder="请选择"
				:filterable="true">
					<el-option
						v-for="item in bedList"
						:key="item.sid"
						:label="item.no"
						:value="item.sid">
					</el-option>
				</el-select>
			</div>
			<el-button @click="getEventDataInfo('init')" type="primary" style="margin-left:20px">查 询</el-button>
			<el-button @click="resetEventDataInfo" type="primary" style="margin-left:20px">重 置</el-button>
		</div>
		<div class="callBedTable">
			<el-table
				ref="singleTable"
				:data="eventDataList"
				highlight-current-row
				style="width: 100%"
				:border="true">
				<el-table-column	
					type="index"
					label="序号"
					width="70">
				</el-table-column>
				<el-table-column	
					type="driverName"
					label="姓名"
					width="">
				</el-table-column>
				<el-table-column
					property="ldName"
					label="机务段"
					width="90">
				</el-table-column>
				<el-table-column
					property="trainNo"
					label="车次"
					width="">
				</el-table-column>
				<el-table-column
					property="bed"
					label="铺位号"
					width="">
				</el-table-column>
				<el-table-column
					property="timestamp"
					label="发生时间"
					width="">
				</el-table-column>
				<el-table-column
					property="type"
					label="事件类型"
					width="">
				</el-table-column>
				<el-table-column
					property="value"
					label="参数"
					width="">
				</el-table-column>
			</el-table>
      <paginate :pageVo='pageVo' :pageSize='pageSize' :totalRecs='totalRecs' :currentPage='currentPage' :count='count' @changePage='changePage'></paginate>
		</div>
	</div>
</template>

<script>
import config from "../public/config"
import dateBox from '../components/dateBox'
import paginate from '../components/paginate'

export default {
  name: "eventData",
  data() {
    return {
			currentPage: 1,
			count: 0,
			totalRecs: '',
			pageSize: 10,
			pageVo: {
				'prevText': '<<',
				'nextText': '>>'
			},
			eventVo: {
				from: '',
				to: '',
				types: [],
				bedSids: []
			},
			eventDataList: [],
			deviceList: [],
			bedList: []
		}
  },
  mounted() {
    this.$nextTick(() => {
			this.getEventDataInfo('init')
			this.getEventList()
    })
  },
  components: {
		config,
		paginate,
		dateBox
  },
  computed: {
  },
  methods: {
	 getEventDataInfo (state) { // 获取设备事件列表
			this.$store.commit('loadingChangeTrue')
 			this.axios({
				method: 'post',
				url: '/api2/event/list',
				data: this.eventVo,
				params: {'pageNo': state === 'init' ? 1 : this.currentPage, 'pageSize': this.pageSize},
				headers: {'appType': 'web','appid': 'logan'}
			}).then( (response) => {
				this.$store.commit('loadingChangeFalse')
				var data = response.data
				if (data.type == 1) {
					this.eventDataList = data.result.resultList
					this.currentPage = data.result.pageNo // 当前页
					this.count = data.result.totalPages // 总页数
					this.totalRecs = data.result.totalRecs
				} else {
					this.$message.error(data.msg)
				}
			}).catch( (error) => {
				console.log('系统信息获取失败')
			})
		},
		receiveDate (date) {
			this.eventVo.from = date.from
			this.eventVo.to = date.to
		},
		changePage (pageNo, pageSize) { // 切换页面
			this.currentPage = pageNo
			this.pageSize = pageSize
			this.getEventDataInfo()
		},
		getEventList () {
			this.axios({
				method: 'get',
				url: '/api2/event/list/filters',
				timeout: 60000
			}).then((res) => {
				this.$store.commit('loadingChangeFalse')
				let data = res.data
				if (data.type === 1) {
					this.deviceList = data.result.types
					this.bedList = data.result.beds
				} else {
					this.$message.error(data.msg)
				}
			}).catch((err) => {
				console.log('请求设备事件列表失败：', err)
			})
		},
		resetEventDataInfo () {
			this.eventVo = {}
			this.types = []
			this.bedSids = []
		}
  }
}
</script>

<style scoped>
	.queryBox {
		display: inline-block;
		margin-left: 20px;
	}
	.data-query {
		margin-top: 10px;
	}
	.event-query-nav {
		padding: 10px 20px;
	}
	.queryBox .el-select__tags {
		max-width: 240px !important;
	}
	
</style>