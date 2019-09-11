<template>
  <!-- 这是产品库 -->
  <div class="cloudCooper">
    <Tabs value="4" tab="outTable" @on-click="handleClick" :animated="false">
        <TabPane label="产品公司" name="1">
        </TabPane>
        <TabPane label="渠道公司" name="2">
        </TabPane>
        <TabPane label="合同库" name="3">
        </TabPane>
        <TabPane label="产品库" name="4">
            <!-- 表头 -->
            <Button type="primary" @click="addProductBank">新增</Button>
            <div class="tableHeader" style="float:right;margin-bottom:10px">
            <Input
                v-model="detailHeader.text"
                placeholder="输入销售、产品名称"
                search
                style="width:200px;margin-right:5px;"
                @on-search="getListData()"
            />
            <Button icon="ios-loading" style="margin-right:5px;" @click="reload()"></Button>
            <TableHeaderSetting
                :totalTableHeader="totalTableHeader"
                :tableHeader.sync="tableHeader"
                key="cloudDayList"
                :defaultList="defaultList"
                localKey="cloudDayList"
                style="float: right;"
            ></TableHeaderSetting>
            </div>
            <div style="clear:both"></div>
            <!-- 表 -->
            <Table border :columns="tableHeader" :data="tableContent" :loading="loading">
            <template slot-scope="{ row, index }" slot="action">
            <Button type="primary" size="small" style="margin-right: 5px" @click="editProduct(row)">编辑</Button>
                <Button class="simple" size="small" style="margin-right: 5px" @click="showProduct(row)">详情</Button>
            </template>
            </Table>
            <!-- 分页 -->
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
        </TabPane>
        <TabPane label="产品链接库" name="5">
        </TabPane>
        <TabPane label="待审核信息" name="6">
        </TabPane>
    </Tabs>
</div>
</template>

