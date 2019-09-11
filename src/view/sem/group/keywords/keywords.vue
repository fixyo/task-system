<template>
  <div>
    <div class="tableHeader clearfix">
      <!-- <Button class="searchbarLeft btns" @click="exportExcel">导出</Button> -->
      <TableHeaderSetting
        :totalTableHeader="totalTableHeader"
        :tableHeader.sync="tableHeader"
        key="semKeywordsList"
        localKey="semKeywordsList"
      />
      <Button class="searchbar btns" icon="ios-loading" @click="reload()"></Button>
      <Input
        @on-search="detailSearch()"
        placeholder="推广组、关键词、责任人"
        search
        clearable
        v-model="detailHeader.text"
        class="searchbar"
        style="width:200px;margin-right:5px;"
      />
    </div>
    <Table
      :columns="tableHeader"
      :data="tableContent"
      @on-sort-change="sortChange"
      :height="tableHeight"
      :loading="loading"
    >
      <template slot-scope="{ row, index }" slot="edit">
        <Button class="btns" type="primary" @click="edit(row,index)">编辑</Button>
        <!-- <Button class="btns" type="error" @click="del(row,index)">停用</Button> -->
        <!-- 待编辑 -->
        <!-- 启用 -->
        <!-- 停用 -->
        <!-- 暂停 -->
        <Button class="btns" @click="toDetail(row)">详情</Button>
      </template>
    </Table>
    <div class="clearfix">
      <Page
        size="small"
        :total="detailHeader.totalCount"
        :page-size="detailHeader.pageSize"
        :current="detailHeader.currPage"
        :page-size-opts="[20,50,100]"
        show-total
        show-sizer
        show-elevator
        @on-change="(currPage)=>{detailHeader.currPage=currPage;detailSearch()}"
        @on-page-size-change="(pageSize)=>{detailHeader.pageSize=pageSize;detailSearch()}"
        style="float:right;"
      />
    </div>
    <editKeyword
      @updateList="detailSearch"
      v-if="showEdit"
      :show.sync="showEdit"
      :propData="propData"
    ></editKeyword>
  </div>
