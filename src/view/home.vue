<template>
  <div>
    <div class="head">
      <div class="head-top">
        <div class="project-name">
          <span style="font-size: 36px; margin-right: 40px;">智能待乘管理系统</span>
          <span v-text="name"></span>
        </div>
        <div class="user-name">
          欢迎
          <span v-text="username"></span>
          <span class="">|</span>
          <span @click="logout" class="cursor" style="color: #1890ff">注销</span>
        </div>
      </div>
      <el-tabs type="card" @tab-click="tabChange" v-model="navIndex">
        <div class="date-box">
          <span v-text="date"></span>
        </div>
        <el-tab-pane label="控制中心">
          <div class="tab-content" v-if="tabState === '控制中心'" v-loading="loading" :class="{'loading': loading}">
            <right-list></right-list>
            <controller-center v-if="typeof isYunanSwitch === 'boolean' && !isYunanSwitch"></controller-center>
            <controller-center-2 v-if="typeof isYunanSwitch === 'boolean' && isYunanSwitch"></controller-center-2>
          </div>
        </el-tab-pane>
        <el-tab-pane label="待乘记录">
          <div class="tab-content" v-if="tabState === '待乘记录'" v-loading="loading" :class="{'loading': loading}">
            <data-query></data-query>
          </div>
        </el-tab-pane>
        <el-tab-pane label="待乘巡检">
          <div class="tab-content" v-if="tabState === '待乘巡检'" v-loading="loading" :class="{'loading': loading}">
            <inspection></inspection>
          </div>
        </el-tab-pane>
        <el-tab-pane label="请销假查询">
          <div class="tab-content" v-if="tabState === '请销假查询'" v-loading="loading" :class="{'loading': loading}">
            <leave></leave>
          </div>
        </el-tab-pane>
        <el-tab-pane label="交接班">
          <div class="tab-content" v-if="tabState === '交接班'" v-loading="loading" :class="{'loading': loading}">
            <change-shift></change-shift>
          </div>
        </el-tab-pane>
        <el-tab-pane label="设备事件">
          <div class="tab-content" v-if="tabState === '设备事件'" v-loading="loading" :class="{'loading': loading}">
            <event-data></event-data>
          </div>
        </el-tab-pane>
        <el-tab-pane label="计划维护" v-if="typeof isYunanSwitch === 'boolean' && !isYunanSwitch">
          <div class="tab-content" v-if="tabState === '计划维护'" v-loading="loading" :class="{'loading': loading}">
            <train-plan></train-plan>
          </div>
        </el-tab-pane>
        <el-tab-pane label="铺位管理"> 
          <div class="tab-content" v-if="tabState === '铺位管理'" v-loading="loading" :class="{'loading': loading}">
            <bunk-admin></bunk-admin>
            <right-list></right-list>
          </div>
        </el-tab-pane>
        <!-- <el-tab-pane label="司机管理" v-if="supportingFaceFeature">
          <div class="tab-content" v-if="tabState === '司机管理'" v-loading="loading" :class="{'loading': loading}">
            <driver></driver>
          </div>
        </el-tab-pane> -->
        <el-tab-pane label="人员管理">
          <div class="tab-content" v-if="tabState === '人员管理'" v-loading="loading" :class="{'loading': loading}">
            <inspectionAdmin></inspectionAdmin>
          </div>
        </el-tab-pane>
        <el-tab-pane label="用户管理">
          <div class="tab-content" v-if="tabState === '用户管理'" v-loading="loading" :class="{'loading': loading}">
            <user></user>
          </div>
        </el-tab-pane>
        <!-- <el-tab-pane label="用户操作记录">
          <div class="tab-content" v-if="tabState === '用户操作记录'" v-loading="loading" :class="{'loading': loading}">
            <user-operation-record></user-operation-record>
          </div>
        </el-tab-pane> -->
        <!-- <el-tab-pane label="角色管理">
          <div class="tab-content" v-if="tabState === '角色管理'" v-loading="loading" :class="{'loading': loading}">
            <role></role>
          </div>
        </el-tab-pane> -->
        <!-- <el-tab-pane label="异常记录查询">
          <div class="tab-content" v-if="tabState === '异常记录查询'" v-loading="loading" :class="{'loading': loading}">
            <abnormal-record-query></abnormal-record-query>
          </div>
        </el-tab-pane> -->
        <!-- <el-tab-pane label="请假事由">
          <div class="tab-content" v-if="tabState === '请假事由'" v-loading="loading" :class="{'loading': loading}">
            <leave-reason></leave-reason>
          </div>
        </el-tab-pane> -->
        <el-tab-pane label="系统设置">
          <div class="tab-content" v-if="tabState === '系统设置'" v-loading="loading" :class="{'loading': loading}">
            <system-set></system-set>
            <right-list></right-list>
          </div>
        </el-tab-pane>
      </el-tabs>
      <div v-if="recordBox">
        <el-dialog
                :title="'当前还有（' + leng +'）个待乘等待处理'"
                :visible="recordBox"
                width="38%"
                :close-on-click-modal="false"
                custom-class="box-card"
                @close="closeRecordBox">
          <el-card class="" v-for="(val,index) in unAllotBed" :key="val.sid">
            <div class="text item">
              <div class="photo">
                <img :src="'/api2/image?type=driver&fileName=' + val.fileName" alt="">
                <div>
                  <b>段别：</b>
                  <span v-text="val.ldName"></span>
                </div>
                <div>
                  <b>司机：</b>
                  <span v-text="val.name ? val.name : ''"></span>
                </div>
                <div>
                  <b>工号：</b>
                  <span v-text="val.workNo ? val.workNo : ''"></span>
                </div>
              </div>
              <div class="card-app">
                <p v-if="val.arrivalTrainNo">
                  <span>
                    <b>到达车次：</b>
                    <span>
                      <span v-text="val.arrivalTrainNo ? val.arrivalTrainNo + '  /' : ''"></span>
                      <span v-text="val.arrivalTrainDt ? val.arrivalTrainDt : ''"></span>
                    </span>
                  </span>
                </p>
                <p>
                    <b>接续车次：</b>
                    <span>
                      <el-autocomplete
                      v-if="val.trainType === 1"
                      class="inline-input"
                      style="width: 32%;margin-right:5px;"
                      v-model="val.trainNo"
                      :fetch-suggestions="querySearch"
                      placeholder="请输入内容"
                      :trigger-on-focus="true"
                      @select="handleSelect(val, index)"
                      value-key="trainNo"
                      @blur="emptyTime(index)">
                        <template slot-scope="props">
                          <span>{{props.item.trainNo }}</span>
                        </template>
                      </el-autocomplete>
                      <el-input v-if="val.trainType === 2" v-model="val.trainNo" placeholder="请输入内容" style="width: 32%"></el-input>
                      <span v-if="typeof isYunanSwitch === 'boolean' && !isYunanSwitch && val.trainType === 1">{{ val.trainDt}}</span>
                      <el-time-picker  v-if="typeof isYunanSwitch === 'boolean' && !isYunanSwitch && val.trainType === 2" v-model="val.trainDt" placeholder="选择时间" value-format="HH:mm" style="width: 32%;"></el-time-picker>
                    </span>
                </p>
                <p v-if="typeof isYunanSwitch === 'boolean' && isYunanSwitch">
                    <b>开行时间：</b>
                    <span>
                      <el-date-picker
                        v-model="val.trainDt"
                        type="datetime"
                        style="width: 54%;"
                        placeholder="选择日期时间"
                        >
                      </el-date-picker>
                    </span>
                </p>
                <p>
                  <b>铺位选择：</b>
                  <span>
                    <el-input v-model="val.bedNo" readonly placeholder="点击按钮选择铺位" style="width: 32%;margin-right:5px;"></el-input>
                    <bed-choose @chooseBed="chooseSelectBed" :allChoose="false" :index="index"></bed-choose>
                  </span>
                </p>
                <p>
                  <span> 
                    <b>叫班时间：</b>
                    <el-time-picker v-model="val.remindPlanedTime1" placeholder="选择时间" value-format="HH:mm" style="width: 32%" v-if="typeof isYunanSwitch === 'boolean' && !isYunanSwitch"></el-time-picker>
                    <el-date-picker
                      v-if="typeof isYunanSwitch === 'boolean' && isYunanSwitch"
                      v-model="val.remindPlanedTime1"
                      type="datetime"
                      style="width: 54%;"
                      placeholder="选择日期时间"
                      >
                    </el-date-picker>
                  </span>
                </p>
                <p>
                  <b>餐券：</b>
                  <span>
                    <el-input v-model="val.ticket1" placeholder="请输入内容" style="width: 32%"></el-input>
                  </span>
                </p>
                <p>
                  <b>自助办理时间：</b>
                  <span>{{ val.createdDt}}</span>
                </p>
              </div>
              <span slot="footer" class="dialog-footer" style="float: right;margin-bottom: 10px">
              <el-button type="primary" @click="remindPlanedTime1Change(val, index)">确 定</el-button>
              <el-button type="danger" @click="openCancelAllotBed(val, index)">取 消</el-button>
              </span>
            </div>
          </el-card>
        </el-dialog>
      </div>
      <div v-if="mustEndRecordState">
        <el-card class="must-end-record-box">
          <b class="font-color-red">以下车次已超出叫班时间，请及时处理！</b>
          <div class="clearfix">
            <el-button type="primary" @click="closeMustEndRecordBox">确 定</el-button>
          </div>
          <div>
            <el-table
              :data="mustEndRecordList"
              stripe
              :show-header="false"
              style="width: 100%"
              align="right">
              <el-table-column
                width="">
                <template slot-scope="scope">
                  <div v-text="'车次号：  ' + scope.row.rest.trainNo"></div>
                </template>
              </el-table-column>
              <el-table-column
                width="">
                <template slot-scope="scope">
                  <div v-text="'铺位号：  ' + scope.row.bedNo"></div>
                </template>
              </el-table-column>
              <el-table-column
                width="">
                <template slot-scope="scope">
                  <el-button type="text" @click="remindedDetailOpen(scope.row)">操作</el-button>
                </template>
              </el-table-column>
            </el-table>
          </div>
        </el-card>
      </div>
      <div v-if="registerShow" class="out-info-box">
        <el-dialog
          :title="'当前还有（' + registerLeng +'）人等待确认注册信息'"
          width="32%"
          :visible.sync="registerShow"
          :close-on-click-modal="false"
          :show-close="false" :close-on-press-escape="false">
            <el-card class="register" v-for="(val, index) in registerAuditVal" :key="index + 'key'">
            <div class="text item">
              <div class="photo">
                <img :src="'/api2/image?type=driver&fileName=' + val.fileName + '&now=' + now" alt="">
              </div>
              <div class="card-right">
                <p>
                  <span>
                    <b>机务段：</b>
                    <el-select v-model="val.ldName" placeholder="请选择" v-if="!val.readOnly">
                      <el-option
                        v-for="(item, index) in ldNameList"
                        :key="index + 'key'"
                        :label="item"
                        :value="item">
                      </el-option>
                    </el-select>
                    <span v-if="val.readOnly" v-text="val.ldName"></span>
                  </span>
                </p>
                <p>
                  <span>
                    <b>工号：</b>
                    <el-input type="text" v-model="val.workNo" v-if="!val.readOnly"></el-input>
                    <span v-if="val.readOnly" v-text="val.workNo"></span>
                  </span>
                </p>
                <p>
                  <b>姓名：</b>
                  <el-input type="text" v-model="val.name" v-if="!val.readOnly"></el-input>
                  <span v-if="val.readOnly" v-text="val.name"></span>
                </p>
                <p v-if="val.gbjb">
                  <span>
                    <b>职位：</b>
                    <el-select v-model="val.gbjb" placeholder="请选择" v-if="!val.readOnly">
                      <el-option
                        v-for="(item, index) in jobList"
                        :key="index + 'key'"
                        :label="item.label"
                        :value="item.value">
                      </el-option> 
                    </el-select>
                    <span v-if="val.readOnly" v-text="val.gbjb"></span>
                  </span>
                </p>
                <p>
                  <span>
                    <b>注册时间：</b>
                    <span v-text="val.createdDt"></span>
                  </span>
                </p>
                <span slot="footer" class="dialog-footer" style="float: right;margin-bottom: 10px">
                  <el-button type="primary" @click="confirmRegister(val, index)">确 定</el-button>
                  <el-button type="danger" @click="cancelRegister(val, index)">取 消</el-button>
                </span>
              </div>
            </div>
          </el-card>
        </el-dialog>
      </div>
      <div v-if="leaveBoxShow">
        <leave-box type="ws" :title="leaveTitle" :leaveState="leaveState" :leaveObj="leaveObj" @closeLeaveBox="closeLeaveBox" ></leave-box>
      </div>
      <div v-if="addBox">
        <add-inspection-box :addInspectionVo="addInspectionVo" @closeAddBox="closeAddBox" type="ws"></add-inspection-box>
      </div>
    </div>
    <span style="display: none" v-html="audioURL">
    </span>
    <div v-if="remindedDetailBox">
      <rest-detail :remindedDetailBox="remindedDetailBox" :remindedDetail="remindedDetail" :leaveRes="leaveRes" @closeRestDetailBox="closeRestDetailBox"></rest-detail>
    </div>
    <transition name="el-fade-in-linear">
      <div @click="backTopFunc" class="backTopClass" v-show="backTop" title="返回顶部">
        <img src="../assets/img/back-top.png" alt="  ">
      </div>
    </transition>
  </div>
