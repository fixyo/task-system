<template>
  <!-- 这是编辑产品库 -->
  <div class="cloudCooper" id="productBank">
    <!-- 基础信息 -->
    <Form ref="productBank" :model="productBank" :rules="ruleProductBank">
    <div class="main">
      <span class="Title">基础信息</span>
      <div class="main">
        <Row>
          <Col span="2">
            <i class="require">*</i>产品名称 :
          </Col>
          <Col span="10">
            <FormItem prop="commodityName">
            <Input v-model="productBank.commodityName" style="width: 300px" clearable filterable/>
            </FormItem>
          </Col>
          <Col span="2">
            <i class="require">*</i>公司名称 :
          </Col>
          <Col span="10">
          <FormItem prop="productCompany">
            <Select v-model="productBank.productCompany" style="width:300px" clearable filterable @on-change="getContract">
              <Option
                v-for="item in productBank.productCompanyList"
                :value="item.productCompanyId"
                :key="item.productCompanyId"
              >{{ item.companyName }}</Option>
            </Select>
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col span="2">
            <i class="require">*</i>结算方式 :
          </Col>
          <Col span="10">
            <FormItem prop="settlement">
            <Select v-model="productBank.settlement" style="width:300px" clearable filterable>
              <Option
                v-for="item in settlementList"
                :value="item.value"
                :key="item.value"
              >{{ item.label }}</Option>
            </Select>
            </FormItem>
          </Col>
          <Col span="2">
            <i class="require">*</i>结算周期 :
          </Col>
          <Col span="10">
            <FormItem prop="cycle">
            <Select v-model="productBank.cycle" style="width:300px" clearable filterable>
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
        <div v-if="productBank.settlement == 1">
          <Row>
            <Col span="2">
              <i class="require">*</i>进价 :
            </Col>
            <Col span="10">
            <FormItem prop="purchasePrice">
              <Input v-model="productBank.purchasePrice" style="width: 300px" clearable filterable/>
            </FormItem>
            </Col>
            <Col span="2">建议出价 :</Col>
            <Col span="10">
            <Input v-model="productBank.proposalPrice" style="width: 300px" clearable filterable/>
            </Col>
          </Row>
        </div>
        <!-- 充值 -->
        <div v-if="productBank.settlement == 2">
          <Row>
            <Col span="2">
              <i class="require">*</i>进价 :
            </Col>
            <Col span="10">
            <FormItem prop="purchasePrice">
            <Input v-model="productBank.purchasePrice" style="width: 300px" clearable filterable/>
            </FormItem>
            </Col>
            <Col span="2">建议出价 :</Col>
            <Col span="10">
            <FormItem prop="proposalPrice">
            <Input v-model="productBank.proposalPrice" style="width: 300px" clearable filterable/>
            </FormItem>
            </Col>
          </Row>
          <Row>
            <Col span="2">
              <i class="require">*</i>充值(%) :
            </Col>
            <Col span="10">
            <FormItem prop="percentage">
            <Input v-model="productBank.percentage" style="width: 300px" clearable filterable/>
            </FormItem>
            </Col>
            <Col span="4">
             建议充值出价(%) :
            </Col>
            <Col span="8">
              <Input v-model="productBank.proposalPercentage"  style="width: 235px"  clearable filterable/>
            </Col>
          </Row>
        </div>
        <!-- 留存 -->
        <div v-if="productBank.settlement == 3">
          <Row>
            <Col span="2">
              <i class="require">*</i>进价 :
            </Col>
            <Col span="10">
            <FormItem prop="purchasePrice">
                <Input v-model="productBank.purchasePrice" style="width: 300px" clearable filterable/>
            </FormItem>
            </Col>
            <Col span="2">建议出价 :</Col>
            <Col span="10">
                <Input v-model="productBank.proposalPrice" style="width: 300px" clearable filterable/>
            </Col>
          </Row>
          <Row>
            <Col span="2">
              <i class="require">*</i>留存 :
            </Col>
            <Col span="10">
            <FormItem prop="retain">
              <Input v-model="productBank.retain" style="width: 300px" clearable filterable/>
            </FormItem>
            </Col>
            <Col span="3">
            建议留存出价 :
            </Col>
            <Col span="9">
              <Input  v-model="productBank.proposalRetain" style="width: 265px" clearable filterable />
            </Col>
          </Row>
        </div>

        <!-- 分成 -->
        <div v-if="productBank.settlement == 4">
          <Row>
            <Col span="2">
              <i class="require">*</i>进价比(%):
            </Col>
            <Col span="10">
            <FormItem prop="percentage">
              <Input  v-model="productBank.percentage"  style="width: 300px" clearable filterable/>
            </FormItem>
            </Col>
            <Col span="3">
            建议出价比(%) :
            </Col>
            <Col span="9">
              <Input  v-model="productBank.proposalPercentage"  style="width: 265px" clearable filterable />
            </Col>
          </Row>
        </div>
        <Row>
          <Col span="2">
            <i class="require">*</i>预收款项 :
          </Col>
          <Col span="10">
          <FormItem prop="advance">
            <Select v-model="productBank.advance" style="width:300px" clearable filterable>
              <Option
                v-for="item in getMoneyList"
                :value="item.value"
                :key="item.value"
              >{{ item.label }}</Option>
            </Select>
            </FormItem>
          </Col>
          <Col span="2">
            <i class="require">*</i>合同 :
          </Col>
          <Col span="10">
          <FormItem prop="contractId">
            <Select v-model="productBank.contractId" style="width:300px" clearable filterable>
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
    <div class="main">
      <span class="Title">阶梯价</span>
      <div class="main">
        <Row v-for="(item,index) in productBank.Ladder" :key="index">
          <Col span="1">量级:</Col>
          <Col span="5">
          <FormItem prop="magnitude">
            <Input v-model="item.magnitude" style="width: 100px"  clearable filterable/>(万)
          </FormItem>
          </Col>
          <Col span="1">单价:</Col>
          <Col span="5">
          <FormItem prop="unitPrice">
            <Input v-model="item.unitPrice" style="width: 100px"  clearable filterable/>(元)
          </FormItem>
          </Col>
          <Col span="2">建议出价:</Col>
          <Col span="5">
            <Input v-model="item.proposalPrice" style="width: 100px"  clearable filterable/>
            <Button shape="circle" icon="md-add" @click="addLadder" style="margin:0px 0px 0px 5px"></Button>
            <Button v-if="productBank.Ladder.length>=2" shape="circle" icon="md-remove" @click="removeLadder(index)"></Button>
          </Col>
        </Row>
      </div>
    </div>
    <!-- 链接信息 -->
    <div class="main">
      <span class="Title">链接信息</span>
      <div class="main">
        <span class="add" @click="openAddModal">+新增链接</span>
        <Table border :columns="productBank.LinkHeader" :data="productBank.LinkContent">
          <template slot-scope="{ row }" slot="name">
            <strong>{{ row.name }}</strong>
          </template>
          <template slot-scope="{ row, index }" slot="action">
            <Button type="primary" size="small" @click="editProduct(row)">编辑</Button>
            <Button type="error" size="small" @click="removeProduct(row)">删除</Button>
          </template>
        </Table>
      </div>
    </div>
    <!-- 新增链接弹窗 -->
    <Modal id="addNotice" :mask-closable="false" v-model="showLink" title="新增链接" class="addlink" @on-ok="saveToTable">
      <Row>
        <Col span="3">
          <i class="require">*</i>链接名称 :
        </Col>
        <Col span="21">
          <Input v-model="productBank.linksName" style="width: 300px"  clearable filterable/>
        </Col>
      </Row>
      <Row>
        <Col span="3">
          <i class="require">*</i>产品链接 :
        </Col>
        <Col span="21">
          <Input v-model="productBank.productLinks" style="width: 300px"  clearable filterable/>
        </Col>
      </Row>
      <Row>
        <Col span="3">
          <i class="require">*</i>包体类型 :
        </Col>
        <Col span="21">
          <Select style="width:300px"  v-model="productBank.enclaves"  clearable filterable>
            <Option v-for="item in bagTypeList" :value="item.id" :key="item.id">{{ item.title }}</Option>
          </Select>
          <Button shape="circle" icon="ios-more-outline" @click="goCloudConfig"></Button>
        </Col>
      </Row>
      <Row>
        <Col span="3">
          <i class="require">*</i>后台类型 :
        </Col>
        <Col span="21">
          <Select v-model="productBank.backgroundType" :label-in-value="true"  @on-change="getTypeName" style="width:300px" clearable filterable>
            <Option
              v-for="item in backTypeList"
              :value="item.value"
              :key="item.value"
            >{{ item.label }}</Option>
          </Select>
        </Col>
      </Row>
      <Row v-if="productBank.backgroundType === 3 ||productBank.backgroundType === 4">
        <Col span="3">
          <i class="require">*</i>群名 :
        </Col>
        <Col span="21">
          <Input v-model="productBank.address" style="width: 300px" clearable filterable/>
        </Col>
      </Row>
      <div v-if="productBank.backgroundType === 1 ||productBank.backgroundType === 2">
        <Row>
          <Col span="3">
            <i class="require">*</i>网址 :
          </Col>
          <Col span="21">
            <Input  v-model="productBank.address"  style="width: 300px" clearable filterable/>
          </Col>
        </Row>
        <Row>
          <Col span="3">
            <i class="require">*</i>账号 :
          </Col>
          <Col span="21">
            <Input v-model="productBank.userName" style="width: 300px" clearable filterable/>
          </Col>
        </Row>
        <Row>
          <Col span="3">
            <i class="require">*</i>密码 :
          </Col>
          <Col span="21">
            <Input v-model="productBank.password"  style="width: 300px" clearable filterable/>
          </Col>
        </Row>
      </div>
    </Modal>

    <!-- 编辑链接弹窗 -->
    <Modal id="addNotice" v-model="editLink" title="编辑链接" class="addlink" @on-ok="eidtProductLink">
      <Row>
        <Col span="3">
          <i class="require">*</i>链接名称 :
        </Col>
        <Col span="21">
          <Input v-model="productBank.linksName" style="width: 300px"  clearable filterable/>
        </Col>
      </Row>
      <Row>
        <Col span="3">
          <i class="require">*</i>产品链接 :
        </Col>
        <Col span="21">
          <Input v-model="productBank.productLinks" style="width: 300px"  clearable filterable/>
        </Col>
      </Row>
      <Row>
        <Col span="3">
          <i class="require">*</i>包体类型 :
        </Col>
        <Col span="21">
          <Select style="width:300px"  v-model="productBank.enclaves"  clearable filterable>
            <Option v-for="item in bagTypeList" :value="item.id" :key="item.id">{{ item.title }}</Option>
          </Select>
          <Button shape="circle" icon="ios-more-outline" @click="goCloudConfig"></Button>
        </Col>
      </Row>
      <Row>
        <Col span="3">
          <i class="require">*</i>后台类型 :
        </Col>
        <Col span="21">
          <Select v-model="productBank.backgroundType" style="width:300px" clearable filterable @on-change="getTypeName">
            <Option
              v-for="item in backTypeList"
              :value="item.value"
              :key="item.value"
            >{{ item.label }}</Option>
          </Select>
        </Col>
      </Row>
      <Row v-if="productBank.backgroundType === 3 ||productBank.backgroundType === 4">
        <Col span="3">
          <i class="require">*</i>群名 :
        </Col>
        <Col span="21">
          <Input v-model="productBank.address" style="width: 300px" clearable filterable/>
        </Col>
      </Row>
      <div v-if="productBank.backgroundType === 1 ||productBank.backgroundType === 2">
        <Row>
          <Col span="3">
            <i class="require">*</i>网址 :
          </Col>
          <Col span="21">
            <Input  v-model="productBank.address"  style="width: 300px" clearable filterable/>
          </Col>
        </Row>
        <Row>
          <Col span="3">
            <i class="require">*</i>账号 :
          </Col>
          <Col span="21">
            <Input v-model="productBank.userName" style="width: 300px" clearable filterable/>
          </Col>
        </Row>
        <Row>
          <Col span="3">
            <i class="require">*</i>密码 :
          </Col>
          <Col span="21">
            <Input v-model="productBank.password"  style="width: 300px" clearable filterable/>
          </Col>
        </Row>
      </div>
    </Modal>
    <!-- 标签 -->
    <div class="main">
      <span class="Title">标签</span>
      <div class="main">
        <Row v-for="(addItem,index) in productBank.label" :key="index">
          <Col span="2">
            <i class="require">*</i>一级类别 :
          </Col>
          <Col span="10">
            <Select v-model="productBank.label[index].oneLabel" clearable filterable style="width:300px" @on-change="getSecondTagFun(index,productBank.label[index])" >
              <Option v-for="item in productBank.getFirstTag" :value="item.id" :key="item.id">{{ item.tagName }}</Option>
            </Select>
            <span style="cursor: pointer;margin-left: 5px;">
            </span>
          </Col>
          <Col span="2">
            <i class="require">*</i>二级类别 :
          </Col>
          <Col span="10">
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
          <Col span="2">
            侧重标签 :
          </Col>
          <Col span="10">
             <Select style="width:300px" v-model="productBank.emphasis" multiple clearable filterable >
              <Option v-for="item in productBank.emphasisTagList" :value="item.id" :key="item.id">{{ item.title }}</Option>
            </Select>
            <span style="cursor: pointer;margin-left: 5px;">
            </span>
          </Col>
        </Row>
      </div>
    </div>
    <!-- 抄送人 -->
    <div class="main person">
      <span class="Title">抄送人</span>
      <div class="main">
        <div  v-for="(item,index) in this.productBank.copierName" :key="index" style="float: left;margin-right: 15px;">
            <Icon type="md-close" style="color: red; position: relative;left: 33px;top: 12px;cursor: pointer;" @click="deletCopier(index)"/>
            <Icon type="ios-contacts" size="50" @click="showNotice=true" style="display: block;"></Icon>
            <p style="">{{item+'  '||'抄送人'}}</p>
        </div>
        <Icon type="ios-add-circle-outline" size="50" @click="showNotice=true" style="margin-top: 22px; color: #CCC;"/>
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
    </div>
    </Form>
  </div>
