<template>
  <div class="app-container">
    <!-- f-inline-row -->
    <Form v-if="model.code=='wechat'" ref="form" :model="model" :rules="rules" style="padding:20px 20px" @validate="errors=$event">
      <FormField name="name" label="支付平台:" class="f-full" labelWidth="180">
        <TextBox v-model="model.name" name="name" :readonly="true" />
      </FormField>

      <FormField name="lite_app_id" label="公众号AppId:" labelWidth="180">
        <TextBox v-model="model.config.pub_app_id" input-id="name" name="lite_app_id" />
      </FormField>

      <FormField name="pub_app_id" label="小程序AppId:" labelWidth="180">
        <TextBox v-model="model.config.lite_app_id" name="pub_app_id" />
      </FormField>
      <FormField name="mch_id" label="商户号:" labelWidth="180">
        <TextBox v-model="model.config.mch_id" name="mch_id" />
      </FormField>
      <FormField name="md5_key" label="支付key:" labelWidth="180">
        <TextBox v-model="model.config.md5_key" name="md5_key" />
      </FormField>


      <FormField label="证书pem的路径:" labelWidth="180">
        <FileUpload :key="cmtResetHandle" :file="model.pubItem" @input="emitWxPub" :otherUploadUrl="uploadUrl" />
      </FormField>
      <FormField label="证书密钥key的路径:" labelWidth="180">
        <FileUpload :key="cmtResetHandle" :file="model.priItem" @input="emitWxMer" :otherUploadUrl="uploadUrl" />
      </FormField>
      <FormField label="状态:" labelWidth="180">
        <ComboBox v-model="model.status" name="status" :data="status" />
      </FormField>
      <FormField>
        <LinkButton style="margin-right: 20px" @click="verificationRow()">{{ $t("common.save") }}</LinkButton>
        <LinkButton @click="cancel()">{{ $t("common.goBack") }}</LinkButton>
      </FormField>
    </Form>
    <Form v-if="model.code=='ali'" ref="form" :model="model" :rules="rules" style="padding:20px 20px" @validate="errors=$event">
      <FormField label="支付平台:" class="f-full" labelWidth="180">
        <TextBox v-model="model.name" name="name" :readonly="true" />
      </FormField>
      <FormField label="收款用户ID:" labelWidth="180">
        <TextBox v-model="model.config.partner" />
      </FormField>
      <FormField label="开发者的应用ID:" labelWidth="180">
        <TextBox v-model="model.config.app_id" />
      </FormField>
      <FormField label="公钥:" labelWidth="180">
        <FileUpload :key="cmtResetHandle" :file="model.pubItem" @input="emitAliPub" :otherUploadUrl="uploadUrl" />
      </FormField>
      <FormField label="私钥:" labelWidth="180">
        <FileUpload :key="cmtResetHandle" :file="model.priItem" @input="emitAliMer" :otherUploadUrl="uploadUrl" />
      </FormField>
      <FormField label="状态:" labelWidth="180">
        <ComboBox v-model="model.status" name="status" :data="status" />
      </FormField>
      <FormField>
        <LinkButton style="margin-right: 20px" @click="verificationRow()">{{ $t("common.save") }}</LinkButton>
        <LinkButton @click="cancel()">{{ $t("common.goBack") }}</LinkButton>
      </FormField>
    </Form>
    <Form v-if="model.code=='cmb'" ref="form" :model="model" :rules="rules" style="padding:20px 20px" @validate="errors=$event">
      <FormField label="支付平台:" class="f-full" labelWidth="180">
        <TextBox v-model="model.name" name="name" :readonly="true" />
      </FormField>
      <FormField label="商户分行号:" labelWidth="180">
        <TextBox v-model="model.config.branch_no" />
      </FormField>
      <FormField label="商户号:" labelWidth="180">
        <TextBox v-model="model.config.merchant_no" />
      </FormField>
      <FormField label="公钥:" labelWidth="180">
        <FileUpload :key="cmtResetHandle" :file="model.pubItem" @input="emitCmbPub" :otherUploadUrl="uploadUrl" />
      </FormField>
      <FormField label="私钥:" labelWidth="180">
        <FileUpload :key="cmtResetHandle" :file="model.priItem" @input="emitCmbMer" :otherUploadUrl="uploadUrl" />
      </FormField>
      <FormField label="操作员登录密码:" labelWidth="180">
        <TextBox v-model="model.config.op_pwd" />
      </FormField>
      <FormField label="状态:" labelWidth="180">
        <ComboBox v-model="model.status" name="status" :data="status" />
      </FormField>
      <FormField>
        <LinkButton style="margin-right: 20px" @click="verificationRow()">{{ $t("common.save") }}</LinkButton>
        <LinkButton @click="cancel()">{{ $t("common.goBack") }}</LinkButton>
      </FormField>
    </Form>
  </div>
</template>
<script>
import * as apiPayment from '@/api/shop/payment'
import FileUpload from '@/components/Upload/FileUpload'

export default {
  components: { FileUpload },
  data() {
    return {
      model: {},
      status: [{
        value: 1,
        text: "是"
      }, {
        value: 2,
        text: "否"
      }],
      rules: {},
      errors: {},
      loading: false,
      treeData: [],
      cmtResetHandle: 1,
      status: [{
        value: 1,
        text: '启用'
      }, {
        value: 2,
        text: '禁用'
      }],
      uploadUrl: process.env.VUE_APP_BASE_API + '/payment/payment/fileupload',

    }
  },
  created() {
    // if (this.$route.query.code == 'wechat') {
    //   this.rules = {lite_app_id:'required', pub_app_id:'required', mch_id:'required', md5_key:'required'}
    // }
    this.initModel()
    this.viewData(this.$route.query.code)
  },
  watch: {
    "model": function() {
      ++this.cmtResetHandle
    }
  },
  methods: {
    initModel() {
      this.model = {
        name:null,
        config:{
          lite_app_id:null,
          pub_app_id:null,
          mch_id:null,
          md5_key:null,
        },
        pubItem: {
          id: 0,
          file_url: ""
        },
        priItem: {
          id: 0,
          file_url: ""
        }
      }
    },
    emitWxPub(fileId) {
      this.model.config.app_cert_pem = fileId
    },
    emitWxMer(fileId) {
      this.model.config.app_key_pem = fileId
    },
    emitAliPub(fileId) {
      this.model.config.ali_public_key = fileId
    },
    emitAliMer(fileId) {
      this.model.config.rsa_private_key = fileId
    },
    emitCmbPub(fileId) {
      this.model.config.cmb_pub_key = fileId
    },
    emitCmbMer(fileId) {
      this.model.config.mer_key = fileId
    },
    cancel() {
      this.$store.dispatch("tagsView/delView", this.$route).then(({ visitedViews }) => {
        this.$router.push({ path: "/shop/payment/index" })
      })
    },
    emitImageUpload(fileId) {
      this.model.image_id = fileId
    },
    verificationRow() {
      this.$refs.form.validate(errors => {
      console.log(this.model)
        if (!errors) {
          this.saveData(this.model);
        }
      })
    },
    async viewData(code) {
      let res = await apiPayment.view({ code: code });
      this.model = Object.assign({}, res.data)
    },
    async saveData(data) {
      await apiPayment.updateConfig(data);
      this.$notify({
        type: "success",
        title: "操作成功"
      });
      this.cancel()
    }
  }
};

</script>