</template>

<script>
import cookie from '../components/cookie'
import {mapState} from 'vuex'
import {mapGetters} from 'vuex'
import config from '../public/config'
import bedChoose from '../components/bedChoose'
import controllerCenter from './controllerCenter'
import controllerCenter2 from './controllerCenter2'
import systemSet from './systemSet'
import bunkAdmin from './bunkAdmin'
import dataQuery from './dataQuery'
import trainPlan from './trainPlan'
import eventData from './eventData'
import rightList from './rightList'
import driver from './driver'
import inspectionAdmin from './inspectionAdmin'
import inspection from './inspection'
import leave from './leave'
import changeShift from './changeShift'
import abnormalRecordQuery from './abnormalRecordQuery'
import user from './user'
import leaveBox from '../components/leaveBox'
import addInspectionBox from "../components/addInspectionBox"
import restDetail from '../components/restDetail.vue'
import userOperationRecord from "./userOperationRecord"
// import leaveReason from "./leaveReason"
// import role from './role'

export default {
  name: "app",
  data () {
    return {
      tabState: '控制中心',
      navIndex: '0',
      date: '',
      warnCollapse: ['1', '2'],
      now: new Date().getTime(),
      remindedDetailBox: false,
      remindedDetail: {},
      leaveRes: {},
      rightAbsentData: [],
      rightNotwearingData: [],
      timeDifference: 0
    }
  },
  created () {
    this.$store.dispatch('getSysInfoS')
  },
  mounted () {
    this.$store.commit('setUserName', cookie.getCookie())
    this.getDateFuc()
    this.getInitConfig()
    // console.log('我在app')
    window.addEventListener('scroll', this.handleScroll)
    setInterval(() => {
      this.$store.commit('mustEndRecord')
    }, 120000)
    setInterval(() => {
      this.getDateFuc() 
    }, 1000)
  },
  components: {
    config,
    bedChoose,
    controllerCenter,
    controllerCenter2,
    systemSet,
    bunkAdmin,
    dataQuery,
    trainPlan,
    eventData,
    rightList,
    driver,
    inspectionAdmin,
    inspection,
    leave,
    changeShift,
    abnormalRecordQuery,
    user,
    leaveBox,
    addInspectionBox,
    userOperationRecord,
    restDetail,
    // leaveReason,
    // role,
  },
  computed: {
    ...mapState(['timerList', 'interval', 'timeout', 'reportTimeTolerance', 'restRemindSwitch', 'startTime', 'userNo', 'jobList', 'username', 'addBox', 'addInspectionVo', 'leaveBoxShow', 'leaveTitle', 'leaveState', 'leaveObj', 'refreshRight', 'supportingFaceFeature', 'leftList', 'registerShow', 'registerAuditVal', 'ldNameList', 'leftBedList', 'timeAhead', 'recordBox', 'unAllotBed', 'noBed', 'outInfoVal', 'mustEndRecordList', 'driverLateList', 'mustEndRecordState', 'audioURL', 'name', 'loading', 'backTop', 'isYunanSwitch']),
    ...mapGetters(['leng', 'registerLeng']),
  },
  watch: {  
    outInfoVal: 'outInfoBox',
    registerShow: function () {
      if (this.registerShow) {
        this.now = new Date().getTime()
      }
    }
  },
  methods: {
    //  未处理待乘点击操作调用的方法
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
    remindedDetailOpen (val) {
      this.timeDifference = this.timeout + this.reportTimeTolerance
      if (val.rest) {
        this.remindedDetailBox = true
        this.$store.commit('loadingChangeTrue')
        this.remindedDetail = JSON.parse(JSON.stringify(val))
        if (this.remindedDetail.rest.holidayType) {
          this.getLeaveBack(this.remindedDetail.rest.sid)
        }
        if (this.remindedDetail.status === 24) {
          let timer = this.timerList[this.remindedDetail.bedSid].timer - this.timeDifference
          this.$set(this.remindedDetail.rest, 'timer', timer)
          this.$store.commit('clearAudioURL')
        } else if (this.remindedDetail.status === 23) {
          let timer = this.timerList[this.remindedDetail.bedSid].timer - this.timeDifference - (this.interval * 3)
          this.$set(this.remindedDetail.rest, 'timer', timer)
          this.$store.commit('clearAudioURL')
        }
        let self = this
        let value = this.remindedDetail
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
    logout () {
      this.axios({
        method: 'post',
        url: '/api2/account/logout',
        data: {}
      }).then((res) => {
        let data = res.data
        if (data.type === 1) {
          this.$router.push({path: '/login'})
          cookie.delCookie(this.username)
          this.$message.success('退出登陆成功')
        } else {
          this.$message.error('退出登陆失败')
        }
      }).catch((err) => {
        console.log('请求/api2/account/logout注销登陆接口失败', err)
      })
    },
    closeAddBox () {
      this.$store.commit('closeAddBox')
    },
    closeLeaveBox () {
      this.$store.commit('closeLeaveBox') 
    },
    getDateFuc () {
      this.date = this.moment().format('HH:mm:ss')
    },
    backTopFunc () {
      this.$store.dispatch('backTopFunc')
    },
    debounceFunc () {  //执行方法
      this.$store.commit('handleScroll') 
    },
    handleScroll: config.debounce(function () {   //调用防抖函数
      this.debounceFunc()
    }, 300),
    confirmRegister (val, index) {
      if (val.workNo) {
        if (!config.validateWorkNo(val.workNo)) {
          this.$message.error('工号必须是七位数字')
          return
        }
      }
      let url = '/api2/cadre/cadreRegister/confirm'
      this.axios({
        url: url,
        method: 'post',
        data: val
      }).then((res) => {
        let data = res.data
        if (data.type === 1) {
          this.$store.commit('delRegisterVal', index)
          if (val.gbjb) {
            this.$message.success(`${val.gbjb}${val.name}（${val.workNo}）注册成功`)
            this.$store.dispatch('getInspectionList')
            this.$store.dispatch('getAllDriverList')
          } else {
            this.$message.success(`司机${val.name}（${val.workNo}）注册成功`)
            this.$store.dispatch('getAllDriverList')
          }
          if (this.registerAuditVal.length === 0) {
            this.$store.commit('closeRegisterBox')
          }
        } else {
          this.$message.error('注册失败')
          console.log('注册失败原因', data.msg)
        }
      }).catch((err) => {
        console.log('确认注册请求失败', err)
      })
    },
    cancelRegister (val, index) {
      let url = '/api2/cadre/cadreRegister/reject'
      this.$confirm('确定取消该条注册信息吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.axios({
          url: url,
          method: 'get',
          params: {'key': val.key}
        }).then((res) => {
          let data = res.data
          if (data.type === 1) {
            this.$store.commit('delRegisterVal', index)
            if (this.registerAuditVal.length === 0) {
              this.$store.commit('closeRegisterBox')
            }
            this.$message({
              type: 'success',
              message: '取消注册成功!'
            });
          }
        }).catch((err) => {
          console.log('取消注册请求失败', err)
        })
      }).catch(() => {
      });
    },
    emptyTime (index) {
      if (this.empty) {
        this.unAllotBed[index].trainDt = ''
        this.unAllotBed[index].remindPlanedTime1 = ''
      }
    },
    querySearch(queryString, cb) {  // 自动补全框方法
      var restaurants = this.leftList.notArrangedList
      var results = queryString ? restaurants.filter(this.createFilter(queryString)) : restaurants;
      // 调用 callback 返回建议列表的数据
      cb(results);
      if (!results || results.length === 0) {
        this.empty = true
      } else {
        this.empty = false
      }
    },
    createFilter(queryString) {
      return (restaurant) => {
        return (restaurant.trainNo.toLowerCase().indexOf(queryString.toLowerCase()) > -1);
      };
    },
    handleSelect(item, index) {
      this.$set(this.unAllotBed[index], 'trainNo', item.trainNo)
      this.$set(this.unAllotBed[index], 'trainDt', this.leftBedList[item.trainNo].trainDt)
      let req = config.remindPlanedTimeConfig(this.leftBedList[item.trainNo].trainDt, this.leftBedList[item.trainNo].remindPlanedTime1, this.leftBedList[item.trainNo].restHour)
      this.$set(this.unAllotBed[index], 'remindPlanedTime1', req.remindPlanedTime1)
      if (this.restRemindSwitch) {
        if (this.unAllotBed[index].remindPlanedTime1 != this.leftBedList[item.trainNo].remindPlanedTime1) {
          this.$set(this.unAllotBed[index], 'lateFlag', true)
        } else {
          this.$set(this.unAllotBed[index], 'lateFlag', false)
        }
      }
    },
    getInitConfig () {  // 调用vuex里需预先加载的方法的方法
      this.$store.commit('getCookie')
      this.$store.dispatch('getDevicesBattery')
      this.$store.dispatch('getRightList')
      this.$store.dispatch('getLeftList')
      this.$store.dispatch('getNoBed')
      this.$store.dispatch('getOldRecord')
      this.$store.dispatch('getOldRegister')
      this.$store.dispatch('getOldInspection')
      this.$store.dispatch('getOldLeave')
      this.$store.dispatch('getOldLeaveBack')
      this.$store.dispatch('getLdNameList')
      this.$store.dispatch('getInspectionList')
      this.$store.dispatch('getAllDriverList')
      this.$store.dispatch('getUserList')
      this.$store.dispatch('getReasonList')
      this.$store.dispatch('getUserTypeList')
      this.$store.dispatch('getJobList')
      
    },
    tabChange (val) {
      if (this.tabState === val.label) {
        return
      }
      this.$store.commit('loadingChangeTrue')
      this.tabState = val.label
      document.documentElement.scrollTop = 0
    },
    closeRecordBox () {
      this.$store.commit('changeRecordBoxStateFalse')
    },
    remindPlanedTime1Change (val, index) {
      for (let i = 0; i < this.noBed.length; i++) {
        if (val.bedNo === this.noBed[i].bedNo) {
          val.bedSid = this.noBed[i].bedSid
        }
      }
      if (!val.trainNo) {
        this.$message.error('请填写接续车次！')
        return
      }
      if (!val.sid || !val.bedSid || !val.bedNo ) {
        this.$message.error('请选择铺位！')
        return
      } 
      if (!val.trainDt) {
        this.$message.error('请填写出行时间！')
        return
      }
      if (!val.remindPlanedTime1) {
        this.$message.error('请填写叫班时间！')
        return
      }
      if (typeof this.isYunanSwitch === 'boolean' && !this.isYunanSwitch && this.restRemindSwitch) {
       this.$alert(`休息时间不足，现已调整到${val.remindPlanedTime1}叫班，请注意确认叫班时间!`, '提示', {
          confirmButtonText: '确定',
          callback: () => {
            let hour = new Date().getHours()
            let minutes = new Date().getMinutes()
            let timeHour = val.remindPlanedTime1.split(':')[0]
            let timeMinutes = val.remindPlanedTime1.split(':')[1]
            if (hour > timeHour) {
              return this.remindPlanedTime1Msg(val, index)
            } else if (hour == timeHour) {
              if (minutes > timeMinutes || minutes == timeMinutes) {
                return this.remindPlanedTime1Msg(val, index)
              } else {
                this.allotBed(val, index)
              }
            } else {
              this.allotBed(val, index)
            }
          }
        }); 
      } else if (typeof this.isYunanSwitch === 'boolean' && !this.isYunanSwitch && !this.restRemindSwitch) {
        let hour = new Date().getHours()
        let minutes = new Date().getMinutes()
        let timeHour = val.remindPlanedTime1.split(':')[0]
        let timeMinutes = val.remindPlanedTime1.split(':')[1]
        if (hour > timeHour) {
          return this.remindPlanedTime1Msg(val, index)
        } else if (hour == timeHour) {
          if (minutes > timeMinutes || minutes == timeMinutes) {
            return this.remindPlanedTime1Msg(val, index)
          } else {
            this.allotBed(val, index)
          }
        } else {
          this.allotBed(val, index)
        }
      } else if (typeof this.isYunanSwitch === 'boolean' && this.isYunanSwitch) {
        val.remindPlanedTime1 = this.moment(val.remindPlanedTime1).format('YYYY-MM-DD HH:mm:ss')
        this.allotBed(val, index)
      }
    },
    remindPlanedTime1Msg (val,index) {
      let self = this
      this.$confirm('当前选择的叫班时间是明天, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        self.allotBed(val, index)
      }).catch(() => {
        this.$message.info('请重新输入时间')
      });
    },
    chooseSelectBed (bunk, index) {
      this.$set(this.unAllotBed[index], 'bedNo', bunk.bedNo)
      this.$set(this.unAllotBed[index], 'bedSid', bunk.bedSid)
    },
    openCancelAllotBed (val, index) {
      this.$confirm('确认删除本条待乘？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.axios({
          method: 'get',
          params: {'sid': val.sid},
          url: '/api2/record/cancel'
        }).then((r) => {
          if (r.data.type === 1) {
            this.$store.commit('delUnAllotBed', index)
            if (this.leng === 0) {
              this.$store.commit('changeRecordBoxStateFalse')
            }
            this.$message({
              type: 'success',
              message: '删除成功!'
            });
          } else {
            this.$message.error(r.data.msg)
          } 
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    allotBed (val, index) {
      this.axios({
          method: 'post',
          data: val,
          url: '/api2/face-feature/allot-bed'
      }).then((r) => {
        if (r.data.type === 1) {
          this.$message.success(`铺位${val.bedNo}分配成功`)
        } else if (r.data.type === 4001){
          this.$message.error(`铺位${val.bedNo}正在使用`)
        }
      })
    },
    outInfoBox() {
      this.$notify.info({
        title: '消息',
        customClass: 'msg-box',
        message: `<div class="text item">
          <div class="photo">
            <img src="/api2/image?type=driver&fileName=${this.outInfoVal.photoOut}" alt="">
          </div>
          <div class="card-left">
            <p>
              <span>
                <span>司机：</span>
                <span>${this.outInfoVal.name}（${this.outInfoVal.workNo}）</span>
              </span>
            </p>
            <p>
                <span>
                <span>段别：</span>
                <span>${this.outInfoVal.ldName}</span>
              </span>
            </p>
            <p>
              <span>
                <span>车次：</span>
                <span>${this.outInfoVal.trainNo}</span>
              </span>
            </p>
            <p>
              <span>
                <span>铺位：</span>
                <span>${this.outInfoVal.bedNo}</span>
              </span>
            </p>
            <p>
                <span>
                <span>开车时间：</span>
                <span>${this.outInfoVal.trainDt}</span>
              </span>
            </p>
            <p>
              <span>
                <span>自助办理时间：</span>
                <span>${this.outInfoVal.createdDt}</span>
              </span>
            </p>
            <p>
              <span>
                <span>自助离寓时间：</span>
                <span>${this.outInfoVal.endRealTime}</span>
              </span>
            </p>
          </div>`,
        duration: 0,
        dangerouslyUseHTMLString: true,
        position: 'top-left'
      });
    },
    closeMustEndRecordBox () {
      this.$store.commit('closeMustEndRecordBox')
    }
  }
};
</script>

<style>
</style>  
