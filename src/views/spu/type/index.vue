<template>
  <div class="app-container">
    <LinkButton style="width:80px;margin-bottom:4px" @click="createRow()"><i class="el-icon-plus" />{{ $t('common.add') }}</LinkButton>
    <DataGrid
      :pagination="true"
      :lazy="true"
      :data="tableList"
      :total="total"
      :loading="loading"
      :page-number="pageNumber"
      :page-size="pageSize"
      @pageChange="onPageChange($event)"
    >
      <GridColumn align="center" cell-css="datagrid-td-rownumber" width="30">
        <template slot="body" slot-scope="scope">
          {{ scope.rowIndex + 1 }}
        </template>
      </GridColumn>
      <GridColumn field="name" title="名称" align="center" />
      <GridColumn field="created_at" title="添加时间" align="center">
        <template slot="body" slot-scope="scope">
          {{ funs.formatTime(scope.row.created_at * 1000,2) }}
        </template>
      </GridColumn>
      <GridColumn field="updated_at" title="更新时间" align="center">
        <template slot="body" slot-scope="scope">
          {{ funs.formatTime(scope.row.updated_at * 1000,2) }}
        </template>
      </GridColumn>
      <GridColumn field="act" title="操作" align="center" width="100">
        <template slot="body" slot-scope="scope">
          <ButtonGroup style="height:24px">
            <LinkButton @click="updateRow(scope.row)"><i class="el-icon-edit-outline" /></LinkButton>
            <LinkButton @click="deleteRow(scope.row)"><i class="el-icon-delete" /></LinkButton>
          </ButtonGroup>
        </template>
      </GridColumn>
    </DataGrid>
    <el-dialog :visible.sync="dialogVisible" :title="dialogType==='edit'?$t('common.editTitle'):$t('common.addTitle')">
      <Form ref="form" :model="model" :messages="messages" :rules="rules" style="padding:20px 50px" @validate="errors=$event">
        <FormField name="name" label="名称:">
          <TextBox v-model="model.name" input-id="name" name="name" />
        </FormField>

        <FormField name="specs" label="商品属性:">
          <ComboBox
            v-model="model.specs"
            input-id="specs"
            name="specs"
            :data="gspecs"
            :multiple="true"
            :text-formatter="formatText"
          />
        </FormField>
        <FormField name="params" label="商品参数:">
          <ComboBox
            v-model="model.params"
            input-id="params"
            name="params"
            :data="gparams"
            :multiple="true"
            :text-formatter="formatText"
          />
        </FormField>

        <FormField>
          <LinkButton style="margin-right: 20px" @click="verificationRow()">{{ $t('common.confirm') }}</LinkButton>
          <LinkButton @click="dialogVisible=false">{{ $t('common.cancel') }}</LinkButton>
        </FormField>
      </Form>
    </el-dialog>
  </div>
</template>
<script>
import * as apiType from '@/api/spu/type'
import * as apiSpec from '@/api/spu/spec'
import * as apiParam from '@/api/spu/param'
export default {
  data() {
    return {
      title: '',
      model: {},
      rules: {
        name: 'required'
      },
      messages: {
        name: {
          required: '标签名称必填.'
        }
      },
      errors: {},
      editingModel: null,
      total: 0,
      pageNumber: 1,
      pageSize: 15,
      tableList: [],
      loading: false,
      dialogVisible: false,
      dialogType: '',
      gspecs: [],
      gparams: []
    }
  },
  created() {
    this.initModel()
    this.pagingData(this.pageNumber, this.pageSize)
    this.getSPList()
  },
  methods: {
    initModel() {
      this.model = {
        name: null,
        specs: null,
        params: null

      }
    },
    formatText(value) {
      return value
    },
    onPageChange(event) {
      this.pagingData(event.pageNumber, event.pageSize)
    },
    createRow() {
      this.initModel()
      this.editingModel = null
      this.dialogType = 'add'
      this.dialogVisible = true
    },
    updateRow(row) {
      this.viewData(row)
      this.editingModel = row
      this.dialogType = 'edit'
      this.dialogVisible = true
    },
    verificationRow() {
      this.$refs.form.validate(errors => {
        if (!errors) {
          this.saveData(this.model)
        }
      })
    },
    deleteRow(row) {
      this.$confirm(this.$t('common.deleteTitle'), '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.deleteData(row)
        this.pagingData(this.pageNumber, this.pageSize)
        this.$message({
          type: 'success',
          message: '删除成功!'
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    async pagingData(pageNumber, pageSize) {
      this.loading = true
      const result = await apiType.getList({ page: pageNumber, pageSize: pageSize })
      // console.log(result.data);
      this.total = result.data.totalCount
      this.pageNumber = result.data.page
      this.tableList = result.data.list
      this.loading = false
    },
    async saveData(data) {
      if (this.editingModel) {
        await apiType.update(data)
        this.pagingData(this.pageNumber, this.pageSize)
      } else {
        await apiType.add(data)
        this.pagingData(1, this.pageSize)
      }
      this.dialogVisible = false
    },
    async deleteData(data) {
      await apiType.del(data)
    },
    async getSPList() {
      let res = await apiSpec.getList({ page: 1, pageSize: 100 })
      this.gspecs = res.data.list.map((item) => {
        item.value = item.id
        item.text = item.name
        return item
      })
      res = await apiParam.getList({ page: 1, pageSize: 100 })
      this.gparams = res.data.list.map((item) => {
        item.value = item.id
        item.text = item.name
        return item
      })
    },
    async viewData(row) {
      const res = await apiType.view(row)
      res.data.specs = res.data.specItems.map((item) => {
        return item.id
      })
      res.data.params = res.data.paramsItems.map((item) => {
        return item.id
      })
      this.model = Object.assign({}, res.data)
    }
  }
}
</script>
