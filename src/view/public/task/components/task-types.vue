<template>
  <div class="wrapper">
    <div class="task-types">
      <div class="tabs">
        <router-link 
          class="tab" 
          v-for="tab in tabTypes" 
          :key="tab.id"
          :to="tab.path"
          >
          {{tab.name}}
        </router-link>
      </div>
      <div class="action">
        <div class="inner">
          <launch-task :show="showLaunch" @click="showModal"></launch-task>
        </div>
      </div>
      <router-view 
        :employees="employeeList"
        :taskLevels="taskLevels"
        :taskStatus="taskStatus"
      ></router-view>
    </div>
  </div>
</template>

<script>
  import LaunchTask from './launchTask'
  import { baseUrl } from '@/api/base.js'
  export default {
    components: {
      LaunchTask
    },
    created() {
      this.getEmployeeList()
      this.getInitialData()
    },
    data() {
      return {
        employeeList: [],
        tabTypes: [
          {
            id: 1,
            name: '任务详情',
            path: '/task/detail'
          },
          {
            id: 2,
            name: '我发起的任务',
            path: '/task/propose'
          },
          {
            id: 3,
            name: '我接收的任务',
            path: '/task/accept'
          },
          {
            id: 4,
            name: '我执行的任务',
            path: '/task/excute'
          },
          {
            id: 5,
            name: '我关注的任务',
            path: '/task/focus'
          },
          {
            id: 6,
            name: '全部任务',
            path: '/task/all'
          },
          {
            id: 7,
            name: '待审任务',
            path: '/task/pending'
          },
          {
            id: 8,
            name: '悬赏任务',
            path: '/task/reward'
          },
          {
            id: 9,
            name: '部门任务',
            path: '/task/department'
          },
          {
            id: 10,
            name: '月度评审',
            path: '/task/monthly'
          }

        ],
        taskLevels: [],
        taskStatus: [],
        showLaunch: false
      }
    },
    methods: {
      showModal(flag) {
        this.showLaunch = flag
      },
      // 获取全体人员名单（发起人、执行人、接收人）
      getEmployeeList() {
        this.employeeList = ['chenchao', 'ec']
        this.$axios({
          url: baseUrl + '/user/getIncumbencyTbUser', // 在职人员列表
          method: 'post'
        })
        .then(res => {
          if (res.data.code === 10000) {
            this.employeeList = res.data.content
          } else {
            this.$Message.error(res.data.msg)
          }
        })
        .catch(err => {
          console.error(err)
        })
      },
      // 任务等级，状态的options选项数据
      getInitialData () {
        this.$axios({
          url: 'http://192.168.1.103:8080/BzSystem/tasks/tasksrender',
          data: $qs.stringify(),
          method: 'get'
        }).then(resp => {
          if (resp.data.code === 10000) {
            this.taskLevels = res.data.content.tasksLevel// 任务等级
            this.taskStatus = res.data.content.tasksStatus// 任务状态
          } else {
            this.$Message.success(resp.data.msg)
          }
        }).catch(err => {
          console.log('err', err)
        })
      },
    }
  }
</script>

<style lang="less" scoped>
  @import '~@/assets/style/variables.less';
  .wrapper {
    width: 100%;
    height: 100%;
    box-sizing: border-box;
    padding: 20px;
  }
  .task-types {
    width: 100%;
    // height: 100%;
    position: relative;
    border: 1px solid #dcdee2;
    background: #fff;
    .tabs {
      width: 100%;
      box-sizing: border-box;
      border-bottom: 1px solid #dcdee2;
      font-size: 0;
      .tab {
        font-size: 14px;
        color: #515a61;
        padding: 8px 16px;
        margin-right: 16px;
        display: inline-block;
        box-sizing: border-box;
        position: relative;
        &.router-link-active {
          color: @color-theme-green;
          &:after {
            content: '';
            display: block;
            position: absolute;
            left: 50%;
            bottom: -1px;
            transform: translateX(-50%);
            width: 100%;
            height: 2px;
            background: @color-theme-green;
          }
        }
      }
    }
    .action {
      width: 100%;
      padding: 0 12px;
      .inner {
        margin: 12px 0;
      }
    }
  }
</style>