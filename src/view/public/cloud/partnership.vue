<template>
    <div class="cloudCooper">
        <Tabs value="1" tab="outTable" @on-click="handleClick" :animated="false">
            <TabPane label="产品公司" name="1">
               <productCompany></productCompany>
            </TabPane>
            <TabPane label="渠道公司" name="2">
                <channelCompany></channelCompany>
            </TabPane>
            <TabPane label="合同库" name="3">
                <contractBank></contractBank>
            </TabPane>
            <TabPane label="产品库" name="4">
              <productBank></productBank>
            </TabPane>
            <TabPane label="产品链接库" name="5">
              <productLink></productLink>
            </TabPane>
            <TabPane label="待审核信息" name="6">
              <toAuditInform></toAuditInform>
            </TabPane>
        </Tabs>
    </div>
</template>

<script>
import productCompany from './parter/productCompany'// 产品公司
import channelCompany from './parter/channelCompany'// 渠道公司
import contractBank from './parter/contractBank'// 合同库
import productBank from './parter/productBank'// 产品链接库
import productLink from './parter/productLink'// 产品链接库
import toAuditInform from './parter/toAuditInform'// 产品链接库
export default {
  name: 'partnership',
  components: {
    productCompany,
    channelCompany,
    contractBank,
    productLink,
    toAuditInform,
    productBank
  },
  data () {
    return { }
  },
  mounted () {
    // this.getListData()
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

          break
        case '4':

          break
        case '5':

          break
        case '6':

          break
      }
    }
  }
}
</script>

<style lang="less" scoped>
.cooperTable{
    .space{
        margin-right: 5px;
    }
}
.actionDiv{
    margin-bottom:10px;
    .searInput{
        width:200px;
    }
}
</style>
