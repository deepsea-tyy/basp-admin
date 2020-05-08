<template>
  <div class="app-container">
    <!-- f-inline-row -->
    <Form ref="form" :model="model" style="padding:20px 20px" @validate="errors=$event">
      <el-card class="box-card">
        <div slot="header" class="clearfix">
          <span>基本信息</span>
        </div>
        <div class="text item">
          <el-row :gutter="20">
            <el-col :span="6">订单号：{{model.id}}</el-col>
            <el-col :span="6">订单总金额：{{model.order_amount}}</el-col>
            <el-col :span="6">订单状态：{{tip.status[model.status]}}</el-col>
            <el-col :span="6">支付状态：{{tip.pay_status[model.pay_status]}}</el-col>
          </el-row>
          <el-row :gutter="20">
            <el-col :span="6">发货状态：{{tip.ship_status[model.ship_status]}}</el-col>
            <el-col :span="6">已支付金额：{{model.payed}}</el-col>
            <el-col :span="6">支付方式：{{tip.payment_code[model.payment_code]}}</el-col>
            <el-col :span="6">配送方式：{{model.logistics_name}}</el-col>
          </el-row>
          <el-row :gutter="20">
            <el-col :span="6">发票类型：{{tip.tax_type[model.tax_type]}}</el-col>
            <el-col :span="6">发票内容：{{model.tax_content}}</el-col>
            <el-col :span="6">税号：{{model.tax_code}}</el-col>
            <el-col :span="6">发票抬头：{{model.tax_title}}</el-col>
          </el-row>
          <el-row :gutter="20">
            <el-col :span="6">订单优惠金额：{{model.order_pmt}}</el-col>
            <el-col :span="6">商品优惠金额：{{model.goods_pmt}}</el-col>
            <el-col :span="6">优惠券优惠：{{model.coupon_pmt}}</el-col>
            <el-col :span="6">积分优惠：{{model.point_money}}</el-col>
          </el-row>
          <el-row :gutter="20">
            <el-col :span="6">商品总重量：{{model.total_volume}}</el-col>
            <el-col :span="6">商品总价：{{model.total_volume}}</el-col>
            <el-col :span="6">下单时间：{{model.created_at}}</el-col>
            <el-col :span="6">配送费用：{{model.cost_freight}}</el-col>
          </el-row>
          <el-row :gutter="20">
            <el-col :span="6">收货状态：{{tip.confirm[model.confirm]}}</el-col>
            <el-col :span="12">
              <FormField name="pay_amount" label="实付金额：" class="f-inline-row">
                <TextBox v-model="model.pay_amount" name="pay_amount"/>
              </FormField>
            </el-col>
          </el-row>
        </div>
      </el-card>
      <el-card class="box-card">
        <div slot="header" class="clearfix">
          <span>收货人信息</span>
        </div>
        <div class="text item">
          <el-row :gutter="20">
            <el-col :span="4">
              <FormField name="confirm_at" label="收货时间：" class="f-inline-row">
                <TextBox v-model="model.confirm_at" name="confirm_at"/>
              </FormField>
            </el-col>
            <el-col :span="4">
              <FormField name="ship_name" label="收货人：" class="f-inline-row">
                <TextBox v-model="model.ship_name" name="ship_name"/>
              </FormField>
            </el-col>
            <el-col :span="4">
              <FormField name="ship_phone" label="收货电话：" class="f-inline-row">
                <TextBox v-model="model.ship_phone" name="ship_phone"/>
              </FormField>
            </el-col>
            <el-col :span="12">
              <FormField name="ship_address" label="收货地址：" class="f-inline-row">
                <el-select v-model="provincev" placeholder="请选择">
                  <el-option
                    v-for="item in province"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id">
                  </el-option>
                </el-select>
                <el-select v-model="cityv" placeholder="请选择">
                  <el-option
                    v-for="item in city"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id">
                  </el-option>
                </el-select>
                <el-select v-model="areav" placeholder="请选择">
                  <el-option
                    v-for="item in area"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id">
                  </el-option>
                </el-select>

                <TextBox v-model="model.ship_address" name="ship_address"/>
              </FormField>
            </el-col>
          </el-row>
          <el-row :gutter="20">
            <el-col :span="6">买家备注：{{model.memo}}</el-col>
          </el-row>
        </div>
      </el-card>

      <el-card class="box-card" v-if="model.ext">
        <div slot="header" class="clearfix">
          <span>长期服务信息</span>
        </div>
        <div class="text item">
          <el-row :gutter="20">
            <el-col :span="6">服务地址</el-col>
            <el-col :span="6">服务时间</el-col>
            <el-col :span="6">服务状态</el-col>
          </el-row>
          <el-row :gutter="20">
            <el-col :span="6">{{model.ship_address}}</el-col>
            <el-col :span="6">
              <el-date-picker style="width: 90%" placeholder="选择日期" v-model="model.ext.appointment" type="date" value-format="timestamp" />
            </el-col>
            <el-col v-if="model.ext.status==1" :span="6">已服务</el-col>
            <el-col v-if="!model.ext.status==1" :span="6">未服务</el-col>
          </el-row>
        </div>
      </el-card>

      <el-card class="box-card">
        <div slot="header" class="clearfix">
          <span>商品信息</span>
        </div>
        <div class="text item">
          <el-table :data="model.items">
            <el-table-column prop="pn" label="单品编码"></el-table-column>
            <el-table-column prop="name" label="商品名称"></el-table-column>
            <el-table-column prop="price" label="商品单价"></el-table-column>
            <el-table-column prop="num" label="购买数量"></el-table-column>
            <el-table-column prop="amount" label="商品总价"></el-table-column>
            <el-table-column prop="weight" label="总重量"></el-table-column>
            <el-table-column prop="volume" label="总体积"></el-table-column>
            <el-table-column prop="delivery_num" label="发货数量"></el-table-column>
          </el-table>
        </div>
      </el-card>

      <FormField>
        <LinkButton style="margin-right: 20px" @click="verificationRow()">{{ $t('common.save') }}</LinkButton>
        <LinkButton @click="cancel()">{{ $t('common.goBack') }}</LinkButton>
      </FormField>
    <!-- <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>支付单/退款单</span>
      </div>
      <div class="text item">
        <el-row :gutter="20">支付单</el-row>
        <el-table :data="model.items">
          <el-table-column prop="gn" label="支付单号">
          </el-table-column>
          <el-table-column prop="pn" label="支付方式">
          </el-table-column>
          <el-table-column prop="name" label="第三方支付单号">
          </el-table-column>
          <el-table-column prop="price" label="支付金额">
          </el-table-column>
          <el-table-column prop="num" label="支付状态">
          </el-table-column>
          <el-table-column prop="amount" label="支付时间">
          </el-table-column>
        </el-table>
        <el-row :gutter="20">退款单</el-row>
        <el-table :data="model.items">
          <el-table-column prop="gn" label="退款单号">
          </el-table-column>
          <el-table-column prop="pn" label="退款方式">
          </el-table-column>
          <el-table-column prop="name" label="第三方支付单号">
          </el-table-column>
          <el-table-column prop="price" label="退款金额">
          </el-table-column>
          <el-table-column prop="num" label="退款状态">
          </el-table-column>
          <el-table-column prop="amount" label="申请时间">
          </el-table-column>
        </el-table>
      </div>
    </el-card>
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>发货单/提货单/退货单</span>
      </div>
      <div class="text item">
        <el-row :gutter="20">发货单</el-row>
        <el-table :data="model.items">
          <el-table-column prop="gn" label="发货单号">
          </el-table-column>
          <el-table-column prop="pn" label="快递公司">
          </el-table-column>
          <el-table-column prop="name" label="快递单号">
          </el-table-column>
          <el-table-column prop="price" label="收货人名">
          </el-table-column>
          <el-table-column prop="num" label="收货电话">
          </el-table-column>
          <el-table-column prop="amount" label="收货地址">
          </el-table-column>
        </el-table>
        <el-row :gutter="20">提货单</el-row>
        <el-table :data="model.items">
          <el-table-column prop="gn" label="提货单号">
          </el-table-column>
          <el-table-column prop="pn" label="提货门店">
          </el-table-column>
          <el-table-column prop="name" label="提货人名">
          </el-table-column>
          <el-table-column prop="price" label="提货电话">
          </el-table-column>
          <el-table-column prop="num" label="提货状态">
          </el-table-column>
          <el-table-column prop="amount" label="提货时间">
          </el-table-column>
          <el-table-column prop="amount" label="接待店员">
          </el-table-column>
        </el-table>
        <el-row :gutter="20">退货单</el-row>
        <el-table :data="model.items">
          <el-table-column prop="gn" label="退货单号">
          </el-table-column>
          <el-table-column prop="pn" label="快递公司">
          </el-table-column>
          <el-table-column prop="name" label="快递单号">
          </el-table-column>
          <el-table-column prop="price" label="退货状态">
          </el-table-column>
          <el-table-column prop="num" label=" 退货时间">
          </el-table-column>
        </el-table>
      </div>
    </el-card> -->
   <!--  <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>订单记录</span>
      </div>
      <div class="text item">
        <el-table :data="model.items">
          <el-table-column prop="gn" label="订单号">
          </el-table-column>
          <el-table-column prop="pn" label="操作类型">
          </el-table-column>
          <el-table-column prop="name" label="描述">
          </el-table-column>
          <el-table-column prop="price" label="时间">
          </el-table-column>
        </el-table>
      </div>
    </el-card> -->
    </Form>
    
  </div>
