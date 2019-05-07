<template>
	<el-card class="uploadBox">
		<div class="callBedTable" style="padding-bottom: 0;margin-top: 40px;">
			<div class="bed">
				<el-button type="danger" @click="closeUpdateBox">关闭</el-button>
				<el-button type="primary" @click="uploadSuccess">确认上传</el-button>
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
						width="100">
					</el-table-column>
					<el-table-column
						label="机务段"
						width="200">
						<template slot-scope="scope">
							<el-input v-model="scope.row.ldName" placeholder="请输入内容"></el-input>
						</template>
					</el-table-column>
					<el-table-column
						label="工号"
						width="">
						<template slot-scope="scope">
							<el-input v-model="scope.row.workNo" placeholder="请输入内容"></el-input>
						</template>
					</el-table-column>
					<el-table-column
						label="姓名"
						width="">
						<template slot-scope="scope">
							<el-input v-model="scope.row.name" placeholder="请输入内容"></el-input>
						</template>
					</el-table-column>
					<el-table-column
						label="职位"
						width="">
						<template slot-scope="scope">
							<el-input v-model="scope.row.gbjb" placeholder="请输入内容"></el-input>
						</template>
					</el-table-column>
				</el-table>
			</div>
		</div>
	</el-card>
</template>

<script>
	import config from '../public/config'

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
			config,
		},
		props: ['uploadList'],

	  methods: {
			uploadSuccess () {
	  	  this.axios({
	  	  	method: 'post',
	  	  	url: '/api2/cadre/import',
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
			importMsg () {
				this.uploadSuccess()
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