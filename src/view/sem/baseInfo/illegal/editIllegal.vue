<template>
  <div>
    <Modal
      v-model="showModal"
      :mask-closable="false"
      :title="config.title"
      :loading="loading"
      @on-ok="submit"
      @on-cancel="closeModal"
    >
      <Form :label-width="80" ref="illegal" :model="data" :rules="validate">
        <FormItem label="黑名单词" prop="title">
          <h4 v-if="config.title==='查看'">{{data.title}}</h4>
          <Input v-else v-model="data.title"></Input>
        </FormItem>
        <FormItem label="类别" prop="type">
          <h4 v-if="config.title==='查看'">{{data.type}}</h4>
          <!-- <Input v-else v-model="data.type"></Input> -->
          <Select v-else v-model="data.type">
            <Option v-for="(item,index) in selection" :value="item" :key="index">{{ item }}</Option>
          </Select>
        </FormItem>
        <FormItem label="备注" prop="sum">
          <h4 v-if="config.title==='查看'">{{data.sum}}</h4>
          <Input v-else v-model="data.sum"></Input>
        </FormItem>
      </Form>
    </Modal>
  </div>
</template>
<script>
import { semUrl } from '@/api/base.js'
export default {
  name: 'editIllegal',
  props: {
    show: Boolean,
    config: Object,
    propData: Object
  },
  mounted () {
    if (this.config.title === '编辑' || this.config.title === '查看') {
      this.data = this.propData
    }
    this.getIllegalTypeList()
  },
  data () {
    return {
      loading: true,
      showModal: this.show,
      data: {
        title: '',
        type: '',
        sum: ''
      },
      selection: [],
      validate: {
        title: [{ required: true, message: '必填', trigger: 'change' }],
        type: [{ required: true, message: '必填', trigger: 'change' }]
      }
    }
  },
  methods: {
    closeModal () {
      this.$emit('update:show', false)
    },
    updataList () {
      this.$emit('updataList')
    },
    // 获取违禁词库列表下拉列表
    getIllegalTypeList () {
      this.$axios({
        url: semUrl + '/Market/getIllegalWordTag'
      }).then(res => {
        if (res.data.code === 10000) {
          this.selection = res.data.data
        } else {
          this.$Message.error(res.data.msg)
        }
      })
    },
    // 保存
    submit () {
      this.$refs.illegal.validate(v => {
        if (this.config.title === '新增') {
          this.$axios({
            url: semUrl + '/Banword/saveBanword',
            method: 'post',
            data: $qs.stringify(this.data)
          }).then(res => {
            if (res.data.code === 10000) {
              this.$Message.success(res.data.msg)
              this.closeModal()
              this.updataList()
            } else {
              this.$Message.error(res.data.msg)
            }
          })
        } else if (this.config.title === '编辑') {
          this.$axios({
            url: semUrl + '/Banword/uptBanword',
            method: 'post',
            data: $qs.stringify(this.data)
          }).then(res => {
            if (res.data.code === 10000) {
              this.$Message.success(res.data.msg)
              this.closeModal()
              this.updataList()
            } else {
              this.$Message.error(res.data.msg)
            }
          })
        } else {
          this.closeModal()
        }
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
