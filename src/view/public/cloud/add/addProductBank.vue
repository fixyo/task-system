<template>
  <!-- 这是新增产品库 -->
  <div class="cloudCooper">
    <!-- 基础信息 -->
     <Tabs value="1" tab="outTable" :animated="false">
        <TabPane label="产品" name="1">
            <Form ref="productBank" :model="productBank" :rules="ruleProductBank">
            <div class="detailContent">
                <Row class="rowPadding">
                    <Col span="12" offset="3" class="cardTitle">基础信息</Col>
                </Row>
                <div class="detailContent">
                    <Row class="rowPadding">
                    <Col span="3"  offset="3" class="title">
                        <i class="require">*</i>产品名称 :
                    </Col>
                    <Col span="5">
                        <FormItem prop="commodityName">
                        <Input v-model="productBank.commodityName" placeholder="请输入产品名称"  clearable filterable/>
                        </FormItem>
                    </Col>
                    <Col span="3" class="title">
                        <i class="require">*</i>公司名称 :
                    </Col>
                    <Col span="5">
                    <FormItem prop="productCompany">
                        <Select v-model="productBank.productCompany" clearable filterable @on-change="getContract">
                        <Option
                            v-for="item in productBank.productCompanyList"
                            :value="item.productCompanyId"
                            :key="item.productCompanyId"
                        >{{ item.companyName }}</Option>
                        </Select>
                        </FormItem>
                    </Col>
                    </Row>
                    <Row class="rowPadding">
                    <Col span="3"  offset="3" class="title">
                        <i class="require">*</i>结算方式 :
                    </Col>
                    <Col span="5">
                        <FormItem prop="settlement">
                        <Select v-model="productBank.settlement" clearable filterable>
                        <Option
                            v-for="item in settlementList"
                            :value="item.value"
                            :key="item.value"
                        >{{ item.label }}</Option>
                        </Select>
                        </FormItem>
                    </Col>
                    <Col span="3" class="title">
                        <i class="require">*</i>结算周期 :
                    </Col>
                    <Col span="5">
                        <FormItem prop="cycle">
                        <Select v-model="productBank.cycle" clearable filterable>
                        <Option
                            v-for="item in cycleList"
                            :value="item.value"
                            :key="item.value"
                        >{{ item.label }}</Option>
                        </Select>
                        </FormItem>
                    </Col>
                    </Row>
                    <!-- 安装 -->
                    <div v-if="productBank.settlement == '1'">
                    <Row class="rowPadding">
                        <Col span="3"  offset="3" class="title">
                        <i class="require">*</i>进价 :
                        </Col>
                        <Col span="5">
                        <FormItem prop="purchasePrice">
                        <Input v-model="productBank.purchasePrice"   clearable filterable/>
                        </FormItem>
                        </Col>
                        <Col span="3"  class="title">建议出价 :</Col>
                        <Col span="5">
                        <Input v-model="productBank.proposalPrice"  clearable filterable/>
                        </Col>
                    </Row>
                    </div>
                    <!-- 充值 -->
                    <div v-if="productBank.settlement == '2'">
                    <Row class="rowPadding">
                        <Col span="3"  offset="3" class="title">
                        <i class="require">*</i>进价 :
                        </Col>
                        <Col span="5">
                        <FormItem prop="purchasePrice">
                        <Input v-model="productBank.purchasePrice"  clearable filterable/>
                        </FormItem>
                        </Col>
                        <Col span="3" class="title">建议出价 :</Col>
                        <Col span="5">
                        <Input v-model="productBank.proposalPrice"  clearable filterable/>
                        </Col>
                    </Row>
                    <Row class="rowPadding">
                        <Col span="3"  offset="3" class="title">
                        <i class="require">*</i>充值(%) :
                        </Col>
                        <Col span="5">
                        <FormItem prop="percentage">
                        <Input v-model="productBank.percentage"  clearable filterable/>
                        </FormItem>
                        </Col>
                        <Col span="3" class="title">
                        建议充值出价(%) :
                        </Col>
                        <Col span="5">
                        <Input v-model="productBank.proposalPercentage"   clearable filterable/>
                        </Col>
                    </Row>
                    </div>
                    <!-- 留存 -->
                    <div v-if="productBank.settlement == '3'">
                    <Row class="rowPadding">
                        <Col span="3"  offset="3" class="title">
                        <i class="require">*</i>进价 :
                        </Col>
                        <Col span="5">
                        <FormItem prop="purchasePrice">
                            <Input v-model="productBank.purchasePrice"  clearable filterable/>
                        </FormItem>
                        </Col>
                        <Col span="3" class="title">建议出价 :</Col>
                        <Col span="5">
                            <Input v-model="productBank.proposalPrice"  clearable filterable/>
                        </Col>
                    </Row>
                    <Row class="rowPadding">
                        <Col span="3"  offset="3" class="title">
                        <i class="require">*</i>留存 :
                        </Col>
                        <Col span="5">
                        <FormItem prop="retain">
                        <Input v-model="productBank.retain"  clearable filterable/>
                        </FormItem>
                        </Col>
                        <Col span="3" class="title">
                        建议留存出价 :
                        </Col>
                        <Col span="5">
                        <Input  v-model="productBank.proposalRetain" style="width: 265px" clearable filterable />
                        </Col>
                    </Row>
                    </div>
                    <!-- 分成 -->
                    <div v-if="productBank.settlement == '4'">
                    <Row class="rowPadding">
                        <Col span="3"  offset="3" class="title">
                        <i class="require">*</i>进价比(%):
                        </Col>
                        <Col span="5">
                        <FormItem prop="percentage">
                        <Input  v-model="productBank.percentage"   clearable filterable/>
                        </FormItem>
                        </Col>
                        <Col span="3" class="title">
                        建议出价比(%) :
                        </Col>
                        <Col span="5">
                        <FormItem prop="proposalPercentage">
                        <Input  v-model="productBank.proposalPercentage" clearable filterable />
                        </FormItem>
                        </Col>
                    </Row>
                    </div>
                    <Row class="rowPadding">
                    <Col span="3"  offset="3" class="title">
                        <i class="require">*</i>预收款项 :
                    </Col>
                    <Col span="5">
                    <FormItem prop="advance">
                        <Select v-model="productBank.advance" clearable filterable>
                        <Option
                            v-for="item in getMoneyList"
                            :value="item.value"
                            :key="item.value"
                        >{{ item.label }}</Option>
                        </Select>
                        </FormItem>
                    </Col>
                    <Col span="3"  class="title">
                        <i class="require">*</i>合同 :
                    </Col>
                    <Col span="5">
                    <FormItem prop="contractId">
                        <Select v-model="productBank.contractId" clearable filterable>
                        <Option
                            v-for="item in contractList"
                            :value="item.id"
                            :key="item.id"
                        >{{ item.contract }}</Option>
                        </Select>
                        </FormItem>
                    </Col>
                    </Row>
                </div>
            </div>
            <!-- 阶梯价 -->
            <div class="detailContent">
                <Row class="rowPadding">
                    <Col span="12" offset="3" class="cardTitle">阶梯价</Col>
                </Row>
                <div class="detailContent">
                    <Row v-for="(item,index) in productBank.Ladder" :key="index">
                    <Col span="2" offset="3" class="title">量级:</Col>
                    <Col span="3">
                        <Input v-model="item.magnitude" style="width: 100px"  clearable filterable/>(万)
                    </Col>
                    <Col span="2" class="title">单价:</Col>
                    <Col span="3">
                        <Input v-model="item.unitPrice" style="width: 100px"  clearable filterable/>(元)
                    </Col>
                    <Col span="2" class="title">建议出价:</Col>
                    <Col span="4">
                        <Input v-model="item.proposalPrice" style="width: 100px"  clearable filterable/>
                        <Button shape="circle" icon="md-add" @click="addLadder" style="margin:0px 0px 0px 5px"></Button>
                        <Button v-if="productBank.Ladder.length>=2" shape="circle" icon="md-remove" @click="removeLadder(index)"></Button>
                    </Col>
                    </Row>
                </div>
            </div>
            <!-- 链接信息 -->
            <div class="detailContent">
                <Row class="rowPadding">
                    <Col span="12" offset="3" class="cardTitle">链接信息</Col>
                </Row>
                <div class="detailContent">
                <Row  class="rowPadding">
                    <Col span="16" offset="4">
                        <span class="addContract" @click="addLinks">+新增链接</span>
                        <Table border :columns="productBank.LinkHeader" :data="productBank.LinkContent">
                        <template slot-scope="{ row, index }" slot="action">
                            <Button type="error" size="small" @click="removeLink(index)">删除</Button>
                        </template>
                        </Table>
                    </Col>
                </Row>
            </div>
            </div>
            <!-- 新增链接弹窗 -->
            <Modal :mask-closable="false" id="addNotice" v-model="showLink" title="新增链接" class="addlink" @on-ok="saveToTable">
            <Row>
                <Col span="3" offset="5" class="title">
                <i class="require">*</i>链接名称 :
                </Col>
                <Col span="10">
                    <Input v-model="productBank.linksName"  clearable filterable/>
                </Col>
            </Row>
            <Row>
                <Col span="3"  offset="5" class="title">
                <i class="require">*</i>产品链接 :
                </Col>
                <Col span="10">
                <Input v-model="productBank.productLinks"   clearable filterable/>
                </Col>
            </Row>
            <Row>
                <Col span="3"  offset="5" class="title">
                <i class="require">*</i>包体类型 :
                </Col>
                <Col span="10">
                <Select  v-model="productBank.enclaves"  style="width:170px" clearable filterable>
                    <Option v-for="item in bagTypeList"  :value="item.id" :key="item.id">{{ item.title }}</Option>
                </Select>
                <Button shape="circle" icon="ios-more-outline" @click="goCloudConfig"></Button>
                </Col>
            </Row>
            <Row>
                <Col span="3"  offset="5" class="title">
                <i class="require">*</i>后台类型 :
                </Col>
                <Col span="10">
                <Select v-model="productBank.backgroundType" :label-in-value="true" clearable filterable @on-change="getTypeName">
                    <Option
                    v-for="item in backTypeList"
                    :value="item.value"
                    :key="item.value"
                    >{{ item.label }}</Option>
                </Select>
                </Col>
            </Row>
            <Row v-if="productBank.backgroundType === 3 ||productBank.backgroundType === 4">
                <Col span="3"  offset="5" class="title">
                <i class="require">*</i>群名 :
                </Col>
                <Col span="10">
                <Input v-model="productBank.address"  clearable filterable/>
                </Col>
            </Row>
            <div v-if="productBank.backgroundType === 1 ||productBank.backgroundType === 2">
                <Row>
                <Col span="3"  offset="5" class="title">
                    <i class="require">*</i>网址 :
                </Col>
                <Col span="10">
                    <Input  v-model="productBank.address"   clearable filterable/>
                </Col>
                </Row>
                <Row>
                <Col span="3"  offset="5" class="title">
                    <i class="require">*</i>账号 :
                </Col>
                <Col span="10">
                    <Input v-model="productBank.userName"  clearable filterable/>
                </Col>
                </Row>
                <Row>
                <Col span="3"  offset="5" class="title">
                    <i class="require">*</i>密码 :
                </Col>
                <Col span="10">
                    <Input v-model="productBank.password"   clearable filterable/>
                </Col>
                </Row>
            </div>
            </Modal>
            <!-- 标签 -->
            <div class="detailContent">
                <Row class="rowPadding">
                    <Col span="12" offset="3" class="cardTitle">标签</Col>
                </Row>
                <div class="detailContent">
                    <Row v-for="(addItem,index) in productBank.label" :key="index">
                    <Col span="3"  offset="3" class="title">
                        <i class="require">*</i>一级类别 :
                    </Col>
                    <Col span="3">
                        <Select v-model="productBank.label[index].oneLabel" clearable filterable style="width:200px" @on-change="getSecondTagFun(index,productBank.label[index])" >
                        <Option v-for="item in productBank.getFirstTag" :value="item.id" :key="item.id">{{ item.tagName }}</Option>
                        </Select>
                        <span style="cursor: pointer;margin-left: 5px;">
                        </span>
                    </Col>
                    <Col span="3" offset="2" class="title">
                        <i class="require">*</i>二级类别 :
                    </Col>
                    <Col span="7">
                        <Select v-model="productBank.label[index].twoLabel" clearable filterable style="width:200px">
                        <Option v-for="item in productBank.getSecondTag[index]" :value="item.id" :key="item.id">{{ item.tagName }}</Option>
                        </Select>
                        <span style="cursor: pointer;margin-left: 5px;">
                        <Button shape="circle" icon="ios-more-outline" style="margin-right:5px;" @click="goCloudConfig"></Button>
                        <Button shape="circle" icon="md-add" @click="addLabel" style="margin-right:5px;"></Button>
                        <Button v-if="productBank.label.length>=2" shape="circle" icon="md-remove" @click="removeLable(index)"></Button>
                        </span>
                    </Col>
                    </Row>
                    <Row>
                    <Col span="3"  offset="3" class="title">
                        侧重标签 :
                    </Col>
                    <Col span="3">
                        <Select style="width:200px" v-model="productBank.emphasis" multiple clearable filterable >
                        <Option v-for="item in productBank.emphasisTagList" :value="item.id" :key="item.id">{{ item.title }}</Option>
                        </Select>
                        <span style="cursor: pointer;margin-left: 5px;">
                        </span>
                    </Col>
                    </Row>
                </div>
            </div>
            <!-- 抄送人 -->
            <div class="detailContent">
                <Row class="rowPadding">
                    <Col span="12" offset="3" class="cardTitle">抄送人</Col>
                </Row>
            </div>
            <div class="detailContent">
                <Row>
                    <Col span="17" offset="4">
                        <Icon type="ios-add-circle-outline" size="50" @click="showNotice=true" style="margin-top: 22px;color: #CCC;"/>
                        <div  v-for="(item,index) in this.productBank.copierName" :key="index" style="float: left;margin-right: 15px;">
                            <Icon type="md-close" style="color: red; position: relative;left: 33px;top: 12px;cursor: pointer;" @click="deletCopier(index)"/>
                            <Icon type="ios-contacts" size="50" @click="showNotice=true" style="display: block;color:#515a6e !important"></Icon>
                            <p style="">{{item+'  '||'抄送人'}}</p>
                        </div>
                    </Col>
                </Row>
            </div>
            <!--抄送人弹窗-->
            <Modal id="addNotice" :mask-closable="false" v-model="showNotice" title="抄送人">
                <Select v-model="productBank.copier"  filterable multiple :label-in-value="true" @on-change="getNoticeName">
                <Option v-for="person in productBank.incumbencyTbUser" :key="person.id" :value="person.id" :label="person.nickname">
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
                    <Button type="primary" @click="saveNewPro('productBank')">保存</Button>
                    </Col>
                </Row>
            </div>
            </Form>
        </TabPane>
    </Tabs>
  </div>
