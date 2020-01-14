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
      <GridColumn field="image" title="图片" align="center">
        <template slot="body" slot-scope="scope">
          <img height="25px" :src="scope.row.image.file_url">
        </template>
      </GridColumn>
      <GridColumn field="start_at" title="开始时间" align="center">
        <template slot="body" slot-scope="scope">
          {{ funs.formatTime(scope.row.created_at * 1000) }}
        </template>
      </GridColumn>
      <GridColumn field="end_at" title="结束时间" align="center">
        <template slot="body" slot-scope="scope">
          {{ funs.formatTime(scope.row.end_at * 1000) }}
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
      <Form ref="form" :model="model" :messages="messages" :rules="rules" style="padding:20px 20px" @validate="errors=$event">
        <FormField name="name" label="名称:">
          <TextBox v-model="model.name" input-id="name" name="name" />
        </FormField>
        <FormField name="image_id" label="图片:">
          <FileUpload :key="cmtResetHandle" :file="model.image" @input="emitFileUpload" />
        </FormField>
        <FormField name="advert_time" label="广告时间:">
          <el-date-picker v-model="datePicker" type="daterange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" value-format="timestamp" />
        </FormField>
        <FormField name="type" label="广告内容:">
          <ComboBox v-model="model.type" input-id="type" :data="type" @selectionChange="typeChange($event)" />
          <TextBox v-if="model.type==1" v-model="model.content" name="content" placeholder="输入地址" />
          <ComboBox v-if="model.type==2" v-model="model.content" value-field="id" text-field="name" :data="goods" placeholder="选择商品" />
          <ComboBox v-if="model.type==3" v-model="model.content" value-field="id" text-field="name" :data="article" placeholder="选择文章" />
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
import * as apiAdvert from '@/api/cms/advert'
import * as apiGoods from '@/api/spu/goods'
import FileUpload from '@/components/Upload/FileUpload'

export default {
  components: { FileUpload },
  data() {
    return {
      datePicker: [],
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
      type: [
        { value: '1', text: '链接地址' },
        { value: '2', text: '商品' },
        { value: '3', text: '文章' }
      ],
      cmtResetHandle: 1,
      goods: [],
      article: []
    }
  },
  watch: {
    'model': function() {
      ++this.cmtResetHandle
    },
    'datePicker': function() {
      this.model.start_at = this.datePicker[0]
      this.model.end_at = this.datePicker[1]
    }
  },
  created() {
    this.initModel()
    this.pagingData(this.pageNumber, this.pageSize)
    this.goodsData()
  },
  methods: {
    initModel() {
      this.datePicker = []
      this.model = {
        name: null,
        content: null,
        image_id: null,
        type: null,
        start_at: null,
        end_at: null,
        image: {
          id: 0,
          file_url: ''
        }
      }
    },
    typeChange(event) {
      if (this.model.type && this.model.type != event.value) {
        this.model.content = null
      }
      // console.log(event);
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
      // console.log(this.model);
      // return;
      this.$refs.form.validate(errors => {
        if (!errors) {
          this.saveData(this.model)
        }
      })
    },
    emitFileUpload(fileId) {
      this.model.image_id = fileId
    },
    async pagingData(pageNumber, pageSize) {
      this.loading = true
      const result = await apiAdvert.getList({ page: pageNumber, pageSize: pageSize })
      this.total = result.data.totalCount
      this.pageNumber = result.data.page
      this.tableList = result.data.list
      this.loading = false
    },
    async saveData(data) {
      if (this.editingModel) {
        await apiAdvert.update(data)
        this.editingModel = null
        this.pagingData(this.pageNumber, this.pageSize)
      } else {
        await apiAdvert.add(data)
        this.pagingData(1, this.pageSize)
      }
      this.dialogVisible = false
      this.$message({
        type: 'success',
        message: '操作成功'
      })
    },
    async deleteData(data) {
      await apiAdvert.del(data)
    },
    async viewData(data) {
      const res = await apiAdvert.view(data)
      this.dialogVisible = true
      this.model = res.data
      this.datePicker = [
        res.data.start_at * 1000,
        res.data.end_at * 1000
      ]
    },
    async goodsData() {
      const res = await apiGoods.getList({ pageSize: 100 })
      this.goods = res.data.list
    }
  }
}

</script>
