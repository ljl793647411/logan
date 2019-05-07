<template>
  <div style="display: inline-block;cursor: pointer;">
  	<span class="bed-icon" @click="getBedNos"></span>
     <el-card v-if="chooseBed" class="popup-bedChoose">
        <div class="head">
          <span style="margin-left: 10px;" class="font-size-lg">铺位选择：</span>
          <el-button class="cancelEdit" type="info" plain @click="cancelEdit">关闭</el-button>
        </div>
        <div class="legend">
          <div class="legend-color">
            <div v-for="(col, index) in colorIndexMemos" :key="index">
              <div class="color-title font-size-lg" v-text="col"></div>
              <div class="color-block" :style="{'background': colorLists[index]}"></div>
            </div>
          </div>
        </div>
        <ul class="bunkList">
          <li class="popup-bunk" v-for="(bunk,index) in bunkList" @click="chooseBedNo(bunk)" :key="index"
            :class="{notUsed:(!bunk.used || allChoose),used:(bunk.used && !allChoose), default: (bunk.bedNo === bedNo)}" :style="{'background':colorLists[bunk.colorIndex]}" :title="(bunk.used && !allChoose) ? '该铺位已待乘' : ''">
            <div class="nail"><img src="/static/nail.png" alt="" v-if="bunk.bedNo === bedNo"></div>
            <div v-if="bunk.used && !allChoose" class="deepen"></div>
            <div v-text="bunk.bedNo"></div>
            <div v-if="!allChoose" v-text="bunk.ldName" class="popup-bunk-ldname"></div>
          </li>
        </ul>
    </el-card>
  </div>
</template>

<script>
import config from '../public/config'

export default {
  name: 'bedChoose',
  data () {
    return {
      bunkList: [],
      chooseBed: false,
      colorLists: config.colorList
	}
  },
  props: ['allChoose', 'bedNo', 'index'],
  mounted () {
    this.$nextTick(() => {
      this.chooseBed = false
      this.openBedChooseChild = this.openBedChoose
      if (this.openBedChooseChild) {
        this.getBedNos()
      }
    });
  },
  computed: {
    colorIndexMemos () {
      return this.$store.state.colorList
    }
  },
  methods: {
    getBedNos () {
      this.axios({
        method: 'get',
        url: '/web/bedInfos',
        headers: {'appType': 'web','appid': 'logan'}
      })
      .then( (response) => {
        var data = response.data
        if (data.type == 1) {
          this.bunkList = data.result.bedInfos
          this.chooseBed = true
        }
      }).catch( (error) => {
        console.log('铺位看板获取失败')
      })
    },
    chooseBedNo (bunk) {//选择铺位号
      if (bunk.used && !this.allChoose) {
     		return null
      }
      this.$emit('chooseBed',bunk, this.index)
      this.cancelEdit()
    },
    cancelEdit () {
      this.chooseBed = false
      this.bunkList = []
      this.openBedChooseChild = false
    }
  }
  	
}
</script>

<style scoped>
.head {
  font:18px large;
}
.popup-bunk{
  float: left;
  display: inline-block;
  height: 68px;
  width: 112px;
  margin: 10px 0 0 10px;
  border: 1px solid #aaa;
  vertical-align: top;
  text-align: center;
  font-size: 24px !important;
  transition: all 0.5s ease-out;
}
.deepen {
  height: 68px;
  width: 112px;
  position: absolute;
  top: 0;
  left: 0;
  background: #f5f7fab3;
}
.popup-bunk div{
  line-height: 34px;
}
.used{
  /* background: #ccc; */
  color: #000;
  cursor: not-allowed;
  position: relative;
}
.notUsed{
  margin-top: 10px;
  color: #000;
  cursor: pointer;
}
.color-title {
  display: inline-block;
  font-size: 16px;
  margin-right: 20px;
  font:	14px Small;
}
.legend {
  padding: 10px;
  width: 100%;
  overflow: hidden;
}
.legend-color {
  width: 90%;
  padding: 10px 10px;
  float: left;
  display: flex;
  justify-content: space-around
}
.nail {
  position: absolute;
  width: 20px;
  height: 20px;
}
.nail img {
  width: 100%;
  height: 100%;
}
.default {
  animation:zoom 1s ease infinite;
}
@keyframes zoom {
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(0.9);
  }
  100% {
    transform: scale(1);
  }
}
.cancelEdit {
  float: right;
  margin-right: 4px;
}
.popup-bunk:hover {
  transform: scale(1.1)
}
</style>