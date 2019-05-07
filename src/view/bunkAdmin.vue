<template>
	<div>
		<div id="callBedTable" style="padding-bottom: 0;margin-top: 10px;">
			<div class="bed" v-show="!backTop">
				<el-button type="primary" @click="openAddBox">新 增</el-button>
				<el-button type="primary" @click="sortBedChange">排 序</el-button>
			</div>
			<div class="table">
				<el-table
					ref="singleTable"
					:data="bunkList"
					highlight-current-row
					style="width: 100%"
					:border="true"
					row-dblclick="">
					<el-table-column
						type="index"
						label="序号"
						width="60">
					</el-table-column>
					<el-table-column
						property="no"
						label="铺位号"
						width="">
					</el-table-column>
					<el-table-column
						label="手表"
						width="120">
						<template slot-scope="scope">
							<div>
								<i class="phoneIcon">
									<img v-show="scope.row.mid" src="../assets/img/watch-icon.png" alt="">
								</i>
								<span v-text="scope.row.appVer"></span>
							</div>
						</template>
					</el-table-column>
					<el-table-column
						label="分区"
						width="115">
						<template slot-scope="scope">
							<p class="color-select" :style="{'background': colorList[scope.row.colorIndex]}" v-text="colorIndexMemos[scope.row.colorIndex]"></p>
						</template>
					</el-table-column>
					<el-table-column
						property="area"
						label="区号"
						width="60">
					</el-table-column>
					<el-table-column
						property="building"
						label="楼号"
						width="60">
					</el-table-column>
					<el-table-column
						property="floor"
						label="楼层"
						width="60">
					</el-table-column>
					<el-table-column
						property="room"
						label="房号"
						width="60">
					</el-table-column>
					<el-table-column
						property="bed"
						label="床号"
						width="60">
					</el-table-column>
					<el-table-column
						property="memo"
						label="备注"
						width="60"
						>
					</el-table-column>
					<el-table-column
						label="操作"
						width="160">
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
			<el-dialog title="铺位信息：" :visible.sync="addBox" width="40%" :show-close="false">
				<el-dialog
					width="20%"
					title="床位分区设置"
					:visible.sync="partitionState"
					append-to-body>
					<div>
						<div class="partition">
							<div v-for="(colorIndex, index) in colorIndexMemos" :key="index">
								<div class="color" :style="{'background': colorList[index]}" style="margin: 5px 10px" v-text="colorIndexMemos[index]" @click="colorSelect(index)"></div>
							</div>
						</div>
					</div>
				</el-dialog>
				<el-form :model="addBunkVo">
					<el-form-item label="铺位号：" :label-width="formLabelWidth">
						<el-input v-model="addBunkVo.no"></el-input>
					</el-form-item>
					<el-form-item label="手表：" :label-width="formLabelWidth" v-show="addBunkVo.sid">
							<span class="watchBox">
								<i v-show="addBunkVo.mid" class="phoneIcon">
									<img src="../assets/img/watch-icon.png" alt="">
								</i>
								<span v-show="addBunkVo.mid" v-text="addBunkVo.appVer"></span>
							</span>
							<el-switch
									v-show="flagState"
									style="display: inline-block;margin-left: 20px"
									v-model="midState"
									active-color="#ff4949"
									inactive-color="#13ce66"
									active-text="解绑"
									inactive-text="撤销"
									@change="midstateChange">
							</el-switch>
					</el-form-item>
					<el-form-item label="分区：" :label-width="formLabelWidth">
						<p class="color-select cursor" @click="partitionState = true" :style="{'background': colorList[addBunkVo.colorIndex]}" v-text="colorIndexMemos[addBunkVo.colorIndex]"></p>
						<span class="promptFont">点击输入框选择分区</span>
					</el-form-item>
					<el-form-item label="区号：" :label-width="formLabelWidth">
						<el-input v-model="addBunkVo.area"></el-input>
					</el-form-item>
					<el-form-item label="楼号：" :label-width="formLabelWidth">
						<el-input v-model="addBunkVo.building"></el-input>
					</el-form-item>
					<el-form-item label="楼层号：" :label-width="formLabelWidth">
						<el-input v-model="addBunkVo.floor"></el-input>
					</el-form-item>
					<el-form-item label="房间号：" :label-width="formLabelWidth">
						<el-input v-model="addBunkVo.room"></el-input>
					</el-form-item>
					<el-form-item label="床号：" :label-width="formLabelWidth">
						<el-input v-model="addBunkVo.bed"></el-input>
					</el-form-item>
					<el-form-item label="备注：" :label-width="formLabelWidth">
						<el-input v-model="addBunkVo.memo" type="textarea" :autosize="{ minRows: 2, maxRows: 4}" style="width:50%"></el-input>
					</el-form-item>
				</el-form>
				<div slot="footer" class="dialog-footer">
					<el-button @click="closeAddBox">取 消</el-button>
					<el-button type="primary" @click="addBunk">确 定</el-button>
				</div>
			</el-dialog>
		</div>
		<div v-if="sortBedShow">
			<sort-bed :bunkList="bunkList" @closeSortBed="closeSortBed"></sort-bed>
		</div>
	</div>
</template>

