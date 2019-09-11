<template>
  <!-- 这是产品链接库 -->
<div class="cloudCooper">
    <Tabs value="5" tab="outTable" @on-click="handleClick" :animated="false">
        <TabPane label="产品公司" name="1">
        </TabPane>
        <TabPane label="渠道公司" name="2">
        </TabPane>
        <TabPane label="合同库" name="3">
        </TabPane>
        <TabPane label="产品库" name="4">
        </TabPane>
        <TabPane label="产品链接库" name="5">
            <div class="content">
                <Button class="btn add" @click="addProcuctLink">新增</Button>
                <div style="float:right;margin-bottom:10px">
                    <Input
                    placeholder="搜索链接名"
                    search
                    style="width:200px;margin-right:5px;"
                    v-model="headerSearch.fuzzyCondition"
                    @on-search="getListData()"
                    />
                    <Button icon="ios-loading" style="margin-right:5px;" @click="reloadPage"></Button>
                </div>
                <div style="clear:both"></div>
                <Table id="productLinkId" border :columns="linkHeader" :data="linkContent" :loading="loading">
                    <template slot-scope="{ row }" slot="name">
                    <strong>{{ row.name }}</strong>
                    </template>
                    <template slot-scope="{ row, index }" slot="action">
                    <Button class="btn" size="small" style="margin-right: 5px" @click="editProductLink(row)">编辑</Button>
                    <Button size="small" @click="detailProductLink(row)">详情</Button>
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
                </div>
        </TabPane>
        <TabPane label="待审核信息" name="6">
        </TabPane>
    </Tabs>
</div>

</template>

