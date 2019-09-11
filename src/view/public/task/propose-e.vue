<template>
<!--全部任务-->
<div id="task-propose">
  <Tabs type="card" :animated="false" @on-click="switchTab" v-model="currentTab">
    <TabPane :label="'全部('+headeCount.countAll+')'" name="0">
      <div v-if="currentTab == '0'">
        <bz-table 
          :searchCondition="searchCondition"
          :currentPage="currentPage"
          @search-condition-change="handleSearchConditionChange"
          @current-page-change="handleCurrentPageChange"
          @page-size-change="handlePageSizeChange"
          >
        </bz-table>
      </div>
    </TabPane>
    <TabPane :label="'待确认('+headeCount.countTbc+')'" name="1">
      <div v-if="currentTab == '1'">
        <bz-table 
          :searchCondition="searchCondition"
          >
        </bz-table>
      </div>
    </TabPane>
    <TabPane :label="'进行中('+headeCount.countOngoing+')'" name="2">
      <div v-if="currentTab == '2'">
        <bz-table 
          :searchCondition="searchCondition"
          >
        </bz-table>
      </div>
    </TabPane>
    <TabPane :label="'暂缓('+headeCount.countDefer+')'" name="3">
      <div v-if="currentTab == '3'">
        <bz-table 
          :searchCondition="searchCondition"
          >
        </bz-table>
      </div>
    </TabPane>
    <TabPane :label="'关闭('+headeCount.countClose+')'" name="4">
      <div v-if="currentTab == '4'">
        <bz-table 
          :searchCondition="searchCondition"
          >
        </bz-table>
      </div>
    </TabPane>
    <TabPane :label="'已完成('+headeCount.countDone+')'" name="5">
      <div v-if="currentTab == '5'">
        <bz-table 
          :searchCondition="searchCondition"
          >
        </bz-table>
      </div>
    </TabPane>
    <div slot="extra">
      <search-box 
        :searchContent="searchContent"
        @search-content-change="handleSearchContentChange"
        @inaccurate-search="handleInaccurateSearch"
      ></search-box>
    </div>
  </Tabs>
</div>
</template>

<script>
import moment from 'moment'
import { baseUrl } from '@/api/base.js'
import BzTable from './components/bz-table'
import SearchBox from './components/search-box'

