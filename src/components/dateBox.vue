<template>
  <div class="day-time">
    <div v-if="!radioProp" style="display: inline-block;">
      <el-radio-group v-model="radio">
        <el-radio-button label="明细" @click.native="radioChange(1)" border></el-radio-button>
        <el-radio-button label="汇总" @click.native="radioChange(2)" border></el-radio-button>
      </el-radio-group>
    </div>
    <!-- <div v-show="radio === '明细'" class="date-box-component">
      <span class="demonstration">时间选择：</span>
      <el-date-picker
        v-model="oneDayValue"
        align="right"
        type="date"
        placeholder="选择日期"
        :picker-options="pickerOptionsOneDay"
        @input="getOneDay">
      </el-date-picker>
    </div> -->
    <div class="date-box-component">
      <span class="demonstration">{{dateTitle}}</span>
      <el-date-picker
        :editable="false"
        v-model="dayValue"
        value-format="yyyy-MM-dd"
        type="daterange"
        align="right"
        unlink-panels
        range-separator="至"
        start-placeholder="开始日期"
        end-placeholder="结束日期"
        @input="getDay">
      </el-date-picker>
    </div>
    
  </div>
</template>

<script>
  export default {
    data () {
      return {
        // pickerOptionsOneDay: {
        //   disabledDate(time) {
        //     return time.getTime() > Date.now();
        //   },
        //   shortcuts: [{
        //     text: '今天',
        //     onClick(picker) {
        //       picker.$emit('pick', new Date());
        //     }
        //   }, {
        //     text: '昨天',
        //     onClick(picker) {
        //       const date = new Date();
        //       date.setTime(date.getTime() - 3600 * 1000 * 24);
        //       picker.$emit('pick', date);
        //     }
        //   }]
        // },
        pickerOptionsDay: {
          shortcuts: [{
            text: '最近一周',
            onClick (picker) {
              const end = new Date()
              const start = new Date()
              end.setTime(end.getTime())
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
              picker.$emit('pick', [start, end])
            }
          }, {
            text: '最近两周',
            onClick (picker) {
              const end = new Date()
              const start = new Date()
              end.setTime(end.getTime() )
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 14)
              picker.$emit('pick', [start, end])
            }
          }, {
            text: '最近一个月',
            onClick (picker) {
              const end = new Date()
              const start = new Date()
              end.setTime(end.getTime())
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
              picker.$emit('pick', [start, end])
            }
          }]
        },
        dayValue: [],
        radio: '明细'
      }
    },
    props: ['radioProp', 'dateTitle'],
    mounted () {
      this.$nextTick(() => {
        let to = this.moment().format('YYYY-MM-DD')
        let from
        if (this.radioProp) {
          this.radio = this.radioProp
        }
        if (this.radio === '汇总') {
          from = this.moment().subtract(30, 'd').format('YYYY-MM-DD')
        } else if (this.radio === '明细') {
          from = this.moment().format('YYYY-MM-DD')
        }  
        this.dayValue.push(from, to)
        this.getDay()
      })
    },
    methods: {
      getDay () {
        if (!this.dayValue && this.notValue.length === 0) {
          this.notValue()
          return
        }
        let date = {}
        for (let i = 0; i < this.dayValue.length; i++) {
          date.from = this.moment(this.dayValue[0]).format('YYYY-MM-DD')
          date.to = this.moment(this.dayValue[1]).format('YYYY-MM-DD')
        }
        let toMs = new Date(date.to).getTime()
        let fromMs = new Date(date.from).getTime()
        let noMs = this.moment(this.moment()).add(1, 'd').valueOf()
        if (toMs > noMs) {
          this.$message({
            message: '请选择有效的时间',
            type: 'error'
          })
          this.dayValue = []
          return
        }
        if (this.radio === '明细') {
          if (toMs - fromMs > 1000*60*60*24*6) {
            this.$message.error('查询明细范围不能超过7天')
            this.dayValue = []
            return
          }
        }
        this.$emit('sendDate', date)
      },
      notValue () {
        let date = {
          from: '',
          to: ''
        }
        this.$emit('sendDate', date)
      },
      radioChange (num) {
        let to
        let from
        if (num === 1) {
          to = this.moment().format('YYYY-MM-DD')
          from = this.moment().format('YYYY-MM-DD')
          this.dayValue = [from, to]
          this.getDay()
          this.$emit('radioChange', 1)
        } else if (num === 2) {
          // if (!this.dayValue || this.dayValue.length === 0) {
          to = this.moment().format('YYYY-MM-DD')
          from = this.moment().subtract(6, 'd').format('YYYY-MM-DD')
          this.dayValue = [from, to]
          // }
          this.getDay()
          this.$emit('radioChange', 2)
        }
      }
    }
  }
</script>


<style>
  .day-time {
    display: inline-block;
    line-height: 56px;
    font-size: 22px;
  }
  .block .el-date-editor.el-input__inner {
    width: 250px;
  }
  .date-box-component {
    display: inline-block;
    margin-left: 40px;
  }
</style>
