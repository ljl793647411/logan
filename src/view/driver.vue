<template>
	<div class="driver">
		<div class="driver-query-nav query-nav">
			<div class="queryBox">
				<span class="font-size-lg">机务段：</span>
				<el-select
				v-model="driverRes.ldName"
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
				<el-input v-model="driverRes.workNoLike"></el-input>
			</div>
			<div class="queryBox">
				<span class="font-size-lg">姓名：</span>
				<el-input v-model="driverRes.nameLike"></el-input>
			</div>
			<el-button @click="gerDriver('query')" type="primary" style="margin-left:20px">查 询</el-button>
			<el-button @click="resetDriverRes" type="primary" style="margin-left:20px">重 置</el-button>
			<el-button @click="initDriverList" type="primary" style="margin-left:20px" title="初始化司机列表">初始化</el-button>
		</div>
		<div class="callBedTable">
			<el-table	
				ref="singleTable"
				:data="driverList"
				highlight-current-row
				style="width: 60%;"
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
					width="110">
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
					label="照片"
					width="100">
					<template slot-scope="scope" v-if="scope.row.fileName">
						<div>
							<el-button type="text" @click="bigPhoto(scope.row.fileName)">查看</el-button>
							<!-- <div class="dbPhoto cursor" style="width:75px" @dblclick="bigPhoto(scope.row.fileName)"> 
								<img :src="'/api2/image?type=driver&fileName=' + scope.row.fileName" alt="" v-if="scope.row.fileName" title="双击查看大图">
							</div> -->
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
						<el-button type="danger" style="margin-left: 10px;" @click="delDri(scope.row)">删 除</el-button>
					</template>
				</el-table-column>
			</el-table>
      <paginate :pageVo='pageVo' :pageSize='pageSize' :totalRecs='totalRecs' :currentPage='currentPage' :count='count' @changePage='changePage'></paginate>
		</div>
		<div v-if="updataShow">
			<updata-driver :updataType="updataType" :updataVal="updataVal" @closeUpdataBox="closeUpdataBox" :driverState="true"></updata-driver>
		</div>
		<div v-if="photoShow" class="bigPhoto">
			<big-photo :pictureURL="pictureURL" @closePicture="closePicture"></big-photo>
		</div>
	</div>
</template>

<script>
import paginate from '../components/paginate'
import updataDriver from '../components/updataDriver'
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
			driverList: [],
			driverRes: {},
			updataVal: {},
      pictureURL: "",
      photoShow: false,
		}
  },
  mounted() {
    this.$nextTick(() => {
			this.gerDriver('init')
    })
  },
  components: {
		paginate,
		updataDriver,
		bigPhoto
  },
  computed: {
		...mapState(['ldNameList'])
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
			this.gerDriver()
			this.$store.dispatch('getAllDriverList')
		},
		delDri (dri) {
			this.$confirm('是否删除该条司机?', '提示', {
				confirmButtonText: '确定',
				cancelButtonText: '取消',
				type: 'warning'
			}).then(() => {
				this.axios({
					method: 'get',
					url: '/api2/driver/delete',
					params: {sid: dri.sid}
				}).then((res) => {
					let data = res.data
					if (data.type === 1) {
						this.$message.success('删除成功')
						this.gerDriver()
      			this.$store.dispatch('getAllDriverList')
					} else {
						this.$message.error('删除失败')
						console.log('司机信息删除失败原因', data.msg)
					}
				}).catch((err) => {
					console.log('请求删除司机信息链接失败', err)
				})
			}).catch(() => {
				this.$message({
					type: 'info',
					message: '已取消删除'
				});
			});
		},
		initDriverList (dri) {
			this.$confirm('初始化司机列表需要较长时间，请再次确认?', '提示', {
				confirmButtonText: '确定',
				cancelButtonText: '取消',
				type: 'warning'
			}).then(() => {
				this.$store.commit('loadingChangeTrue')
				this.axios({
					method: 'post',
					url: '/api2/driver/driverInit',	
					data: {},
					timeout: 6000000
				}).then((res) => {
					let data = res.data
					if (data.type === 1) {
						this.$message.success('初始化成功')
						this.gerDriver()
      			this.$store.dispatch('getAllDriverList')
					} else {
						this.$message.error('初始化失败')
						console.log('初始化司机列表失败原因', data.msg)
					}
					this.$store.commit('loadingChangeFalse')
				}).catch((err) => {
					console.log('请求初始化司机列表链接失败', err)
				})
			}).catch(() => {
				this.$message({
					type: 'info',
					message: '已取消删除'
				});
			});
		},
		resetDriverRes() {
			this.driverRes = {}
		},
		gerDriver (state) {
			if (state === 'init' || state === 'query') {
				this.currentPage = 1
			} 
			this.axios({
				method: 'get',
				url: '/api2/driver/list-by-page',
				data: this.driverRes,
				params: {'pageNo': this.currentPage, 'pageSize': this.pageSize, 'ldName': this.driverRes.ldName ? this.driverRes.ldName : '', 'workNoLike': this.driverRes.workNoLike ? this.driverRes.workNoLike : '', 'nameLike': this.driverRes.nameLike ? this.driverRes.nameLike : '', 'driverType': 0},
				headers: {'appType': 'web','appid': 'logan'}
			})
			.then((response) => {
				var data = response.data
				this.$store.commit('loadingChangeFalse')
				if (data.type == 1) {
					this.driverList = data.result.resultList
					this.currentPage = data.result.pageNo // 当前页
					this.count = data.result.totalPages // 总页数
					this.totalRecs = data.result.totalRecs
				}
			}).catch((error) => {
				console.log('司机管理列表请求发送失败原因', error)
			})
		},
		changePage (pageNo, pageSize) { // 切换页面
			this.currentPage = pageNo
			this.pageSize = pageSize
      // this.resetDriverRes()
			this.gerDriver()
		},
  }
}
</script>

<style scoped>
	.queryBox {
		display: inline-block;
		margin-left: 20px;
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
	/* .driver-query-nav {
		padding: 20px;
	} */
</style>