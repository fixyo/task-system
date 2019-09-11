<template>
  <Form inline :label-width="80" label-position="right" :model="detail">
    <Row>
      <Col span="12">
        <FormItem label="日期：">
          <p class="half">{{detail.rewardTime}}</p>
        </FormItem>
      </Col>
      <Col span="12">
        <FormItem label="类型：">
          <p class="half">{{detail.initiationDetailed}}</p>
        </FormItem>
      </Col>
    </Row>
    <Row>
      <Col span="12">
        <FormItem label="当事人：">
          <p class="half">{{detail.nickName}}</p>
        </FormItem>
      </Col>
      <Col span="12">
        <FormItem label="分数：">
          <p class="half">{{detail.score}}</p>
        </FormItem>
      </Col>
    </Row>
    <Row>
      <Col span="12">
        <FormItem label="连带人员：">
          <p class="half">{{detail.relateName}}</p>
        </FormItem>
      </Col>
      <Col span="12">
        <FormItem label="发起人：">
          <p class="half">{{detail.initiatorName}}</p>
        </FormItem>
      </Col>
    </Row>
    <Row>
      <Col span="24">
        <FormItem label="事项：">
          <p class="full">{{detail.reason}}</p>
        </FormItem>
      </Col>
    </Row>
  </Form>
</template>
<script>
import { baseUrl } from '@/api/base.js'
export default {
  name: 'rewardDetail',
  props: {
    row: {
      type: Object
    },
    rewardDetailId: {
      type: [Number, String]
    }
  },
  data () {
    return {
      detail: {
        initiationDetailed: '',
        initiatorName: '',
        nickName: '',
        reason: '',
        relateName: '', // 连带人员
        rewardTime: '', //
        score: ''
      }
    }
  },
  watch: {
    rewardDetailId (newV, oldV) {
      this.$axios({
        url: baseUrl + '/reward/getDetail',
        method: 'post',
        data: $qs.stringify({ id: newV })
      })
        .then(res => {
          if (res.data.code === 10000) {
            this.detail = res.data.content
          }
        })
        .catch(err => {
          console.log('getDetail', err)
        })
    }
  }
}
</script>
<style scoped>
.helf {
  width: 50%;
}
.full {
  width: 100%;
}
</style>
