<template>
  <div class="app-container">

    <router-link to="/base/file/upload"><el-button type="primary"><i class="el-icon-plus" />{{ $t('route.FileUpload') }}</el-button></router-link>
    
    <DataGrid :pagination="true" :lazy="true" :data="tableList" :total="total" :loading="loading" :pageNumber="pageNumber" :pageSize="pageSize" @pageChange="onPageChange($event)">
      <GridColumn align="center" cellCss="datagrid-td-rownumber" width="30">
        <template slot="body" slot-scope="scope">
          {{scope.rowIndex + 1}}
        </template>
      </GridColumn>
      <GridColumn field="id" title="文件编号" align="center"></GridColumn>
      <GridColumn field="file_url" title="缩略图" align="center">
        <template slot="body" slot-scope="scope">
          <img height="25px" :src="getBase64(scope.row.ext)"/>
        </template>
      </GridColumn>
      <GridColumn field="name" title="文件名称" align="center"></GridColumn>
      <GridColumn field="photo_width" title="图片宽度" align="center"></GridColumn>
      <GridColumn field="photo_width" title="图片高度" align="center"></GridColumn>
      <GridColumn field="file_size" title="文件大小" align="center"></GridColumn>
      <GridColumn field="mime" title="文件类型" align="center"></GridColumn>
      <GridColumn field="status" title="文件状态" align="center">
        <template slot="body" slot-scope="scope">
          {{scope.row.status == 1? '正常':'删除'}}
        </template>
      </GridColumn>
      <GridColumn field="created_at" title="添加时间" align="center">
        <template slot="body" slot-scope="scope">
          {{funs.formatTime(scope.row.created_at * 1000,2)}}
        </template>
      </GridColumn>
      <GridColumn field="updated_at" title="更新时间" align="center">
        <template slot="body" slot-scope="scope">
          {{funs.formatTime(scope.row.updated_at * 1000,2)}}
        </template>
      </GridColumn>
      <GridColumn field="act" title="操作" align="center" width="100">
        <template slot="body" slot-scope="scope">
          <ButtonGroup style="height:24px">
            <LinkButton>
              <svg-icon icon-class="eye-open" />
            </LinkButton>
            <LinkButton @click="updateRow(scope.row)"><i class="el-icon-edit-outline" /></LinkButton>
            <LinkButton @click="deleteRow(scope.row)"><i class="el-icon-delete" /></LinkButton>
          </ButtonGroup>
        </template>
      </GridColumn>
    </DataGrid>
    <el-dialog :visible.sync="dialogVisible" :title="dialogType==='edit'?$t('common.editTitle'):$t('common.addTitle')">
      <Form ref="form" :model="model" :rules="rules" @validate="errors=$event" style="padding:20px 50px">
        <FormField name="name" label="名称:">
          <TextBox inputId="name" name="name" v-model="model.name"></TextBox>
        </FormField>
        <FormField name="status" label="状态:">
          <ComboBox inputId="status" name="status" :data="fstatus" v-model="model.status"></ComboBox>
        </FormField>
        <FormField name="file" label="上传图片:">
          <FileUpload :key="cmtResetHandle" :file="model" @input="emitFileUpload" :previewType="previewType"/>
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
import * as apiFile from '@/api/base/file'
import { getToken } from '@/utils/auth'
import FileUpload from '@/components/Upload/FileUpload'

export default {
  components: { FileUpload },
  data() {
    return {
      title: '',
      model: {},
      rules: {
        name: 'required'
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
      fstatus: [
        { value: 1, text: "正常" },
        { value: 2, text: "删除" }
      ],
      files: [],
      uploadUrl: '',
      headers: {},
      limit: 1,
      cmtResetHandle: 1,
      previewType: 'normal'
    };
  },
  watch: {
    "model": function() {
      ++this.cmtResetHandle
    }
  },
  created() {
    this.initModel()
    this.pagingData(this.pageNumber, this.pageSize);
    this.headers = { 'X-Token': getToken() }
    this.uploadUrl = this.$store.getters.uploadUrl
    // console.log(this.headers);
  },
  methods: {
    initModel() {
      this.model = {
        name: null,
        status: null,
        id: null
      }
    },
    getBase64 (ext) {
      let imageExt = ['jpg','jpeg','png'];
      if (imageExt.includes(ext)) {
        ext = 'jpg'
      }
      if (!this.$store.getters.filePreviewExt.includes(ext)) {
        return this.$store.getters.filePreviewImage("./unknown.png")
      }
        console.log(ext)
      return this.$store.getters.filePreviewImage('./' + ext + ".png")
    },
    emitFileUpload(fileId) {
      this.model.logo = fileId
      // console.log(this.model);
    },
    handleSuccess(response, file, fileList) {
      this.model.id = response.data.id
    },
    onPageChange(event) {
      this.pagingData(event.pageNumber, event.pageSize);
    },
    async pagingData(pageNumber, pageSize) {
      this.loading = true;
      let result = await apiFile.getList({ page: pageNumber, pageSize: pageSize });
      this.total = result.data.totalCount;
      this.pageNumber = result.data.page;
      this.tableList = result.data.list;
      this.loading = false;
    },
    createRow() {
      this.initModel()
      this.editingModel = null;
      this.dialogType = 'add';
      this.dialogVisible = true
    },
    updateRow(row) {
      if (row.mime.indexOf('image')>=0) {
        this.previewType = 'normal'
      }else{
        this.previewType = 'shortcut'
      }
      this.editingModel = row;
      this.model = Object.assign({}, row);
      this.dialogType = 'edit';
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
        });
      })
    },
    getError(name) {
      return this.errors[name] && this.errors[name].length ?
        this.errors[name][0] :
        null;
    },
    hasError(name) {
      return this.getError(name) != null;
    },
    async saveData(data) {
      if (this.editingModel) {
        await apiFile.update(data)
        this.pagingData(this.pageNumber, this.pageSize)
      } else {
        await apiFile.add(data)
        this.pagingData(1, this.pageSize)
      }
      this.dialogVisible = false
    },
    async deleteData(data) {
      await apiFile.del(data);
    }
  }
};

</script>
