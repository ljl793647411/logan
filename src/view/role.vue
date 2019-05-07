<template>
	<div class="role">
		<div class="query-nav">
			<el-button @click="openAddBox" type="primary" style="margin-left:20px">添 加</el-button>
		</div>
		<div class="callBedTable">
			<el-table
				ref="singleTable"
				:data="roleList"
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
					property="workNo"
					label="角色"
					width="">
				</el-table-column>
				<el-table-column
					label="操作"
					width="">
					<template slot-scope="scope">
						<el-button type="primary" style="margin-left: 10px;" @click="openAddBox(scope.row)">编辑</el-button>
						<el-button type="danger" style="margin-left: 10px;" @click="delRole(scope.row)">删除</el-button>
					</template>
				</el-table-column>
			</el-table>
		</div>
		<div class="updateBox">
			<el-dialog title="编辑角色：" :visible.sync="addBox" width="40%" :show-close="false">
				<el-form :model="addRoleVo">
					<el-form-item label="角色名称：" :label-width="formLabelWidth">
						<el-input v-model="addRoleVo.role" :readonly="true"></el-input>
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
import {mapState} from 'vuex'

export default {
  name: "eventData",
  data() {
    return {
			roleList: [],
      addBox: false,
      addRoleVo: {},
      formLabelWidth: '120px',
		}
  },
  mounted() {
    this.$nextTick(() => {
			this.getRole('init')
      this.$store.commit('loadingChangeFalse')

    })
  },
  components: {
  },
  computed: {
		...mapState([''])
  },
  methods: {
		addRes () { // 新增车次计划
      // if (!this.addRoleVo.trainNo) {
      // 	this.$message.error('车次号不能为空')
      // }
      // if (!this.addRoleVo.ldName) {
      // 	this.$message.error('机务段不能为空')
      // }
      // if (!this.addRoleVo.trainDt) {
      // 	this.$message.error('开行时间不能为空')
      // }
      this.axios({
        method: 'post',
        data: this.addRoleVo,
        url: '/web/plan/save',
        headers: {'appType': 'web','appid': 'logan'}
      })
      .then( (response) => {
        var data = response.data
        if (data.type === 1) {
          this.getRole('init')
          this.$message.success('车次计划编辑成功！')
          this.addBox = false
        } else {
          this.$message.error(data.msg)
        }
      }).catch( (error) => {
        console.log('车次计划编辑失败')
      })
    },
		openAddBox (val) {
			this.addBox = true
			if (!val) {
				this.addRoleVo = {
					'role': '',
				}
			} else {
				this.addRoleVo = val
			}
		},
		closeAddBox () {
      this.$confirm('是否放弃编辑?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.addBox = false
        this.getRole('init')
        this.$message({
          type: 'success',
          message: '编辑取消!'
        });
      }).catch(() => {
      });
    },
		delRole (dri) {
			this.$confirm('是否删除该角色?', '提示', {
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
						this.getRole('init')
					} else {
						this.$message.error('删除失败')
						console.log('角色信息删除失败原因', data.msg)
					}
				}).catch((err) => {
					console.log('请求删除角色信息链接失败', err)
				})
			}).catch(() => {
				this.$message({
					type: 'info',
					message: '已取消删除'
				});
			});
		},
		getRole (state) { 
			this.userRes.pageNo = (state === 'init' || state === 'query') ? 1 : this.currentPage
			this.userRes.pageSize = this.pageSize
			this.axios({
				method: 'get',
				url: '/api2/driver/list-by-page',
				data: this.userRes,
				// params: {'pageNo': this.currentPage, 'pageSize': this.pageSize},
				headers: {'appType': 'web','appid': 'logan'}
			})
			.then((response) => {
				var data = response.data
				this.$store.commit('loadingChangeFalse')
				if (data.type == 1) {
					this.roleList = data.result.resultList
					this.currentPage = data.result.pageNo // 当前页
					this.count = data.result.totalPages // 总页数
					this.totalRecs = data.result.totalRecs
				}
			}).catch((error) => {
				console.log('角色管理列表请求发送失败原因', error)
			})
		},
  }
}
</script>

<style scoped>
	.updateBox .el-input {
		width: 50%;
	}
	.updateBox {
		z-index: 9999;
	}
</style>