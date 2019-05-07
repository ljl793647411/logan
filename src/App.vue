<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>

<script>
import cookie from './components/cookie'
export default {
  data () {
    return {
    }
  },
  created () {
    if (!cookie.getCookie()) {
      this.$router.push({path: '/login'})
    }
  }
}
</script>

<style>
html body {
  margin: 0;
  padding: 0;
  height: 100%;
  overflow-y: scroll;
}
.head-top {
  width: 100%;
  height: 65px;
  background: #09192A;
  border-bottom: 1px solid #fff;
  position: fixed;
  top: 0;
  left: 0;
  z-index: 1000;
}
.loading {
  height: 80vh;
  overflow: hidden;
  width: 100%;
}
.project-name {
  font-size: 22px;
  color: #fff;
  line-height: 59px;
  /* text-align: center; */
  margin-left: 20px;
  width: 40%;
  float: left;
}
.date-box {
  position: fixed;
  top: 1%;
  right: 17%;
  z-index: 1000;
  font-size: 35px;
  color: #fff;
}
.user-name {
  width: 170px;
  color: #fff;
  text-align: right;
  margin-right: 30px;
  float: right;
  line-height: 86px;
  display: flex;
  justify-content: space-around;
}
.app-time {
  position: fixed;
  right: 3%;
  top: 2%;
  font-size: 20px;
  line-height: 33px;
  text-align: center;
  margin-top: 1px;
  z-index: 1000;
  color: #fff;
}
.tab-content {
  min-width: 100vh;
  padding: 0 20px 100px;
}
.cursor {
  cursor: pointer;
}
.promptFont {
  font: 12px Extra Extra Small;
  color: #ccc;
  margin-left: 10px;
  cursor: default;
}
.ellipsis {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.font-color-red {
  color: red;
}
.public-title {
  font: 18px large;
}
.backTopClass {
  position: fixed;
  z-index: 1000;
  right: 1%;
  bottom: 10%;
  width: 40px;
  height: 40px;
  cursor: pointer;
}
.backTopClass img {
  width: 100%;
  height: 100%;
}




/* public css */
.color-block {
  width: 30px;
  height: 15px;
  display: inline-block;
  border: 1px solid #000;
}
.bed-icon {
  display: inline-block;
  background: url(./assets/img/bed.png) no-repeat;
  width: 24px;
  height: 24px;
  position: relative;
  top: 4px;
  right: 0;
  background-size: 100%;
}
.popup-bedChoose.el-card {
  width: 85%;
  margin: 0 0 0 -300px;
  height: 80%;
  position: fixed;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  margin: auto;
  background: white;
  z-index: 2000;
  overflow-y: scroll;
}
.photo {
  width: 25%;
  height: 120px;
  float: left;
  margin-top: 23px;
  margin-right: 15px;
  margin-left: 10px;
  font-size: 18px;
}
.photo div {
  margin-top: 14px;
}
.photo img {
  width: 100%;
  height: 100%;
}
.msg-box {
  width: 600px !important;
}
.card-left {
  float: left;
  margin-left: 20px;
  font-size: 18px;
}
.msg-box .card-left p {
  margin-top: 10px;
}
.box-card .el-dialog__header {
  width: 35.5%;
  position: fixed;
  background: #f9f9f9;
  z-index: 1;
}
.el-dialog {
  max-height: 700px;
  overflow-y: scroll;
}

.el-card {
  margin-top: 30px;
}
.must-end-record-box {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  margin: auto;
  width: 30%;
  overflow-y: scroll;
  max-height: 70%;
  z-index: 999;
}
.must-end-record-box p {
  margin: 5px 0;
  text-align: center;
  font:18px large;
}
.must-end-record-box .clearfix {
  float: right;
  margin-bottom: 20px;
}
.card-app p b{
  width: 33%;
  display: inline-block;
  text-align: right;
}
.card-app {
  float: left;
  margin-left: 20px;
  font-size: 18px;
  width: 67%;
}
.card-app p {
  margin: 15px 0;
}
.card-app p:nth-child(6) {
  margin-top: 15px;
}
.register .photo {
  width: 25%;
}
.register b {
  width: 100px;
  display: inline-block;
  text-align: right;
}
.register .el-input {
  width: 36%;
}
.el-select>.el-input{
  width: 80%;
}
.el-select {
  width: 200px !important;
} 
.card-right div b{
  width: 33%;
  display: inline-block;
  text-align: right;
}
.card-right {
  float: left;
  margin-left: 20px;
  font-size: 18px;
  width: 65%;
}
.card-right div {
  margin: 5px 0;
  max-width: 63%;
}
.register.el-card {
  margin-top: 0;
  margin-bottom: 30px;
}
.blue {
  background-color: #b8f4ff !important;
}
.yellow {
  background-color: #eaf786 !important;
}
.red {
  background-color: #ffb5a1 !important;
  color: #fff !important;
}
.green {
  background-color: #b8ffb8 !important;
}
.gray {
  background-color: #ebebeb !important;
}
.orange {
  background-color: #f7dd86 !important;
}
.white {
  background-color: #fff !important;
  border: 1px solid #000;
}
.updateBox .el-dialog__header {
  position: fixed;
  z-index: 1;
  background-color: #f1f1f1;
  width: 37.9%;
}
.updateBox .el-dialog__body {
  margin-top: 45px;
}
.query-nav {
  /* position: fixed; */
  /* z-index: 100; */
  margin-bottom: 30px;
  width: 100%;
  background: #efefef;
  height: 80px;
  box-sizing: border-box;
  border: 1px solid #ababab;
  border-radius: 20px;
}
.bed {  
  /* position: fixed; */
  /* z-index: 100; */
  width: 100%;
  text-align: right;
  background: #efefef;
  height: 80px;
  padding: 16px 40px 20px 20px;
  box-sizing: border-box;
  border: 1px solid #ababab;
  border-top-left-radius: 20px;
  border-bottom-left-radius: 20px;
  border-right: none;
}
.mouseDefault {
  cursor: default !important;
}
.font-size-lg {
  font-size: 22px !important;
}
.popup-bunk-ldname {
  font-size: 18px;
  line-height: 30px;
}
.bigPhoto .el-card {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  margin: auto;
  width: 600px;
  height: 500px;
  padding: 30px;
	z-index: 1;
}
.bigPhoto .el-card img {
  width: 100%;
  height: 100%;
}
.dbPhoto {
  width: 60px;
  height: 70px;
  padding: 5px;
  margin: 0 auto;
}
.dbPhoto img {
  width: 100%;
  height: 100%;
}
.queryBox {
  display: inline-block;
  width: 350px;
}



/* 文本换行样式 */
 .ellipsis {
  overflow: hidden;
  text-overflow: ellipsis;
  display:-webkit-box; 
  -webkit-box-orient:vertical;
}
.ellipsis1 {
  -webkit-line-clamp: 1; 
}
.ellipsis2 {
  -webkit-line-clamp: 2;
}
.font-color-red {
  color: red;
}

/* element css */

.el-tabs__nav-scroll {
  height: 65px;
  position: fixed;
  background: #09192A;
  /* background-image: url('./assets/img/title-bg.png'); */
  /* background-repeat: no-repeat; */
  width: 100%;
  z-index: 100;
  top: 66px;
  left: 0;
  /* color: white; */
  /* border-top: 1px solid #407aa6; */
}
.el-tabs__content {
  top: 130px;
}
.head>.el-tabs--card>.el-tabs__header .el-tabs__nav {
  border: none;
}
.el-tabs--card .el-tabs__item {
  line-height: 65px;
  height: 64px;
  font-size: 21px;
  user-select: none;
  color: #fff;
}
.head>.el-tabs--card>.el-tabs__header .el-tabs__item {
  color: #fff;
  font-size: 18px;
  font-family: "Helvetica Neue",Helvetica,"PingFang SC","Hiragino Sans GB";
  border: none;
}
.head>.el-tabs--card>.el-tabs__header .el-tabs__item.is-active {
  color: #ffffff;
  background-color: #033f7ff0;
  border-right-color: #033f7ff0;
  border-left-color: #033f7ff0;
}
.head>.el-tabs--card>.el-tabs__header .el-tabs__item:not(.is-disabled):hover {
  background-color: #033f7ff0;
  color: #fff;
}
.el-table--enable-row-hover .el-table__body tr:hover>td {
  color: #000;
}
.head .el-table th, #app .el-table tr {
  color: #000;
  font-size: 18px;
  text-align: center;
}
.head .el-table th {
  background-color: #f3f3f3;
}
.out-info-box .el-input__inner,.el-dialog .el-input__inner {
  color: #000;
  font-weight: bolder;
}
#app .el-range-editor--small .el-range-input {
  font-size: 18px;
}
#app .el-input--small .el-input__inner {
  font-size: 18px;
}
.el-button {
  font-size: 16px !important;
}
#app .el-form-item__label {
  font-size: 18px;
}
#app .el-dialog {
  max-height: 750px;
  overflow-y: auto;
}
.must-end-record-box .el-collapse-item__header {
  color: red;
  font-size: 20px;
  font-weight: bold;
}
</style>
