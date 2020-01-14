<template>
  <div class="app-container">
    <Form ref="form" :model="model" :rules="rules" style="padding:20px 20px" @validate="errors=$event">
      <FormField name="parent_id" label="上级分类:">
        <el-cascader v-model="model.parent_id" :options="treeData" clearable :props="{value:'id', label:'name', expandTrigger: 'hover'}"></el-cascader>
      </FormField>
      </FormField>
      <FormField name="name" label="分类名称:">
        <TextBox v-model="model.name" input-id="name" name="name" />
      </FormField>
      <FormField name="name" label="排序:">
        <NumberBox v-model="model.sort" name="sort" />
      </FormField>
      <FormField name="name" label="状态:">
        <ComboBox v-model="model.status" :data="status" />
      </FormField>
      <FormField name="image_id" label="图片:">
        <FileUpload :key="cmtResetHandle" :file="model.image" @input="emitFileUpload" />
      </FormField>
      <FormField name="code" label="调用代码:">
        <TextBox v-model="model.code" name="code" :readonly="model.code && model.id ? true :false" />
      </FormField>
      <FormField>
        <LinkButton style="margin-right: 20px" @click="verificationRow()">{{ $t('common.confirm') }}</LinkButton>
        <LinkButton @click="cancel()">{{ $t('common.goBack') }}</LinkButton>
      </FormField>
    </Form>
  </div>
</template>
<script>
import * as apiCategory from '@/api/cms/articleCategory'
import FileUpload from '@/components/Upload/FileUpload'

export default {
  components: { FileUpload },
  data() {
    return {
      test: "9",
      model: {},
      rules: {
        name: 'required'
      },
      errors: {},
      editingModel: null,
      status: [
        { value: '1', text: '显示' },
        { value: '2', text: '隐藏' }
      ],
      treeData: [],
      cmtResetHandle: 1
    }
  },
  created() {
    this.initModel()
    if (this.$route.query.id) {
      this.getTreeData(this.$route.query.id)
      this.viewData(this.$route.query.id)
    }else{
      this.getTreeData()
    }
  },
  watch: {
    "model": function() {
      ++this.cmtResetHandle
      // console.log(1111)
    }
  },
  methods: {
    initModel() {
      this.model = {
        name: null,
        sort: null,
        status: null,
        image_id: null,
        parent_id: null,
        type_id: null,
        code: null,
        image: {
          id: 0,
          file_url: ""
        }
      }
    },
    cancel() {
      this.$store.dispatch("tagsView/delView", this.$route).then(({ visitedViews }) => {
        this.$router.push({path:"/cms/category/index"})
      })
    },
    verificationRow() {
      this.$refs.form.validate(errors => {
        if (!errors) {
          this.saveData(this.model)
        }
      })
    },
    emitFileUpload(fileId) {
      console.log(fileId);
      this.model.image_id = fileId
    },
    async saveData(data) {
      if (this.editingModel) {
        await apiCategory.update(data)
        this.editingModel = null
      } else {
        await apiCategory.add(data)
      }
      this.$notify({
        type: 'success',
        title: '操作成功'
      })
      this.cancel();
    },
    async viewData(id = null) {
      let res = await apiCategory.view({ id: id })
      this.model = res.data
      this.editingModel = res.data
      this.model.parent_id = this.funs.treeDeepArr(this.model.parent_id,this.treeData)
    },
    async getTreeData(id = null) {
      const res = await apiCategory.getTree({ id: id })
      this.treeData = res.data
    }
  }
}

</script>
