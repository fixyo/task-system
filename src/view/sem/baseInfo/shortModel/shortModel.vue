<template>
  <div>
    <div class="tableHeader">
      <Button type="primary" class="btns" @click="addModel()">新增</Button>
      <!-- <Button class="btns">导入</Button> -->
      <Button class="searchbar" icon="ios-loading" @click="reload()"></Button>
      <Input
        @on-search="detailSearch()"
        placeholder="标题，备注"
        search
        clearable
        v-model="detailHeader.text"
        class="searchbar"
        style="width:200px;margin-right:5px;"
      ></Input>
    </div>
    <div style="clear:both"></div>
    <Table :columns="tableHeader" :data="tableContent">
      <template slot-scope="{ row, index }" slot="edit">
        <Button class="btns" type="primary" @click="editShortModel(row,index)">编辑</Button>
        <Button class="btns" type="error" @click="deltetExtension(row)">刪除</Button>
        <Button class="btns" @click="showShortModel(row)">详情</Button>
      </template>
    </Table>
    <div>
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
    <editModel
      v-if="showModal"
      @on-updateList="e=>{detailSearch();log(e)}"
      :config="config"
      :propData="propData"
      :show.sync="showModal"
    ></editModel>
  </div>
</template>
<script>
import editModel from './editModel'
import { semUrl } from '@/api/base.js'

export default {
  name: 'shortModel',
  components: {
    editModel
  },
  data () {
    return {
      tabsType: 'shortModel',
      showModal: false,
      config: {
        title: '新增'
      },
      tableHeader: [
        { title: '序号', type: 'index', align: 'center' },
        { title: '标题', key: 'title', align: 'center' },
        { title: '备注', key: 'sum', align: 'center' },
        { title: '操作', key: 'edit', slot: 'edit', align: 'center' }
      ],
      tableContent: [],
      detailHeader: {
        totalCount: 0,
        text: '',
        currPage: 1,
        pageSize: 20
      },
      propData: {}
    }
  },

  mounted () {
    this.detailSearch()
  },
  methods: {
    log (v) {
      console.log(v)
    },
    // 搜索
    detailSearch () {
      this.$axios({
        url: semUrl + '/Shortmodel/index',
        method: 'post',
        data: $qs.stringify(this.detailHeader)
      })
        .then(res => {
          if (res.data.code === 10000) {
            this.detailHeader.totalCount = res.data.content.totalCount
            this.tableContent = res.data.content.pageContent
          } else {
            this.$Message.error(res.data.msg)
          }
        })
        .catch(err => {
          console.warn(err)
        })
    },
    // 新增
    addModel () {
      this.config.title = '新增'
      this.showModal = true
    },
    // 编辑
    editShortModel (row) {
      this.config.title = '编辑'
      this.propData = JSON.parse(JSON.stringify(row))
      this.showModal = true
    },
    // 查看
    showShortModel (row) {
      this.config.title = '查看'
      this.propData = JSON.parse(JSON.stringify(row))
      this.showModal = true
    },
    reload () {
      this.detailHeader.currPage = 1
      this.detailHeader.pageSize = 20
      this.detailHeader.text = ''
      this.detailSearch()
    },
    // 删除推广组
    deltetExtension (row) {
      this.$Modal.confirm({
        title: '提示',
        content: `是否删除${row.title}`,
        onOk: () => {
          this.$axios({
            url: semUrl + '/Shortmodel/delShort',
            method: 'post',
            data: $qs.stringify({ id: row.id })
          }).then(res => {
            if (res.data.code === 10000) {
              this.$Message.success(res.data.msg)
              this.detailSearch()
            } else {
              this.$Message.error(res.data.msg)
            }
          })
        }
      })
    }
  }
}
</script>
<style lang="less" scoped>
.pagePadding .ivu-poptip-body-content {
  overflow: visible;
}

.pagePadding .searchbar {
  float: right;
}
</style>
