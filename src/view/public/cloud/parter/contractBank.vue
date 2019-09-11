<template>
  <!-- 这是合同库 -->
<div class="cloudCooper">
    <Tabs value="3" tab="outTable" @on-click="handleClick" :animated="false">
        <TabPane label="产品公司" name="1">
        </TabPane>
        <TabPane label="渠道公司" name="2">
        </TabPane>
        <TabPane label="合同库" name="3">
            <Tabs type="card" name="1" :animated="false" tab="innerTable">
                <TabPane label="已签订" name="1">
                    <signed></signed>
                </TabPane>
                <TabPane label="待签订" name="2">
                    <waitSign></waitSign>
                </TabPane>
            </Tabs>
        </TabPane>
        <TabPane label="产品库" name="4">
        </TabPane>
        <TabPane label="产品链接库" name="5">
        </TabPane>
        <TabPane label="待审核信息" name="6">
        </TabPane>
    </Tabs>
</div>

</template>

<script>
import waitSign from '../component/waiSign'
import signed from '../component/signed'
export default {
  name: 'contractBank',
  components: {
    waitSign,
    signed
  },
  data () {
    return {
      toSigns: 0
    }
  },
  methods: {
    handleClick (name) {
      switch (name) {
        case '1':
          this.$router.push({
            name: 'productCompany'
          })
          break
        case '2':
          this.$router.push({
            name: 'channelCompany'
          })
          break
        case '3':
          this.$router.push({
            name: 'contractBank'
          })
          break
        case '4':
          this.$router.push({
            name: 'productBank'
          })
          break
        case '5':
          this.$router.push({
            name: 'productLink'
          })
          break
        case '6':
          this.$router.push({
            name: 'toAuditInform'
          })
          break
      }
    }
  }

}
</script>
<style>
</style>
