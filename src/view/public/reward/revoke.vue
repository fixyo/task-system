<template>
  <div>
    <Form
      inline
      :label-width="80"
      label-position="right"
      :rules="revokeValidate"
      :model="revokeData"
      ref="revokeForm"
    >
      <FormItem label="销分说明" prop="explain">
        <Input class="full" v-model="revokeData.explain" placeholder="销分说明"></Input>
      </FormItem>
      <FormItem label="图片：" prop="proveUrl">
        <Upload
          :format="['jpg','jpeg','png']"
          :max-size="20480"
          :show-upload-list="false"
          name="fileData"
          :action="staticUrl+'/index.php'"
          :on-success="(response, file, fileList)=> uploadSuccess(response, file, fileList)"
          class="full"
          v-if="revokeData.proveUrl.length===0"
        >
          <Button icon="ios-cloud-upload-outline">上传图片</Button>
        </Upload>
        <viewer v-else class="inputbox">
          <Icon class="close" size="40" @click="delImg()" type="ios-close"/>
          <img :src="revokeData.proveUrl" class="inputbox">
        </viewer>
      </FormItem>
      <FormItem prop label="审批人：">
        <Select class="helf" disabled filterable v-model="revokeData.approveId">
          <Option
            v-for="person in incumbencyTbUser"
            :value="person.id"
            :key="person.id"
            :label="person.nickname"
            class="helf"
          ></Option>
        </Select>
      </FormItem>
      <FormItem prop="copyPerson" label="抄送人">
        <Select class="helf" filterable clearable multiple v-model="revokeData.copyPerson">
          <Option
            v-for="person in incumbencyTbUser"
            :value="person.id"
            :key="person.id"
            :label="person.nickname"
            class="self"
          >
            <h3>{{ person.nickname }}</h3>
            <h6>部门：{{person.deptName}}</h6>
            <h6>职位：{{person.positionName}}</h6>
          </Option>
        </Select>
      </FormItem>
    </Form>
  </div>
</template>
<script>
import { staticUrl } from '@/api/base.js'
export default {
  name: 'revoke',
  props: {
    revokeId: {
      type: Number,
      default: 0
    },
    incumbencyTbUser: {
      type: Array,
      default () {
        return []
      }
    }
  },
  data () {
    return {
      revokeData: {
        approveId: 283, // 审批人
        rid: this.revokeId, // 销分id
        explain: '', // 消分说明
        copyPerson: [], // 抄送人id
        proveUrl: '' // 截图地址
      },
      staticUrl,
      revokeValidate: {
        explain: [
          {
            required: true,
            message: '销分说明不能为空',
            trigger: 'blur'
          }
        ],
        proveUrl: [
          {
            required: true,
            message: '图片必须上传'
          }
        ]
      }
    }
  },
  methods: {
    delImg () {
      this.revokeData.proveUrl = ''
    },
    uploadSuccess (response, file, fileList) {
      let name = file.name
      console.log(name)
      this.revokeData.proveUrl = staticUrl + response.msg
    }
  }
}
</script>
<style scoped>
.helf {
  width: 134px;
}
.full {
  width: 395px;
}
.inputbox {
  width: 100%;
  position: relative;
}
.inputbox .close {
  position: absolute;
  cursor: pointer;
  right: 0;
  top: 0;
  border-radius: 50%;
  z-index: 99;
}
</style>
