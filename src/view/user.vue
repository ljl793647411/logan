<template>
	<div class="user">
		<div class="query-nav">
			<div class="queryBox">
				<span class="font-size-lg">工号：</span>
				<el-input v-model="userRes.workNoLike"></el-input>
			</div>
			<div class="queryBox">
				<span class="font-size-lg">姓名：</span>
				<el-input v-model="userRes.nameLike"></el-input>
			</div>
			<span>
				<span class="data-query-class font-size-lg">职位：</span>
				<el-select v-model="userRes.gbjb" placeholder="请选择">
					<el-option
						v-for="item in jobList"
						:key="item.value"
						:label="item.label"
						:value="item.value">
					</el-option>
				</el-select>
			</span>
			<el-button @click="getUser('query')" type="primary" style="margin-left:20px">查 询</el-button>
			<el-button @click="resetRes" type="primary" style="margin-left:20px">重 置</el-button>
			<el-button @click="openAddBox(1)" type="primary" style="margin-left:20px">添加用户</el-button>
		</div>
		<div class="callBedTable">
			<el-table
				ref="singleTable"
				:data="userList"
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
					property="userNo"
					label="工号"
					width="100">
				</el-table-column>
				<el-table-column
					property="username"
					label="姓名"
					width="200">
				</el-table-column>
				<el-table-column
					property="userType"
					label="角色"
					width="100">
				</el-table-column>
				<el-table-column
					property="gbjb"
					label="职位"
					width="200">
				</el-table-column>
				<el-table-column
					property="creatTime"
					label="创建时间"
					width="">
				</el-table-column>
				<el-table-column
					label="操作"
					width="">
					<template slot-scope="scope">
						<el-button type="primary" style="margin-left: 10px;" @click="openAddBox(2, scope.row)">修改权限</el-button>
						<el-button type="primary" style="margin-left: 10px;" @click="openAddBox(3, scope.row)">修改密码</el-button>
						<el-button type="danger" style="margin-left: 10px;" @click="delUser(scope.row)">删除用户</el-button>
					</template>
				</el-table-column>
			</el-table>
      <paginate :pageVo='pageVo' :pageSize='pageSize' :totalRecs='totalRecs' :currentPage='currentPage' :count='count' @changePage='changePage'></paginate>
		</div>
		<div class="updateBox">
			<el-dialog :title="addUserVo.num === 1 ? '添加用户:' : '修改信息:'" :visible.sync="addBox" width="40%" :show-close="false" :close-on-click-modal="false" :close-on-press-escape="false">
				<el-form :model="addUserVo">
					<p><input type="text" maxlength="20" class="hidden-input" placeholder="用户名" id="name" name="name" auto-complete= "off"/></p>  
					<p><input type="password" maxlength="20" class="hidden-input" placeholder="密码" id="pwd" name="pwd" auto-complete= "off"/></p>  
					<el-form-item label="工号：" :label-width="formLabelWidth">
						<el-input v-model="addUserVo.userNo" v-if="addUserVo.num === 1" :maxlength="7"></el-input>
						<span v-text="addUserVo.userNo" v-else></span>
					</el-form-item>
					<el-form-item label="姓名：" :label-width="formLabelWidth">
						<el-input v-model="addUserVo.username" auto-complete="off" v-if="addUserVo.num === 1"></el-input>
						<span v-text="addUserVo.username" v-else></span>
						<p style="visibility: hidden;"><input type="password" name="pwd" value=" " style="position: absolute;z-index: -1;" disabled auto-complete= "off"/></p>
					</el-form-item>
					<el-form-item :label="addUserVo.num === 1 ? '请输入密码：' : '请输入新密码：'" :label-width="formLabelWidth" v-if="addUserVo.num === 1 || addUserVo.num === 3">
						<el-input v-model="addUserVo.password" auto-complete="new-password" type="password"></el-input>
					</el-form-item>
					<el-form-item label="请确认密码：" :label-width="formLabelWidth" v-if="addUserVo.num === 1 || addUserVo.num === 3">
						<el-input v-model="addUserVo.password2" type="password"></el-input>
					</el-form-item>
					<el-form-item label="职位：" :label-width="formLabelWidth">
						<span v-text="addUserVo.gbjb"></span>
					</el-form-item>
					<el-form-item label="角色列表：" :label-width="formLabelWidth" v-if="addUserVo.num === 1 || addUserVo.num === 2">
						<el-select v-model="addUserVo.userType" placeholder="请选择">
							<el-option
								v-for="item in userTypeList"
								:key="item.value"
								:label="item.label"
								:value="item.value">
							</el-option>
						</el-select>
					</el-form-item>
					<el-form-item label="备注：" :label-width="formLabelWidth">
						<el-input type="textarea" v-model="addUserVo.notes" :autosize="{ minRows: 2, maxRows: 4}" style="width: 60%;"></el-input>
					</el-form-item>
				</el-form>
				<div slot="footer" class="dialog-footer">
					<el-button @click="closeAddBox">取 消</el-button>
					<el-button type="primary" @click="addRes">确 定</el-button>
				</div>
			</el-dialog>
		</div>
	</div>
</template>

