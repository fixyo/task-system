<template>
  <div class="pagePadding">
    <Tabs type="card" v-model="tabsType" :animated="false">
      <TabPane border label="黑名单词库" name="illegal">
        <illegal v-if="tabsType==='illegal'"></illegal>
      </TabPane>
      <TabPane border label="短语模板" name="shortModel">
        <showModel v-if="tabsType==='shortModel'"></showModel>
      </TabPane>
      <TabPane border label="模板配置" name="myTemplate">
        <myTemplate v-if="tabsType==='myTemplate'"></myTemplate>
      </TabPane>
      <TabPane border label="否定关键词" name="negative">
        <negativeKeywords v-if="tabsType==='negative'"></negativeKeywords>
      </TabPane>
    </Tabs>
  </div>
</template>
<script>
import illegal from './illegal/illegal'
import showModel from './shortModel/shortModel'
import myTemplate from './template/myTemplate'
import negativeKeywords from './negativeKeywords/negative'
export default {
  name: 'baseInfo',
  components: {
    showModel,
    illegal,
    myTemplate,
    negativeKeywords
  },
  data () {
    return {
      tabsType: 'illegal'
    }
  }
}
</script>
<style lang="less" scoped>
</style>
