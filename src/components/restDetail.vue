<template>
  <div>
    <el-dialog title="待乘信息" width="50%" :visible.sync="boxShow" custom-class="remindedDetailClass" @closed="closeBox">
      <div class="content-top">
        <p><label for="">车次：</label><span v-text="remindedDetailBox ? remindedDetail.rest.trainNo : ''"></span></p>
        <p><label for="">铺位号：</label><span v-text="remindedDetailBox ? remindedDetail.bedNo : ''"></span></p>
        <p>
          <label for="">司机：</label>
          <span v-text="remindedDetailBox ? remindedDetail.rest.driverName : ''"></span>
          <span v-text="remindedDetail.rest && remindedDetail.rest.driverWorkNo ? '/' : ''">/</span>
          <span v-text="remindedDetail.rest && remindedDetail.rest.driverWorkNo ? remindedDetail.rest.driverWorkNo : ''"></span>
          <span class="leave-icon" title="已请假" v-if="remindedDetail.rest && remindedDetail.rest.holidayType">
            <img src="../assets/img/leave-icon.png" alt="">
          </span>
        </p>
        <p v-if="remindedDetail.rest && remindedDetail.rest.holidayType"><label for="">请假时间：</label><span v-text="leaveRes.lyTime"></span></p>
        <p v-if="remindedDetail.rest && remindedDetail.rest.holidayType"><label for="">预计销假时间：</label><span v-text="leaveRes.yjfhTime"></span></p>
        <p v-if="remindedDetail.rest && remindedDetail.rest.holidayType"><label for="">请假事由：</label><span v-text="leaveRes.reason"></span></p>
        <p><label for="">叫班时间：</label><span v-text="remindedDetailBox ? remindedDetail.rest.remindPlanedTime : ''"></span></p>
        <p><label for="">叫班次数：</label><span v-text="remindedDetailBox ? remindedDetail.rest.remindTimes : ''"></span><span v-if="remindedDetailBox && remindedDetail.rest.timer > 0">{{remindedDetail.rest.timer | formatTime}}</span></p>
        <p v-show="remindedDetail.status === 25">
          <label for="">叫班原因：</label>
          <span>
            <el-select v-model="reason" placeholder="请选择">
              <el-option
                v-for="item in remindedReason"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
            <el-input v-model="reasonOther" class="reason-other" v-if="reason === '其他'"></el-input>
          </span>
        </p>
      </div>
      <div class="content-top">
        <p>
          <label for="" style="font-size: 20px;font-weight: 200;">离线</label>
          <span v-if="!rightAbsentData || rightAbsentData.length === 0">无</span>
          <el-table
            v-else
            :data="rightAbsentData"
            style="width: 100%">
            <el-table-column
              prop="startDt"
              label="离线时间"
              width="">
            </el-table-column>
            <el-table-column
              prop="endDt"
              label="上线时间"
              width="">
            </el-table-column>
            <el-table-column
              prop="value"
              label="离线时长">
            </el-table-column>
          </el-table>
        </p>
      </div>
      <div class="content-top" v-if="supportingWearing">
        <p>
          <label for="" style="font-size: 20px;font-weight: 200;">离手</label>
          <span v-if="!rightNotwearingData || rightNotwearingData.length === 0">无</span>
          <el-table
            v-else
            :data="rightNotwearingData"
            style="width: 100%">
            <el-table-column
              prop="startDt"
              label="离手时间"
              width="">
            </el-table-column>
            <el-table-column
              prop="endDt"
              label="佩戴时间"
              width="">
            </el-table-column>
            <el-table-column
              prop="value"
              label="离手时长">
            </el-table-column>
          </el-table>
        </p>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="leaveToOrBack(1, remindedDetail.rest)" type="primary" v-if="remindedDetail.rest && !remindedDetail.rest.holidayType">请假</el-button>
        <el-button @click="leaveToOrBack(2, remindedDetail.rest)" type="primary" v-if="remindedDetail.rest && remindedDetail.rest.holidayType">销假</el-button>
        <el-button @click="adRemindConfirm" type="success" v-show="remindedDetail.status === 25">人工叫班</el-button>
        <el-button @click="end" type="danger">结束待乘</el-button>
      </div>
    </el-dialog>
    <div v-if="leaveBoxShow">
      <leave-box :title="leaveTitle" :leaveState="leaveState" :leaveObj="leaveObj" @closeLeaveBox="closeLeaveBox" type="post"></leave-box>
    </div>
  </div>