<script>
import { baseUrl } from '@/api/base.js'
import moment from 'moment'
export default {
  name: 'productLink',
  data () {
    return {
      loading: true,
      incumbencyTbUser: [], // 在职人员
      // 获取状态
      statu: [
        {
          value: '0',
          label: '空闲'
        },
        {
          value: '1',
          label: '在线'
        },
        {
          value: '2',
          label: '全部'
        }
      ],
      // 表头搜索
      headerSearch: {
        fuzzyCondition: '', // 全局搜索公司
        linksName: '', // 链接名称
        date: '', // 添加时间
        businessId: '', // 商务id
        productLinks: '', // 产品链接
        businessName: '', // businessUName: "", //商务
        channelName: '', // 渠道名称
        // statusName: "", // 状态
        totalCount: 0,
        pageSize: 20,
        currPage: 1,
        status: '' // 状态
      },
      linkHeader: [
        {
          title: '序号',
          type: 'index',
          width: 70,
          align: 'center'
        },
        {
          title: '链接名称',
          key: 'linksName',
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
                  placeholder="输入链接名称"
                  v-model={this.headerSearch.linksName}
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
                    this.headerSearch.linksName = ''
                  }}
                ></Button>
              </Poptip>
            )
          }
        },
        {
          title: '添加时间',
          key: 'date',
          align: 'center',
          renderHeader: (h, params) => {
            return (
              <span>
                <Poptip placement="bottom">
                  <span class="pointer">
                    {params.column.title}
                    <i class="ivu-icon ivu-icon-ios-search" />
                  </span>
                  <div slot="content">
                    <div>
                      <DatePicker
                        v-on:on-ok={() => {
                          this.getListData()
                        }}

                        type="daterange"
                        v-model={this.headerSearch.date}
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
          title: '产品链接',
          key: 'productLinks',
          align: 'center'
        },
        {
          title: '商务',
          key: 'businessName',
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
                  placeholder="请选择商务"
                  filterable
                  style="width:130px;height:33px"
                  v-on:on-change={() => {}}
                  v-model={this.headerSearch.businessId}
                >
                  {(this.incumbencyTbUser || []).map(person => {
                    return <Option value={person.id}>{person.nickname}</Option>
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
                    this.headerSearch.businessId = ''
                  }}
                ></Button>
              </Poptip>
            )
          }
        },
        {
          title: '渠道名称',
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
                  placeholder="输入渠道名称"
                  v-model={this.headerSearch.channelName}
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
                    this.headerSearch.channelName = ''
                  }}
                ></Button>
              </Poptip>
            )
          }
        },
        {
          title: '状态',
          key: 'statusName',
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
                  placeholder="请选择状态"
                  style="width:130px"
                  v-on:on-change={() => {}}
                  v-model={this.headerSearch.status}
                >
                  {(this.statu || []).map(item => {
                    return <Option value={item.value}>{item.label}</Option>
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
                    this.headerSearch.status = ''
                  }}
                ></Button>
              </Poptip>
            )
          }
        },
        {
          title: '操作',
          slot: 'action',
          width: 160,
          align: 'center'
        }
      ],
      // 产品链接表格数据
      linkContent: []
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
    // 新增产品链接库
    addProcuctLink () {
      this.$router.push({
        name: 'addProductBank'
      })
    },
    // 列表数据 搜索 分页
    getListData () {
      this.getData()
      // 列表数据
      let {
        channelName, // 渠道名称
        businessId, // 商务
        linksName, // 链接名称
        // statusName, // 状态
        status,
        date, // 时间
        fuzzyCondition,
        pageSize,
        currPage
      } = this.headerSearch
      let sendData = {}
      // 如果有模糊搜索，清空表头内容
      if (fuzzyCondition) {
        sendData.fuzzyCondition = fuzzyCondition
        this.clearSearchHeader(fuzzyCondition)
      } else {
        // 发送表头搜索内容
        sendData = {
          channelName, // 渠道名称
          businessId, // 商务
          linksName, // 链接名称
          status // 状态
        }
      }
      if (date[0]) {
        sendData.startTime = moment(date[0]).format('YYYY-MM-DD')
        sendData.endTime = moment(date[1]).format('YYYY-MM-DD')
      }
      sendData.pageSize = pageSize
      sendData.currPage = currPage
      this.$axios({
        url: baseUrl + '/Commodity/getLinksByDTO',
        method: 'post',
        data: $qs.stringify(sendData, {
          indices: false
        })
      })
        .then(res => {
          // 查无数据
          if (res.data.code === 10001) {
            this.loading = false
            let _self = this.headerSearch
            this.linkContent = []
            _self.totalCount = 0
            _self.pageSize = 20
            _self.currPage = 1
          } else if (res.data.code === 10000) {
            let _self = this.headerSearch
            this.linkContent = res.data.content.pageContent
            _self.totalCount = res.data.content.totalCount
            _self.pageSize = res.data.content.pageSize
            _self.currPage = res.data.content.currPage
            this.loading = false
          } else {
            // this.$Message.error(res.data.msg)
          }
        })
        .catch(err => {
          console.error(err)
        })
    },
    // 获取初始数据
    getData () {
      // 状态获取
      this.$axios({
        url: baseUrl + '/Commodity/getLinksByDTO',
        method: 'get'
      })
        .then(res => {
          if (res.data.code === 10000) {
            this.headerSearch.linkContent = res.data.content
          } else {
            // this.$Message.error(res.data.msg)
          }
        })
        .catch(err => {
          console.log(err.data)
        })
      // 在职人员
      this.$axios({
        url: baseUrl + '/user/getIncumbencyTbUser',
        method: 'post'
      })
        .then(res => {
          if (res.data.code === 10000) {
            this.incumbencyTbUser = res.data.content
          } else {
            // this.$Message.error(res.data.msg)
          }
        })
        .catch(err => {
          console.error(err)
        })
    },
    clearSearchHeader (fuzzyCondition) {
      this.headerSearch = {
        linksName: '', // 链接名称
        date: '', // 添加时间
        businessName: '', // 商务
        channelName: '', // 渠道名称
        // statusName: "", // 状态
        status: '',
        fuzzyCondition: fuzzyCondition
      }
    },
    // 编辑
    editProductLink (row) {
      this.$router.push({
        name: 'editProduckBank',
        query: {
          commodityId: row.commodityId
        }
      })
    },
    // 详情
    detailProductLink (row) {
      this.$router.push({
        name: 'detailProduct',
        query: {
          productCompanyId: row.productCompanyId
        }
      })
    },
    // 刷新
    reloadPage () {
      this.clearSearchHeader()
      this.getListData()
    }
  }
}
</script>
<style lang="less">
#productLinkId{
.ivu-btn.ivu-btn-primary.ivu-btn-small{
        background-color: #fff;
}
.ivu-btn.ivu-btn-default.ivu-btn-small:hover{
    color: #19aa8d;
    background-color: #fff;
    border-color: #19aa8d;
}
.ivu-date-picker-cells-cell-selected em, .ivu-date-picker-cells-cell-selected:hover em {
    background: #19aa8d;
    color: #fff;
}
.ivu-date-picker-cells-focused em{
    box-shadow: 0 0 0 1px #19aa8d inset;

}
.ivu-date-picker-focused input{
    border-color: #19aa8d;
    outline: 0;
    box-shadow: none;
}
}

</style>
<style scoped>
.btn {
  background: #19aa8d;
  color: white;
}

.add {
  margin-bottom: 10px;
}
.ivu-poptip-body-content{
    height: 33px
}
</style>
