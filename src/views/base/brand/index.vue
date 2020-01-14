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
      <GridColumn field="logo" title="logo" align="center">
        <template slot="body" slot-scope="scope">
          <img height="25px" :src="scope.row.image.file_url">
        </template>
      </GridColumn>
      <GridColumn field="status" title="状态" align="center">
        <template slot="body" slot-scope="scope">
          {{ scope.row.status == 1? '正常':'删除' }}
        </template>
      </GridColumn>
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
            <!-- <LinkButton><svg-icon icon-class="eye-open" /></LinkButton> -->
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
        <FormField name="logo" label="logo:">
          <FileUpload :key="cmtResetHandle" :file="model.image" @input="emitFileUpload" />
        </FormField>
        <FormField name="status" label="状态:">
          <ComboBox v-model="model.status" input-id="status" name="status" :data="fstatus" />
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
import * as apiBrand from '@/api/base/brand'
import FileUpload from '@/components/Upload/FileUpload'

export default {
  components: { FileUpload },
  data() {
    return {
      title: '',
      model: {
        name: null,
        logo: null,
        status: null,
        image: {
          id: 0,
          file_url: ""
        }
      },
      fstatus: [
        { value: 1, text: '正常' },
        { value: 2, text: '删除' }
      ],
      rules: {
        name: 'required'
      },
      messages: {
        name: {
          required: '标签名称必填.'
        },
        style: {
          required: '样式必填.'
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
      cmtResetHandle: 1
    }
  },
  watch: {
    "model": function() {
      ++this.cmtResetHandle
    }
  },
  created() {
    this.pagingData(this.pageNumber, this.pageSize)
  },
  methods: {
    onPageChange(event) {
      this.pagingData(event.pageNumber, event.pageSize)
    },
    emitFileUpload(fileId) {
      this.model.logo = fileId
      // console.log(this.model);
    },
    async pagingData(pageNumber, pageSize) {
      this.loading = true
      const result = await apiBrand.getList({ page: pageNumber, pageSize: pageSize })
      // console.log(result.data);
      this.total = result.data.totalCount
      this.pageNumber = result.data.page
      this.tableList = result.data.list
      this.loading = false
    },
    createRow() {
      this.model = {
        name: null,
        style: null
      }
      this.editingModel = null
      this.dialogType = 'add'
      this.dialogVisible = true
    },
    updateRow(row) {
      this.viewData({ id: row.id })
      this.dialogType = 'edit'
      this.editingModel = row
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
      })
    },
    getError(name) {
      return this.errors[name] && this.errors[name].length ?
        this.errors[name][0] :
        null
    },
    hasError(name) {
      return this.getError(name) != null
    },
    async saveData(data) {
      if (this.editingModel) {
        await apiBrand.update(data)
        this.editingModel = null
        this.pagingData(this.pageNumber, this.pageSize)
      } else {
        await apiBrand.add(data)
        this.pagingData(1, this.pageSize)
      }
      this.dialogVisible = false
    },
    async deleteData(data) {
      await apiBrand.del(data)
    },
    async viewData(data) {
      let res = await apiBrand.view(data)
      this.dialogVisible = true
      this.model = res.data
    }
  }
}

</script>
