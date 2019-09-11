<template>
  <div>
    <div class="tableHeader clearfix">
      <Button class="searchbarLeft" @click="exportExcel" >导出</Button>
      <TableHeaderSetting
        :totalTableHeader="totalTableHeader"
        :tableHeader.sync="tableHeader"
        :defaultList="defaultList"
        key="semHourList"
        localKey="semHourList"
      />
      <Button
        class="searchbar btns"
        :icon="isFullScreen?'md-contract':'md-expand'"
        @click="handleFullScreen"
      />
      <Button class="searchbar btns" icon="ios-loading" @click="()=>{reload();detailSearch()}"></Button>
      <Input
        @on-search="detailSearch()"
        placeholder="推广组、关键词"
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
      <template slot-scope="{ row, index }" slot="index">
        <span v-if="index===tableContent.length-1||index===0">合计</span>
        <span v-else>{{index}}</span>
      </template>
      <template slot-scope="{ row, index }" slot="sid">
        <a :href="row.destinationUrl" target="_blank" title="打开页面">
          <span class="pointer">{{row.sid}}</span>
        </a>
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
  </div>
</template>
<script>
import { semUrl } from '@/api/base.js'
import moment from 'moment'
import TableHeaderSetting from '_c/table-header-setting'
export default {
  components: {
    TableHeaderSetting
  },
  props: {
    isFullScreen: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      tableHeader: [],
      loading: true,
      tableHeight: 600,
      defaultList: ['index', 'date', 'hour', 'endHour', 'groupName', 'user', 'keyword', 'profitRatio', 'matchType', 'setupRadio', 'avgPosition', 'price', 'views', 'maxprice', 'percost', 'profit', 'setups'],
      totalTableHeader: [
        {
          title: '序号',
          key: 'index',
          width: 60,
          slot: 'index',
          align: 'center',
          fixed: 'left',
          alwaysShow: true
        },
        {
          title: '关键词',
          key: 'keyword',
          align: 'center',
          fixed: 'left',
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
          title: '日期',
          key: 'date',
          align: 'center',
          width: 130,
          sortable: 'custom',
          renderHeader: (h, params) => {
            return (
              <span>
                <Poptip placement="bottom">
                  <div slot="content">
                    <DatePicker
                      v-on: on-ok={() => {
                        this.detailSearch({currPage: 1})
                      }}
                      type="date"
                      v-model={this.detailHeader.date}
                      confirm
                      placement="bottom-start"
                      placeholder="输入时间"
                    />
                  </div>
                  <span class="pointer">
                    <Icon type="md-search" size="14" class={this.detailHeader.date ? 'on' : ''} />
                    {params.column.title}
                  </span>
                </Poptip>
              </span>
            )
          }
        },
        {
          title: '小时',
          key: 'hour',
          align: 'center',
          sortable: 'custom',
          width: 100,
          renderHeader: (h, params) => {
            return (
              <span>
                <Poptip placement="bottom">
                  <div slot="content">
                    <div>
                      <Checkbox true-value={'2'} false-value={'1'} v-model={this.detailHeader.hourMergin}>区间合并</Checkbox>
                      <TimePicker
                        v-on: on-ok={() => {
                          this.detailSearch({currPage: 1})
                        }}
                        type="timerange"
                        v-model={this.detailHeader.timeRange}
                        placement="bottom-end"
                        placeholder="Select time"
                        style="width: 168px"
                        confirm
                      />
                    </div>
                  </div>
                  <span class="pointer">
                    <Icon type="md-search" size="14" class={this.detailHeader.timeRange.length > 1 ? 'on' : ''} />
                    {params.column.title}
                  </span>
                </Poptip>
              </span>
            )
          }
        },
        {
          title: '账户名称',
          key: 'accountName',
          width: 100,
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
                        this.detailSearch({currPage: 1})
                      }}
                    />
                  </div>
                  <span class="pointer">
                    <Icon type="md-search" size="14" class={this.detailHeader.accountName ? 'on' : ''} />

                    {params.column.title}
                  </span>
                </Poptip>
              </span >
            )
          }
        },
        {
          title: '推广组',
          key: 'groupName',
          width: 100,
          align: 'center',
          renderHeader: (h, params) => {
            return (
              <span>
                <Poptip placement="bottom">
                  <div slot="content">
                    <Input
                      v-model={this.detailHeader.groupName}
                      search
                      clearable
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
          title: '责任人',
          key: 'user',
          align: 'center',
          width: 100,
          renderHeader: (h, params) => {
            return (
              <span>
                <Poptip placement="bottom">
                  <div slot="content">
                    <Input
                      v-model={this.detailHeader.user}
                      search
                      clearable
                      v-on: on-search={value => {
                        this.detailSearch({ user: value, currPage: 1 })
                      }}
                    />
                  </div>
                  <span class="pointer">
                    <Icon type="md-search" size="14" class={this.detailHeader.user ? 'on' : ''} />

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
          title: '匹配',
          key: 'matchType',
          align: 'center',
          width: 80,
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
        {
          title: '安装率',
          key: 'setupRadio',
          width: 100,
          align: 'center',
          sortable: 'custom',
          renderHeader: (h, params) => {
            return (
              <span title="安装数/点击数" class="pointer">
                {params.column.title}
              </span>
            )
          }
        },
        {
          title: '模板id',
          key: 'showid',
          width: 90,
          align: 'center',
          renderHeader: (h, params) => {
            return (
              <span>
                <Poptip placement="bottom">
                  <div slot="content">
                    <Input
                      v-model={this.detailHeader.showid}
                      search
                      clearable
                      v-on: on-search={value => {
                        this.detailSearch({ showid: value, currPage: 1 })
                      }}
                    />
                  </div>
                  <span class="pointer">
                    <Icon type="md-search" size="14" class={this.detailHeader.showid ? 'on' : ''} />
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
          title: '平均出价',
          key: 'avgPrice',
          width: 110,
          align: 'center',
          sortable: 'custom'
        },
        {
          title: '最大出价',
          key: 'maxprice',
          width: 110,
          align: 'center',
          sortable: 'custom',
          renderHeader: (h, params) => {
            return (
              <span title="单位收益*利润系数*1.65*安装率" class="pointer">
                {params.column.title}
              </span>
            )
          }
        },
        {
          title: '点击率',
          key: 'clickSetup',
          width: 100,
          align: 'center',
          sortable: 'custom',
          renderHeader: (h, params) => {
            return (
              <span title="点击数/展示数" class="pointer">
                {params.column.title}
              </span>
            )
          }
        },
        {
          title: '盈亏',
          key: 'percost',
          width: 80,
          align: 'center',
          sortable: 'custom',
          renderHeader: (h, params) => {
            return (
              <span title="单位收益*利润系数-成本" class="pointer">
                {params.column.title}
              </span>
            )
          }
        },
        {
          title: '成本',
          key: 'cost',
          width: 80,
          align: 'center',
          sortable: 'custom',
          renderHeader: (h, params) => {
            return (
              <span title="总费用/安装数/1.65" class="pointer">
                {params.column.title}
              </span>
            )
          }
        },
        {
          title: '单位收益',
          key: 'profit',
          width: 110,
          align: 'center',
          sortable: 'custom',
          renderHeader: (h, params) => {
            return (
              <span title="推广软件收益+换包收益+导航收益+收藏夹收益+信息流收益+其他收益" class="pointer">
                {params.column.title}
              </span>
            )
          }
        },
        {
          title: '利润',
          key: 'grossProfit',
          width: 110,
          align: 'center',
          sortable: 'custom',
          renderHeader: (h, params) => {
            return (
              <span title="(单位收益*安装数)-(总费用/1.65)" class="pointer">
                {params.column.title}
              </span>
            )
          }
        },
        {
          title: '利润率',
          key: 'profitRatio',
          width: 110,
          align: 'center',
          sortable: 'custom',
          renderHeader: (h, params) => {
            return (
              <span title="利润/(单位收益*安装数)" class="pointer">
                {params.column.title}
              </span>
            )
          }
        },
        {
          title: '换包收益',
          key: 'chgprofit',
          width: 110,
          align: 'center',
          sortable: 'custom'
        },
        {
          title: '推荐软件',
          key: 'all_ratio',
          width: 110,
          align: 'center',
          sortable: 'custom',
          renderHeader: (h, params) => {
            return (
              <span title="平均每次安装推荐软件个数" class="pointer">
                {params.column.title}
              </span>
            )
          }
        },
        {
          title: '展示数',
          key: 'views',
          width: 100,
          align: 'center',
          sortable: 'custom'
        },
        {
          title: '点击数',
          key: 'clicks',
          width: 90,
          align: 'center',
          sortable: 'custom'
        },
        {
          title: '安装数',
          key: 'setups',
          width: 90,
          align: 'center',
          sortable: 'custom'
        },
        {
          title: '总费用',
          key: 'totalCost',
          width: 110,
          align: 'center',
          sortable: 'custom'
        },
        {
          title: '软件ID',
          key: 'sid',
          slot: 'sid',
          width: 120,
          align: 'center',
          renderHeader: (h, params) => {
            return (
              <span>
                <Poptip placement="bottom">
                  <div slot="content">
                    <Input
                      v-model={this.detailHeader.sid}
                      search
                      clearable
                      v-on: on-search={value => {
                        this.detailSearch({ sid: value, currPage: 1 })
                      }}
                    />
                  </div>
                  <span class="pointer">
                    <Icon type="md-search" size="14" class={this.detailHeader.sid ? 'on' : ''} />
                    {params.column.title}
                  </span>
                </Poptip>
              </span >
            )
          }
        },
        {
          title: '渠道号',
          key: 'appId',
          width: 90,
          align: 'center',
          renderHeader: (h, params) => {
            return (
              <span>
                <Poptip placement="bottom">
                  <div slot="content">
                    <Input
                      v-model={this.detailHeader.appId}
                      search
                      clearable
                      v-on: on-search={value => {
                        this.detailSearch({ appId: value, currPage: 1 })
                      }}
                    />
                  </div>
                  <span class="pointer">
                    <Icon type="md-search" size="14" class={this.detailHeader.appId ? 'on' : ''} />
                    {params.column.title}
                  </span>
                </Poptip>
              </span >
            )
          }
        },
        {
          title: '消耗',
          key: 'consumeCost',
          width: 110,
          align: 'center',
          sortable: 'custom',
          renderHeader: (h, params) => {
            return (
              <span title="总费用/1.35" class="pointer">
                {params.column.title}
              </span>
            )
          }
        },
        {
          title: '下载器安装率',
          key: 'appratio',
          width: 130,
          align: 'center',
          sortable: 'custom',
          renderHeader: (h, params) => {
            return (
              <span title="下载器安装数/下载器打开数" class="pointer">
                {params.column.title}
              </span>
            )
          }
        }
      ],
      tableContent: [],
      detailHeader: {
        currPage: 1,
        pageSize: 20,
        totalCount: 0,
        date: '',
        hour: '',
        text: '', // 模糊搜索内容
        accountName: '', // 账户名称
        groupName: '', // 推广组
        user: '', // 责任人
        keyword: '', // 关键字
        campaignName: '', // 推广计划
        matchType: '', // 匹配方式
        showid: '', // 模板id
        sid: '', // 软件id
        appId: '',
        timeRange: [], // 小时时间范围
        hourMergin: '1', // 是否区间合并
        keywordCheck: ''// 关键词精确搜索
      }
    }
  },
  mounted () {
    this.setTimeRange()
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
      window.open(semUrl + '/Sheet/exptCostHour?' + data)
    },
    // 搜索
    detailSearch (getData = {}) {
      let sendData = this.getSendData(getData)
      this.loading = true
      this.$axios({
        url: semUrl + '/Sheet/hours',
        method: 'post',
        data: $qs.stringify(sendData)
      }).then(res => {
        let endHour = res.data.endHour
        this.tableContent = res.data.list.map(e => {
          return Object.assign(e, { endHour })
        })
        this.detailHeader.totalCount = Number(res.data.totalNum)
        this.tableContent.push(res.data.sumObj)
        this.tableContent.unshift(res.data.sumObj)
        // 设置表格的高度，防止出现外部滚动条
        this.setTableHeight()
        this.loading = false
      }).catch(err => {
        console.error(err)
        this.$Notice.warning({
          title: '数据异常，请联系技术人员'
        })
        this.loading = false
      })
    },
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
      if (this.isFullScreen) {
        this.tableHeight = pagePaddingHeight - 150
      } else {
        this.tableHeight = pagePaddingHeight - 280
      }
    },
    // 设置日期为当前
    setTimeRange () {
      this.detailHeader.date = moment().format('YYYY-MM-DD')
      // 整点的15分钟以后，当前前一小时和当前小时，如8:16,获取7点和8点的
      // 整点的15分钟之前，当前前两个小时和前一小时，如8:14，获取6点到7点
      if (new Date().getMinutes() > 15) {
        this.detailHeader.timeRange = [moment().subtract(1, 'hours').format('HH:00:00'), moment().format('HH:00:00')]
      } else {
        this.detailHeader.timeRange = [moment().subtract(2, 'hours').format('HH:00:00'), moment().subtract(1, 'hours').format('HH:00:00')]
      }
    },
    // 设置全屏
    handleFullScreen () {
      this.$emit('update:isFullScreen', !this.isFullScreen)
    },
    // 获取需要发送的数据的数值
    getSendData (data = {}) {
      let keys = Object.keys(this.detailHeader)
      let me = this
      let sendData = {}
      // 非空字符串
      let hasValueKeys = keys.filter(e => {
        return me.detailHeader[e] !== ''
      })
      // 拷贝到sendData
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
        // 清空搜索
        this.reload()
        sendData.text = sendData.text.trim()
        this.detailHeader.text = sendData.text
      } else {
        sendData.date = moment(sendData.date).format('YYYY-MM-DD')
        sendData.startHour = sendData.timeRange[0]
        sendData.endHour = sendData.timeRange[1]
      }
      delete sendData.totalCount
      delete sendData.timeRange
      sendData = Object.assign(sendData, data)
      // 如果排序清空，不需要带排序条件
      if (sendData.desc === 'normal') {
        delete sendData.orderby
        delete sendData.desc
      }
      this.detailHeader.currPage = sendData.currPage
      return sendData
    },
    // 重新加载
    reload (data = {}) {
      let initData = {
        currPage: 1,
        pageSize: 20,
        totalCount: 0,
        timeRange: [],
        date: '',
        text: '', // 模糊搜索内容
        accountName: '', // 账户名称
        groupName: '', // 推广组
        user: '', // 责任人
        keyword: '', // 关键字
        campaignName: '', // 推广计划
        matchType: '', // 匹配方式
        showid: '', // 模板id
        sid: '', // 软件id
        appId: '',
        hourMergin: '1', // 区间合并
        keywordCheck: ''// 关键词精确搜索
      }
      this.detailHeader = Object.assign(initData, data)
      this.setTimeRange()
      return this.detailHeader
    }
  },
  beforeDestroy () {
    window.removeEventListener('resize', () => {
      this.setTableHeight()
    })
  },
  watch: {
    isFullScreen (newVal) {
      this.setTableHeight()
    }
  }
}
</script>