</template>

<script>
import { phpURL, baseUrl } from '@/api/base.js'
export default {
  data () {
    return {
      productBank: {
        incumbencyTbUser: [], // 在职人员
        copier: [], // 抄送人
        copierName: [], // 抄送人name
        commodityName: '', // 产品名称
        productCompanyId: '', // 产品公司id
        productCompanyList: [], // 产品公司list
        settlement: '', // 结算方式
        cycle: '', // 结算周期
        purchasePrice: '', // 进价
        proposalPrice: '', // 建议出价
        percentage: '', // 百分比
        proposalPercentage: '', // 建议百分比
        retain: '', // 留存
        proposalRetain: '', // 建议留存
        advance: '',
        advanceName: '', // 预收款项 传name
        contractId: '', // 合同 传id
        Ladder: [], // 阶梯价数组
        linksName: '', // 链接名称
        productLinks: '', // 产品链接
        enclaves: '', // 包体类型
        backgroundType: '', // 后台类型
        TypeName: '',
        address: '', // 网站 群名
        userName: '', // 账号
        password: '', // 密码
        // 链接信息表头
        LinkHeader: [
          {
            title: '序号',
            type: 'index',
            width: 70,
            align: 'center'
          },
          {
            title: '链接名称',
            key: 'linksName',
            align: 'center'
          },
          {
            title: '产品链接',
            key: 'productLinks',
            align: 'center'
          },
          {
            title: '后台类型',
            key: 'TypeName',
            align: 'center'
          },
          {
            title: '网址/群名',
            key: 'address',
            align: 'center'
          },
          {
            title: '账号',
            key: 'userName',
            align: 'center'
          },
          {
            title: '密码',
            key: 'password',
            align: 'center'
          },
          {
            title: '操作',
            slot: 'action',
            align: 'center'
          }
        ],
        LinkContent: [], // 链接信息表格内容
        links: [{
          linksName: '', // 链接名称
          productLinks: '', // 产品链接
          enclaves: '', // 包体类型
          backgroundType: ''// 后台类型
        }],
        label: [{
          oneLabel: '', // 一级标签
          twoLabel: ''// 二级标签
        }],
        getFirstTag: [], // 一级标签
        getSecondTag: [], // 二级标签
        emphasis: [], // 侧重标签
        emphasisTagList: []// 侧重标签List

      },
      // 必填验证
      ruleProductBank: {
        commodityName: [{required: true, message: '产品名称是必填项哦'}],
        productCompany: [{required: true, message: '公司名称是必填项哦'}],
        settlement: [{required: true, message: '结算方式是必填项哦'}],
        cycle: [{required: true, message: '是必填项哦'}],
        advance: [{required: true, message: '是必填项哦'}],
        purchasePrice: [{required: true, message: '是必填项哦'}],
        percentage: [
          {
            required: true, message: '是必填项哦'},
          {
            message: '只能是数字', trigger: 'change', pattern: /^(([1-9]\d{0,3})|0)(\.\d{0,2})?$/
          }],
        proposalPercentage: [
          {
            required: true, message: '是必填项哦'},
          {
            message: '只能是数字', trigger: 'change', pattern: /^(([1-9]\d{0,3})|0)(\.\d{0,2})?$/
          }],
        retain: [
          {
            required: true, message: '是必填项哦'},
          {
            message: '只能是数字', trigger: 'change', pattern: /^(([1-9]\d{0,3})|0)(\.\d{0,2})?$/
          }],
        contractId: [{required: true, message: '是必填项哦'}],
        magnitude: [
          {
            message: '只能是数字',
            trigger: 'change',
            pattern: /^(([1-9]\d{0,3})|0)(\.\d{0,2})?$/
          }],
        unitPrice: [
          {
            message: '只能是数字',
            trigger: 'change',
            pattern: /^(([1-9]\d{0,3})|0)(\.\d{0,2})?$/
          }],
        proposalRetain: [{
          message: '只能是数字',
          trigger: 'change',
          pattern: /^(([1-9]\d{0,3})|0)(\.\d{0,2})?$/
        }]
      },
      // 结算方式
      settlementList: [
        {
          value: '1',
          label: '安装'
        },
        {
          value: '2',
          label: '充值'
        },
        {
          value: '3',
          label: '留存'
        },
        {
          value: '4',
          label: '分成'
        }
      ],
      // 结算周期
      cycleList: [
        {
          value: '1',
          label: '单周'
        },
        {
          value: '2',
          label: '双周'
        },
        {
          value: '3',
          label: '月'
        }
      ],
      // 预收款项
      getMoneyList: [
        {
          value: '1',
          label: '有'
        },
        {
          value: '2',
          label: '无'
        }
      ],
      // 合同
      contractList: [],
      showNotice: false, // 通知人弹框
      showLink: false, // 新增链接弹框
      bagTypeList: [], // 包体类型列表
      // 后台类型
      backTypeList: [
        {
          value: 1,
          label: '网站'
        },
        {
          value: 2,
          label: '邮箱'
        },
        {
          value: 3,
          label: 'QQ'
        },
        {
          value: 4,
          label: '微信'
        }
      ]
    }
  },
  mounted () {
    this.getData()
    this.addLadder()
  },
  methods: {
    // 获取初始选项数据
    getData () {
      // 在职人员
      this.$axios({
        url: baseUrl + '/user/getIncumbencyTbUser',
        method: 'post'
      }).then(res => {
        if (res.data.code === 10000) {
          this.productBank.incumbencyTbUser = res.data.content
        } else {
          this.$Message.error(res.data.msg)
        }
      }).catch(err => {
        console.error(err)
      })
      // 获取包体类型
      this.$axios({
        url: phpURL + '/cloud/bagTypeList',
        method: 'get'
      }).then(res => {
        if (res.data.code === 10000) {
          this.bagTypeList = res.data.content
        } else {
          this.$Message.error(res.data.msg)
        }
      }).catch(err => {
        console.log(err.data)
      })
      // 公司名称
      this.$axios({
        url: phpURL + '/cloud/getAllProductCompanies',
        method: 'get'
      }).then(res => {
        if (res.data.code === 10000) {
          this.productBank.productCompanyList = res.data.content
        } else {
          this.$Message.error(res.data.msg)
        }
      }).catch(err => {
        console.log(err.data)
      })
      // 获取一级类别标签
      this.$axios({
        url: phpURL + '/cloud/getFirstTag',
        method: 'get'
      }).then(res => {
        if (res.data.code === 10000) {
          this.productBank.getFirstTag = res.data.content
        } else {
          this.$Message.error(res.data.msg)
        }
      }).catch(err => {
        console.log(err.data)
      })
      // 获取侧重标签数据
      this.$axios({
        url: phpURL + '/cloud/emphasisTagList',
        method: 'get'
      }).then(res => {
        if (res.data.code === 10000) {
          this.productBank.emphasisTagList = res.data.content
        } else {
          this.$Message.error(res.data.msg)
        }
      }).catch(err => {
        console.log(err.data)
      })
    },
    // 根据公司名称 获取 合同
    getContract () {
      // 合同
      this.$axios({
        url: phpURL + '/cloud/getContractByProductCompanyId',
        method: 'post',
        data: $qs.stringify({productCompanyId: this.productBank.productCompany})
      })
        .then(res => {
          if (res.data.code === 10000) {
            this.contractList = res.data.content
          } else {
            this.$Message.error(res.data.msg)
          }
        })
        .catch(err => {
          console.log(err.data)
        })
    },
    // 根据通知人id 获得对应的通知人name
    getNoticeName (ids) {
      ids.map(item => {
        this.productBank.copierName.push(item.label)
        this.productBank.copierName = Array.from(new Set(this.productBank.copierName))
      })
    },
    getTypeName (ids) {
      this.productBank.TypeName = ids.label
    },
    // 增加一列阶梯价
    addLadder () {
      this.productBank.Ladder.push({
        magnitude: '', // 量级
        unitPrice: '', // 单价
        proposalPrice: ''// 建议出价
      })
    },
    // 删除一列
    removeLadder (index) {
      this.productBank.Ladder.splice(index, 1)
    },
    // 增加一列标签
    addLabel () {
      this.productBank.label.push({
        oneLabel: '',
        twoLabel: ''
      })
    },
    // 删除新增的链接
    removeLink (index) {
      this.productBank.LinkContent.splice(index, 1)
    },
    // 删除一列标签
    removeLable (index) {
      this.productBank.label.splice(index, 1)
    },
    // 跳转到配置页面
    goCloudConfig () {
      this.$router.push({
        name: 'cloudConfig'
      })
    },
    // 前端保存数据到表格
    saveToTable () {
      let _p = this.productBank
      this.productBank.LinkContent.push({
        linksName: _p.linksName,
        productLinks: _p.productLinks,
        enclaves: _p.enclaves,
        backgroundType: _p.backgroundType,
        TypeName: _p.TypeName,
        address: _p.address,
        userName: _p.userName,
        password: _p.password
      })
    },
    // 根据一级类别获取二级类别
    getSecondTagFun (index, key) {
      let sendData = {
        fid: key.oneLabel
      }
      this.$axios({
        url: phpURL + '/cloud/getSecondTag',
        method: 'post',
        data: $qs.stringify(sendData)
      }).then(res => {
        if (res.data.code === 10000) {
          this.$set(this.productBank.getSecondTag, index, res.data.content)
          this.productBank.getSecondTag[index] = res.data.content
        }
      }).catch(err => {
        console.log(err.data)
      })
    },
    // 按钮操作返回
    goBack () {
      bus.$emit('on-myclose', this.$route)
      this.$router.push({
        name: 'productBank'
      })
    },
    // 删除抄送人
    deletCopier (index) {
      this.productBank.copier.splice(index, 1)
      this.productBank.copierName.splice(index, 1)
    },
    saveNewPro (productBank) {
      this.$refs.productBank.validate((valid) => {
        if (valid) {
          if (this.productBank.Ladder[0].magnitude !== '') {
            if (this.productBank.Ladder[0].proposalPrice !== '') {
              if (this.productBank.label[0].oneLabel !== '') {
                let _p = this.productBank
                let sendData = {
                  commodityName: _p.commodityName,
                  contractId: _p.contractId,
                  productCompanyId: _p.productCompany,
                  settlement: _p.settlement,
                  cycle: _p.cycle,
                  advance: _p.advance,
                  purchasePrice: _p.purchasePrice,
                  proposalPrice: _p.proposalPrice,
                  percentage: _p.percentage,
                  proposalPercentage: _p.proposalPercentage,
                  retain: _p.retain,
                  proposalRetain: _p.proposalRetain,
                  emphasis: _p.emphasis,
                  links: _p.LinkContent,
                  label: _p.label,
                  ladder: _p.Ladder,
                  copier: _p.copier
                }
                this.$axios({
                  url: baseUrl + '/Commodity/insert',
                  method: 'post',
                  data: sendData
                }).then(res => {
                  if (res.data.code === 10000) {
                    this.$Message.info(res.data.msg)
                    bus.$emit('on-myclose', this.$route)
                    this.$router.push({
                      name: 'productBank'
                    })
                  } else {
                    this.$Message.error(res.data.msg)
                  }
                }).catch(err => {
                  console.error(err)
                })
              } else {
                this.$Message.error('标签类别必填')
              }
            } else {
              this.$Message.error('建议出价必填')
            }
          } else {
            if (this.productBank.label[0].oneLabel !== '') {
              let _p = this.productBank
              let sendData = {
                commodityName: _p.commodityName,
                contractId: _p.contractId,
                productCompanyId: _p.productCompany,
                settlement: _p.settlement,
                cycle: _p.cycle,
                advance: _p.advance,
                purchasePrice: _p.purchasePrice,
                proposalPrice: _p.proposalPrice,
                percentage: _p.percentage,
                proposalPercentage: _p.proposalPercentage,
                retain: _p.retain,
                proposalRetain: _p.proposalRetain,
                emphasis: _p.emphasis,
                links: _p.LinkContent,
                label: _p.label,
                ladder: _p.Ladder,
                copier: _p.copier
              }
              this.$axios({
                url: baseUrl + '/Commodity/insert',
                method: 'post',
                data: sendData
              }).then(res => {
                if (res.data.code === 10000) {
                  this.$Message.info(res.data.msg)
                  bus.$emit('on-myclose', this.$route)
                  this.$router.push({
                    name: 'productBank'
                  })
                } else {
                  this.$Message.error(res.data.msg)
                }
              }).catch(err => {
                console.error(err)
              })
            } else {
              this.$Message.error('标签类别必填')
            }
          }
        } else {
          this.$Message.error('有必填项未填写哦')
        }
      })
    },
    // 点击新增链接清空弹窗内容
    addLinks () {
      this.showLink = true
      this.productBank.linksName = ''
      this.productBank.productLinks = ''
      this.productBank.enclaves = ''
      this.productBank.backgroundType = ''
      this.productBank.address = ''
      this.productBank.userName = ''
      this.productBank.password = ''
    }
  }
}
</script>
<style lang="less">
#addNotice {
    .ivu-modal-footer Button:first-child {
        color: #19aa8d;
        background-color: #fff;
        border-color: #19aa8d;
    }
    //输入框
    .ivu-input:hover {
        border-color: #19AA8D;
    }
    .ivu-input:focus {
        border-color: #19AA8D;
        outline: 0;
        box-shadow: none;
    }
    .ivu-select-item-selected, .ivu-select-item-selected:hover {
        color: #19AA8D;
    }
    //选择框
    .ivu-select-selection:hover {
        border-color: #19AA8D;
        outline: none;
    }

    .ivu-select-selection:focus {
        border-color: #19AA8D;
        outline: none;
        box-shadow: none;
    }

    .ivu-select-visible .ivu-select-selection {
        border-color: #19AA8D;
        outline: none;
        box-shadow: none;
    }

    .ivu-select-multiple .ivu-select-item-selected {
        color: #19aa8d;
        background: #fff;
    }

    .ivu-select-multiple .ivu-select-item-selected:after {
        color: #19aa8d;
    }
}
.rowPadding{
    margin-bottom:20px;
}
#contractTable {
    .ivu-table-header .ivu-table-cell span {
        color: #515a6e !important;
    }

}
</style>
<style scoped>

.main {
  margin: 20px 70px;
  font-size: 13px;
  line-height: 30px;
}

i {
  color: red;
  position: relative;
  top: 3px;
}

.ivu-row {
  margin-top: 20px;
}

.add {
  color: #19aa8d;
  cursor: pointer;
}
.title{
    text-align: right;
    line-height: 30px;
    margin-right: 10px;
}

.person i {
  color: #515a6e;
  cursor: pointer;
}
.addlink .ivu-col.ivu-col-span-3 {
  margin-top: 8px;
}

</style>
