<template>
  <div class="pagePadding">
    <Tabs type="card" v-model="tabsType" :animated="false">
      <TabPane border label="奖惩详情" name="detail">
        <div class="tableHeader clearfix">
          <Button type="primary" class="btns" v-if="permission.create" @click="showAdd=true">新增</Button>
          <Upload
            ref="upload"
            :format="['xlsx','xls','cvs']"
            accept=".xlsx, .xls, .cvs"
            :show-upload-list="false"
            name="file"
            :with-credentials="true"
            :action="baseUrl+'/import'"
            :on-success="uploadSuccess"
            style="display:inline"
          >
            <Button class="btns" v-if="permission.import">导入</Button>
          </Upload>

          <Button class="searchbar" icon="ios-loading" @click="reload()"></Button>
          <Input
            @on-search="detailSearch()"
            placeholder="搜索发起人、当事人"
            search
            clearable
            v-model="detailHeader.fuzzyCondition"
            class="searchbar"
            style="width:200px;margin-right:5px;"
          />
        </div>
        <Modal
          @on-ok="handleValidate()"
          v-model="showAdd"
          :mask-closable="false"
          title="新增"
          :loading="loading"
          :width="600"
        >
          <addReward v-if="showAdd" ref="addReword" :incumbencyTbUser="incumbencyTbUser"></addReward>
        </Modal>
        <Table
          ref="selection"
          @on-selection-change="selectChange"
          :columns="detailTableHeader"
          :data="detailContent"
          @on-sort-change="sortChange"
          key="reward"
        >
          <template slot-scope="{ row, index }" slot="edit">
            <Button
              class="btns"
              :disabled="row.userId!==userId"
              type="primary"
              @click="revoke(row)"
            >申请销分</Button>
            <Button class="btns" type="error" @click="del(row)" v-if="permission.delete">删除</Button>
            <Button class="btns" @click="showDetailModal(row.id)">详情</Button>
          </template>
          <div slot="footer">
            <span style="margin-left:18px">总分：{{detailHeader.totalScore}}</span>
          </div>
        </Table>
        <Modal
          v-model="showApply"
          :mask-closable="false"
          title="申请销分"
          @on-ok="applyRevoke()"
          :loading="loading"
        >
          <revoke
            :key="revokeId"
            ref="revoke"
            :revokeId="revokeId"
            :incumbencyTbUser="incumbencyTbUser"
          ></revoke>
        </Modal>
        <Modal v-model="showDetail" :mask-closable="false" title="查看详情">
          <rewardDetail ref="rewardDetail" :rewardDetailId="rewardDetailId"></rewardDetail>
        </Modal>
        <div class="clearfix">
          <Button type="error" class="btns" @click="delMore" v-if="permission.delete">批量删除</Button>
          <Page
            :total="detailHeader.totalCount"
            :page-size="detailHeader.pageSize"
            :current="detailHeader.currPage"
            size="small"
            show-total
            show-sizer
            show-elevator
            @on-change="(currPage)=>{detailHeader.currPage=currPage;detailSearch()}"
            @on-page-size-change="(pageSize)=>{detailHeader.pageSize=pageSize;detailSearch()}"
            style="float:right;"
          />
        </div>
      </TabPane>
      <TabPane label="奖惩统计" name="total">
        <totalReward v-if="tabsType==='total'" :showSelect="showSelect"></totalReward>
      </TabPane>
    </Tabs>
  </div>
