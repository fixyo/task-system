<template>
  <div>
    <Modal
      v-model="showModal"
      :mask-closable="false"
      title="编辑"
      :loading="loading"
      @on-ok="submit"
      @on-cancel="closeModal"
    >
      <Form :label-width="80" ref="editKeyword" :model="data" :rules="validate">
        <FormItem label="推广组" prop="groupName">
          <Input :disabled="true" v-model="data.groupName" />
        </FormItem>
        <FormItem label="关键词">
          <Input :disabled="true" v-model="data.keyword" />
        </FormItem>
        <FormItem label="链接网址" prop="destinationUrl">
          <Input :disabled="true" v-model="data.destinationUrl" />
        </FormItem>
        <FormItem label="模板配置" prop="destinationUrl">
          <Select v-model="data.showId">
            <Option
              :value="item.templateId"
              v-for="(item,index) in templates"
              :key="index"
            >模板{{item.templateId}}--昨日安装量{{item.setups}}</Option>
          </Select>
        </FormItem>
        <FormItem label="状态" prop="optStatus">
          <Select :disabled="propData.optStatus!=='暂停'" v-model="data.optStatus">
            <Option value="启用">启用</Option>
            <Option disabled value="暂停">暂停</Option>
            <Option disabled value="待编辑">待编辑</Option>
            <Option disabled value="停用">停用</Option>
          </Select>
        </FormItem>
        <FormItem label="备注" prop="sum">
          <Input v-model="data.sum" />
        </FormItem>
      </Form>
    </Modal>
  </div>
</template>
<script>
import { semUrl } from '@/api/base.js'
export default {
  name: 'editKeyword',
  props: {
    show: Boolean,
    propData: Object
  },
  mounted () {
    this.data = JSON.parse(JSON.stringify(this.propData))
    this.getTemplates()
  },
  data () {
    return {
      loading: true,
      showModal: this.show,
      selection: [],
      data: { groupName: '', destinationUrl: '', sum: '', optStatus: '' },
      optStatus: '',
      templates: [],
      validate: {
        groupName: [{ required: true, message: '必填', trigger: 'change' }],
        destinationUrl: [{ required: true, message: '必填', trigger: 'change' }],
        optStatus: [{ required: true, message: '必填', trigger: 'change' }]
      }
    }
  },
  methods: {
    closeModal () {
      this.$emit('update:show', false)
    },
    updateList () {
      this.$emit('updateList')
    },
    getTemplates () {
      this.$axios({
        url: semUrl + '/Templat/index',
        data: $qs.stringify({ pageSize: '100', currPage: '1' }),
        method: 'post'
      }).then(res => {
        this.templates = res.data.content.pageContent
      })
    },
    // 保存
    submit () {
      this.$refs.editKeyword.validate(v => {
        let { groupName, destinationUrl, sum, keywordId, showId, optStatus } = this.data
        this.$axios({
          url: semUrl + '/Keyword/updateKeyword',
          method: 'post',
          data: $qs.stringify({ groupName, destinationUrl, sum, keywordId, showId, optStatus })
        }).then(res => {
          if (res.data.code === 10000) {
            this.$Message.success(res.data.msg)
            this.closeModal()
            this.updateList()
          } else {
            this.$Message.error(res.data.msg)
          }
        })
      })
      this.loading = false
      this.$nextTick(() => {
        this.loading = true
      })
    }
  },
  watch: {
    showModal: {
      handler (newVal) {
        this.showModal = this.show
      },
      immediate: true
    }
  }
}
</script>
