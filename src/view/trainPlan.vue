<template>
	<div class="uploadBox">
		<div class="callBedTable" style="padding-bottom: 0;margin-top: 10px;">
			<div class="query-nav" v-show="!backTop">
				<div class="callBedTableButton">
					<el-button type="primary" @click="openAddBox">新 增</el-button>
					<el-upload
						class="uploadClass"
						action="/web/plan/resolve"
						:on-success="uploadState"
						:before-upload="getFile"
						:show-file-list="false">
						<el-button size="small" type="primary">选择文件</el-button>
					</el-upload>
					<el-button size="small" type="primary" @click="exportExcel">导出</el-button>
					<a style="text-decoration:none;color:#409EFF;" href="/Excel/计划维护.xls" download="计划维护.xls" title="点击下载">excel模板下载</a>
					<a ref="exportDowload"></a>
				</div>
			</div>
			<div class="table">
				<el-table
					ref="singleTable"
					:data="tpList"
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
						label="机务段"
						width="90">
					</el-table-column>
					<el-table-column
						property="bedNo"
						label="铺位号"
						width="">
					</el-table-column>
					<el-table-column
						property="arrivalTrainNo"
						label="到达车次"
						width="">
					</el-table-column>
					<el-table-column
						property="arrivalTrainDt"
						label="到达时刻"
						width="">
					</el-table-column>
					<el-table-column
						property="intervalTime"
						label="到开间隔"
						width="">
					</el-table-column>
					<el-table-column
						property="trainNo"
						label="出发车次"
						width="">
					</el-table-column>
					<el-table-column
						property="remindDt"
						label="叫班时刻"
						width=""
						>
					</el-table-column>
					<el-table-column
						property="trainDt"
						label="开车时刻"
						width="">
					</el-table-column>
					<el-table-column
						property="waitDriveType"
						label="待乘类型"
						width="">
						<template slot-scope="scope">
							<div v-if="scope.row.waitDriveType === 1">机车调休</div>
							<div v-if="scope.row.waitDriveType === 2">机车驻班</div>
							<div v-if="scope.row.waitDriveType === 3">机车继乘</div>
							<div v-if="scope.row.waitDriveType === 4">动车驻班</div>
							<div v-if="scope.row.waitDriveType === 5">动车候班</div>
							<div v-if="scope.row.waitDriveType === 6">动车间休</div>
						</template>
					</el-table-column>
					<el-table-column
						property="ticket1"
						label="餐券"
						width="">
					</el-table-column>
					<el-table-column
						label="操作"
						width="200">
						<template slot-scope="scope">
							<el-button
								size="mini"
								@click="openAddBox(scope.$index, scope.row)">编辑</el-button>
							<el-button
								size="mini"
								type="danger"
								@click="deletTP(scope.row)">删除</el-button>
						</template>
					</el-table-column>
				</el-table>
			</div>
		</div>
		<div class="updateBox train-plan-box">
			<el-dialog title="车次信息：" :visible.sync="addBox" width="40%" :show-close="false">
				<el-form :model="addTpVo">
					<el-form-item label="机务段：" :label-width="formLabelWidth">
						<el-input v-model="addTpVo.ldName"></el-input>
					</el-form-item>
					<el-form-item label="铺位号" :label-width="formLabelWidth">
						<el-input v-model="addTpVo.bedNo" readonly placeholder="点击按钮选择铺位"></el-input>
						<bed-choose @chooseBed="chooseBed" :allChoose="true"></bed-choose>
					</el-form-item>
					<el-form-item label="车次号：" :label-width="formLabelWidth">
						<el-input v-model="addTpVo.trainNo"></el-input>
					</el-form-item>
					<el-form-item label="待乘类型：" :label-width="formLabelWidth">
            <el-select
            v-model="waitDriveType"
            placeholder="请选择"
            :show-close="false">
              <el-option
                v-for="item in tranPlanTypeList"
                :key="item.label + 'key'" 
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
					</el-form-item>
					<el-form-item label="开行时间：" :label-width="formLabelWidth">
						<el-time-picker
							v-model="addTpVo.trainDt"
							value-format="HH:mm"
							placeholder="任意时间点">
						</el-time-picker>
					</el-form-item>
					<el-form-item label="到达车次：" :label-width="formLabelWidth">
						<el-input v-model="addTpVo.arrivalTrainNo"></el-input>
					</el-form-item>
					<el-form-item label="到达时间：" :label-width="formLabelWidth">
						<el-time-picker
							v-model="addTpVo.arrivalTrainDt"
							value-format="HH:mm"
							placeholder="任意时间点">
						</el-time-picker>
					</el-form-item>
					<el-form-item label="到开间隔：" :label-width="formLabelWidth">
						<el-input v-model="addTpVo.intervalTime"></el-input>
					</el-form-item>
					<el-form-item label="叫班时刻：" :label-width="formLabelWidth">
						<el-time-picker
							v-model="addTpVo.remindDt"
							value-format="HH:mm"
							placeholder="任意时间点">
						</el-time-picker>
					</el-form-item>
					<el-form-item label="餐券：" :label-width="formLabelWidth">
						<el-input v-model="addTpVo.ticket1"></el-input>
					</el-form-item>
				</el-form>
				<div slot="footer" class="dialog-footer">
					<el-button @click="closeAddBox">取 消</el-button>
					<el-button type="primary" @click="addBunk">确 定</el-button>
				</div>
			</el-dialog>
		</div>
		<div v-if="uoloadState">
			<train-plan-upload :uploadList="uploadList" @uploadSuccess="uploadSuccess"></train-plan-upload>
		</div>
	</div>
