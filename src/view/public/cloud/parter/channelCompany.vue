<template>
<!--渠道公司-->
<div class="cloudCooper">
    <Tabs value="2" tab="outTable" @on-click="handleClick" :animated="false">
        <TabPane label="产品公司" name="1">
        </TabPane>
        <TabPane label="渠道公司" name="2">
            <Tabs value="1_1" tab="innerTable" type="card" :animated="false">
                <TabPane label="渠道公司" name="1_1">
                    <div class="actionDiv">
                        <Button type="primary" @click="addChannel()">新增</Button>
                        <div class="searchInput" style="top:0px">
                            <Input v-model="headerSearch.text"  placeholder="搜索公司名" search  class="searInput"  @on-search="getListData()" ></Input>
                            <Button class="reload" icon="ios-loading" @click="reloadPage"></Button>
                        </div>
                    </div>
                    <Table :loading="loading" :columns="channelHeader" :data="channelContent" border class="channelTable">
                        <template slot-scope="{ row, index }" slot="action">
                            <Button type="primary" size="small" class="space" @click="editChannel(row)">编辑</Button>
                            <Button class="simple" size="small" @click="detailChannel(row)">详情</Button>
                        </template>
                    </Table>
                    <Page
                        :total="headerSearch.totalCount"
                        :page-size="headerSearch.pageSize"
                        :current="headerSearch.currPage"
                        size="small"
                        show-total
                        show-sizer
                        show-elevator
                        @on-change="(currPage)=>{headerSearch.currPage=currPage;getListData()}"
                        @on-page-size-change="(pageSize)=>{headerSearch.pageSize=pageSize;getListData()}"
                        style="float:right;color: #19aa8d;"
                    />
                </TabPane>
            </Tabs>
        </TabPane>
        <TabPane label="合同库" name="3">
        </TabPane>
        <TabPane label="产品库" name="4">
        </TabPane>
        <TabPane label="产品链接库" name="5">
        </TabPane>
        <TabPane label="待审核信息" name="6">
        </TabPane>
    </Tabs>
</div>
</template>

