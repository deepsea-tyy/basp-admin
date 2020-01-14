<template>
  <div>
    <el-progress v-if="percentage" :percentage="percentage" :status="pStatus"></el-progress>
    <el-upload class="fiel-upload" ref="fileUpload" :action="uploadUrl" :headers="headers" :show-file-list="false" :auto-upload="false" :multiple="true" :on-change="handleChange" :on-success="handleSuccess" :on-error="handleError" :on-progress="handleProgress" :before-upload="handleBeforeUpload" :data="extParams">
      <el-button slot="trigger" size="small" type="primary">选取文件</el-button>
      <el-button style="margin-left: 10px;" size="small" type="success" @click="handleSubmit">上传到服务器</el-button>
      <!-- <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div> -->
    </el-upload>
    <div class="img-list">
      <div class="img-content" v-for="(item,key) in fileList" :key="key">
        <img :src="item.file_url">
        <div class="name">
          <TextBox v-model="item.name" placeholder="文件名称" style="width: 100%" />
        </div>
        <div class="del">
          <span ><i v-if="item.pStatus" class="el-icon-circle-check"></i></span>
          <i @click="handleDelete(item,key)" class="el-icon-delete"></i>
        </div>
        <div class="layer" @click="handleDetail(item)">
          <i class="el-icon-view"></i>
        </div>
      </div>
    </div>
    <el-dialog title="" :visible.sync="shwoStatus" :modal-append-to-body="false" top="8%" width="60%">
      <div style="width: 100%;text-align: center;">
        <img @click="shwoStatus = false" :src="showFile.file_url" :width="showFile.showWidth" />
      </div>
    </el-dialog>
  </div>
</template>
<script>
  import { getToken } from '@/utils/auth'
  import {destoryfile} from '@/api/base/file'
/*文件管理组件*/
export default {
  name: "FileManage",
  data() {
    return {
      pStatus: null,
      percentage: 0,
      fileList: [],
      showFile:{},
      shwoStatus: false,
      headers: { 'X-Token': getToken() },
      extParams:{
        name:"",
        fileid: 0
      }
    }
  },
  created() {
    this.uploadUrl = this.$store.getters.uploadUrl

  },
  methods: {
    initProgress(){
      this.pStatus = null
      this.percentage = 0
    },
    handleProgress(event, file, fileList){
      //开始上传
      // console.log('handleProgress',file)
      this.percentage = Math.floor(event.percent)
    },
    handleChange(file, fileList){
      if(file && file.status == 'ready'){
          // console.log("ready")
          this.initProgress()
          this.fileList.push(this.previewFile(file))
      }else if(file && file.status == 'fail'){
          this.$message.error("图片上传出错，请刷新重试！")
      }
    },
    handleBeforeUpload(file){
      this.fileList.forEach((item)=>{
        if (item.uid == file.uid) {
          this.extParams.name = item.name
          this.extParams.fileId = file.uid.toString()
        }
        return item
      })
    },
    handleSuccess(response, file, fileList){
      //上传文件
      if (file) {
        this.pStatus = file.status
      }

      this.fileList = this.fileList.map((item)=>{
        if (item.uid.toString() == response.data.fileId) {
          item.pStatus = "success"
          item.id = response.data.id
        }
        return item
      })
    },
    handleError(e,file){
        console.log("handleError")
    },
    previewFile(file) {
      var images = require.context('../../assets/file_preview_images/', false, /\.png$/)
      let fileType = file.raw.type.substring(0,file.raw.type.substr(1).indexOf('/')+1)
      let fileExt = file.raw.type.substring(file.raw.type.substr(1).indexOf('/')+2)

      if (fileType == 'image') {
        file.showWidth = "100%"
        file.file_url = URL.createObjectURL(file.raw)
        return file
      }
      file.showWidth = "100px"
      file.file_url = images('./' + fileExt + ".png")
      return file
    },
    handleDetail(file) {
      //文件浏览
      this.showFile = file;
      this.shwoStatus = !this.shwoStatus;
    },
    handleDelete(file,i){
      if(!file.id){
        this.fileList.splice(i, 1)
      }else{
        this.$confirm('是否删除此附件？','提示',{
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
        }).then(() => {
            this.deleteData({id:file.id},i)
        }).catch((meg) => console.log(meg))
      }
    },
    handleSubmit() {
      this.$refs.fileUpload.submit();
    },
    async deleteData(data, index) {
      await destoryfile(data);
      this.$message.success("删除成功")
      this.fileList.splice(index, 1)
    }
  }
}

</script>
<style type="text/css">
* {
  box-sizing: border-box;
}

.img-list {
  overflow: hidden;
  width: 100%;
}

.img-list .img-content {
  float: left;
  position: relative;
  display: inline-block;
  width: 22%;
  padding: 5px;
  margin: 5px 20px 20px 0;
  border: 1px solid #d1dbe5;
  border-radius: 4px;
  transition: all .3s;
  box-shadow: 0 2px 4px 0 rgba(0, 0, 0, .12), 0 0 6px 0 rgba(0, 0, 0, .04);
}

.img-list .img-content img {
  display: block;
  width: 100%;
  height: 190px;
  margin: 0 auto;
  border-radius: 4px;
}

.img-list .img-content .name {
  margin-top: 10px;
}

.img-list .img-content .name>div {
  width: 90%;
  text-overflow: ellipsis;
  overflow: hidden;
  height: 25px;
  line-height: 25px;
}

.img-list .img-content:hover .del,
.img-list .img-content:hover .layer {
  opacity: 1;
}

.img-list .img-content .del,
.img-list .img-content .layer {
  opacity: 0;
  transition: all .3s;
}

.img-list .img-content .del {
  position: absolute;
  bottom: 10px;
  right: 10px;
  color: #8492a6;
  cursor: pointer;
  font-size: 1.1em;
}

.img-list .img-content .layer {
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  height: 200px;
  color: #fff;
  text-align: center;
  z-index: 5;
  background-color: rgba(0, 0, 0, .4);
}

.img-list .img-content .layer i {
  font-size: 1.6em;
  margin-top: 80px;
}

.img-list .img-upload {
  float: left;
  width: 200px;
  height: 270px;
  display: table;
  text-align: center;
}

.img-list .uploader {
  width: 100%;
  display: table-cell;
  vertical-align: middle;
}

.img-list .img-progress {
  text-align: center;
  padding-top: 50px;
}

</style>
