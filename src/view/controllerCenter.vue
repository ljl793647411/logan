<template>
  <div class="ctrl-box">
    <div class="ctrl-head bed" v-show="!backTop">
      <span>
        <h4 v-text="'总共接待：' + leftList.servedDriverNum"></h4>
        <h4 v-text="'响应率：' + leftList.responseRate"></h4>
        <h4 v-text="'出发及时率：' + leftList.inTimeRate"></h4>
      </span>
      <span>
        <span class="ctrl-head-autocomplete">
          <el-autocomplete 
            ref="auto1"
            class="inline-input"
            v-model="requstTrainNo"
            :fetch-suggestions="querySearch"
            placeholder="请输入接续车次"
            :trigger-on-focus="true"
            @select="handleSelect"
            value-key="trainNo"
            @focus="autoFocus"
            @keyup.native.enter="createChange(createRecordRequst)"
            :maxlength="auto1maxlength"
            :debounce="0"
            :clearable="false">
              <template slot-scope="props">
                <span :title=" '车次号：' + props.item.trainNo + (props.item.bedNo ? '床号：' + props.item.bedNo : '')">{{ '车次号：' + props.item.trainNo }}</span>
                <span style="margin-left: 5px;" :title=" '车次号：' + props.item.trainNo + props.item.bedNo ? '床号：' + props.item.bedNo : ''" v-text="props.item.bedNo ? '床号：' + props.item.bedNo : ''"></span>
              </template>
          </el-autocomplete>
        </span>
        <el-button type="primary" class="ctrl-head-autocomplete-btn" @click="createChange(createRecordRequst)">开始待乘</el-button>
      </span>
      <span>
        <el-badge :value="leng" class="icon" v-if="supportingFaceFeature">
          <div class="lowBattery cursor el-badge" @click="openRecordBox" title="待处理待乘">
            <img src="../assets/img/waiting.png" alt="">
          </div>
        </el-badge>
      </span>
    </div>
    <div class="ctrl-body">
      <el-collapse v-model="openTable">
        <el-collapse-item name="1" v-if="hideFinishedList">
          <template slot="title">
            <b v-text="'当日已结束：' + completedNum + '个'"></b>
          </template>
          <el-table
            ref="singleTable"
            :data="leftList.completedList"
            max-height="550"
            style="width: 100%"
            :border="true"
            row-dblclick="">
            <el-table-column
              property="ldName"
              label="单位"
              width="80">
            </el-table-column>
            <el-table-column
              property="trainNo"
              label="车次"
              width="">
            </el-table-column>
            <el-table-column
              property="driverName"
              label="司机"
              width="">
            </el-table-column>
            <el-table-column
              property="bedNo"
              label="铺位号"
              width="90">
            </el-table-column>
            <el-table-column
              label="入住"
              width="70">
              <template slot-scope="scope">
                <div :title="scope.row.startTime">{{scope.row.startTime | formatTime1}}</div>
              </template>
            </el-table-column>
            <el-table-column
              label="开行"
              width="70">
              <template slot-scope="scope">
                <div :title="scope.row.trainDt">{{scope.row.trainDt | formatTime1}}</div>
              </template>
            </el-table-column>
            <el-table-column
              label="计划"
              width="70">
              <template slot-scope="scope">
                <div :title="scope.row.remindPlanedTime2">{{scope.row.remindPlanedTime1 | formatTime1}}</div>
              </template>
            </el-table-column>
            <el-table-column
              label="首次"
              width="70">
              <template slot-scope="scope">
                <div :title="'首次叫班：' + scope.row.remindRealTime1">{{scope.row.remindRealTime1 | formatTime1}}</div>
              </template>
            </el-table-column>
            <el-table-column
              label="二次"
              width="70">
              <template slot-scope="scope">
                <div :title="'二次叫班：' + scope.row.remindRealTime2">{{scope.row.remindRealTime2 | formatTime1}}</div>
              </template>
            </el-table-column>
            <el-table-column
              label="人工"
              width="70">
              <template slot-scope="scope">
                <div :title="scope.row.adminRemindTime">{{scope.row.adminRemindTime | formatTime1}}</div>
              </template>
            </el-table-column>
            <el-table-column
              label="离寓"
              width="70">
              <template slot-scope="scope">
                <div :title="scope.row.endRealTime">{{scope.row.endRealTime | formatTime1}}</div>
              </template>
            </el-table-column>
				  </el-table>
        </el-collapse-item>
        <el-collapse-item name="2">
          <template slot="title">
            <b v-text="'当日已安排：未结束' + notFinishedNum + '个'"></b>
            <span class="msg-float" v-if="driverLateListLength > 0" v-text='"当前有" + driverLateListLength + "班待乘车次叫班时间需要修改，请及时处理！"'></span>
          </template>
          <el-table
            ref="singleTable"
            :data="leftList.notFinishedList"
            style="width: 100%;"
            max-height="550"
            :border="true"
            :row-class-name="tableFinishedRowClassName"
            row-dblclick=""
            class="notFinishedListHead">
            <el-table-column
              property="ldName"
              label="单位"
              width="">
            </el-table-column>
            <el-table-column
              property="trainNo"
              label="车次"
              width="">
            </el-table-column>
            <el-table-column
              property="driverName"
              label="司机"
              width="">
            </el-table-column>
            <el-table-column
              property="bedNo"
              label="铺位号"
              width="">
            </el-table-column>
            <el-table-column
              label="开行时间"
              width="">
              <template slot-scope="scope">
                <div :title="scope.row.trainDt">{{scope.row.trainDt | formatTime1}}</div>
              </template>
            </el-table-column>
            <el-table-column
              label="叫班时间"
              width="130">
              <template slot-scope="scope">
                <span :title="scope.row.remindPlanedTime1">{{scope.row.remindPlanedTime1 | formatTime1}}</span>
                <div class="not-f-img" v-if="lateSwitch">
                  <img src="../assets/img/error.png" alt="" title="请及时修改" v-if="scope.row.lateFlag">
                </div>
              </template>
            </el-table-column>
            <el-table-column  
              label="计时"
              width="">
              <template slot-scope="scope">
                <div v-if="timerList[scope.row.bedSid] && (timerList[scope.row.bedSid].timer > 0)">{{timerList[scope.row.bedSid].timer | formatTime}}</div>
                <div v-if="timerList[scope.row.bedSid] && (timerList[scope.row.bedSid].timer <= 0)" style="color: red">{{timerList[scope.row.bedSid].timer | formatTime}}</div>
              </template>
            </el-table-column>
            <el-table-column
              property="ticket1"
              label="餐券"
              width="70">
            </el-table-column>
            <el-table-column
              label="操作"
              width="120"
             >
              <template slot-scope="scope" calss="not-finshed-admin-box">
                <div>
                  <el-dropdown @command="changeState">
                    <el-button type="primary">
                      管理<i class="el-icon-arrow-down el-icon--right"></i>
                    </el-button>
                    <el-dropdown-menu slot="dropdown">
                      <el-dropdown-item :command="[1, scope.$index, scope.row]">取消</el-dropdown-item>
                      <el-dropdown-item :command="[2, scope.$index, scope.row]">修改</el-dropdown-item>
                      <el-dropdown-item :command="[3, scope.$index, scope.row]">结束</el-dropdown-item>
                    </el-dropdown-menu>
                  </el-dropdown>
                </div>
              </template>
            </el-table-column>
				  </el-table>
        </el-collapse-item>
        <el-collapse-item :title="(supportDisplayCompletePlan ? '计划车次：' : '当日未安排：') + notArrangedNum + '个'" name="3">
          <el-row style="margin-bottom:20px;">
            <el-col :span="2">
              <el-button type="primary" @click="addNotArrangedIsToday">临时增加</el-button>
            </el-col>
            <el-col :span="7" :offset="15">
              <el-switch
                v-model="notArrangedState"
                :active-text="supportDisplayCompletePlan ? '全部计划车次' : '全部未安排车次'"
                inactive-text="当日未安排车次">
              </el-switch>
            </el-col>
          </el-row>
          <el-table
            ref="singleTable"
            :data="notArrangedState ? leftList.notArrangedList : notArrangedIsTodayList"
            :row-class-name="tableRowClassName"
            max-height="550"
            style="width: 100%"
            :border="true">
            <el-table-column
              property="ldName"
              label="单位"
              width="150">
              <template slot-scope="scope">
                <span>{{scope.row.ldName}}</span>
              </template>
            </el-table-column>
            <el-table-column
              label="计划入寓"
              width="100">
              <template slot-scope="scope">
                <div :title="scope.row.planedArriveTime">{{scope.row.planedArriveTime | formatTime1}}</div>
              </template>
            </el-table-column>
            <el-table-column
              label="开行时间"
              width="">
              <template slot-scope="scope">
                <el-time-picker
                  v-model="scope.row.trainDt"
                  value-format="HH:mm"
                  placeholder="任意时间点"
                  style="width: 140px;"
                  :clearable="false">
                </el-time-picker>
              </template>
            </el-table-column>
            <el-table-column
              label="车次"
              width="">
              <template slot-scope="scope">
                <el-input v-model="scope.row.trainNo" placeholder="请输入内容"></el-input>
              </template>
            </el-table-column>
            <!-- <el-table-column
              label="铺位号"
              width="140">
              <template slot-scope="scope">
                <el-input v-model="scope.row.bedNo" readonly placeholder="" style="width: 77%"></el-input>
                <bed-choose @chooseBed="chooseBed" :allChoose="false" :index="scope.$index"></bed-choose>
              </template>
            </el-table-column> -->
            <el-table-column
              property="remindDt"
              label="叫班时间"
              width="">
              <template slot-scope="scope">
                <el-time-picker
                  v-model="scope.row.remindDt"
                  value-format="HH:mm"
                  placeholder="任意时间点"
                  style="width: 140px;"
                  :clearable="false">
                </el-time-picker>
              </template>
            </el-table-column>
            <el-table-column
              label="餐券"
              width="70">
              <template slot-scope="scope">
                <el-input v-model="scope.row.ticket1"></el-input>
              </template>
            </el-table-column>
            <el-table-column
              label="操作"
              width="90">
              <template slot-scope="scope">
                <el-dropdown @command="notArrangedAdmin" v-if="!scope.row.stop">
                  <el-button type="text">
                    管理<i class="el-icon-arrow-down el-icon--right"></i>
                  </el-button>
                  <el-dropdown-menu slot="dropdown">
                    <el-dropdown-item :command="[1, scope.$index, scope.row]">开始</el-dropdown-item>
                    <el-dropdown-item :command="[2, scope.$index, scope.row]">停运</el-dropdown-item>
                    <el-dropdown-item :command="[3, scope.$index, scope.row]">推迟</el-dropdown-item>
                  </el-dropdown-menu>
                </el-dropdown>
              </template>
            </el-table-column>
				  </el-table>
        </el-collapse-item>
      </el-collapse>
    </div>
    <el-dialog
      title="结束待乘"
      :visible.sync="overIntervalState"
      width="30%"
      :close-on-click-modal="false"
      :close-on-press-escape="false">
      <h3 class="public-title"><label for="">接续车次：</label><b class="font-color-red" v-text="overIntervalRes.trainNo"></b></h3>
      <h3 class="public-title"><label for="">开车时间：</label><b>{{overIntervalRes.trainDt | date}}</b></h3>
      <h3 class="public-title"><label for="">叫班时间：</label><b class="font-color-red">{{overIntervalRes.remindPlanedTime1 | date}}</b></h3>
      <h3 class="public-title"><label for="">铺位号：</label><b v-text="overIntervalRes.bedNo"></b></h3>
      <h3 class="public-title" v-if="overIntervalRes.holidayType"><label for="">请假时间：</label><b v-text="leaveRes.lyTime"></b></h3>
      <h3 class="public-title" v-if="overIntervalRes.holidayType"><label for="">预计销假时间：</label><b v-text="leaveRes.yjfhTime"></b></h3>
      <h3 class="public-title" v-if="overIntervalRes.holidayType"><label for="">请假事由：</label><b v-text="leaveRes.reason"></b></h3>
      <span slot="footer" class="dialog-footer">
        <el-button @click="overIntervalState = false">取 消</el-button>
        <el-button type="primary" @click="overInterval">结 束</el-button>
      </span>
    </el-dialog>
    <el-dialog
      title="修改待乘信息"
      :visible.sync="changeBedState"
      width="30%"
      :show-close="false"
      :close-on-click-modal="false"
      :close-on-press-escape="false">
      <h3 class="public-title"><label for="">单位：</label>
        <b style="marginLeft: 20px;">{{oldChangeBedValRes.ldName}}</b>
      </h3>
      <h3 class="public-title"><label for="">司机：</label>
        <b style="marginLeft: 20px;">{{oldChangeBedValRes.driverWorkNo ? `${oldChangeBedValRes.driverName}(${oldChangeBedValRes.driverWorkNo})` : ''}}</b>
      </h3>
      <h3 class="public-title"><label for="">车次：</label>
          <el-autocomplete
          class="inline-input"
          style="width: 32%;margin-right:5px;"
          v-model="changeBedValRes.trainNo"
          :fetch-suggestions="querySearch2"
          placeholder="请输入内容"
          :trigger-on-focus="true"
          @select="handleSelect1"
          value-key="trainNo"
          @blur="emptyTime">
            <template slot-scope="props">
              <span>{{props.item.trainNo }}</span>
            </template>
          </el-autocomplete>
          <!-- <template slot-scope="props">
            <span :title=" '车次号：' + props.item.trainNo">{{ '车次号：' + props.item.trainNo }}</span>
          </template> -->
        <b style="marginLeft: 20px;">{{oldChangeBedValRes.trainNo}}</b>
      </h3>
      <h3 class="public-title"><label for="">开行时间：</label>
        <el-time-picker v-model="changeBedValRes.trainDt" style="width: 30%;" value-format="HH:mm" @blur="selectRemindPlanedTime1(changeBedValRes.trainDt)"></el-time-picker>
        <b style="marginLeft: 20px;">{{oldChangeBedValRes.trainDt | formatTime1}}</b>
      </h3>
      <h3 class="public-title"><label for="">叫班时间：</label>
        <el-time-picker v-model="changeBedValRes.remindPlanedTime1" style="width: 30%;" value-format="HH:mm" :picker-options="pickerOptions" @blur="updateRemindTime1Watcher"></el-time-picker>
        <b style="marginLeft: 20px;">{{ oldChangeBedValRes.remindPlanedTime1 | formatTime1 }}</b>
      </h3>
      <h3 class="public-title"><label for="">计划叫班时间：</label>
        <b style="marginLeft: 20px;">{{ oldChangeBedValRes.newRemindPlanedTime }}</b>
      </h3>
      <h3 class="public-title"><label for="">铺位号：</label>
        <el-input v-model="changeBedValRes.bedNo" readonly placeholder="点击按钮选择铺位" style="width: 30%;font-weight: 100"></el-input>
        <bed-choose @chooseBed="chooseFineshedBed" :allChoose="false" :bedNo="oldChangeBedValRes.bedNo"></bed-choose>
        <b v-text="`( ${oldChangeBedValRes.bedNo} )`" style="marginLeft: 20px;"></b>
      </h3>
      <h3 v-if="updateReasonShow" class="public-title"><label for="">修改原因：</label>
        <el-input type="textarea" :row="2" v-model="changeBedValRes.updateReason" placeholder="请填写修改原因" style="width: 30%;font-weight: 100;vertical-align: top;"></el-input>
      </h3>
      <h3 class="public-title" v-if="oldChangeBedValRes.holidayType"><label for="">请假时间：</label><b v-text="leaveRes.lyTime"></b></h3>
      <h3 class="public-title" v-if="oldChangeBedValRes.holidayType"><label for="">预计销假时间：</label><b v-text="leaveRes.yjfhTime"></b></h3>
      <h3 class="public-title" v-if="oldChangeBedValRes.holidayType"><label for="">请假事由：</label><b v-text="leaveRes.reason"></b></h3>
      <span slot="footer" class="dialog-footer">
        <el-button @click="changeBedCancelConfirm">取消</el-button>
        <el-button type="primary" @click="changeBedConfirm">确定</el-button>
      </span>
    </el-dialog>
    <el-dialog
      title="缺少铺位号，请选择铺位"
      :visible.sync="selectBedState"
      width="30%">
      <h3 class="public-title"><label for="">铺位号：</label>
        <el-input v-model="selectBedVal.bedNo" readonly placeholder="点击按钮选择铺位" style="width: 30%"></el-input>
        <bed-choose @chooseBed="chooseSelectBed" :allChoose="false"></bed-choose>
      </h3>
      <span slot="footer" class="dialog-footer">
        <el-button @click="asynCreateChange">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog :title="`${notArrangedAdminVal.title}:`" :visible.sync="notArrangedAdminDelayBox" width="30%"
    :close-on-click-modal="false"
    :close-on-press-escape="false">
      <h3 class="public-title"><label for="">单位：</label>
        <b style="marginLeft: 20px;">{{ notArrangedAdminVal.ldName }}</b>
      </h3>
      <h3 class="public-title"><label for="">车次号：</label>
        <b style="marginLeft: 20px;">{{ notArrangedAdminVal.trainNo }}</b>
      </h3>
      <h3 class="public-title"><label for="">开行时间：</label>
        <b style="marginLeft: 20px;">{{ notArrangedAdminVal.trainDt }}</b>
      </h3>
      <h3 class="public-title"><label for="">计划入寓时间：</label>
        <b style="marginLeft: 20px;">{{ notArrangedAdminVal.planedArriveTime }}</b>
      </h3>
      <h3 class="public-title"><label for="">铺位号：</label>
        <b style="marginLeft: 20px;">{{ notArrangedAdminVal.bedNo }}</b>
      </h3>
      <h3 class="public-title"><label for="" v-text="`${notArrangedAdminVal.title}原因：`"></label>
        <el-input v-model="notArrangedAdminVal.updateReason" style="width: 41%;"></el-input>
      </h3>
      <h3 class="public-title" v-if="!notArrangedAdminVal.stopState"><label for="">推迟叫班时间：</label>
        <el-time-picker
          v-model="notArrangedAdminVal.remindDt"
          value-format="HH:mm"
          placeholder="任意时间点">
        </el-time-picker>
      </h3>
      <div slot="footer" class="dialog-footer">
        <el-button @click="notArrangedAdminDelayCancel">取 消</el-button>
        <el-button type="primary" @click="ok">确 定</el-button>
      </div>
    </el-dialog>
    <div v-if="boxShow">
      <record-show :boxShow="boxShow" :recordVal="tempRes" @closeRecordBox="closeRecordBox" :readonly="readonly"></record-show>
    </div>
  </div>
