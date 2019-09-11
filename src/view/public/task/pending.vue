<template>
<!--待审任务-->
<div id="task">
    <div class="indexBody">
        <div class="innerBody">
            <Tabs value="6" :animated="false"  @on-click="detail">
                <TabPane label="我发起的任务" name="1"></TabPane>
                <TabPane label="我接受的任务" name="2"></TabPane>
                <TabPane label="我执行的任务" name="3"></TabPane>
                <TabPane label="我关注的任务" name="4"></TabPane>
                <TabPane label="全部任务" name="5"></TabPane>
                <TabPane label="待审任务" name="6">
                    <Button class="launchTask" type="primary" @click="launchTask">发起任务</Button>
                    <Tabs type="card"  :animated="false">
                        <TabPane label="全部" name="1_1">
                            <Table border ref="selection" :columns="dataTableHeader" :data="dataContent">
                                <template slot-scope="{ row, index }" slot="action">
                                    <Button type="primary" class="btns">新增</Button>
                                </template>
                            </Table>
                        </TabPane>
                        <TabPane label="待确认" name="1_2">待确认</TabPane>
                        <TabPane label="展缓" name="1_3">展缓</TabPane>
                        <TabPane label="关闭" name="1_4">关闭</TabPane>
                        <TabPane label="已完成" name="1_5">已完成</TabPane>
                    </Tabs>
                </TabPane>
                <TabPane label="悬赏任务" name="7"></TabPane>
                <TabPane label="部门任务" name="8"></TabPane>
                <TabPane label="月度评审" name="9"></TabPane>
            </Tabs>
            <Modal :mask-closable="false" id="taskModal" v-model="launchTaskModal" style="width: 920px;">
                 <p slot="header">
                    <Icon type="md-school" style="color: #19aa8d;margin-right: 10px;" size="20"/>
                    <span>{{this.titleName}}</span>
                </p>
                <Row class="bottomDistance">
                    <Col span="10" offset="2">
                        <Col span="4">
                            <i class="require">*</i>任务名称
                        </Col>
                        <Col span="13">
                            <Input placeholder="请输入任务名称" clearable filterable v-model="taskName" ></Input>
                        </Col>
                    </Col>
                    <Col span="10">
                        <Col span="4">
                            <i class="require">*</i>任务类型
                        </Col>
                        <Col span="13">
                            <Select v-model="taskType">
                                <Option placeholder="请选择任务类型" clearable filterable v-for="item in taskTypeList" :value="item.value" :key="item.value">{{item.label}}</Option>
                            </Select>
                        </Col>
                    </Col>
                </Row>
                <Row class="bottomDistance">
                    <Col span="10" offset="2">
                        <Col span="4">
                            <i class="require">*</i>接收人
                        </Col>
                        <Col span="13">
                            <Select v-model="accpter">
                                <Option placeholder="请输入接收人" clearable filterable v-for="item in accpterList" :value="item.value" :key="item.value">{{item.label}}</Option>
                            </Select>
                        </Col>
                    </Col>
                    <Col span="10">
                        <Col span="4">
                            <i class="require">*</i>发起人
                        </Col>
                        <Col span="13">
                            <Select v-model="initer">
                                <Option placeholder="请输入发起人" clearable filterable v-for="item in initerList" :value="item.value" :key="item.value">{{item.label}}</Option>
                            </Select>
                        </Col>
                    </Col>
                </Row>
                <Row class="bottomDistance">
                    <Col span="10" offset="2">
                        <Col span="4" style="top: 6px;">截止时间</Col>
                        <Col span="13">
                            <DatePicker placeholder="请选择任务的截止时间" type="date" v-model="taskEndTime" style="width: 218.47px"></DatePicker>
                        </Col>
                    </Col>
                    <Col span="10">
                        <Col span="4">
                            <i class="require">*</i>任务级别
                        </Col>
                        <Col span="13">
                            <Select v-model="taskLeavel">
                                <Option placeholder="请选择任务级别" clearable filterable v-for="item in taskLeavelList" :value="item.value" :key="item.value">{{item.label}}</Option>
                            </Select>
                        </Col>
                    </Col>
                </Row>
                <Row class="bottomDistance">
                    <Col span="10" offset="2">
                        <Col span="4" style="top: 6px;">顾问</Col>
                        <Col span="13">
                            <Select v-model="adviser">
                                <Option placeholder="请选择顾问" clearable filterable v-for="item in adviserList" :value="item.value" :key="item.value">{{item.label}}</Option>
                            </Select>
                        </Col>
                    </Col>
                    <Col span="10">
                        <Col span="4" style="top: 6px;">提出人</Col>
                        <Col span="13">
                            <Select v-model="proposer">
                                <Option placeholder="请选择提出人" v-for="item in proposerList" :value="item.value" :key="item.value" clearable filterable>{{item.label}}</Option>
                            </Select>
                        </Col>
                    </Col>
                </Row>
                <Row class="bottomDistance">
                    <Col span="10" offset="2">
                        <Col span="4" style="top: 6px;">任务描述</Col>
                        <Col span="13">
                            <Input placeholder="请输入任务描述" v-model="taskDetail" clearable filterable type="textarea"></Input>
                        </Col>
                    </Col>
                    <Col span="10">
                        <Col span="4" style="top: 6px;">附件</Col>
                        <Col span="13">
                              <Upload  multiple action="">
                                <Button icon="ios-cloud-upload-outline">单个文件不能超过20M</Button>
                            </Upload>
                        </Col>
                    </Col>
                </Row>
            </Modal>
        </div>
    </div>
