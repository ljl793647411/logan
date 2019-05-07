<template>
  <div class="updateBox">
			<el-dialog title="添加待乘巡检：" :visible.sync="addBox" width="40%" :show-close="false" :close-on-click-modal="false" :close-on-press-escape="false">
				<el-form :model="addInsVo">
					<el-form-item label="巡检人姓名：" :label-width="formLabelWidth">
            <el-autocomplete 
            class="inline-input"
            v-model="addInsVo.name"
            :fetch-suggestions="querySearch2"
            placeholder="请输入工号"
            :trigger-on-focus="true"
            @select="handleSelect1"
            value-key="userNo, username"
            :debounce="0"
            :clearable="false">
              <template slot-scope="props">
                <span style="margin-left: 5px;" v-text="props.item.username + '(' + props.item.userNo + ')，职位：' + (props.item.gbjb ? props.item.gbjb : '无')"></span>
              </template>
          </el-autocomplete>
					</el-form-item>
					<el-form-item label="职位：" :label-width="formLabelWidth">
						<el-input v-model="addInsVo.gbjb" :readonly="true"></el-input>
					</el-form-item>
					<el-form-item label="巡检时间：" :label-width="formLabelWidth" class="in-date-class">
						<el-time-picker
							v-model="checkTime"
							value-format="HH:mm:ss"   
							placeholder="任意时间点">
						</el-time-picker>
					</el-form-item>
					<el-form-item label="登记方式：" :label-width="formLabelWidth">
            <span v-text="addInsVo.checkmanner"></span>
					</el-form-item>
					<el-form-item label="待乘地点：" :label-width="formLabelWidth">
						<el-input v-model="addInsVo.address"></el-input>
					</el-form-item>
					<el-form-item label="巡检内容：" :label-width="formLabelWidth" class="select-box">
            <el-select v-model="addInsVo.checkContent" placeholder="请选择">
              <el-option
                v-for="item in inspectionReasonList"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
					</el-form-item>
					<el-form-item label="措施：" :label-width="formLabelWidth" v-if="addInsVo.checkContent === '异常'">
						<el-input type="textarea" v-model="addInsVo.checkMeasure" :autosize="{ minRows: 2, maxRows: 4}" style="width: 50%;" :maxlength="500"></el-input>
					</el-form-item>
				</el-form>
        <div class="photo-card" v-if="addInsVo.fileName">
          <img :src="'api2/image?type=checkRecord&fileName=' + addInsVo.fileName" alt="">
        </div>
				<div slot="footer" class="dialog-footer">
					<el-button @click="closeAddBox">取 消</el-button>
					<el-button type="primary" @click="addRes">确 定</el-button>
				</div>
			</el-dialog>
		</div>
</template>

<script>
import config from '../public/config.vue'
import {mapState} from 'vuex'
export default {
  data () {
    return {
      addInsVo: {},
      formLabelWidth: '120px',
      addBox: true,
      registerType: [],
      checkTime: '',
      inspectionReasonList: config.inspectionReasonList
    }
  },
  mounted () {
    this.$nextTick(() => {
      this.addInsVo = this.addInspectionVo
      this.checkTime = this.moment(this.addInsVo.checkTime).format('HH:mm:ss')
      this.addInsVo.address = this.name
      // this.registerType = config.getRegisterType(config.registerList)
      if (this.type === 'post') {
        this.addInsVo.checkmanner = '人工'
      }
    })
  },
  components: {
    config
  },
  computed: {
    ...mapState(['userList', 'name'])
  },
  props: ['addInspectionVo', 'type'],
  methods: {
    querySearch2(queryString, cb) {  // 自动补全框方法
      var restaurants = this.userList
      var results = queryString ? restaurants.filter(this.createFilter(queryString)) : restaurants;
      // 调用 callback 返回建议列表的数据
      cb(results);
    },
    handleSelect1(item) {
      this.$set(this.addInsVo, 'name', item.username)
      this.$set(this.addInsVo, 'workNo', item.userNo)
      this.$set(this.addInsVo, 'gbjb', item.gbjb)
    },
    createFilter(queryString) {
      return (restaurant) => {
        return (restaurant.userNo.toLowerCase().indexOf(queryString.toLowerCase()) > -1 || restaurant.username.indexOf(queryString) > -1);
      };
    },
    closeAddBox () {
      this.$confirm('是否放弃编辑?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        if (this.type === 'ws') {
          this.axios({
            method: 'get',
            url: '/api2/check/reject',
            params: {'key': this.addInspectionVo.key}
          }).then((res) => {
            let data = res.data
            if (data.type === 1) {
              this.closeBox()
            }
          }).catch((err) =>{
            console.log('请求拒绝ws待乘巡检接口失败', err)
          })
        } else if (this.type === 'post') {
          this.closeBox()
        }
      }).catch(() => {
      });
    },
    closeBox () {
      this.addBox = false
      this.$emit('closeAddBox')
      this.$message({
        type: 'success',
        message: '编辑取消!'
      });
    },
    addRes () { // 新增待乘巡检
      if (!this.addInsVo.name || !this.addInsVo.workNo || !this.addInsVo.gbjb) {
        this.$message.error('请重新选择司机信息及职位')
        return
      }
      if (!this.addInsVo.checkmanner) {
        this.$message.error('登记方式不能为空')
        return
      }
      if (!this.checkTime) {
        this.$message.error('巡检时间不能为空')
        return
      } else {
        let date = this.moment().format('YYYY-MM-DD') + ' ' + this.checkTime
        this.addInsVo.checkTime = date
      }
      if (!this.addInsVo.address) {
        this.$message.error('待乘地点不能为空')
        return
      }
      if (!this.addInsVo.checkContent) {
        this.$message.error('巡检内容不能为空')
        return
      }
      this.axios({
        method: 'post',
        data: this.addInsVo,
        url: '/api2/check/add',
        headers: {'appType': 'web','appid': 'logan'}
      })
      .then( (response) => {
        var data = response.data
        if (data.type === 1) {
          this.$emit('closeAddBox')
          this.$message.success('待乘巡检编辑成功！')
          this.addBox = false
        } else {
          this.$message.error(data.msg)
        }
      }).catch( (error) => {
        console.log('待乘巡检编辑失败')
      })
    }

  }
}
</script>

<style>
  .updateBox .el-input {
		width: 50%;
	}
	.updateBox {
		z-index: 9999;
  }
  .inline-input {
    width: 600px;
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
  .updateBox .select-box .el-input {
    width: 302px !important;
  }
  .updateBox .in-date-class .el-input {
    width: 302px;
  }
</style>