</template>

<script>
	import bedChoose from '../components/bedChoose'
  import {mapState} from 'vuex'
  import {mapGetters} from 'vuex'
  import recordShow from '../components/recordShow'

export default {
  data () {
    return {
      requstTrainNo: '',
      openTable: ['2', '3'],  // 默认展开的table列表
      createRecordRequst: {},
      createRes: {},
      notArrangedState: false,
      overIntervalState: false,
      changeBedState: false,
      selectBedState: false,
      selectBedVal:{
       bedNo: '',
       bedSid: ''
      },
      overIntervalRes: {},
      oldChangeBedValRes: {},
      changeBedValRes: {},
      boxShow: false,
      readonly: true,
      recordFlag: false,
      tempRes: {},
      auto1maxlength: 50,
      autoFlag: true,
      leaveRes: {},
      pickerOptions: {   // 叫班时间限制范围
        selectableRange: ''
      },
      updateReasonShow: false,
      watchRemindPlanedTime1: '',
      notArrangedAdminDelayBox: false,
      notArrangedAdminVal: {},
      width: '120px'
    }
  },
  components: {
    bedChoose,
    recordShow
  },
  filters: {
    date: function (value) {
      if (!value) return ''
      return value.split(' ')[1]
    }
  },
  watch: {
    'changeBedValRes.trainDt': {
      handler: function (newvalue, oldvalue) {
        console.log('开行时间', newvalue)
      }
    }
  },
  computed: {
    ...mapState(['hideFinishedList', 'lateSwitch', 'username', 'timerList', 'leftList', 'notArrangedIsTodayList', 'notArrangedIsTomorrowList', 'backTop', 'timeAhead', 'supportingFaceFeature', 'supportDisplayCompletePlan']),
    ...mapGetters(['completedNum', 'notArrangedNum', 'notFinishedNum', 'notArrangedIsTodayNum', 'notArrangedIsTomorrowNum', 'leng', 'driverLateListLength'])
  },
  mounted () {
    this.$nextTick(() => {
      // console.log('我在左侧列表')
      this.$store.commit('loadingChangeFalse')
      this.$store.commit('isTodayOrIsTomorrow')
      let self = this
      setTimeout(() => {
        self.notArrangedState = self.$store.state.displayAllTrain
      }, 100);
    })
  },
  methods: {
    updateRemindTime1Watcher () {
      if (this.changeBedValRes.remindPlanedTime1 !== this.watchRemindPlanedTime1) {
        this.updateReasonShow = true
      } else {
        this.updateReasonShow = false
        this.changeBedValRes.updateReason = ''
      }
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
        }
      }).catch((error) => {
        console.log('请销假列表请求发送失败原因', error)
      })
    },
    openRecordBox () {
      this.$store.commit('changeRecordBoxStateTrue')
    },
    notArrangedAdminDelayCancel () {
      this.notArrangedAdminVal = {}
      this.notArrangedAdminDelayBox = false
    },
    ok () {
      if (!this.notArrangedAdminVal.updateReason || !this.notArrangedAdminVal.updateReason.trim()) {
        this.$message.error('请填写原因!')
        return
      }
      this.$confirm('确认提交？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        if (this.notArrangedAdminVal.stopState) {
          this.cancelUnscheduled()
        } else {
          this.notArrangedAdminDelayOk()
        }
      }).catch(() => {
      });
    },
    notArrangedAdminDelayOk () {
      this.notArrangedAdminVal.remindPlanedTime1 = this.notArrangedAdminVal.remindDt
      this.axios({
        method: 'post',
        data: this.notArrangedAdminVal,
        url: '/web/plan/delay',
        headers: {'appType': 'web','appid': 'logan'}
      }).then((response) => {
        let data = response.data
        if(data.type === 1) {
          this.$message.success(`车次（${this.notArrangedAdminVal.trainNo}）推迟叫班时间成功`)
          this.notArrangedAdminDelayCancel()
        } else {
          this.$message.error(`车次（${this.notArrangedAdminVal.trainNo}）推迟叫班时间失败`)
        }
      }).catch((error) => {
        console.log('推迟车次叫班时间链接断开', error)
      })
    },
    notArrangedAdmin (command) {
      if (command[0] === 1) {
        this.createChange(command[2])
      } else if (command[0] === 2) {
        this.notArrangedAdminDelayBox = true
        this.notArrangedAdminVal = JSON.parse(JSON.stringify(command[2]))
        this.notArrangedAdminVal.cancelBy = this.username
        this.notArrangedAdminVal.stopState = true
        this.notArrangedAdminVal.title = '停运'
      } else if (command[0] === 3) {
        this.notArrangedAdminDelayBox = true
        this.notArrangedAdminVal = JSON.parse(JSON.stringify(command[2]))
        this.notArrangedAdminVal.cancelBy = this.username
        this.notArrangedAdminVal.stopState = false
        this.notArrangedAdminVal.title = '推迟'
      }
    },
    cancelMsg (val) {
      let self = this
      this.$prompt(`请填写取消原因：`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        showClose: false, 
        distinguishCancelAndClose: true,
        lockScroll: true,
      }).then(({ value }) => {
        if (!value) {
          this.$message({
            type: 'error',
            message: `请填写取消原因!`
          })
          return
        }
        this.cancelInterva(val)
      }).catch(() => {
      });
    },
    changeState (command) {
      this.getLeaveBack(command[2].sid)
      if (command[0] === 1) {
        let msg
        if (command[2].holidayType) {
          msg = `该司机还未销假,确定取消铺位（${command[2].bedNo}）的待乘?`
        } else {
          msg = `确定取消铺位（${command[2].bedNo}）的待乘？`
        }
        this.$confirm(msg, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.cancelMsg(command[2])
        })
      } else if (command[0] === 2) {
        this.changeBedValRes = JSON.parse(JSON.stringify(command[2]))
        this.changeBedValRes.trainDt = this.changeBedValRes.trainDt ? this.moment(this.changeBedValRes.trainDt).format('HH:mm') : ''
        this.changeBedValRes.remindPlanedTime1 = this.changeBedValRes.remindPlanedTime1 ? this.moment(this.changeBedValRes.remindPlanedTime1).format('HH:mm') : ''
        this.oldChangeBedValRes = JSON.parse(JSON.stringify(command[2]))
        this.selectRemindPlanedTime1(this.changeBedValRes.trainDt)
        this.changeBedState = true
      } else if (command[0] === 3) {
        this.overIntervalState = true 
        this.overIntervalRes = command[2]
      }
    },
    changeBedConfirm() {
      if (this.updateReasonShow && !this.changeBedValRes.updateReason) {
        this.$message.error('请填写修改原因！')
        return
      }
      this.changeBedValRes.lateFlag = false
      this.changeBedValRes.updateBy = this.username
      this.$confirm('确认提交？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        // this.changeBed()
        this.closeRecordBox(this.changeBedValRes, 'update')
      }).catch(() => {
      });
    },
    changeBed () {
      this.axios({
        method: 'post',
        data: this.changeBedValRes,
        url: '/api2/record/change',
        headers: {'appType': 'web','appid': 'logan'}
      })
      .then((response) => {
        let data = response.data
        if(data.type === 1) {
          this.$message.success('修改成功')
          this.changeBedState = false
          this.leaveRes = {}
          this.changeBedValRes = {}
          this.updateReasonShow = false
          this.oldChangeBedValRes = {}
          this.createRes = {}
        } else if (data.type === 4001) {
          this.createRes = {}
          this.$message.error(`未找到主键为${this.changeBedValRes.sid}的待乘记录`)
        } else if (data.type === 4002) {
          this.createRes = {}
          this.$message.error(data.msg)
        } else if (data.type === 4003) {
          this.$message.error(data.msg)
        } else if (data.type === 4004) {
          this.createRes = {}
          this.$message.error(`未找到主键为${this.changeBedValRes.sid}的铺位`)
        } else if (data.type === 4005) {
          this.createRes = {}
          this.$message.error(`铺位${this.changeBedValRes.sid}正在使用`)
        } else {
          this.createRes = {}
          this.$message.error(`修改失败,${data.msg}`)
        }
      }).catch((error) => {
        console.log('请求修改待乘信息链接失败', error)
      })
    },
    changeBedCancelConfirm () {
      this.$confirm('取消修改？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.changeBedState = false
        setTimeout(() => {
          this.leaveRes = {}
          this.changeBedValRes = {}
          this.oldChangeBedValRes = {}
          this.updateReasonShow = false
        }, 500)
      }).catch(() => {
      });
    },
    cancelInterva (val, cancelReason) { // 确认取消待乘
      this.axios({
        method: 'get',
        params: {'sid': val.sid, 'cancelReason': cancelReason, 'cancelBy': this.username},
        url: '/api2/record/cancel',
        headers: {'appType': 'web','appid': 'logan'}
      })
      .then((response) => {
        let data = response.data
        if(data.type === 1) {
          this.$message.success(`铺位（${val.bedNo}）取消待乘成功`)
        } else {
          this.$message.error(`铺位（${val.bedNo}）取消待乘失败`)
        }
      }).catch((error) => {
        console.log('取消待乘链接断开', error)
      })
    },
    cancelUnscheduled () { // 取消未开始车次
      this.axios({
        method: 'post',
        data: this.notArrangedAdminVal,
        url: '/web/plan/cancel',
        headers: {'appType': 'web','appid': 'logan'}
      })
      .then((response) => {
        let data = response.data
        if(data.type === 1) {
          this.$message.success(`停运车次（${this.notArrangedAdminVal.trainNo}）成功`)
          this.notArrangedAdminDelayCancel()
        } else {
          this.$message.error(`停运车次（${this.notArrangedAdminVal.trainNo}）失败`)
        }
      }).catch((error) => {
        console.log('取消未开始车次链接断开', error)
      })
    },
    overAxios () {
      this.axios({
        method: 'get',
        params: {'sid': this.overIntervalRes.sid},
        url: '/app/end',
        headers: {'appType': 'web','appid': 'logan'}
      })
      .then((response) => {
        let data = response.data
        if(data.type === 1) {
          this.$message.success(`铺位（${this.overIntervalRes.bedNo}）结束待乘成功`)
        } else if (data.type === 4101) {
          this.$message.error('待乘记录未开始')
        } else if (data.type === 4102) {
          this.$message.error('待乘记录已结束')
        } else if (data.type === 4104) {
          this.$message.error('设备编号不匹配')
        } else {
          this.$message.error('结束待乘失败')
        }
        this.overIntervalState = false
        this.leaveRes = {}
        this.changeBedVal = {}
      }).catch((error) => {
        console.log('结束待乘链接断开', error)
      })
    },
    overInterval () {
      if (this.overIntervalRes.holidayType) {
        this.$confirm(`该司机还未销假,确定结束铺位${this.overIntervalRes.bedNo}的待乘？`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.overAxios()
        }).catch(() => {
        });
      } else {
        this.overAxios()
      }
    },
    addNotArrangedIsToday () {
      this.readonly = false
      let trainDt = this.moment().add(1, 'H').format('HH:mm')
      let remindDt = this.moment(this.moment().add(1, 'H')).subtract(this.timeAhead, 'm').format('HH:mm')
      let interval = {
        "status": "",
        "remindPlanedTime1": "",
        "remindDt": "",
        "trainNo": "",
        "driverName": "",
        "trainDt": "",
        "startTime": "",
        "bedNo": "",
        "bedSid": "",
        "timeAhead": "",
        "ldName": "",
        "ticket1": "",
        "tdTime": "",
      }
      this.createChange(interval, 'temporary')
    },
    tableFinishedRowClassName ({row, rowIndex}) {
      if (row.status === 25) {
        return 'red'
      } else if (row.status === 23 || row.status === 24) {
        return 'green'
      } else if (row.status === 22 && row.remindTimes === 1) {
        return 'yellow'
      } else if (row.status === 22 && row.remindTimes === 2) {
        return 'orange'
      } else if (row.status === 21) {
        return 'blue'
      } else if (row.status === 26) {
        return 'gray'
      }
      return ''
    },
    tableRowClassName ({row, rowIndex}) {
      if (row.stop) {
        return 'is-outage-row'
      }
      if (row.isError) {
        return 'is-error-row'
      }
      if (row.isTomorrow) {
        return 'is-tomorrow-row'
      }
      return '' 
    },
    chooseFineshedBed (bunk, index) {
      this.$set(this.changeBedValRes, 'bedNo', bunk.bedNo)
      this.$set(this.changeBedValRes, 'bedSid', bunk.bedSid)
    },
    chooseBed (bunk, index) {
      if (this.notArrangedState) {
        this.$set(this.leftList.notArrangedList[index], 'bedNo', bunk.bedNo)
        this.$set(this.leftList.notArrangedList[index], 'bedSid', bunk.bedSid)
      } else {
        this.$set(this.notArrangedIsTodayList[index], 'bedNo', bunk.bedNo)
        this.$set(this.notArrangedIsTodayList[index], 'bedSid', bunk.bedSid)
      }
    },
    chooseSelectBed (bunk, index) {
      this.$set(this.selectBedVal, 'bedNo', bunk.bedNo)
      this.$set(this.selectBedVal, 'bedSid', bunk.bedSid)
      this.createRes.bedNo = this.selectBedVal.bedNo
      this.createRes.bedSid = this.selectBedVal.bedSid
    },
    querySearch2(queryString, cb) {  // 自动补全框方法
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
    handleSelect1(item) {
      this.$set(this.changeBedValRes, 'trainNo', item.trainNo)
      this.$set(this.changeBedValRes, 'trainDt', item.trainDt)
      this.$set(this.changeBedValRes, 'remindPlanedTime1', item.remindPlanedTime1)
      if (item.bedSid) {
        this.$set(this.changeBedValRes, 'bedSid', item.bedSid)
        this.$set(this.changeBedValRes, 'bedNo', item.bedNo)
      }
      this.updateRemindTime1Watcher()
    },
    emptyTime (index) {
      if (this.empty) {
        this.changeBedValRes.trainDt = ''
        this.changeBedValRes.remindPlanedTime1 = ''
      }
    },
    selectRemindPlanedTime1 (trainDt) {
      let trainDtArr = trainDt.split(":")
      let now = this.moment().format('HH:mm:ss')
      let remindPlanedRange = trainDt + ':00'
      this.pickerOptions.selectableRange = `${now}-${remindPlanedRange}`
      this.watchRemindPlanedTime1 = this.moment(this.oldChangeBedValRes.remindPlanedTime1).format('HH:mm')
      for (let i in trainDtArr) {
        trainDtArr[i] = parseInt(trainDtArr[i])
      }
      let hours = trainDtArr[0]
      let minutes = 0
      if (trainDtArr[1] >= this.timeAhead) {
        minutes = trainDtArr[1] - this.timeAhead
      } else {
        let num = trainDtArr[1]
        while (num < this.timeAhead) {
          hours = hours - 1
          num += 60
        }
        minutes = num - this.timeAhead
      }
      if (hours < 10) {
        hours = '0' + hours
      }
      if (minutes < 10) {
        minutes = '0' + minutes
      }
      let time = hours + ':' + minutes
      this.$set(this.changeBedValRes, 'remindPlanedTime1', time)
      this.$set(this.oldChangeBedValRes, 'newRemindPlanedTime', time)
      this.updateRemindTime1Watcher()
    },
    autoFocus () {
      this.auto1maxlength = 50
      this.requstTrainNo = ''
    },
    querySearch(queryString, cb) {  // 自动补全框方法
      var restaurants = this.leftList.notArrangedList
      var results = queryString ? restaurants.filter(this.createFilter(queryString)) : restaurants;
      // 调用 callback 返回建议列表的数据
      cb(results);
      console.log('auto1 dom' , this.$refs.auto1)
      if (results && results.length > 1) {
        this.autoFlag = true
        this.auto1maxlength = 50
      }
      if (!this.autoFlag) {
        return
      }
      if (results && results.length === 1) {
        this.handleSelect(results[0])
      }
    },
    createFilter(queryString) {
      return (restaurant) => {
        return (restaurant.trainNo.toLowerCase().indexOf(queryString.toLowerCase()) > -1);
      };
    },
    handleSelect(item) {
      this.createRecordRequst = item
      this.requstTrainNo = item.trainNo
      this.auto1maxlength = this.requstTrainNo.length
      this.autoFlag = false
    },  
    createChange (val, source) { //同步验证
      this.$refs.auto1.$refs['input'].blur()
      this.$refs.auto1.close()
      this.requstTrainNo = ''
      if (!source) {
        if (!val.trainNo) {
          this.$message.error('请填写车次号')
          return
        }
      }
      this.createRes = val
      if (!this.createRes.driverName) {
        this.$set(this.createRes, 'driverName', '')
      } 
      if (!this.createRes.workNo) {
        this.$set(this.createRes, 'workNo', '')
      } 
      this.tempRes = this.createRes
      this.boxShow = true
    },
    closeRecordBox (val, state) {
      if (val === 'close') {
        this.boxShow = false
        this.readonly = true
        this.$message.info('已取消办理！')
        this.createRecordRequst = {}
        return
      } else if (val) {
        this.createRes = val
        this.createRes.driverName = val.name
      } else {
        return
      }
      if (this.createRes.remindDt) {
        this.createRes.remindPlanedTime1 = this.createRes.remindDt
      }
      if (!this.createRes.trainNo) {
        this.$message.error('缺少车次号')
        return
      } else if (!this.createRes.trainDt) {
        this.$message.error('请填写出行时间！')
        return
      } else if (!this.createRes.remindPlanedTime1) {
        this.$message.error('缺少叫班时间')
        return
      } else if (!this.createRes.bedNo) {
        this.$message.error('缺少铺位号')
        this.selectBedState = true
        return
      }
      this.asynCreateChange(state)
    },
    asynCreateChange (state) { // 异步验证
      this.selectBedState = false
      let self = this
      let dateMs = this.moment().valueOf()
      let year = this.moment().format('YYYY-MM-DD')
      let newDate = `${year} ${self.createRes.remindPlanedTime1}:00`
      let createRemindDtMs = this.moment(newDate).valueOf()
      this.axios({
        method: 'get',
        url: '/web/bedInfos',
        headers: {'appType': 'web','appid': 'logan'}
      }).then((response) => {
        let bedSidList = []
        let data = response.data
        let bedList = response.data.result.bedInfos
        if (data.type === 1) {
          for (let i in bedList) {
            bedSidList.push(bedList[i].bedNo)
          }
          let bedIndex = bedSidList.indexOf(self.createRes.bedNo)
          if (bedList[bedIndex] > -1 && !bedList[bedIndex].withMobile && (self.createRes.isTomorrow || (dateMs > createRemindDtMs))) {
            this.$confirm(`铺位暂无绑定手表，并且您选择的叫班时间是明天，是否继续`, '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning'
            }).then(() => {
              if (state === 'update') {
                this.changeBed()
              } else {
                this.createRecord()
              }
              return
            }).catch(() => {
              return
            })
          } else if (bedList[bedIndex] > -1 && !bedList[bedIndex].withMobile) {
            this.$confirm(`铺位暂无绑定手表，是否继续`, '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning'
            }).then(() => {
              if (state === 'update') {
                this.changeBed()
              } else {
                this.createRecord()
              }
              return
            }).catch(() => {
              return
            })
          } else if (self.createRes.isTomorrow || (dateMs > createRemindDtMs)) {
            this.$confirm(`当前选择的叫班时间为明天，是否继续`, '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning'
            }).then(() => {
              if (state === 'update') {
                this.changeBed()
              } else {
                this.createRecord()
              }
              return
            }).catch(() => {
              return
            })
          } else {
            if (state === 'update') {
              this.changeBed()
            } else {
              this.createRecord()
            }
          }
        } else {
          this.$message.error(data.msg)
        }
      }).catch((error) => {
        console.log('待乘失败!')
      })
    
    },
    createRecord (val) {
      if (val) {
        this.createRes = val
      }
      this.axios({
        method: 'post',
        url: '/api2/record/create',
        data: this.createRes
      }).then((res) => {
        let data = res.data
        if (data.type === 1) {
          this.$message.success(`铺位（${this.createRes.bedNo}）开始待乘`)
          this.requstTrainNo = ''
          this.createRecordRequst = {}
          this.selectBedVal = {}
          this.createRes = {}
          this.boxShow = false
          this.readonly = true
        } else if (data.type === 4001) {
          this.$message.error('该司机办理了待乘')
        } else if (data.type === 4002) {
          this.$message.error('该铺位当前已在使用中')
        }
      }).catch((err) => {
        console.log('开始待乘网络请求失败')
      })
    }
  },
}
  
