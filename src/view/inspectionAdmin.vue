<template>
	<div class="driver">
		<div class="driver-query-nav query-nav">
			<div class="queryBox">
				<span class="font-size-lg">机务段：</span>
				<el-select
				v-model="insAdminRes.ldName"
				style="margin-left: 20px;width: 255px;"
				placeholder="请选择">
					<el-option
						v-for="item in ldNameList"
						:key="item + 'key'"
						:label="item"
						:value="item">
					</el-option>
				</el-select>
			</div>
			<div class="queryBox">
				<span class="font-size-lg">工号：</span>
				<el-input v-model="insAdminRes.workNoLike"></el-input>
			</div>
			<div class="queryBox">
				<span class="font-size-lg">姓名：</span>
				<el-input v-model="insAdminRes.nameLike"></el-input>
			</div>
			<span>
				<span class="data-query-class font-size-lg">职位：</span>
				<el-select v-model="insAdminRes.gbjb" placeholder="请选择">
					<el-option
						v-for="item in jobList"
						:key="item.value"
						:label="item.label"
						:value="item.value">
					</el-option>
				</el-select>
			</span>
			<el-button @click="getInsAdmin('query')" type="primary" style="margin-left:20px">查 询</el-button>
			<el-button @click="resetRes" type="primary" style="margin-left:20px">重 置</el-button>
			<el-upload
					class="uploadClass"
					action="/api2/cadre/resovle"
					:on-success="uploadState"
					:before-upload="getFile"
					:show-file-list="false">
					<el-button size="small" type="primary">选择文件</el-button>
				</el-upload>
				<el-button size="small" type="primary" @click="exportExcel">导出</el-button>
				<a style="text-decoration:none;color:#409EFF;" href="/Excel/人员管理记录.xls" download="人员管理记录.xls" title="点击下载">excel模板下载</a>
				<a ref="exportDowload"></a>
		</div>
		<div class="callBedTable">
			<el-table
				ref="singleTable"
				:data="insAdminList"
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
					property="ldName"
					label="机务段"
					width="">
				</el-table-column>
				<el-table-column
					property="workNo"
					label="工号"
					width="">
				</el-table-column>
				<el-table-column
					property="name"
					label="姓名"
					width="">
				</el-table-column>
				<el-table-column
					property="gbjb"
					label="职位"
					width="">
				</el-table-column>
				<el-table-column
					label="照片"
					width="100">
					<template slot-scope="scope" v-if="scope.row.fileName">
						<div>
							<el-button type="text" @click="bigPhoto(scope.row.fileName)">查看</el-button>
						</div>
					</template>
				</el-table-column>
				<el-table-column
					property="createdDt"
					label="注册时间"
					width="210">
				</el-table-column>
				<el-table-column
					label="操作"
					width="">	
					<template slot-scope="scope">
						<el-dropdown @command="changeUpdataState">
							<el-button type="primary">
								编辑<i class="el-icon-arrow-down el-icon--right"></i>
							</el-button>
							<el-dropdown-menu slot="dropdown">
								<el-dropdown-item :command="[true, scope.row]">修改信息</el-dropdown-item>
								<el-dropdown-item :command="[false, scope.row]">修改工号</el-dropdown-item>
							</el-dropdown-menu>
						</el-dropdown>
						<el-button type="danger" style="margin-left: 10px;" @click="delInspection(scope.row)">删 除</el-button>
					</template>
				</el-table-column>
			</el-table>
      <paginate :pageVo='pageVo' :pageSize='pageSize' :totalRecs='totalRecs' :currentPage='currentPage' :count='count' @changePage='changePage'></paginate>
		</div>
		<div v-if="updataShow">
			<updata-driver :updataType="updataType" :updataVal="updataVal" @closeUpdataBox="closeUpdataBox" :driverState="false"></updata-driver>
		</div>
		<div v-if="photoShow" class="bigPhoto">
			<big-photo :pictureURL="pictureURL" @closePicture="closePicture"></big-photo>
		</div>
		<div v-if="uoloadState">
			<driver-upload :uploadList="uploadList" @uploadSuccess="uploadSuccess"></driver-upload>
		</div>
	</div>
</template>

