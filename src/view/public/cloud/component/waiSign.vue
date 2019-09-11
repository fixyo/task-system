<template>
<div>
    <!--表头搜搜-->
    <div style="top:0px;margin-bottom:10px;float: right;">
        <div style="display: inline;">
            <Input v-model="waitSignDetailHeader.text"  style="width: 170px;" placeholder="搜索公司名称" search  class="searInput"  @on-search="getWaitSignListData()" ></Input>
            <Button class="reload" icon="ios-loading" @click="reloadPage"></Button>
        </div>
    </div>
    <div style="clear:both"></div>
    <Table border :columns="waitSignTableHeader" :data="waitSignTableContent" :loading="loading">
        <template slot-scope="{ row, index }" slot="action">
            <Button type="primary" style="margin-right: 5px" @click="editUnsign(row)">编辑</Button>
            <Button type="error"  style="margin-right: 5px"  @click="deleteModalOpen(row)">删除</Button>
        </template>
    </Table>
    <!--删除已到期合同 弹出框-->
    <Modal class="modalCancel" v-model="deleteModal" title="提醒" @on-ok="deletContract()">
        <p>是否确认删除？</p>
    </Modal>
    <Page
        :total="waitSignDetailHeader.totalCount"
        :page-size="waitSignDetailHeader.pageSize"
        :current="waitSignDetailHeader.currPage"
        size="small"
        show-total
        show-sizer
        show-elevator
        @on-change="(currPage)=>{waitSignDetailHeader.currPage=currPage;getWaitSignListData()}"
        @on-page-size-change="(pageSize)=>{waitSignDetailHeader.pageSize=pageSize;getWaitSignListData()}"
        style="float:right;color: #19aa8d;"
    />
</div>
</template>

<script>
import { baseUrl } from '@/api/base.js'
export default {
  name: 'waitSign',
  data () {
    return {
      loading: false,
      deleteModal: false,
      modalCard: '',
      waitSignDetailHeader: {
        text: '', // 公司名称
        contractType: '', // 合同类型id
        contractTypeName: '', // 合同类型
        contractTypeNameList: [{
          id: '1',
          name: '付款合同'
        }, {
          id: '2',
          name: '收款合同'
        }, {
          id: '3',
          name: '全部'
        }], // 合同类型列表
        myCompanyName: '', // 我方公司
        otherCompanyName: '', // 对方公司
        signerName: '', // 签订人
        totalCount: 0,
        pageSize: 20,
        currPage: 1

      },
      waitSignTableHeader: [
        {
          title: '序号',
          key: 'index',
          width: 70,
          type: 'index',
          align: 'center'
        }, {
          title: '合同类型',
          //   width: 110,
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
                  v-model={this.waitSignDetailHeader.contractType}
                >
                  {(this.waitSignDetailHeader.contractTypeNameList || []).map(item => {
                    return <Option value={item.id}>{item.name}</Option>
                  })}
                </Select>
                <Button type="primary" icon="md-search" slot="content" v-on:click={() => { this.getWaitSignListData() }}></Button>
                <Button icon="md-close" slot="content" v-on:click={() => { this.waitSignDetailHeader.contractType = '' }}></Button>
              </Poptip>
            )
          }
        }, {
          title: '我方公司',
          key: 'myCompanyName',
          align: 'center'
        }, {
          title: '对方公司/姓名',
          key: 'otherCompanyName',
          align: 'center'
        },
        {
          title: '签订人',
          key: 'signerName',
          align: 'center'
        }, {
          title: '操作',
          slot: 'action',
          key: 'action',
          align: 'center'
        }
      ],
      waitSignTableContent: []
    }
  },
  mounted () {
    this.getWaitSignListData()
  },
  methods: {
    getWaitSignListData () {
      let _w = this.waitSignDetailHeader
      let sendData = {
        text: _w.text,
        contractType: _w.contractType,
        pageSize: _w.pageSize,
        currPage: _w.currPage
      }
      this.$axios({
        url: baseUrl + '/contract/labTwo',
        method: 'post',
        data: $qs.stringify(sendData)
      }).then(res => {
        // 查无数据
        if (res.data.code === 10001) {
          let _self = this.waitSignDetailHeader
          this.waitSignTableContent = []
          _self.totalCount = 0
          _self.pageSize = 20
          _self.currPage = 1
        } else if (res.data.code === 10000) {
          let _self = this.waitSignDetailHeader
          this.waitSignTableContent = res.data.content.pageContent
          _self.totalCount = res.data.content.totalCount
          _self.pageSize = res.data.content.pageSize
          _self.currPage = res.data.content.currPage
          this.loading = false
        } else {
          this.$Message.error(res.data.msg)
        }
      }).catch(err => {
        console.error(err)
      })
    },
    // 编辑待签订合同
    editUnsign (row) {
      if (row.contractType === 1) {
        // 如果是收款
        this.$router.push({
          name: 'editUnsign',
          query: {
            id: row.id
          }
        })
      } else if (row.contractType === 2) {
        // 如果是付款
        this.$router.push({
          name: 'payEditUnsign',
          query: {
            id: row.id
          }
        })
      }
    },
    // 打开删除合同弹窗
    deleteModalOpen (row) {
      this.modalCard = row.card
      this.cardId = row.id
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
      }).then(res => {
        if (res.data.code === 10000) {
          this.getWaitSignListData()
        } else {
          this.$Message.error(res.data.msg)
        }
      }).catch(err => {
        console.error(err)
      })
    },
    // 清除搜索条件
    clearSearchHeader (text) {
      this.waitSignDetailHeader = {
        myCompanyName: '', // 我方公司
        otherCompanyName: '', // 对方公司
        signerName: '', // 签订人name
        contractType: '', // 合同类型id
        text: text
      }
    },
    reloadPage () {
      this.clearSearchHeader()
      this.getWaitSignListData()
    }
  }
}
</script>

<style lang="less" scoped>
.actionDiv{
    margin-bottom:10px;
    .searInput{
        width:150px;
    }
}
p{
    display:inline;
}

</style>
