<template>
  <div class="app-container">
    <!-- f-inline-row -->
    <Form ref="form" :model="model" :messages="messages" :rules="rules" style="padding:20px 20px" @validate="errors=$event">
      <FormField name="name" label="商品名称:" class="f-full">
        <TextBox v-model="model.name" input-id="name" name="name" />
      </FormField>
      <FormField name="type" label="SPU类型:" class="f-inline-row">
        <ComboBox v-model="model.type" input-id="type" name="type" :data="options.type" />
      </FormField>
      <FormField name="cat_id" label="商品分类:" class="f-inline-row">
        <el-cascader v-model="model.cat_id" :options="treeData" clearable :props="{value:'id', label:'name', expandTrigger: 'hover'}"></el-cascader>
      </FormField>
      <FormField name="type_id" label="商品类型:" class="f-inline-row">
        <ComboBox v-model="model.type_id" input-id="type_id" name="type_id" :data="gtype" />
      </FormField>
      <FormField name="is_nomal_virtual" label="实体商品:" class="f-inline-row">
        <ComboBox v-model="model.is_nomal_virtual" input-id="is_nomal_virtual" name="is_nomal_virtual" :data="options.status" />
      </FormField>
      <FormField name="brand_id" label="商品品牌:" class="f-inline-row">
        <ComboBox v-model="model.brand_id" input-id="brand_id" name="brand_id" :data="gbrand" />
      </FormField>
      <FormField name="is_on_shelves" label="是否上架:" class="f-inline-row">
        <ComboBox v-model="model.is_on_shelves" input-id="is_on_shelves" name="is_on_shelves" :data="options.status" />
      </FormField>
      <FormField name="is_stock_check" label="库存检测:" class="f-inline-row">
        <ComboBox v-model="model.is_stock_check" input-id="is_stock_check" name="is_stock_check" :data="options.status" />
      </FormField>
      <FormField name="is_recommend" label="推荐:" class="f-inline-row">
        <ComboBox v-model="model.is_recommend" input-id="is_recommend" name="is_recommend" :data="options.status" />
      </FormField>
      <FormField name="is_hot" label="热门:" class="f-inline-row">
        <ComboBox v-model="model.is_hot" input-id="is_hot" name="is_hot" :data="options.status" />
      </FormField>
      <FormField name="stock_unit" label="库存单位:" class="f-inline-row">
        <TextBox v-model="model.stock_unit" input-id="stock_unit" name="stock_unit" />
      </FormField>
      <FormField name="weight_unit" label="重量单位:" class="f-inline-row">
        <TextBox v-model="model.weight_unit" input-id="weight_unit" name="weight_unit" />
      </FormField>
      <FormField name="volume_unit" label="体积单位:" class="f-inline-row">
        <TextBox v-model="model.volume_unit" input-id="volume_unit" name="volume_unit" />
      </FormField>
      <FormField name="sort" label="排序:" class="f-inline-row">
        <TextBox v-model="model.sort" input-id="sort" name="sort" />
      </FormField>
      <FormField name="keywords" label="关键词:" class="f-inline-row">
        <TextBox v-model="model.keywords" input-id="keywords" :multiline="true" name="keywords" placeholder="多个请换行" style="height:80px" />
      </FormField>

      <FormField v-if="productsShow" name="items" label="单品列表:">
        <table>
          <thead>
            <tr>
              <th>默认单品</th>
              <th>单品编号</th>
              <th>属性规格</th>
              <th>售价</th>
              <th>成本价</th>
              <th>市场价</th>
              <th>库存</th>
              <th>冻结库存</th>
              <th>重量</th>
              <th>体积</th>
              <th>操作</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(item, index) in model.productItems">
              <td>
                <ComboBox v-model="item.is_default" placeholder="选择默认" :data="options.status" />
              </td>
              <td>
                <TextBox v-model="item.pn" placeholder="可自动生成" />
              </td>
              <td>
                <TextBox v-model="item.specs" :disabled="true" />
              </td>
              <td>
                <TextBox v-model="item.price" placeholder="0.00" />
              </td>
              <td>
                <TextBox v-model="item.costprice" placeholder="0.00" />
              </td>
              <td>
                <TextBox v-model="item.mktprice" placeholder="0.00" />
              </td>
              <td>
                <NumberBox v-model="item.stock" placeholder="0.00" />
              </td>
              <td>
                <NumberBox v-model="item.freeze_stock" placeholder="0.00" />
              </td>
              <td>
                <TextBox v-model="item.weight" placeholder="0.00" />
              </td>
              <td>
                <TextBox v-model="item.volume" placeholder="0.00" />
              </td>
              <td width="50px" align="center">
                <LinkButton @click="removeInput(index)"><i class="el-icon-delete" /></LinkButton>
              </td>
            </tr>
          </tbody>
        </table>
      </FormField>
      
      <div v-for="(item, index) in model.productItems" v-if="!productsShow">
        <FormField name="price" label="售价:" class="f-inline-row">
          <TextBox v-model="item.price" placeholder="0.00">
            <Addon>
              <span v-if="item.price!=null" class="textbox-icon icon-clear" @click="item.price=null" />
            </Addon>
          </TextBox>
        </FormField>
        <FormField name="costprice" label="成本价:" class="f-inline-row">
          <TextBox v-model="item.costprice" placeholder="0.00">
            <Addon>
              <span v-if="item.costprice!=null" class="textbox-icon icon-clear" @click="item.costprice=null" />
            </Addon>
          </TextBox>
        </FormField>
        <FormField name="mktprice" label="市场价:" class="f-inline-row">
          <TextBox v-model="item.mktprice" placeholder="0.00">
            <Addon>
              <span v-if="item.mktprice!=null" class="textbox-icon icon-clear" @click="item.mktprice=null" />
            </Addon>
          </TextBox>
        </FormField>
        <FormField name="stock" label="库存:" class="f-inline-row">
          <NumberBox v-model="item.stock" placeholder="0.00">
            <Addon>
              <span v-if="item.stock!=null" class="textbox-icon icon-clear" @click="item.stock=null" />
            </Addon>
          </NumberBox>
        </FormField>
        <FormField name="weight" label="重量:" class="f-inline-row">
          <TextBox v-model="item.weight" placeholder="0.00">
            <Addon>
              <span v-if="item.weight!=null" class="textbox-icon icon-clear" @click="item.weight=null" />
            </Addon>
          </TextBox>
        </FormField>
        <FormField name="volume" label="体积:" class="f-inline-row">
          <TextBox v-model="item.volume" placeholder="0.00">
            <Addon>
              <span v-if="item.volume!=null" class="textbox-icon icon-clear" @click="item.volume=null" />
            </Addon>
          </TextBox>
        </FormField>
        <FormField name="freeze_stock" label="冻结库存:" class="f-inline-row">
          <NumberBox v-model="item.freeze_stock" placeholder="0.00">
            <Addon>
              <span v-if="item.freeze_stock!=null" class="textbox-icon icon-clear" @click="item.freeze_stock=null" />
            </Addon>
          </NumberBox>
        </FormField>
      </div>
      <FormField name="brief" label="商品简介:" class="f-full">
        <TextBox v-model="model.brief" input-id="brief" :multiline="true" name="brief" style="height:120px" />
      </FormField>
      <FormField name="video" label="视频简介:" class="f-full">
        <div>
          <FileUpload :key="cmtResetHandle" :file="model.videoItem" @input="emitVideoUpload" previewType="shortcut"/>
        </div>
      </FormField>
      <FormField name="image_id" label="商品图片:" class="f-full">
        <ImageListUpload :value="model.imageItems" @input="emitImageUpload" />
      </FormField>
      <FormField name="content" label="商品详情:" class="f-full">
        <Tinymce ref="editor" v-model="model.content" :height="400" :width="'100%'"/>
      </FormField>
      <FormField>
        <LinkButton style="margin-right: 20px" @click="verificationRow()">{{ $t('common.save') }}</LinkButton>
        <LinkButton @click="cancel()">{{ $t('common.goBack') }}</LinkButton>
      </FormField>
    </Form>
  </div>
