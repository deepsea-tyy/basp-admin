<template>
  <div class="image-container">
    <div v-show="imageList.length>0" class="image-preview">
      <draggable :list="imageList" :disabled="!enabled" class="list-group" ghost-class="ghost" :move="checkMove">
        <div v-for="(item,index) in imageList" :key="index" style="float: left;padding: 20px;border: 1px solid #E5E5E5;margin-left: 2px;">
          <img :src="item.file_url" height="100px" @click="showImage(item.file_url)">
          <div class="image-preview-action">
            <i class="el-icon-delete rm-image" @click="rmImage(index)" />
          </div>
        </div>
      </draggable>
      <el-dialog :visible.sync="showDialog">
        <img v-if="showDialogImage != null" style="width:100%;" :src="showDialogImage">
      </el-dialog>
    </div>
    <div class="upload-div">
      <div style="margin-bottom: 15px;">
        <el-button slot="trigger" size="small" type="primary" @click="onlineImage=true"><i class="el-icon-picture" />选择在线图片</el-button>
      </div>
      <div>
        <el-upload class="image-uploader" :action="uploadUrl" :headers="headers" :on-preview="handlePreview" :file-list="fileList" :show-file-list="false" :auto-upload="true" :multiple="true" :limit="imageNums" :data="extParams" :on-success="handleImageSuccess" accept="image/*" :before-upload="handleBeforeUpload" :on-exceed="exceed">
          <div class="el-upload__text">
            <el-button slot="trigger" size="small" type="primary"><i class="el-icon-upload" />点击上传图片</el-button>
          </div>
        </el-upload>
      </div>
    </div>
    <div style="clear: both;">{{$t('common.file.imageListTip',[imageNums])}}</div>
    <el-drawer title="在线图片" :visible.sync="onlineImage" direction="btt" size="45%" :modal="true">
      <div class="onlineImage">
        <ul>
          <li v-for="(item,index) in tableList">
            <div @click="selectImage(item.id,item.file_url)">
              <img :src="item.file_url" />
            </div>
          </li>
        </ul>
        <Pagination :total="total" :pageSize="pageSize" :pageNumber="pageNumber" :layout="['first','prev','links','next','last']" @pageChange="onPageChange($event)"></Pagination>
      </div>
    </el-drawer>
  </div>
</template>
<script>
  import { getToken } from '@/utils/auth'
  import {getList} from '@/api/base/file'
  import draggable from 'vuedraggable'
/*表单图片上传组件*/
export default {
  name: 'ImageListUpload',
  components: { draggable },
  props: {
    value: Array,
    nums: {
      type: Number,
      default: 5
    }
  },
  computed: {
    imageList(){
      return this.value
    },
    imageNums(){
      return this.nums
    }
  },
  created() {
    // this.headers = {'X-Token': getToken()} 
  },
  data() {
    return {
      fileList:[],
      extParams: {},
      uploadUrl: process.env.VUE_APP_BASE_API + '/base/file/fileupload',
      enabled: true,
      headers: {'X-Token': getToken()},
      showDialog:false,
      showDialogImage:null,
      onlineImage:false,
      total:null,
      pageNumber: 1,
      pageSize: 20,
      tableList: []
    } 
  },
  created() {
    this.pagingData(this.pageNumber, this.pageSize);
  },
  methods: {
    showImage(url){
      this.showDialog = true
      this.showDialogImage = url
    },
    selectImage(id,file_url){
      if (this.imageList.length>=this.imageNums) {
        this.$message({type: 'info',message: this.$t('common.file.nums',[this.imageNums])})
        return false
      }
      this.imageList.push({id:id, file_url:file_url})
      this.emitInput()
    },
    onPageChange(event) {
      this.pagingData(event.pageNumber, event.pageSize);
    },
    checkMove: function(e) {
      // 排序
      // window.console.log("Future index: " + e.draggedContext.futureIndex);
    },
    rmImage(index) {
      this.imageList.splice(index, 1)
      // console.log('rmImage',this.imageList)
      this.emitInput()
    },
    emitInput() {
      this.$emit('input', this.imageList)
    },
    handleImageSuccess(response, file) {
      // console.log('handleImageSuccess')
      this.imageList.push({id:response.data.id, file_url:response.data.file_url})
      this.emitInput()
    },
    handlePreview(event, file, fileList) {

    },
    handleBeforeUpload(file) {
      // console.log('handleBeforeUpload',this.imageList.length);
      if (this.imageList.length>=this.imageNums) {
        this.$message({type: 'info',message: this.$t('common.file.nums',[this.imageNums])})
        return false
      }
      return true
    },
    exceed(files, fileList) {
      this.$message({type: 'info',message: this.$t('common.file.nums',[this.imageNums])})
      return true
    },
    async pagingData(pageNumber, pageSize) {
      this.loading = true;
      let result = await getList({ page: pageNumber, pageSize: pageSize });
      this.total = result.data.totalCount;
      this.tableList = result.data.list;
      this.loading = false;
    }
  }
}
</script>
<style type="text/css">
.image-preview {
  float: left;
}

.upload-div {
  float: left;
  margin: auto;
  margin-left: 10px;
}

.image-preview-action {
  text-align: center;
}

.rm-image {
  font-size: 24px;
}

.onlineImage ul,li {
  margin: 0 auto;
  overflow: hidden;
  list-style: none;
  width: 100%;
}

.onlineImage li {
  float: left;
  width: 10%;
}
.onlineImage li div{
  /*border:1px solid red;*/
  padding: 2px;
  margin-left: 2px;
  margin-bottom: 2px;
}

.onlineImage img {
  display: block;
  width: 100%;
  height: 90px
}

</style>