<script>
import { baseUrl } from '@/api/base.js'
export default {
  name: 'channelCompany',
  data () {
    return {
      loading: true, // 表格数据加载
      // 在职人员
      incumbencyTbUser: [],
      // 表头搜索
      headerSearch: {
        text: '', // 全局搜索公司
        channelName: '', // 公司名称姓名
        businessUName: '', // 市场名称
        businessName: '', // 类别
        tle: '', // 联系电话
        contractStatusName: '', // 合同状态
        totalCount: 0,
        pageSize: 20,
        currPage: 1
      },
      // 渠道公司表头
      channelHeader: [{
        title: '序号',
        type: 'index',
        align: 'center',
        width: 70
      }, {
        title: '公司名称/姓名',
        key: 'channelName',
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
                placeholder="输入公司名称/姓名"
                v-model={this.headerSearch.channelName}
                v-on:on-search={() => { this.getListData() }}
              />
              <Button type="primary" icon="md-search" slot="content" v-on:click={() => { this.getListData() }}></Button>
              <Button icon="md-close" slot="content" v-on:click={() => { this.headerSearch.channelName = '' }}></Button>
            </Poptip>
          )
        }
      }, {
        title: '市场',
        key: 'businessUName',
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
                filterable
                placeholder="请选择市场"
                style="width:130px;height:33px"
                v-on: on-change={() => {}}
                v-model={this.headerSearch.businessUID}
              >
                {(this.incumbencyTbUser || []).map(person => {
                  return <Option value={person.id}>{person.nickname}</Option>
                })}
              </Select>
              <Button type="primary" icon="md-search" slot="content" v-on:click={() => { this.getListData() }}></Button>
              <Button icon="md-close" slot="content" v-on:click={() => { this.headerSearch.businessUID = '' }}></Button>
            </Poptip>
          )
        }
      }, {
        title: '类别',
        key: 'businessName',
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
                placeholder="输入类别"
                v-model={this.headerSearch.businessName}
                v-on:on-search={() => { this.getListData() }}
              />
              <Button type="primary" icon="md-search" slot="content" v-on:click={() => { this.getListData() }}></Button>
              <Button icon="md-close" slot="content" v-on:click={() => { this.headerSearch.businessName = '' }}></Button>
            </Poptip>
          )
        }
      }, {
        title: '联系电话',
        key: 'tle',
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
                placeholder="输入联系电话"
                v-model={this.headerSearch.tle}
                v-on:on-search={() => { this.getListData() }}
              />
              <Button type="primary" icon="md-search" slot="content" v-on:click={() => { this.getListData() }}></Button>
              <Button icon="md-close" slot="content" v-on:click={() => { this.headerSearch.tle = '' }}></Button>
            </Poptip>
          )
        }
      }, {
        title: '合同状态',
        key: 'contractStatusName',
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
                placeholder="输入合同状态"
                v-model={this.headerSearch.contractStatusName}
                v-on:on-search={() => { this.getListData() }}
              />
              <Button type="primary" icon="md-search" slot="content" v-on:click={() => { this.getListData() }}></Button>
              <Button icon="md-close" slot="content" v-on:click={() => { this.headerSearch.contractStatusName = '' }}></Button>
            </Poptip>
          )
        }
      }, {
        title: '操作',
        slot: 'action',
        align: 'center'
      }
      ],
      // 产品公司表格数据
      channelContent: []
    }
  },
  mounted () {
    this.getListData()
  },
  methods: {
    handleClick (name) {
      switch (name) {
        case '1':
          this.$router.push({
            name: 'productCompany'
          })
          break
        case '2':
          this.$router.push({
            name: 'channelCompany'
          })
          break
        case '3':
          this.$router.push({
            name: 'contractBank'
          })
          break
        case '4':
          this.$router.push({
            name: 'productBank'
          })
          break
        case '5':
          this.$router.push({
            name: 'productLink'
          })
          break
        case '6':
          this.$router.push({
            name: 'toAuditInform'
          })
          break
      }
    },
    getData () {
      // 在职人员
      this.$axios({
        url: baseUrl + '/user/getIncumbencyTbUser',
        method: 'post'
      }).then(res => {
        if (res.data.code === 10000) {
          this.incumbencyTbUser = res.data.content
        } else {
          this.$Message.error(res.data.msg)
        }
      }).catch(err => {
        console.error(err)
      })
    },
    // 列表数据 搜索 分页
    getListData () {
      this.getData()
      // 列表数据
      let {
        channelName,
        businessUName,
        businessUID,
        businessName,
        contractStatusName,
        tle,
        text,
        pageSize,
        currPage
      } = this.headerSearch
      let sendData = {}
      // 如果有模糊搜索，清空表头内容
      if (text) {
        sendData.text = text
        this.clearSearchHeader(text)
      } else {
        // 发送表头搜索内容
        sendData = {
          channelName,
          businessUName,
          businessUID,
          businessName,
          contractStatusName,
          tle
        }
      }
      sendData.pageSize = pageSize
      sendData.currPage = currPage
      this.$axios({
        url: baseUrl + '/productChannel/find',
        method: 'post',
        data: $qs.stringify(sendData)
      }).then(res => {
        // 查无数据
        if (res.data.code === 10001) {
          let _self = this.headerSearch
          this.channelContent = []
          _self.totalCount = 0
          _self.pageSize = 20
          _self.currPage = 1
        } else if (res.data.code === 10000) {
          let _self = this.headerSearch
          this.channelContent = res.data.content.pageContent
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
    clearSearchHeader (text) {
      this.headerSearch = {
        channelName: '', // 公司名称姓名
        businessUName: '', // 市场名称
        businessName: '', // 类别
        tle: '', // 联系电话
        contractStatusName: '', // 合同状态
        text: text
      }
    },
    // 重载页面 清空所有所有条件 获取最新数据
    reloadPage () {
      this.clearSearchHeader()
      this.getListData()
    },
    // 新增渠道公司
    addChannel () {
      this.$router.push({
        name: 'addChannle'
      })
    },
    // 编辑渠道公司
    editChannel (row) {
      this.$router.push({
        name: 'editChannel',
        query: {
          productChannelId: row.productChannelId
        }
      })
    },
    // 渠道公司详情
    detailChannel (row) {
      if (row.contractType === 1) {
        // 如果是收款
        this.$router.push({
          name: 'detailChannel',
          query: {
            productChannelId: row.productChannelId
          }
        })
      } else if (row.contractType === 2) {
        // 如果是付款
        this.$router.push({
          name: 'payDetailChannel',
          query: {
            productChannelId: row.productChannelId
          }
        })
      } else {
        this.$router.push({
          name: 'detailChannel',
          query: {
            productChannelId: row.productChannelId
          }
        })
      }
    }
  }
}
</script>

<style lang="less" scoped>
.channelTable{
    .space{
        margin-right: 5px;
    }
}
.actionDiv{
    margin-bottom:10px;
    .searInput{
        width:200px;
    }
}
</style>
