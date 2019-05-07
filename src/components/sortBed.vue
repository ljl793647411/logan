<template>
  <div style="display: inline-block;cursor: pointer;">
    <div class="loadBox">
    </div>
    <el-card class="popup-bedChoose box-card" v-loading="loading">
      <div class="bedButtonLayout">
        <el-button type="danger" class="bedButton" @click="update">确认提交</el-button>
        <el-button type="success" class="bedButton" @click="cancelEdit">放弃修改</el-button>
        <div class="legend">
          <i class="el-icon-warning"></i>
          <b>点击拖动可进行排序:</b>
          <div class="legend-1">
            <span>已移动：</span>
            <div class="legend-block">
              <img src="../assets/img/move-flag.png" alt="">
            </div>
          </div>
        </div>
        <div class="legend-bottom">
          <div class="legend-bottom-color">
            <div v-for="(col, index) in colorIndexMemos" :key="index">
              <div class="color-title" v-text="col"></div>
              <div class="color-block" :style="{'background': colorLists[index]}"></div>
            </div>
          </div>
        </div>
        <draggable class="popop-bunk-box" v-model="bunkLists" @end="colorChange">
          <transition-group
          tag="div"
          name="bed-sort">
            <div class="popup-bunk" v-for="bunk in bunkLists" :key="bunk.sid" :style="{'background':colorLists[bunk.colorIndex]}">
              <div v-text="bunk.no"></div>
              <div class="nail"><img src="../assets/img/move-flag.png" alt="" v-if="bunk.colorStatus"></div>
              <div v-text="colorIndexMemos[bunk.colorIndex]" class="popup-bunk-ldname"></div>
            </div>
          </transition-group>
	      </draggable>
      </div>
    </el-card>
  </div>
</template>

<script>
import draggable from 'vuedraggable'
import config from '../public/config' 

export default {
  data () {
    return {
      bunkLists: this.bunkList,
      loading: false,
      colorLists: config.colorList
    }
  },
  mounted () {
    this.$nextTick(() => {
      console.log(this.bunkLists)
      for (let i in this.bunkLists) {
        this.$set(this.bunkLists[i], 'colorStatus', false)
      }
    })
  },
  computed: {
    colorIndexMemos () {
      return this.$store.state.colorList
    }
  },
  methods: {
    colorChange (evt) {
      this.bunkLists[evt.newIndex].colorStatus = true
    },
    cancelEdit () {
      this.$confirm('确认放弃修改?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$emit('closeSortBed')
        }).catch(() => {
          
        })
    },
    update () {
      var bunkSids = []
      for (let i in this.bunkLists) {
        bunkSids.push(this.bunkLists[i].sid)
      }
      this.loading = true
      this.axios({
        method: 'post',
        data: bunkSids,
        url: '/api2/bed/re-sorting',
        headers: {'appType': 'web','appid': 'logan'}
      }).then((res) => {
        this.loading = false
        var data = res.data
        if (data.type === 1) {
          this.$emit('closeSortBed', this.bunkLists)
          console.log('排序成功')
        }
      }).catch((error) => {
        console.log('排序请求失败：', error)
      })
    }
  },
  components: {
    draggable
  },
  props: ['bunkList']
  
 }
</script>
<style scoped>
  .popup-bedChoose {
    width: 82%;
    margin: 0 0 0 -300px;
    max-height: 80%;
    height: 80%;
    position: fixed;
    left: 25%;
    top: 100px;
    background: white;
    z-index: 999;
  }
  .popup-bunk{
    display: inline-block;
    height: 68px;
    width: 112px;
    margin: 10px 0 0 10px;
    border: 1px solid #aaa;
    /* background: #9dd4fd; */
    vertical-align: top;
    text-align: center;
    font-size: 24px !important;
    user-select: none;
    cursor: move;
    position: relative;
  }
   .popup-bunk:hover {
      transform: scale(1.1);
      /* border: 2px #fff dotted; */
      /* border-radius: 50%; */
      animation:zoom 1s ease infinite;
     /* box-sizing: border-box; */
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
   .bedButtonLayout { 
     position: fixed;
     width: 79%;
   }
   .bedButton {
     float: right;
     margin-right: 20px;
     margin: 10px 10px;
     width: 100px;
   }
   .loadBox {
     background: rgba(255, 255, 255, 0.89);
     width: 100%;
     height: 100%;
     position: absolute;
     top: 0;
     left: 0;
     z-index: 11;
   }
   .bed-sort-move {
     transition: transform 1s;
   }
   .legend {
     float: left;
     padding: 10px;
   }
  .legend-1 {
    display: inline-block;
    margin-left: 20px;
  }
  .legend-block {
    display: inline-block;
    width: 30px;
    height: 30px;
    position: relative;
    top: 5px;
  }
  .legend-block img {
    width: 100%;
    height: 100%;
  }
  .legend-bottom {
  padding: 10px;
  width: 100%;
  overflow: hidden;
}
.legend-bottom-color {
  width: 90%;
  padding: 10px 10px;
  float: left;
  display: flex;
  justify-content: space-around
}
.nail {
  width: 20px;
  height: 20px;
  position: absolute;
  top: 0;
  left: 0;
}
.nail img {
  width: 100%;
  height: 100%;
}
.color-title {
  display: inline-block;
  font-size: 16px;
  margin-right: 12px;
}

</style>
