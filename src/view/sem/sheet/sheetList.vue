<template>
  <div class="pagePadding" :class="isFullScreen?'fullScreen':''">
    <Tabs type="card" v-model="tabsType" :animated="false">
      <TabPane border label="每日" name="semDayList">
        <SemDayList :isFullScreen.sync="isFullScreen" v-if="tabsType==='semDayList'" />
      </TabPane>
      <TabPane border label="小时" name="semHourList">
        <SemHourList :isFullScreen.sync="isFullScreen" v-if="tabsType==='semHourList'" />
      </TabPane>
      <TabPane border label="责任人" name="semPersonList">
        <SemPersonList :isFullScreen.sync="isFullScreen" v-if="tabsType==='semPersonList'" />
      </TabPane>
    </Tabs>
  </div>
</template>
<script>
import SemDayList from './SemDayList.vue'
import SemHourList from './SemHourList.vue'
import SemPersonList from './SemPersonList.vue'
export default {
  name: 'semSheet',
  components: {
    SemDayList,
    SemHourList,
    SemPersonList
  },
  data () {
    return {
      tabsType: 'semDayList',
      isFullScreen: false
    }
  }
}
</script>
<style>
.pagePadding.fullScreen {
  position: fixed;
  width: 100vw;
  height: 100vh;
  z-index: 901;
  left: 0;
  top: 0;
  margin: 0;
  padding: 10px;
}
</style>
