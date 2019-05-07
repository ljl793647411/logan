<template>
  <div class="inspection">
		<div class="query-nav">
			<date-box radioProp="汇总" @sendDate="receiveDate" dateTitle="交接班日期"></date-box>
			<div class="queryBox" style="marginLeft: 20px;width: 400px;">
				<span class="font-size-lg">交班人工号：</span>
				<el-input v-model="changeShiftRes.jjrNo"></el-input>
			</div>
			<div class="queryBox">
				<span class="font-size-lg">交班人：</span>
				<el-input v-model="changeShiftRes.jjr"></el-input>
			</div>
			<el-button @click="getChangeShift('query')" type="primary">查 询</el-button>
			<el-button @click="resetRes" type="primary">重 置</el-button>
			<el-button @click="openAddBox" type="primary">开始交接班</el-button>
      <el-button size="small" type="primary" @click="exportExcel">导出</el-button>
      <a ref="exportDowload"></a>
		</div>
    <div class="callBedTable">
      <el-table
        ref="singleTable"
        :data="changeShiftList"
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
          property="jjr"
          label="交班人"
          width="200">
        </el-table-column>
        <el-table-column
          property="jsr"
          label="接班人"
          width="200">
        </el-table-column>
        <el-table-column
          property="jjcontent"
          label="交班内容"
          width="150">
					<template slot-scope="scope">
            <div v-text="scope.row.jjcontent" :title="scope.row.jjcontent"></div>
					</template>
        </el-table-column>
        <el-table-column
          property="jjTime"
          label="交班时间"
          width="200">
        </el-table-column>
        <el-table-column
          property="address"
          label="待乘地点"
          width="200">
        </el-table-column>
        <el-table-column
          property="total"
          label="终端总个数"
          width="">
        </el-table-column>
        <el-table-column
          property="useNo"
          label="已使用个数"
          width="">
        </el-table-column>
        <el-table-column
          property="remainNo"
          label="剩余个数"
          width="">
        </el-table-column>  
        <el-table-column
          property="brokenNo"
          label="故障数"
          width="">
        </el-table-column>
      </el-table>
      <paginate :pageVo='pageVo' :pageSize='pageSize' :totalRecs='totalRecs' :currentPage='currentPage' :count='count' @changePage='changePage'></paginate>
		</div>
    <div class="updateBox">
			<el-dialog title="开始交接班：" :visible.sync="addBox" width="40%" :show-close="false">
				<el-form :model="addChangeShiftVo">
					<el-form-item label="交班员：" :label-width="formLabelWidth">
						<el-input v-model="addChangeShiftVo.jjr" :readonly="true"></el-input>
					</el-form-item>
	        <el-form-item label="接班员：" :label-width="formLabelWidth">
            <el-autocomplete 
            class="inline-input"
            v-model="addChangeShiftVo.jsr"
            :fetch-suggestions="querySearch2"
            placeholder="请输入工号"
            :trigger-on-focus="true"
            @select="handleSelect1"
            value-key="userNo, username"
            :debounce="0"
            :clearable="false">
              <template slot-scope="props">
                <span style="margin-left: 5px;" v-text="props.item.username + '(' + props.item.userNo + ')'"></span>
              </template>
          </el-autocomplete>
					</el-form-item>
					<el-form-item label="交接内容：" :label-width="formLabelWidth">
						<el-input type="textarea" :maxlength="500" v-model="addChangeShiftVo.jjcontent" :autosize="{ minRows: 2, maxRows: 4}" style="width: 50%;"></el-input>
					</el-form-item>
          <el-form-item label="交接时间：" :label-width="formLabelWidth">
						<el-time-picker
							v-model="addChangeShiftVo.jjTime"
							value-format="HH:mm:ss"
							placeholder="任意时间点">
						</el-time-picker>
					</el-form-item>
					<el-form-item label="待乘地点：" :label-width="formLabelWidth">
						<el-input v-model="addChangeShiftVo.address"></el-input>
					</el-form-item>
					<el-form-item label="终端总数：" :label-width="formLabelWidth">
						<el-input type="number" v-model="addChangeShiftVo.total"></el-input>
					</el-form-item>
					<el-form-item label="已使用数：" :label-width="formLabelWidth">
						<el-input type="number" v-model="addChangeShiftVo.useNo"></el-input>
					</el-form-item>
					<el-form-item label="剩余数：" :label-width="formLabelWidth">
						<el-input type="number" v-model="addChangeShiftVo.remainNo"></el-input>
					</el-form-item>
					<el-form-item label="故障数：" :label-width="formLabelWidth">
						<el-input type="number" v-model="addChangeShiftVo.brokenNo"></el-input>
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
import config from '../public/config.vue'
import paginate from '../components/paginate'
import dateBox from "../components/dateBox"
import cookie from "../components/cookie"
import {mapState} from 'vuex'

