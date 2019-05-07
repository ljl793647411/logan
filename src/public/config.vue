<script type="text/javascript">
import moment from 'moment'

const colorList = ['','#addac1','#d6a7d4','#febdbe','#ffb035','#fbdc67','#f6ecbf','#f0a202','#93b7be']
const remindedReason = [
  {
    value: '司机深睡',
    label: '司机深睡'
  },
  {
    value: '手表不在身边',
    label: '手表不在身边'
  },
  {
    value: '唤醒后未响应',
    label: '唤醒后未响应'
  },
  {
    value: '其他',
    label: '其他'
  },
]
const resSelectList = [
  {
    value: '',
    label: '全部'
  },
  {
    value: '1',
    label: '已响应'
  },
  {
    value: '2',
    label: '未响应'
  },
]
const outInTimeSelectList = [
  {
    value: '',
    label: '全部'
  },
  {
    value: '1',
    label: '未超时'
  },
  {
    value: '2',
    label: '已超时'
  },
]
const remindTypeSelectList = [
  {
    value: '',
    label: '全部'
  },
  {
    value: '1',
    label: '人工叫班'
  },
  {
    value: '2',
    label: '自动叫班'
  }
]
const OfflineLateList = [
  {
    value: '',
    label: '全部'
  },
  {
    value: '1',
    label: '0%~30%'
  },
  {
    value: '2',
    label: '31%~60%'
  },
  {
    value: '3',
    label: '61%~100%'
  }
]
const notWearLateList = [
  {
    value: '',
    label: '全部'
  },
  {
    value: '1',
    label: '0%~30%'
  },
  {
    value: '2',
    label: '31%~60%'
  },
  {
    value: '3',
    label: '61%~100%'
  }
]
const registerList = [
  {
    value: '',
    label: '全部'
  },
  {
    value: '人脸',
    label: '人脸'
  },
  {
    value: '人工',
    label: '人工'
  }
]
const inspectionReasonList = [
  {
    value: '正常',
    label: '正常'
  },
  {
    value: '异常',
    label: '异常'
  }
]
const tranPlanTypeList = [
  {
    value: '1',
    label: '机车-调休'
  },
  {
    value: '2',
    label: '机车-驻班'
  },
  {
    value: '3',
    label: '机车-继乘'
  },
  {
    value: '4',
    label: '动车-驻班'
  },
  {
    value: '5',
    label: '动车-候班'
  },
  {
    value: '6',
    label: '动车-间休'
  },
  {
    value: '7',
    label: '其他'
  }
]
const tranPlanMap = {
  '1': '机车-调休',
  '2': '机车-驻班',
  '3': '机车-继乘',
  '4': '动车-驻班',
  '5': '动车-候班',
  '6': '动车-间休',
  '7': '其他'
}
export default {
  inspectionReasonList,
  colorList,
  remindedReason,
  resSelectList,
  outInTimeSelectList,
  remindTypeSelectList,
  OfflineLateList,
  notWearLateList,
  registerList,
  tranPlanTypeList,
  tranPlanMap,
  /**
   * 字符串16位转8位
   */
  getRegisterType (data) {
    let registerType = []
    for (let i in data) {
      if (i != 0) {
        registerType.push(data[i])
      }
    }
    return registerType
  },
  utf16to8 (str) {
    var out, i, len, c
    out = ""
    len = str.length;
    for(i = 0; i < len; i++) {
	  c = str.charCodeAt(i)
      if ((c >= 0x0001) && (c <= 0x007F)) {
	      out += str.charAt(i)
      } else if (c > 0x07FF) {
	      out += String.fromCharCode(0xE0 | ((c >> 12) & 0x0F))
	      out += String.fromCharCode(0x80 | ((c >>  6) & 0x3F))
	      out += String.fromCharCode(0x80 | ((c >>  0) & 0x3F))
      } else {
	      out += String.fromCharCode(0xC0 | ((c >>  6) & 0x1F))
	      out += String.fromCharCode(0x80 | ((c >>  0) & 0x3F))
      }
    }
  	return out
  },
  validateWorkNo(s) {
    if (!s || s.length !== 7) {
      return false
    }
    let numbers = '0123456789'
    for (let i = 0; i < s.length; ++i) {
      if (numbers[s[i]] !== s[i]) {
        return false
      }
    }
    return true
  },
  time1To2 (i) {
	  return i < 10 ? '0' + i : i
  },
  setLocal (name, val) {
    if(!window.localStorage){
        return false;
    } else {
        var storage = window.localStorage;
        storage.setItem(name, val)
    }
  },
  delLocal (name) {
    if(!window.localStorage){
        return false;
    } else {
        var storage = window.localStorage;
        storage.removeItem(name)
    }
  },
  selectLocal (name) {
    if(!window.localStorage){
        return false;
    } else {
        var storage = window.localStorage;
        return storage.getItem(name)
    }
  },
  remindPlanedTimeConfig (trainDtRes, remindPlanedTime1Res, restHourRes) {  // 开始间休计算休息时长够的叫班时间
    let actualTime = moment().add(restHourRes, 'h')
    let year = moment().format('YYYY-MM-DD')
    let actualDate = `${year} ${actualTime}:00`
    let trainDate = `${year} ${trainDtRes}:00`
    let remindPlanedDate = `${year} ${remindPlanedTime1Res}:00`
    let nowDate = moment()
    let nowMs = moment().valueOf()
    let actualMs = moment(actualTime).valueOf()
    let trainMs = moment(trainDate).valueOf()
    let remindPlanedMs = moment(remindPlanedDate).valueOf( )
    let remindPlaned
    let req = new Object()
    req.remindPlanedTime1 = ''
    req.selectableRange = ''
    req.isError = false
    if (nowMs > trainMs) {
      remindPlanedMs = moment(remindPlanedDate).add(1, 'd').valueOf()
      if (remindPlanedMs > actualMs) {
        req.remindPlanedTime1 = moment(remindPlanedMs).format('HH:mm')
        req.isError = false
      } else {
        req.remindPlanedTime1 = moment(actualTime).format('HH:mm')
        req.isError = true
      }
    } else {
      if (actualMs > remindPlanedMs) {
        // if (actualMs > trainMs) {
        //   req.remindPlanedTime1 = moment(remindPlanedMs).format('HH:mm')
        //   req.isError = false
        // } else {
          req.remindPlanedTime1 = moment(actualTime).format('HH:mm')
          req.isError = true
        // }
      } else {
        req.remindPlanedTime1 = moment(remindPlanedMs).format('HH:mm')
        req.isError = false
      }
    }
    req.selectableRange = `${moment(actualTime).format('HH:mm:ss')}-${moment(trainDate).format('HH:mm:ss')}`
    return req
    // console.log('当前时间', nowDate, '毫秒', nowMs)
    // console.log('加一小时时间', actualTime, '毫秒', actualMs)
    // console.log('出行时间', trainDate, '毫秒', trainMs)
    // console.log('计划叫班时间', remindPlanedDate, '毫秒', remindPlanedMs)
    // console.log('结果时间', req)
  },
  debounce(fn, delay = 300) {   //默认300毫秒
    var timer;
    return function() {
      var args = arguments
      if(timer) {
          clearTimeout(timer)
      }
      timer = setTimeout(() => {
          fn.apply(this, args)   // this 指向vue
      }, delay)
    }
  }
}
</script>