</template>
<script>
import { semUrl } from '@/api/base.js'
// import moment from 'moment'
import editKeyword from './editKeyword'
import TableHeaderSetting from '_c/table-header-setting'
export default {
  components: {
    editKeyword,
    TableHeaderSetting
  },
  data () {
    return {
      showEdit: false,
      propData: {},
      tableHeader: [],
      loading: true,
      tableHeight: 600,
      tableConfigList: [
        'index',
        'addTime',
        'accountName',
        'groupName',
        'plainGroupName',
        'owner',
        'keyword',
        'price',
        'matchType',
        'showId',
        'status',
        'sum',
        'edit'
      ],
      totalTableHeader: [
        {
          title: '序号',
          type: 'index',
          key: 'index',
          width: 80,
          align: 'center',
          alwaysShow: true
        },
        {
          title: '账户名称',
          key: 'accountName',
          minWidth: 100,
          align: 'center',
          renderHeader: (h, params) => {
            return (
              <span>
                <Poptip placement="bottom">
                  <div slot="content">
                    <Input
                      v-model={this.detailHeader.accountName}
                      search
                      clearable
                      v-on: on-search={value => {
                        this.detailSearch({ currPage: 1 })
                      }}
                    />
                  </div>
                  <span class="pointer">
                    <Icon type="md-search" size="14" class={this.detailHeader.accountName ? 'on' : ''} />
                    {params.column.title}
                  </span>
                </Poptip>
              </span>
            )
          }
        },
        {
          title: '推广组',
          key: 'groupName',
          minWidth: 100,
          align: 'center',
          renderHeader: (h, params) => {
            return (
              <span>
                <Poptip placement="bottom">
                  <div slot="content">
                    <Checkbox true-value={'1'} false-value={''} v-model={this.detailHeader.groupCheck}>精确搜索</Checkbox>
                    <Input
                      v-model={this.detailHeader.groupName}
                      search
                      style="width:200px"
                      v-on: on-search={value => {
                        this.detailSearch({ groupName: value, currPage: 1 })
                      }}
                    />
                  </div>
                  <span class="pointer">
                    <Icon type="md-search" size="14" class={this.detailHeader.groupName ? 'on' : ''} />
                    {params.column.title}
                  </span>
                </Poptip>
              </span >
            )
          }
        },
        {
          title: '产品名',
          key: 'softName',
          minWidth: 100,
          align: 'center',
          renderHeader: (h, params) => {
            return (
              <span>
                <Poptip placement="bottom">
                  <div slot="content">
                    <Input
                      v-model={this.detailHeader.softName}
                      search
                      clearable
                      v-on: on-search={value => {
                        this.detailSearch({ softName: value, currPage: 1 })
                      }}
                    />
                  </div>
                  <span class="pointer">
                    <Icon type="md-search" size="14" class={this.detailHeader.softName ? 'on' : ''} />
                    {params.column.title}
                  </span>
                </Poptip>
              </span >
            )
          }
        },
        {
          title: '推广计划',
          key: 'campaignName',
          align: 'center',
          minWidth: 100,
          renderHeader: (h, params) => {
            return (
              <span>
                <Poptip placement="bottom">
                  <div slot="content">
                    <Input
                      v-model={this.detailHeader.campaignName}
                      search
                      clearable
                      v-on: on-search={value => {
                        this.detailSearch({ campaignName: value, currPage: 1 })
                      }}
                    />
                  </div>
                  <span class="pointer">
                    <Icon type="md-search" size="14" class={this.detailHeader.campaignName ? 'on' : ''} />
                    {params.column.title}
                  </span>
                </Poptip>
              </span >
            )
          }
        },
        {
          title: '责任人',
          key: 'owner',
          align: 'center',
          minWidth: 100,
          renderHeader: (h, params) => {
            return (
              <span>
                <Poptip placement="bottom">
                  <div slot="content">
                    <Input
                      v-model={this.detailHeader.owner}
                      search
                      clearable
                      v-on: on-search={value => {
                        this.detailSearch({ owner: value, currPage: 1 })
                      }}
                    />
                  </div>
                  <span class="pointer">
                    <Icon type="md-search" size="14" class={this.detailHeader.owner ? 'on' : ''} />
                    {params.column.title}
                  </span>
                </Poptip>
              </span >
            )
          }
        },
        {
          title: '关键词',
          key: 'keyword',
          align: 'center',
          minWidth: 100,
          renderHeader: (h, params) => {
            return (
              <span>
                <Poptip placement="bottom">
                  <div slot="content">
                    <Checkbox true-value={'1'} false-value={''} v-model={this.detailHeader.keywordCheck}>精确搜索</Checkbox>
                    <Input
                      v-model={this.detailHeader.keyword}
                      search
                      style="width:200px"
                      v-on: on-search={value => {
                        this.detailSearch({ keyword: value, currPage: 1 })
                      }}
                    />
                  </div>
                  <span class="pointer">
                    <Icon type="md-search" size="14" class={this.detailHeader.keyword ? 'on' : ''} />
                    {params.column.title}
                  </span>
                </Poptip>
              </span >
            )
          }
        },
        {
          title: '出价',
          key: 'price',
          width: 80,
          align: 'center',
          sortable: 'custom'
        },
        {
          title: '历史最大点击',
          key: 'maxClick',
          width: 130,
          align: 'center',
          sortable: 'custom'
        },
        {
          title: '昨日点击数',
          key: 'lastClick',
          width: 120,
          align: 'center',
          sortable: 'custom'
        },
        {
          title: '下线差值',
          key: 'promote',
          width: 110,
          align: 'center',
          sortable: 'custom'
        },
        {
          title: '历史最高安装',
          key: 'maxSetups',
          width: 130,
          align: 'center',
          sortable: 'custom'
        },
        {
          title: '匹配方式',
          key: 'matchType',
          align: 'center',
          width: 120,
          renderHeader: (h, params) => {
            return (
              <span>
                <Poptip placement="bottom">
                  <div slot="content">
                    <Select
                      v-model={this.detailHeader.matchType}
                      v-on: on-change={value => {
                        this.detailSearch({ matchType: value, currPage: 1 })
                      }}
                    >
                      <Option value="">全部</Option>
                      <Option value="短精">短精</Option>
                      <Option value="短">短</Option>
                      <Option value="精">精</Option>
                    </Select>
                  </div>
                  <span class="pointer">
                    <Icon type="md-search" size="14" class={this.detailHeader.matchType ? 'on' : ''} />
                    {params.column.title}
                  </span>
                </Poptip>
              </span >
            )
          }
        },
        // {
        //   title: '创意',
        //   key: '',
        //   width: 80,
        //   align: 'center',
        //   sortable: 'custom'
        // },
        {
          title: '模板',
          key: 'showId',
          width: 80,
          align: 'center',
          renderHeader: (h, params) => {
            return (
              <span>
                <Poptip placement="bottom">
                  <div slot="content">
                    <Input
                      v-model={this.detailHeader.showId}
                      search
                      clearable
                      v-on: on-search={value => {
                        this.detailSearch({ showId: value, currPage: 1 })
                      }}
                    />
                  </div>
                  <span class="pointer">
                    <Icon type="md-search" size="14" class={this.detailHeader.showId ? 'on' : ''} />
                    {params.column.title}
                  </span>
                </Poptip>
              </span >
            )
          }
        },
        {
          title: '状态',
          key: 'optStatus',
          width: 80,
          align: 'center',
          // sortable: 'custom'
          renderHeader: (h, params) => {
            return (
              <span>
                <Poptip placement="bottom">
                  <div slot="content">
                    <Select v-model={this.detailHeader.optStatus}
                      v-on: on-change={value => {
                        this.detailSearch({ optStatus: value, currPage: 1 })
                      }}>
                      <Option value="">全部</Option>
                      <Option value="enabled">启用</Option>
                      <Option value="paused">暂停</Option>
                      <Option value="edited">待编辑</Option>
                      <Option value="stop">停用</Option>
                    </Select>
                  </div>
                  <span class="pointer">
                    <Icon type="md-search" size="14" class={this.detailHeader.optStatus ? 'on' : ''} />
                    {params.column.title}
                  </span>
                </Poptip>
              </span >
            )
          }
        },
        {
          title: '备注',
          key: 'sum',
          minWidth: 80,
          align: 'center',
          tooltip: true
        },
        {
          title: '操作',
          key: 'edit',
          slot: 'edit',
          minWidth: 160,
          align: 'center',
          alwaysShow: true
        }
      ],
      tableContent: [],
      detailHeader: {
        currPage: 1,
        pageSize: 20,
        totalCount: 0,
        orderby: '', // 根据什么字段排序
        desc: 'normal', // 排序的方式
        // timeRange: [], // 时间范围
        text: '', // 模糊搜索
        accountName: '', // 账户名称
        groupName: '', // 推广组
        softName: '', // 产品名
        owner: '', // 责任人
        keyword: '', // 关键字
        promote: '', // 下线差值
        campaignName: '', // 推广计划
        matchType: '', // 匹配方式
        appratio: '', // 下载器安装率
        keywordCheck: '', // 关键词精确搜索
        groupCheck: '', // 推广组精确搜索
        maxSetups: ''// 历史最高安装
      }
    }
  },
  mounted () {
    // 设置默认搜索日期为昨天
    // this.detailHeader.timeRange = [
    //   moment()
    //     .day(-1)
    //     .format("YYYY-MM-DD"),
    //   moment()
    //     .day(-1)
    //     .format("YYYY-MM-DD")
    // ];
    this.detailSearch()
    window.addEventListener('resize', () => {
      this.setTableHeight()
    })
  },
  methods: {
    // 导出excel
    exportExcel () {
      let sendData = this.getSendData()
      delete sendData.pageSize
      delete sendData.currPage
      delete sendData.text
      let data = $qs.stringify(sendData)
      window.open(semUrl + '/Keyword/exptCostKeyword?' + data)
    },
    // 搜索
    detailSearch (getData = {}) {
      let sendData = this.getSendData(getData)
      this.loading = true
      this.$axios({
        url: semUrl + '/keyword/index',
        method: 'post',
        data: $qs.stringify(sendData)
      }).then(res => {
        this.tableContent = res.data.content.pageContent
        this.detailHeader.totalCount = Number(res.data.content.totalCount)
        // 合计放到最后一行
        this.loading = false
        this.setTableHeight()
        this.$nextTick(() => { })
      })
    },
    // 排序
    sortChange (column) {
      // 降序  "desc"
      let orderby = column.key
      let desc = column.order
      this.detailSearch({ orderby, desc })
      this.detailHeader.orderby = column.key
      this.detailHeader.desc = column.order
    },
    // 设置Table的高度
    setTableHeight () {
      let pagePaddingHeight = document
        .querySelectorAll('body')[0]
        .getClientRects()[0].height
      this.tableHeight = pagePaddingHeight - 280
    },
    // 编辑
    edit (row, index) {
      this.showEdit = true
      this.propData = JSON.parse(JSON.stringify(row))
    },
    // 删除
    del (row, index) {
      this.$Modal.confirm({
        title: '提示',
        content: `是否删除关键字 ${row.keyword}`,
        onOk: () => {
          // this.$axios({})
        }
      })
    },
    toDetail (row) {
      console.log(row)
      this.$router.push({ name: 'semKeywordDetail', query: { id: row.keywordId } })
    },
    reload () {
      this.detailHeader = {
        currPage: 1,
        pageSize: 20,
        totalCount: 0,
        orderby: '', // 根据什么字段排序
        desc: 'normal', // 排序的方式
        // timeRange: [], // 时间范围
        text: '', // 模糊搜索
        accountName: '', // 账户名称
        groupName: '', // 推广组
        softName: '', // 产品名
        owner: '', // 责任人
        keyword: '', // 关键字
        campaignName: '', // 推广计划
        matchType: '', // 匹配方式
        appratio: '', // 下载器安装率
        keywordCheck: '', // 关键词精确搜索
        groupCheck: '', // 推广组精确搜索
        maxSetups: ''// 历史最高安装
      }
      this.detailSearch()
    },
    // 获取需要发送的数据的数值
    getSendData (data = {}) {
      let keys = Object.keys(this.detailHeader)
      let me = this
      let hasValueKeys = keys.filter(e => {
        // 非空字符串，非空数组,timeRage第二项有值才算
        return me.detailHeader[e] !== ''
      })
      let sendData = {}
      for (let i = 0; i < hasValueKeys.length; i++) {
        let key = hasValueKeys[i]
        let value = me.detailHeader[key]
        sendData[key] = typeof value === 'string' ? value.trim() : value
      }
      // 传进来的data去除首位空格
      for (let key in data) {
        if (typeof data[key] === 'string') {
          data[key] = data[key].trim()
        }
      }
      // 如果是模糊搜索
      if (sendData.text) {
        sendData.text = sendData.text.trim()
        this.detailHeader.text = sendData.text
      } else {
        // sendData.date = moment(sendData.timeRange[0]).format("YYYY-MM-DD");
        // sendData.enddate = moment(sendData.timeRange[1]).format("YYYY-MM-DD");
        // delete sendData.timeRange;
      }
      delete sendData.totalCount
      sendData = Object.assign(sendData, data)
      // 如果排序清空，不需要带排序条件
      if (sendData.desc === 'normal') {
        delete sendData.orderby
        delete sendData.desc
      }
      this.detailHeader.currPage = sendData.currPage
      return sendData
    }
  },
  beforeDestroy () {
    window.removeEventListener('resize', () => {
      this.setTableHeight()
    })
  }
}
</script>