</template>
<script>
import * as apiOrder from '@/api/shop/order'
import * as apiRegion from '@/api/base/region'

export default {
  data() {
    return {
      model: {},
      tip: {
        status: ["", "正常", "删除", "取消"],
        pay_status: ["", "未付款", "已付款", "部分付款", "部分退款", "已退款"],
        order_status: ["", "正常", "完成", "取消"],
        ship_status: ["", "未发货", "已发货", "部分发货", "部分退货", "已退货"],
        payment_code: {"ali": "支付宝", "wechat": "微信"},
        tax_type: ["", "不发票", "个人发票", "公司发票"],
        confirm: ["", "未确认收货", "已确认收货"],
      },
      rules: {
        title: "required",
      },
      errors: {},
      loading: false,
      treeData: [],
      cmtResetHandle: 1,

      provincev:null,
      cityv:null,
      areav:null,
      province:[],
      city:[],
      area:[],
    };
  },
  created() {
    this.initModel()
    if (this.$route.query.id) {
      this.viewData(this.$route.query.id)
    }
  },
  watch: {
    "provincev": function () {
      this.getArea(this.provincev,1)
      this.area = [];
      this.cityv = null;
      this.areav = null;
    },
    "cityv": function () {
      if (this.cityv) {
        this.area = this.getArea(this.cityv,2)
      }
      this.areav = null;
    }
  },
  methods: {
    initModel() {
      this.model = {
        "id": null,
        "owner_id": null,
        "user_id": null,
        "order_amount": null,
        "pay_amount": null,
        "payed": null,
        "pay_status": null,
        "ship_status": null,
        "order_status": null,
        "payment_code": null,
        "payment_at": null,
        "logistics_id": null,
        "logistics_name": null,
        "cost_freight": null,
        "seller_id": null,
        "confirm": null,
        "confirm_at": null,
        "store_id": null,
        "ship_area_id": null,
        "ship_address": null,
        "ship_name": null,
        "ship_phone": null,
        "total_weight": null,
        "total_volume": null,
        "tax_type": null,
        "tax_content": null,
        "type": null,
        "tax_code": null,
        "tax_title": null,
        "point": null,
        "point_money": null,
        "promotion_info": null,
        "order_pmt": null,
        "goods_pmt": null,
        "coupon_pmt": null,
        "coupon": null,
        "memo": null,
        "ip": null,
        "mark": null,
        "source": null,
        "is_comment": null,
        "status": null,
        "created_at": null,
        "updated_at": null,
        "items": [{
            "order_id": null,
            "goods_id": null,
            "image_id": null,
            "price": null
          },
          {
            "order_id": null,
            "goods_id": null,
            "image_id": null,
            "price": null
          }
        ],
        "imageItem": [{
            "id": null,
            "file_url": null
          },
          {
            "id": null,
            "file_url": null
          }
        ],
        "userShipArea": [{
          "id": null,
          "code": null,
          "name": null,
          "province": null,
          "city": null,
          "area": null,
          "town": null,
          "parent_id": null
        }],
        "ext": {
          "appointment": '',
          "status":null
        },
        "area_id": null
      }
    },
    cancel() {
      this.$store.dispatch("tagsView/delView", this.$route).then(({ visitedViews }) => {
        this.$router.push({ path: "/shop/order/index" })
      })
    },
    verificationRow() {
      this.saveData(this.model);
    },
    async viewData(id) {
      let res = await apiOrder.view({ id: id });
      this.model = Object.assign({}, res.data)
      res = await apiRegion.getList({ id: 0 });
      let p = this.model.userShipArea[0];
      let c = this.model.userShipArea[1];
      let a = this.model.userShipArea[2];
      this.provincev = p.id;
      this.province = res.data;

      if (p.id) {
        res = await apiRegion.getList({ id: p.id })
        this.cityv = c.id;
        this.city = res.data
      }
      if (c.id) {
        res = await apiRegion.getList({ id: c.id })
        this.areav = a.id;
        this.area = res.data
      }
    },
    async saveData(data) {
      data.ship_area_id = this.areav ? this.areav : (this.cityv ? this.cityv : this.provincev)
      await apiOrder.update(data);

      this.$notify({
        type: "success",
        title: "操作成功"
      });
      this.cancel()
    },
    async getArea(id, level) {
        let res = await apiRegion.getList({id:id});
        if (level == 1) {
          this.city = res.data
        }
        if (level == 2) {
          this.area = res.data
        }
    },

  }
};

</script>
<style>
.text {
  font-size: 14px;
}

.item {
  margin-bottom: 18px;
}

.clearfix:before,
.clearfix:after {
  display: table;
  content: "";
}

.clearfix:after {
  clear: both
}

.box-card {
  width: 100%;
}

</style>
