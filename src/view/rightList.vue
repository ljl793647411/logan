<template>
  <div id="rightBox">
    <el-row v-if="!backTop">
      <el-badge :value="restWaitingForManual" class="badge row-first-ele">
        <el-button type="danger" class="red topButton mouseDefault">待人工叫班</el-button>
      </el-badge>
      <el-button type="success" class="green topButton mouseDefault badge">已确认</el-button>
      <el-button type="" class="yellow topButton mouseDefault badge borderYellow" style="marginRight: 0;">首次</el-button>
      <el-button type="" class="orange topButton mouseDefault badge borderYellow" style="marginLeft: 0">二次</el-button>
      <el-button type="primary" class="blue topButton mouseDefault badge">待乘中</el-button>
    </el-row>
    <div class="fixed-icon" :class="{'fixed-icon-scroll': rightFixedState}">
      <div class="icon-fifter-box" style="width:100%;">
        <div class="un-allot-bed-class cursor el-badge" @click="allShowChange" title="空闲铺位">
          <img src="../assets/img/un-allot-bed.png" alt="" :class="{'sacleBattery': !allShow}">
        </div>
        <el-badge :value="offline" :max="99" class="icon">
          <div class="cursor lowBattery" @click="offlineChange" :class="{'sacleBattery': !offlineState}" title="网络断开">
            <img src="../assets/img/wifi-offline.png" alt="">
          </div>
        </el-badge>
        <el-badge :value="batteryList.low" :max="99" class="icon">
          <div class="lowBattery cursor" @click="batteryChange" title="低电量">
            <img src="../assets/img/lowBattery.png" alt="" :class="{'sacleBattery': batteryState}">
          </div>
        </el-badge>
        <el-badge :value="batteryList.notChargingWithoutRest" :max="99" class="icon">
          <div class="not-charging-class cursor" @click="notChargingChange" title="未待乘且未充电">
            <img src="../assets/img/not-charging.png" alt="" :class="{'sacleBattery': notChargingState}">
          </div>
        </el-badge>
        <el-badge :value="rightSummary.absent" :max="99" class="icon">
          <div class="not-charging-class cursor" @click="absentChange" title="司机离线">
            <img src="../assets/img/leave.png" alt="" :class="{'sacleBattery': absentState}">
          </div>
        </el-badge>
        <el-badge :value="rightSummary.notWearing" :max="99" class="icon" v-if="supportingWearing">
          <div class="not-charging-class cursor" @click="notWearingChange" title="离手">
            <img src="../assets/img/hand.png" alt="" :class="{'sacleBattery': notWearingState}">
          </div>
        </el-badge>
        <!-- <el-badge :value="rightSummary.tooMuchWalking" :max="99" class="icon">
          <div class="not-charging-class cursor" @click="tooMuchWalkingChange" title="步数超限">
            <img src="../assets/img/step-abnormal.png" alt="" :class="{'sacleBattery': tooMuchWalkingState}">
          </div>
        </el-badge>
        <el-badge :value="rightSummary.asleep" :max="99" class="icon">
          <div class="not-charging-class cursor"  @click="asleepChange" title="未睡着">
            <img src="../assets/img/no-sleep.png" alt="" :class="{'sacleBattery': asleepState}">
          </div>
        </el-badge> -->
      </div>
    </div>
    <el-main>
      <div class="rightCardBox" v-for="(val, index) in rightList" @dblclick="remindedDetailOpen(val)" :key="index + 'key'">
        <el-card class="rightCrad cursor" :class="{gray: (!val.withMobile && val.status === 12) || val.status === 26,blue: val.status === 21, yellow: (val.status === 22 &&  val.rest && val.rest.remindTimes === 1), orange: (val.status === 22 &&  val.rest && val.rest.remindTimes === 2),green: val.status === 23 || val.status === 24,red: val.status === 25}" v-if="(allShow || (!allShow && val.rest)) && ((batteryList.map[val.bedSid] && batteryList.map[val.bedSid].offline && !offlineState) || offlineState) && (((batteryList.map[val.bedSid] && batteryList.map[val.bedSid].battery !== -1 && batteryList.map[val.bedSid].battery < deviceLowBatteryThreshold) && batteryState) || !batteryState) && ((((batteryList.map[val.bedSid] && batteryList.map[val.bedSid].charging !== -1 && batteryList.map[val.bedSid].charging === 0) && !val.rest) && notChargingState) || !notChargingState) && ((val.rest && val.rest.absent && absentState) || !absentState) && ((val.rest && val.rest.notWearing && notWearingState) || !notWearingState) && ((val.rest && val.rest.tooMuchWalking && tooMuchWalkingState) || !tooMuchWalkingState) && ((val.rest && val.rest.asleep && asleepState) || !asleepState)" :key="index + 'key'" >
          <div class="icon-tab-box">
            <el-tooltip placement="top">
              <div slot="content" v-html="offlineTitle"></div>
              <div class="icon-tab cursor" v-show="val.withMobile && batteryList.map[val.bedSid].offline" @mouseover="iconTitleFunc('offline', batteryList.map[val.bedSid].offlineDt)">
                <img src="../assets/img/wifi-offline.png" alt="">
              </div>
            </el-tooltip>
            <el-tooltip placement="top">
              <div slot="content" v-html="absentTitle"></div>
              <div class="icon-tab cursor" v-show="val.withMobile && val.rest && val.rest.absent" @mouseover="iconTitleFunc('absent', val.rest.absentDt)">
                <img src="../assets/img/leave.png" alt="">
              </div>
            </el-tooltip>
            <!-- <el-tooltip placement="top">
              <div slot="content" v-html="asleepTitle"></div>
              <div class="icon-tab cursor" v-show="val.withMobile && val.rest && val.rest.asleep" @mouseover="iconTitleFunc('asleep', val.rest.asleepDt)">
                <img src="../assets/img/no-sleep.png" alt="">
              </div>
            </el-tooltip> -->
            <el-tooltip placement="top" v-if="supportingWearing">
              <div slot="content" v-html="notWearingTitle"></div>
              <div class="icon-tab cursor" v-show="val.withMobile && val.rest && val.rest.notWearing" @mouseover="iconTitleFunc('notWearing', val.rest.notWearingDt)">
                <img src="../assets/img/hand.png" alt="">
              </div>
            </el-tooltip>
            <!-- <div class="icon-tab cursor" v-show="val.withMobile && val.rest && val.rest.tooMuchWalking">
              <img src="../assets/img/step-abnormal.png" alt="">
            </div> -->
            <div class="icon-tab-battery cursor" v-if="val.withMobile && batteryList.map[val.bedSid]" :title="batteryList.map[val.bedSid].charging === -1 ? '设备电量信息未知' : (batteryList.map[val.bedSid].charging === 1 ? (batteryList.map[val.bedSid].battery === 100 ? '已充满' : '充电中：' + batteryList.map[val.bedSid].battery + '%') : (batteryList.map[val.bedSid].battery >= deviceLowBatteryThreshold ? '电量：' + batteryList.map[val.bedSid].battery + '%' : '电量剩余：' + batteryList.map[val.bedSid].battery + '%，请尽快充电!'))">
              <div class="battery-class">
                <img src="../assets/img/battery-1.png" alt="">
              </div>
              <div class="light-class" v-if="batteryList.map[val.bedSid].charging === -1 || batteryList.map[val.bedSid].battery === -1">
                <img src="../assets/img/unknown.png" alt="">
              </div>
              <div class="light-class" v-if="batteryList.map[val.bedSid].charging === 1">
                <img src="../assets/img/light.png" alt="">
              </div>
              <div class="electric">
                <div class="electric-2" :style="'width:' + batteryList.map[val.bedSid].height" v-if="batteryList.map[val.bedSid].charging !== -1 || batteryList.map[val.bedSid].battery !== -1" :class="{'electricRed': (batteryList.map[val.bedSid].charging === 0 && batteryList.map[val.bedSid].battery < deviceLowBatteryThreshold)}"></div>
              </div>
            </div>
          </div>
          <div class="admin-reminded-box">
            <img title="第一次人工叫班" src="../assets/img/admin-1.png" alt="" v-if="val.status === 25 && val.rest && val.rest.remindTimes === 1">
            <img title="第二次人工叫班" src="../assets/img/admin-2.png" alt="" v-if="val.status === 25 && val.rest && val.rest.remindTimes === 2">
          </div>
          <h2 v-text="val.bedNo"></h2>
          <div style="position: relative;">
            <h4 v-text="val.rest ? val.rest.driverName : ''"></h4>
            <div class="rest-leave-icon" title="已请假" v-if="val.rest && val.rest.holidayType">
              <img src="../assets/img/leave-icon.png" alt="">
            </div>
          </div> 
          <div class="train-or-time">
            <div class="train-or-time-box">
              <div :title="val.rest ? val.rest.trainNo + '-' + val.rest.remindPlanedTime: ''" class="train-or-time-child" >
                <div :class="{'train-no-class': (val.rest && val.rest.trainNo.length > 6)}" style="width: 80px;">
                  <b v-text="val.rest ? val.rest.trainNo : ''"></b>
                </div>
                <span v-text="(val.rest && val.rest.timer <= 0) || val.status === 22 ? '-' : ''"></span>
                <span v-if="val.rest && val.rest.timer <= 0">{{ val.rest.remindPlanedTime | formatTime1}}</span>
                <span v-if="val.status === 22 && val.rest && val.rest.remindTimes === 1" title="首次催叫中，请留意">首次</span>
                <span v-if="val.status === 22 && val.rest && val.rest.remindTimes === 2" title="二次催叫中，请留意">二次</span>
              </div>
            </div>  
            <div v-if="val.rest && val.rest.timer > 0">{{val.rest.timer | formatTime}}</div>
            <div v-if="val.rest && val.rest.timer <= 0" style="color: red">{{val.rest.timer | formatTime}}</div>
          </div>
           <h4>{{val.status === 23 ? ((val.rest && val.rest.remindTimes === 1) ? `${val.rest.ldName ? val.rest.ldName + '-' : ''}司机首次确认` : `${val.rest.ldName ? val.rest.ldName + '-' : ''}司机二次确认`) : (val.status === 24 ? `${val.rest.ldName ? val.rest.ldName + '-' : ''}已人工确认` : val.rest ? val.rest.ldName : '')}}</h4>
        </el-card>
      </div>
    </el-main>
    <div v-if="remindedDetailBox">
      <rest-detail :remindedDetailBox="remindedDetailBox" :remindedDetail="remindedDetail" :leaveRes="leaveRes" :rightAbsentData="rightAbsentData" :rightNotwearingData="rightNotwearingData" @closeRestDetailBox="closeRestDetailBox"></rest-detail>
    </div>
  </div>
