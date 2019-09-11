<template>
  <!-- 发起任务 -->
  <div class="launch-task">
    <Button class="btn-launch" type="primary" @click="showTaskForm">发起任务</Button>
    <Modal 
      title="发起任务" 
      :mask-closable="false" 
      :loading="loading"
      id="taskModal" 
      @on-ok="launchTask" 
      @on-cancel="cancelLaunch"
      v-model="showModal" 
      style="width: 920px;"
      >
      <Form ref="formValidate" :model="formValidate" :rules="modelRuleValidate">
        <Row class="bottomDistance">
            <Col span="10" offset="2">
                <Col span="4">
                    <i class="require">*</i>任务名称
                </Col>
                <Col span="13">
                <FormItem prop="name">
                    <Input placeholder="请输入任务名称" clearable filterable v-model="formValidate.name" ></Input>
                </FormItem>
                </Col>
            </Col>
            <Col span="10">
                <Col span="4">
                    <i class="require">*</i>任务类型
                </Col>
                <Col span="13">
                <FormItem prop="type">
                    <Select v-model="formValidate.type" clearable filterable >
                        <Option placeholder="请选择任务类型" v-for="item in searchHeader.taskTypeList" :value="item.tasksTypeId" :key="item.tasksTypeId">{{item.tasksTypeName}}</Option>
                    </Select>
                </FormItem>
                </Col>
            </Col>
        </Row>
        <Row class="bottomDistance">
            <Col span="10" offset="2">
                <Col span="4">
                    <i class="require">*</i>接收人
                </Col>
                <Col span="13">
                <FormItem prop="acceptUid">
                    <Select v-model="formValidate.acceptUid" clearable filterable>
                        <Option placeholder="请输入接收人" v-for="item in searchHeader.incumbencyTbUser" :value="item.id" :key="item.id">{{item.nickname}}</Option>
                    </Select>
                </FormItem>
                </Col>
            </Col>
            <Col span="10">
                <Col span="4">
                    <i class="require">*</i>发起人
                </Col>
                <Col span="13">
                <FormItem prop="sendUid">
                    <Select v-model="formValidate.sendUid" clearable filterable>
                        <Option placeholder="请输入发起人" v-for="item in searchHeader.incumbencyTbUser" :value="item.id" :key="item.id">{{item.nickname}}</Option>
                    </Select>
                </FormItem>
                </Col>
            </Col>
        </Row>
        <Row class="bottomDistance">
            <Col span="10" offset="2">
                <Col span="4" style="top: 6px;">截止时间</Col>
                <Col span="13">
                    <DatePicker placeholder="请选择任务的截止时间" type="date" v-model="formValidate.endTime" style="width: 218.47px"></DatePicker>
                </Col>
            </Col>
            <Col span="10">
                <Col span="4">
                    <i class="require">*</i>任务等级
                </Col>
                <Col span="13">
                <FormItem prop="taskLevel">
                    <Select v-model="formValidate.taskLevel" clearable filterable >
                        <Option placeholder="请选择任务等级" v-for="item in searchHeader.searchTaskLeavelList" :value="item.tasksLevelId" :key="item.tasksLevelId">{{item.tasksLevelName}}</Option>
                    </Select>
                </FormItem>
                </Col>
            </Col>
        </Row>
        <Row class="bottomDistance" style="margin-bottom:23px;">
            <Col span="10" offset="2">
                <Col span="4" style="margin-top: 6px;">顾问</Col>
                <Col span="13">
                    <Select v-model="formValidate.counselorUid" clearable filterable>
                        <Option placeholder="请选择顾问"   v-for="item in searchHeader.incumbencyTbUser" :value="item.id" :key="item.id">{{item.nickname}}</Option>
                    </Select>
                </Col>
            </Col>
            <Col span="10">
                <Col span="4" style="margin-top: 6px;">提出人</Col>
                <Col span="13">
                    <Select v-model="formValidate.introducerUid" clearable filterable>
                        <Option placeholder="请选择提出人"  v-for="item in searchHeader.incumbencyTbUser" :value="item.id" :key="item.id" clearable filterable>{{item.nickname}}</Option>
                    </Select>
                </Col>
            </Col>
        </Row>
        <Row class="bottomDistance">
            <Col span="10" offset="2">
                <Col span="4" style="top: 6px;">任务描述</Col>
                <Col span="13">
                    <Input placeholder="请输入任务描述" v-model="formValidate.description" clearable filterable type="textarea"></Input>
                </Col>
            </Col>
            <!--to do-->
            <Col span="10">
                <Col span="4" style="top: 6px;">附件</Col>
                <Col span="13">
                    <Upload  multiple action="">
                        <Button class="uploadButton" icon="ios-cloud-upload-outline">单个文件不能超过20M</Button>
                    </Upload>
                </Col>
            </Col>
        </Row>
      </Form>
    </Modal>
  </div>
</template>

