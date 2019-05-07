<template>
	<div class="data-query">
		<div class="data-query-nav query-nav" :class="{'height2': radio}">
			<date-box @sendDate="receiveDate" @radioChange="radioChange" dateTitle="入住日期范围："></date-box>
			<div class="screen" v-if="radio">
				<span for="workNo" class="data-query-class font-size-lg">工号：</span>
				<div class="data-query-box">
					<el-input v-model="workNo" placeholder="请输入完整工号" id="workNo"></el-input>
				</div>
				<span for="nameLike" class="data-query-class font-size-lg">司机：</span>
				<div class="data-query-box">
					<el-input v-model="nameLike" placeholder="请输入司机姓名" id="nameLike"></el-input>
				</div>
			</div>
			<span v-if="radio">
				<span class="data-query-class font-size-lg">司机响应：</span>
				<el-select v-model="responseSelected" placeholder="请选择">
					<el-option
						v-for="item in resSelectList"
						:key="item.value"
						:label="item.label"
						:value="item.value">
					</el-option>
				</el-select>
			</span>
			<br>
			<span v-if="radio">
				<span class="data-query-class font-size-lg">出发超时：</span>
				<el-select v-model="overInTimeSelected" placeholder="请选择">
					<el-option
						v-for="item in outInTimeSelectList"
						:key="item.value"
						:label="item.label"
						:value="item.value">
					</el-option>
				</el-select>
			</span>
			<span v-if="radio">
				<span class="data-query-class font-size-lg">叫班方式：</span>
				<el-select v-model="remindTypeSelected" placeholder="请选择">
					<el-option
						v-for="item in remindTypeSelectList"
						:key="item.value"
						:label="item.label"
						:value="item.value">
					</el-option>
				</el-select>
			</span>
			<span v-if="radio">
				<span class="data-query-class font-size-lg">离线率：</span>
				<el-select v-model="absentTimeRate" placeholder="请选择">
					<el-option
						v-for="item in OfflineLateList"
						:key="item.value"
						:label="item.label"
						:value="item.value">
					</el-option>
				</el-select>
			</span>
			<span v-if="radio">
				<span class="data-query-class font-size-lg">离手率：</span>
				<el-select v-model="notWearingTimeRate" placeholder="请选择">
					<el-option
						v-for="item in notWearLateList"
						:key="item.value"
						:label="item.label"
						:value="item.value">
					</el-option>
				</el-select>
			</span>
			<el-button @click="getDataInfo('init')" type="primary" style="margin-left:20px">查 询</el-button>
			<el-button size="small" type="primary" @click="exportExcel">导出</el-button>
			<a ref="exportDowload"></a>
			<div class="more cursor" v-if="radio">
				<div @click="changeMore" v-text="more ? '查看更多>>>' : '<<<返回'">
					查看更多>>>
				</div>
			</div>
		</div>
		<div v-show="!radio" class="out-chart-box">
			<b class="pie-chart-title" v-text="`总出勤人数： ${totalNumber}人次`"></b>
			<div class="chart-box">
				<div id="pie1" :option="pie1"></div>
				<div id="pie2" :option="pie2"></div>
				<div id="pie3" :option="pie3"></div>
			</div>
			<div class="chart-box"> 
				<div id="columns1" :option="columns1"></div>
				<div id="columns2" :option="columns2"></div>
			</div>
		</div>
		<div class="callBedTable" v-show="radio" ref="dataTableEle"> 
			<el-table
				:data="completedList"
				highlight-current-row
				style="width: 100%"
				:border="true">
				<el-table-column	
					type="index"
					label="序号"
					width="70">
				</el-table-column>
				<el-table-column
					property="ldName"
					label="单位"
					width="90">
				</el-table-column>
				<el-table-column
					property="trainNo"
					label="车次"
					width="130">
				</el-table-column>
				<el-table-column
					property="bedNo"
					label="铺位号"
					width="100">
				</el-table-column>
				<el-table-column
					label="司机"
					width="130">
					<template slot-scope="scope">
						<div v-if="scope.row.driverName">{{scope.row.driverName}}</div>
						<div v-if="scope.row.driWorkNo">{{scope.row.driWorkNo}}</div>
					</template>
				</el-table-column>
				<el-table-column
					property="startTime"
					label="入住时间"
					width="130">
				</el-table-column>
				<el-table-column
				 	v-if="supportingFaceFeature"
					label="入住照片"
					width="100">
					<template slot-scope="scope">
						<div v-if="scope.row.photoIn">
							<el-button type="text" @click="bigPhoto(scope.row.photoIn)">查看</el-button>
							<!-- <div class="dbPhoto cursor" style="width:75px" @dblclick="bigPhoto(scope.row.photoIn)"> 
								<img :src="'/api2/image?type=driver&fileName=' + scope.row.photoIn" alt="" v-if="scope.row.photoIn" title="双击查看大图">
							</div> -->
						</div>
					</template>
				</el-table-column>
				<el-table-column
					property="trainDt"
					label="开行时间"
					width="130">
				</el-table-column>
				<el-table-column
					property="remindPlanedTime1"
					label="计划叫班"
					width="130">
				</el-table-column>
				<el-table-column
					property="remindRealTime1"
					label="首次响应"
					width="130">
				</el-table-column>
				<el-table-column
					property="remindRealTime2"
					label="二次响应"
					width="130">
				</el-table-column>
				<el-table-column
					property="adminRemindTime"
					label="人工叫班"
					width="130"
				>
					<template slot-scope="scope">
						<div class-name="ellipsis">
							<div v-text="scope.row.adminRemindTime"></div>
							<div v-text="(scope.row.reason1 ? '原因：' + scope.row.reason1 : '') + (scope.row.reason2 ? '原因：' + scope.row.reason2 : '')"></div>
						</div>
					</template>
				</el-table-column>
				<el-table-column
					property="endRealTime"
					label="离寓时间"
					width="130">
				</el-table-column>
				<el-table-column
				 	v-if="supportingFaceFeature"
					label="离寓照片"
					width="100">
					<template slot-scope="scope">
						<div v-if="scope.row.photoOut">
							<el-button type="text" @click="bigPhoto(scope.row.photoOut)">查看</el-button>
							<!-- <div class="dbPhoto cursor" style="width:75px"> 
								<img :src="'/api2/image?type=driver&fileName=' + scope.row.photoOut" alt="" v-if="scope.row.photoOut" title="双击查看大图">
							</div> -->
						</div>
					</template>
				</el-table-column>
				<el-table-column
					property="restTime"
					label="休息时长"
					width="100">
					<template slot-scope="scope">
						<div v-text="scope.row.restTime" :class="{'font-color-red': scope.row.showRedColor}"></div>
					</template>
				</el-table-column>
				<el-table-column label="睡眠时间">
					<el-table-column
						property="deepSleepTimeSum"
						label="深睡"
						width="">
					</el-table-column>
					<el-table-column
						property="shallowSleepTimeSum"
						label="浅睡"
						width="">
					</el-table-column>
					<el-table-column
						property="sleepSeconds"
						label="时长"
						width="">
					</el-table-column>
				</el-table-column>
				<el-table-column label="心率">
					<el-table-column
						property="heartRateMax"
						label="最大值"
						width="">
					</el-table-column>
					<el-table-column
						property="heartRateMin"
						label="最小值"
						width="">
					</el-table-column>
					<el-table-column
						property="heartAverage"
						label="平均值"
						width="">
					</el-table-column>
				</el-table-column>
				<el-table-column label="离手">
					<el-table-column
						property="notWearingTimeSum"
						label="时长"
						width="">
					</el-table-column>
					<el-table-column
						label="离手率"
						width="">
						<template slot-scope="scope">
							<div v-text="`${scope.row.notWearingTimeRate}%`"></div>
						</template>
					</el-table-column>
					<el-table-column
						property="notWearingTimes"
						label="次数"
						width="">
					</el-table-column>
				</el-table-column>
				<el-table-column label="离线">
					<el-table-column
						property="absentTimeSum"
						label="时长"
						width="">
					</el-table-column>
					<el-table-column
						label="离线率"
						width="">
						<template slot-scope="scope">
							<div v-text="`${scope.row.absentTimeRate}%`"></div>
						</template>
					</el-table-column>
					<el-table-column
						property="absentTimes"
						label="次数"
						width="">
					</el-table-column>
				</el-table-column>
				<el-table-column
					property="step"
					label="步数"
					width="">
				</el-table-column>
				<el-table-column
					label="叫班方式"
					width="100">
					<template slot-scope="scope">
						<div v-if="scope.row.remindType === 1">人工叫班</div>
						<div v-if="scope.row.remindType === 2">自动叫班</div>
					</template>
				</el-table-column>
				<el-table-column
					label="超时"
					width="">
					<template slot-scope="scope">
						<div v-if="scope.row.setoutIntime === 1">未超时</div>
						<div v-if="scope.row.setoutIntime === 2">已超时</div>
					</template>
				</el-table-column>
				<el-table-column
					label="响应"
					width="">
					<template slot-scope="scope">
						<div v-if="scope.row.setoutResponse === 1">已响应</div>
						<div v-if="scope.row.setoutResponse === 2">未响应</div>
					</template>
				</el-table-column>
				<el-table-column
					label="离寓方式"
					width="100">
					<template slot-scope="scope">
						<div v-if="scope.row.endOperateType === 11">自助办理</div>
						<div v-if="scope.row.endOperateType === 12">人工办理</div>
					</template>
				</el-table-column>
				<el-table-column
					property="ticket1"
					label="餐券"
					width="70">
				</el-table-column>
				<el-table-column
					label="待乘结果"
					width="200">
					<template slot-scope="scope">
						<div>
							<div class="cursor rest-analysis-class" @dblclick="openDataDetailBox(scope.row, 13)" v-if="scope.row.absentTimes > 0" :title="`司机离线${scope.row.absentTimes}次，离线时长${scope.row.absentTimeSum}分钟`"> 
								<img src="../assets/img/leave.png">
							</div>
							<div class="cursor rest-analysis-class" @dblclick="openDataDetailBox(scope.row, 23)" v-if="scope.row.notWearingTimes > 0 && supportingWearing" :title="`司机离手${scope.row.notWearingTimes}次，离手时长${scope.row.notWearingTimeSum}分钟`"> 
								<img src="../assets/img/hand.png">
							</div>
						</div>
					</template>
				</el-table-column>
			</el-table>
		</div>
		<paginate v-if="radio" :pageVo='pageVo' :pageSize='pageSize' :totalRecs='totalRecs' :currentPage='currentPage' :count='count' @changePage='changePage' :pageSizesLists="pageSizesLists"></paginate>
		<div v-if="photoShow" class="bigPhoto">
			<big-photo :pictureURL="pictureURL" @closePicture="closePicture"></big-photo>
		</div>
    <div>
      <el-dialog title="待乘分析" width="50%" :visible.sync="dataDetailBox" custom-class="remindedDetailClass">
        <div class="content-top">
          <p>
            <label for="" v-text="absentDataLabel"></label>
            <el-table
              :data="absentData"
              style="width: 100%">
              <el-table-column
                prop="startDt"
                label="开始时间"
                width="">
              </el-table-column>
              <el-table-column
                prop="endDt"
                label="结束时间"
                width="">
              </el-table-column>
              <el-table-column
                prop="value"
                label="时长">
              </el-table-column>
            </el-table>
          </p>
        </div>
      </el-dialog>
    </div>
	</div>