</template>
<script>
import moment from 'moment'
import { baseUrl } from '@/api/base.js'
import totalReward from './totalReward.vue'
import addReward from './addReward.vue'
import revoke from './revoke.vue'
import rewardDetail from './rewardDetail'
export default {
  name: 'reward',
  components: {
    totalReward,
    addReward,
    revoke,
    rewardDetail
  },
  data () {
    return {
      baseUrl: baseUrl,
      loading: true, // Modal开启loading状态
      showSelect: false, // 奖惩详情的搜索
      showAdd: false, // 新增奖惩的展示框
      showApply: false, // 消分申请的展示框
      showDetail: false, // 奖惩详情的展示框
      tabsType: 'detail',
      checked: [],
      revokeId: 0,
      rewardDetailId: '',
      incumbencyTbUser: [], // 在职人员列表
      // 详情页的搜索表头
      detailHeader: {
        entryUserId: '', // 录入人
        timeSort: '', // 排序1近到远，2远到近
        totalCount: 1,
        pageSize: 20,
        currPage: 1,
        initiationType: '', // 发起类型
        initiatorId: '', // 发起人id
        fuzzyCondition: '', // 模糊搜索条件
        timeRange: [null, null], // 时间范围
        totalScore: '',
        userId: '', // 当事人id
        reason: '' // 理由
      },
      // 详情页的表格表头
      detailTableHeader: [
        { type: 'selection', width: 60 },
        { title: '序号', type: 'index', width: 60, align: 'center' },
        {
          title: '时间',
          key: 'rewardTime',
          width: 100,
          sortable: 'custom',
          align: 'center',
          renderHeader: (h, params) => {
            return (
              <span>
                <Poptip placement="bottom">
                  <span class="pointer">
                    <Icon type="md-search" size="14" class={this.detailHeader.timeRange[1] ? 'on' : ''} />
                    {params.column.title}
                  </span>
                  <div slot="content">
                    <div>
                      <DatePicker
                        v-on: on-ok={() => {
                          this.detailSearch()
                        }}
                        type="daterange"
                        v-model={this.detailHeader.timeRange}
                        confirm
                        placement="bottom-start"
                        placeholder="输入时间"
                      />
                    </div>
                  </div>
                </Poptip>
              </span>
            )
          }
        },
        {
          title: '当事人',
          key: 'nickName',
          width: 100,
          align: 'center',
          renderHeader: (h, params) => {
            return (
              <Poptip placement="bottom">
                <span class="pointer">
                  <Icon type="md-search" size="14" class={this.detailHeader.userId ? 'on' : ''} />
                  {params.column.title}
                </span>
                <Select
                  slot="content"
                  filterable
                  clearable
                  v-on: on-change={() => {
                    this.detailSearch()
                  }}
                  v-model={this.detailHeader.userId}
                >
                  {this.incumbencyTbUser.map(person => {
                    return <Option value={person.id}>{person.nickname}</Option>
                  })}
                </Select>
              </Poptip >
            )
          }
        },
        {
          title: '类型',
          key: 'initiationDetailed',
          width: 130,
          align: 'center',
          renderHeader: (h, params) => {
            return (
              <Poptip placement="bottom">
                <span class="pointer">
                  <Icon type="md-search" size="14" class={this.detailHeader.initiationType ? 'on' : ''} />
                  {params.column.title}
                </span>
                <Select
                  slot="content"
                  clearable
                  v-on: on-change={() => {
                    this.detailSearch()
                  }}
                  v-model={this.detailHeader.initiationType}
                >
                  {this.initiationTypeList.map(item => {
                    return <Option value={item.id}>{item.name}</Option>
                  })}
                </Select>
              </Poptip >
            )
          }
        },
        {
          title: '事项',
          minWidth: 600,
          key: 'reason',
          tooltip: true,
          align: 'center',
          renderHeader: (h, params) => {
            return (
              <Poptip placement="bottom">
                <span class="pointer">
                  <Icon type="md-search" size="14" class={this.detailHeader.reason ? 'on' : ''} />
                  {params.column.title}
                </span>
                <Input
                  clearable
                  slot="content"
                  search
                  v-on: on-search={() => {
                    this.detailSearch()
                  }}
                  v-model={this.detailHeader.reason}
                />
              </Poptip>
            )
          }
        },
        {
          title: '分数',
          key: 'score',
          width: 100,
          align: 'center'
        },
        {
          title: '发起人',
          key: 'initiatorName',
          width: 120,
          searchKey: 'initiatorId',
          align: 'center',
          renderHeader: (h, params) => {
            return (
              <Poptip placement="bottom">
                <span class="pointer">
                  <Icon type="md-search" size="14" class={this.detailHeader.initiatorId ? 'on' : ''} />
                  {params.column.title}
                </span>
                <Select
                  slot="content"
                  filterable
                  clearable
                  v-on: on-change={() => {
                    this.detailSearch()
                  }}
                  v-model={this.detailHeader.initiatorId}
                >
                  {this.incumbencyTbUser.map(person => {
                    return (
                      <Option v-model={person.id}>{person.nickname}</Option>
                    )
                  })}
                </Select>
              </Poptip >
            )
          }
        },
        { title: '操作', slot: 'edit', width: 280 }
      ],
      // 详情页的表格内容体格式
      detailContent: [],
      // 奖惩类型的列表
      initiationTypeList: [
        { id: 0, name: '全部' },
        { id: 2, name: '日常奖惩' },
        { id: 3, name: '日报扣分' },
        { id: 4, name: '晨会纪要扣分' },
        { id: 5, name: '面谈扣分' }
      ]
    }
  },
  mounted () {
    this.pageInit()
    this.detailSearch()
    this.getIncumbencyTbUser()
  },
  methods: {
    selectChange (rows) {
      this.checked = rows.map(e => {
        return e.id
      })
    },

    showDetailModal (id) {
      this.showDetail = true
      this.rewardDetailId = id
    },
    // 申请销分
    revoke (row) {
      this.revokeId = row.id
      this.canRevoke(this.revokeId)
    },
    // 是否存在正在销分，不能销分
    canRevoke (rid) {
      this.$axios({
        url: baseUrl + '/reward/getEliminateStatus',
        method: 'post',
        data: $qs.stringify({ rid: rid })
      }).then(res => {
        if (res.data.code === 10001) {
          this.showApply = true
        } else {
          this.$Message.error(res.data.msg)
        }
      }).catch(err => {
        console.log(err.data)
      })
    },
    // 销分
    applyRevoke () {
      let data = this.$refs.revoke.revokeData
      let revokeForm = this.$refs.revoke.$refs.revokeForm
      revokeForm.validate(valid => {
        if (valid) {
          this.$axios({
            url: baseUrl + '/reward/rewardEliminate',
            method: 'post',
            data: $qs.stringify(data, { arrayFormat: 'repeat' })
          })
            .then(res => {
              this.$Message.success(res.data.msg)
              this.showApply = false
            })
            .catch(err => {
              console.log('applyRevoke', err)
            })
        } else {
          this.$Message.error('有必填项未填')
        }
        this.loading = false
        this.$nextTick(() => {
          this.loading = true
        })
      })
    },
    // 搜索
    detailSearch () {
      let {
        userId,
        initiationType,
        initiatorId,
        reason,
        timeSort,
        fuzzyCondition,
        pageSize,
        currPage,
        timeRange
      } = this.detailHeader
      let sendData = {}
      // 如果有模糊搜索，清空表头内容
      if (fuzzyCondition) {
        sendData.fuzzyCondition = fuzzyCondition
        this.clearSearchHeader(fuzzyCondition)
      } else {
        // 发送表头搜索内容
        sendData = {
          userId,
          initiationType,
          initiatorId,
          reason,
          timeSort
        }
        if (timeRange[0]) {
          sendData.startTime = moment(timeRange[0]).format('YYYY-MM-DD')
          sendData.endTime = moment(timeRange[1]).format('YYYY-MM-DD')
        }
      }
      sendData.pageSize = pageSize
      sendData.currPage = currPage
      this.$axios({
        url: baseUrl + '/reward/getRewardsByDTO',
        method: 'post',
        data: $qs.stringify(sendData)
      })
        .then(res => {
          // 查无数据
          if (res.data.code === 10001) {
            this.detailHeader.totalCount = 0
            this.detailHeader.currPage = 1
            this.detailHeader.totalScore = 0
            this.detailContent = []
            return
          }
          let data = res.data.content
          let { totalCount, pageSize, currPage, totalScore } = data
          this.detailHeader.totalCount = totalCount
          this.detailHeader.pageSize = pageSize
          this.detailHeader.currPage = currPage
          this.detailHeader.totalScore = totalScore
          this.detailContent = data.pageContent
        })
        .catch(err => {
          console.log(err)
        })
    },
    sortChange (column) {
      // 降序  "desc"
      // let orderby = column.key
      let desc = column.order
      if (desc === 'desc') {
        this.detailHeader.timeSort = '1'
      } else if (desc === 'asc') {
        this.detailHeader.timeSort = '2'
      } else {
        this.detailHeader.timeSort = ''
      }
      this.detailSearch()
    },
    // 删除
    del (row) {
      let id = [row.id]
      this.$Modal.confirm({
        title: '删除吗?',
        onOk: () => {
          this.$axios({
            url: baseUrl + '/reward/deleteReward',
            method: 'post',
            data: id
          })
            .then(res => {
              if (res.data.code === 10000) {
                this.$Message.success(res.data.msg)
                this.detailSearch()
              } else {
                this.$Message.error(res.data.msg)
              }
            })
            .catch(err => {
              console.log(err)
            })
        }
      })
    },
    // 批量删除
    delMore () {
      let ids = this.checked
      if (ids.length === 0) {
        this.$Message.error('未选择')
        return
      }
      this.$Modal.confirm({
        title: '删除吗?',
        onOk: () => {
          this.$axios({
            url: baseUrl + '/reward/deleteReward',
            method: 'post',
            data: ids
          })
            .then(res => {
              if (res.data.code === 10000) {
                this.$Message.success(res.data.msg)
                this.detailSearch()
              } else {
                this.$Message.error(res.data.msg)
              }
            })
            .catch(err => {
              console.log(err)
            })
        }
      })
    },
    shake () {
      $('#app').toggleClass('shake')
      setTimeout(() => {
        $('#app').toggleClass('shake')
      }, 1000)
    },
    // 新增奖惩验证表单
    handleValidate () {
      let addRewordForm = this.$refs.addReword.$refs.addRewordForm
      let me = this
      addRewordForm.validate(valid => {
        if (valid) {
          me.handleAddReword()
        } else {
          this.$Message.error('有必填项未填')
          this.loading = false
          this.$nextTick(() => {
            this.loading = true
          })
        }
      })
    },
    // 新增奖惩
    handleAddReword () {
      let data = this.$refs.addReword.addReword
      data.rewardDate = moment(data.rewardDate).format('YYYY-MM-DD')
      this.$axios({
        url: baseUrl + '/reward/rewardInsert',
        method: 'post',
        data: data
      })
        .then(res => {
          this.loading = false // 确认框先取消loading
          if (res.data.code === 10000) {
            this.$Message.success(res.data.msg)
            this.detailSearch()
          } else {
            this.$Message.error(res.data.msg)
          }
          this.$nextTick(() => {
            this.loading = true
          })
        })
        .catch(err => {
          console.error(err)
        })
      this.showAdd = false
    },
    // 获取在职转正人员
    getIncumbencyTbUser () {
      this.$axios({
        url: baseUrl + '/user/getIncumbencyTbUser',
        method: 'post'
      })
        .then(res => {
          if (res.data.code === 10000) {
            this.incumbencyTbUser = res.data.content
          } else {
            this.$Message.error(res.data.msg)
          }
        })
        .catch(err => {
          console.error(err)
        })
    },
    // 页面初始化
    pageInit () {
      // 初始化录入人为当前登录用户
      this.detailHeader.entryUserId = this.userId
      this.detailHeader.userId = this.userId
    },
    uploadSuccess (res) {
      if (res.code === 10000) {
        this.$Message.success(res.msg)
        this.detailSearch()
      } else {
        this.$Message.error(res.msg)
      }
    },
    // 清空表头搜索
    clearSearchHeader (fuzzyCondition) {
      let { totalCount, pageSize, currPage, totalScore } = this.detailHeader
      this.detailHeader = {
        entryUserId: this.userId, // 录入人
        timeSort: '', // 排序1近到远，2远到近
        totalCount,
        pageSize,
        currPage,
        totalScore,
        initiationType: '', // 发起类型
        initiatorId: '', // 发起人id
        fuzzyCondition: fuzzyCondition, // 模糊搜索条件
        timeRange: [null, null], // 时间范围
        userId: this.userId, // 当事人id
        reason: '' // 理由
      }
    },
    reload () {
      this.clearSearchHeader()
      this.detailSearch()
    }
  },
  computed: {
    userId () {
      return this.$store.state.user.userId
    },
    permission () {
      /**
       * create: false, // 新增按钮权限
         import: false, // 导入按钮权限
         delete: false, // 删除按钮权限
       */
      return this.$store.state.user.userpermission.reward
    }
  }
}
</script>
