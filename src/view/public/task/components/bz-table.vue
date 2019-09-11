<template>
  <div class="bz-table">
    <Table 
      border 
      ref="selection" 
      :columns="tableHeaderData" 
      :data="tableContentData"
      :loading="loadingStatus"
    >
      <template slot-scope="{ row, index }" slot="action">
        <Button type="primary" style="margin-right: 5px;">确认方案</Button>
        <!-- <Button type="primary" style="margin-right: 5px;">任务完成</Button>
        <Button type="primary" style="margin-right: 5px;">阶段性确认</Button>
        <Button type="primary" style="margin-right: 5px;">延长任务</Button> -->
        <Button type="primary" style="margin-right: 5px;">编辑</Button>
        <!-- <Button type="primary" style="margin-right: 5px;">等级调整</Button> -->
        <!-- <Button type="primary" class="btns" style="margin-right: 5px;">查看</Button> -->
        <Poptip placement="bottom" width="100">
          <Button type="default" class="btns" style="margin-right: 5px;">更多</Button>
          <div class="moreAction" slot="content" style="text-aligh:left;">
            <!-- <p style="margin-right: 5px;">确认方案</p>
            <p style="margin-right: 5px;">任务完成</p>
            <p style="margin-right: 5px;">阶段性确认</p>
            <p style="margin-right: 5px;">延长任务</p>
            <p style="margin-right: 5px;">编辑</p>
            <p style="margin-right: 5px;">等级调整</p>
            <p class="btns" style="margin-right: 5px;">查看</p> -->
          </div>
        </Poptip>
      </template>
    </Table>
    <Page
      :total="conditions.totalCount"
      :page-size="conditions.pageSize"
      :current="conditions.currentPage"
      size="small"
      show-total
      show-sizer
      show-elevator
      @on-change="updateCurrentPage"
      @on-page-size-change="updatePageSize"
      style="float:right;"
    />
  </div>
</template>