<script>
import paginate from '../components/paginate'
import updataDriver from '../components/updataDriver'
import driverUpload from '../components/driverUpload'
import bigPhoto from "../components/bigPhoto"
import {mapState} from 'vuex'

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
			updataShow: false,
			updataType: false,
			insAdminList: [],
			insAdminRes: {},
			updataVal: {},
      pictureURL: "",
			photoShow: false,
			uoloadState: false,
			uploadList: [],
		}
  },
  mounted() {
    this.$nextTick(() => {
			this.getInsAdmin('init')
    })
  },
  components: {
		paginate,
		updataDriver,
		bigPhoto,
		driverUpload
  },
  computed: {
		...mapState(['ldNameList', 'jobList'])
  },
  methods: {
		exportExcel () {
			let self = this
			this.axios({
				method: 'get',
				url: '/api2/cadre/export',	
				params: ''
			}).then((res) => {
				let data = res.data
				if (data.type === 1) {
					self.$refs.exportDowload.href = '/api2/file?type=cadreEntity&fileName=' + data.result.fileName
					self.$refs.exportDowload.download = '/api2/file?type=cadreEntity&fileName=' + data.result.fileName
					self.$refs.exportDowload.click()
					this.$message.success('导出成功')
				}else {
					this.$message.error('导出失败' + data.msg)
				}
			}).catch((error) => {
				console.log('导出人员管理记录失败，', error)
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
			this.getInsAdmin()
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
		changeUpdataState (command) {
      if (command[0]){
				this.updataType = command[0]
			} else {
				this.updataType = command[0]
			}
			this.updataVal = command[1]
			this.updataShow = true
		},
		closeUpdataBox () {
			this.updataShow = false
			this.getInsAdmin()
      this.$store.dispatch('getInspectionList')
		},
		delInspection (val) {
			this.$confirm('是否删除该条信息?', '提示', {
				confirmButtonText: '确定',
				cancelButtonText: '取消',
				type: 'warning'
			}).then(() => {
				this.axios({
					method: 'post',
					url: '/api2/driver/delete',
					data: {sid: val.sid}
				}).then((res) => {
					let data = res.data
					if (data.type === 1) {
						this.$message.success('删除成功')
						this.getInsAdmin()
						this.$store.dispath('getInspectionList')
					} else {
						this.$message.error('删除失败')
						console.log('干部信息删除失败原因', data.msg)
					}
				}).catch((err) => {
					console.log('请求删除干部信息链接失败', err)
				})
			}).catch(() => {
				this.$message({
					type: 'info',
					message: '已取消删除'
				});
			});
		},
		resetRes() {
			this.insAdminRes = {}
		},
		getInsAdmin (state) {
			if (state === 'init' || state === 'query') {
				this.currentPage = 1
			}
			this.axios({
				method: 'get',
				url: '/api2/driver/list-by-page',
				// data: this.insAdminRes,
				params: {'pageNo': this.currentPage, 'pageSize': this.pageSize, 'ldName': this.insAdminRes.ldName ? this.insAdminRes.ldName : '', 'workNoLike': this.insAdminRes.workNoLike ? this.insAdminRes.workNoLike : '', 'nameLike': this.insAdminRes.nameLike ? this.insAdminRes.nameLike : '', 'gbjb': this.insAdminRes.gbjb ? this.insAdminRes.gbjb : '', 'driverType': 2},   // driverType:2,获取全部人员列表
				headers: {'appType': 'web','appid': 'logan'}
			})
			.then((response) => {
				var data = response.data
				this.$store.commit('loadingChangeFalse')
				if (data.type == 1) {
					this.insAdminList = data.result.resultList
					this.currentPage = data.result.pageNo // 当前页
					this.count = data.result.totalPages // 总页数
					this.totalRecs = data.result.totalRecs
				}
			}).catch((error) => {
				console.log('干部管理列表请求发送失败原因', error)
			})
		},
		changePage (pageNo, pageSize) { // 切换页面
			this.currentPage = pageNo
			this.pageSize = pageSize
      // this.resetRes()
			this.getInsAdmin()
		},
  }
}
</script>

<style scoped>
	.queryBox {
		display: inline-block;
		margin-left: 20px;
		width: 310px;
	}
	.dbPhoto {
		width: 60px;
		height: 70px;
		padding: 5px;
		margin: 0 auto;
	}
	.dbPhoto img {
		width: 100%;
		height: 100%;
	}
	.driver .el-input {
		width: 60%;
	}
	.driver {
		margin-top: 10px;
	}
	.uploadClass {
		display: inline-block;
	}
	/* .driver-query-nav {
		padding: 20px;
	} */
</style>