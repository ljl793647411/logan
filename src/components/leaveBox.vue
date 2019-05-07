<template>
  	<div class="leaveBox">
			<el-dialog :title="title" :visible.sync="boxShow" width="40%" :show-close="false" :close-on-click-modal="false" :close-on-press-escape="false">
				<el-form :model="leaveVo">
					<el-form-item label="姓名：" :label-width="formLabelWidth">
						<!-- <el-input v-model="leaveVo.name" v-if="leaveState"></el-input> -->
            <span class="span" v-text="leaveVo.name"></span>
					</el-form-item>
					<el-form-item label="工号：" :label-width="formLabelWidth">
						<!-- <el-input v-model="leaveVo.workNo" v-if="leaveState"></el-input> -->
            <span class="span" v-text="leaveVo.workNo"></span>
					</el-form-item>
					<el-form-item label="请假时间：" :label-width="formLabelWidth">
            <span class="span" v-text="leaveVo.lyTime"></span>
					</el-form-item>
					<el-form-item label="销假时间：" :label-width="formLabelWidth" v-if="!leaveState">
            <span class="span" v-text="leaveVo.hyTime"></span>
					</el-form-item>
					<el-form-item label="预计销假时间：" :label-width="formLabelWidth">
						<el-time-picker
              v-if="leaveState"
							v-model="yjfhTime"
							value-format="HH:mm:ss"
							placeholder="任意时间点"
              :picker-options="pickerOptions">
						</el-time-picker>
            <span class="span" v-text="leaveVo.yjfhTime" v-else></span>
					</el-form-item>
					<el-form-item label="请假事由：" :label-width="formLabelWidth">
						<el-select v-model="reason" placeholder="请选择" v-if="leaveState">
              <el-option
                v-for="item in leaveReasonList"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
            <span class="span" v-text="leaveVo.reason" v-else></span>
            <el-input v-model="reasonOther" class="reason-other" v-if="reason === '其他'"></el-input>
					</el-form-item>
					<el-form-item label="地点：" :label-width="formLabelWidth">
            <span class="span" v-text="leaveVo.address"></span>
					</el-form-item>
					<el-form-item label="请假方式：" :label-width="formLabelWidth">
            <span class="span" v-text="leaveVo.way"></span>
					</el-form-item>
					<el-form-item label="请假值班员：" :label-width="formLabelWidth">
            <span class="span" v-text="leaveVo.qjOperator"></span>
					</el-form-item>
					<el-form-item label="销假值班员：" :label-width="formLabelWidth" v-if="!leaveState">
            <span class="span" v-text="leaveVo.xjOperator"></span>
					</el-form-item>
				</el-form>
        <div class="photo-card" v-if="leaveVo.fileName">
          <!-- <img src="../public/img/bed.png" alt=""> -->
          <img :src="'/api2/image?type=driver&fileName=' + leaveVo.fileName" alt="">
        </div>
				<div slot="footer" class="dialog-footer">
					<el-button @click="closeAddBox">取 消</el-button>
					<el-button type="primary" @click="comfirm">确 定</el-button>
				</div>
			</el-dialog>
		</div>
</template>

