<template>
  <div class="userRecord">
		<div class="query-nav">
			<date-box radioProp="汇总" @sendDate="receiveDate" dateTitle="日期范围："></date-box>
			<el-button @click="getUserRecordList" type="primary">查 询</el-button>
			<el-button @click="resetRes" type="primary">重 置</el-button>
      <el-button size="small" type="primary" @click="exportExcel">导出</el-button>
      <a ref="exportDowload"></a>
		</div>
    <div class="callBedTable">
      <el-table
        ref="singleTable"
        :data="userRecordList"
        highlight-current-row
        style="width: 80%;"
        :border="true"
        row-dblclick="">
        <el-table-column	
          type="index"
          label="序号"
          width="70">
        </el-table-column>
        <el-table-column
          property="username"
          label="用户"
          width="">
        </el-table-column>
        <el-table-column
          property="operate"
          label="操作权限"
          width="">
        </el-table-column>
        <el-table-column
          property="operatime"
          label="操作时间"
          width="">
        </el-table-column>
        <el-table-column
          property="notes"
          label="备注"
          width="">
        </el-table-column>
      </el-table>
      <paginate :pageVo='pageVo' :pageSize='pageSize' :totalRecs='totalRecs' :currentPage='currentPage' :count='count' @changePage='changePage'></paginate>
		</div>
  </div>
</template>

<script>
import config from '../public/config.vue'
import paginate from '../components/paginate'
import dateBox from "../components/dateBox"
import {mapState} from 'vuex'

export default {
  data () {
    return {
			currentPage: 1,
			count: 0,
			totalRecs: '',
			pageSize: 10,
			pageVo: {
				'prevText': '<<',
				'nextText': '>>'
      },
      userRecordList: [],
      userRecordRes: {},
    }
  },
  computed: {
    ...mapState(['name'])
  },
  mounted () {
    this.$nextTick(() => {
      this.$store.commit('loadingChangeFalse')
      this.getUserRecordList() 
    })
  },
  components: {
		paginate,
    config,
    dateBox,
  },
  methods: {
    exportExcel () {
      let self = this
      this.axios({
        method: 'get',
        url: '/api2/userOperateRecord/export',
        params: ''
      }).then((res) => {
        let data = res.data
        if (data.type === 1) {
          self.$refs.exportDowload.href = '/api2/file?type=trainPlan&fileName=' + data.result.fileName
          self.$refs.exportDowload.download = '/api2/file?type=trainPlan&fileName=' + data.result.fileName
          self.$refs.exportDowload.click()
          this.$message.success('导出成功')
        }else {
          this.$message.error('导出失败' + data.msg)
        }
      }).catch((error) => {
        console.log('导出用户操作记录列表记录失败，', error)
      })
    },
    resetRes() {
			this.userRecordRes = {}
    },
    receiveDate(date) {
      this.userRecordRes.from = date.from
      this.userRecordRes.to = date.to
    },
    getUserRecordList () { 
			this.axios({
				method: 'post',
				url: '/api2/user/list_record', 
				data: this.userRecordRes,
				params: {'pageNo': this.currentPage, 'pageSize': this.pageSize},
				headers: {'appType': 'web','appid': 'logan'}
			})
			.then((response) => {
				var data = response.data
				this.$store.commit('loadingChangeFalse')
				if (data.type == 1) {
					this.userRecordList = data.result.resultList
					this.currentPage = data.result.pageNo // 当前页
					this.count = data.result.totalPages // 总页数
					this.totalRecs = data.result.totalRecs
				}
			}).catch((error) => {
				console.log('用户操作记录列表请求发送失败原因', error)
			})
		},
		changePage (pageNo, pageSize) { // 切换页面
			this.currentPage = pageNo
			this.pageSize = pageSize
			this.getUserRecordList()
    },
  }
}
</script>

<style>
 
  .userRecord .el-input {
		width: 60%;
	}
</style>
