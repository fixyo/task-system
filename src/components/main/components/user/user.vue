<template>
  <div class="user-avator-dropdown">
    <!-- <div @click="handleClick('logout')" class="loginOut">退出登录</div>
    <div class="loginName">{{username}}</div>-->
    <span @click="showDrawerByBadge">
      <Badge :count="unread" :offset="[20,5]" style="margin-right:20px;">
        <Icon type="ios-notifications" size="24"/>
      </Badge>
    </span>
    <Dropdown @on-click="handleClick" style="margin-right:20px;" class="dropdown">
      <Icon type="md-person" size="20"/>
      <span class="userName">{{nickname}}</span>
      <!-- <div class="loginName"><Icon type="md-person" size="25"/>{{username}}</div> -->
      <!-- <Icon :size="18" type="md-arrow-dropdown"></Icon> -->
      <DropdownMenu slot="list">
        <DropdownItem @click="handleClick('userInfo')" name="userInfo">个人信息</DropdownItem>
        <DropdownItem @click="handleClick('changePassword')" name="changePassword">修改密码</DropdownItem>
        <DropdownItem @click="handleClick('logout')" name="logout">退出登录</DropdownItem>
      </DropdownMenu>
    </Dropdown>
    <bzDrawer></bzDrawer>
    <Modal
      v-model="showForget"
      :loading="loading"
      title="修改密码"
      width="400px"
      @on-ok="changePassword"
    >
      <Form label-position="left" :label-width="90" @on-ok="changePassword">
        <FormItem label="原密码">
          <Input v-model="oldPassword" type="password"></Input>
        </FormItem>
        <FormItem label="新密码">
          <Input v-model="newPassword" @on-blur="checkPassword" type="password"></Input>
        </FormItem>
        <FormItem label="确认新密码">
          <Input v-model="repNewPassword" @on-blur="checkRepeatPassword" type="password"></Input>
        </FormItem>
      </Form>
    </Modal>
  </div>
</template>

<script>
import './user.less'
import { mapActions, mapMutations } from 'vuex'
import { baseUrl } from '@/api/base.js'
import bzDrawer from '_v/public/station/bzDrawer.vue'
export default {
  name: 'User',
  components: {
    bzDrawer
  },
  data () {
    return {
      showDrawer: false,
      username: '',
      loading: true,
      showForget: false,
      oldPassword: '',
      newPassword: '',
      repNewPassword: ''
    }
  },
  mounted () {
    this.username = this.nickname
  },
  props: {
    userAvator: {
      type: String,
      default: ''
    }
  },
  methods: {
    ...mapActions(['handleLogOut']),
    ...mapMutations(['handleShowDrawer', 'setShowType']),
    showDrawerByBadge () {
      this.handleShowDrawer()
      this.setShowType({ type: '消息', isList: true })
    },
    handleClick (name) {
      switch (name) {
        case 'logout':
          this.handleLogOut().then(() => {
            this.$router.push({
              name: 'login'
            })
          })
          // 退出后清空nag-tags
          localStorage.tagNaveList = ''
          break
        case 'changePassword':
          this.showForget = true
          break
        case 'userInfo':
          this.$router.push({
            name: 'showUser',
            query: {
              id: this.userId
            }
          })
          break
      }
    },
    changePassword () {
      let { oldPassword, newPassword, repNewPassword } = this
      let data = { oldPassword, newPassword, repNewPassword }
      if (this.checkPassword() && this.checkRepeatPassword()) {
        this.$axios({
          url: baseUrl + '/changepassword',
          method: 'post',
          data: $qs.stringify(data)
        })
          .then(res => {
            if (res.data.code === 10000) {
              this.$Message.info(res.data.message)
              this.showForget = false // 关闭对话框
            } else {
              this.$Message.warning(res.data.message)
              this.loading = false // 确认框先取消loading
              this.$nextTick(() => {
                this.loading = true
              }) // 再允许loading，
            }
          })
          .catch(err => {
            this.$Message.warning(err)
          })
      }
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
    }
  },
  computed: {
    userId () {
      return this.$store.state.user.userId
    },
    nickname () {
      return this.$store.state.user.nickname
    },
    unread () {
      return this.$store.state.station.unread
    }
  }
}
</script>
<style>
.dropdown {
  line-height: 1;
}
.userName {
  line-height: 1;
  font-size: 15px;
  vertical-align: middle;
}
.loginOut {
  float: right;
  -webkit-appearance: none;
  background-color: #fff;
  background-image: none;
  border-radius: 4px;
  border: 1px solid #dcdfe6;
  box-sizing: border-box;
  color: #606266;
  font-size: inherit;
  height: 40px;
  line-height: 40px;
  outline: 0;
  padding: 0 27px;
  margin: 12px;
  cursor: pointer;
  -webkit-transition: border-color 0.2s cubic-bezier(0.645, 0.045, 0.355, 1);
  transition: border-color 0.2s cubic-bezier(0.645, 0.045, 0.355, 1);
}

.loginOut:active {
  outline: none;
  border-color: #409eff;
}

.loginName:active {
  outline: none;
  border-color: #409eff;
}

.loginName {
  display: inline-block;
  -webkit-appearance: none;
  background-color: #fff;
  background-image: none;
  border-radius: 4px;
  border: 1px solid #dcdfe6;
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
  color: #606266;
  display: inline-block;
  font-size: inherit;
  height: 40px;
  line-height: 40px;
  outline: 0;
  padding: 0 27px;
  margin: 12px;
  cursor: pointer;
  -webkit-transition: border-color 0.2s cubic-bezier(0.645, 0.045, 0.355, 1);
  transition: border-color 0.2s cubic-bezier(0.645, 0.045, 0.355, 1);
}
</style>
