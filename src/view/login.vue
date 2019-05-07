
<template>
  <div id="login-box">
    <div class="login-content">
      <h1 class="login-title">智能待乘管理系统</h1>
      <div class="login-content-bottom">
        <p class="login-input">
          <label for="username">工号：</label>
          <el-input id="username" class="input" v-model="username"></el-input>
        </p>
        <p class="login-input">
          <label for="password">密码：</label>
          <el-input id="password" class="input" v-model="password" :type="passwordType"></el-input>
          <i v-if="passwordType === 'password'" @click="changeEyes(1)" class="cursor password-eyes">
            <img src="../assets/img/eyes.png" alt="">
          </i>
          <i v-if="passwordType === 'text'" @click="changeEyes(0)" class="cursor password-eyes">
            <img src="../assets/img/no-eyes.png" alt="">
          </i>
        </p>
        <p class="login-input" style="height: 32px;"> 
          <span class="error" v-text="errorMsg" v-show="errorMsg"></span>
        </p>
        <p class="login-input">
          <el-button type="primary" class="button" @click="login">登录</el-button>
        </p>
      </div>
    </div>
  </div>
</template>
<script>
import cookie from '../components/cookie'
import config from '../public/config'
import {mapState} from 'vuex'
export default {
  data () {
    return {
      loginVo: {},
      passwordType: 'password',
      errorMsg: '',
      username: '',
      password: '',
      errorTime: 0,
      registerShow: false
    }
  },
  computed: {

  },
  components: {
  },
  mounted () {
    this.$nextTick(() => {
      document.onkeydown = (evt) => {
        let key
        if (window.event) { // IE/Chrome/Opera(新版本)
          key = evt.keyCode
        } else if (evt.which) { // Netscape/Firefox/Opera/Chrome/IE（新版本）
          key = evt.which
        }
        if (this.$route.path === '/login') {
          if (key === 13) {
            this.login()
          }
        } 
      }
    })
  },
  methods: {
    changeEyes (num) {
      if (num === 1) {
        this.passwordType = 'text'
      } else if (num === 0) {
        this.passwordType = 'password'
      }
    },
    login () {
      if (!this.username.replace(/\s*/g,"")) {
        this.errorMsgFun('用户名不能为空')
        return
      } else {
        this.loginVo.userNo = this.username.replace(/\s*/g,"")
      }
      if (!this.password.replace(/\s*/g,"")) {
        this.errorMsgFun('密码不能为空')
        return
      } else {
        this.loginVo.password = this.password.replace(/\s*/g,"")
      }
      // this.loginSuccess(this.loginVo.username, this.loginVo.password)
      this.axios({
        method: 'post',
        data: this.loginVo,
        url: '/api2/account/login'
      }).then((res) => {
        let data = res.data
        if (data.type === 1) {
          this.$message.success('登录成功')
          config.setLocal('userNo', data.result.userNo)
          this.loginSuccess(data.result.username, data.result.password)
        } else {
          this.$message.error(data.msg)
        }
      }).catch((err) => {
        console.log('请求/api2/account/login错误', err)
      })
    },
    loginSuccess (username, password) {
      cookie.setCookie('loganUsername', username, 0)
      this.$router.push({path: '/'})
    },
    errorMsgFun (msg) {
      clearTimeout(this.errorTime)
      this.errorMsg = msg
      this.errorTime = setTimeout(() => {
        this.errorMsg = ''
      }, 3000)
    } 
  }
}
</script>
<style>
  #login-box {
    width: 100vw;
    height: 100vh;
    background-image: url('../assets/img/bj.png');
    background-repeat: no-repeat;
    position: relative;
  }
  .login-content {
    width: 500px;
    height: 500px;
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    margin: auto;
  }
  .login-content-bottom {
    width: 80%;
    height: 70%;
    padding: 20px;
    margin: 0 auto;
    margin-top: 50px;
  }
  .login-title {
    font-size: 40px;
    color: #fff;
    font-weight: bold;
    font-family: '微软雅黑';
    text-align: center;
    letter-spacing: 5px;
    user-select: none;
  }
  .login-input {
    margin: 30px auto;
    position: relative;
  }
  .login-input label {
    width: 20%;
    display: inline-block;
    font-size: 18px;
    color: #fff;
    line-height: 32px;
    text-align: right;
    user-select: none;
  }
  .login-input .input {
    width: 70%;
  }
  .login-input:nth-last-child(1) {
    margin-top: 50px;
  }
  .login-input .button {
    width: 200px;
    margin-left: 115px;
  }
  .password-eyes {
    position: absolute;
    top: 5px;
    right: 45px;
    width: 25px;
    height: 25px;
  }
  .password-eyes img {
    width: 100%;
    height: 100%;
  }
  .error {
    color: red;
    font-size: 14px;
    float: right; 
  }
</style>
