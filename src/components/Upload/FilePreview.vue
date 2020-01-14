<template>
  <div class="container" :style="container_style" ref="container">
    <div class="image-container">
      <img class="image" :src="getBase64"/>
    </div>
    <div class="title-container">
      <span class="title">{{this.file.name}}</span>
    </div>
  </div>
</template>

<script>
/*文件预览组件*/
export default {
  name: 'FilePreview',
  css: {
    extract: true
  },
  props: {
    file: {},
    height: String,
    background_color: {type: String , default: "white"}
  },
  computed: {
    container_style () {
      // console.log(this.file)
      return 'width: ' + this.height + 'px;height: '+this.height+'px;' + "background-color:"+this.background_color;
    },
    getBase64 () {
      let imageExt = ['jpg','jpeg','png'];
      if (imageExt.includes(this.file.ext)) {
        return this.file.file_url
      }
      if (!this.$store.getters.filePreviewExt.includes(this.file.ext)) {
        // console.log(this.file.ext)
        return this.$store.getters.filePreviewImage("./unknown.png")
      }
      return this.$store.getters.filePreviewImage('./' + ext + ".png")
    }
  }
}
</script>

<style lang="scss" scoped>
@import '../../assets/file_preview_images/filepreview.css';
</style>