</script>

<style>
.ctrl-box {
  width: 49%;
  float: left;
  margin-top: 10px;
}
.ctrl-head .el-autocomplete {
  width: 180px;
}
.ctrl-head h4 {
  display: inline-block;
  margin-left: 30px;
}
.ctrl-head-autocomplete {
  /* margin-left: 10%; */
}
.ctrl-head-autocomplete-btn {
  margin-left: 30px;
}
.ctrl-box .ctrl-head {
  /* padding: 3px; */
  display: flex;
  flex-wrap: nowrap;
  justify-content: space-around;
  align-items: center;
}
.ctrl-box .bed .el-button{
  display: inline-block;
  margin: 5px 20px 0 20px;
  width: 110px;
}
.public-title label {
  display: inline-block;
  width: 25%;
  text-align: right;
}
.not-f-img {
  display: inline-block;
  width: 20px;
  height: 20px;
}
.not-f-img img, .not-a-img img {
  width: 100%;
  height: 100%;
}
.bg-red {
  background: red;
}
.not-a-img {
  display: inline-block;
  width: 20px;
  height: 20px;
  float: right;
}
.msg-float {
  margin-left: 30px;
  font-size: 16px;
  color: red;
}



/* element-ui样式 */

.ctrl-box .ctrl-body {
    margin-top: 30px;
}

.el-table .is-tomorrow-row {
    background: #a8a8a8;
}
.el-table .is-outage-row {
    background: rgb(216, 246, 82);
}
.el-table .is-error-row {
  background: rgb(241, 75, 75);
}
.ctrl-box .el-collapse-item__header {
  font-weight: bold;
  font-size: 20px;
}
</style>

