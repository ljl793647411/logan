<template>
  <div class="updateDriverBox">
			<el-dialog title="司机信息：" width="30%" :visible="true" :show-close="false">
        <div class="errorMsg" v-show="!updataType">
          <strong>{{`本次修改将在${timeShow}生效，在此之前该司机不能自助办理入寓/离寓，请确认是否继续。`}}</strong>
        </div>
        <el-form :model="val">
          <el-form-item label="工号：" :label-width="formLabelWidth">
            <el-input v-model="val.workNo" style="width: 45%" v-if="!updataType"></el-input>
						<b v-if="updataType" v-text="val.workNo"></b>
					  <span class="work-no-err-msg" v-if="!updataType">*工号必须为七位数字</span>
          </el-form-item>
          <el-form-item label="姓名：" :label-width="formLabelWidth">
            <el-input v-model="val.name" style="width: 45%" v-if="updataType"></el-input>
            <b v-if="!updataType" v-text="val.name"></b>
          </el-form-item>
          <el-form-item label="职位：" :label-width="formLabelWidth" v-if="!driverState">
            <el-select v-model="val.gbjb" placeholder="请选择" v-if="updataType">
              <el-option
                v-for="item in jobList"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
            <b v-if="!updataType" v-text="val.gbjb"></b>
          </el-form-item>
          <el-form-item label="机务段：" :label-width="formLabelWidth">
            <el-select
            v-if="updataType"
            v-model="val.ldName"
            placeholder="请选择"
            style="width: 80%;"
            :show-close="false">
              <el-option
                v-for="item in ldNameList"
                :key="item + 'key'" 
                :label="item"
                :value="item">
              </el-option>
            </el-select>
            <b v-if="!updataType" v-text="val.ldName"></b>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="cancel">取 消</el-button>
          <el-button type="primary" @click="submit">确 定</el-button>
        </div>
			</el-dialog>
		</div>
</template>

<script>
  import {mapState} from 'vuex'
  import config from '../public/config'

export default {
  data () {
    return {
      val: {},
      formLabelWidth: '120px',
      timeShow: ''
    }
  },
  props: ['updataType', 'updataVal', 'driverState'],
  computed: {
    ...mapState(['driverAppFullSyncTime', 'ldNameList', 'jobList'])
  },
  mounted () {
    this.$nextTick(() => {
      this.val = this.updataVal
      this.getTimeShow()
    })
  },
  components: {
    config
  },
  methods: {
    getTimeShow () {
      let nowTime = new Date().getTime()
      let timeArr = this.driverAppFullSyncTime.split(':')
      let nowDate = this.moment().format('YYYY-MM-DD')
      let sysNow = `${nowDate} ${timeArr[0]}:${timeArr[1]}:00` 
      let sysNowMs = new Date(sysNow).getTime()
      if (nowTime > sysNowMs) {
        this.timeShow = this.moment(sysNowMs).add(1, 'd').format('YYYY-MM-DD hh:mm:ss')
      } else {
        this.timeShow = sysNow
      }
    },
		cancel () {
			this.$confirm('是否放弃编辑?', '提示', {
				confirmButtonText: '确定',
				cancelButtonText: '取消',
				type: 'warning'
			}).then(() => {
				this.$emit('closeUpdataBox')
			}).catch(() => {
		
			});
		},
		submit () {
			if (!config.validateWorkNo(this.val.workNo)) {
				this.$message.error('工号必须为七位数字')
				return
      }
      if (!this.updataType) {
        this.$confirm(`确认修改工号吗?`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning' 
        }).then(() => {
          this.submitCallBack()
        }).catch(() => {
        });
      } else {
        this.submitCallBack()
      }
    },
    submitCallBack () {
      let url
      // if (this.driverState) {
      //   url = this.updataType ? '/api2/driver/update' : '/api2/driver/update-workno'
      // } else {
      //   url = this.updataType ? '/api2/cadre/update' : '/api2/cadre/updateWorkNo'
      // }
      url = this.updataType ? '/api2/driver/update' : '/api2/driver/update-workno'
      this.axios({
        method: 'post',
        url: url,
        data: this.val
      }).then((res) => {
        let data = res.data
        if (data.type === 1) {
          this.$message.success('修改成功')
          this.$emit('closeUpdataBox')
        } else if (data.type === 4001) {
          this.$message.error(data.msg)
        }  else if (data.type === 4002) {
          this.$message.error(data.msg)
        }  else if (data.type === 4003) {
          this.$message.error(data.msg)
        }  else if (data.type === 4010) {
          this.$message.error(data.msg)
        } else {
          this.$message.error('修改信息失败')
        }
      }).catch((err) => {
        console.log('请求修改信息接口失败', err)
      })
    }
  }
}
</script>

<style>
.errorMsg {
	color: red;
	padding: 5px 10px;
	line-height: 26px;
	text-align: center;
}
.work-no-err-msg {
	color: red;
	font-size: 14px;
	margin-left: 5px;
}
</style>
