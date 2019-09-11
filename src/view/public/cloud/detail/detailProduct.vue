<template>
<!--产品公司详情-->
<div class="cloudCooper">
    <Tabs value="1" tab="outTable" :animated="false">
        <TabPane label="产品公司" name="1">
            <!--产品公司详情-->
            <detailComponent></detailComponent>
            <br>
            <!--合同详情-->
            <contractComponent></contractComponent>
            <br>
            <!--产品详情-->
            <productComponent></productComponent>
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
import detailComponent from '../component/product/detailComponent'
import contractComponent from '../component/product/contractComponent'
import productComponent from '../component/product/productComponent'
export default {
  name: 'detaileProduct',
  components: {
    detailComponent,
    contractComponent,
    productComponent
  },
  data () {
    return {

    }
  },
  methods: {
    goBack () {
      bus.$emit('on-myclose', this.$route)
      this.$router.push({
        name: 'productBank'
      })
    }
  }
}
</script>
<style lang="less" scope>

</style>
