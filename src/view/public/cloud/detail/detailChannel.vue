<template>
<!--渠道公司详情-->
<div class="cloudCooper">
    <Tabs value="1" tab="outTable" :animated="false">
        <TabPane label="渠道公司" name="1">
            <!--渠道公司-->
            <channelCompnent></channelCompnent>
            <!--合同库-->
            <contractComponent></contractComponent>
             <!--操作按钮-->
            <div class="detailContent">
                <Row class="rowPadding">
                    <Col span="6" offset="11" >
                        <Button type="warning" @click="goBack" style="margin-right:30px">返回</Button>
                    </Col>
                </Row>
            </div>
        </TabPane>
    </Tabs>
</div>
</template>

<script>
import channelCompnent from '../component/product/channelCompnent'
import contractComponent from '../component/product/contractComponent'
export default {
  name: 'detaileChannel',
  components: {
    channelCompnent,
    contractComponent
  },
  data () {
    return {

    }
  },
  methods: {
    goBack () {
      bus.$emit('on-myclose', this.$route)
      this.$router.push({
        name: 'channelCompany'
      })
    }
  }
}
</script>

<style lang="less" scope>

</style>
