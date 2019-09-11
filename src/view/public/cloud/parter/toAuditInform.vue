<template>
  <!-- 这是待审核信息 -->
<div class="cloudCooper">
    <Tabs value="6" tab="outTable" @on-click="handleClick" :animated="false">
        <TabPane label="产品公司" name="1">
        </TabPane>
        <TabPane label="渠道公司" name="2">
        </TabPane>
        <TabPane label="合同库" name="3">
        </TabPane>
        <TabPane label="产品库" name="4">
        </TabPane>
        <TabPane label="产品链接库" name="5">
        </TabPane>
        <TabPane label="待审核信息" name="6">
            <Tabs type="card" name="1" :animated="false" tab="innerTable">
                <TabPane label="待审核合同" name="1">
                    <toAudContract></toAudContract>
                </TabPane>
                <TabPane label="待审核上线" name="2">
                    <toAudOnline></toAudOnline>
                </TabPane>
            </Tabs>
        </TabPane>
    </Tabs>
</div>

</template>

<script>
// import { phpURL, baseUrl } from '@/api/base.js'
import toAudContract from './toAuditContract' // 待审核合同
import toAudOnline from './toAuditOnline' // 待审核合同
export default {
  name: 'toAuditInform',
  components: {
    toAudContract,
    toAudOnline
  },
  data () {
    return {}
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
