<template>
  <div class="app-container">
    <!-- f-inline-row -->
    <Form ref="form" :model="model" :rules="rules" style="padding:20px 20px" @validate="errors=$event">
      <FormField name="title" label="文章标题:" class="f-full">
        <TextBox v-model="model.title" input-id="name" name="title" />
      </FormField>
      <FormField name="reprint_info" label="转载说明:">
        <TextBox v-model="model.reprint_info" />
      </FormField>
      <FormField name="cat_id" label="文章分类:">
        <el-cascader v-model="model.cat_id" :options="treeData" clearable :props="{value:'id', label:'name', expandTrigger: 'hover'}"></el-cascader>
      </FormField>
      <FormField name="is_recommend" label="推荐:" class="f-inline-row">
        <ComboBox v-model="model.is_recommend" :data="status" />
      </FormField>
      <FormField name="is_comment" label="允许评论:" class="f-inline-row">
        <ComboBox v-model="model.is_comment" :data="status" />
      </FormField>
      <FormField name="is_top" label="置顶:" class="f-inline-row">
        <ComboBox v-model="model.is_top" :data="status" />
      </FormField>
      <FormField name="release_at" label="发布时间:" class="f-inline-row">
        <el-date-picker v-model="model.release_at" type="datetime" value-format="timestamp" placeholder="选择日期时间">
        </el-date-picker>
      </FormField>
      <FormField name="keywords" label="关键词:" class="f-inline-row">
        <TextBox v-model="model.keywords" input-id="keywords" :multiline="true" name="keywords" placeholder="多个请换行" style="height:80px" />
      </FormField>
      <FormField name="image_id" label="文章封面:" class="f-full">
        <FileUpload :key="cmtResetHandle" :file="model.imageItem" @input="emitImageUpload" />
      </FormField>
      <FormField name="brief" label="文章摘要:" class="f-full">
        <TextBox v-model="model.brief" input-id="brief" :multiline="true" name="brief" style="height:120px" />
      </FormField>
      <FormField name="content" label="文章详情:" class="f-full">
        <Tinymce ref="editor" v-model="model.content" :height="400" :width="'100%'" />
      </FormField>
      <FormField>
        <LinkButton style="margin-right: 20px" @click="verificationRow()">{{ $t("common.save") }}</LinkButton>
        <LinkButton @click="cancel()">{{ $t("common.goBack") }}</LinkButton>
      </FormField>
    </Form>
  </div>
</template>
<script>
import * as apiArticle from "@/api/cms/article"
import * as apiCategory from "@/api/cms/articleCategory"
import Tinymce from "@/components/Tinymce"
import FileUpload from "@/components/Upload/FileUpload"

export default {
  components: { Tinymce, FileUpload },
  data() {
    return {
      model: {},
      status: [{
        value: 1,
        text: "是"
      }, {
        value: 2,
        text: "否"
      }],
      rules: {
        title: "required",
      },
      errors: {},
      loading: false,
      treeData: [],
      cmtResetHandle: 1
    };
  },
  created() {
    this.initModel()
    if (this.$route.query.id) {
      this.viewData(this.$route.query.id)
    }
    this.getTreeData()
  },
  watch: {
    "model": function() {
      ++this.cmtResetHandle
    }
  },
  methods: {
    initModel() {
      this.model = {
        cat_id: [],
        title: null,
        brief: null,
        image_id: null,
        content: null,
        keywords: null,
        is_recommend: null,
        is_comment: null,
        is_top: null,
        release_at: null,
        editModel: null,
        imageItem: {
          id: 0,
          file_url: ""
        }
      }
    },
    cancel() {
      this.$store.dispatch("tagsView/delView", this.$route).then(({ visitedViews }) => {
        this.$router.push({ path: "/cms/article/index" })
      })
    },
    emitImageUpload(fileId) {
      this.model.image_id = fileId
    },
    verificationRow() {
      this.$refs.form.validate(errors => {
        if (!errors) {
          this.saveData(this.model);
        }
      })
    },
    async viewData(id) {
      let res = await apiArticle.view({ id: id });
      this.model = Object.assign({}, res.data)
        console.log(this.model);//return;
      this.editModel = res.data
      this.model.parent_id = this.funs.treeDeepArr(this.model.parent_id,this.treeData)
    },
    async saveData(data) {
      data.cat_id = data.cat_id[data.cat_id.length - 1]
      if (this.editModel) {
        await apiArticle.update(data);
      } else {
        await apiArticle.add(data);
      }

      this.$notify({
        type: "success",
        title: "操作成功"
      });
      this.cancel()
    },
    async getTreeData(id = null) {
      const res = await apiCategory.getTree({ id: id })
      this.treeData = res.data
    }
  }
};

</script>
