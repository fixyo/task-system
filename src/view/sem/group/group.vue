<template>
  <div class="pagePadding">
    <Tabs type="card" v-model="tabsType" :animated="false">
      <TabPane border label="推广组" name="extension">
        <extension />
      </TabPane>
      <TabPane border label="关键词" name="keywords">
        <keywords />
      </TabPane>
      <TabPane border label="产品否定词" name="product">
        <software />
      </TabPane>
    </Tabs>
  </div>
</template>
<script>
import extension from './extension/extension'
import keywords from './keywords/keywords'
import software from './software/softwareList'
export default {
  name: 'semExtension',
  components: {
    extension,
    keywords,
    software
  },
  data () {
    return {
      tabsType: 'extension'
    }
  }
}
</script>