</template>

<script>
import { phpURL, baseUrl } from '@/api/base.js'
export default {
  name: 'editProduckBank',
  data () {
    return {
      editLink: false,
      productBank: {
        linkId: '', // 链接id
        incumbencyTbUser: [], // 在职人员
        copierName: [], // 抄送人name
        copier: [], // 抄送人
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
        advance: '', // 预收款项
        contractId: '', // 合同 传id
        Ladder: [
          {
            magnitude: '', // 量级
            unitPrice: '', // 单价
            proposalPrice: ''// 建议出价
          }
        ], // 阶梯价数组
        linksName: '', // 链接名称
        productLinks: '', // 产品链接
        enclaves: '', // 包体类型
        backgroundType: '', // 后台类型
        TypeName: '',
        address: '', // 网站 群名
        userName: '', // 账号
        password: ' ', // 密码
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
        proposalPrice: [
          {
            required: true, message: '是必填项哦'},
          {
            message: '只能是数字', trigger: 'change', pattern: /^(([1-9]\d{0,3})|0)(\.\d{0,2})?$/
          }],
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
          }]
      },
      // 结算方式
      settlementList: [
        {
          value: 1,
          label: '安装'
        },
        {
          value: 2,
          label: '充值'
        },
        {
          value: 3,
          label: '留存'
        },
        {
          value: 4,
          label: '分成'
        }
      ],
      // 结算周期
      cycleList: [
        {
          value: 1,
          label: '单周'
        },
        {
          value: 2,
          label: '双周'
        },
        {
          value: 3,
          label: '月'
        }
      ],
      // 预收款项
      getMoneyList: [
        {
          value: 1,
          label: '有'
        },
        {
          value: 2,
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
    this.getEchoData()
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
    // 根据通知人id 获得对应的通知人name
    getNoticeName (ids) {
      ids.map(item => {
        this.productBank.copierName.push(item.label)
        this.productBank.copierName = Array.from(new Set(this.productBank.copierName))
      })
    },
    // 获取回显数据
    getEchoData () {
      let sendData = {
        commodityId: this.$route.query.commodityId
      }
      this.$axios({
        url: phpURL + '/cloud/getCommodityInfoById',
        method: 'post',
        data: $qs.stringify(sendData)
      }).then(res => {
        if (res.data.code === 10000) {
          let _p = this.productBank
          let _r = res.data.content
          _p.commodityName = _r.commodityName
          _p.productCompany = _r.productCompanyId
          _p.settlement = _r.settlement
          _p.cycle = _r.cycle
          _p.purchasePrice = _r.purchasePrice
          _p.proposalPrice = _r.proposalPrice
          _p.percentage = _r.percentage
          _p.roposalPercentage = _r.proposalPercentage
          _p.proposalRetain = _r.proposalRetain
          _p.retain = _r.retain
          _p.proposalPercentage = _r.proposalPercentage
          _p.advance = _r.advance
          this.getContract()// 根据公司名称获取合同
          _p.contractId = _r.contractId
          _p.Ladder = _r.ladder
          if (_p.Ladder.length === 0) {
            this.addLadder()
          }
          _p.LinkContent = _r.links
          _p.emphasis = _r.emphasis
          //   _p.copier = _r.copier
          //   _p.copierName = _r.copierName
          _p.label = _r.label
          if (_p.label.length === 0) {
            this.addLabel()
          }
          for (let i = 0; i <= _p.label.length; i++) {
            if (_p.label[i].oneLabel) {
              let sendId = {
                fid: _p.label[i].oneLabel
              }
              this.$axios({
                url: phpURL + '/cloud/getSecondTag',
                method: 'post',
                data: $qs.stringify(sendId)
              }).then(res => {
                if (res.data.code === 10000) {
                  this.$set(this.productBank.getSecondTag, i, res.data.content)
                  this.productBank.getSecondTag[i] = res.data.content
                }
              }).catch(err => {
                console.log(err.data)
              })
            }
          }
        //   this.getSecondTagFun()
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
    // 删除抄送人
    deletCopier (index) {
      this.productBank.copier.splice(index, 1)
      this.productBank.copierName.splice(index, 1)
    },
    // 打开新增弹窗同时清空已有数据
    openAddModal () {
      this.showLink = true
      let _p = this.productBank
      _p.linksName = ''
      _p.productLinks = ''
      _p.enclaves = ''
      _p.backgroundType = ''
      _p.address = ''
      _p.userName = ''
      _p.password = ''
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
    getTypeName (ids) {
      this.productBank.TypeName = ids.label
    },
    // 编辑链接信息
    editProduct (row) {
      this.editLink = true
      let _p = this.productBank
      _p.linkId = row.id
      _p.linksName = row.linksName
      _p.productLinks = row.productLinks
      _p.enclaves = row.enclaves
      _p.backgroundType = row.backgroundType
      _p.TypeName = row.TypeName
      _p.address = row.address
      _p.userName = row.userName
      _p.password = row.password
    },
    eidtProductLink () {
      let _p = this.productBank
      let sendData = {
        commodityId: this.$route.query.commodityId,
        id: this.productBank.linkId,
        linksName: _p.linksName,
        productLinks: _p.productLinks,
        enclaves: _p.enclaves,
        backgroundType: _p.backgroundType,
        address: _p.address,
        userName: _p.userName,
        password: _p.password
      }
      this.$axios({
        url: baseUrl + '/Commodity/updateLinks',
        method: 'post',
        data: sendData
      }).then(res => {
        if (res.data.code === 10000) {
          this.productBank.LinkContent = res.data.content
        } else {
          this.$Message.error(res.data.msg)
        }
      }).catch(err => {
        console.error(err)
      })
    },
    // 删除链接信息
    removeProduct (row) {
      console.log(row)
      let sendData = {
        id: row.id
      }
      this.$axios({
        url: baseUrl + '/Commodity/deleteLinks',
        method: 'post',
        data: $qs.stringify(sendData)
      }).then(res => {
        if (res.data.code === 10000) {
          this.productBank.LinkContent = res.data.content
          this.$Message.info(res.data.msg)
        } else {
          this.$Message.error(res.data.msg)
        }
      }).catch(err => {
        console.error(err)
      })
    },
    // 编辑后保存
    saveNewPro (productBank) {
      this.$refs.productBank.validate((valid) => {
        if (valid) {
          if (this.productBank.Ladder[0].magnitude !== '') {
            if (this.productBank.Ladder[0].proposalPrice !== '') {
              if (this.productBank.label[0].oneLabel !== '') {
                let _p = this.productBank
                let sendData = {
                  id: this.$route.query.commodityId,
                  commodityName: _p.commodityName,
                  contractId: _p.contractId,
                  productCompanyId: _p.productCompany,
                  settlement: _p.settlement,
                  cycle: _p.cycle,
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
                  url: baseUrl + '/Commodity/update',
                  method: 'post',
                  data: sendData
                }).then(res => {
                  if (res.data.code === 10000) {
                    this.$Message.info(res.data.msg)
                    bus.$emit('on-myclose', this.$route)
                    this.$router.push({
                      name: 'productBank'
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
                this.$Message.error('标签类别必填')
              }
            } else {
              this.$Message.error('建议出价必填')
            }
          } else {
            if (this.productBank.label[0].oneLabel !== '') {
              let _p = this.productBank
              let sendData = {
                id: this.$route.query.commodityId,
                commodityName: _p.commodityName,
                contractId: _p.contractId,
                productCompanyId: _p.productCompany,
                settlement: _p.settlement,
                cycle: _p.cycle,
                purchasePrice: _p.purchasePrice,
                proposalPrice: _p.proposalPrice,
                percentage: _p.percentage,
                proposalPercentag: _p.proposalPercentag,
                retain: _p.retain,
                proposalRetain: _p.proposalRetain,
                emphasis: _p.emphasis,
                links: _p.LinkContent,
                label: _p.label,
                ladder: _p.Ladder,
                copier: _p.copier
              }
              this.$axios({
                url: baseUrl + '/Commodity/update',
                method: 'post',
                data: sendData
              }).then(res => {
                if (res.data.code === 10000) {
                  this.$Message.info(res.data.msg)
                  bus.$emit('on-myclose', this.$route)
                  this.$router.push({
                    name: 'productBank'
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
              this.$Message.error('标签类别必填')
            }
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
</style>
<style scoped>
#productBank {
  background: white;
  padding: 10px 50px;
  width: 1200px;
  margin: auto;
}

.Title {
  font-size: 14px;
  padding-left: 10px;
  border-left: 3px solid #19aa8d;
  height: 25px;
  line-height: 25px;
  display: block;
  font-weight: bold;
}

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

.person i {
  color: #515a6e;
  cursor: pointer;
}
.addlink .ivu-col.ivu-col-span-3 {
  margin-top: 8px;
}
</style>
