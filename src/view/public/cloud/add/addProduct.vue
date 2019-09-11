<template>
<!--新增产品公司-->
<div class="cloudCooper">
    <Tabs value="1" tab="outTable" :animated="false">
        <TabPane label="产品公司" name="1">
            <!--公司信息 厂商为公司-->
            <Form ref="companyInfo" :model="companyInfo" :rules="ruleCompanyInfo">
                <div class="detailContent">
                    <Row class="rowPadding">
                        <Col span="12" offset="3" class="cardTitle">公司信息</Col>
                    </Row>
                    <!--商务 公司/个人-->
                    <Row class="rowPadding">
                        <Col span="3" offset="3" class="title">
                            <i class="require">*</i>商务：
                        </Col>
                        <Col span="5">
                            <FormItem prop="businessId">
                                <Select v-model="companyInfo.businessId" clearable filterable>
                                    <Option v-for="person in companyInfo.incumbencyTbUser" :value="person.id" :key="person.id">{{person.nickname}}</Option>
                                </Select>
                            </FormItem>
                        </Col>

                        <Col span="3" class="title">
                            <i class="require">*</i>公司/个人：
                        </Col>
                        <Col span="5">
                            <FormItem prop="companyType">
                                <Select v-model="companyInfo.companyType" clearable filterable @on-change = "choseCompanyType">
                                    <Option v-for="item  in companyInfo.companyTypeList" :value="item.id" :key="item.id">{{item.name}}</Option>
                                </Select>
                            </FormItem>
                        </Col>
                    </Row>
                    <!--是个人  姓名 身份证号-->
                    <Row class="rowPadding" v-if="person">
                        <Col span="3" offset="3" class="title">
                            <i class="require">*</i>姓名：
                        </Col>
                        <Col span="5">
                            <FormItem prop="companyName">
                                <Input v-model="companyInfo.companyName" placeholder="请输入姓名" clearable filterable></Input>
                            </FormItem>
                        </Col>

                        <Col span="3" class="title">
                            <i class="require">*</i>身份证号：
                        </Col>
                        <Col span="5">
                            <FormItem prop="companyCard">
                                <Input v-model="companyInfo.companyCard" placeholder="请输入身份证号" clearable filterable></Input>
                            </FormItem>
                        </Col>
                    </Row>
                    <!--是个人  对方联系地址 详细地址-->
                    <Row class="rowPadding" v-if="person">
                        <Col span="3" offset="3" class="title">
                            <i class="require">*</i>对方联系地址：
                        </Col>
                        <Col span="5">
                            <FormItem prop="busicityList">
                            <!--
                                <Input v-model="companyInfo.busicityList" placeholder="请输入对方联系地址" clearable filterable></Input>
                            -->
                            <Cascader :data="companyInfo.busicityListData" v-model="companyInfo.busicityList"></Cascader>
                            </FormItem>
                        </Col>

                        <Col span="3" class="title">
                            <i class="require">*</i>详细地址：
                        </Col>
                        <Col span="5">
                            <FormItem prop="detailedAddress">
                                <Input v-model="companyInfo.detailedAddress" placeholder="请输入详细地址" clearable filterable></Input>
                            </FormItem>
                        </Col>
                    </Row>
                        <!--是个人 区域类型-->
                    <Row class="rowPadding" v-if="person">
                        <Col span="3" offset="3" class="title">
                            <i class="require">*</i>区域类型：
                        </Col>
                        <Col span="6">
                            <FormItem prop="regionId">
                                <Select v-model="companyInfo.regionId" clearable filterable style="width:200px;margin-right: 5px;">
                                    <Option v-for="item in companyInfo.regionList" :value="item.id" :key="item.id">{{item.areaName}}</Option>
                                </Select>
                                <Button shape="circle" icon="ios-more" @click="setRegion"></Button>
                            </FormItem>
                        </Col>
                    </Row>

                    <!--公司名称 对方联系地址-->
                    <Row class="rowPadding" v-if="!person">
                        <Col span="3" offset="3" class="title">
                            <i class="require">*</i>公司名称：
                        </Col>
                        <Col span="5">
                            <FormItem prop="companyName">
                                <Input v-model="companyInfo.companyName" placeholder="请输入公司名称" clearable filterable></Input>
                            </FormItem>
                        </Col>

                        <Col span="3" class="title">
                            <i class="require">*</i>对方联系地址：
                        </Col>
                        <Col span="5">
                            <FormItem prop="busicityList">
                            <!--
                                <Input v-model="companyInfo.busicityList" placeholder="请输入对方联系地址" clearable filterable></Input>
                            -->
                            <Cascader :data="companyInfo.busicityListData" v-model="companyInfo.busicityList"></Cascader>
                            </FormItem>
                        </Col>
                    </Row>

                    <!--详细地址 区域类型-->
                    <Row class="rowPadding" v-if="!person">
                        <Col span="3" offset="3" class="title">
                            <i class="require">*</i>详细地址：
                        </Col>
                        <Col span="5">
                            <FormItem prop="detailedAddress">
                                <Input v-model="companyInfo.detailedAddress" placeholder="请输入详细地址" clearable filterable></Input>
                            </FormItem>
                        </Col>

                        <Col span="3" class="title">
                            <i class="require">*</i>区域类型：
                        </Col>
                        <Col span="6">
                            <FormItem prop="regionId">
                                <Select v-model="companyInfo.regionId" clearable filterable style="width:200px;margin-right: 5px;">
                                    <Option v-for="item in companyInfo.regionList" :value="item.id" :key="item.id">{{item.areaName}}</Option>
                                </Select>
                                <Button shape="circle" icon="ios-more" @click="setRegion"></Button>
                            </FormItem>
                        </Col>
                    </Row>

                    <!--公司性质-->
                    <Row class="rowPadding" v-if="!person">
                        <Col span="3" offset="3" class="title">
                            <i class="require">*</i>公司性质：
                        </Col>
                        <Col span="5">
                            <FormItem prop="corporateNature">
                                <Select v-model="companyInfo.corporateNature" clearable filterable>
                                    <Option v-for="item in companyInfo.corporateNatureList" :value="item.id" :key="item.id">{{item.name}}</Option>
                                </Select>
                            </FormItem>
                        </Col>
                    </Row>
                </div>

            </Form>
            <!--联系人列表-->
            <div class="detailContent">
                <addContract @getContractMsg="getContractMsg" ></addContract>
            </div>
            <!--开票信息-->
            <div class="detailContent">
                <invoiceInfo @getInvoiceMsg="getInvoiceMsg"></invoiceInfo>
            </div>
            <!--主要业务-->
            <div class="detailContent">
                <Row class="rowPadding">
                    <Col span="12" offset="3" class="cardTitle">主要业务</Col>
                </Row>
                <!--业务名称 业务类型-->
                <Row class="rowPadding" v-for="(addItem,key) in mainBusi.busiTimes" :key="key">
                    <Col span="3" offset="3" class="title">
                        <i class="require">*</i>业务名称：
                    </Col>
                    <Col span="5">
                        <Input v-model="mainBusi.busiTimes[key].businessName" placeholder="请输入业务名称" clearable filterable></Input>
                    </Col>

                    <Col span="3" class="title">
                        <i class="require">*</i>业务类型：
                    </Col>
                    <Col span="7">
                        <Select v-model="mainBusi.busiTimes[key].businessType" clearable filterable style="width:319px;margin-right: 5px;">
                            <Option v-for="item in mainBusi.busTypeList" :value="item.id" :key="item.id">{{item.title}}</Option>
                        </Select>
                        <Button shape="circle" icon="ios-more" @click="setRegion" style="margin-right: 5px;"></Button>
                        <Button shape="circle" icon="md-add" @click="addBusi" style="margin-right: 5px;"></Button>
                        <Button v-if="mainBusi.busiTimes.length>=2" shape="circle" icon="md-remove" @click="removeBusi(key)"></Button>
                    </Col>
                </Row>
            </div>
            <!--备注-->
            <div class="detailContent">
                <Row class="rowPadding">
                    <Col span="12" offset="3" class="cardTitle">备注</Col>
                </Row>
                    <!--备注-->
                <Row class="rowPadding" >
                    <Col span="5" offset="4">
                        <Input v-model="mainBusi.text" type="textarea" placeholder="请输入备注" clearable style="width:750px"></Input>
                    </Col>
                </Row>
            </div>
            <!--抄送人-->
            <div class="detailContent">
                <Row class="rowPadding">
                    <Col span="12" offset="3" class="cardTitle">抄送人</Col>
                </Row>
                    <!--抄送人-->
                <Row class="rowPadding" >
                    <Col span="17" offset="4">
                        <Icon type="ios-add-circle-outline" size="50" @click="showNotice=true" style="margin-top: 22px; color: #CCC;"/>
                        <div  v-for="(item,index) in this.mainBusi.copierName" :key="index" style="float: left;margin-right: 15px;">
                            <Icon type="md-close" style="color: red; position: relative;left: 33px;top: 12px;cursor: pointer;" @click="deletCopier(index)"/>
                            <Icon type="ios-contacts" size="50" @click="showNotice=true" style="display: block;"></Icon>
                            <p style="">{{item+'  '||'抄送人'}}</p>
                        </div>
                    </Col>
                </Row>
            </div>
            <!--通知人弹窗-->
            <Modal  :mask-closable="false" id="addNotice" v-model="showNotice" title="通知人">
                <Select v-model="mainBusi.copier" filterable multiple :label-in-value="true" @on-change="getNoticeName">
                    <Option v-for="person in companyInfo.incumbencyTbUser" :key="person.id" :value="person.id" :label="person.nickname">
                        <div>
                            <p>{{person.nickname}}</p>
                            <p>部门：{{person.deptName}}</p>
                            <p>职位：{{person.positionName}}</p>
                        </div>
                    </Option>
                </Select>
            </Modal>
            <!--操作按钮-->
            <div class="detailContent">
                <Row class="rowPadding">
                    <Col span="12" offset="10">
                        <Button type="warning" @click="goBack" style="margin-right:30px">返回</Button>
                        <Button type="primary" @click="saveNewPro('companyInfo')">保存</Button>
                    </Col>
                </Row>
            </div>
        </TabPane>
    </Tabs>
