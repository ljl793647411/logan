<template>
  <el-dialog
  title="确认待乘信息"
  :visible.sync="boxShow"
  width="31.4%"
  :before-close="closeBox"
  :close-on-click-modal="false"
  :close-on-press-escape="false"
  custom-class="enter-record-class">
    <div class="record-input">
			<label for="interval">计划司机段别：</label>
			<el-input v-model="val.ldName" id="interval" v-if="!readonly"></el-input>
      <b v-if="readonly" v-text="val.ldName"></b>
		</div>
    <div class="record-input">
			<label for="interval">车次号：</label>
			<el-input v-model="val.trainNo" id="interval" v-if="!readonly"></el-input>
      <b v-if="readonly" v-text="val.trainNo"></b>
		</div>
    <div>
			<label for="interval">姓名：</label>
      <el-autocomplete 
      class=""
      v-model="val.name"
      :fetch-suggestions="querySearch2"
      placeholder="请输入工号"
      :trigger-on-focus="true"
      @select="handleSelect1"
      value-key="workNo, name"
      :debounce="0"
      :clearable="false">
        <template slot-scope="props">
          <span style="margin-left: 5px;" v-text="props.item.name + '(' + props.item.workNo + ')'"></span>
        </template>
    </el-autocomplete>
    </div>
    <div class="record-input">
			<label for="interval">铺位号：</label>
			<el-input v-model="val.bedNo" id="interval" :readonly="readonly" placeholder="点击按钮选择铺位"></el-input>
      <bed-choose @chooseBed="changeBed" :allChoose="false" :bedNo='val.bedNo'></bed-choose>
		</div>
    <div class="record-input">
			<label for="interval">叫班时间：</label>
      <el-date-picker
        v-model="val.remindDt"
        type="datetime"
        placeholder="选择日期时间"
        value-format="yyyy-MM-dd HH:mm:ss">
      </el-date-picker>
		</div>
    <div class="record-input">
			<label for="interval">计划叫班时间：</label>
      <b v-text="recordVal.remindPlanedTime1 ? recordVal.remindPlanedTime1 : recordVal.remindDt"></b>
		</div>
    <div class="record-input">
			<label for="interval">开车时间：</label>
       <el-time-picker
        v-if="!readonly"
        v-model="val.trainDt"
        value-format="HH:mm"
        placeholder="任意时间点">
      </el-time-picker>
      <b v-if="readonly" v-text="val.trainDt"></b>
		</div>
    <div v-if="updateReasonShow" class="record-input">
			<label for="interval">修改原因：</label>
      <el-input type="textarea" :row="2" v-model="val.updateReason" placeholder="请填写修改原因" style="width: 30%;font-weight: 100;vertical-align: top;"></el-input>
		</div>
    <span slot="footer" class="dialog-footer">
      <el-button type="primary" @click="enterRecord">确 定</el-button>
    </span>
  </el-dialog>
</template>

<script>

import bedChoose from './bedChoose'
import {mapState} from 'vuex'
import config from '../public/config'

export default {
  data () {
    return {
      val: {},
      currentPage: 1,
      pageSize: 1000,
      workNoList: [],
      nameList: [],
      nameQueryFlag: false,
      workNoQueryFlag: false,
      pBlur: false,
      pickerOptions: {
        selectableRange: '00:00:00 - 23:59:59'
      },
      req: {
      },
      updateReasonShow: false,
      remindPlanedTime1: '',
      isLate: false,
      value1: ''
    }
  },
  props: ['boxShow', 'recordVal', 'readonly'],
  components: {
    bedChoose,
    config
  },
  computed: {
    ...mapState(['restRemindSwitch', 'allDriverList', 'timeAhead']),
  },
  mounted () {
    this.$nextTick(() => {
      if (this.recordVal.trainDt) {
        for (let i in this.recordVal) {
          this.$set(this.val, i, this.recordVal[i])
        }
        console.log(this.val)
        if (!this.val.remindPlanedTime1) {
          this.$set(this.val, 'remindPlanedTime1', this.val.remindDt)
        }
      }
    })
  },
  methods: {
    updateRemindTime1Watcher () {
      if (this.val.remindPlanedTime1 != this.remindPlanedTime1) {
        this.updateReasonShow = true
      } else {
        this.updateReasonShow = false
        this.val.updateReason = ''
      }
    },
    querySearch2(queryString, cb) {  // 自动补全框方法z
      var restaurants = this.allDriverList
      var results = queryString ? restaurants.filter(this.createFilter(queryString)) : restaurants;
      // 调用 callback 返回建议列表的数据
      cb(results);
    },
    changeRemindTime1 () {
      this.val.remindPlanedTime1 = this.recordVal.remindPlanedTime1
      this.pickerOptions.selectableRange = `${this.val.remindPlanedTime1}:00-${this.val.remindPlanedTime1}:00`
    },
    handleSelect1(item) {
      this.$set(this.val, 'name', item.name)
      this.$set(this.val, 'workNo', item.workNo)
      this.$set(this.val, 'driverNameLdName', item.ldName)
    },
    createFilter(queryString) {
      return (restaurant) => {
        return (restaurant.workNo.toLowerCase().indexOf(queryString.toLowerCase()) > -1 || restaurant.name.indexOf(queryString) > -1);
      };
    },
    closeBox () {
      this.$emit('closeRecordBox', 'close')
    },
    enterRecord () {
      if (this.val.workNo) {
        if (!config.validateWorkNo(this.val.workNo)) {
          this.$message.error('司机工号必须是七位数字')
          return
        }
      } else {
        this.$message.error('请填写司机工号及姓名!')
        return
      }
      if (this.val.remindPlanedTime1) {
        this.val.remindPlanedTime1 = this.moment(this.val.remindPlanedTime1).format('YYYY-MM-DD HH:mm:ss')
        this.val.remindDt = this.val.remindPlanedTime1
      }
      this.$emit('closeRecordBox', this.val)
    },
    changeBed(bunk) {
      this.$set(this.val, 'bedNo', bunk.bedNo)
      this.$set(this.val, 'bedSid', bunk.bedSid)
    },
  }
}
</script>

<style>

  .enter-record-class .record-input{
    margin: 10px 0;
  }

  .enter-record-class .el-dialog__body {
    margin-top: 50px;
  }
	.enter-record-class label{
    font:	14px Small;
    width: 20%;
		display: inline-block;
	}
  .enter-record-class .el-input, .enter-record-class .el-input__inner{
    width: 250px;
    font:	14px Small;
  }
  .enter-record-class .el-dialog__header {
    width: 29.2%;
    position: fixed;
    background: #f9f9f9;
    z-index: 1;
  }
  .selectShow {
    position: absolute;
    width: 250px;
    height: 500px;
    overflow-y: scroll;
    border: 1px solid #ccc;
    border-radius: 2px;
    z-index: 1;
    background: #fff;
    left: 112px;
    padding: 0 10px;
    box-sizing: border-box;
  }
  .selectShow p {
    width: 100%;
    height: 32px;
  }
  .selectShow p:hover {
    background: #2e6da4;
    color: #fff;
  }
</style>
