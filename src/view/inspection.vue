<template>
  <div class="inspection">
		<div class="data-query-nav query-nav height2">
			<date-box radioProp="汇总" @sendDate="receiveDate" dateTitle="巡检日期范围："></date-box>
			<div class="queryBox" style="marginLeft: 20px;">
				<span class="font-size-lg">工号：</span>
				<el-input v-model="inspectionRes.workNo"></el-input>
			</div>
			<div class="queryBox">
				<span class="font-size-lg">姓名：</span>
				<el-input v-model="inspectionRes.name"></el-input>
			</div>
			<span>
				<span class="data-query-class font-size-lg">职位：</span>
				<el-select v-model="inspectionRes.gbjb" placeholder="请选择">
					<el-option
						v-for="item in jobList"
						:key="item.value"
						:label="item.label"
						:value="item.value">
					</el-option>
				</el-select>
			</span>
      <br>
			<span style="margin-left: 40px;">
				<span class="data-query-class font-size-lg">登记方式：</span>
				<el-select v-model="inspectionRes.checkmanner" placeholder="请选择">
					<el-option
						v-for="item in registerQueryList"
						:key="item.value"
						:label="item.label"
						:value="item.value">
					</el-option>
				</el-select>
			</span>
			<el-button @click="getInspection('query')" type="primary">查 询</el-button>
			<el-button @click="resetRes" type="primary">重 置</el-button>
			<el-button @click="openAddBox" type="primary">手工录入</el-button>
      <el-button size="small" type="primary" @click="exportExcel">导出</el-button>
      <a ref="exportDowload"></a>
		</div>
    <div class="callBedTable">
      <el-table
        ref="singleTable"
        :data="inspectionList"
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
          property=""
          label="姓名"
          width="">
					<template slot-scope="scope">
            <div v-text="scope.row.name + '(' + scope.row.workNo  + ')'"></div>
					</template>
        </el-table-column>
        <el-table-column
          property="gbjb"
          label="职位"
          width="">
        </el-table-column>
        <el-table-column
          property="checkTime"
          label="巡检时间"
          width="200">
        </el-table-column>
        <el-table-column
          property="address"
          label="待乘地点"
          width="">
        </el-table-column>
        <el-table-column
          property="checkmanner"
          label="登记方式"
          width="">
        </el-table-column>
        <el-table-column
          property=""
          label="巡检情况"
          width="">
					<template slot-scope="scope">
            <div v-text="scope.row.checkContent" :title="scope.row.checkContent"></div>
					</template>
        </el-table-column>
        <el-table-column
          property=""
          label="措施"
          width="200">
					<template slot-scope="scope">
            <div class="ellipsis-white ellipsis ellipsis1">
              <div v-text="scope.row.checkMeasure" :title="scope.row.checkMeasure"></div>
            </div>
					</template>
        </el-table-column>
        <el-table-column
					label="巡检照片"
					width="100">
					<template slot-scope="scope" v-if="scope.row.fileName">
						<div>
							<el-button type="text" @click="bigPhoto(scope.row.fileName)">查看</el-button>
							<!-- <div class="dbPhoto cursor" style="width:75px" @dblclick="bigPhoto(scope.row.fileName)"> 
								<img :src="'/api2/image?type=checkRecord&fileName=' + scope.row.fileName" alt="" v-if="scope.row.fileName" title="双击查看大图">
							</div> -->
						</div>
					</template>
				</el-table-column>
      </el-table>
      <paginate :pageVo='pageVo' :pageSize='pageSize' :totalRecs='totalRecs' :currentPage='currentPage' :count='count' @changePage='changePage'></paginate>
		</div>
    <div v-if="photoShow" class="bigPhoto">
			<big-photo :pictureURL="pictureURL" @closePicture="closePicture"></big-photo>
		</div>
    <div v-if="addBox">
      <add-inspection-box :addInspectionVo="addInspectionVo" @closeAddBox="closeAddBox" type="post"></add-inspection-box>  
    </div>
  </div>
</template>

<script>
import config from '../public/config.vue'
import paginate from '../components/paginate'
import dateBox from "../components/dateBox"
import bigPhoto from "../components/bigPhoto"
import addInspectionBox from "../components/addInspectionBox"
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
      inspectionList: [],
      inspectionRes: {},
      registerQueryList: config.registerList,
      pictureURL: "",
      photoShow: false,
      addBox: false,
      addInspectionVo: {},

    }
  },
  computed: {
    ...mapState(['name', 'jobList'])
  },
  mounted () {
    this.$nextTick(() => {
      this.$store.commit('loadingChangeFalse')
      this.getInspection('init')
    })
  },
  components: {
		paginate,
    config,
    dateBox,
    bigPhoto,
    addInspectionBox
  },
  methods: {
    closeAddBox () {
      this.addBox = false
      this.addInspectionVo = {}
      this.getInspection()
    },
    openAddBox () {
      this.addBox = true
      this.addInspectionVo = {
        'checkTime': this.moment().format('YYYY-MM-DD HH:mm:ss'),
      } 
    },
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
        url: '/api2/check/checkRecord/export',
        params: ''
      }).then((res) => {
        let data = res.data
        if (data.type === 1) {
          self.$refs.exportDowload.href = '/api2/file?type=checkRecord&fileName=' + data.result.fileName
          self.$refs.exportDowload.download = '/api2/file?type=checkRecord&fileName=' + data.result.fileName
          self.$refs.exportDowload.click()
          this.$message.success('导出成功')
        }else {
          this.$message.error('导出失败' + data.msg)
        }
      }).catch((error) => {
        console.log('导出待乘巡检失败，', error)
      })
    },
    receiveDate(date) {
      this.inspectionRes.fromTime = date.from
      this.inspectionRes.toTime = date.to
    },
    getInspection (state) { 
			this.inspectionRes.pageNo = (state === 'init' || state === 'query') ? 1 : this.currentPage
			this.inspectionRes.pageSize = this.pageSize
			this.axios({
				method: 'post',
				url: 'api2/check/list',
				data: this.inspectionRes,
				// params: {'pageNo': this.currentPage, 'pageSize': this.pageSize},
				headers: {'appType': 'web','appid': 'logan'}
			})
			.then((response) => {
				var data = response.data
				this.$store.commit('loadingChangeFalse')
				if (data.type == 1) {
					this.inspectionList = data.result.resultList
					this.currentPage = data.result.pageNo // 当前页
					this.count = data.result.totalPages // 总页数
					this.totalRecs = data.result.totalRecs
				}
			}).catch((error) => {
				console.log('待乘巡检列表请求发送失败原因', error)
			})
		},
		changePage (pageNo, pageSize) { // 切换页面
			this.currentPage = pageNo
      this.pageSize = pageSize
      // this.resetRes()
			this.getInspection()
    },
    resetRes() {
			this.inspectionRes = {}
    },
  }
}
</script>

<style scoped>
  .queryBox {
		display: inline-block;
    width: 220px;
	}
  .inspection .el-input {
		width: 60%;
	}
  .ellipsis-white {
    width: 180px;
  }
  /* .addInspectionBox .el-dialog__header {
    width: 37.6%;
  } */
</style>