</div>
</template>

<script>
export default {
  name: 'task',
  data () {
    return {
      launchTaskModal: false, // 发起任务弹框 默认false
      titleName: '', // 弹出框title
      accpter: '', // 接收人model
      accpterList: [], // 接受人列表
      initer: '', // 发起人model
      initerList: [], // 发起人
      taskName: '', // 任务名称
      taskType: '', // 任务类型model
      taskEndTime: '', // 任务截止时间
      taskLeavel: '', // 任务级别model
      taskLeavelList: [], // 任务级别列表
      adviser: '', // 顾问model
      adviserList: [], // 顾问列表
      proposer: '', // 提出人model
      proposerList: [], // 提出人列表
      taskDetail: '', // 任务描述

      taskTypeList: [
        {
          value: '1',
          label: '普通任务'
        },
        {
          value: '2',
          label: '简易任务'
        },
        {
          value: '3',
          label: '悬赏任务'
        }
      ], // 任务类型list
      dataTableHeader: [{
        title: '序号',
        type: 'index',
        width: 60,
        align: 'center'
      },
      {
        title: '任务名称',
        key: 'taskName',
        align: 'center',
        renderHeader: (h, params) => {
          return (<Poptip placement="bottom">
            <span>
              {params.column.title }
              <i class = "ivu-icon ivu-icon-ios-search" />
            </span>
            <div slot="content">
              <Input placeholder="任务名称" style="width:100px"></Input>
              <Button class="searchButton"><i class = "ivu-icon ivu-icon-ios-search" /></Button>
              <Button type="error"><Icon type="md-close-circle" /></Button>
            </div>
          </Poptip>)
        }
      },
      {
        title: '时间',
        key: 'time',
        align: 'center',
        renderHeader: (h, params) => {
          return (<Poptip placement="bottom">
            <span>
              {params.column.title }
              <i class = "ivu-icon ivu-icon-ios-search" />
            </span>
            <div slot="content">
              <Input placeholder="任务名称" style="width:100px"></Input>
              <Button class="searchButton"><i class = "ivu-icon ivu-icon-ios-search" /></Button>
              <Button type="error"><Icon type="md-close-circle" /></Button>
            </div>
          </Poptip>)
        }
      },
      {
        title: '发起人',
        key: 'promoter',
        align: 'center',
        renderHeader: (h, params) => {
          return (<Poptip placement="bottom">
            <span>
              {params.column.title }
              <i class = "ivu-icon ivu-icon-ios-search" />
            </span>
            <div slot="content">
              <Input placeholder="发起人" style="width:100px"></Input>
              <Button class="searchButton"><i class = "ivu-icon ivu-icon-ios-search" /></Button>
              <Button type="error"><Icon type="md-close-circle" /></Button>
            </div>
          </Poptip>)
        }
      },
      {
        title: '接收人',
        key: 'receiver',
        align: 'center',
        renderHeader: (h, params) => {
          return (<Poptip placement="bottom">
            <span>
              {params.column.title }
              <i class = "ivu-icon ivu-icon-ios-search" />
            </span>
            <div slot="content">
              <Input placeholder="接收人" style="width:100px"></Input>
              <Button class="searchButton"><i class = "ivu-icon ivu-icon-ios-search" /></Button>
              <Button type="error"><Icon type="md-close-circle" /></Button>
            </div>
          </Poptip>)
        }
      },
      {
        title: '执行人',
        key: 'executor',
        align: 'center',
        renderHeader: (h, params) => {
          return (<Poptip placement="bottom">
            <span>
              {params.column.title }
              <i class = "ivu-icon ivu-icon-ios-search" />
            </span>
            <div slot="content">
              <Input placeholder="执行人" style="width:100px"></Input>
              <Button class="searchButton"><i class = "ivu-icon ivu-icon-ios-search" /></Button>
              <Button type="error"><Icon type="md-close-circle" /></Button>
            </div>
          </Poptip>)
        }

      },
      {
        title: '任务等级',
        key: 'taskGrade',
        align: 'center',
        renderHeader: (h, params) => {
          return (<Poptip placement="bottom">
            <span>
              {params.column.title }
              <i class = "ivu-icon ivu-icon-ios-search" />
            </span>
            <div slot="content">
              <Select placeholder="任务等级" style="width:100px">
                <Option value="A">A</Option>
                <Option value="B">B</Option>
                <Option value="C">C</Option>
              </Select>
              <Button class="searchButton"><i class = "ivu-icon ivu-icon-ios-search" /></Button>
              <Button type="error"><Icon type="md-close-circle" /></Button>
            </div>
          </Poptip>)
        }
      },
      {
        title: '任务状态',
        key: 'taskStatus',
        align: 'center',
        renderHeader: (h, params) => {
          return (<Poptip placement="bottom">
            <span>
              {params.column.title }
              <i class = "ivu-icon ivu-icon-ios-search" />
            </span>
            <div slot="content">
              <Select style="width:100px" placeholder="任务状态">
                <Option value="1">待确认</Option>
                <Option value="2">进行中</Option>
                <Option value="3">已完成</Option>
                <Option value="4">展缓</Option>
                <Option value="5">关闭</Option>
              </Select>
              <Button class="searchButton"><i class = "ivu-icon ivu-icon-ios-search" /></Button>
              <Button type="error"><Icon type="md-close-circle" /></Button>
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
      dataContent: [{
        index: '1',
        taskName: '这是任务名称',
        time: '2019-3-13',
        promoter: '某某',
        receiver: 'moumou',
        executor: 'lily',
        taskGrade: 'A',
        taskStatus: '进行中'
      },
      {
        index: '1',
        taskName: '这是任务名称',
        time: '2019-3-13',
        promoter: '某某',
        receiver: 'moumou',
        executor: 'lily',
        taskGrade: 'A',
        taskStatus: '进行中'
      },
      {
        index: '1',
        taskName: '这是任务名称',
        time: '2019-3-13',
        promoter: '某某',
        receiver: 'moumou',
        executor: 'lily',
        taskGrade: 'A',
        taskStatus: '进行中'
      },
      {
        index: '1',
        taskName: '这是任务名称',
        time: '2019-3-13',
        promoter: '某某',
        receiver: 'moumou',
        executor: 'lily',
        taskGrade: 'A',
        taskStatus: '进行中'
      }
      ]
    }
  },
  methods: {
    launchTask () {
      this.launchTaskModal = true
      this.titleName = '发起任务'
    },
    detail (name) {
      switch (name) {
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
    }
  }
}
</script>