<script>
	import config from '../public/config'
	import sortBed from '../components/sortBed'
	export default {
	  name: 'bunkAdmin',
	  data () {
	  	return {
      	colorList: config.colorList,
				addBox: false,
				formLabelWidth: '120px',
				addBunkVo: {},
				midState: false,
				partitionState: false,
				mid: '',
				flagState: false,
	  	  bunkList: [],
				sortBedShow: false
	  	}
	  },
	  mounted () {
	  	this.$nextTick(() => {
	      this.callBunkAd();
	    });
	  },
	  components: {
			sortBed
		},
		computed: {
			colorIndexMemos () {
				return this.$store.state.colorList
			},
			backTop () {
				return this.$store.state.backTop
			}
		},
	  methods: {
			midstateChange (val) {
				if (this.addBunkVo.mid) {
					this.mid = this.addBunkVo.mid
				}
				if (val) {
					this.addBunkVo.mid = null
				} else {
					this.addBunkVo.mid = this.mid
				}
			},
			colorSelect (index) {
				this.addBunkVo.colorIndex = index
				this.partitionState = false
			},
			closeAddBox () {
				this.$confirm('是否放弃编辑?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
					this.addBox = false
					this.callBunkAd()
          this.$message({
            type: 'success',
            message: '编辑取消!'
          });
        }).catch(() => {
        });
			},
			sortBedChange () {
				this.sortBedShow = true
			},
			closeSortBed (list) {
				this.callBunkAd()
				this.sortBedShow = false
			},
	  	callBunkAd () { // 接口14，铺位看板
	  	  let self = this;
	  	  this.axios({
	  	  	method: 'get',
					url: '/api2/bed/list',
	  	  	headers: {'appType': 'web','appid': 'logan'}
	  	  })
	  	  .then( (response) => {
					this.$store.commit('loadingChangeFalse')
	  	  	var data = response.data
	  	  	if (data.type == 1) {
	  	  	  self.bunkList = data.result.result;
	  	  	}
	  	  }).catch( (error) => {
	  	  	console.log('铺位看板获取失败')
	  	  })
	  	},
			deletTP (bunk) { // 删除铺位看板
				this.$confirm('是否删除该铺位?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
					this.axios({
						method: 'get',
						params: {'sid': bunk.sid},
						url: '/api2/bed/remove',
						headers: {'appType': 'web','appid': 'logan'}
					})
					.then( (response) => {
						var data = response.data
						if (data.type === 1) {
							this.callBunkAd()
							this.$message.success('删除成功')
						} else if (data.type === 4001) {
							this.$message.warning('进行中的待乘不能删除铺位！')
							return null
						}
					}).catch( (error) => {
						console.log('铺位看板删除失败')
					})
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
			},
			openAddBox (index, bunk) {
				this.addBox = true
				if (!bunk) {
					this.addBunkVo = {
						'no': '',
						'mid': '',
						'area': '',
						'building': '',
						'floor': '',
						'room': '',
						'bed': '',
						'memo': '',
						'colorIndex': ''
					}
				} else {
					this.addBunkVo = bunk
					if (this.addBunkVo.mid) {
						this.flagState = true
						this.midState = false
					}
				}
			},
			addBunk () { // 新增铺位看板
				let url = this.addBunkVo.sid ? '/api2/bed/update' : '/api2/bed/create'
				if (!this.addBunkVo.no) {
					this.$message.error("铺位号不能为空")
				}
	  	  this.axios({
	  	  	method: 'post',
					data: this.addBunkVo,
					url: url,
	  	  	headers: {'appType': 'web','appid': 'logan'}
	  	  })
	  	  .then( (response) => {
	  	  	var data = response.data
	  	  	if (data.type === 1) {
						this.callBunkAd()
						this.$message.success('铺位编辑成功！')
						this.addBox = false
						this.flagState = false
	  	  	} else if (data.type === 4002) {
						this.$message.error('进行中的待乘不能解绑手表！')
	  	      return null
	  	  	} else if (data.type === 4001) {
						this.$message.error('铺位号重复')
	  	      return null
	  	  	}
	  	  }).catch( (error) => {
	  	  	console.log('铺位看板新增失败')
	  	  })
	  	}
	  }
	}
</script>

<style scoped>
	#callBedTable {
		width: 49%;
		float: left;
	}
	.bed .el-button{
	  display: inline-block;
	  margin: 5px 20px 0 0;
	  width: 110px;
	}
	.table {
		font-size: 16px;
		margin-top: 30px;
	}
	.color-select {
		width: 90px;
		height: 32px;
		display: inline-block;
		line-height: 30px;
		border: 1px solid rgb(170, 170, 170);
		font-size: 20px;
		margin: 0;
		text-align: center;
		color: #09192A;
	} 
	.phoneIcon{
	  height: 32px;
	  width: 30px;
	  display: inline-block;
	}
	.phoneIcon img {
		width: 100%;
		height: 100%;
	}
	.updateBox .el-input {
		width: 50%;
	}
	.partition {
		display: flex;
		flex-wrap: wrap;
    margin-top: 10px;
	}
  .color {
    border: 1px solid rgb(170, 170, 170);
    width: 80px;
    height: 72px;
    text-align: center; 
    line-height: 72px;
    font-size: 20px;
    border-radius: 10px;
  }
  .color:hover {
    transform: scale(1.1);
    box-shadow: 0 0 10px rgb(151, 151, 151);
    cursor: pointer;
  }
	.watchBox {
		width: 90px;
    height: 32px;
    display: inline-block;
	}
</style>