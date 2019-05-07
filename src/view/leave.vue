<template>
  <div class="leave">
    <div class="query-nav">
      <div class="queryBox" style="marginLeft: 20px;">
        <span class="font-size-lg">工号：</span>
        <el-input v-model="leaveRes.workNo"></el-input>
      </div>
      <div class="queryBox">
        <span class="font-size-lg">姓名：</span>
        <el-input v-model="leaveRes.name"></el-input>
      </div>
      <date-box radioProp="汇总" @sendDate="receiveDate" dateTitle="请假日期范围："></date-box>
      <el-button @click="getLeave('query')" type="primary">查 询</el-button>
      <el-button @click="resetRes" type="primary">重 置</el-button>
      <el-button size="small" type="primary" @click="exportExcel">导出</el-button>
      <a ref="exportDowload"></a>
    </div>
    <div class="callBedTable">
      <el-table
        ref="singleTable"
        :data="leaveList"
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
          property="name"
          label="姓名"
          width="">
        </el-table-column>
        <el-table-column
          property="workNo"
          label="工号"
          width="">
        </el-table-column>
        <el-table-column
          property="lyTime"
          label="请假时间"
          width="130">
        </el-table-column>
        <el-table-column
					label="请假人照片"
					width="">
					<template slot-scope="scope" v-if="scope.row.photoQj">
						<div>
							<el-button type="text" @click="bigPhoto(scope.row.photoQj)">查看</el-button>
							<!-- <div class="dbPhoto cursor" style="width:75px" @dblclick="bigPhoto(scope.row.photoQj)"> 
								<img :src="'/api2/image?type=holiday&fileName=' + scope.row.photoQj" alt="" v-if="scope.row.photoQj" title="双击查看大图">
							</div> -->
						</div>
					</template>
				</el-table-column>
        <el-table-column
          property="yjfhTime"
          label="预计销假时间"
          width="130">
        </el-table-column>
        <el-table-column
          property="hyTime" 
          label="销假时间"
          width="130">
        </el-table-column>
        <el-table-column
					label="销假人照片"
					width="">
					<template slot-scope="scope" v-if="scope.row.photoXj">
						<div>
							<el-button type="text" @click="bigPhoto(scope.row.photoXj)">查看</el-button>
							<!-- <div class="dbPhoto cursor" style="width:75px" @dblclick="bigPhoto(scope.row.photoXj)"> 
								<img :src="'/api2/image?type=holiday&fileName=' + scope.row.photoXj" alt="" v-if="scope.row.photoXj" title="双击查看大图">
							</div> -->
						</div>
					</template>
				</el-table-column>
        <el-table-column
          property="reason"
          label="请假事由"
          width="">
					<template slot-scope="scope">
            <div class="ellipsis ellipsis2">
              <div v-text="scope.row.reason" :title="scope.row.reason"></div>
            </div>
					</template>
        </el-table-column>
        <el-table-column
          property="address"
          label="地点"
          width="">
        </el-table-column>
        <el-table-column
          property="way"
          label="请假方式"
          width="">
        </el-table-column>
        <el-table-column
          property="qjOperator"
          label="请假值班员"
          width="">
        </el-table-column>
        <el-table-column
          property="xjOperator"
          label="销假值班员"
          width="">
        </el-table-column>
      </el-table>
      <paginate :pageVo='pageVo' :pageSize='pageSize' :totalRecs='totalRecs' :currentPage='currentPage' :count='count' @changePage='changePage'></paginate>
		</div>
    <div v-if="photoShow" class="bigPhoto">
			<big-photo :pictureURL="pictureURL" @closePicture="closePicture"></big-photo>
		</div>
  </div>
</template>

<script>
import config from '../public/config.vue'
import paginate from '../components/paginate'
import dateBox from "../components/dateBox"
import bigPhoto from "../components/bigPhoto"
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
      pictureURL: "",
      photoShow: false,
      leaveRes: {},
      leaveList: []
    }
  },
  mounted () {
    this.$nextTick(() => {
      this.$store.commit('loadingChangeFalse')
			this.getLeave('init')
    })
  },
  components: {
	  paginate,
    config,
    dateBox,
    bigPhoto
  },
  methods: {
    bigPhoto(pictureURL) {
      if (!pictureURL) {
        return
      }
      this.photoShow = true
      this.pictureURL = pictureURL
    },
    closePicture() {
      this.photoShow = false
      this.pictureURL = ""
    },
    exportExcel () {
      let self = this
      this.axios({
        method: 'get',
        url: '/api2/driverHolidayRecord/export',
        params: ''
      }).then((res) => {
        let data = res.data
        if (data.type === 1) {
          self.$refs.exportDowload.href = '/api2/file?type=holidayRecord&fileName=' + data.result.fileName
          self.$refs.exportDowload.download = '/api2/file?type=holidayRecord&fileName=' + data.result.fileName
          self.$refs.exportDowload.click()
          this.$message.success('导出成功')
        }else {
          this.$message.error('导出失败' + data.msg)
        }
      }).catch((error) => {
        console.log('导出请销假列表失败，', error)
      })
    },
    receiveDate(date) {
      this.leaveRes.fromTime = date.from
      this.leaveRes.toTime = date.to
    },
    getLeave (state) { 
			this.leaveRes.pageNo = (state === 'init' || state === 'query') ? 1 : this.currentPage
			this.leaveRes.pageSize = this.pageSize
			this.axios({
				method: 'post',
				url: '/api2/driver/holiday_record',
				data: this.leaveRes,
				// params: {'pageNo': this.currentPage, 'pageSize': this.pageSize},
				headers: {'appType': 'web','appid': 'logan'}
			})
			.then((response) => {
				var data = response.data 
				this.$store.commit('loadingChangeFalse')
				if (data.type == 1) {
					this.leaveList = data.result.resultList
					this.currentPage = data.result.pageNo // 当前页
					this.count = data.result.totalPages // 总页数
					this.totalRecs = data.result.totalRecs
				}
			}).catch((error) => {
				console.log('请销假列表请求发送失败原因', error)
			})
		},
		changePage (pageNo, pageSize) { // 切换页面
			this.currentPage = pageNo
			this.pageSize = pageSize
      // this.resetRes()
			this.getLeave()
    },
    resetRes() {
			this.leaveRes = {}
    },
  }
}
</script>

<style>
  
  .leave .el-input {
		width: 60%;
	}
</style>
