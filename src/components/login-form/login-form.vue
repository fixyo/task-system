<template>
  <div>
    <Form ref="loginForm" :model="form" :rules="rules" @keydown.enter.native="handleSubmit">
      <FormItem prop="userName" autocomplete="on">
        <Input autocomplete="on" v-model="form.userName" placeholder="请输入用户名">
          <span slot="prepend">
            <Icon :size="16" type="ios-person"></Icon>
          </span>
        </Input>
      </FormItem>
      <FormItem prop="password">
        <Input type="password" v-model="form.password" placeholder="请输入密码">
          <span slot="prepend">
            <Icon :size="14" type="md-lock"></Icon>
          </span>
        </Input>
      </FormItem>
      <p class="forget">
        <span @click="forget">忘记密码</span>
      </p>
      <FormItem>
        <Button @click="handleSubmit" type="primary" class="loginBtn" long>登录</Button>
      </FormItem>
    </Form>
    <Modal
      v-model="showForget"
      :loading="loading"
      title="重置密码"
      width="400px"
      @on-ok="resetPassword"
    >
      <Form label-position="left" :label-width="90">
        <FormItem label="新密码：">
          <Input v-model="newPassword" @on-blur="checkPassword" type="password"></Input>
        </FormItem>
        <FormItem label="确认密码：">
          <Input v-model="repNewPassword" @on-blur="checkRepeatPassword" type="password"></Input>
        </FormItem>
        <FormItem label="钉钉验证码：">
          <Input v-model="veriCode" style="width:65%"></Input>
          <Button
            :disabled="!allowGetCode"
            @click="getCode"
            style="margin-left:5%;width:30%"
          >{{buttonText}}</Button>
        </FormItem>
      </Form>
    </Modal>
  </div>
</template>
<script>
import { baseUrl } from '@/api/base'
export default {
  name: 'LoginForm',
  props: {
    userNameRules: {
      type: Array,
      default: () => {
        return [{ required: true, message: '账号不能为空', trigger: 'blur' }]
      }
    },
    passwordRules: {
      type: Array,
      default: () => {
        return [{ required: true, message: '密码不能为空', trigger: 'blur' }]
      }
    }
  },
  data () {
    return {
      form: {
        userName: '',
        password: ''
      },
      newPassword: '',
      repNewPassword: '',
      showForget: false, // 是否展示重置密码的框
      veriCode: '',
      allowGetCode: true, // 允许获取验证码
      buttonText: '获取验证码',
      loading: true
    }
  },
  computed: {
    rules () {
      return {
        userName: this.userNameRules,
        password: this.passwordRules
      }
    }
  },
  methods: {
    handleSubmit () {
      this.$refs.loginForm.validate(valid => {
        if (valid) {
          this.$emit('on-success-valid', {
            userName: this.form.userName,
            password: this.form.password
          })
        }
      })
    },
    forget () {
      if (!this.form.userName) {
        // 如果没有填用户名，弹窗提示
        this.$Message.warning('请输入用户名')
        return false
      } else {
        this.showForget = true
      }
    },
    getCode () {
      // 获取钉钉验证码
      let me = this
      this.$axios({
        url: baseUrl + '/login/getvericode',
        data: $qs.stringify({ username: me.form.userName }),
        method: 'post'
      })
        .then(res => {
          if (res.status === 200) {
            me.getCodeSuccess()
          }
        })
        .catch(err => {
          console.log(err)
          this.$Message.warning('发送失败')
        })
    },
    getCodeSuccess () {
      let waitTime = 60 // 验证码等待时间
      this.$Message.success('验证码发送成功，请查看钉钉')
      this.allowGetCode = false
      let timer = setInterval(() => {
        this.buttonText = `重新获取${waitTime--}`
      }, 1000)
      setTimeout(() => {
        this.allowGetCode = true
        clearInterval(timer)
        this.buttonText = `获取验证码`
      }, waitTime * 1000)
    },
    checkPassword () {
      // 验证密码的复杂度
      // 大小写数字
      let rules = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[^]{8,16}$/
      let r = rules.test(this.newPassword)
      if (!r) {
        this.$Message.error('新密码不符合要求，请重新设置')
        return false
      } else {
        return true
      }
    },
    checkRepeatPassword () {
      // 验证两次密码是否一致
      if (this.newPassword !== this.repNewPassword) {
        this.$Message.error('两次密码不一致，请重新输入')
        return false
      } else {
        return true
      }
    },
    resetPassword () {
      let me = this
      if (this.checkPassword() && this.checkRepeatPassword()) {
        let data = {
          username: me.form.userName,
          newPassword: me.newPassword,
          repNewPassword: me.repNewPassword,
          veriCode: me.veriCode
        }
        this.$axios({
          url: baseUrl + '/login/resetpassword',
          data: $qs.stringify(data),
          method: 'post'
        })
          .then(res => {
            if (res.data.code === 10000) {
              this.$Message.info(res.data.message)
              this.showForget = false// 关闭对话框
            } else {
              this.$Message.warning(res.data.message)
              this.loading = false// 确认框先取消loading
              this.$nextTick(() => { this.loading = true })// 再允许loading，
            }
          })
          .catch(err => {
            console.log(err)
            this.$Message.warning('重置失败')
          })
      }
    }
  }
}
</script>
<style scoped>
.forget {
  text-align: right;
}
.forget span {
  display: inline-block;
  cursor: pointer;
  margin-top: -20px;
  margin-bottom: 20px;
}
.loginBtn{
    background-color: #19aa8d;
    border-color: #19aa8d;
    color: #fff;
}
.loginBtn:hover {
    background-color: #088f74;
    border-color: #088f74;
    color: #fff;
}
</style>