</div>
</template>

<script>
import { phpURL, baseUrl } from '@/api/base.js'
import addContract from '../component/addContract'
import invoiceInfo from '../component/invoiceInfo'

export default {
  name: 'addProduct',
  components: {
    addContract,
    invoiceInfo
  },
  data () {
    return {
      person: false, // 产品公司类型为个人
      showNotice: false, // 通知人弹窗
      // 公司信息
      companyInfo: {
        businessId: '', // 商务id
        incumbencyTbUser: [], // 商务列表
        companyType: '', // 公司或个人  1为公司2为个人
        companyTypeList: [{id: '1', name: '公司'}, {id: '2', name: '个人'}],
        companyName: '', // 公司名称
        busicityList: [], // 对方联系地址
        busicityListData: [],
        detailedAddress: '', // 详细地址
        regionId: '', // 区域类型id
        regionList: [], // 区域类型list
        corporateNature: '', // 公司性质 1为官方2为代理
        corporateNatureList: [{id: '1', name: '官方'}, {id: '2', name: '代理'}], // 公司性质列表
        companyCard: ''// 身份证号
      },
      // 公司信息表单验证规则
      ruleCompanyInfo: {
        businessId: [{required: true, message: '必填项且搜索后选择哦'}],
        companyType: [{required: true, message: '必填项哦'}],
        companyName: [{required: true, message: '必填项哦'}],
        companyCard: [{required: true, message: '必填项哦'}],
        busicityList: [{required: true, message: '必填项哦'}],
        detailedAddress: [{required: true, message: '必填项哦'}],
        regionId: [{required: true, message: '必填项哦'}],
        corporateNature: [{required: true, message: '必填项哦'}]
      },
      // 联系人列表
      contacts: {
        tabaleData: []
      },
      // 开票信息
      invoice: {
        tabaleData: []
      },
      // 主要业务
      mainBusi: {
        busiTimes: [{
          businessName: '', // 业务名称
          businessType: ' ' // 业务类型id
        }],
        businessName: '',
        businessType: ' ',
        busTypeList: [], // 业务类型list
        text: '', // 备注
        copier: [], // 抄送人id
        copierName: []// 抄送人姓名 用于显示
      }
    }
  },
  mounted () {
    this.getData()
  },
  methods: {
    // 获取初始数据
    getData () {
      // 获取省市区
      this.$axios({
        url: baseUrl + '/Auditing/Busicity',
        method: 'post'
      }).then(res => {
        if (res.data.code === 10000) {
          this.companyInfo.busicityListData = res.data.content
        } else {
          this.$Message.error(res.data.msg)
        }
      }).catch(err => {
        console.error(err)
      })
      // 在职人员
      this.$axios({
        url: baseUrl + '/user/getIncumbencyTbUser',
        method: 'post'
      }).then(res => {
        if (res.data.code === 10000) {
          this.companyInfo.incumbencyTbUser = res.data.content
        } else {
          this.$Message.error(res.data.msg)
        }
      }).catch(err => {
        console.error(err)
      })
      // 获取区域类型
      this.$axios({
        url: phpURL + '/cloud/areaList',
        method: 'get'
      }).then(res => {
        if (res.data.code === 10000) {
          this.companyInfo.regionList = res.data.content
        } else {
          this.$Message.error(res.data.msg)
        }
      }).catch(err => {
        console.log(err.data)
      })

      // 业务类型
      this.$axios({
        url: phpURL + '/cloud/busTypeList',
        method: 'post'
      }).then(res => {
        if (res.data.code === 10000) {
          this.mainBusi.busTypeList = res.data.content
        } else {
          this.$Message.error(res.data.msg)
        }
      }).catch(err => {
        console.error(err)
      })
    },
    // 产品公司选择 1为公司 2为个人
    choseCompanyType () {
      if (this.companyInfo.companyType === '1') {
        this.person = false
      } else if (this.companyInfo.companyType === '2') {
        this.person = true
      }
      this.companyInfo.companyCard = ''
    },
    // 跳转到设置区域类型页面
    setRegion () {
      this.$router.push({
        name: 'cloudConfig'
      })
    },
    // 增加一列主要业务
    addBusi () {
      this.mainBusi.busiTimes.push({
        businessName: '', // 业务名称
        businessType: '' // 业务类型id
      })
    },
    // 删除一列主要业务
    removeBusi (key) {
      this.mainBusi.busiTimes.splice(key, 1)
    },
    // 按钮操作返回
    goBack () {
    //   bus.$emit('on-myclose', this.$route)
      this.$router.push({
        name: 'productCompany'
      })
    },
    // 获取新增联系人组件中新增的数据
    getContractMsg (data) {
      this.contacts.tabaleData = data
    },
    // 获取新增开票信息组件中新增的数据
    getInvoiceMsg (data) {
      this.invoice.tabaleData = data
    },
    // 根据通知人id 获得对应的通知人name
    getNoticeName (ids) {
      ids.map(item => {
        this.mainBusi.copierName.push(item.label)
        this.mainBusi.copierName = Array.from(new Set(this.mainBusi.copierName))
      })
    },
    // 删除抄送人
    deletCopier (index) {
      this.mainBusi.copier.splice(index, 1)
      this.mainBusi.copierName.splice(index, 1)
    },
    // 保存所有信息
    saveNewPro (companyInfo) {
      this.$refs.companyInfo.validate((valid) => {
        if (valid) {
        // 联系人都必填
          if (this.contacts.tabaleData.length >= 1) {
            if (this.companyInfo.companyType === '1') { // 是公司 开票信息必填
              if (this.invoice.tabaleData.length >= 1) {
                if (this.mainBusi.busiTimes[0].businessName !== '') {
                  let _c = this.companyInfo
                  let sendData = {
                  // 公司信息
                    productCompany: {
                      businessId: _c.businessId,
                      companyType: _c.companyType,
                      companyName: _c.companyName,
                      companyCard: _c.companyCard,
                      busicityList: _c.busicityList,
                      detailedAddress: _c.detailedAddress,
                      regionId: _c.regionId,
                      corporateNature: _c.corporateNature,
                      busiTimes: this.mainBusi.busiTimes, // 业务名称
                      text: this.mainBusi.text, // 备注
                      copier: this.mainBusi.copier//
                    },
                    Route: 'contractBank',
                    // 联系人
                    contacts: this.contacts.tabaleData,
                    // 发票
                    invoice: this.invoice.tabaleData
                  }
                  this.$axios({
                    url: baseUrl + '/productCompany/insert',
                    method: 'post',
                    data: sendData
                  }).then(res => {
                    if (res.data.code === 10000) {
                      bus.$emit('on-myclose', this.$route)
                      this.$router.push({
                        name: 'productCompany'
                      })
                      this.$Message.info(res.data.msg)
                    } else if (res.data.code === 10105) {
                      this.$Message.error(res.data.msg)
                    } else {
                      this.$Message.error(res.data.msg)
                    }
                  }).catch(err => {
                    console.error(err)
                  })
                } else {
                  this.$Message.error('主要业务必填哦')
                }
              } else { // 是个人开票信息不是必填
                this.$Message.error('发票信息必填哦')
              }
            } else {
              if (this.mainBusi.busiTimes[0].businessName !== '') {
                let _c = this.companyInfo
                let sendData = {
                // 公司信息
                  productCompany: {
                    businessId: _c.businessId,
                    companyType: _c.companyType,
                    companyName: _c.companyName,
                    companyCard: _c.companyCard,
                    busicityList: _c.busicityList,
                    detailedAddress: _c.detailedAddress,
                    regionId: _c.regionId,
                    corporateNature: _c.corporateNature,
                    busiTimes: this.mainBusi.busiTimes, // 业务名称
                    text: this.mainBusi.text, // 备注
                    copier: this.mainBusi.copier//
                  },
                  Route: 'contractBank',
                  // 联系人
                  contacts: this.contacts.tabaleData,
                  // 发票
                  invoice: this.invoice.tabaleData
                }
                this.$axios({
                  url: baseUrl + '/productCompany/insert',
                  method: 'post',
                  data: sendData
                }).then(res => {
                  if (res.data.code === 10000) {
                    this.$Message.info(res.data.msg)
                    bus.$emit('on-myclose', this.$route)
                    this.$router.push({
                      name: 'productCompany'
                    })
                  } else if (res.data.code === 10105) {
                    this.$Message.error(res.data.msg)
                  } else {
                    this.$Message.error(res.data.msg)
                  }
                }).catch(err => {
                  console.error(err)
                })
              } else {
                this.$Message.error('主要业务必填哦')
              }
            }
          } else {
            this.$Message.error('联系人必填哦')
          }
        } else {
          this.$Message.error('有必填项未填写哦')
        }
      })
    }
  }
}
</script>
<style lang="less">
//增加通知人弹窗
#addNotice{
    .ivu-modal-footer Button:first-child{
        color: #19aa8d;
        background-color: #fff;
        border-color: #19aa8d;
    }
    //选择框
    .ivu-select-selection:hover {
        border-color: #19AA8D;
        outline:none;
    }
    .ivu-select-selection:focus {
        border-color: #19AA8D;
        outline: none;
        box-shadow:none;
    }
    .ivu-select-visible .ivu-select-selection{
        border-color: #19AA8D;
        outline: none;
        box-shadow:none;
    }
    .ivu-select-multiple .ivu-select-item-selected {
        color: #19aa8d;
        background: #fff;
    }
    .ivu-select-multiple .ivu-select-item-selected:after{
        color: #19aa8d;
    }

}
//增加联系人弹窗
#addContract{
    .ivu-modal{
        width: 800px !important;
    }
    .ivu-modal-footer Button:first-child{
        color: #19aa8d;
        background-color: #fff;
        border-color: #19aa8d;
    }
    .title{
        text-align: right;
        line-height: 30px;
        margin-right: 10px;
    }
    .require{
        font-size: 17px;
        color: red;
        position: relative;
        top: 5px;
        right: 3px;
    }
    .rowPadding{
        margin-bottom:20px;
    }
    //输入框
    .ivu-input:hover {
        border-color: #19AA8D;
    }
    .ivu-input:focus {
        border-color: #19AA8D;
        outline: 0;
        box-shadow:none;
    }
}
</style>
<style lang="less" scoped>

</style>