<script>
import { phpURL, baseUrl } from '@/api/base.js'
// import moment from 'moment'
import TableHeaderSetting from '_c/table-header-setting'
export default {
  components: {
    TableHeaderSetting
  },
  name: 'productBank',
  data () {
    return {
      incumbencyTbUser: [],
      loading: false,
      tableHeader: [],
      defaultList: [
        'index',
        'commodityName',
        'num',
        'businessIdName',
        'advance',
        'cycleName',
        'settlementNameName',
        'inBid',
        'outBid',
        'regionName'
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
          title: '产品名称',
          key: 'commodityName',
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
                  placeholder="输入产品名称"
                  v-model={this.detailHeader.commodityName}
                  v-on:on-search={() => { this.getListData() }}
                />
                <Button type="primary" icon="md-search" slot="content" v-on:click={() => { this.getListData() }}></Button>
                <Button icon="md-close" slot="content" v-on:click={() => { this.detailHeader.commodityName = '' }}></Button>
              </Poptip>
            )
          }
        }, {
          title: '剩余链接',
          key: 'num',
          align: 'center'
        }, {
          title: '商务',
          key: 'businessIdName',
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
                  style="width:130px"
                  v-on: on-change={() => {}}
                  v-model={this.detailHeader.businessId}
                >
                  {(this.incumbencyTbUser || []).map(person => {
                    return <Option value={person.id}>{person.nickname}</Option>
                  })}
                </Select>
                <Button type="primary" icon="md-search" slot="content" v-on:click={() => { this.getListData() }}></Button>
                <Button icon="md-close" slot="content" v-on:click={() => { this.detailHeader.businessId = '' }}></Button>
              </Poptip>
            )
          }
        }, {
          title: '预收款项',
          key: 'advanceName',
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
                  placeholder="请选择预收款项"
                  style="width:130px"
                  v-on: on-change={() => {}}
                  v-model={this.detailHeader.advance}
                >
                  {(this.detailHeader.advancePayList || []).map(person => {
                    return <Option value={person.id}>{person.name}</Option>
                  })}
                </Select>
                <Button type="primary" icon="md-search" slot="content" v-on:click={() => { this.getListData() }}></Button>
                <Button icon="md-close" slot="content" v-on:click={() => { this.detailHeader.advance = '' }}></Button>
              </Poptip>
            )
          }
        }, {
          title: '结算周期',
          key: 'cycleName',
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
                  placeholder="请选择结算周期"
                  style="width:130px"
                  v-on: on-change={() => {}}
                  v-model={this.detailHeader.cycle}
                >
                  {(this.detailHeader.cycleList || []).map(person => {
                    return <Option value={person.id}>{person.name}</Option>
                  })}
                </Select>
                <Button type="primary" icon="md-search" slot="content" v-on:click={() => { this.getListData() }}></Button>
                <Button icon="md-close" slot="content" v-on:click={() => { this.detailHeader.cycle = '' }}></Button>
              </Poptip>
            )
          }
        }, {
          title: '结算方式',
          key: 'settlementName',
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
                  placeholder="请选择结算方式"
                  style="width:130px"
                  v-on: on-change={() => {}}
                  v-model={this.detailHeader.settlement}
                >
                  {(this.detailHeader.settlementList || []).map(person => {
                    return <Option value={person.id}>{person.name}</Option>
                  })}
                </Select>
                <Button type="primary" icon="md-search" slot="content" v-on:click={() => { this.getListData() }}></Button>
                <Button icon="md-close" slot="content" v-on:click={() => { this.detailHeader.settlement = '' }}></Button>
              </Poptip>
            )
          }
        }, {
          title: '进价/比',
          key: 'inBid',
          align: 'center'
        }, {
          title: '建议出价/比',
          key: 'outBid',
          align: 'center'
        }, {
          title: '区域类型',
          key: 'regionName',
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
                  placeholder="请选择区域类型"
                  style="width:130px"
                  v-on:on-change={() => {}}
                  v-model={this.detailHeader.regionId}
                >
                  {(this.detailHeader.areaList || []).map(item => {
                    return <Option value={item.id}>{item.areaName}</Option>
                  })}
                </Select>
                <Button type="primary" icon="md-search" slot="content" v-on:click={() => { this.getListData() }}></Button>
                <Button icon="md-close" slot="content" v-on:click={() => { this.detailHeader.regionId = '' }}></Button>
              </Poptip>
            )
          }
        },
        {
          title: '操作',
          slot: 'action',
          key: 'action',
          width: 170,
          align: 'center',
          alwaysShow: true
        }
      ],
      // 列表数据
      tableContent: [],
      detailHeader: {
        text: '',
        totalCount: 0,
        pageSize: 20,
        currPage: 1,
        commodityName: '', // 产品名称
        num: '', // 剩余链接
        businessId: '', // 商务
        businessIdName: '', // 商务名称
        advance: '', // 预收款项
        advancePayList: [{// 预收款项list
          id: '1',
          name: '有'
        }, {
          id: '2',
          name: '无'
        }],
        cycle: '', // 结算周期
        cycleList: [
          {
            id: '1',
            name: '单周'
          }, {
            id: '2',
            name: '双周'
          }, {
            id: '3',
            name: '月'
          }
        ], // 结算周期list
        settlement: '', // 结算方式
        settlementList: [
          {
            id: '1',
            name: '安装'
          }, {
            id: '2',
            name: '充值'
          }, {
            id: '3',
            name: '留存'
          }, {
            id: '4',
            name: '分成'
          }
        ], // 结算方式list
        regionId: '', // 区域类型
        areaList: []// 区域类型list
      }
    }
  },
  mounted () {
    this.getData()
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
      // 区域类型
      this.$axios({
        url: phpURL + '/cloud/areaList',
        method: 'get'
      }).then(res => {
        if (res.data.code === 10000) {
          this.detailHeader.areaList = res.data.content
        } else {
          this.$Message.error(res.data.msg)
        }
      }).catch(err => {
        console.log(err.data)
      })
    },
    // 获取列表数据
    getListData () {
      let {
        commodityName, // 产品名称
        businessId, // 商务
        businessIdName, // 商务名称
        advance, // 预收款项
        cycle, // 结算周期
        settlement, // 结算方式
        regionId, // 区域类型
        text,
        pageSize,
        currPage
      } = this.detailHeader
      let sendData = {}
      // 如果有模糊搜索，清空表头内容
      if (text) {
        sendData.text = text
        this.clearSearchHeader(text)
      } else {
        // 发送表头搜索内容
        sendData = {
          commodityName, // 产品名称
          businessId, // 商务
          businessIdName, // 商务名称
          advance, // 预收款项
          cycle, // 结算周期
          settlement, // 结算方式
          regionId // 区域类型
        }
      }
      sendData.pageSize = pageSize
      sendData.currPage = currPage
      this.$axios({
        url: baseUrl + '/Commodity/getCommodityList',
        method: 'post',
        data: $qs.stringify(sendData)
      }).then(res => {
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
      }).catch(err => {
        console.error(err)
      })
    },
    clearSearchHeader (text) {
      this.detailHeader = {
        commodityName: '', // 产品名称
        businessId: '', // 商务
        businessIdName: '', // 商务名称
        advance: '', // 预收款项
        cycle: '', // 结算周期
        settlement: '', // 结算方式
        regionId: '', // 区域类型
        text: text
      }
    },
    reload () {
      this.clearSearchHeader()
      this.getListData()
    },
    // 新增
    addProductBank (row) {
      this.$router.push({
        name: 'addProductBank'
      })
    },
    // 编辑
    editProduct (row) {
    //   console.log(row)
      this.$router.push({
        name: 'editProduckBank',
        query: {
          commodityId: row.id

        }
      })
    },
    // 详情
    showProduct (row) {
      this.$router.push({
        name: 'detailProduct',
        query: {
          productCompanyId: row.productCompanyId
        }
      })
    }
  }
}
</script>

<style scoped>
</style>