</template>

<script>
  import config from '../public/config.vue'
  import restDetail from '../components/restDetail.vue'
  import {mapState} from 'vuex'
  import {mapGetters} from 'vuex'

export default {
  data () {
    return {
      allShow: true,
      offlineState: true,
      remindedDetailBox: false,
      remindedDetail: {},
      batteryState: false,
      notChargingState: false,
      absentState: false,
      notWearingState: false,
      tooMuchWalkingState: false,
      asleepState: false,
      timeDifference: 0,
      rotateNum: 0,
      absentTitle: '',
      asleepTitle: '',
      offlineTitle: '',
      notWearingTitle: '',
      leaveRes: {},
      rightAbsentData: [],
      rightNotwearingData: []
    }
  }, 
  components: {
    config,
    restDetail
  },
  computed: {
    ...mapState(['username', 'name', 'rightList', 'rightSummary', 'restWaitingForManual', 'timerList', 'timeout', 'reportTimeTolerance', 'interval', 'backTop', 'batteryList', 'deviceLowBatteryThreshold', 'offline', 'rightFixedState', 'supportingWearing']),
    ...mapGetters(['leng'])
  },
  mounted () {
    this.$nextTick(() => {
      // console.log('我在右侧列表')
    })
  },
  methods: {
    closeRestDetailBox () {
      this.remindedDetailBox = false
      this.$store.commit('mustEndRecord')
    },
    getLeaveBack (val) {
      this.axios({
        method: 'get',
        url: '/api2/driver/holidayListBySid',
        params: {'sid': val},
        headers: {'appType': 'web','appid': 'logan'}
      })
      .then((response) => {
        var data = response.data
        if (data.type == 1) {
          this.leaveRes = data.result
          this.leaveRes.hyTime = this.moment().format('YYYY-MM-DD HH:mm:ss')
        }
      }).catch((error) => {
        console.log('请销假列表请求发送失败原因', error)
      })
    },
    allShowChange () {
      this.allShow = !this.allShow
      // this.$store.dispatch('backTopFunc')
      this.$store.commit('rightBackTop')
    },
    offlineChange () {
      this.offlineState = !this.offlineState
      // this.$store.dispatch('backTopFunc')
      this.$store.commit('rightBackTop')
    },
    batteryChange () {
      this.batteryState = !this.batteryState
      // this.$store.dispatch('backTopFunc')
      this.$store.commit('rightBackTop')
    },
    notChargingChange () {
      this.notChargingState = !this.notChargingState
      this.$store.commit('rightBackTop')
    },
    absentChange () {
      this.absentState = !this.absentState
      this.$store.commit('rightBackTop')
    },
    asleepChange () {
      this.asleepState = !this.asleepState
      this.$store.commit('rightBackTop')
    },
    tooMuchWalkingChange () {
      this.tooMuchWalkingState = !this.tooMuchWalkingState
      this.$store.commit('rightBackTop')
    },
    notWearingChange () {
      this.notWearingState = !this.notWearingState
      this.$store.commit('rightBackTop')
    },
    iconTitleFunc (type, dt) {
      let date
      let ms = this.moment().valueOf() - this.moment(dt).valueOf()
      let msValue = this.moment().valueOf() - this.moment(dt).valueOf() - 8*60*60*1000
      if (ms > 1000*60*60*24) {
        let day = Math.floor(ms/(1000*60*60*24))
        date = this.moment(msValue).format('HH小时mm分ss秒')
        date = parseInt(date.split('小时')[0]) < 10 ? `${day}天${parseInt(date.split('小时')[0])}小时${date.split('小时')[1]}` : `${day}天${date}`
      } else {
        date = this.moment(msValue).format('HH小时mm分ss秒')
        date = parseInt(date.split('小时')[0]) < 10 ? `${parseInt(date.split('小时')[0])}小时${date.split('小时')[1]}` : date
      }
      if (type === 'absent') {
        this.absentTitle = `司机于${dt}离线</p>已离线${date}`
      } else if (type === 'offline') {
        this.offlineTitle = `设备于${dt}断开</p>已断开${date}`
      } else if (type === 'notWearing') {
        this.notWearingTitle = `设备于${dt}离手</p>已离手${date}`
      } else if (type === 'asleep') {
        this.asleepTitle = `司机于${dt}断开</p>已断开${date}`
      }
    },
    remindedDetailOpen (val) {
      this.timeDifference = this.timeout + this.reportTimeTolerance
      if (val.rest) {
        this.remindedDetailBox = true
        this.$store.commit('loadingChangeTrue')
        this.remindedDetail = JSON.parse(JSON.stringify(val))
        if (val.rest.holidayType) {
          this.getLeaveBack(val.rest.sid)
        }
        if (val.status === 24) {
          let timer = this.timerList[val.bedSid].timer - this.timeDifference
          this.$set(this.remindedDetail.rest, 'timer', timer)
          this.$store.commit('clearAudioURL')
        } else if (val.status === 23) {
          let timer = this.timerList[val.bedSid].timer - this.timeDifference - (this.interval * 3)
          this.$set(this.remindedDetail.rest, 'timer', timer)
          this.$store.commit('clearAudioURL')
        }
        let self = this
        let value = val
        this.axios.all([
          this.axiosAbsentFunc(value.rest.sid),
          this.axiosNotWearingFunc(value.rest.sid)
        ]).then(this.axios.spread(function(absent, notwearing) {
          let absentData = absent.data
          self.$store.commit('loadingChangeFalse')
          if (absentData.type === 1) {
            self.rightAbsentData = absentData.result.resultList
            if (value.rest.absent) {
              let absentObj = {
                "startDt": value.rest.absentDt,
                "endDt": "",
                "value": ""
              }
              self.rightAbsentData.push(absentObj)
            }
          } else {
            this.$message.error(absentData.msg)
          }
          let notwearingData = notwearing.data
          if (notwearingData.type === 1) {
            self.rightNotwearingData = notwearingData.result.resultList
            if (value.rest.notWearing) {
              let notWearingObj = {
                "startDt": value.rest.notWearingDt,
                "endDt": "",
                "value": ""
              }
              self.rightNotwearingData.push(notWearingObj)
            }
          } else {
            this.$message.error(notwearingData.msg)
          }
        }))
      }
    },
    axiosAbsentFunc (sid) {
      return this.axios({
        method: 'get',
        url: '/api2/history/rest-status-events',
        params: {'sid': sid, 'type': 13}
      })
    },
    axiosNotWearingFunc (sid) {
      return this.axios({
        method: 'get',
        url: '/api2/history/rest-status-events',
        params: {'sid': sid, 'type': 23}
      })
    },
    
  }
}
</script>

