<template>
<div>
  <div>
    <div class="actionDiv">
      <Poptip class="addCtract" placement="bottom" content="content" style="left: 1px;">
        <Button type="primary">新增</Button>
        <div slot="content">
          <div class="title">我方拟定：</div>
          <div class="choose" @click="addIncome()">收款合同</div>
          <div class="choose" @click="addPayment()">付款合同</div>
          <div class="title">对方拟定：</div>
          <div class="choose" @click="otherAddIncome()">收款合同</div>
          <div class="choose" @click="otherAddPayment()">付款合同</div>
        </div>
      </Poptip>
      <div style="top:0px;float: right;">
        <div style="display: inline;">
          <Input
            v-model="detailHeader.text"
            placeholder="搜索公司名称"
            search
            class="searInput"
            @on-search="getListData()"
          ></Input>
          <Button class="reload" icon="ios-loading" @click="reloadPage"></Button>
          <TableHeaderSetting
            :totalTableHeader="totalTableHeader"
            :tableHeader.sync="tableHeader"
            key="cloudDayList"
            :defaultList="defaultList"
            localKey="cloudDayList"
            style="display: inline;"
          ></TableHeaderSetting>
        </div>
      </div>
    </div>
    <div style="clear:both"></div>
    <!-- 表 -->
    <Table
      :row-class-name="rowClassName"
      border
      :columns="tableHeader"
      :data="tableContent"
      :loading="loading"
    >
      <template slot-scope="{ row, index }" slot="action">
        <Button
          v-if="row.contractStatus === '合同期'"
          type="primary"
          size="small"
          @click="supplement(row)"
          style="margin-right: 5px"
        >补充协议</Button>
        <Button
          v-if="row.contractStatus === '合同期'"
          type="error"
          @click="stopModalOpen(row)"
          size="small"
          style="margin-right: 5px"
        >终止</Button>
        <Button
          v-if="row.contractStatus === '到期'"
          @click="deleteModalOpen(row)"
          type="error"
          size="small"
          style="margin-right: 5px"
        >删除</Button>
        <Button
          class="simple"
          size="small"
          style="margin-right: 5px"
          @click="getDetailContract(row)"
        >详情</Button>
      </template>
    </Table>
  </div>
</Table>
<!--终止合同 弹出框-->
<Modal class="modalCancel" v-model="stopModal" title="提醒" @on-ok="stopContract()">
    <p>编码为</p>{{modalCard}}<p>的合同未到期，是否确认终止合同？</p>
</Modal>
<!--删除已到期合同 弹出框-->
<Modal class="modalCancel" v-model="deleteModal" title="提醒" @on-ok="deletContract()">
    <p>编码为</p>{{modalCard}}<p>的合同已到期，是否确认删除？</p>
</Modal>
<Page
    :total="detailHeader.totalCount"
    :page-size="detailHeader.pageSize"
    :current="detailHeader.currPage"
    size="small"
    show-total
    show-sizer
    show-elevator
    @on-change="(currPage)=>{detailHeader.currPage=currPage;getListData()}"
    @on-page-size-change="(pageSize)=>{detailHeader.pageSize=pageSize;getListData()}"
    style="float:right;color: #19aa8d;"
/>
</div>
</div>
</template>