<script>
import paginate from '../components/paginate'
import updataDriver from '../components/updataDriver'
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
			userList: [],	
			userRes: {},
			roleList: [],
      addBox: false,
      addUserVo: {
				num: 1
			},
      formLabelWidth: '140px',

		}
  },
  mounted() {
    this.$nextTick(() => {
			this.getUser('init')
      this.$store.commit('loadingChangeFalse')
    })
	},
	watch: {
		'addUserVo.userNo': 'userNoWatch'
	},
  components: {
		paginate,
  },
  computed: {
		...mapState(['userTypeList', 'jobList', 'allDriverList'])
  },
  methods: {
		userNoWatch (val) {
			if (this.addUserVo.num === 1) {
				if (val.length === 7) {
					for (let i in this.allDriverList) {
						if (this.allDriverList[i].workNo.toLowerCase().indexOf(val.toLowerCase()) > -1) {
							this.$set(this.addUserVo, 'username',  this.allDriverList[i].name)
							this.$set(this.addUserVo, 'gbjb', this.allDriverList[i].gbjb)
							return
						}
					}
					this.$set(this.addUserVo, 'username', '')
					this.$set(this.addUserVo, 'gbjb', '驻线值班员')
				}
			}
		},
		addRes () { // 新增用户信息
			let url = this.addUserVo.num === 1 ? '/api2/user/register' : '/api2/user/update'
      if (!this.addUserVo.userNo) {
				this.$message.error('工号不能为空')
				return
      } else if (this.addUserVo.userNo.length < 7) {
				this.$message.error('工号必须为7位数字')
				return
			}
      if (!this.addUserVo.username) {
				this.$message.error('姓名不能为空')
				return
			}
			if (this.addUserVo.num !== 2) {
				if (!this.addUserVo.password) {
					this.$message.error('密码不能为空')
					return
				}
				if (this.addUserVo.password2 !== this.addUserVo.password) {
					this.$message.error('请保证两次密码输入一致')
					return
				}
			}
			if (this.addUserVo.num !== 3) {
				if (!this.addUserVo.userType) {
					this.$message.error('请选择用户角色')
					return
				}
			}
      this.axios({
        method: 'post',
        data: this.addUserVo,
        url: url,
        headers: {'appType': 'web','appid': 'logan'}
      })
      .then( (response) => {
        var data = response.data
        if (data.type === 1) {
          this.getUser()
          this.$message.success('编辑成功！')
          this.addBox = false
        } else {
          this.$message.error(data.msg)
        }
      }).catch( (error) => {
        console.log('编辑失败')
      })
    },
		openAddBox (num, val) {
			this.addBox = true
			if (!val) {
				this.addUserVo = {
					'userNo': '',
					'username': '',
					'password': '',
					'password2': '',
					'role': '',
					'num': num
				}
			} else {	
				this.addUserVo = val
				this.addUserVo.num = num
			}
		},
		closeAddBox () {
      this.$confirm('是否放弃编辑?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
				this.addBox = false
				this.addUserVo = {}
        this.getUser()
        this.$message({
          type: 'success',
          message: '编辑取消!'
        });
      }).catch(() => {
      }); 
    },
		delUser (dri) {
			this.$confirm('是否删除该用户?', '提示', {
				confirmButtonText: '确定',
				cancelButtonText: '取消',
				type: 'warning'
			}).then(() => {
				this.axios({
					method: 'get',
					url: '/api2/user/delete',
					params: {'userNo': dri.userNo}
				}).then((res) => {
					let data = res.data
					if (data.type === 1) { 
						this.$message.success('删除成功')
						this.getUser('init')
					} else {
						this.$message.error('删除失败')
						console.log('用户信息删除失败原因', data.msg)
					}
				}).catch((err) => {
					console.log('请求删除用户信息链接失败', err)
				})
			}).catch(() => {
				this.$message({
					type: 'info',
					message: '已取消删除'
				});
			});
		},
		resetRes() {
			this.userRes = {}
		},
		getUser (state) { 
			this.userRes.pageNo = (state === 'init' || state === 'query') ? 1 : this.currentPage
			this.userRes.pageSize = this.pageSize
			this.axios({
				method: 'post', 
				url: '/api2/user/list',
				data: this.userRes,
				// params: {'pageNo': this.currentPage, 'pageSize': this.pageSize},
				headers: {'appType': 'web','appid': 'logan'} 
			})
			.then((response) => {
				var data = response.data
				this.$store.commit('loadingChangeFalse')
				if (data.type == 1) {
					this.userList = data.result.resultList
					this.currentPage = data.result.pageNo // 当前页
					this.count = data.result.totalPages // 总页数
					this.totalRecs = data.result.totalRecs
				}
			}).catch((error) => {
				console.log('用户管理列表请求发送失败原因', error)
			})
		},
		changePage (pageNo, pageSize) { // 切换页面
			this.currentPage = pageNo
			this.pageSize = pageSize
			this.getUser()
		},
  }
}
</script>

<style scoped>
	.queryBox {
		display: inline-block;
		margin-left: 20px;
	}
	.user .el-input {
		width: 60%;
	}
	.user {
		margin-top: 10px;
	}
	.hidden-input {
		position: absolute;
		z-index: 0;
		top:0;
		left:0;
	}
	.updateBox .el-select {
		width: 350px !important;
	}
</style>