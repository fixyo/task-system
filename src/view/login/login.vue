<style lang="less">
@import "./login.less";
</style>

<template>
<div class="login">
    <div class="login-con">
        <Card icon="log-in" title="欢迎登录" :bordered="false">
            <div class="form-con">
                <login-form @on-success-valid="handleSubmit"></login-form>
                <!-- <p class="login-tip">输入任意用户名和密码即可</p> -->
            </div>
        </Card>
    </div>
</div>
</template>

<script>
import LoginForm from '_c/login-form'
import {
  mapActions
} from 'vuex'
import {
  baseUrl
} from '@/api/base.js'
// import { login } from '@/api/user.js'
export default {
  components: {
    LoginForm
  },
  methods: {
    ...mapActions(['handleLogin', 'getUserInfo']),
    handleSubmit ({
      userName,
      password
    }) {
      let me = this
      this.$axios({
        url: baseUrl + '/login',
        data: $qs.stringify({
          username: userName,
          password: password
        }),
        method: 'post'
      }).then(resp => {
        let data = resp.data
        if (data.code === 200) {
          localStorage.username = data.nickname
          localStorage.token = data.token
          // 存到Vuex的登录里
          me.handleLogin({
            userName: data.username,
            password: data.password
          }).then(data => {
            // 只要登录就重新获取信息存到Vuex里面
            me.getUserInfo()
          })
          me.$Notice.success({
            title: data.message,
            duration: 1
          })
          me.$router.push({
            name: this.$config.homeName
          })
        } else {
          me.$Notice.warning({
            title: data.message,
            duration: 1
          })
        }
      })
    }
  }
}
</script>

<style>
</style>
