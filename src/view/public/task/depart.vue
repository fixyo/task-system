<template>
<!--全部任务-->
<div id="task">
    <div class="indexBody">
        <div class="innerBody">
            <Tabs value="5" :animated="false"  @on-click="detail">
                <TabPane label="任务详情" name="0"></TabPane>
                <TabPane label="我发起的任务" name="1"></TabPane>
                <TabPane label="我接受的任务" name="2"></TabPane>
                <TabPane label="我执行的任务" name="3"></TabPane>
                <TabPane label="我关注的任务" name="4"></TabPane>
                <TabPane label="全部任务" name="5"></TabPane>
                <TabPane label="待审任务" name="6"></TabPane>
                <TabPane label="悬赏任务" name="7"></TabPane>
                <TabPane label="部门任务" name="8"></TabPane>
                <TabPane label="月度评审" name="9"></TabPane>
            </Tabs>
        </div>
    </div>
</div>
</template>

<script>
export default {
  name: 'taskDtail',
  data () {
    return {

    }
  },
  methods: {
    detail (name) {
      switch (name) {
        case '0':
          this.$router.push({
            name: 'taskDetail'
          })
          break
        case '1':
          this.$router.push({
            name: 'taskPropose'
          })
          break
        case '2':
          this.$router.push({
            name: 'taskAccept'
          })
          break
        case '3':
          this.$router.push({
            name: 'taskExcute'
          })
          break
        case '4':
          this.$router.push({
            name: 'taskFocus'
          })
          break
        case '5':
          this.$router.push({
            name: 'taskAll'
          })
          break
        case '6':
          this.$router.push({
            name: 'taskPending'
          })
          break
        case '7':
          this.$router.push({
            name: 'taskReward'
          })
          break
        case '8':
          this.$router.push({
            name: 'taskDepart'
          })
          break
        case '9':
          this.$router.push({
            name: 'taskMonthly'
          })
          break
      }
    }
  }
}
</script>
