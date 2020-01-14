<template>
  <div class="app-container">
    <Form ref="form" :model="model" style="padding:20px 50px">
      <el-tabs v-model="tabsActive">
        <el-tab-pane label="商城设置" name="first">
          <FormField labelWidth="90" label="商城名称:">
            <TextBox v-model="model.shop_name" />
          </FormField>
          <FormField labelWidth="90" label="商城描述:">
            <TextBox v-model="model.shop_describe" input-id="shop_describe" />
          </FormField>
          <FormField labelWidth="90" label="商城logo:">
            <FileUpload :key="cmtResetHandle" :file="model.logoItem" @input="emitLogoUpload"/>
          </FormField>
          <FormField labelWidth="90" label="默认图:">
            <FileUpload :key="cmtResetHandle" :file="model.defaultImgItem" @input="emitDefaultImgUpload"/>
          </FormField>
          <FormField labelWidth="90" label="搜索关键词:">
            <TextBox v-model="model.shop_search_keywords" :multiline="true" placeholder="多个换行" style="width:100%;height:120px"/>
          </FormField>
          <FormField labelWidth="90" label="显示设置:">
            <ComboBox :data="shop_show" :multiple="true" v-model="model.shop_show_config"/>
          </FormField>
          <FormField>
            <LinkButton style="margin-right: 20px" @click="updateRow()">{{ $t('common.confirm') }}</LinkButton>
          </FormField>
        </el-tab-pane>
        <el-tab-pane label="订单管理" name="second">
          <FormField labelWidth="150" name="shop_order_notification" label="下单通知手机号:">
            <TextBox v-model="model.shop_order_notification"/>
          </FormField>
          <FormField labelWidth="150" name="shop_order_auto_completion" label="订单自动完成时间:">
            <ComboBox :data="data" v-model="model.shop_order_auto_completion"/>
          </FormField>
          <FormField labelWidth="150" label="订单自动取消时间:">
            <ComboBox :data="data" v-model="model.shop_order_auto_cancel"/>
          </FormField>
          <FormField labelWidth="150" label="订单确认收货时间:">
            <ComboBox :data="data" v-model="model.shop_order_auto_receive"/>
          </FormField>
          <FormField labelWidth="150" label="订单自动评价时间:">
            <ComboBox :data="data" v-model="model.shop_order_auto_comment"/>
          </FormField>
          <FormField labelWidth="150" label="退货联系人:">
            <TextBox v-model="model.shop_return_contact"/>
          </FormField>
          <FormField labelWidth="150" label="退货联系方式:">
            <TextBox v-model="model.shop_return_contact_phone"/>
          </FormField>
          <FormField labelWidth="150" label="退货详细地址:">
            <TextBox v-model="model.shop_return_address"/>
          </FormField>
          <FormField>
            <LinkButton style="margin-right: 20px" @click="updateRow()">{{ $t('common.confirm') }}</LinkButton>
          </FormField>
        </el-tab-pane>
        <el-tab-pane label="商品设置" name="third">
          <FormField labelWidth="150" name="shop_stock_alarm" label="库存警报数量:">
            <TextBox v-model="model.shop_stock_alarm" input-id="shop_stock_alarm" />
          </FormField>
          <FormField>
            <LinkButton style="margin-right: 20px" @click="updateRow()">{{ $t('common.confirm') }}</LinkButton>
          </FormField>
        </el-tab-pane>
        <el-tab-pane label="微信设置" name="four">
          <FormField labelWidth="200" name="wx_official_appid" label="公众号appid:">
            <TextBox v-model="model.wx_official_appid" input-id="wx_official_appid" />
          </FormField>
          <FormField labelWidth="200" name="wx_official_secret" label="公众号secret:">
            <TextBox v-model="model.wx_official_secret" input-id="wx_official_secret" />
          </FormField>
          <FormField labelWidth="200" name="wx_official_original_id" label="公众号原始ID:">
            <TextBox v-model="model.wx_official_original_id" input-id="wx_official_original_id" />
          </FormField>
          <FormField labelWidth="200" name="wx_official_key" label="公众号EncodingAESKey:">
            <TextBox v-model="model.wx_official_key" input-id="wx_official_key" />
          </FormField>
          <FormField labelWidth="200" name="wx_official_type" label="公众号类型:">
            <TextBox v-model="model.wx_official_type" input-id="wx_official_type" />
          </FormField>
          <FormField labelWidth="200" name="wx_applet_appid" label="小程序appid:">
            <TextBox v-model="model.wx_applet_appid" input-id="wx_applet_appid" />
          </FormField>
          <FormField labelWidth="200" name="wx_applet_secret" label="小程序secret:">
            <TextBox v-model="model.wx_applet_secret" input-id="wx_applet_secret" />
          </FormField>
          <FormField labelWidth="200" name="wx_applet_original_id" label="小程序原始ID:">
            <TextBox v-model="model.wx_applet_original_id" input-id="wx_applet_original_id" />
          </FormField>
          <FormField labelWidth="200" name="wx_applet_key" label="小程序EncodingAESKey:">
            <TextBox v-model="model.wx_applet_key" input-id="wx_applet_key" />
          </FormField>
          <FormField>
            <LinkButton style="margin-right: 20px" @click="updateRow()">{{ $t('common.confirm') }}</LinkButton>
          </FormField>
        </el-tab-pane>
      </el-tabs>
    </Form>
  </div>
