<template>
	<div class="uploadBox">
		<div class="callBedTable" style="padding-bottom: 0;margin-top: 10px;">
			<div class="query-nav" v-show="!backTop">
				<div class="callBedTableButton">
					<el-button type="primary" @click="openAddBox">新 增</el-button>
				</div>
			</div>
			<div class="table">
				<el-table
					ref="singleTable"
					:data="lrList"
					highlight-current-row
					style="width: 60%"
					:border="true">
					<el-table-column
						type="index"
						label="序号"
						width="70">
					</el-table-column>
					<el-table-column
						property="reason"
						label="请假事由"
						width="">
					</el-table-column>
					<el-table-column
						label="操作"
						width="">
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
		<div class="updateBox">
			<el-dialog title="编辑请假事由：" :visible.sync="addBox" width="40%" :show-close="false">
				<el-form :model="addLrVo">
					<el-form-item label="请假事由：" :label-width="formLabelWidth">
						<el-input v-model="addLrVo.reason"></el-input>
					</el-form-item>
				</el-form>
				<div slot="footer" class="dialog-footer">
					<el-button @click="closeAddBox">取 消</el-button>
					<el-button type="primary" @click="addBunk">确 定</el-button>
				</div>
			</el-dialog>
		</div>
	</div>
</template>

<script>
	import config from '../public/config'
	export default {
	  name: 'trainPlan',
	  data () {
	  	return {
				addBox: false,
				formLabelWidth: '120px',
				addLrVo: {},
				lrList: [],
				uoloadState: false,
				uploadList: [],
				exportFlag: false
	  	}
	  },
	  mounted () {
	  	this.$nextTick(() => {
        this.getLrList();
        this.$store.commit('loadingChangeFalse')
	    });
	  },
	  components: {
			config,
		},
		computed: {
      
		},
	  methods: {
			closeAddBox () {
				this.$confirm('是否放弃编辑?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
					this.addBox = false
					this.getLrList()
          this.$message({
            type: 'success',
            message: '编辑取消!'
          });
        }).catch(() => {
        });
			},
	  	getLrList () { // 接口14，铺位看板
	  	  let self = this;
	  	  this.axios({
	  	  	method: 'get',
					url: '/api2/holidayReason/list',
	  	  	headers: {'appType': 'web','appid': 'logan'}
	  	  })
	  	  .then( (response) => {
					this.$store.commit('loadingChangeFalse')
	  	  	var data = response.data
	  	  	if (data.type == 1) {
	  	  	  self.lrList = data.result.list;
	  	  	} else {
						this.$message.error(data.msg)
					}
	  	  }).catch( (error) => {
	  	  	console.log('车次计划获取失败')
	  	  })
	  	},
			deletTP (val) { // 删除铺位看板
				this.$confirm('是否删除该车次?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
					this.axios({
						method: 'get',
						params: {'sid': val.sid},
						url: '/api2/holidayReason/delete',
						headers: {'appType': 'web','appid': 'logan'}
					})
					.then( (response) => {
						var data = response.data
						if (data.type === 1) {
							this.getLrList()
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
			openAddBox (index, val) {
				this.addBox = true
				if (!val) {
					this.addLrVo = {
						'leaveReason': '',
					}
				} else {
					this.addLrVo = val
				}
			},
			addBunk () { // 新增请假事由
				let url = this.addLrVo.sid ? '/api2/holidayReason/update' : '/api2/holidayReason/add'
				if (!this.addLrVo.reason) {
          this.$message.error('请假事由不能为空')
          return
				}
	  	  this.axios({
	  	  	method: 'post',
					data: this.addLrVo,
					url: url,
	  	  	headers: {'appType': 'web','appid': 'logan'}
	  	  })
	  	  .then( (response) => {
	  	  	var data = response.data
	  	  	if (data.type === 1) {
						this.getLrList()
						this.$message.success('请假事由编辑成功！')
						this.addBox = false
	  	  	} else {
						this.$message.error(data.msg)
					}
	  	  }).catch( (error) => {
	  	  	console.log('请假事由编辑失败')
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
	.updateBox .el-input {
		width: 50%;
	}
	.updateBox {
		z-index: 9999;
	}
	.uploadClass {
    display: inline-block;
  }
</style>