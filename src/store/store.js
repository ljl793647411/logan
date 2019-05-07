import vuex from 'vuex'
import axios from 'axios'
import moment from 'moment'
import config from '../public/config.vue'

export default () => {
  return new vuex.Store({
    state: {
      startTime: '',   // 测试userno的字段，过后无用
      isYunanSwitch: '',   // 是否为运安对接版本
      username: '',  // 用户名名称
      userTypeList: '',    // 用户名类型
      backTop: false,  //返回顶部开关
      name: '', //待乘室名称
      restSwitch: true,   //待乘功能开关
      lateSwitch: false,   //迟到功能开关
      restRemindSwitch: false,  // 休息时长不足提醒开关
      hideFinishedList: true, // 控制中心已结束列显示或隐藏
      displayAllTrain: false,  // 过夜开关，是否默认显示所有未安排车次列表
      supportDisplayCompletePlan: false,  // 是否默认显示所有车次列表
      colorList: [], //系统设置里铺位颜色列表
      driverLateList: [], // 司机未按时入寓列表
      deviceLowBatteryThreshold: 0, // 设备低电量阈值
      supportingFaceFeature: false,
      supportingWearing: false,// 是否支持离手检测
      loading: false,  //加载动画
      driverAppFullSyncTime: '', //全量同步时间
      sysObject: {},  //系统设置对象
      timeAhead: 0,   // 系统叫班时间间隔
      interval: 0, // 两次叫班时间间隔
      timeout: 0,   // 响应超时时间（秒）：
      reportTimeTolerance: 0,   // 容错时间（秒）：
      serverIp: '',  // 获取系统设置里的ip
      ldNameList: [],  // 所有段别列表
      refreshRight: 0,  // 刷新右侧列表轮询时间
      refreshRightTiming: 0, // 刷新右侧列表循环函数时间
      refreshLeft: 0,  // 刷新右侧列表轮询时间
      refreshLeftTiming: 0, // 刷新右侧列表循环函数时间
      leftList: {  //  左侧列表
        servedDriverNum: 0,  // 接待司机数
        responseRate: 0,  // 交班响应率
        inTimeRate: 0,   // 出发及时率
        bedNosList: [],   //剩余未安排铺位列表
        notFinishedList: [],  // 已安排未结束列表
        notArrangedList: [],  // 未安排列表
        completedList: [],  // 已结束列表
      },
      timerList: [],    //所以需要timer++的数据，左侧列表需要
      leftBedList: [], // 左侧列表未安排，key为trainNo。val为车次对象
      notArrangedIsTodayList: [],  // 未安排今天列表
      notArrangedIsTomorrowList: [],  // 未安排昨天列表
      rightList: {},
      rightSummary: {},
      offline: 12,
      restWaitingForManual: 0,
      cookie: '',  //设置cookie
      guid: '',   // 随机的guid码
      mustEndRecordList: [],
      mustEndRecordState: false,
      recordBox: false, // 自助办理列表盒子
      unAllotBed: [],  // 自助办理未分配列表
      noBed: [], // 获取所有铺位列表,
      outInfoState: false, //离寓ws关闭后的是否继续循环的状态
      outInfows: {},   //ws离寓连接名称
      outInfoPing: 0, //  ws离寓send ping
      outInfoMs: 0, //  ws离寓close interval
      outInfoVal: {}, //  ws离寓接收到的data
      recordState: false, //自助出勤ws关闭后的是否继续循环的状态
      recordws: {},   //ws自助出勤连接名称
      sendPingAuto: 0, //  ws离寓send ping
      auto: 0, //  ws自助出勤close interval\
      alarmState: false, //自助出勤ws关闭后的是否继续循环的状态
      ararmWs: {},   //ws音频告警连接名称
      sendPingAlarm: 0, //  ws音频告警send ping
      alarmMs: 0, //  ws音频告警close interval
      alarmSing: '',  // 音频信息
      countDownInterval: 0, //倒计时时间函数
      wifiCountDownInterval: 0, //电池信息wifi计时时间函数
      audioURL: '',  //音频地址
      audioDuration: 0,  // 唱歌时间间隔
      audioTimeInterval: 0,   //唱歌时间间隔循环
      registerShow: false,  //  注册弹窗开关
      registerAuditVal: [],  //  注册列表
      batteryList: {},   //右侧电量列表
      refreshBatteryTiming: 0, // 右侧电量时间间隔循环
      refreshBattery: 0,  // 右侧电量请求计时秒数
      rightFixedState: false,  // 右侧列表icon栏样式开关
      leaveTitle: '',   // ws请销假窗口title
      leaveObj: {},   //  ws请销假发送对象
      leaveState: true,   //ws请销假状态判断是请假还是销假
      leaveBoxShow: false,  // ws请销假窗口是否显示
      userList: [],   // 干部列表
      addBox: false,  // 待乘巡检盒子显示
      addInspectionVo: {}, // ws待乘巡检参数
      userLists: [],  // 管理员列表列表,
      jobList: [],  //  职位列表   ar
      leaveReasonList: [],  // 请假事由列表1
      allDriverList: [],   // 所有司机列表
      taskList: [],    // 交路列表
    }, 
    getters: {
      notArrangedNum: (state) => {
        return state.leftList.notArrangedList.length
      },
      completedNum: (state) => {
        return state.leftList.completedList.length
      },
      notFinishedNum: (state) => {
        return state.leftList.notFinishedList.length
      },
      notArrangedIsTodayNum: (state) => {
        return state.notArrangedIsTodayList.length
      },
      notArrangedIsTomorrowNum: (state) => {
        return state.notArrangedIsTomorrowList.length
      },
      leng: (state) => {
        return state.unAllotBed.length
      },
      registerLeng: (state) => {
        return state.registerAuditVal.length
      },
      driverLateListLength: (state) => {
        let arr = 0
        for (let i in state.leftList.notFinishedList) {
          if (state.leftList.notFinishedList[i].lateFlag) {
            arr++
          }
        }
        return arr
      }
     
    },
    mutations: {
      changeRecordBoxStateTrue (state) {
        state.recordBox = true
      },
      changeRecordBoxStateFalse (state) {
        state.recordBox = false
      },
      isTodayOrIsTomorrow (state, num) {
        state.notArrangedIsTodayList = []
        state.notArrangedIsTomorrowList = []
        state.driverLateList = []
        let now = moment().format('HH:mm')
        let nowMs = moment().valueOf()
        let hours = now.split(':')[0]
        let minute = now.split(':')[1]
        // let arr = []
        for (let i in state.leftList.notArrangedList) {
          let notArrHours = state.leftList.notArrangedList[i].remindDt.split(':')[0]
          let notArrMinute = state.leftList.notArrangedList[i].remindDt.split(':')[1]
          let notError = moment(state.leftList.notArrangedList[i].planedArriveTime).valueOf()
          if (state.lateSwitch) {
            if (state.leftList.notArrangedList[i].rested) {
              state.leftList.notArrangedList[i].isError = false
            } else {
              if (nowMs > notError) {
                state.leftList.notArrangedList[i].isError = true
                if (!state.leftList.notArrangedList[i].stop) {
                  state.driverLateList.unshift(state.leftList.notArrangedList[i])
                }
              } else {
                state.leftList.notArrangedList[i].isError = false
              }
            }
          }
          if (hours > notArrHours) {
            state.leftList.notArrangedList[i].isTomorrow = true
            if (!state.leftList.notArrangedList[i].isError) {
              state.notArrangedIsTomorrowList.push(state.leftList.notArrangedList[i])
            }
          } else if (hours == notArrHours) {
            if (minute > notArrMinute) {
              state.leftList.notArrangedList[i].isTomorrow = true
              if (!state.leftList.notArrangedList[i].isError) {
                state.notArrangedIsTomorrowList.push(state.leftList.notArrangedList[i])
              }
            } else {
              state.leftList.notArrangedList[i].isTomorrow = false
              if (!state.leftList.notArrangedList[i].isError) {
                state.notArrangedIsTodayList.push(state.leftList.notArrangedList[i])
              }
            }
          } else {
            state.leftList.notArrangedList[i].isTomorrow = false
            if (!state.leftList.notArrangedList[i].isError) {
              state.notArrangedIsTodayList.push(state.leftList.notArrangedList[i])
            }
          }
        }
        if (state.lateSwitch) {
          for (let i in state.driverLateList) {
            state.notArrangedIsTodayList.unshift(state.driverLateList[i])
          }
        }
        // state.notArrangedIsTodayList.splice(20 * num,state.notArrangedIsTodayList.length-(20*num))
        console.log('重新计算左侧未安排列表') 
        // console.log('迟到有几个', state.driverLateList.length)
        // console.log('今天有几个', state.notArrangedIsTodayList.length)
        // console.log('名天有几个', state.notArrangedIsTomorrowList.length)
        // console.log('除了今天明天的的有几个',arr.length)
        // console.log('未待乘并且没迟到的有几个',arr1.length)
        // console.log('迟到列表', state.driverLateList)
        // console.log('迟到列表', state.driverLateList.length)
        // console.log('停运列表', arr3.length)
        // console.log('未待乘的的有几个',arr2.length)
        // console.log('停运列表', arr.length)
        // console.log('停运列表', arr)


        // console.log('今天', state.notArrangedIsTodayList)
        // console.log('明天', state.notArrangedIsTomorrowList)
      },
      delUnAllotBed (state, index) {
        state.unAllotBed.splice(index, 1)
      },
      getCookie (state) {
        this.dispatch('guid')
        var cookieArray = document.cookie.split(";")
        for (let i in cookieArray) {
          if (cookieArray[i].split('=')[0].trim() === 'Mid') {
            console.log('Mid = ', cookieArray[i].split('=')[1])
            state.cookie = cookieArray[i].split('=')[1]
            break
          }
          if (i == cookieArray.length - 1) {
            document.cookie = "Mid=" + state.guid
            this.commit('getCookie')
          }
        }
      },
      mustEndRecord (state) {
        state.mustEndRecordList = []
        state.mustEndRecordState = false
        for (let i in state.rightList) { // 寻找所有已经超过最后时间但是待乘没有结束的铺位
          if (state.rightList[i].rest && state.rightList[i].rest.endTimeout) { //
            state.mustEndRecordList.push(state.rightList[i])
            state.mustEndRecordState = true
          }
        }
      },
      closeMustEndRecordBox (state) {
        state.mustEndRecordList = []
        state.mustEndRecordState = false
      },
      rightListCount (state) {
        state.timerList = []
        for (let i in state.rightList) {
          let rest = state.rightList[i]
          let nowTime = moment().valueOf()
          if (state.rightList[i].rest) {
            let remind = moment(rest.rest.remindPlanedTime).valueOf()
            rest.rest.timer = moment(Math.floor((nowTime - remind) / 1000)).valueOf()
            state.timerList[state.rightList[i].bedSid] = state.rightList[i].rest
          }
        }
        // console.log('timer列表', state.timerList)
        this.dispatch('timerUpSyns') 
      },
      timerUp (state) {
        for (let i in state.rightList) {
          let bed = state.rightList[i]
          if (bed.rest) {
            bed.rest.timer++
            // console.log('被调用，开始循环', bed.rest.timer)
          }
        }
      },
      batteryTimerUp (state) {
        for (let i in state.batteryList.map) {
          if (state.batteryList.map[i].offline) {
            state.batteryList.map[i].timer++
          }
        }
      },
      getAudio (state, val) {
        if (val === 1) {
          state.audioURL = '<video style="display: none" controls="" autoplay="" name="media"><source src="/audio/adCallBunk.mp3" type="audio/mpeg"></video>'
          this.dispatch('syns', 5500)
        } else if (val === 2) {
          state.audioURL = '<video style="display: none" controls="" autoplay="" name="media"><source src="/audio/callbed.mp3" type="audio/mpeg"></video>'
          this.dispatch('syns', 34000)
        } else if (val === 3) {
          state.audioURL = '<video style="display: none" controls="" autoplay="" name="media"><source src="/audio/callbunk.mp3" type="audio/mpeg"></video>'
          this.dispatch('syns', 4500)
        }
      },
      stopAudio (state) {
        state.audioURL = ''
      },
      clearAudioURL (state) {
        state.audioURL = ''
        state.audioDuration = 0
        this.dispatch('audioDurationUpSys')
      },
      audioDurationUp (state) {
        state.audioDuration++
      },
      getLeftBedList (state) {
        for (let i in state.leftList.notArrangedList) {
          state.leftBedList[state.leftList.notArrangedList[i].trainNo] = state.leftList.notArrangedList[i]
        }
      },
      addRegisterVal (state, val) {
        state.registerAuditVal.push(val)
      },
      delRegisterVal (state, index) {
        state.registerAuditVal.splice(index, 1)
      },
      closeRegisterBox (state) {
        state.registerShow = false
      },
      openRegisterBox (state) {
        state.registerShow = true
      },
      assignRightList (state, data) {
        // console.log('右侧列表赋值', data)
        state.rightList = data.list
        state.rightSummary = data.summary
        state.restWaitingForManual = data.summary.restWaitingForManual
        clearInterval(state.countDownInterval)
        // console.log('右侧清楚倒计时', state.countDownInterval)
        clearInterval(state.refreshRightTiming)
        // console.log('右侧清除60s循环请求', state.refreshRightTiming)
        state.refreshRight = 0
        this.commit('rightListCount')
        this.dispatch('getRefreshRightTiming')
        if (state.mustEndRecordList.length > 0) {
          this.commit('mustEndRecord')
        }
      },
      assignLeftList (state, data) {
        // console.log('左侧列表赋值', data)
        state.leftList = data
        if (!state.isYunanSwitch) {
          for(let i = 0; i < data.notArrangedList.length; i++) {
            state.leftList.notArrangedList[i].remindPlanedTime1 = data.notArrangedList[i].remindDt
            state.leftList.notArrangedList[i].driverName = ''
          }
        }
        console.log('开始赋值')
        state.leftList.servedDriverNum = data.servedDriverNum
        state.leftList.responseRate = data.responseRate
        state.leftList.inTimeRate = data.inTimeRate
        state.leftList.bedNosList = data.bedNos
        state.leftList.completedList = data.completedList
        state.leftList.notFinishedList = data.notFinishedList
        state.leftList.notArrangedList = state.isYunanSwitch ? data.notArrangedListYunan : data.notArrangedList
        // clearInterval(state.countDownInterval)z
        // console.log('左侧清楚倒计时', state.countDownInterval)
        clearInterval(state.refreshLeftTiming)
        // console.log('左侧清除60s循环请求', state.refreshRightTiming)
        state.refreshLeft = 0
        if (!state.isYunanSwitch) {
          setTimeout(() => {
            this.commit('isTodayOrIsTomorrow')
          }, 10);
        } else {
          this.commit('isErrorChange')
        }
        this.commit('getLeftBedList')
        this.dispatch('getRefreshLeftTiming')
      },
      isErrorChange (state) {
        let nowMs = moment().valueOf()
        for (let i in state.leftList.notArrangedList) {
          let planlivehousetimeMs = moment(state.leftList.notArrangedList[i].planlivehousetime).valueOf()
          if (planlivehousetimeMs && planlivehousetimeMs > nowMs) {
            state.leftList.notArrangedList[i].isError = false
          } else if (planlivehousetimeMs && planlivehousetimeMs < nowMs) {
            state.leftList.notArrangedList[i].isError = true
          }
        }
      },
      loadingChangeTrue (state) {
        state.loading = true
      },
      loadingChangeFalse (state) {
        state.loading = false
      },
      backTopTrue (state) {
        state.backTop = true
        state.rightFixedState = true
      },
      backTopFalse (state) {
        state.backTop = false
        state.rightFixedState = false
      },
      getBatteryList (state, data) {
        clearInterval(state.wifiCountDownInterval)
        for (let i in data.map) {
          let nowTime = moment().valueOf()
          if (!data.map[i].mid || data.map[i].mid.battery === -1 || data.map[i].mid.charging === -1) {
            return
          }
          data.map[i].height = data.map[i].battery + '%'
          if (data.map[i].offline) {
            let remindMobile = moment(data.map[i].offlineDt).valueOf()
            data.map[i].timer = moment(Math.floor((nowTime - remindMobile) / 1000)).valueOf()
          }
        }
        this.dispatch('batteryTimerUpSyns') 
        clearInterval(state.refreshBatteryTiming)
        state.refreshBattery = 0
        this.dispatch('getRefreshBatteryTiming')
        state.batteryList = data
        state.offline = data.offline
      },
      handleScroll (state) {
        let scrollTop = document.documentElement.scrollTop || document.body.scrollTop
        // let clientHeight = document.documentElement.clientHeight || document.body.clientHeight
        // let scrollHeight = document.documentElement.scrollHeight || document.body.scrollHeight
        if (scrollTop > 200 && scrollTop < 290) {
          return
        } else if (scrollTop > 200) {
          this.commit('backTopTrue')
        } else {
          this.commit('backTopFalse')
        }
      },
      rightBackTop () {
        document.documentElement.scrollTop = 0
      },
      leaveToOrBack (state, data) {   //  ws请假方法
        state.leaveObj = data
        state.leaveBoxShow = true
        if (!state.leaveObj.hyTime) {
          state.leaveTitle = "请假" 
          state.leaveState = true
        } else {
          state.leaveTitle = "销假"
          state.leaveState = false 
        }
      },
      closeLeaveBox (state) {  // ws关闭请假窗口
        state.leaveBoxShow = false
        state.leaveObj = {}
        state.leaveTitle = ""
        state.leaveState = true
      },
      inspenctionVo (state, data) {
        state.addBox = true
        state.addInspectionVo = data
      },
      closeAddBox (state) {
        state.addBox = false
        state.addInspectionVo = {}
      },
      setUserName (state, name) {  // 获取登录者用户名
        state.username = name
      },
      changeRemind (state, data) {  // 验证自助办理入寓的叫班时间是否需要更改（休息时长是否够一小时）
        let req = config.remindPlanedTimeConfig(state.leftBedList[data.trainNo].trainDt, state.leftBedList[data.trainNo].remindPlanedTime1, state.leftBedList[data.trainNo].restHour)
        if (state.restRemindSwitch) {
          if (data.remindPlanedTime1 != req.remindPlanedTime1) {
            data.lateFlag = true
            data.remindPlanedTime1 = req.remindPlanedTime1
          } else {
            data.lateFlag = false
          }
        }
      },
      mapTaskList (state, data) {
        if (data && data.length > 0) {
          state.taskList = data.map((item) => {
            return {
              'text': item.taskdicname,
              'value': item.taskdicid,
            }
          })
        }
      }
    },
    actions: {
      getTaskList (store) { 
        axios({
          method: 'get',
          url: '/web/findAllTask',
          headers: {'appType': 'web','appid': 'logan'}
        })
        .then((response) => {
          var data = response.data
          if (data.type == 1) {
            this.commit('mapTaskList', data.result)
          }
        }).catch((error) => {
          console.log('用户列表请求发送失败原因', error)
        })
      },
      getInspectionList (store) { 
        axios({
          method: 'get',
          url: '/api2/user/listAll',
          headers: {'appType': 'web','appid': 'logan'}
        })
        .then((response) => {
          var data = response.data
          if (data.type == 1) {
            store.state.userList = data.result
          }
        }).catch((error) => {
          console.log('用户列表请求发送失败原因', error)
        })
      },
      getAllDriverList (store) { 
        axios({
          method: 'get',
          url: '/api2/driver/listAll',
          params: {'driverType': 2},
          headers: {'appType': 'web','appid': 'logan'}
        })
        .then((response) => {
          var data = response.data
          if (data.type == 1) {
            store.state.allDriverList = data.result
          }
        }).catch((error) => {
          console.log('司机列表请求发送失败原因', error)
        })
      },
      getUserList (store) { 
        axios({
          method: 'post', 
          url: '/api2/user/list',
          data: {},
          headers: {'appType': 'web','appid': 'logan'}
        })
        .then((response) => {
          var data = response.data
          if (data.type == 1) {
            store.state.userLists = data.result.resultList
          }
        }).catch((error) => {
          console.log('用户列表请求发送失败原因', error)
        })
      },
      getReasonList (store) { 
        axios({
          method: 'get',
          url: '/api2/reason/list',
          headers: {'appType': 'web','appid': 'logan'}
        })
        .then((response) => {
          var data = response.data
          if (data.type == 1) {
            store.state.leaveReasonList = data.result
            store.state.leaveReasonList.push({
              'value': '其他',
              'label': '其他'
            })
          }
        }).catch((error) => {
          console.log('请假事由列表请求发送失败原因', error)
        })
      },
      getJobList (store) { 
        axios({
          method: 'get',
          url: '/api2/job/list',
          headers: {'appType': 'web','appid': 'logan'}
        })
        .then((response) => {
          var data = response.data
          if (data.type == 1) {
            store.state.jobList = data.result
          }
        }).catch((error) => {
          console.log('职位列表请求发送失败原因', error)
        })
      },
      getUserTypeList (store) { 
        axios({
          method: 'get',
          url: '/api2/user/type/list',
          headers: {'appType': 'web','appid': 'logan'}
        })
        .then((response) => {
          var data = response.data
          if (data.type == 1) {
            store.state.userTypeList = data.result
          }
        }).catch((error) => {
          console.log('用户type列表请求发送失败原因', error)
        })
      },
      getSysInfoS (store, num) {//接口22，获取系统设置
        store.commit('loadingChangeTrue')
	  	  axios({
	  	  	method: 'get',
	  	  	url: '/web/load-config',
	  	  	headers: {'appType': 'web','appid': 'logan'}
        }).then((response) => {
          var data = response.data
	  	  	if (data.type == 1) {
            store.state.sysObject = data.result
            store.state.colorList = data.result.colorIndexMemos
            store.state.restSwitch = data.result.restSwitch
            store.state.lateSwitch = data.result.lateSwitch  
            store.state.hideFinishedList = data.result.hideFinishedList
            store.state.restRemindSwitch = data.result.restRemindSwitch
            store.state.serverIp = data.result.serverIp
            store.state.name = data.result.name
            store.state.timeAhead = data.result.timeAhead
            store.state.driverAppFullSyncTime = data.result.driverAppFullSyncTime
            store.state.supportingFaceFeature = data.result.supportingFaceFeature
            store.state.timeout = data.result.timeout
            store.state.reportTimeTolerance = data.result.reportTimeTolerance
            store.state.interval = data.result.interval
            store.state.supportingWearing = data.result.supportingWearing
            store.state.deviceLowBatteryThreshold = data.result.deviceLowBatteryThreshold
            store.state.supportDisplayCompletePlan = data.result.supportDisplayCompletePlan
            store.state.displayAllTrain = data.result.displayAllTrain
            store.state.isYunanSwitch = data.result.isYunanSwitch
            if (store.state.isYunanSwitch) {
              this.dispatch('getTaskList')
            }
            if (num !== 1) {
              if (store.state.restSwitch) {
                this.dispatch('getAlarmWs')
              }
              this.dispatch('getOutInfoWs')
              if (store.state.supportingFaceFeature) {
                this.dispatch('getNewRecordWs')
              }
            }
	  	  	}
        }).catch((error) => {
          console.log('store in getSysInfoS error', error)
        })
      },
      getLeftList (store) {
        axios({
          method: 'get',
          url: '/web/left',
          headers: {'appType': 'web', 'appid': 'logan'}
        }).then((res) => {
          let data = res.data
          if (data.type === 1) {
            // 左侧列表各项属性赋值
            // console.log('初始化请求左侧')
            store.commit('assignLeftList', data.result)
          } else {
            this.$message.error(data.msg)
          }
        }).catch((err) => {
          console.log('请求左侧列表失败', err)
        })
      },
      getDevicesBattery(store) { // 获取设备列表信息，接口12 
        axios({
          method: 'get',
          url: '/api2/devices-status',
        }).then((res) => {
          let data = res.data
          if (data.type === 1) {
            // console.log('初始化请求右侧')
            store.commit('getBatteryList', data.result)
          }
        }).catch((err) => {
          console.log('请求右侧设备电量列表失败，', err)
        })
      },
      getRightList(store) { // 获取控制中心右侧列表信息，接口12 
        axios({
          method: 'get',
          url: '/api2/right',
          headers: {'appType': 'web', 'appid': 'logan'}
        }).then((res) => {
          let data = res.data
          if (data.type === 1) {
            // console.log('初始化请求右侧')
            store.commit('assignRightList', data.result)
          }
        }).catch((err) => {
          console.log('请求右侧列表失败，', err)
        })
      },
      guid (store) {
        function S4() {
          return (((1+Math.random())*0x10000)|0).toString(16).substring(1);
        }
        store.state.guid = (S4()+S4()+"-"+S4()+"-"+S4()+"-"+S4()+"-"+S4()+S4()+S4());
      },
      getNoBed (store) {
        axios({
          method: 'get',
          params: '',
          url: '/web/bedInfos'
        }).then((r) => {
          var data = r.data
          if (data.type === 1) {
            for (let i in data.result.bedInfos) {
              if (!data.result.bedInfos[i].used) {
                store.state.noBed.push(data.result.bedInfos[i])
              }
            }
          }
        }).catch((err) => {
          console.log('请求铺位列表链接失败', err)
        })
      },
      getOldRecord (store) {
        axios({
          method: 'get',
          params: '',
          url: '/api2/face-feature/un-allot-bed-record'
        }).then((r) => {
          var data = r.data
          if (data.result && data.result.length !== 0) {
            store.state.recordBox = true
            let item = data.result
            if (!store.state.isYunanSwitch) {
              if (store.state.leftBedList && store.state.leftBedList.length > 0) {
                for (let i in item) {
                  if (item[i].trainNo) {
                    this.commit('changeRemind', item[i])
                  }
                }
              } else {
                setTimeout(() => {
                  for (let i in item) {
                    if (item[i].trainNo) {
                      this.commit('changeRemind', item[i])
                    }
                  }
                }, 100)
              }
            }
            store.state.unAllotBed = item
          }
        }).catch((err) => {
          console.log('请求堆积的自助办理待乘请求失败:', err)
        })
      },
      getOutInfoWs (store) {
        if (store.state.outInfoState) {
          store.state.outInfows.close()
        }
        store.state.outInfows = new WebSocket('ws://' + store.state.serverIp + '/ws/notification?Mid=' + store.state.cookie)
        store.state.outInfows.onopen = ((event) => {
          // 发送一个初始化消息
        //  console.log('I am the client and I\'m listening!')
          // 监听消息
          store.state.outInfoState = false
          clearInterval(store.state.outInfoMs)
          console.log('outInfows自助离寓正在连接！！！！')
          if (store.state.outInfows.readyState === 1) {
             store.state.outInfoPing = setInterval(function () {
              store.state.outInfows.send('ping')
              // console.log('send outInfows自助离寓 ping, time:', new Date())
            }, 10000)
            console.log('outInfows自助离寓连接成功')
          } else if (store.state.outInfows.readyState === 2) {
            console.log('outInfows自助离寓连接正在关闭')
          } else if (store.state.outInfows.readyState === 3) {
            console.log('outInfows自助离寓连接已经关闭')
          } else if (store.state.outInfows.readyState === 0) {
            console.log('outInfows自助离寓连接尚未建立')
          }
          store.state.outInfows.onmessage = (event) => {
            // console.log('outInfows自助离寓.response.event.data:', event.data + new Date())

            if (event.data === 'pong') {
              return
            } else {
              clearInterval(store.state.outInfoPing)
            }
            if (store.state.outInfows.readyState === 1) {
              store.state.outInfoPing = setInterval(function () {
                store.state.outInfows.send('ping')
                // console.log('send ping, time:', new Date())
              }, 10000)
            }
            let res = JSON.parse(event.data)
            // console.log('接收消息成功', res.data)
            if (res.command === 1) {
              store.state.outInfoVal = res.data
            } else if (res.command === 2 || res.command === 8) {
              store.commit('openRegisterBox')
              store.commit('addRegisterVal', res.data)
            } else if (res.command === 3) {
              store.commit('assignRightList', res.data)
              // console.log('websocket推送更新右侧列表', res.data)
            } else if (res.command === 4) {
              store.commit('assignLeftList', res.data)
              // console.log('websocket推送更新左侧列表', res.data)z
            } else if (res.command === 5) {
              store.commit('getBatteryList', res.data)
              // console.log('websocket推送设备信息列表', res.data)
            } else if (res.command === 6) {
              store.commit('leaveToOrBack', res.data)
              // console.log('websocket推送请销假列表', res.data)
            } else if (res.command === 7) { 
              store.commit('inspenctionVo', res.data)
              // console.log('websocket推送待乘巡检列表', res.data)
            }
          }
          // 监听outInfows的关闭
          store.state.outInfows.onclose = (event) => {
            console.log('outInfows自助离寓 closed!!!!!!!!!!', event)
            store.state.outInfoMs = setInterval(() => {
              store.state.outInfoState = true
              clearInterval(store.state.outInfoPing)
              this.dispatch('getOutInfoWs')
            }, 10000)
          }
        })
      },
      getNewRecordWs (store) {
        if (store.state.recordState) {
          store.state.recordws.close()
        }
        store.state.recordws = new WebSocket('ws://' + store.state.serverIp + '/ws/self-check-in?Mid=' + store.state.cookie)
        store.state.recordws.onopen = ((event) => {
          store.state.recordState = false
          // 发送一个初始化消息
//          console.log('I am the client and I\'m listening!')
          // 监听消息
          clearInterval(store.state.auto)
          console.log('recordws自助正在连接！！！！')
          if (store.state.recordws.readyState === 1) {
            console.log('连接成功')
            store.state.sendPingAuto = setInterval(function () {
              store.state.recordws.send('ping')
              // console.log('send recordws 自助 ping, time:', new Date())
            }, 10000)
          } else if (store.state.recordws.readyState === 2) {
            console.log('连接正在关闭')
          } else if (store.state.recordws.readyState === 3) {
            console.log('连接已经关闭')
          } else if (store.state.recordws.readyState === 0) {
            console.log('连接尚未建立')
          }
          store.state.recordws.onmessage = (event) => {
            // console.log('recordws自助.response.event.data:', event.data + new Date())
            if (event.data === 'pong') {
              return
            } else {
              clearInterval(store.state.sendPingAuto)
            }
            if (store.state.recordws.readyState === 1) {
              store.state.sendPingAuto = setInterval(function () {
                store.state.recordws.send('ping')
                // console.log('send ping, time:', new Date())
              }, 10000)
            }
            let data = JSON.parse(event.data)
            store.state.recordBox = true
            if (data.command === 1) {
              if (!store.state.isYunanSwitch) {
                if (data.trainNo) {
                  this.commit('changeRemind', data)
                }
              }
              store.state.unAllotBed.push(data)
            } else if (data.command === 2) {
              for (let i in store.state.unAllotBed) {
                if (store.state.unAllotBed[i].sid === data.sid) {
                  store.state.unAllotBed.splice(i, 1)
                }
              }
              if (store.getters.leng === 0) {
                store.state.recordBox = false
              }
            }
          }
          // 监听recordws的关闭
          store.state.recordws.onclose = (event) => {
            console.log('webws closed!!!!!!!!!!', event)
            store.state.auto = setInterval(() => {
              store.state.recordState = true
              clearInterval(store.state.sendPingAuto)
              this.dispatch('getNewRecordWs')
            }, 10000)
          }
        })
      },
      timerUpSyns (store) {
        // console.log('准备循环倒计时')
        store.state.countDownInterval = setInterval (() => {
          store.commit('timerUp')
        }, 1000)
      },
      batteryTimerUpSyns (store) {
        // console.log('准备电池信息循环倒计时')
        store.state.wifiCountDownInterval = setInterval (() => {
          store.commit('batteryTimerUp')
        }, 1000)
      },
      syns (store, time) {
        setTimeout(() => {
          store.commit('clearAudioURL')
        }, time)
      },
      audioDurationUpSys (store) {
        clearInterval(store.state.audioTimeInterval)
        store.state.audioTimeInterval = setInterval(() => {
          store.commit('audioDurationUp')
        }, 1000)
      },
      getAlarmWs (store) { // 请求音频警告接口
        if (store.state.audioURL) { // 音频存在，不请求告警接口
          return null
        }
        if (store.state.alarmState) {
          store.state.ararmWs.close()
        }
        store.state.ararmWs = new WebSocket('ws:' + store.state.serverIp  +  '/ws/audio-alarm?Mid=' + store.state.cookie)
        store.state.ararmWs.onopen = (event) => {
          store.state.alarmState = false
          clearInterval(store.state.alarmMs)
          // 发送一个初始化消息
        //  store.state.ararmWs.send('I am the client and I\'m liste`ning!')
          // 监听消息
          console.log('ararmWs正在连接！！！！')
          if (store.state.ararmWs.readyState === 1) {
            store.state.sendPingAlarm = setInterval(function () {
              store.state.ararmWs.send('ping')
              // console.log('send ping, time:', new Date())
            }, 10000)
            console.log('连接成功')
          } else if (store.state.ararmWs.readyState === 2) {
            console.log('连接正在关闭')
          } else if (store.state.ararmWs.readyState === 3) {
            console.log('连接已经关闭')
          } else if (store.state.ararmWs.readyState === 0) {
            console.log('连接尚未建立')
          }
          store.state.ararmWs.onmessage = (event) => {
            // console.log('ararmWs.response.event.data:', event.data + new Date())
            if (event.data === 'pong') {
              return
            } else {
              clearInterval(store.state.sendPingAlarm)
            }
            if (store.state.ararmWs.readyState === 1) {
              store.state.sendPingAlarm = setInterval(function () {
                store.state.ararmWs.send('ping')
                // console.log('send ararmWs ping, time:', new Date())
              }, 10000)
            }
            let data = JSON.parse(event.data)
            if (store.state.audioURL || (!store.state.audioURL && store.state.audioDuration !== 0 && store.state.audioDuration < 60)) {
              return
            }
            if (data.type) {
              if (data.type === 1) { // 需要人工叫班
                store.commit('getAudio', 1)
                setTimeout(() => {
                  store.commit('getAudio', 2)
                }, 5500);
              } else if (data.type === 3) { // 对于已经开始的待乘，开始自动叫班中
                store.commit('getAudio', 3)
              }
            }
          }
          // 监听ararmWs的关闭
          store.state.ararmWs.onclose = (event) => {
            console.log('ararmWs closed!!!!!!!!!!', event)
            store.state.alarmMs = setInterval(() => {
              store.state.alarmState = true
              this.dispatch('getAlarmWs')
            }, 10000)
          }
          // 关闭ws....
          //ws.close()
        }
      },
      getLdNameList (store) {
        axios({
          method: 'get',
          url: '/api2/face-feature/ld-names',
          params: ''
        }).then((res) => {
          let data = res.data
          store.commit('loadingChangeFalse')
          if (data.type === 1) {
            store.state.ldNameList = data.result
          } else {
            this.$message.error(data.msg)
          }
        }).catch((err) => {
          console.log('请求段别链接失败', err)
        })
      },
      getOldRegister (store) {
        axios({
          method: 'get',
          params: '',
          url: '/api2/driver/register/list'
        }).then((r) => {
          var data = r.data
          if (data.result.list && data.result.list.length !== 0) {
            store.commit('openRegisterBox')
            // store.state.registerAuditVal.push.apply(store.state.registerAuditVal, data.result.list)
            store.state.registerAuditVal = data.result.list
          }
        }).catch((err) => {
          console.log('报错信息:', err)
        })
      },
      getOldInspection (store) {
        axios({
          method: 'get',
          params: '',
          url: '/api2/check/checkRecord/list'
        }).then((r) => {
          var data = r.data
          if (data.result) {
            store.commit('inspenctionVo', data.result)
          }
        }).catch((err) => {
          console.log('报错信息:', err)
        })
      },
      getOldLeave (store) {
        axios({
          method: 'get',
          params: '',
          url: '/api2/holiday/accumulate'
        }).then((r) => {
          var data = r.data
          if (data.result) {
            store.commit('leaveToOrBack', data.result)
          }
        }).catch((err) => {
          console.log('报错信息:', err)
        })
      },
      getOldLeaveBack (store) {
        axios({
          method: 'get',
          params: '',
          url: 'api2/cancleHoliday/accumulate'
        }).then((r) => {
          var data = r.data
          if (data.result) {
            store.commit('leaveToOrBack', data.result)
          }
        }).catch((err) => {
          console.log('报错信息:', err)
        })
      },
      getRefreshRightTiming (store) {
        store.state.refreshRightTiming = setInterval(() => {
          store.state.refreshRight++
          // console.log('友侧列表计时', store.state.refreshRight)
          if (store.state.refreshRight === 60) {
            this.dispatch('getRightList')
          }
        }, 1000)
      },
      getRefreshLeftTiming (store) {
        store.state.refreshLeftTiming = setInterval(() => {
          store.state.refreshLeft++
          // console.log('左侧列表计时', store.state.refreshRight)
          if (store.state.refreshLeft === 60) {
            this.dispatch('getLeftList')  // 临时增加调试
          }
        }, 1000)
      },
      getRefreshBatteryTiming (store) {
        store.state.refreshBatteryTiming = setInterval(() => {
          store.state.refreshBattery++
          if (store.state.refreshBattery === 60) {
            this.dispatch('getDevicesBattery')  // 临时增加调试
          }
        }, 1000)
      },
      backTopFunc (store) {
        // let interval = setInterval (() => {
        //   document.documentElement.scrollTop-=50
        //   if (document.documentElement.scrollTop === 0) {
        //     store.commit('backTopFalse')
        //     clearInterval(interval)
        //   }
        // }, 10)
        document.documentElement.scrollTop = 0
        store.commit('backTopFalse')

      }
      
    }
  })
}