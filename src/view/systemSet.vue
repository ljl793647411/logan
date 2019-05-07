<template>
	<div class="sys">
		<div class="bed" v-show="!backTop"></div>
		<div class="sysContent">
			<el-collapse v-model="sysOpenTables">
				<el-collapse-item title="基本设置" name="0">
					<div>
						<label for="roomName">所属机务段名称：</label>
						<!-- <el-input v-model="sys.restRoomLdName" name="roomName" id="roomName"></el-input> -->
						<span v-text="sys.restRoomLdName"></span>
					</div>
					<div>
						<label for="roomName">待乘室名称：</label>
						<!-- <el-input v-model="sys.name" name="roomName" id="roomName"></el-input> -->
						<span v-text="sys.name"></span>
					</div>
					<div>
						<label for="abbr">待乘室缩写：</label>
						<!-- <el-input v-model="sys.abbr" name="abbr" id="abbr" ></el-input>（虹桥：HQ） -->
						<span v-text="sys.abbr"></span>
					</div>
					<div>
						<label for="serverIp">服务器IP：</label>
						<el-input v-model="sys.serverIp" name="serverIp" id="serverIp" style="width:215px"></el-input>
					</div>
					<div>
						<label for="serverIp" title="叫班功能是否启用">是否为运安版本：</label>
						<el-switch
							style="display: inline-block"
							v-model="sys.isYunanSwitch "
							active-color="#13ce66"
							inactive-color="#ff4949"
							active-text="开"
							inactive-text="关">
						</el-switch>
					</div>
					<div>
						<label for="serverIp" title="叫班功能是否启用">叫班功能：</label>
						<el-switch
							style="display: inline-block"
							v-model="sys.restSwitch "
							active-color="#13ce66"
							inactive-color="#ff4949"
							active-text="开"
							inactive-text="关">
						</el-switch>
					</div>
					<div>
						<label for="serverIp" title="超过计划入寓时间司机未到">司机未入寓提醒：</label>
						<el-switch
							style="display: inline-block"
							v-model="sys.lateSwitch"
							active-color="#13ce66"
							inactive-color="#ff4949"
							active-text="开"
							inactive-text="关">
						</el-switch>
					</div>
					<div>
						<label for="serverIp" title="休息时长不足，叫班时间已保证休息时长为准">休息时长不足提醒：</label>
						<el-switch
							style="display: inline-block"
							v-model="sys.restRemindSwitch"
							active-color="#13ce66"
							inactive-color="#ff4949"
							active-text="开"
							inactive-text="关">
						</el-switch>
					</div>
					<div>
						<label for="serverIp" title="">控制中心已结束列(设置此功能需刷新页面!)：</label>
						<el-switch
							style="display: inline-block"
							v-model="sys.hideFinishedList"
							active-color="#13ce66"
							inactive-color="#ff4949"
							active-text="显示"
							inactive-text="隐藏">
						</el-switch>
					</div>
					<div class="label">
						<label for="timeToLeave">是否启用离手检测：</label>
						<el-switch
							style="display: inline-block"
							v-model="sys.supportingWearing "
							active-color="#13ce66"
							inactive-color="#ff4949"
							active-text="开"
							inactive-text="关">
						</el-switch>
					</div>
					<div>
						<label for="serverIp">司机自助终端全量同步数据时间：（mm:ss）</label>
						<el-input v-model="sys.driverAppFullSyncTime" name="serverIp" id="serverIp" style="width:140px"></el-input>
					</div>
					<div>
						<label for="serverIp">手表心跳停止多久视为司机离线，单位秒：</label>
						<el-input v-model="sys.timeDriverAbsent" name="serverIp" id="serverIp" style="width:140px"></el-input>
					</div>
					<div>
						<label for="serverIp">默认显示全部未安排车次：</label>
						<el-switch
							style="display: inline-block"
							v-model="sys.displayAllTrain "
							active-color="#13ce66"
							inactive-color="#ff4949"
							active-text="开"
							inactive-text="关">
						</el-switch>
					</div>
					<div>
						<label for="serverIp">默认显示全部计划车次：（一趟车在一天内可多次办理待乘）</label>
						<el-switch
							style="display: inline-block"
							v-model="sys.supportDisplayCompletePlan "
							active-color="#13ce66"
							inactive-color="#ff4949"
							active-text="开"
							inactive-text="关">
						</el-switch>
					</div>
					<div>
						<label for="partition">铺位分区设置：</label>
						<div class="partition">
							<div v-for="(val, index) in sys.colorIndexMemos" :key="val + 'key'">
								<div class="color-block" :style="{'background': colorList[index]}" style="margin: 5px 10px"></div>
								<el-input type="text" v-model="sys.colorIndexMemos[index]" name="color" :id="'color' + index" style="width:90px;"></el-input>
							</div>
						</div>
					</div>
				</el-collapse-item>
				<el-collapse-item title="休息时长设置" name="2">
					<div>
						<label for="serverIp">机车调休：</label>
						<el-input v-model="sys.jcTiaoXiu" name="jcTiaoXiu" id="jcTiaoXiu" style="width:215px"></el-input>
					</div>
					<div>
						<label for="serverIp">机车驻班：</label>
						<el-input v-model="sys.jcZhuBan" name="jcZhuBan" id="jcZhuBan" style="width:215px"></el-input>
					</div>
					<div>
						<label for="serverIp">机车继乘：</label>
						<el-input v-model="sys.jcJiCheng" name="jcJiCheng" id="jcJiCheng" style="width:215px"></el-input>
					</div>
					<div>
						<label for="serverIp">动车驻班：</label>
						<el-input v-model="sys.dcZhuBan" name="dcZhuBan" id="dcZhuBan" style="width:215px"></el-input>
					</div>
					<div>
						<label for="serverIp">动车候班：</label>
						<el-input v-model="sys.dcHouBan" name="dcHouBan" id="dcHouBan" style="width:215px"></el-input>
					</div>
					<div>
						<label for="serverIp">动车间休：</label>
						<el-input v-model="sys.dcJianXiu" name="dcJianXiu" id="dcJianXiu" style="width:215px"></el-input>
					</div>
					<div>
						<label for="serverIp">其他：</label>
						<el-input v-model="sys.otherWaitDriveType" name="dcJianXiu" id="dcJianXiu" style="width:215px"></el-input>
					</div>
				</el-collapse-item>
				<el-collapse-item title="高级设置" name="1">
					<div>
						<label for="timeAhead">设定提前叫班间隔时长（分）:</label>
						<el-input v-model="sys.timeAhead" name="timeAhead" id="timeAhead" ></el-input> (建议范围20~120)
					</div>
					<div>
						<label for="interval">首次与二次叫班间隔时长（分）：</label>
						<el-input v-model="sys.interval" name="interval" id="interval" ></el-input> (建议范围3~10)
					</div>
					<div>
						<label for="timeToLeave">首次叫班至离寓间隔时长（分）：</label>
						<el-input v-model="sys.timeToLeave" name="timeToLeave" id="timeToLeave"></el-input> (建议范围10~40)
					</div>
					<div>
						<label for="timeOut">自动叫班响应超时时长（秒）：</label>
						<el-input v-model="sys.timeout" name="timeout" id="timeout" ></el-input> (建议范围45~120)
					</div>
					<div>
						<label for="timeOut">设备低电量阈值（低于该值则认为低电量）：</label>
						<el-input v-model="sys.deviceLowBatteryThreshold " name="deviceLowBatteryThreshold " id="deviceLowBatteryThreshold " ></el-input>
					</div>
					<div>
						<label for="timeToLeave">手表心跳停止时间最大值（秒）：</label>
						<el-input v-model="sys.timeMobileOffline" name="timeMobileOffline" id="timeMobileOffline" ></el-input>
					</div>
					<div>
						<label for="timeToLeave">待乘开始后，手表过了多久未取得该待乘记录视为进入待乘状态超时，铺位看板变为灰色（秒）：</label>
						<el-input v-model="sys.timeoutMobilePickupRestRecord" name="timeoutMobilePickupRestRecord" id="timeoutMobilePickupRestRecord" ></el-input>
					</div>
					<div>
						<label for="timeToLeave">待乘开始后多久未佩戴手表视为离手，单位秒，默认值300：</label>
						<el-input v-model="sys.timeMustWearAfterRestStart " name="timeMustWearAfterRestStart " id="timeMustWearAfterRestStart " ></el-input>
					</div>
					<div class="label">
						<label for="timeToLeave" title="用于司机自助APP办理入寓时选择车次的过滤">	司机自助办理待乘时，是否只显示本段别车次：</label>
						<el-switch
							style="display: inline-block"
							v-model="sys.driverAndTrainsSameLd"
							active-color="#13ce66"
							inactive-color="#ff4949"
							active-text="开"
							inactive-text="关">
						</el-switch>
					</div>
					<div>
						<label for="timeToLeave" title="由于手表时间与服务端的系统时间可能不一致，司机响应叫班结果上报到服务端的时间可能会比服务端期望的时间要晚。服务端应等待一个容错时间之后才认定司机响应超时，该属性配置这个容错时间">容错时间（秒）：</label>
						<el-input v-model="sys.reportTimeTolerance" name="reportTimeTolerance" id="reportTimeTolerance" ></el-input>
					</div>
					<div>
						<label for="timeToLeave" title="计算司机预计入寓时间为叫班时间减去休息时长和容错时间的总合，该属性配置这个容错时间">司机预计入寓容错时间（分）：</label>
						<el-input v-model="sys.aheadArriveTime" name="aheadArriveTime" id="aheadArriveTime" ></el-input>
					</div>
				</el-collapse-item>
				<div class="version">
					<h4>{{'服务端版本：' + versions.serverVersion + '，前端版本：6.5.0' + '，服务端支持的APP版本：' + versions.supportedAppVersions + '，服务端支持的前端版本：' + versions.supportedWebVersions}}</h4>
				</div>
			</el-collapse>
			<div>
				<el-button type="primary" @click="setSysInfo" class="sys-button">提交</el-button>
			</div>
		</div>
	</div>