export default {
  name: 'allTask',
  components: {
    BzTable,
    SearchBox
  },
  data () {
    return {
      currentPage: 1,
      // 当前tab的name属性
      currentTab: '0',
      innerTabs: '1', // 任务状态列表
      loading: true, // 是否显示表格加载框
      employeeList: [], // 人员名单
      taskLevelList: [], // 任务等级列表，用于渲染
      taskStatusList: [], // 任务状态列表，用于渲染
      searchContent: '',
      
      accpter: '', // 接收人model
      accpterList: [], // 接受人列表
      initer: '', // 发起人model
      initerList: [], // 发起人
      taskName: '', // 任务名称
      taskType: '', // 任务类型model
      taskEndTime: '', // 任务截止时间
      taskLeavel: '', // 任务等级model
      taskLeavelList: [], // 任务等级列表
      adviser: '', // 顾问model
      adviserList: [], // 顾问列表
      proposer: '', // 提出人model
      proposerList: [], // 提出人列表
      taskDetail: '', // 任务描述
      searchType: '0', // 默认是 0 代表表头搜索，非 0 值代表文本框模糊搜索

      // 内tab任务状态显示的数值
      headeCount: {
        countAll: 0, // 全部显示数值
        countOngoing: 0, // 内tab进行中显示的数值
        countTbc: 0, // 内tab待确认显示的数值
        countClose: 0, // 内tab关闭显示的数值
        countDefer: 0, // 内tab暂缓显示的数值
        countDone: 0 // 内tab全部已完成的数值
      },

      // 表头搜索model值
      searchCondition: {
        taskLevel: '', // 任务等级
        taskStatus: '', // 任务状态
        endTime: '', // 方案结束时间
        taskName: '', // 任务名称
        timeRange: [], // 时间范围
        sendUid: '', // 发起人id
        sendName: '', // 发起人姓名 
        acceptUid: '', // 接收人id
        acceptName: '', // 接受人姓名
        executeUid: '', // 执行人id
        executeName: '', // 执行人姓名
        pageSize: 20,
        totalCount: 100,
        currentPage: 1,
        startTime: '',
        endTime: ''
      },
      dataTableHeader: [
        {
          title: ' ',
          type: 'focus',
          width: 50,
          align: 'center',
          render: (h, params) => {
            return h('div', [
              h('Icon', {
                props: {
                  type: params.row.tasksFocus ? 'ios-star-outline' : 'ios-star'
                },
                style: {
                  color: 'red',
                  cursor: 'pointer',
                  marginRight: '1px',
                  fontSize: '18px'
                },
                on: {
                  click: () => {
                    this.focusTask(params.index, params)
                  }
                }
              }),
              h('span')
            ])
          }
        }, {
          title: '序号',
          type: 'index',
          width: 70,
          align: 'center'
        },
        {
          title: '任务名称',
          key: 'name',
          align: 'center',
          renderHeader: (h, params) => {
            return (<Poptip placement="bottom">
              <span>
                {params.column.title }
                <i class = "ivu-icon ivu-icon-ios-search" />
              </span>
              <div slot="content">
                <Input v-model={this.searchHeader.name} clearable placeholder="任务名称" size="small" style="width:110px"></Input>
                <Button class="searchButton" size="small" v-on:click={() => { this.getTableData() }} ><i class = "ivu-icon ivu-icon-ios-search" /></Button>
                <Button type="error" size="small" v-on:click={() => { this.searchHeader.name = '' }}><Icon type="md-close-circle" /></Button>
              </div>
            </Poptip>)
          }
        },
        {
          title: '时间',
          key: 'tasksTimeStartToEnd',
          align: 'center',
          renderHeader: (h, params) => {
            return (<Poptip placement="bottom">
              <span>
                {params.column.title }
                <i class = "ivu-icon ivu-icon-ios-search" />
              </span>
              <div slot="content">
                <DatePicker
                  v-on:on-ok={() => {
                    this.getTableData()
                  }}
                  type="daterange"
                  v-model={this.searchHeader.timeRange}
                  size="small" style="width:110px"
                  confirm
                  placement="bottom-start"
                  placeholder="输入时间"
                />
                <Button class="searchButton" size="small" v-on:click={() => { this.getTableData() }}><i class = "ivu-icon ivu-icon-ios-search" /></Button>
                <Button type="error" size="small" v-on:click={() => { this.searchHeader.timeRange = [null, null] }}><Icon type="md-close-circle" /></Button>
              </div>
            </Poptip>)
          }
        },
        {
          title: '发起人',
          key: 'sendName',
          width: 90,
          align: 'center',
          renderHeader: (h, params) => {
            return (<Poptip placement="bottom">
              <span>
                {params.column.title }
                <i class = "ivu-icon ivu-icon-ios-search" />
              </span>
              <div slot="content">
                <Select
                  placeholder="发起人" size="small" style="width:110px"
                  slot="content"
                  filterable
                  clearable
                  v-on:on-change={() => {
                    this.getTableData()
                  }}
                  v-model={this.searchHeader.sendUid}>
                  {(this.incumbencyTbUser || []).map(person => {
                    return (
                      <Option v-model={person.id}>{person.nickname}</Option>
                    )
                  })}
                </Select>
                <Button class="searchButton" size="small" v-on:click={() => { this.getTableData() }}><i class = "ivu-icon ivu-icon-ios-search" /></Button>
                <Button type="error" size="small" v-on:click={() => { this.searchHeader.sendUid = '' }}><Icon type="md-close-circle" /></Button>
              </div>
            </Poptip>)
          }
        },
        {
          title: '接收人',
          key: 'acceptName',
          width: 90,
          align: 'center',
          renderHeader: (h, params) => {
            return (<Poptip placement="bottom">
              <span>
                {params.column.title }
                <i class = "ivu-icon ivu-icon-ios-search" />
              </span>
              <div slot="content">
                <Select
                  placeholder="接收人" size="small" style="width:110px"
                  slot="content"
                  filterable
                  clearable
                  v-on:on-change={() => {
                    this.getTableData()
                  }}
                  v-model={this.searchHeader.acceptUid}>
                  {(this.incumbencyTbUser || []).map(person => {
                    return (
                      <Option v-model={person.id}>{person.nickname}</Option>
                    )
                  })}
                </Select>
                <Button class="searchButton" size="small" v-on:click={() => { this.getTableData() }}><i class = "ivu-icon ivu-icon-ios-search" /></Button>
                <Button type="error" size="small" v-on:click={() => { this.searchHeader.acceptUid = '' }}><Icon type="md-close-circle" /></Button>
              </div>
            </Poptip>)
          }
        },
        {
          title: '执行人',
          key: 'executors',
          align: 'center',
          renderHeader: (h, params) => {
            return (<Poptip placement="bottom">
              <span>
                {params.column.title }
                <i class = "ivu-icon ivu-icon-ios-search" />
              </span>
              <div slot="content">
                <Select
                  placeholder="执行人" size="small" style="width:110px"
                  slot="content"
                  filterable
                  clearable
                  v-on:on-change={() => {
                    this.getTableData()
                  }}
                  v-model={this.searchHeader.executeUid}>
                  {(this.incumbencyTbUser || []).map(person => {
                    return (
                      <Option v-model={person.id}>{person.nickname}</Option>
                    )
                  })}
                </Select>
                <Button class="searchButton" size="small" v-on:click={() => { this.getTableData() }}><i class = "ivu-icon ivu-icon-ios-search" /></Button>
                <Button type="error" size="small" v-on:click={() => { this.searchHeader.executeUid = '' }}><Icon type="md-close-circle" /></Button>
              </div>
            </Poptip>)
          }
        },
        {
          title: '任务等级',
          key: 'taskLevel',
          width: 110,
          align: 'center',
          renderHeader: (h, params) => {
            return (<Poptip placement="bottom">
              <span>
                {params.column.title }
                <i class = "ivu-icon ivu-icon-ios-search" />
              </span>
              <div slot="content">
                <Select clearable v-model={this.searchHeader.taskLevel} size="small" placeholder="任务等级" style="width:110px">
                  {(this.searchHeader.searchTaskLeavelList || []).map(task => {
                    return (
                      <Option v-model={task.tasksLevelId}>{task.tasksLevelName}</Option>
                    )
                  })}
                </Select>
                <Button class="searchButton" size="small" v-on:click={() => { this.getTableData() }}><i class = "ivu-icon ivu-icon-ios-search" /></Button>
                <Button type="error" size="small" v-on:click={() => { this.searchHeader.taskLevel = '' }}><Icon type="md-close-circle" /></Button>
              </div>
            </Poptip>)
          }
        },
        {
          title: '任务状态',
          key: 'taskStatus',
          width: 110,
          align: 'center',
          renderHeader: (h, params) => {
            return (<Poptip placement="bottom">
              <span>
                {params.column.title }
                <i class = "ivu-icon ivu-icon-ios-search" />
              </span>
              <div slot="content">
                <Select clearable v-model={this.searchHeader.searchType} size="small" style="width:110px" placeholder="任务状态">
                  {(this.searchHeader.searchTaskStatuList || []).map(task => {
                    return (
                      <Option v-model={task.tasksStatusId}>{task.tasksStatusName}</Option>
                    )
                  })}
                </Select>
                <Button class="searchButton" size="small"
                  v-on:click={() => { this.getTableData() }}><i class = "ivu-icon ivu-icon-ios-search" /></Button>
                <Button type="error" size="small" v-on:click={() => { this.searchHeader.searchType = '' }}><Icon type="md-close-circle" /></Button>
              </div>
            </Poptip>)
          }
        },
        {
          title: '操作',
          slot: 'action',
          align: 'center'
        }
      ],
      tableContentData: []// 列表页数据
    }
  },
  mounted() {
    this.getEmployeeList()
    // this.getAllData()
    this.getTableData()
  },
  methods: {
    // 获取全体人员名单（发起人、执行人、接收人）
    getEmployeeList() {
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
    // 获取任务类型、状态、等级
    getInitialData () {
      this.$axios({
        url: 'http://192.168.1.103:8080/BzSystem/tasks/tasksrender',
        data: $qs.stringify(),
        method: 'get'
      }).then(resp => {
        if (resp.data.code === 10000) {
          this.searchCondition.taskLevel = res.data.content.tasksLevel// 任务等级
          this.searchCondition.taskStatus = res.data.content.tasksStatus// 任务状态
        } else {
          this.$Message.success(resp.data.msg)
        }
      }).catch(err => {
        console.log('err', err)
      })
      
    },
    // 切换tab
    switchTab() {
      
    },
    // 获取页面渲染数据
    getTableData(data) {
      this.loading = true 
      let params = this.getValidParams(data)
      console.log(params)
      this.$axios({
        url: `${baseUrl}/BzSystem/tasks/send/${this.currentTab}`,
        data: $qs.stringify(params),
        method: 'get'
      }).then(res => {
        if (res.data.code === 10000) {
          // 获取内tab数值
          let data = res.data.content
          this.headCount.countAll = data.countAll
          this.headCount.countClose = data.countClose
          this.headCount.countDefer = data.countDefer
          this.headCount.countDone = data.countDone
          this.headCount.countOngoing = data.countOngoing
          this.headCount.countTbc = data.countTbc
  
          this.tableContentData = data.page.pageContent 
          this.searchCondition.currentPage = data.page.currentPage 
          this.searchPageSize.pageSize = data.page.pageSize 
          this.searchTotalCount.totalCount = data.page.totalCount
          
          this.loading = false 
        } else {
          this.loading = false
          this.$Message.success(resp.data.msg)
        }
      }).catch(err => {
        console.log('err', err)
      })
      // 内tab列表数据
      // let {
      //   name,
      //   timeRange,
      //   acceptUid,
      //   sendUid,
      //   taskLevel,
      //   executeUid,
      //   searchType,
      //   currPage,
      //   pageSize,
      //   searchContent
      // } = this.searchHeader
      // let sendData = {}
      // // 如果有模糊搜索，清空表头内容
      // if (searchContent) {
      //   sendData.searchType = '1'
      //   sendData.searchContent = searchContent
      // } else {
      //   // 发送表头搜索内容
      //   sendData = {
      //     name,
      //     acceptUid,
      //     sendUid,
      //     taskLevel,
      //     executeUid,
      //     searchType,
      //     searchContent
      //   }
      //   if (timeRange[0]) {
      //     sendData.taskInfoStartDate = moment(timeRange[0]).format('YYYY-MM-DD')
      //     sendData.taskInfoEndDate = moment(timeRange[1]).format('YYYY-MM-DD')
      //   }
      //   sendData.pageSize = pageSize
      //   sendData.currPage = currPage
      // }
      // this.$axios({
      //   url: 'http://192.168.1.103:8080/BzSystem/tasks/all/' + this.innerTabs + '',
      //   data: $qs.stringify(sendData),
      //   method: 'post'
      // }).then(resp => {
      //   // 查无数据
      //   if (resp.data.code === 10001) {
      //     this.searchHeader.totalCount = 0
      //     this.searchHeader.currPage = 1
      //     this.searchHeader.totalScore = 0
      //     this.dataContent = []
      //   } else if (resp.data.code === 10000) {
      //     // 获取内tab数值
      //     let _self = this.headeCount
      //     let responseData = resp.data.content
      //     let { countAll, countClose, countDefer, countDone, countOngoing, countTbc } = responseData
      //     if (this.innerTabs === '1') {
      //       _self.countAll = countAll
      //     } else if (this.innerTabs === '2') {
      //       _self.countTbc = countTbc
      //     } else if (this.innerTabs === '3') {
      //       _self.countOngoing = countOngoing
      //     } else if (this.innerTabs === '4') {
      //       _self.countDefer = countDefer
      //     } else if (this.innerTabs === '5') {
      //       _self.countClose = countClose
      //     } else if (this.innerTabs === '6') {
      //       _self.countDone = countDone
      //     }
          // 获取按钮
          // let allData = responseData.page.pageContent
          // let buttonData = []
          // allData.map(x => {
          //   let out = {}
          //   let more = {}
          //   buttonData = x.button
          //   for (var b in buttonData) {
          //     if (buttonData[b] === true) {
          //       if (Object.getOwnPropertyNames(out).length < 2) {
          //         out[b] = true
          //       } else {
          //         more[b] = true
          //       }
          //     }
          //   }
          //   x.outButton = out
          //   x.moreButton = more
          // })
      // })
    },
    // 获取表头搜索有效参数
    getValidParams(data) {
      let params = {}
      if (this.searchContent) {
        this.clearSearchHeader(this.searchContent)
      }  else {
        delete this.searchCondition.searchContent
      }
      let conditions = JSON.parse(JSON.stringify(this.searchCondition))
      for (let key in conditions) {
        if (conditions.hasOwnProperty(key)) {
          if (conditions[key]) {
            params[key] = conditions[key]
          }
        }
      }
      // 如果有起始时间
      if (params.timeRange[0]) {
        params.startTime = moment(params.timeRange[0]).format('YYYY-MM-DD')
        params.endTime = moment(params.timeRange[0]).format('YYYY-MM-DD')
      } 
      // 删除timeRange字段
      delete params.timeRange 
      delete params.totalCount 
      params = {...params, ...data}
      return params 
    },
    // 更新子组件修改的搜索条件
    handleSearchConditionChange(data) {
      this.searchCondition[data.key] = data.value 
      this.getTableData({currentPage: 1})
    }, 
    // 当前页发生改变时对应的处理函数
    handleCurrentPageChange(page) {
      this.searchCondition.currentPage = page
      this.getTableData()
    },
    // 改变页面显示条目时对应的处理函数 
    handlePageSizeChange(pageSize) {
      this.searchCondition.pageSize = pageSize 
      this.getTableData({ currentPage: 1 }) 
    },
    // 
    handleSearchContentChange(searchContent) {
      this.searchContent = searchContent
      if (!this.searchContent) {
        this.getTableData()
      }
    },
    // 模糊搜索
    handleInaccurateSearch() {
      this.getTableData()
    },
    // 清空表头搜索
    clearSearchHeader(searchContent) {
      this.searchCondition = {
        taskLevel: '', // 任务等级
        taskStatus: '', // 任务状态
        endTime: '', // 方案结束时间
        taskName: '', // 任务名称
        timeRange: [], // 时间范围
        sendUid: '', // 发起人id
        sendName: '', // 发起人姓名 
        acceptUid: '', // 接收人id
        acceptName: '', // 接受人姓名
        executeUid: '', // 执行人id
        executeName: '', // 执行人姓名
        pageSize: 20,
        totalCount: 100,
        currentPage: 1,
        startTime: '',
        endTime: '',
        searchContent: searchContent
      }
    },
    // 一键清空搜索条件，获取原始数据
    refresh () {
      this.clearSearchHeader()
      this.getTableData()
    },
    // 切换外部tabs
    detail (name) {
      switch (name) {
        case '0':
          this.$router.push({
            name: 'taskDetail'
          })
          break
        case '1':
          this.$router.push({
            name: 'taskPropose'
          })
          break
        case '2':
          this.$router.push({
            name: 'taskAccept'
          })
          break
        case '3':
          this.$router.push({
            name: 'taskExcute'
          })
          break
        case '4':
          this.$router.push({
            name: 'taskFocus'
          })
          break
        case '5':
          this.$router.push({
            name: 'taskAll'
          })
          break
        case '6':
          this.$router.push({
            name: 'taskPending'
          })
          break
        case '7':
          this.$router.push({
            name: 'taskReward'
          })
          break
        case '8':
          this.$router.push({
            name: 'taskDepart'
          })
          break
        case '9':
          this.$router.push({
            name: 'taskMonthly'
          })
          break
      }
    },
    // 切换内部tabs,发送不同的接口
    changeInnerTabs (name) {
      switch (name) {
        case '':
          this.innerTabs = '0'
          this.loading = true
          this.getTableData()
          break
        case '1_1':
          this.innerTabs = '1'
          this.loading = true
          this.getTableData()
          break
        case '1_2':
          this.innerTabs = '2'
          this.loading = true
          this.getTableData()
          break
        case '1_3':
          this.innerTabs = '3'
          this.loading = true
          this.getTableData()
          break
        case '1_4':
          this.innerTabs = '4'
          this.loading = true
          this.getTableData()
          break
        case '1_5':
          this.innerTabs = '5'
          this.loading = true
          this.getTableData()
          break
        case '1_6':
          this.innerTabs = '6'
          this.loading = true
          this.getTableData()
          break
      }
    }
  },
  watch: {
    searchCondition: {
      handler(newVal, oldVal) {
        console.log(newVal,'father')
      },
      deep: true
    },
  }
}
</script>

<style lang="less" scoped>
#task-propose { 
  box-sizing: border-box;
  padding: 0 10px;
  .ivu-tabs-tabpane {
    min-height: 0;
  }
}
</style>