</template>
<script>
import * as apiSetting from '@/api/shop/setting'
import FileUpload from '@/components/Upload/FileUpload'

export default {
  components: { FileUpload },
  data() {
    return {
      model: {
        shop_name: null,
        shop_show_config: [],
        shop_describe: null,
        shop_logo: null,
        shop_default_img: null,
        shop_search_keywords: null,
        shop_stock_alarm: null,
        shop_order_notification: null,
        shop_order_auto_completion: null,
        shop_order_auto_cancel: null,
        shop_order_auto_receive: null,
        shop_order_auto_comment: null,
        shop_return_contact: null,
        shop_return_contact_phone: null,
        shop_return_address: null,
        wx_official_appid: null,
        wx_official_secret: null,
        wx_official_original_id: null,
        wx_official_key: null,
        wx_official_type: null,
        wx_applet_appid: null,
        wx_applet_secret: null,
        wx_applet_original_id: null,
        wx_applet_key: null,
        logoItem: {
          id: 0,
          file_url: ""
        },
        defaultImgItem: {
          id: 0,
          file_url: ""
        }
      },
      tabsActive: "first",
      cmtResetHandle: 1,
      data: [
        {text:"1天", value: "1"},
        {text:"2天", value: "2"},
        {text:"3天", value: "3"},
        {text:"4天", value: "4"},
        {text:"5天", value: "5"},
        {text:"6天", value: "6"},
        {text:"7天", value: "7"},
      ],
      shop_show: [
        {text:"首页分类", value: "home_cat"},
        {text:"首页横幅", value: "home_banner"},
        {text:"首页活动", value: "home_activity"},
        {text:"首页推荐", value: "home_recommend"},
        {text:"首页热卖", value: "home_hot"},
        {text:"底部导航首页", value: "home_tabbar_home"},
        {text:"底部导航购物车", value: "home_tabbar_cart"},
        {text:"底部导航我的", value: "home_tabbar_user"},
      ]
    }
  },
  watch: {
    "model.logoItem": function() {
      ++this.cmtResetHandle
    }
  },
  created() {
    this.settingData()
  },
  methods: {
    updateRow() {
      this.saveData(this.model)
    },
    emitLogoUpload(fileId) {
      this.model.shop_logo = fileId
    },
    emitDefaultImgUpload(fileId) {
      this.model.shop_default_img = fileId
    },
    async settingData() {
      let res = await apiSetting.getList()
      this.model = Object.assign(this.model, res.data)
    },
    async saveData() {
      await apiSetting.update(this.model)
      this.$notify({
        title: '设置成功',
        // message: '设置成功',
        type: 'success'
      });
    }

  }
}

</script>