</template>

<script>
	import config from '../public/config'
	import bedChoose from '../components/bedChoose'
	import trainPlanUpload from '../components/trainPlanUpload'
	import FileSaver from 'file-saver'
	import XLSX from 'xlsx'
	export default {
	  name: 'trainPlan',
	  data () {
	  	return {
				addBox: false,
				formLabelWidth: '120px',
				addTpVo: {},
				tpList: [],
				uoloadState: false,
				uploadList: [],
				exportFlag: false,
				tranPlanTypeList: config.tranPlanTypeList,
				tranPlanMap: config.tranPlanMap,
				waitDriveType: ''
	  	}
	  },
	  mounted () {
	  	this.$nextTick(() => {
	      this.getTPList();
	    });
	  },
	  components: {
			bedChoose,
			config,
			trainPlanUpload
		},
		computed: {
			backTop () {
				return this.$store.state.backTop
			}
		},
	  methods: {
			exportExcel () {
				let self = this
				this.axios({
					method: 'get',
					url: '/web/plan/export',
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
					console.log('导出计划维护失败，', error)
				})
			 },
			getFile (file) {
				this.$store.commit('loadingChangeTrue')
				let fileName = file.name.split('.')[1]
				let isXLSX = (fileName === 'xls') || (fileName === 'xlsx')
        if (!isXLSX) {
					this.$message.error('上传的文件只能是 xlsx或xls 格式!');
					this.$store.commit('loadingChangeFalse')
				}
				return isXLSX
			},
			uploadState (response, file) { // 上传成功
				this.$store.commit('loadingChangeFalse')
				if (response.type === 1) {
					this.uoloadState = true
					this.uploadList = response.result
				} else {
					this.$message({
						showClose: true,
						iconClass: 'warning-box-icon-class',
						customClass: 'warning-box-content-class',
						dangerouslyUseHTMLString: true,
						message: response.msg,
						duration: 0
					})
				}
			},
			uploadSuccess () {
				this.uoloadState = false
				this.getTPList()
			},
			closeAddBox () {
				this.$confirm('是否放弃编辑?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
					this.addBox = false
					this.getTPList()
          this.$message({
            type: 'success',
            message: '编辑取消!'
          });
        }).catch(() => {
        });
			},
	  	getTPList () { // 接口14，铺位看板
	  	  let self = this;
	  	  this.axios({
	  	  	method: 'get',
					url: '/web/plan/list',
	  	  	headers: {'appType': 'web','appid': 'logan'}
	  	  })
	  	  .then( (response) => {
					this.$store.commit('loadingChangeFalse')
	  	  	var data = response.data
	  	  	if (data.type == 1) {
	  	  	  self.tpList = data.result.list;
	  	  	} else {
						this.$message.error(data.msg)
					}
	  	  }).catch( (error) => {
	  	  	console.log('车次计划获取失败')
	  	  })
	  	},
			deletTP (bunk) { // 删除铺位看板
				this.$confirm('是否删除该车次?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
					this.axios({
						method: 'get',
						params: {'sid': bunk.sid},
						url: '/web/plan/delete',
						headers: {'appType': 'web','appid': 'logan'}
					})
					.then( (response) => {
						var data = response.data
						if (data.type === 1) {
							this.getTPList()
							this.$message.success('删除成功')
						} else {
							this.$message.error(data.msg)
						}
					}).catch( (error) => {
						console.log('删除失败')
					})
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
			},
			openAddBox (index, tp) {
				this.addBox = true
				if (!tp) {
					this.addTpVo = {
						'trainDt': '',
						'intervalTime': '',
						'arrivalTrainNo': '',
						'arrivalTrainDt': '',
						'remindDt': '',
						'waitDriveType': '',
						'ldName': '',
						'trainNo': '',
						'ticket1': ''
					}
				} else {
					this.addTpVo = tp
					this.waitDriveType = this.tranPlanMap[this.addTpVo.waitDriveType]
				}
			},
			chooseBed (bunk) {
				this.$set(this.addTpVo, 'bedNo', bunk.bedNo)
				this.$set(this.addTpVo, 'bedSid', bunk.bedSid)
			},
			addBunk () { // 新增车次计划
				let url = this.addTpVo.sid ? '/web/plan/update' : '/web/plan/save'
				// if (!this.addTpVo.trainNo) {
				// 	this.$message.error('车次号不能为空')
				// }
				// if (!this.addTpVo.ldName) {
				// 	this.$message.error('机务段不能为空')
				// }
				// if (!this.addTpVo.trainDt) {
				// 	this.$message.error('开行时间不能为空')
				// }
				if (!this.addTpVo.waitDriveType && !this.waitDriveType) {
					this.$message.error('待乘类型不能为空')
				}
				if (this.tranPlanMap[this.addTpVo.waitDriveType] != this.waitDriveType) {
					this.addTpVo.waitDriveType = this.waitDriveType
				}
	  	  this.axios({
	  	  	method: 'post',
					data: this.addTpVo,
					url: url,
	  	  	headers: {'appType': 'web','appid': 'logan'}
	  	  })
	  	  .then( (response) => {
	  	  	var data = response.data
	  	  	if (data.type === 1) {
						this.getTPList()
						this.$message.success('车次计划编辑成功！')
						this.waitDriveType = ''
						this.addBox = false
	  	  	} else {
						this.$message.error(data.msg)
					}
	  	  }).catch( (error) => {
	  	  	console.log('车次计划编辑失败')
	  	  })
	  	}
	  }
	}
</script>

<style>
	.callBedTable {
		width:  100%;
		float: left;
	}
	.callBedTable .query-nav .callBedTableButton {
		float: right;
	  margin-right: 30px;
	}
	.query-nav .el-button{
	  display: inline-block;
	  margin: 20px;
	}
	.table {
		font-size: 16px;
		margin-top: 30px;
	}
	.updateBox.train-plan-box .el-input {
		width: 40%;
	}
	.updateBox.train-plan-box .el-select {
		width: 100% !important;
	}
	.updateBox {
		z-index: 9999;
	}
	.uploadClass {
		display: inline-block;
	}
	.warning-box-icon-class {
		top: 20px;
	}
	.warning-box-content-class {
		background-color: #fef0f0 !important;
		color: #f56c6c;
	}
	.warning-box-content-class .el-message__content{
		line-height: 20px;
	}
	.warning-box-content-class .el-message__closeBtn{
		top: 20px;
	}
	/* element 样式 */
	.el-table--scrollable-x .el-table__body-wrapper {
		overflow-x: hidden;
	}
	
</style>