export default {
  data () {
    return {
			currentPage: 1,
			count: 0,
			totalRecs: '',
			pageSize: 10,
			pageVo: {
				'prevText': '<<',
				'nextText': '>>'
      },
      changeShiftList: [],
      changeShiftRes: {
        register: ''
      },
      registerQueryList: config.registerList,
      registerList: [],
      addBox: false,
      addChangeShiftVo: {},
      formLabelWidth: '120px',
    }
  },
  computed: {
    ...mapState(['name', 'userLists', 'username'])
  },
  mounted () {
    this.$nextTick(() => {
      this.$store.commit('loadingChangeFalse')
      this.getChangeShift('init') 
    })
  },
  components: {
		paginate,
    config,
    dateBox,
    cookie
  },
  methods: {
    querySearch2(queryString, cb) {  // 自动补全框方法
      var restaurants = this.userLists
      var results = queryString ? restaurants.filter(this.createFilter(queryString)) : restaurants;
      // 调用 callback 返回建议列表的数据
      cb(results);
    },
    handleSelect1(item) {
      this.$set(this.addChangeShiftVo, 'jsr', item.username)
      this.$set(this.addChangeShiftVo, 'jsrNo', item.userNo)
    },
    createFilter(queryString) {
      return (restaurant) => {
        return (restaurant.userNo.toLowerCase().indexOf(queryString.toLowerCase()) > -1 || restaurant.username.indexOf(queryString) > -1);
      };
    },
    exportExcel () {
      let self = this
      this.axios({
        method: 'get',
        url: '/api2/duty/handoverRecord/export',
        params: ''
      }).then((res) => {
        let data = res.data
        if (data.type === 1) {
          self.$refs.exportDowload.href = '/api2/file?type=handoverRecord&fileName=' + data.result.fileName
          self.$refs.exportDowload.download = '/api2/file?type=handoverRecord&fileName=' + data.result.fileName
          self.$refs.exportDowload.click()
          this.$message.success('导出成功')
        }else {
          this.$message.error('导出失败' + data.msg)
        }
      }).catch((error) => {
        console.log('导出交接班记录失败，', error)
      })
    },
    receiveDate(date) {
      this.changeShiftRes.fromTime = date.from
      this.changeShiftRes.toTime = date.to
    },
    openAddBox () {
      this.addBox = true
      this.addChangeShiftVo = {
        'jjTime': this.moment().format('HH:mm:ss'),
        'address': this.name,
        'jjr': this.username,
      } 
    },
    getChangeShift (state) { 
			this.changeShiftRes.pageNo = (state === 'init' || state === 'query') ? 1 : this.currentPage
			this.changeShiftRes.pageSize = this.pageSize
			this.axios({
				method: 'post',
				url: '/api2/duty/handoverlist',
				data: this.changeShiftRes,
				// params: {'pageNo': this.currentPage, 'pageSize': this.pageSize},
				headers: {'appType': 'web','appid': 'logan'}
			})
			.then((response) => {
				var data = response.data
				this.$store.commit('loadingChangeFalse')
				if (data.type == 1) {
					this.changeShiftList = data.result.resultList
					this.currentPage = data.result.pageNo // 当前页
					this.count = data.result.totalPages // 总页数
					this.totalRecs = data.result.totalRecs
				}
			}).catch((error) => {
				console.log('交接班列表请求发送失败原因', error)
			})
		},
		changePage (pageNo, pageSize) { // 切换页面
			this.currentPage = pageNo
			this.pageSize = pageSize
      // this.resetRes()
			this.getChangeShift()
    },
    resetRes() {
			this.changeShiftRes = {}
    },
    closeAddBox () {
      this.$confirm('是否放弃编辑?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.addBox = false
        this.getChangeShift()
        this.$message({
          type: 'success',
          message: '编辑取消!'
        });
      }).catch(() => {
      });
    },
    logout () {
      this.$router.push({path: '/login'})
      cookie.delCookie(this.username)
      config.delLocal('userNo')
    },
    addRes () { // 新增交接班记录
      this.addChangeShiftVo.jjrNo = config.selectLocal('userNo')
      if (!this.addChangeShiftVo.jsr || !this.addChangeShiftVo.jsrNo) {
        this.$message.error('请重新选择接班人')
        return
      }
      if (!this.addChangeShiftVo.jjcontent) {
        this.$message.error('交接内容不能为空')
        return
      }
      if (!this.addChangeShiftVo.jjTime) {
        this.$message.error('交接时间不能为空')
        return
      }
      if (!this.addChangeShiftVo.total) {
        this.$message.error('终端总数不能为空')
        return
      }
      if (!this.addChangeShiftVo.useNo) {
        this.$message.error('已使用数不能为空')
        return
      }
      if (!this.addChangeShiftVo.remainNo ) {
        this.$message.error('剩余数不能为空')
        return
      }
      if (!this.addChangeShiftVo.brokenNo) {
        this.$message.error('故障数不能为空')
        return
      }
      let jjDate = this.moment().format('YYYY-MM-DD') + ' ' + this.addChangeShiftVo.jjTime
      this.addChangeShiftVo.jjTime = jjDate
      this.$confirm('确定交班么?交班后将自动退出登录', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.axios({
          method: 'post',
          data: this.addChangeShiftVo,
          url: '/api2/duty/handover',
          headers: {'appType': 'web','appid': 'logan'}
        })
        .then( (response) => {
          var data = response.data
          if (data.type === 1) {
            this.$message.success('交班成功')
            this.addBox = false
            this.logout()
          } else {
            this.$message.error(data.msg)
          }
        }).catch( (error) => {
          console.log('请求交班接口/api2/duty/handover失败')
        })
       
      }).catch(() => {
      });
    }
  }
}
</script>

<style>

  .inspection .el-input {
		width: 60%;
	}
  .updateBox .el-input {
		width: 50%;
	}
	.updateBox {
		z-index: 9999;
	}
  .updateBox .inline-input {
    width: 100%;
  }
</style>