</template>
<script>
import * as apiGoods from "@/api/spu/goods"
import * as apiBrand from "@/api/base/brand"
import * as apiType from "@/api/spu/type"
import * as apiCategory from "@/api/spu/category"
import Tinymce from "@/components/Tinymce"
import FileUpload from "@/components/Upload/FileUpload"
import ImageListUpload from "@/components/Upload/ImageListUpload"

const pageOption = {
  is_on_shelves: [{
      value: "1",
      text: "上架"
    }, {
      value: "2",
      text: "下架"
    },
    {
      value: "0",
      text: "其他"
    }
  ],
  type: [{
    value: "1",
    text: "单品"
  }, {
    value: "2",
    text: "规格品"
  }],
  status: [{
    value: "1",
    text: "是"
  }, {
    value: "2",
    text: "否"
  }]
}

export default {
  components: { Tinymce, FileUpload, ImageListUpload },
  data() {
    return {
      model: {},
      options: pageOption,
      rules: {
        type: "required",
        name: "required",
        type_id: "required",
        is_nomal_virtual: "required",
        // price: "required",
        cat_id: "required"
      },
      messages: {
        name: {
          required: "商品名称必填."
        }
      },
      errors: {},
      total: 0,
      tableList: [],
      loading: false,
      gbrand: [],
      gtype: [],
      treeData: [],
      productsShow: false,
      oldModel: [],
      cmtResetHandle: 1
    }
  },
  watch: {
    "model.type": "openSpec",
    "model.type_id": "openSpec",
    "model": function() {
      ++this.cmtResetHandle
    }
  },
  created() {
    this.initModel()
    this.getSPList()
    this.getTreeData()
    this.viewData(this.$route.query.id)
  },
  methods: {
    initModel() {
      this.model = {
        type_id: null,
        type: null,
        cat_id: [],
        is_nomal_virtual: null,
        name: null,
        brand_id: null,
        brief: null,
        video: null,
        image_id: null,
        is_on_shelves: null,
        is_stock_check: null,
        stock_unit: null,
        weight_unit: null,
        volume_unit: null,
        content: null,
        keywords: null,
        sort: null,
        is_recommend: null,
        is_hot: null,
        imageItems: [],
        productItems: [],
        videoItem: {
          id: 0,
          file_url: ""
        }
      }
    },
    cancel() {
      this.$store.dispatch("tagsView/delView", this.$route).then(({ visitedViews }) => {
        this.$router.push({path:"/spu/goods/index"})
      })
    },
    emitVideoUpload(fileId) {
      this.model.video = fileId
    },
    emitImageUpload(arr) {
      if (arr.length > 0) {
        this.model.image_id = arr[0].id
      }
    },
    removeInput(index) {
      if (this.model.productItems.length > 1) {
        this.model.productItems.splice(index, 1)
      }
    },
    openSpec(val, oldVal) {
      if (this.model.type == 1) {
        this.productsShow = false
        if (this.oldModel.productItems.length > 1) {
          this.model.productItems = []
          const product = this.getProductItem()
          product.is_default = 1
          this.model.productItems.push(product)
        } else {
          this.model.productItems = this.oldModel.productItems
        }
      }

      if (this.model.type == 2) {
        // console.log(this.model.type_id,this.oldModel.type)
        this.productsShow = true
        if ((this.model.type_id == this.oldModel.type_id) && this.oldModel.type == 2) {
          this.model.productItems = this.oldModel.productItems
        } else {
          this.getSpecs(this.model.type_id)
        }
      }
    },
    verificationRow() {
      this.$refs.form.validate(errors => {
        if (!errors) {
          this.saveData(this.model)
        }
      })
    },
    async getSpecs(type_id) {
      this.loading = true
      const result = await apiGoods.spec(type_id)
      this.model.productItems = []
      result.data.forEach((spec, index) => {
        const product = this.getProductItem()
        if (!index) {
          product.is_default = 1
        }
        product.specs = spec
        this.model.productItems.push(product)
      })
    },
    getProductItem() {
      return {
        price: null,
        costprice: null,
        mktprice: null,
        stock: null,
        freeze_stock: null,
        is_default: null,
        weight: null,
        volume: null,
        specs: null,
        pn: null
      }
    },
    async saveData(data) {
      // console.log(data);return;
      await apiGoods.update(data)
      this.cancel()
    },
    async getSPList() {
      let res = await apiBrand.getList({ page: 1, pageSize: 100 })
      this.gbrand = res.data.list.map((item) => {
        item.value = item.id
        item.text = item.name
        return item
      })
      res = await apiType.getList({ page: 1, pageSize: 100 })
      this.gtype = res.data.list.map((item) => {
        item.value = item.id
        item.text = item.name
        return item
      })
    },
    async viewData(id) {
      const res = await apiGoods.view({ id: id })
      res.data.sort = res.data.sort.toString()
      this.model = Object.assign({}, res.data)
      this.oldModel = res.data
      if (this.model.videoItem.length < 1) {
        this.model.videoItem = {};
      }
      // console.log(this.model);return
    },
    async getTreeData() {
      const res = await apiCategory.getTree()
      this.treeData = res.data
    }
  }
}

</script>
