<template>
  <div class="app-container">
    <LinkButton style="width:80px;margin-bottom:4px" @click="createRow()"><i class="el-icon-plus" />{{ $t('common.add') }}</LinkButton>
    <DataGrid :pagination="true" :lazy="true" :data="tableList" :total="total" :loading="loading" :page-number="pageNumber" :page-size="pageSize" @pageChange="onPageChange($event)">
      <GridColumn align="center" cell-css="datagrid-td-rownumber" width="30">
        <template slot="body" slot-scope="scope">
          {{ scope.rowIndex + 1 }}
        </template>
      </GridColumn>
      <GridColumn field="name" title="名称" align="center" />
      <GridColumn field="status" title="状态" align="center">
        <template slot="body" slot-scope="scope">
          {{ scope.row.status ==1 ? '显示' : '关闭' }}
        </template>
      </GridColumn>
      <GridColumn field="code" title="调用代码" align="center" />
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
      <Form ref="form" :model="model" :messages="messages" :rules="rules" style="padding:20px 20px" @validate="errors=$event">
        <FormField name="name" label="名称:">
          <TextBox v-model="model.name" input-id="name" name="name" />
        </FormField>
        <FormField name="status" label="状态:">
          <ComboBox v-model="model.status" input-id="status" :data="status" />
        </FormField>
        <FormField name="code" label="调用代码:">
          <TextBox v-model="model.code" name="code" :readonly="model.code && model.id ? true :false" />
        </FormField>

        <FormField name="advert" label="关联广告:">
          <ComboBox
            v-model="model.items"
            style="width: 142px"
            name="advert"
            value-field="id"
            text-field="name"
            :data="advert"
            :multiple="true"
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
import * as apiAdvertPosition from '@/api/cms/advertPosition'
import * as apiAdvert from '@/api/cms/advert'

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
          required: '名称必填.'
        }
      },
      errors: {},
      editingModel: null,
      total: 0,
      pageNumber: 1,
      pageSize: 15,
      loading: false,
      dialogVisible: false,
      dialogType: '',
      tableList: [],
      status: [
        { value: '1', text: '显示' },
        { value: '2', text: '隐藏' }
      ],
      advert: []
    }
  },
  created() {
    this.initModel()
    this.pagingData(this.pageNumber, this.pageSize)
    this.advertData()
  },
  methods: {
    initModel() {
      this.model = {
        name: null,
        status: null,
        code: null,
        items: []
      }
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
      this.viewData({ id: row.id })
      this.dialogType = 'edit'
      this.editingModel = row
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
      })
    },
    verificationRow() {
      this.$refs.form.validate(errors => {
        if (!errors) {
          this.saveData(this.model)
        }
      })
    },
    async pagingData(pageNumber, pageSize) {
      this.loading = true
      const result = await apiAdvertPosition.getList({ page: pageNumber, pageSize: pageSize })
      this.total = result.data.totalCount
      this.pageNumber = result.data.page
      this.tableList = result.data.list
      this.loading = false
    },
    async saveData(data) {
      if (this.editingModel) {
        await apiAdvertPosition.update(data)
        this.editingModel = null
        this.pagingData(this.pageNumber, this.pageSize)
      } else {
        await apiAdvertPosition.add(data)
        this.pagingData(1, this.pageSize)
      }
      this.dialogVisible = false
      this.$message({
        type: 'success',
        message: '操作成功'
      })
    },
    async deleteData(data) {
      await apiAdvertPosition.del(data)
    },
    async viewData(data) {
      const res = await apiAdvertPosition.view(data)
      this.dialogVisible = true
      this.model = res.data
    },
    async advertData() {
      const res = await apiAdvert.getList({ pageSize: 100 })
      this.advert = res.data.list
    }
  }
}

</script>