</template>

<script>
import config from '../public/config.vue'
import leaveBox from './leaveBox.vue'
import {mapState} from 'vuex'
export default {
  data () {
    return {
      leaveBoxShow: false,
      remindedReason: config.remindedReason,
      leaveObj: {},
      leaveTitle: '',
      leaveState: true,
      reason: '',
      reasonOther: '',
      boxShow: true
    }
  },
  props: ['remindedDetailBox', 'remindedDetail', 'leaveRes', 'rightNotwearingData', 'rightAbsentData'],
  components: {
    config,
    leaveBox
  },
  computed: {
    ...mapState(['supportingWearing'])
  },
  methods: {
    closeBox () {
      this.$emit('closeRestDetailBox')
    },
    leaveToOrBack (state, val) {
      if (state === 1) {
        let oneHours = this.moment().add(1, 'h').valueOf()
        let remindPlanedMs = this.moment(val.remindPlanedTime).valueOf()
        if (oneHours > remindPlanedMs) {
          this.$alert('现在距叫班时间已不足一小时，如需请假，请联系管理员！', '提示', {
            confirmButtonText: '确定',
            callback: action => {
              this.$message({
                type: 'info',
                message: `请假失败`
              });
            }
          });
          return
        }
        this.leaveObj.remindPlanedTime = val.remindPlanedTime
        this.leaveObj.lyTime = this.moment().format('YYYY-MM-DD HH:mm:ss')
        this.leaveObj.name = val.driverName
        this.leaveObj.sid = val.sid
        this.leaveObj.workNo = val.driverWorkNo
        this.leaveTitle = "请假" 
        this.leaveState = true
      } else if (state === 2) {
        this.leaveObj = this.leaveRes
        this.leaveTitle = "销假"
        this.leaveState = false  
      }
      this.leaveBoxShow = true
    },
    closeLeaveBox () {
      this.leaveBoxShow = false
      this.leaveObj = {}
      this.leaveTitle = ""
      this.leaveState = true
      this.$emit('closeRestDetailBox')
    },
    adRemindConfirm() {
      this.$store.commit('stopAudio')
      if (this.reason === '其他') {
        this.reason = this.reasonOther
      }
      this.axios({//21接口，获取设备登记信息
			  method: 'get',
			  url: '/web/confirm',
			  params: {sid: this.remindedDetail.rest.sid, reason: this.reason},
			  headers: {'appType': 'web','appid': 'logan'}
			}).then((response) => {
        var data = response.data
        if (data.type === 1) {
          this.$message.success('人工叫班已确认')
          this.$emit('closeRestDetailBox')
        } else {
          this.$message.error('人工叫班失败')
          this.$emit('closeRestDetailBox')
        }
      }).catch( (error) => {
        console.log('请求人工叫班链接失败', error)
      })
    },
    end () { // 结束待乘
      let msg
      if (this.remindedDetail.rest.holidayType) {
        msg = '该司机还未销假，是否结束待乘？'
      } else {
        msg = '是否结束待乘？'
      }
      this.$confirm(msg, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.axios({
          method: 'get',
          url: '/app/end',
          params: {sid: this.remindedDetail.rest.sid},
          headers: {'appType': 'web','appid': 'logan'}
        }).then((response) => {
          var data = response.data;
          if (data.type === 1) {
            this.$message.success('结束待乘成功')
            this.$store.commit('mustEndRecord')
            this.$emit('closeRestDetailBox')
          } else {
            this.$message.error('结束待乘失败')
            this.$emit('closeRestDetailBox')
          }
        }).catch( (error) => {
          console.log('结束叫班链接请求失败', error)
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消操作'
        })
      })
    },
  }
}
</script>

<style>

</style>
