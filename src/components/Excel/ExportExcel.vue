<template>
  <div>
    <el-checkbox :indeterminate="isIndeterminate" v-model="checkAll" @change="handleCheckAllChange">{{$t("common.selectAll")}}</el-checkbox>
    <div style="margin: 15px 0;"></div>
    <el-checkbox-group 
      v-model="checkFields">
      <el-checkbox v-for="field in fields" :label="field.name" @change="onChange">{{field.label}}</el-checkbox>
    </el-checkbox-group>
    <div style="margin: 15px 0;"></div>
    
    <el-button type="success" :disabled="disbutton" plain round @click="excelExport">{{$t("common.confirm")}}</el-button>
  </div>
</template>

<script>
import * as apiFile from "@/api/base/file"
import request from '@/utils/request'

export default {
  name: "ExportExcel",
  props: {
    sourceModel: { //order.order 模块.模型
      type: String,
      default() {
        return ""
      }
    },
    queryParam: {
      type: Object,
      default() {
        return {}
      }
    },
  },
  data() {
    return {
      fields: [{name:"", label:""}],
      checkFields: [],
      isIndeterminate: true,
      checkAll: true,
      disbutton: false,
    }
  },
  created() {
    this.getField();
  },
  methods: {
    handleCheckAllChange(val) {
      if (val) {
        this.fields.forEach(item => {
          this.checkFields.push(item.name)
        })
      }else{
        this.checkFields = [];
      }
      this.isIndeterminate = false;
    },
    onChange(val) {
      // console.log(this.checkFields)
    },
    excelExport() {
      this.disbutton = true;
      this.getExcel();
    },
    async getField() {
      let res = await apiFile.excelField({sourceModel:this.sourceModel})
      this.fields = res.data
      this.fields.forEach(item => {
        this.checkFields.push(item.name)
      })
    },
    async getExcel() {
      let params = this.queryParam
      params.sourceModel = this.sourceModel
      params.fields = this.checkFields
      let res = await apiFile.excelExport(params)
      this.$notify({
        type: 'success',
        message: this.$t("common.success"),
      });
      this.disbutton = false;
      const a = document.createElement('a')
      a.href = res.data
      a.target = "_blank"
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
    }
  }
}
</script>
