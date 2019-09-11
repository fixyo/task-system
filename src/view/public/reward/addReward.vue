<template>
  <div>
    <Button
      :type="addReword.initiationType===2?'primary':'default'"
      @click="addReword.initiationType=2"
      class="btns"
    >个人</Button>
    <Button
      :type="addReword.initiationType===1?'primary':'default'"
      @click="addReword.initiationType=1"
      class="btns"
    >百助</Button>
    <hr style="margin-bottom:30px" />
    <Form
      ref="addRewordForm"
      :model="addReword"
      inline
      label-position="right"
      :label-width="60"
      :rules="addValidate"
    >
      <Row>
        <Col span="10">
          <FormItem label="日期" prop="rewardDate">
            <DatePicker
              style="width:165px"
              format="yyyy-MM-dd"
              @on-change="(v)=>addReword.rewardDate=v"
              v-model="addReword.rewardDate"
              placeholder="日期"
            />
          </FormItem>
        </Col>
        <Col span="10">
          <FormItem prop="initiatorId" label="发起人">
            <Select filterable v-model="addReword.initiatorId" style="width:165px">
              <Option
                v-for="person in incumbencyTbUser"
                :value="person.id"
                :key="person.id"
                :label="person.nickname"
              >
                <h3>{{ person.nickname }}</h3>
                <h4 class="selectDept">部门：{{person.deptName}}</h4>
                <h4 class="selectDept">职位：{{person.positionName}}</h4>
              </Option>
            </Select>
          </FormItem>
        </Col>
      </Row>
      <Row v-for="(item,index) in addReword.rewardUserList" :key="index">
        <Col span="10">
          <FormItem
            label="当事人"
            :prop="'rewardUserList.' + index + '.rewardUserId'"
            :rules="{required: true,type: 'number',message: '当事人不能为空',trigger: 'change'}"
          >
            <Select
              @on-change="getDerictLeader(item.rewardUserId,index)"
              filterable
              v-model="item.rewardUserId"
              style="width:165px"
            >
              <Option
                v-for="person in incumbencyTbUser"
                :value="person.id"
                :key="person.id"
                :label="person.nickname"
                style="width:100%"
              >
                <h3>{{ person.nickname }}</h3>
                <span class="selectDept">部门：{{person.deptName}}</span>
                <span class="selectDept">职位：{{person.positionName}}</span>
              </Option>
            </Select>
          </FormItem>
        </Col>
        <Col span="10">
          <FormItem label="连带人员">
            <Select filterable multiple v-model="item.relatedUserIds" style="width:165px">
              <Option
                v-for="person in incumbencyTbUser"
                :value="person.id"
                :key="person.id"
                :label="person.nickname"
                style="width:100%"
              >
                <h3>{{ person.nickname }}</h3>
                <h4 class="selectDept">部门：{{person.deptName}}</h4>
                <h4 class="selectDept">职位：{{person.positionName}}</h4>
              </Option>
            </Select>
          </FormItem>
        </Col>
        <Col span="2">
          <Button class="square" icon="md-add" @click="addRewardUser" />
        </Col>
        <Col span="2" v-if="index>0">
          <Button class="square" icon="md-remove" @click="removeRewardUser(index)" />
        </Col>
      </Row>
      <Row>
        <Col span="10">
          <FormItem prop="score" label="分数">
            <Input style="width:165px" v-model="addReword.score" />
          </FormItem>
        </Col>
      </Row>
      <Row>
        <Col span="20">
          <FormItem prop="reason" label="事项">
            <Input style="width:405px" v-model="addReword.reason" />
          </FormItem>
        </Col>
      </Row>
    </Form>
  </div>
</template>
<script>
import moment from 'moment'
import { baseUrl } from '@/api/base.js'
export default {
  name: 'addReward',
  props: {
    incumbencyTbUser: {
      type: Array,
      default () {
        return []
      }
    }
  },
  data () {
    return {
      addReword: {
        rewardDate: moment().format('YYYY-MM-DD'), // 发起日期
        entryUserId: this.$store.state.user.userId, // 录入人id
        initiationType: 2, // 发起类型 1：百助，2：个人
        // 当事人列表
        rewardUserList: [
          {
            rewardUserId: '', // 当事人id
            relatedUserIds: []// 连带人id
          }
        ],
        initiatorId: '', // 发起人id
        score: '', // 奖惩分值
        reason: '' // 奖惩原因
      },
      // 新增奖惩的表单验证
      addValidate: {
        initiatorId: [
          {
            required: true,
            type: 'number',
            message: '发起人不能为空',
            trigger: 'change'
          }
        ],
        score: [{ required: true, message: '得分不能为空', trigger: 'blur' }],
        reason: [{ required: true, message: '事项不能为空', trigger: 'blur' }]
      }
    }
  },
  methods: {
    // 获取连带人
    getDerictLeader (id, index) {
      this.$axios({
        url: baseUrl + '/reward/getDerictLeader',
        method: 'post',
        data: $qs.stringify({ userId: id })
      })
        .then(res => {
          if (res.data.code === 10000) {
            let data = res.data
            let ids = data.content.map(e => {
              return e.id
            })
            this.addReword.rewardUserList[index].relatedUserIds = ids
          }
        })
        .catch(err => {
          console.log(err)
        })
    },
    // 添加当事人
    addRewardUser () {
      this.addReword.rewardUserList.push(
        {
          rewardUserId: '', // 当事人id
          relatedUserIds: []// 连带人id
        }
      )
    },
    // 减少当事人
    removeRewardUser (i) {
      this.addReword.rewardUserList.splice(i, 1)
    }
  },
  computed: {
    userId () {
      return this.$store.state.user.userId
    }
  }
}
</script>
<style scoped>
.selectDept {
  width: 50%;
  /* display: inline-block; */
}
</style>
