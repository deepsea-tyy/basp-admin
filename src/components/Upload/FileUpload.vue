<template>
  <div class="fileUpload">
    <div v-if="showFile.file_url" class="file-preview">
      <div v-if="getPreviewType=='shortcut'" style="float: left;padding: 20px;border: 1px solid #E5E5E5" @click="showDialog=true">
        <img class="image" :src="getBase64()" height="100px" /><br>
        <span class="title">{{this.showFile.name}}</span>
      </div>
      <div v-if="getPreviewType=='normal'" style="float: left;padding: 20px;border: 1px solid #E5E5E5">
        <img class="image" :src="showFile.file_url" height="100px" />
      </div>
      <br>
      <i class="el-icon-delete" @click="rmFile" style="font-size: 24px;" />
      <!-- <a :href="showFile.file_url" target="_blank"><i class="el-icon-document" />{{showFile.file_url}}</a> -->
      <el-dialog :visible.sync="showDialog">
        <img style="width:100%;" :src="getBase64()">
      </el-dialog>
    </div>
    <el-upload v-if="!showFile.file_url" :data="files" :multiple="false" :show-file-list="false" :on-success="handleFileSuccess" class="file-uploader" :action="uploadUrl" :headers="headers" :accept="uploadAccept">
      <div class="el-upload__text">
        <el-button slot="trigger" size="small" type="primary"><i class="el-icon-upload" />点击上传文件</el-button>
      </div>
    </el-upload>
  </div>
</template>
<script>
import { getToken } from '@/utils/auth'
import { del } from '@/api/base/file'
/*单文件上传组件*/
export default {
  name: 'FileUpload',
  props: {
    file: {
      type: Object,
      default: function() {
        return { id: 0, file_url: "" }
      }
    },
    accept: {
      type: String,
      default: ""
    },
    // normal shortcut
    previewType:{
      type: String,
      default: "normal"
    },
    otherUploadUrl: {
      type: String,
      default: ""
    }
  },
  created() {
    this.uploadUrl = this.otherUploadUrl ? this.otherUploadUrl : this.$store.getters.uploadUrl
    this.showFile = this.file;
  },
  data() {
    return {
      files: {},
      headers: { 'X-Token': getToken() },
      uploadUrl: "",
      showFile: {},
      showDialog:false
    }
  },
  computed: {
    uploadAccept() {
      if (!this.accept) {
        return "*"
      }
      return this.accept
    },
    getPreviewType(){
      return this.previewType
    }
  },
  methods: {
    getBase64() {
      let imageExt = ['jpg','jpeg','png'];
      if (imageExt.includes(this.showFile.ext)) {
        return this.showFile.file_url
      }
      if (!this.$store.getters.filePreviewExt.includes(this.showFile.ext)) {
        // console.log(this.showFile.ext)
        return this.$store.getters.filePreviewImage("./unknown.png")
      }
      return this.$store.getters.filePreviewImage("./" + this.showFile.ext + ".png")
    },
    rmFile() {
      this.showFile.id = ""
      this.showFile.file_url = ""
      this.emitInput("")
    },
    emitInput(fid) {
      this.$emit("input", fid)
    },
    handleFileSuccess(response, file) {
      if (response.status == 400) {
        this.$message.error(response.message);
      }else{
        let showFile = Object.assign({}, response.data)
        this.emitInput(showFile.id)
        if (!this.$store.getters.filePreviewExt.includes(showFile.ext)) {
          showFile.file_url = this.$store.getters.filePreviewImage("./unknown.png")
        }
        this.showFile = showFile
      }
    },
    beforeUpload() {
      return new Promise((resolve, reject) => {
        // resolve(true)
        // resolve(false)

      })
    },
    async delData(data, index) {
      let res = await del(data);
      this.imageList.splice(index, 1)
    }
  }
}

</script>
<style type="text/css">
.file-preview {
  text-align: center;
}

</style>
