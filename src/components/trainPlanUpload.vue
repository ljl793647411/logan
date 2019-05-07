<template>
	<el-card class="uploadBox">
		<div class="callBedTable" style="padding-bottom: 0;margin-top: 40px;">
			<div class="bed">
				<el-button type="danger" @click="closeUpdateBox">关闭</el-button>
				<el-button type="primary" @click="importMsg">确认上传</el-button>
			</div>
			<div class="table">
				<el-table	
					ref="singleTable"
					:data="tpList"
					highlight-current-row
					style="width: 100%"
					:border="true"
					row-dblclick=""
					:show-close="false">
					<el-table-column
						type="index"
						label="序号"
						width="50">
					</el-table-column>
					<el-table-column
						label="机务段"
						width="140">
						<template slot-scope="scope">
							<el-input v-model="scope.row.ldName" placeholder="请输入内容"></el-input>
						</template>
					</el-table-column>
					<el-table-column
						property="bedNo"
						label="铺位号"
						width="">
						<template slot-scope="scope">
							<el-input v-model="scope.row.bedNo" readonly placeholder="点击按钮选择铺位" style="width: 77%"></el-input>
							<bed-choose @chooseBed="chooseBed" :allChoose="true" :index="scope.$index"></bed-choose>
						</template>
					</el-table-column>
					<el-table-column
						label="到达车次"
						width="">
						<template slot-scope="scope">
							<el-input v-model="scope.row.arrivalTrainNo" placeholder="请输入内容"></el-input>
						</template>
					</el-table-column>
					<el-table-column
						label="到达时刻"
						width="">
						<template slot-scope="scope">
							<el-time-picker
								v-model="scope.row.arrivalTrainDt"
								value-format="HH:mm"
								placeholder="任意时间点">
							</el-time-picker>
						</template>
					</el-table-column>
					<el-table-column
						label="到开间隔"
						width="">
						<template slot-scope="scope">
							<el-input v-model="scope.row.interval" placeholder="请输入内容"></el-input>
						</template>
					</el-table-column>
					<el-table-column
						label="出发车次"
						width="">
						<template slot-scope="scope">
							<el-input v-model="scope.row.trainNo" placeholder="请输入内容"></el-input>
						</template>
					</el-table-column>
					<el-table-column
						label="叫班时刻"
						width="">
						<template slot-scope="scope">
							<el-time-picker
								v-model="scope.row.remindDt"
								value-format="HH:mm"
								placeholder="任意时间点">
							</el-time-picker>
						</template>
					</el-table-column>
					<el-table-column
						label="开车时刻"
						width="">
						<template slot-scope="scope">
							<el-time-picker
								v-model="scope.row.trainDt"
								value-format="HH:mm"
								placeholder="任意时间点">
							</el-time-picker>
						</template>
					</el-table-column>
					<el-table-column
						label="餐券"
						width="">
						<template slot-scope="scope">
							<el-input v-model="scope.row.ticket1" placeholder="请输入内容"></el-input>
						</template>
					</el-table-column>
				</el-table>
			</div>
		</div>
	</el-card>
</template>

<script>
	import config from '../public/config'
	import bedChoose from './bedChoose'

	export default {
	  name: 'trainPlan',
	  data () {
	  	return {
				formLabelWidth: '120px',
				tpList: []
	  	}
	  },
	  mounted () {
	  	this.$nextTick(() => {
				this.tpList = this.uploadList
	    });
	  },
	  components: {
			bedChoose,
			config,
		},
		props: ['uploadList'],

	  methods: {
			uploadSuccess () {
	  	  this.axios({
	  	  	method: 'post',
	  	  	url: '/web/plan/import',
	  	  	data: this.tpList,
	  	  	headers: {'appType': 'web','appid': 'logan'}
	  	  })
	  	  .then( (response) => {
	  	  	var data = response.data
	  	  	if (data.type == 1) {
						this.$message.success('上传成功')
						this.$emit('uploadSuccess')
	  	  	} else {
						this.$message.error(data.msg)
					}
	  	  }).catch( (error) => {
	  	  })
			},
			closeUpdateBox () {
				this.$confirm('是否放弃上传?', '提示', {
          confirmButtonText: '确定',	 
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
					this.$emit('uploadSuccess')
          this.$message({
            type: 'success',
            message: '上传取消!'
          });
        }).catch(() => {
        });
			},
			chooseBed (bunk, index) {
				this.$set(this.tpList[index], 'bedNo', bunk.bedNo)
				this.$set(this.tpList[index], 'bedSid', bunk.bedSid)
			},
			importMsg () {
				this.$confirm('本次上传会清除当前全部计划，是否继续?', '请注意', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
					this.uploadSuccess()
        }).catch(() => {
        });
			},
	  }
	}
</script>

<style scoped>
	.bed {
		float: right;
		margin-bottom: 20px;
	}
	.bed .el-button{
	  display: inline-block;
	  margin: 5px 20px 0 0;
	  width: 110px;
	}
	.table {
		margin-top: 20px;
		font-size: 16px;
	}
	.updateBox .el-input {
		width: 50%;
	}
	.uploadClass {
		display: inline-block;
	}
	.uploadBox {
		position: fixed;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
    margin: auto;
    width: 85%;
    height: 80%;
		z-index: 10;
		overflow-y: scroll;
		box-shadow: 0 2px 12px 0 rgba(0,0,0,.1);
		border: 1px solid #ebeef5;
    background-color: #fff;
    color: #303133;
    -webkit-transition: .3s;
    transition: .3s;
	}
</style>