<script>
import {mapState} from 'vuex'
export default {
  data () {
    return {
      leaveVo: {},
      boxShow: true,
      formLabelWidth: '140px',
      pickerOptions: {
        selectableRange: ''
      },
      yjfhTime: '',
      reasonOther: '',
      reason: ''
    }
  },
  mounted () {
    this.$nextTick(() => {
      this.leaveVo = this.leaveObj
      if (this.leaveState) {
        if (this.type === "post") {
          let now = this.moment().format('HH:mm:ss')
          let oneHours = this.moment().add(1, 'h').format('HH:mm:ss')
          this.yjfhTime = oneHours
          let remindPlanedTime = this.moment(this.leaveVo.remindPlanedTime).format('HH:mm:ss')
          this.pickerOptions.selectableRange = `${now}-${remindPlanedTime}`
        } else if (this.type === "ws") {
          this.yjfhTime = this.moment(this.leaveVo.yjfhTime).format('HH:mm:ss')
          this.reason = this.leaveVo.reason
        }
        this.leaveVo.address = this.name
        this.leaveVo.qjOperator = this.username
      } else {
        this.leaveVo.xjOperator = this.username
      }
      if (this.type === 'ws') {
        this.leaveVo.way = '人脸'
      } else if (this.type === 'post') {
        this.leaveVo.way = '人工'
      }
    })
  }, 
  computed: {
    ...mapState(['name', 'leaveReasonList', 'username'])
  },
  props: ['leaveObj', 'title', 'leaveState', 'type'],
  methods: {
    closeAddBox () {
      this.$confirm('是否放弃编辑?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        if (this.type === 'ws') {
          this.axios({
            method: 'get',
            url: 'api2/holiday/reject',
            params: {'key': this.leaveObj.key}
          }).then((res) => {
            let data = res.data
            if (data.type === 1) {
              this.closeBox()
            }
          }).catch((err) =>{
            console.log('请求拒绝ws请销假接口失败', err)
          })
        } else if (this.type === 'post') {
          this.closeBox()
        }
      }).catch(() => {
      });
    },
    closeBox () {
      this.addBox = false
      this.$emit('closeLeaveBox')
      this.$message({
        type: 'success',
        message: '编辑取消!'
      });
    },
    comfirm () {
      if (!this.leaveVo.name || !this.leaveVo.name) {
        this.$message.error('请重写开始待乘并填写司机姓名与工号！')
        return
      }
      if (!this.reason && !this.leaveVo.reason) {
        this.$message.error('请填写请假事由！')
        return
      } 
      if (this.reason) {
        if (this.reason === '其他') {
          if (this.reasonOther.trim()) {
            this.leaveVo.reason = this.reasonOther
          } else {
            this.$message.error('请填写请假事由！')
            return
          }
        } else {
          this.leaveVo.reason = this.reason
        }
      }
      // let url
      // if (this.type === 'ws') {
      //   url = this.leaveState ? '/api2/driver/holidayByKey' : '/api2/driver/cancleHolidayByKey'
      // } else if (this.type === 'post') {
      //   url = this.leaveState ? '/api2/driver/holiday' : '/api2/driver/cancleHoliday'
      // }
      let url = this.leaveState ? '/api2/driver/holiday' : '/api2/driver/cancleHoliday'
      if (!this.yjfhTime && !this.leaveVo.yjfhTime) {
        this.$message.error('请选择预计回寓时间')
        return
      } else if (this.yjfhTime && this.leaveState) {
        let yjfhDate = this.moment().format('YYYY-MM-DD') + ' ' + this.yjfhTime
        this.leaveVo.yjfhTime = yjfhDate
      }
      this.axios({
        method: 'post',
        url: url,
        data: this.leaveVo
      }).then((res) => {
        let data = res.data
        if (data.type === 1) {
          this.$emit('closeLeaveBox')
          let msg = this.leaveState ? '请假成功' : '销假成功'
          this.$message.success(msg)
        } else {
          let msg = this.leaveState ? '请假失败' : '销假失败'
          this.$message.error(msg)
        }
      }).catch((err) => {
        if (this.leaveState) {
				  console.log('请假请求发送失败原因', err)
        } else {
				  console.log('销假请求发送失败原因', err)
        }
      }) 
    }
  }
}
</script>

<style>
.leaveBox {
  z-index: 9999;
}
.leaveBox .el-input {
  width: 50%;
}
.leaveBox .span {
  font-size: 20px;
}
.photo-card img {
  width: 100%;
  height: 100%;
}
.photo-card {
  width: 160px;
  height: 120px;
  position: absolute;
  top: 9%;
  right: 9%;
}
</style>
