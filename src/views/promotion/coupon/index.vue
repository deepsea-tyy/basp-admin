<template>
  <div class="app-container">

    <LinkButton style="width:80px;margin-bottom:4px" @click="createRow()"><i class="el-icon-plus" />{{ $t('common.add') }}</LinkButton>
    <el-button type="primary" @click="batchDelete">{{ $t('common.delete') }}</el-button>

    <DataGrid :pagination="true" :lazy="true" :data="tableList" :total="total" :loading="loading" :page-number="queryParam.pageNumber" :page-size="queryParam.pageSize" style="margin-top: 10px;" @pageChange="onPageChange($event)">
      <GridColumnGroup :frozen="true" align="left" width="150">
        <GridHeaderRow>
          <GridColumn field="xuhao" title="#" align="center" cell-css="datagrid-td-rownumber">
            <template slot="body" slot-scope="scope">
              {{ scope.rowIndex + 1 }}
            </template>
          </GridColumn>
          <GridColumn field="ck" align="center">
            <template slot="header" slot-scope="scope">
              <CheckBox v-model="allChecked" @checkedChange="onAllCheckedChange($event)"></CheckBox>
            </template>
            <template slot="body" slot-scope="scope">
              <CheckBox v-model="scope.row.selected" @checkedChange="onCheckedChange($event)"></CheckBox>
            </template>
          </GridColumn>
        </GridHeaderRow>
      </GridColumnGroup>
      <GridColumnGroup>
        <GridHeaderRow>
          <GridColumn field="name" title="名称" align="center"  width="150"/>
          <GridColumn field="receive_num" title="可领次数" align="center"  width="150"/>
          <GridColumn field="code" title="调用代码" align="center"  width="150"/>
          <GridColumn field="status" title="状态" align="center"  width="150"/>
          <GridColumn field="exclusion" title="排他" align="center"  width="150"/>

          <GridColumn field="created_at" title="添加时间" align="center" width="150">
            <template slot="body" slot-scope="scope">
              {{ funs.formatTime(scope.row.created_at * 1000,2) }}
            </template>
          </GridColumn>
          <GridColumn field="updated_at" title="更新时间" align="center" width="150">
            <template slot="body" slot-scope="scope">
              {{ funs.formatTime(scope.row.updated_at * 1000,2) }}
            </template>
          </GridColumn>
        </GridHeaderRow>
      </GridColumnGroup>
      <GridColumnGroup :frozen="true" align="right" width="80">
        <GridHeaderRow>
          <GridColumn field="act" title="操作" align="center">
            <template slot="body" slot-scope="scope">
              <ButtonGroup style="height:24px">
                <LinkButton @click="updateRow(scope.row)"><i class="el-icon-edit-outline" /></LinkButton>
                <LinkButton @click="deleteRow(scope.row)"><i class="el-icon-delete" /></LinkButton>
              </ButtonGroup>
            </template>
          </GridColumn>
        </GridHeaderRow>
      </GridColumnGroup>
    </DataGrid>


    <el-dialog :visible.sync="dialogVisible" :title="dialogType==='edit'?$t('common.editTitle'):$t('common.addTitle')">
      <Form ref="form" :model="model" :rules="rules" @validate="errors=$event" style="padding:20px 50px">
        <FormField name="name" label="名称:">
          <TextBox name="name" v-model="model.name"></TextBox>
        </FormField>
        <FormField name="num" label="促销数量:">
          <NumberBox name="num" v-model="model.num"></NumberBox>
        </FormField>
        <FormField name="receive_num" label="领取次数:">
          <NumberBox name="receive_num" v-model="model.receive_num"></NumberBox>
        </FormField>
        <FormField name="code" label="调用代码:">
          <TextBox name="code" v-model="model.code"></TextBox>
        </FormField>
        <FormField name="scene" label="使用场景:">
          <ComboBox v-model="model.scene" :data="scene" />
        </FormField>
        <FormField name="exclusion" label="排它:">
          <ComboBox v-model="model.exclusion" :data="exclusion" />
        </FormField>
        <!-- <FormField name="type" label="促销类型:">
          <ComboBox v-model="model.type" :data="type" />
        </FormField> -->
        <FormField name="status" label="领取方式:">
          <ComboBox v-model="model.status" :data="status" />
        </FormField>
        <FormField name="advert_time" label="有效时间:">
          <el-date-picker v-model="datePicker" type="daterange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" value-format="timestamp" />
        </FormField>

        <FormField name="content" label="条件:">
          <ComboBox v-model="model.conditions.condition_type" :data="condition_type" />
          <TextBox v-if="model.conditions.condition_type && model.conditions.condition_type!=1" v-model="model.conditions.condition" :placeholder="condition_desc"></TextBox>
          <TextBox v-if="model.conditions.condition_type && (model.conditions.condition_type==2 || model.conditions.condition_type==3)" v-model="model.conditions.content" :placeholder="content_desc"></TextBox>
        </FormField>

        <FormField name="result" label="结果:">
          <ComboBox v-model="model.conditions.result_type" :data="result_type" />
          <TextBox  v-model="model.conditions.result"></TextBox>
        </FormField>

        <FormField>
          <LinkButton @click="verificationRow()" style="margin-right: 20px">{{$t('common.confirm')}}</LinkButton>
          <LinkButton @click="dialogVisible=false">{{$t('common.cancel')}}</LinkButton>
        </FormField>
      </Form>
    </el-dialog>
  </div>