<script>
import { baseUrl } from '@/api/base.js'
export default {
  name: 'launchTask',
  data () {
    return {
      showModal: false,
      loading: true,
      searchHeader: {
        searchTaskLeavelList: [], // 任务等级列表
        searchTaskStatuList: [], // 任务状态列表
        taskTypeList: [],
        incumbencyTbUser: [] // 在职人员列表
      },
      // 任务字段
      formValidate: {
        name: '', // 任务名称
        acceptUid: '', // 接受人
        sendUid: '', // 发起人
        taskLevel: '', // 任务等级
        type: '', // 任务等级
        endTime: '', // 截止时间
        counselorUid: '', // 顾问
        introducerUid: '', // 提出人
        description: ''// 任务描述
      },
      // 发起任务表单验证规则
      modelRuleValidate: {
        name: [{required: true, message: '任务名称没有写哦', trigger: 'blur'}],
        taskLevel: [{required: true, message: '任务等级没有写哦', trigger: 'change'}],
        acceptUid: [{required: true, type: 'number', message: '任务接收人没有写哦', trigger: 'change'}],
        sendUid: [{required: true, type: 'number', message: '任务发起人没有写哦', trigger: 'change'}],
        type: [{required: true, message: '任务类型没有写哦', trigger: 'change'}]
      }
    }
  },
  methods: {
    getData () {
      // 任务等级 任务类型 任务状态
      this.$axios({
        url: 'http://192.168.1.103:8080/BzSystem/tasks/tasksrender',
        data: $qs.stringify(),
        method: 'get'
      }).then(resp => {
        if (resp.data.code === 10000) {
          let _self = this.searchHeader
          _self.searchTaskLeavelList = resp.data.content.tasksLevel// 任务等级
          _self.searchTaskStatuList = resp.data.content.tasksStatus// 任务状态
          _self.taskTypeList = resp.data.content.tasksType// 任务状态
        } else {
          this.$Message.success(resp.data.msg)
        }
      }).catch(err => {
        console.log('err', err)
      })
      // 发起人 执行人 接收人
      this.$axios({
        url: baseUrl + '/user/getIncumbencyTbUser', // 在职人员列表
        method: 'post'
      }).then(res => {
        if (res.data.code === 10000) {
          this.searchHeader.incumbencyTbUser = res.data.content
        } else {
          this.$Message.error(res.data.msg)
        }
      })
        .catch(err => {
          console.error(err)
        })
    },
    // 显示弹框
    showTaskForm() {
      this.showModal = true
    },
    // 发起任务
    launchTask() {
      let form = this.$refs.formValidate
      // 验证表单字段
      form.validate(v => {
        if (v) {
          console.log('验证通过')
          form.resetFields()
        } else {
          this.loading = false
          this.$nextTick(() => {
            this.loading = true
          })
        }
      })
    },
    // 取消发起任务
    cancelLaunch() {
      let form = this.$refs.formValidate
      form.resetFields()
    },
    // 发起任务表单验证
    insertTasksForm () {
      console.log('okok')
      let formValidateForm = this.$refs.formValidate.$refs.formValidateForm
      formValidateForm.validate((valid) => {
        if (valid) {
          // 必填项都填了就发起任务
          this.insertTasks()
        } else {
          // 有未填必填项，提示
          this.loading = false
          this.$nextTick(() => {
            this.loading = true
          })
        }
      })
    },
    // 发起任务
    insertTasks () {
      let sendData = this.$refs.formValidate.formValidate
      sendData.endTime = moment(this.$refs.formValidate.formValidate.endTime).format('YYYY-MM-DD')
      this.$axios({
        url: 'http://192.168.1.103:8080/BzSystem/tasks/inserttasks',
        data: sendData,
        method: 'post'
      }).then(resp => {
        this.modelLoading = false // 发起任务确认框先取消loading
        if (resp.data.code === 10000) {
          this.$Message.success(resp.data.msg)
          this.getTableData()
        } else {
          this.$Message.success(resp.data.msg)
        }
        this.$nextTick(() => {
          this.modelLoading = true
        })
      }).catch(err => {
        console.log('err', err)
      })
      this.launchTaskModal = false
    },
  },
  mounted () {
    this.getData()
  }
}
</script>

<style scoped>
#taskModal .ivu-input:hover {
    border-color: #19aa8d;
}
#taskModal .ivu-input:focus {
    border-color: #19aa8d;
    outline: 0;
    box-shadow: none;
}
#taskModal .ivu-select-selection-focused,
#taskModal .ivu-select-selection:hover
{
    border-color: #19aa8d;
}
#taskModal .ivu-select-visible .ivu-select-selection {
    border-color: #19aa8d;
    outline: 0;
    box-shadow:none;
}
#taskModal .ivu-modal-footer Button:first-child{
    color: #19aa8d;
    background-color: #fff;
    border-color: #19aa8d;
}
#taskModal .uploadButton:hover,
#taskModal .uploadButton:active{
    color: #19aa8d !important;
    background-color: #fff;
    border-color: #19aa8d  !important;
    box-shadow:none;
}
</style>