<script>
export default {
  props: {
    tableContentData: {
      type: Array,
      default: function() {
        return  [{
          index: '1',
          taskName: '这是任务名称',
          time: '2019-3-13',
          promoter: '某某某某',
          receiver: 'moumou',
          executor: 'lily',
          taskGrade: 'A',
          taskStatus: '进行中',
          focus: true 
          },
          {
            index: '1',
            taskName: '这是任务名称',
            time: '2019-3-13',
            promoter: '某某',
            receiver: 'moumou',
            executor: 'lily',
            taskGrade: 'A',
            taskStatus: '进行中',
            focus: false
          },
          {
            index: '1',
            taskName: '这是任务名称',
            time: '2019-3-13',
            promoter: '某某',
            receiver: 'moumou',
            executor: 'lily',
            taskGrade: 'A',
            taskStatus: '进行中',
            focus: true
          },
          {
            index: '1',
            taskName: '这是任务名称',
            time: '2019-3-13',
            promoter: '某某',
            receiver: 'moumou',
            executor: 'lily',
            taskGrade: 'A',
            taskStatus: '进行中',
            focus: false
          }
        ]
      }
    },
    searchCondition: {
      type: Object,
      default: function() {
        return {}
      }
    },
    loading: {
      type: Boolean,
      default: false  
    }
  },
  data() {
    return {
      loadingStatus: this.loading,
      tableHeaderData: [
        {
          title: ' ',
          type: 'focus',
          width: 50,
          align: 'center',
          render: (h, params) => {
            return h('div', [
              h('Icon', {
                props: {
                  type: params.row.focus ? 'ios-star' : 'ios-star-outline'
                },
                style: {
                  color: 'red',
                  cursor: 'pointer',
                  marginRight: '1px',
                  fontSize: '18px'
                },
                on: {
                  click: () => {
                    this.focusTask(params)
                  }
                }
              }),
              h('span')
            ])
          }
        },
        {
          title: '序号',
          type: 'index',
          width: 70,
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
                <Input 
                  placeholder="任务名称" 
                  style="width:160px" 
                  suffix="ios-search" 
                  clearable
                  search
                  onOn-search={
                    (value) => {
                      this.$emit('search-condition-change', {key: 'taskName', value})
                    }
                  }
                  v-model={this.conditions.taskName}
                ></Input>
              </div>
            </Poptip>)
          }
        },
        {
          title: '时间',
          width: 100,
          key: 'time',
          align: 'center',
          renderHeader: (h, params) => {
            return (<Poptip placement="bottom">
              <span>
                { params.column.title }
                <i class = "ivu-icon ivu-icon-ios-search" />
              </span>
              <div slot="content">
                <DatePicker 
                  type="daterange" 
                  show-week-numbers 
                  placement="bottom-start" 
                  v-model={this.conditions.timeRange} 
                  placeholder="请选择时间" 
                  style="width: 200px"
                  onOn-change={
                    value => {
                      this.$emit('search-condition-change', {key: 'timeRange', value})
                    }
                  }
                 ></DatePicker>
              </div>
            </Poptip>)
          }
        },
        {
          title: '发起人',
          key: 'promoter',
          width: 95,
          align: 'center',
          renderHeader: (h, params) => {
            return (<Poptip placement="bottom">
              <span>
                {params.column.title }
                <i class = "ivu-icon ivu-icon-ios-search" />
              </span>
              <div slot="content">
                <Input 
                  placeholder="发起人" 
                  style="width:160px" 
                  suffix="ios-search"
                  clearable
                  search 
                  v-model={this.conditions.sendName}
                  onOn-search={
                    value => {
                      this.$emit('search-condition-change', {key: 'sendName', value})
                    }
                  }
                ></Input>
              </div>
            </Poptip>)
          }
        },
        {
          title: '接收人',
          key: 'receiver',
          width: 95,
          align: 'center',
          renderHeader: (h, params) => {
            return (<Poptip placement="bottom">
              <span>
                {params.column.title }
                <i class = "ivu-icon ivu-icon-ios-search" />
              </span>
              <div slot="content">
                <Input 
                  placeholder="接收人" 
                  style="width:160px" 
                  suffix="ios-search"
                  clearable
                  search 
                  v-model={this.conditions.acceptName}
                  onOn-search={
                    value => {
                      this.$emit('search-condition-change', {key: 'acceptName', value})
                    }
                  }
                ></Input>
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
                <Input 
                  placeholder="执行人" 
                  style="width:160px" 
                  suffix="ios-search"
                  clearable
                  search 
                  v-model={this.conditions.executeName}
                  onOn-search={
                    value => {
                      console.log(value)
                      this.$emit('search-condition-change', {key: 'executeName', value})
                    }
                  }
                ></Input>
              </div>
            </Poptip>)
          }
        },
        {
          title: '任务等级',
          width: 110,
          key: 'taskGrade',
          align: 'center',
          renderHeader: (h, params) => {
            return (<Poptip placement="bottom">
              <span>
                {params.column.title }
                <i class = "ivu-icon ivu-icon-ios-arrow-down" style="marginLeft:5px"/>
              </span>
              <Select
                slot="content"
                placeholder="选择任务等级"
                clearable 
                v-model={this.conditions.taskLevel}
                onOn-query-change={
                  value => {
                    this.$emit('search-condition-change', {key: 'taskLevel', value})
                  }
                }
              >
                <Option value="A">A</Option>
                <Option value="B">B</Option>
                <Option value="C">C</Option>
              </Select>
            </Poptip>
            )
          }
        },
        {
          title: '任务状态',
          width: 110,
          key: 'taskStatus',
          align: 'center',
          renderHeader: (h, params) => {
            return (<Poptip placement="bottom">
              <span>
                {params.column.title }
                <i class = "ivu-icon ivu-icon-ios-arrow-down" style="marginLeft:5px" />
              </span>
              <div slot="content">
                <Select 
                  placeholder="选择任务状态"
                  v-model={this.conditions.taskStatus}
                  clearable 
                  onOn-query-change={
                    value => {
                      this.$emit('search-condition-change', {key: 'taskStatus', value})
                    }
                  }
                  >
                  <Option value="1">待确认</Option>
                  <Option value="2">进行中</Option>
                  <Option value="3">已完成</Option>
                  <Option value="4">展缓</Option>
                  <Option value="5">关闭</Option>
                </Select>
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
      // 将搜索条件深拷贝一份，防止子组件修改相关属性父组件传入的值也被修改
      conditions: JSON.parse(JSON.stringify(this.searchCondition)) 
    }
  },
  methods: {
    // 关注任务
    focusTask(index, params) {
      let data = {
        taskId: params.row.id,
        isFocus: params.row.focus
      }
      this.$axios({
        url: 'http://192.168.1.103:8080/BzSystem/tasks/focus',
        data: $qs.stringify(data),
        method: 'post'
      }).then(res => {
        if (res.data.code === 10000) {
          // 只要成功走这里，无论取消或者关注
          this.$Message.success(res.data.msg)
          params.row.tasksFocus = !params.row.tasksFocus
        } else {
          this.$Message.error(res.data.msg)
        }
      }).catch(err => {
        console.log('err', err)
      })
    },
    // 改变当前页码
    updateCurrentPage(current) {
      this.conditions.currentPage = current 
      this.$emit('current-page-change', current)
    },
    // 改变每页条数
    updatePageSize(pageSize) {
      this.conditions.pageSize = pageSize 
      this.$emit('page-size-change', pageSize)
    }
  },
  watch: {
    searchCondition: {
      handler(newVal) {
        // console.log(newVal, 'son')
      },
      deep: true
    },
    loading(newVal) {
      this.loadingStatus = newVal 
    }
  }
}
</script>

<style lang="less">
  
</style>