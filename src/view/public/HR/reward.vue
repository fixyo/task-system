<template>
  <div class="pagePadding">
    <Tabs type="card" v-model="tabsType" :animated="false">
      <div slot="extra" >
        <Button class="btns" @click="showSelect=!showSelect">
          <Icon :type="showSelect?'ios-arrow-up':'ios-arrow-down' "/>筛选
        </Button>
      </div>
      <TabPane border label="奖惩详情" name="detail">
        <Card style="margin:10px 0;padding:0 20px;" v-show="showSelect">
          <Form
            ref="detailSearchBar"
            :model="detailHeader"
            inline
            label-position="left"
            :label-width="60"
          >
            <FormItem label="开始时间">
              <DatePicker
                format="yyyy-MM-dd"
                @on-change="(v)=>detailHeader.startTime=v"
                v-model="detailHeader.startTime"
                placeholder="开始时间"
              ></DatePicker>
            </FormItem>
            <FormItem label="结束时间">
              <DatePicker
                format="yyyy-MM-dd"
                @on-change="(v)=>detailHeader.endTime=v"
                v-model="detailHeader.endTime"
                placeholder="结束时间"
              ></DatePicker>
            </FormItem>
            <FormItem label="发起人">
              <Input></Input>
            </FormItem>
            <FormItem label="当事人">
              <Input></Input>
            </FormItem>
            <FormItem label="类型">
              <Select v-model="detailHeader.initiationType">
                <Option value="0">全部</Option>
                <Option value="2">日常奖惩</Option>
                <Option value="3">日报扣分</Option>
                <Option value="4">晨会纪要扣分</Option>
                <Option value="5">面谈扣分</Option>
              </Select>
            </FormItem>
          </Form>
        </Card>
        <Modal :mask-closable="false" @on-ok="handleValidate('addReword')" v-model="showAdd" title="新增" :loading="loading">
          <Button
            :type="addReword.initiationType===2?'primary':'default'"
            @click="addReword.initiationType=2"
            class="btns"
          >个人</Button>
          <Button
            :type="addReword.initiationType===1?'primary':'default'"
            @click="addReword.initiationType=1"
            class="btns"
          >百助</Button>
          <hr style="margin-bottom:30px">
          <Form
            ref="addReword"
            :model="addReword"
            inline
            label-position="right"
            :label-width="60"
            :rules="addValidate"
          >
            <FormItem label="日期" prop="rewardDate">
              <DatePicker
                format="yyyy-MM-dd"
                @on-change="(v)=>addReword.rewardDate=v"
                v-model="addReword.rewardDate"
                placeholder="日期"
                style="width:162px"
              ></DatePicker>
            </FormItem>
            <FormItem prop="initiatorId" label="发起人">
              <Select v-model="addReword.rewardUserId" style="width:162px"></Select>
            </FormItem>
            <FormItem prop="rewardUserId" label="当事人">
              <Select v-model="addReword.rewardUserId" style="width:162px"></Select>
            </FormItem>
            <FormItem label="连带人员">
              <Select v-model="addReword.relatedUserIds" style="width:162px"></Select>
            </FormItem>
            <FormItem prop="score" label="分数">
              <Input v-model="addReword.score"></Input>
            </FormItem>
            <br>
            <FormItem prop="reason" label="事项">
              <Input v-model="addReword.reason" style="width:395px"></Input>
            </FormItem>
          </Form>
        </Modal>
        <Table
          ref="selection"
          @on-selection-change="selectChange"
          :columns="detailTableHeader"
          :data="detailContent"
        >
          <template slot="header">
            <Button type="primary" class="btns" @click="showAdd=true">新增</Button>
            <Button type="error" class="btns">批量删除</Button>
            <Button type="primary" class="btns" @click="shake()">申请销分</Button>
            <!-- <Input style="float:right;display:inline-block" placeholder="搜索发起人/当事人"></Input> -->
          </template>
          <template slot-scope="{ row, index }" slot="edit">
            <Button type="primary">申请销分</Button>
            <Button style="margin-left:10px" type="error">删除</Button>
          </template>
          <div slot="footer">
            <span style="margin-left:18px">总分：{{detailHeader.totalScore}}</span>
          </div>
        </Table>
        <Page
          :total="detailHeader.totalCount"
          :page-size="detailHeader.pageSize"
          :current="detailHeader.currPage"
          size="small"
          show-total
          show-sizer
          show-elevator
          @on-change="(current)=>detailSearch(current,undefined)"
          @on-page-size-change="(pageSize)=>detailSearch(undefined,pageSize)"
          style="float:right;"
        />
      </TabPane>
      <TabPane label="奖惩统计" name="total">
        <Table
          v-for="(item,index) in totalContent"
          :key="index"
          :width="500"
          :columns="totalHeader"
          :data="item"
          style="float:left;margin:0 20px 20px 0;"
        ></Table>
      </TabPane>
    </Tabs>
  </div>