<script>
import TableHeaderSetting from '_c/table-header-setting'
import { baseUrl } from '@/api/base.js'
import moment from 'moment'
export default {
  name: 'signed',
  components: {
    TableHeaderSetting
  },
  data () {
    return {
      cardId: '', // 删除的当前合同id
      modalCard: '', // 删除弹窗里的显示当前删除的编码
      loading: false, // 表格加载
      stopModal: false, // 终止合同
      deleteModal: false, // 删除到期合同弹出框
      detailHeader: {
        text: '', // 表格外模糊搜索
        contractData: '', // 录入日期
        signTime: '', // 签订日期
        endTime: '', // 到期时间
        contractStatus: '', // 合同状态id
        contractStatusName: '', // 合同状态name
        contractStatusList: [
          {
            id: '1',
            name: '合同期'
          },
          {
            id: '2',
            name: '到期'
          },
          {
            id: '3',
            name: '全部'
          }
        ],
        contractType: '', // 合同类型id
        contractTypeName: '', // 合同类型name
        contractTypeNameList: [
          {
            id: '1',
            name: '付款合同'
          },
          {
            id: '2',
            name: '收款合同'
          },
          {
            id: '3',
            name: '全部'
          }
        ], // 合同类型列表
        signerName: '', // 签订人name
        myCompanyName: '', // 我方公司
        otherCompanyName: '', // 对方公司
        card: '', // 合同编码
        totalCount: 0,
        pageSize: 20,
        currPage: 1
      },
      tableHeader: [],
      defaultList: [
        'index',
        'contractData',
        'signTime',
        'endTime',
        'contractStatus',
        'contractType',
        'signerName',
        'myCompanyName',
        'otherCompanyName',
        'card'
      ],
      totalTableHeader: [
        {
          title: '序号',
          key: 'index',
          width: 70,
          type: 'index',
          align: 'center',
          alwaysShow: true
        },
        {
          title: '录入时间',
          key: 'contractData',
          sortable: true,
          align: 'center',
          renderHeader: (h, params) => {
            return (
              <Poptip placement="bottom">
                <span class="pointer">
                  {params.column.title}
                  <i class="ivu-icon ivu-icon-ios-search" />
                </span>
                <DatePicker
                  format="yyyy-MM-dd"
                  slot="content"
                  v-model={this.detailHeader.contractData}
                  type="date"
                  placeholder="选择期限"
                  style="width: 130px"
                ></DatePicker>
                <Button
                  type="primary"
                  icon="md-search"
                  slot="content"
                  v-on:click={() => {
                    this.getListData()
                  }}
                ></Button>
                <Button
                  icon="md-close"
                  slot="content"
                  v-on:click={() => {
                    this.detailHeader.contractData = ''
                  }}
                ></Button>
              </Poptip>
            )
          }
        },
        {
          title: '签订日期',
          key: 'startTime',
          sortable: true,
          align: 'center',
          renderHeader: (h, params) => {
            return (
              <Poptip placement="bottom">
                <span class="pointer">
                  {params.column.title}
                  <i class="ivu-icon ivu-icon-ios-search" />
                </span>
                <DatePicker
                  format="yyyy-MM-dd"
                  slot="content"
                  v-model={this.detailHeader.signTime}
                  type="date"
                  placeholder="选择日期"
                  style="width: 130px"
                ></DatePicker>
                <Button
                  type="primary"
                  icon="md-search"
                  slot="content"
                  v-on:click={() => {
                    this.getListData()
                  }}
                ></Button>
                <Button
                  icon="md-close"
                  slot="content"
                  v-on:click={() => {
                    this.detailHeader.signTime = ''
                  }}
                ></Button>
              </Poptip>
            )
          }
        },
        {
          title: '到期时间',
          key: 'endTime',
          align: 'center',
          renderHeader: (h, params) => {
            return (
              <Poptip placement="bottom">
                <span class="pointer">
                  {params.column.title}
                  <i class="ivu-icon ivu-icon-ios-search" />
                </span>
                <DatePicker
                  format="yyyy-MM-dd"
                  slot="content"
                  v-model={this.detailHeader.endTime}
                  type="date"
                  placeholder="选择期限"
                  style="width: 130px"
                ></DatePicker>
                <Button
                  type="primary"
                  icon="md-search"
                  slot="content"
                  v-on:click={() => {
                    this.getListData()
                  }}
                ></Button>
                <Button
                  icon="md-close"
                  slot="content"
                  v-on:click={() => {
                    this.detailHeader.endTime = ''
                  }}
                ></Button>
              </Poptip>
            )
          }
        },
        {
          title: '合同状态',
          key: 'contractStatus',
          align: 'center',
          renderHeader: (h, params) => {
            return (
              <Poptip placement="bottom">
                <span class="pointer">
                  {params.column.title}
                  <i class="ivu-icon ivu-icon-ios-search" />
                </span>
                <Select
                  slot="content"
                  clearable
                  placeholder="选择合同状态"
                  style="width:130px"
                  v-on:on-change={() => {}}
                  v-model={this.detailHeader.contractStatus}
                >
                  {(this.detailHeader.contractStatusList || []).map(item => {
                    return <Option value={item.name}>{item.name}</Option>
                  })}
                </Select>
                <Button
                  type="primary"
                  icon="md-search"
                  slot="content"
                  v-on:click={() => {
                    this.getListData()
                  }}
                ></Button>
                <Button
                  icon="md-close"
                  slot="content"
                  v-on:click={() => {
                    this.detailHeader.contractStatus = ''
                  }}
                ></Button>
              </Poptip>
            )
          }
        },
        {
          title: '合同类型',
          key: 'contractTypeName',
          align: 'center',
          renderHeader: (h, params) => {
            return (
              <Poptip placement="bottom">
                <span class="pointer">
                  {params.column.title}
                  <i class="ivu-icon ivu-icon-ios-search" />
                </span>
                <Select
                  slot="content"
                  clearable
                  placeholder="选择合同类型"
                  style="width:130px"
                  v-on:on-change={() => {}}
                  v-model={this.detailHeader.contractTypeName}
                >
                  {(this.detailHeader.contractTypeNameList || []).map(item => {
                    return <Option value={item.name}>{item.name}</Option>
                  })}
                </Select>
                <Button
                  type="primary"
                  icon="md-search"
                  slot="content"
                  v-on:click={() => {
                    this.getListData()
                  }}
                ></Button>
                <Button
                  icon="md-close"
                  slot="content"
                  v-on:click={() => {
                    this.detailHeader.contractType = ''
                  }}
                ></Button>
              </Poptip>
            )
          }
        },
        {
          title: '签订人',
          key: 'signerName',
          align: 'center',
          renderHeader: (h, params) => {
            return (
              <Poptip placement="bottom">
                <span class="pointer">
                  {params.column.title}
                  <i class="ivu-icon ivu-icon-ios-search" />
                </span>
                <Input
                  clearable
                  search
                  slot="content"
                  style="width:130px"
                  placeholder="输入签订人"
                  v-model={this.detailHeader.signerName}
                  v-on:on-search={() => { this.getListData() }}
                />
                <Button
                  type="primary"
                  icon="md-search"
                  slot="content"
                  v-on:click={() => {
                    this.getListData()
                  }}
                ></Button>
                <Button
                  icon="md-close"
                  slot="content"
                  v-on:click={() => {
                    this.detailHeader.signerName = ''
                  }}
                ></Button>
              </Poptip>
            )
          }
        },
        {
          title: '我方公司',
          key: 'myCompanyName',
          align: 'center'
        },
        {
          title: '对方公司/姓名',
          key: 'otherCompanyName',
          align: 'center'
        },
        {
          title: '合同编码',
          key: 'card',
          align: 'center',
          alwaysShow: true,
          renderHeader: (h, params) => {
            return (
              <Poptip placement="bottom">
                <span class="pointer">
                  {params.column.title}
                  <i class="ivu-icon ivu-icon-ios-search" />
                </span>
                <Input
                  clearable
                  search
                  slot="content"
                  style="width:130px"
                  placeholder="输入合同编码"
                  v-model={this.detailHeader.card}
                  v-on:on-search={() => { this.getListData() }}
                />
                <Button
                  type="primary"
                  icon="md-search"
                  slot="content"
                  v-on:click={() => {
                    this.getListData()
                  }}
                ></Button>
                <Button
                  icon="md-close"
                  slot="content"
                  v-on:click={() => {
                    this.detailHeader.card = ''
                  }}
                ></Button>
              </Poptip>
            )
          }
        },
        {
          title: '操作',
          slot: 'action',
          key: 'action',
          width: 210,
          align: 'center',
          alwaysShow: true
        }
      ],
      tableContent: []
    }
  },
  mounted () {
    this.getListData()
  },
  methods: {
    // 列表数据 搜索 分页
    getListData () {
      // 列表数据
      let {
        text, // 表格外模糊搜索
        myCompanyName, // 我方公司
        otherCompanyName, // 对方公司
        card, // 合同编码
        signerName, // 签订人name
        contractTypeName, // 合同类型name
        contractStatus, // 合同状态id
        contractStatusName, // 合同状态name
        contractType, // 合同类型id
        signTime, // 签订日期
        contractData, // 录入日期
        endTime, // 到期时间
        pageSize,
        currPage
      } = this.detailHeader
      let sendData = {}
      signTime = signTime ? moment(signTime).format('YYYY-MM-DD') : ''
      endTime = endTime ? moment(endTime).format('YYYY-MM-DD') : ''
      contractData = contractData
        ? moment(contractData).format('YYYY-MM-DD')
        : ''
      // 如果有模糊搜索，清空表头内容
      if (text) {
        sendData.text = text
        this.clearSearchHeader(text)
      } else {
        // 发送表头搜索内容
        sendData = {
          myCompanyName, // 我方公司
          otherCompanyName, // 对方公司
          card, // 合同编码
          signerName, // 签订人name
          contractTypeName, // 合同类型name
          contractStatus, // 合同状态id
          contractStatusName, // 合同状态name
          contractType, // 合同类型id
          signTime, // 签订日期
          contractData, // 录入日期
          endTime // 到期时间
        }
      }
      sendData.pageSize = pageSize
      sendData.currPage = currPage
      this.$axios({
        url: baseUrl + '/contract/lab',
        method: 'post',
        data: $qs.stringify(sendData)
      })
        .then(res => {
          // 查无数据
          if (res.data.code === 10001) {
            let _self = this.detailHeader
            this.tableContent = []
            _self.totalCount = 0
            _self.pageSize = 20
            _self.currPage = 1
          } else if (res.data.code === 10000) {
            let _self = this.detailHeader
            this.tableContent = res.data.content.pageContent
            _self.totalCount = res.data.content.totalCount
            _self.pageSize = res.data.content.pageSize
            _self.currPage = res.data.content.currPage
            this.loading = false
          } else {
            this.$Message.error(res.data.msg)
          }
        })
        .catch(err => {
          console.error(err)
        })
    },
    // 到期的合同行样式置灰
    rowClassName (row, index) {
      if (row.contractStatus === '到期') {
        return 'demoTableInfo'
      }
      return ''
    },
    // 我方拟定新增收款合同
    addIncome () {
      this.$router.push({
        name: 'addIncome'
      })
    },
    // 我方拟定新增付款合同
    addPayment () {
      this.$router.push({
        name: 'addPayment'
      })
    },
    // 对方拟定 新增收款合同
    otherAddIncome () {
      this.$router.push({
        name: 'otherAddIncome'
      })
    },
    // 对方拟定 新增付款合同
    otherAddPayment () {
      this.$router.push({
        name: 'otherAddPayment'
      })
    },
    // 补充协议
    supplement (row) {
      if (row.contractType === 1) {
        // 如果是收款
        this.$router.push({
          name: 'supplement',
          query: {
            id: row.id
          }
        })
      } else if (row.contractType === 2) {
        // 如果是付款
        this.$router.push({
          name: 'paySupplement',
          query: {
            id: row.id
          }
        })
      }
    },
    // 详情
    getDetailContract (row) {
      if (row.contractType === 1) {
        // 如果是收款
        this.$router.push({
          name: 'detailContract',
          query: {
            id: row.id
          }
        })
      } else if (row.contractType === 2) {
        // 如果是付款
        this.$router.push({
          name: 'payDetailContract',
          query: {
            id: row.id
          }
        })
      }
    },
    // 打开终止合同弹窗
    stopModalOpen (row) {
      this.modalCard = row.card
      this.cardId = row.id
      this.stopModal = true
    },
    // 终止合同
    stopContract () {
      let sendData = {
        cardId: this.cardId
      }
      this.$axios({
        url: baseUrl + '/contract/deleteTwo',
        method: 'post',
        data: $qs.stringify(sendData)
      })
        .then(res => {
          if (res.data.code === 10000) {
            this.getListData()
            this.$Message.info(res.data.msg)
          } else {
            this.$Message.error(res.data.msg)
          }
        })
        .catch(err => {
          console.error(err)
        })
    },
    // 打开删除合同弹窗
    deleteModalOpen (row) {
      this.modalCard = row.card
      this.cardId = row.cardId
      this.deleteModal = true
    },
    // 删除到期合同
    deletContract () {
      let sendData = {
        cardId: this.cardId
      }
      this.$axios({
        url: baseUrl + '/contract/delete',
        method: 'post',
        data: $qs.stringify(sendData)
      })
        .then(res => {
          if (res.data.code === 10000) {
            this.getListData()
          } else {
            this.$Message.error(res.data.msg)
          }
        })
        .catch(err => {
          console.error(err)
        })
    },
    // 清除搜索条件
    clearSearchHeader (text) {
      this.detailHeader = {
        myCompanyName: '', // 我方公司
        otherCompanyName: '', // 对方公司
        card: '', // 合同编码
        signerName: '', // 签订人name
        contractTypeName: '', // 合同类型name
        contractStatus: '', // 合同状态id
        contractStatusName: '', // 合同状态name
        contractType: '', // 合同类型id
        signTime: '', // 签订日期
        contractData: '', // 录入日期
        endTime: '', // 到期时间
        text: text
      }
    },
    // 清空所有搜索条件 重载页面
    reloadPage () {
      this.clearSearchHeader()
      this.getListData()
    }
  }
}
</script>

<style lang="less">
.ivu-table .demoTableInfo td {
  background-color: #f8f8f9;
}
.modalCancel {
  .ivu-modal-footer button:first-child {
    color: #19aa8d;
    background-color: #fff;
    border-color: #19aa8d;
  }
}
.addCtract {
  .ivu-poptip-content {
    width: 121px;
  }
  .ivu-poptip-popper {
    left: 1px !important;
  }
  .title {
    color: #19aa8d;
  }
  .choose {
    cursor: pointer;
    margin-left: 20px;
  }
  .choose:hover {
    color: #19aa8d;
  }
}
.ivu-tabs {
  overflow: inherit !important;
}
.ivu-table-cell{
  padding-left: 7px;
  padding-right: 7px;
}
</style>

<style lang="less" scoped>
.actionDiv {
  margin-bottom: 10px;
  .searInput {
    width: 150px;
  }
}
p {
  display: inline;
}
</style>