</template>

<script>
	import config from '../public/config'
	export default {
	  name: 'systemSet',
	  data () {
	  	return {
				versions: {},
				sysOpenTables: '0',
				colorList: config.colorList
	  	}
	  },
	  mounted () {
	  	this.$nextTick(() => {
				this.getVersions()
				this.$store.dispatch('getSysInfoS', 1)
				console.log(this.trainTypeList)
	    });
		},
		computed: {
			sys () {
      	return this.$store.state.sysObject
			},
			backTop () {
				return this.$store.state.backTop
			}
		},
	  methods: {
	  	getVersions () {//接口22，获取系统设置
	  	  this.axios({
	  	  	method: 'get',
	  	  	url:'api2/versions',
	  	  	headers: {'appType': 'web','appid': 'logan'}
	  	  })
	  	  .then( (response) => {
					this.$store.commit('loadingChangeFalse')
	  	  	var data = response.data
	  	  	if (data.type == 1) {
	  	  	  this.versions = data.result;
	  	  	} else {
						this.$message.error(data.msg)
					}
	  	  }).catch( (error) => {
	  	  	console.log('系统信息获取失败')
	  	  })
	  	},
	  	setSysInfo() {//接口23，更新系统设置
				this.sys.blueToothConnectionTimeoutAlarmRepeatInterval = this.sys.blueToothConnectionTimeoutAlarmRepeatInterval ? parseInt(this.sys.blueToothConnectionTimeoutAlarmRepeatInterval) : ''
				this.sys.timeToLeave = this.sys.timeToLeave ? parseInt(this.sys.timeToLeave) : ''
				this.sys.timeAhead = this.sys.timeAhead ? parseInt(this.sys.timeAhead) : ''
	  	  if (this.sys.timeAhead<=this.sys.interval || !(/^[0-9]*$/).test(this.sys.timeAhead)) {
					this.$message({
						type: 'error',
						message: '提前叫班时长应大于首次与二次叫班时长',
						duration: 5000
					});
	  	  	return null
	  	  } else if (this.sys.abbr.length > 2 || !this.sys.abbr.match(/^[a-zA-Z]+$/)) {
					this.$message({
						type: 'error',
						message: '待乘室缩写是两个字母',
						duration: 5000
					});
	  	  	return null
	  	  } else if (!/^[0-9]*$/.test(this.sys.interval)) {
					this.$message({
						type: 'error',
						message: '首次与二次叫班时长间隔设置违规',
						duration: 5000
					});
	  	  	return null
	  	  } else if (this.sys.timeout>120 || this.sys.timeout<45 || !/^[0-9]*$/.test(this.sys.timeout)) {
					this.$message({
						type: 'error',
						message: '响应超时时间设置违规',
						duration: 5000
					});
	  	  	return null
	  	  } else if (!/^[0-9]*$/.test(this.sys.timeToLeave)) {
					this.$message({
						type: 'error',
						message: '首次叫班至离寓间隔时长设置违规',
						duration: 5000
					});
	  	  	return null
	  	  } else if (this.sys.timeToLeave<=this.sys.interval) {
					this.$message({
						type: 'error',
						message: '首次叫班至离寓间隔时长应大于首次与二次叫班时长间隔',
						duration: 5000
					});
	  	  	return null
	  	  } else if (this.sys.timeToLeave>=this.sys.timeAhead) {
					this.$message({
						type: 'error',
						message: '首次叫班至离寓间隔时长应小于提前叫班时长',
						duration: 5000
					});
	  	  	return null
	  	  } else if (this.sys.blueToothConnectionTimeoutAlarmRepeatInterval < 1 || !/^[0-9]*$/.test(this.sys.blueToothConnectionTimeoutAlarmRepeatInterval)) {
					this.$message({
						type: 'error',
						message: '手环失联语音告警频率设置违规',
						duration: 5000
					});
	  	  	return null
	  	  } else if (!this.sys.serverIp || /^[ ]+$/.test(this.sys.serverIp)) {
					this.$message({
						type: 'error',
						message: 'IP地址格式错误',
						duration: 5000
					});
	  	  	return null
				} else if (this.sys.deviceLowBatteryThreshold > 100 || this.sys.deviceLowBatteryThreshold < 0) {
					this.$message({
						type: 'error',
						message: '设备低电量阈值必须大于0且小于100',
						duration: 5000
					});
	  	  	return null
				}
				if (this.sys.restRemindSwitch) {
					if (!this.sys.lateSwitch) {
						this.sys.lateSwitch = true
					}
				}
	  	  this.axios({
	  	  	method: 'post',
	  	  	url: '/web/update-config',
	  	  	data: this.sys,
	  	  	headers: {'appType': 'web','appid': 'logan'}
	  	  })
	  	  .then((response) => {
	  	  	var data = response.data
	  	  	if (data.type === 1) {
						this.$message.success('系统信息更新成功')
						this.$store.dispatch('getSysInfoS')
						this.$store.commit('loadingChangeFalse')
	  	  	} else {
						this.$message.error(data.msg)
					}
	  	  }).catch((error) => {
					this.$message.error('系统信息更新失败');
	  	  })
	  	}
	  }
	}
</script>

<style scoped>
	.sys {
		width: 49%;
		float: left;
		font-family: "Helvetica Neue",Helvetica,"PingFang SC","Hiragino Sans GB","Microsoft YaHei","微软雅黑",Arial,sans-serif;
		font-size: 16px;
	}
	.sys div{
		margin: 10px 0;
	}
	.sysContent span {
		font-size: 20px;
	}
	.sys div label{
		width: 200px;
		display: inline-block;
		font-size: 22px;
	}
	.sys .partition{
		display: flex;
		width: 60%;
		flex-wrap: wrap;
		margin-left: 193px;
		margin-top: -33px;
	}
	.sys .el-input {
		width: 300px;
	}
	.sys .version {
		margin-top: 45px;
		color: #8e8e8e; 
	}
	.sys .sysContent {
		margin-left: 20px;
		margin-top: 20px;
	}
	.sys .sys-button {
		width: 100px;
		position: fixed;
    top: 325px;
    left: 40%;
		box-shadow: 1px 2px 6px 0px #23232380;
	}
	.cz-class {
		display: inline-block;
		width: 345px;
		vertical-align: top;
	}
</style>