</template>
<script>
import moment from 'moment'
import { baseUrl } from '@/api/base.js'
export default {
  name: 'reward',
  data () {
    return {
      loading: true, // Modal开启loading状态
      showSelect: true, // 奖惩详情的搜索
      showAdd: false, // 新增奖惩的展示框
      showApply: false, // 消分申请的展示框
      tabsType: 'detail',
      detailHeader: {
        // 详情页的搜索表头
        totalCount: 100,
        pageSize: 20,
        currPage: 1,
        initiationType: '1', // 发起类型
        initiatorId: '', // 发起人id
        startTime: '',
        endTime: '',
        totalScore: '',
        userId: '' // 当事人id
      },
      addReword: {
        rewardDate: '2019-05-16', // 发起日期
        entryUserId: '318', // 录入人id
        initiationType: 2, // 发起类型 1：百助，2：个人
        initiatorId: '318', // 发起人id
        rewardUserId: '318', // 被奖惩人ID
        score: '10', // 奖惩分值
        relatedUserIds: ['382'], // 连带人ID列表
        reason: '提出优化建议，并被采纳' // 奖惩原因
      },
      addValidate: {
        rewardDate: [
          { required: true, message: '日期不能为空', trigger: 'blur' }
        ],
        initiatorId: [
          { required: true, message: '发起人不能为空', trigger: 'change' }
        ],
        rewardUserId: [
          { required: true, message: '当事人不能为空', trigger: 'change' }
        ],
        score: [{ required: true, message: '得分不能为空', trigger: 'blur' }],
        reason: [{ required: true, message: '事项不能为空', trigger: 'blur' }]
      },
      checked: [],
      detailTableHeader: [
        // 详情页的表格表头
        { type: 'selection', width: 60 },
        { title: '序号', type: 'index', width: 60, align: 'center' },
        { title: '时间', key: 'rewardTime' },
        { title: '当事人', key: 'nickName' },
        {
          title: '类型',
          key: 'initiationDetailed',
          renderHeader: (h, params) => {
            return (<Poptip placement="bottom">
              <span>
                {params.column.title}
                <i class="ivu-icon ivu-icon-ios-search" />
              </span>
              <Select
                slot="content"
                v-model={this.detailHeader.initiationType}
              >
                <Option value="0">全部</Option>
                <Option value="2">日常奖惩</Option>
                <Option value="3">日报扣分</Option>
                <Option value="4">晨会纪要扣分</Option>
                <Option value="5">面谈扣分</Option>
              </Select>
            </Poptip>)
          }
        },
        { title: '事项', key: 'reason' },
        {
          title: '分数',
          key: 'score',
          width: 100
        },
        {
          title: '发起人',
          key: 'initiatorName',
          searchKey: 'initiatorId',
          renderHeader: (h, params) => {
            return h(
              'span',
              {
                on: {
                  click: () => {
                    console.log(params)
                  }
                },
                style: {
                  cursor: 'pointer'
                }
              },
              [
                h('span', params.column.title),
                h('i', {
                  class: ['ivu-icon', 'ivu-icon-ios-search']
                })
              ]
            )
          }
        },
        { title: '操作', slot: 'edit' }
      ],
      detailContent: [
        {
          time: '2018-05-13',
          reward: '倪宗山',
          type: '任务扣分',
          reason: '未及时和发起人确认任务方案扣1分',
          score: '-1',
          initiator: '系统'
        },
        {
          time: '2018-05-13',
          reward: '倪宗山',
          type: '任务扣分',
          reason: '未及时和发起人确认任务方案扣1分',
          score: '-1',
          initiator: '系统'
        },
        {
          time: '2018-05-13',
          reward: '倪宗山',
          type: '任务扣分',
          reason: '未及时和发起人确认任务方案扣1分',
          score: '-1',
          initiator: '系统'
        }
      ],
      totalHeader: [
        { title: '奖惩排名', key: 'rank', align: 'center' },
        { title: '姓名', key: 'nickName', align: 'center' },
        { title: '奖惩分数', key: 'score', align: 'center' }
      ],
      totalContent: [
        [{ rank: '1', name: '倪宗山', score: '100' }],
        [{ rank: '1', name: '倪宗山', score: '100' }]
      ]
    }
  },
  mounted () {
    this.pageInit()
    this.detailSearch()
  },
  methods: {
    selectChange (rows) {
      console.log(rows)
      this.checked = rows.map(e => {})
    },
    detailSearch (
      currPage = this.detailHeader.currPage,
      pageSize = this.detailHeader.pageSize
    ) {
      this.detailHeader.currPage = currPage
      this.detailHeader.pageSize = pageSize
      let data = this.detailHeader
      data.startTime = moment(data.startTime).format('YYYY-MM-DD')
      data.endTime = moment(data.endTime).format('YYYY-MM-DD')
      this.$axios({
        url: baseUrl + '/reward/getRewardsByDTO',
        method: 'post',
        data: $qs.stringify(data)
      })
        .then(res => {
          let data = res.data.content
          let { totalCount, pageSize, currPage, totalScore } = data
          this.detailHeader.totalCount = totalCount
          this.detailHeader.pageSize = pageSize
          this.detailHeader.currPage = currPage
          this.detailHeader.totalScore = totalScore
          this.detailContent = data.pageContent
          console.log(this.detailHeader)
        })
        .catch(err => {
          console.log(err)
        })
    },
    // 获取奖惩统计的排名列表
    getStatistics () {
      this.$axios({
        url: baseUrl + '/reward/getStatistics',
        method: 'post'
      })
        .then(res => {
          this.formatTotal(res.data.content)
        })
        .catch(err => {
          console.log('getStatistics' + err)
        })
    },
    formatTotal (a) {
      let FunData = e => {
        let proportion = 15 // 按照比例切割
        let num = 0
        let _data = []
        for (let i = 0; i < e.length; i++) {
          if (i % proportion === 0 && i !== 0) {
            _data.push(e.slice(num, i))
            num = i
          }
          if (i + 1 === e.length) {
            _data.push(e.slice(num, i + 1))
          }
        }
        return _data
      }
      this.totalContent = FunData(a)
    },
    shake () {
      $('#app').toggleClass('shake')
      setTimeout(() => {
        $('#app').toggleClass('shake')
      }, 1000)
    },
    handleValidate (name) {
      this.addReword.rewardDate = moment(this.addReword.rewardDate).format(
        'YYYY-MM-DD'
      )
      this.$refs[name].validate(valid => {
        if (valid) {
          this.$axios({
            url: baseUrl + '/reward/rewardInsert',
            method: 'post',
            data: this.addReword
          })
            .then(res => {
              if (res.data.code === 10000) {
                this.$Message.success(res.data.msg)
                this.loading = false // 确认框先取消loading
                this.detailSearch()
                this.$nextTick(() => {
                  this.loading = true
                })
              } else {
                this.$Message.error(res.data.msg)
                this.loading = false // 确认框先取消loading
                this.$nextTick(() => {
                  this.loading = true
                })
              }
            })
            .catch(err => {
              console.error(err)
            })
          this.showAdd = false
        } else {
          this.$Message.error('Fail!')
          this.loading = false // 确认框先取消loading
          this.$nextTick(() => {
            this.loading = true
          })
        }
      })
    },
    pageInit () {
      // 初始化时间为当月时间
      let firstDayOfMonth =
        moment()
          .add('month', 0)
          .format('YYYY-MM') + '-01'
      let lastDayofMonth = moment(firstDayOfMonth)
        .add('month', 1)
        .add('days', -1)
        .format('YYYY-MM-DD')
      this.detailHeader.startTime = firstDayOfMonth
      this.detailHeader.endTime = lastDayofMonth
      // 初始化当事人为当前登录用户
      this.detailHeader.userId = this.userId
    },
    sync (prop, value) {
      console.log(prop, value)
      this['detailHeader'][prop] = value
    }
  },
  watch: {
    tabsType (newV, oldV) {
      if (newV === 'total') {
        this.getStatistics()
      }
    }
  },
  computed: {
    userId () {
      return this.$store.state.user.userId
    }
  }
}
</script>
<style scope>
.pagePadding .ivu-tabs-tab.ivu-tabs-tab-active.ivu-tabs-tab-focused {
  background-color: #19aa8d;
  border-color: #19aa8d;
  color: #fff;
}

#app {
  position: absolute;
}
.shake {
  animation: mymove 0.1s infinite;
}
@keyframes mymove {
  0% {
    left: -100px;
  }
  50% {
    left: 100px;
  }
  100% {
    left: 0;
  }
}
</style>

<style>
.pagePadding .tableBox .ivu-table-overflowX{
  overflow-x: hidden;
}
</style>