<style>
  #rightBox {
		width: 51%;
		float: right;
    padding: 10px 0;
  }
  .el-row .borderYellow {
    border: #ffc500 1px solid;
  }
  #rightBox .el-row {
    /* position: fixed; */
    /* z-index: 100; */
    width: 100%;
    background: #efefef;
    height: 80px;
    padding: 20px;
    box-sizing: border-box;
    border: 1px solid #ababab;
    border-top-right-radius: 20px;
    border-bottom-right-radius: 20px;
		border-left: none;
  }
  #rightBox .el-row .row-first-ele {
    /* margin-left: 40px; */
  }
  #rightBox .el-main {
    padding: 10px;
    padding-left: 50px;
  }
  .el-row .badge {
    margin: 0 10px;
  }
  .rightCardBox {
    width: 20%;
    height: auto;
    overflow: visible;
    float: left;
    user-select: none;
  }
  .rightCardBox .el-card {
    overflow: visible;
  }
  .rightCrad {
    height: 155px;
    margin: 10px;
    position: relative;
  }
  .rightCrad h2,.rightCrad h4 {
    text-align: center;
    margin: 0;
  }
  .rightCrad h4 {
    line-height: 20px;
    min-height: 20px;
    font-size: 12px;
  }
  .iconClass {
    position: absolute;
    top: 20px;
    right: 4px;
  }
  .iconClass img {
    width: 20px;
    height: 20px;
  }    
  .rightCrad:hover {
    transform: scale(1.1)
  }
 

  .remindedDetailClass p{
    text-align: left;
  }
  .remindedDetailClass p label{
    font: 18px large;
    line-height: 30px;
    margin-left: 20px;
  }
  .remindedDetailClass p span{
    margin-left: 10px;
  }
  .clickShadow {
    transform: scale(1.1);
    box-shadow: 0 2px 12px 0 rgba(0,0,0,0.1);
  }
  .reason-other.el-input {
    width: 30%;
    position: relative;
    left: -12%;
    top: 0;
  }
  .train-or-time {
    text-align: center;
  }
  .train-or-time div {
    width: 135px;
    display: inline-block;
    white-space: nowrap;
  }
  /* .train-or-time div:nth-child(1) {
    margin-right: 5px;
  } */
  #rightBox .topButton {
    color: #000;
  }
  .battery-class img{
    width: 100%;
    height: 100%;
  }
  .light-class img{
    width: 100%;
    height: 100%;
  }
  .battery-icon-class {
    position: absolute;
    width: 30px;
    height: 30px;
    left: 82%;
    top: 35%;
    z-index: 10;
  }
  .lowBattery {
    width: 25px;
    height: 28px;
  }
  .not-charging-class {
    width: 25px;
    height: 28px;
  }
  .lowBattery img,.not-charging-class img,.un-allot-bed-class img {
    width: 100%;
    height: 100%;
  }
  .sacleBattery {
    transform: scale(1.3);
    border-radius: 5px;
    box-shadow: 0 0 5px 2px #969696;
  }
  .un-allot-bed-class {
    width: 30px;
    height: 18px;
    margin-left: 3%;
  }
  .icon {
    margin: 0 15px;
  }
  .icon-tab-box {
    position: absolute;
    top: 0;
    left: 0;
    z-index: 1;
    width: 100%;
    height: 25px;
    background: rgba(255, 255, 255, 0.4);
  }
  .icon-tab-box .icon-tab {
    float: left;
    margin-left: 7px;
    margin-top: 2px;
    width: 12px;
    height: 12px;
  }
  .transform-box {
    width: 30px;
    height: 30px;
  }
  .icon-tab img,.icon-tab-battery img, .light-class img,.battery-class img,.transform-box img{
    width: 100%;
    height: 100%;
  }
  .battery-class{
    position: absolute;
    top: 0;
    left: 0;
    z-index: 10;
  }
  .icon-tab-battery {
    position: relative;
    float: right;
    margin-top: -3px;
    width: 30px;
    height: 30px;
    z-index: 10;
  }
  .light-class {
    position: absolute;
    width: 15px;
    height: 12px;
    z-index: 10;
    top: 4px;
    right: 10px;
  }
  .electric {
    width: 23px;
    height: 10px;
    background-color: #fff;
    position: absolute;
    top: 10px;
    left:2px;
  }
  .electric-2 {
    background-color: #04cf00;
    height: 10px;
    position: absolute;
    top: 0;
    left: 0;
  }
  .electricRed {
    background-color: red !important;
  }
  .icon-fifter-box {
    margin-top: 15px;
    display: flex;
    flex-wrap: nowrap;
    justify-content: space-around;
  }
  .content-top {
    width: 100%;
    border-top: 1px solid #cccccc;
  }
  .train-or-time-box {
    width: 120px;
    height: 26px;
    position: relative;
    overflow: hidden;
  }
  .train-or-time-child {
    position: absolute;
    left: 0;
  }
  .admin-reminded-box {
    position: absolute;
    top: 25px;
    left: 2px;
    width: 30px;
    height: 30px;
    z-index: 10;
  }
  .admin-reminded-box img {
    width: 100%;
    height: 100%;
  }
  .train-or-time .train-no-class {
    display: inline-block;
    line-height: 12px;
    font-size: 12px;
    word-wrap: break-word;
    white-space: normal;
  }

  /* element-ui */
  .rightCrad .el-card__body {
    padding: 25px 5px 10px 5px;
  }
  .remindedDetailClass .el-dialog__body {
    padding-top: 0;
  }
  #app .remindedDetailClass .el-table th {
   font-size: 16px;
  }



  .fixed-icon {
    position: fixed;
    top: 18%;
    right: 1.5%;
    background: #fff;
    width: 23%;
    height: 50px;
    z-index: 1000;
    border-radius: 10px;
    opacity: 1;
    transition: opacity .5s ease;
    box-shadow: 0 5px 12px 0 rgba(0,0,0,.4);
  }
  .fixed-icon:hover {
    opacity: 1;
  }
  .fixed-icon-scroll {
    opacity: 0.4;
  }

  .leave-icon {
    width: 25px;
    height: 25px;
    display: inline-block;
    margin-left: 10px;
  }
  .rest-leave-icon {
    width: 20px;
    height: 20px;
    top: 0;
    position: absolute;
    left: 20px;
  }
  .rest-leave-icon img , .leave-icon img{
    width: 100%;
    height: 100%;
  }
</style>