</template>
<script>
import * as apiPromotion from '@/api/promotion/promotion'

export default {
  data() {
    return {
      datePicker: [],
      total: 0,
      tableList: [],
      loading: false,
      queryParam: {
        page: 1,
        pageSize: 20,
        type: 1
      },
      allChecked: false,
      rowClicked: false,
      dialogVisible: false,
      dialogType: '',
      errors: {},
      model: {
        conditions:{
          type:null
        }
      },
      rules: {
        name: 'required'
      },
      status:[
        { value: 1, text: '默认' },
        { value: 2, text: '可直接领取' },
      ],
      type:[
        { value: 1, text: '优惠券' },
        { value: 2, text: '促销' },
        { value: 3, text: '团购' },
        { value: 4, text: '秒杀' },
      ],
      scene:[
        { value: 1, text: '默认' },
        { value: 2, text: '其他' },
      ],
      exclusion:[
        { value: 1, text: '是' },
        { value: 2, text: '否' },
      ],
      condition_type:[
        { value: 1, text: '全部商品' },
        { value: 2, text: '商品分类' },
        { value: 3, text: '指定商品' },
        { value: 4, text: '订单满减' },
      ],
      result_type:[
        { value: 1, text: '商品减固定金额' },
        { value: 2, text: '商品折扣' },
        { value: 3, text: '商品一口价' },
        { value: 4, text: '订单减固定金额' },
        { value: 5, text: '订单折扣' },
        { value: 6, text: '订单一口价' },
      ],
      condition_desc:null,
      content_desc:null
    }
  },
  created() {
    this.pagingData()
  },
  computed: {
    checkedRows() {
      return this.tableList.filter(row => row.selected);
    }
  },
  watch: {
    'model.conditions.condition_type': function(val, oldval) {
      if (val == 2 || val == 3) {
        this.condition_desc = "商品数量需大于此设置"
        this.content_desc = val == 2 ? "商品分类id" : "商品id"
      }else if (val == 4) {
        this.condition_desc = "订单金额需大于此设置"
      }else{
        this.condition_desc = ""
      }
      console.log(val,oldval)
    }
  },
  methods: {
    initModel() {
      this.model = {
        name: null,
        num: null,
        receive_num: null,
        scene: null,
        type: 1,
        code: null,
        exclusion: null,
        start_at: null,
        end_at: null,
        conditions: {
          condition_type: null,
          condition: null,
          content: null,
          result_type: null,
          result: null,
        }
      }
    },
    batchDelete(){
      let ids = this.checkedRows.map((item) => {
        return item.id
      })
      this.$confirm(this.$t('common.deleteTitle'), '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.deleteData({id:ids});
      })
    },
    onAllCheckedChange(checked) {
      if (this.rowClicked) {
        return;
      }
      this.tableList = this.tableList.map(row => {
        return Object.assign({}, row, {
          selected: checked
        });
      });
    },
    onCheckedChange(checked) {
      this.allChecked = this.checkedRows.length === this.tableList.length;
      this.rowClicked = true;
      this.$nextTick(() => (this.rowClicked = false));
    },
    onPageChange(event) {
      this.queryParam.page = event.pageNumber
      this.pagingData()
    },
    verificationRow() {
      this.$refs.form.validate(errors => {
        if (!errors) {
          this.model.start_at = this.datePicker[0]
          this.model.end_at = this.datePicker[1]
          this.saveData(this.model)
        }
      })
    },
    createRow() {
      this.initModel()
      this.editingModel = null
      this.dialogType = 'add'
      this.dialogVisible = true
    },
    updateRow(row) {
      this.viewData(row)
      this.editingModel = row;
      this.dialogType = 'edit';
      this.dialogVisible = true
    },
    deleteRow(row) {
      this.$confirm(this.$t('common.deleteTitle'), '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.deleteData(row)
      })
    },
    async pagingData() {
      this.loading = true
      let res = await apiPromotion.getList(this.queryParam)
      this.total = res.data.totalCount
      this.tableList = res.data.list
      this.loading = false
    },
    async saveData(data) {
      if (this.dialogType == 'edit') {
        await apiPromotion.update(data)
      } else {
        await apiPromotion.add(data)
      }

      this.dialogVisible = false
      this.pagingData()
    },
    async deleteData(data) {
      await apiPromotion.del(data)
      this.pagingData()
      this.$message({
        type: 'success',
        message: '删除成功!'
      })
    },
    async viewData(data) {
      const res =  await apiPromotion.view(data)
      this.model = res.data;
      this.datePicker = [
        res.data.start_at * 1000,
        res.data.end_at * 1000
      ]
    }
  }
}

</script>