</template>

<script>
import config from "../public/config"
import paginate from '../components/paginate'
import dateBox from "../components/dateBox"
import bigPhoto from "../components/bigPhoto"
export default {
  name: "dataQuery",
  data() {
    return {
			currentPage: 1,
			count: 0,
			totalRecs: '',
			pageSize: 200,
			pageSizesLists: [10, 20, 50, 100, 200],
			pageVo: {
				'prevText': '<<',
				'nextText': '>>'
			},
      dateVo: {},
      totalNumber: 0,
			completedList: [],
      pictureURL: "",
			photoShow: false,
			radio: true,
			workNo: '',
			nameLike: '',
			dataDetailBox: false,
			absentData: [],
			absentDataLabel: '',
			more: true,
      resSelectList: config.resSelectList,
      outInTimeSelectList: config.outInTimeSelectList,
      remindTypeSelectList: config.remindTypeSelectList,
      OfflineLateList: config.OfflineLateList,
      notWearLateList: config.notWearLateList,
      responseSelected: '',
      overInTimeSelected: '',
      remindTypeSelected: '',
      absentTimeRate: '',
      notWearingTimeRate: '',
			scrollLeft: 0,
			pie1: {
        chart: {
          type: 'pie',
        },
        title: {
          text: '司机响应率'
        },
        tooltip: {
          pointFormat: '{series.name}: <b>{point.y}</b>',
        },
        plotOptions: {
          pie: {
            showInLegend: false,
            allowPointSelect: true,
            cursor: 'pointer',
            dataLabels: {
              enabled: true,
              formatter: function() {
                //this 为当前的点（扇区）对象，可以通过  console.log(this) 来查看详细信息
                return '<span class="pie-plot-class"> '+ this.point.name +'：' + this.y + '%</span>';
              }
            },
          },
          series: {
            allowPointSelect: true,  // 设置点击事件
            cursor: 'pointer', // 设置click events attached to the series
            point: {
              events: {
                click: this.changeDetail
              }
            }
          }
        },
        credits: {
          enabled: false
        },
        colors: ['#1e38fb','#ccc'],
        series: [{
          type: 'pie',
          size: '80%',
          name: '占比',
          data: []
        }]
      }, 
      pie2: {
        chart: {
          type: 'pie',
        },
        title: {
          text: '出发及时率'
        },
        tooltip: {
          pointFormat: '{series.name}: <b>{point.y}</b>',
        },
        credits: {
          enabled: false
        },
        plotOptions: {
          pie: {
            showInLegend: false,
            allowPointSelect: true,
            cursor: 'pointer',
            dataLabels: {
              enabled: true,
              formatter: function() {
                //this 为当前的点（扇区）对象，可以通过  console.log(this) 来查看详细信息
                return '<span class="pie-plot-class"> '+ this.point.name +'：' + this.y + '%</span>';
              }
            }
          },
          series: {
            allowPointSelect: true,  // 设置点击事件
            cursor: 'pointer', // 设置click events attached to the series
            point: {
              events: {
                click: this.changeDetail
              }
            }
          }
        },
        colors: ['#64d641','#ccc'],
        series: [{
          type: 'pie',
          size: '80%',
          name: '占比',
          data: []
        }]
      },
      pie3: {
        chart: {
          type: 'pie',
        },
        title: {
          text: '人工叫班率'
        },
        tooltip: {
          pointFormat: '{series.name}: <b>{point.y}</b>',
        },
        credits: {
          enabled: false
        },
        plotOptions: {
          pie: {
            showInLegend: false,
            allowPointSelect: true,
            cursor: 'pointer',
            dataLabels: {
              enabled: true,
              formatter: function() {
                //this 为当前的点（扇区）对象，可以通过  console.log(this) 来查看详细信息
                return '<span class="pie-plot-class"> '+ this.point.name +'：' + this.y + '%</span>';
              }
            }
          },
          series: {
            allowPointSelect: true,  // 设置点击事件
            cursor: 'pointer', // 设置click events attached to the series
            point: {
              events: {
                click: this.changeDetail
              }
            }
          }
        },
        colors: ['#f9f565','#ccc'],
        series: [{
          type: 'pie',
          size: '80%',
          name: '占比',
          data: []
        }]
      },
      columns1: {
        chart: {
          type: 'column' // varwide 依赖 varwide.js
        },
        title: {
          text: '离线率占比图'
        },
        xAxis: {
          type: 'category',
          categories: ['0%~30%','31%~60%','61%~100%'],
          title: {
            text: '* 柱子宽度与 离线人数 成正比'
          }
        },
        yAxis: {
          title: {
            text: '人数'
          }
        },
        plotOptions: {
          series: {
            allowPointSelect: true,  // 设置点击事件
            cursor: 'pointer', // 设置click events attached to the series
            events: {
              click: this.changeDetail
            }
          }
        },
        legend: {
          enabled: false
        },
        credits: {
          enabled: false
        },
        series: [{
          name: '离线人数',
          data: [
          ],
          dataLabels: {
            enabled: true,
          },
          tooltip: {
            pointFormat: '离线人数： <b>{point.y}人</b>'
          },
          colorByPoint: true
        }]
      },
      columns2: {
        chart: {
          type: 'column' // varwide 依赖 varwide.js
        },
        title: {
          text: '离手率占比图'
        },
        xAxis: {
          type: 'category',
          categories: ['0%~30%','31%~60%','61%~100%'],
          title: {
            text: '* 柱子宽度与 离手人数 成正比'
          }
        },
        yAxis: {
          title: {
            text: '人数'
          }
        },
        plotOptions: {
          series: {
            allowPointSelect: true,  // 设置点击事件
            cursor: 'pointer', // 设置click events attached to the series
            events: {
              click: this.changeDetail
            }
          }
        },
        legend: {
          enabled: false
        },
        credits: {
          enabled: false
        },
        series: [{
          name: '离手人数',
          data: [
          ],
          dataLabels: {
            enabled: true,
          },
          tooltip: {
            pointFormat: '离手人数： <b>{point.y}人</b>'
          },
          colorByPoint: true
        }]
      },
    }
  },
  mounted() {
    this.$nextTick(() => {
			this.getDataInfo('init')
			document.querySelector('.el-table__body-wrapper').addEventListener('scroll', this.handleScrollDataQuery)
    })
  },
  components: {
		config,
		paginate,
		dateBox,
		bigPhoto
	},
	watch: {

	},
  computed: {
    supportingFaceFeature() {
      return this.$store.state.supportingFaceFeature
		},
    supportingWearing() {
      return this.$store.state.supportingWearing
		}
	},
  methods: {
		exportExcel () {
			let self = this
			this.axios({
				method: 'get',
				url: '/api2/history/export',
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
				console.log('导出待乘记录失败，', error)
			})
		},
		handleScrollDataQuery (state) {
			let scrollLeft = document.querySelector('.el-table__body-wrapper').scrollLeft
			if (scrollLeft >= 238) {
				this.more = false
			} else {
				this.more = true
			}
		},
		openDataDetailBox (val, type) {
			this.dataDetailBox = true
			this.$store.commit('loadingChangeTrue')
			this.axios({
				method: 'get',
				url: '/api2/history/rest-status-events',
				params: {'sid': val.sid, 'type': type}
			}).then((res) => {
				let data = res.data
				this.$store.commit('loadingChangeFalse')
				if (data.type === 1) {
					this.absentData = data.result.resultList
					if (type === 13) {
						this.absentDataLabel = '离线'
					} else if (type === 23) {
						this.absentDataLabel = '离手'
					}
 				} else {
					this.$message.error(data.msg)
				}
			}).catch((err) => {
				console.log('获取司机离线时间请求发送失败', err)
			})
		},
		radioChange (data) {
			if (data === 1) {
				this.radio = true
			} else if (data === 2) {
				this.radio = false
			}
		},
    receiveDate(date) {
      this.dateVo.from = date.from
      this.dateVo.to = date.to
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
		changePage (pageNo, pageSize) { // 切换页面
			this.currentPage = pageNo
			this.pageSize = pageSize
			this.getDataInfo()
		},
		changeMore () {
			this.more = !this.more
			if (this.more) {
				document.querySelector('.el-table__body-wrapper').scrollTo(0, 0)
			} else {
				document.querySelector('.el-table__body-wrapper').scrollTo(10000, 0)
			}
		},
		dateVoReq () {
			if (this.radio) {
				this.dateVo.workNo = this.workNo.trim()
				this.dateVo.nameLike = this.nameLike.trim()	
				this.dateVo.setoutResponse = this.responseSelected
				this.dateVo.setoutIntime = this.overInTimeSelected
				this.dateVo.remindType = this.remindTypeSelected
				this.dateVo.absentTimeRate = this.absentTimeRate
				this.dateVo.notWearingTimeRate = this.notWearingTimeRate
			} else {
				this.dateVo.workNo = ''
				this.dateVo.nameLike = ''
				this.dateVo.setoutResponse = ''
				this.dateVo.setoutIntime = ''
				this.dateVo.remindType = ''
				this.dateVo.absentTimeRate = ''
				this.dateVo.notWearingTimeRate = ''
				this.responseSelected = ''
				this.overInTimeSelected = ''
				this.remindTypeSelected = ''
				this.absentTimeRate = ''
				this.notWearingTimeRate = ''
				this.workNo = ''
				this.nameLike = ''
			}
		},
    getDataInfo(data) {
			this.$store.commit('loadingChangeTrue')
			//接口13,历史查询
			this.dateVoReq()
			let url = this.radio ? '/api2/history/list-by-page' : '/api2/history/summary'
			let params = this.radio ? {'pageNo': data === 'init' ? 1 : this.currentPage, 'pageSize': this.pageSize} : ''
      let self = this
      this.axios({
        method: "post",
        url: url,
				data: this.dateVo,
				params: params,
        headers: { appType: "web", appid: "logan" },
				timeout: 60000
      }).then(response => {
				var data = response.data
				if (data.type == 1) {
					if (self.radio) {
						this.currentPage = data.result.pageNo // 当前页
						this.totalRecs = data.result.totalRecs
						this.count = data.result.totalPages // 总页数
						this.$store.commit('loadingChangeFalse')
						self.completedList = data.result.resultList
					} else {
						this.totalNumber = data.result.servedDriverNum
						this.$store.commit('loadingChangeFalse')
						this.getPieData(data.result.responseRate, 1)
						this.getPieData(data.result.inTimeRate, 2)
						this.getPieData(data.result.remindTypeRate, 3)
						this.getPieData(data.result.absentTimeValue, 4)
						this.getPieData(data.result.notWearingTimeValue, 5)
					}
				} else {
					this.message.error(data.msg)
				}
			}).catch(error => {
				console.log("系统信息获取失败", error)
			})
		},
		getPieData (val, type) {
      if (typeof(val) === 'string') {
        let num = parseInt(val.split('%')[0])
        let num2 = 100 - num
        if (type === 1) {
          this.pie1.series[0].data = [
            ['司机响应率', num],
            ['未响应率', num2]
          ]
          this.Highcharts.chart('pie1', this.pie1)
        } else if (type === 2) {
          this.pie2.series[0].data = [
            ['出发及时率', num],
            ['出发超时率', num2]
          ]
          this.Highcharts.chart('pie2', this.pie2)
        } else if (type === 3) {
          this.pie3.series[0].data = [
            ['人工叫班率', num],
            ['自动叫班率', num2]
          ]
          this.Highcharts.chart('pie3', this.pie3)
        } 
      } else if (typeof(val) === 'object') {
        if (type === 4) {
          console.log('离线率val', val)
          this.columns1.series[0].data = val
          this.Highcharts.chart('columns1', this.columns1)
        } else if (type === 5) {
          this.columns2.series[0].data = val
          this.Highcharts.chart('columns2', this.columns2)
        }
      }
    },
  }
}
</script>

<style>
.data-query-nav {
	padding: 10px 20px;
	position: relative;
}
.data-query .callBedTable {
	margin-top: 20px;
}
.data-query {
	margin-top: 10px;
}
.data-query .data-sumary-h3 span {
  margin-right: 100px;
}

.cursor {
  cursor: pointer;
}
.data-query .screen {
	display: inline-block;
	margin-left: 20px;
}
.data-query .screen .data-query-box{
	display: inline-block;
	margin: 0 20px 0 0px;	
}
.data-query-class {
	display: inline-block;
}
.data-detail-class {
	padding: 20px;
}
.data-detail-class span{
	display: inline-block;
	width: 45%;
}
.data-detail-class .public-title label {
	width: 40%;
}
.rest-analysis-class {
	width: 30px;
	height: 30px;
	display: inline-block;
	margin: 0 10px;
}
.rest-analysis-class img {
	width: 100%;
	height: 100%;	
}
.more {
	position: absolute;
	right: 40px;
	bottom: -37px;
	font-size: 18px;
	color: #72ACE3;
	user-select: none;
}
.height2 {
	height: 150px !important;
}
.out-chart-box {
	padding-top: 20px;
}
.chart-box {
	display: flex;
	flex-wrap: nowrap;
	justify-content: space-around;
	padding-top: 20px;
}
.pie-chart-title {
	font-size: 20px;
	margin-left: 20px;
}
.pie-plot-class {
	font-size: 14px;
}



.data-query .el-table--scrollable-x .el-table__body-wrapper {
	overflow: auto !important;
}
</style>