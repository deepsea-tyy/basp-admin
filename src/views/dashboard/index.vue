<template>
  <div class="dashboard-container">
    <!-- <component :is="currentRole" /> -->
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <h3>欢迎使用 BRICKSASP 框架</h3>
      </div>
      <div class="text item">
        <el-row :gutter="20">
          <el-col :span="24"><a href="https://github.com/deepsea-tyy/bricksasp" target="_black">项目开源地址: https://github.com/deepsea-tyy/bricksasp</a></el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="24">作者：tyy</el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="24">联系：649909457@qq.om</el-col>
        </el-row>
      </div>
    </el-card>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import adminDashboard from './admin'
import editorDashboard from './editor'

export default {
  name: 'Dashboard',
  components: { adminDashboard, editorDashboard },
  data() {
    return {
      currentRole: 'adminDashboard'
    }
  },
  computed: {
    ...mapGetters([
      'roles'
    ])
  },
  created() {
    if (!this.roles.includes('admin') && !this.roles.includes('administrator')) {
      this.currentRole = 'editorDashboard'
    }
  }
}
</script>

<style>
.text {
  font-size: 14px;
}

.item {
  margin-bottom: 18px;
}

.clearfix:before,
.clearfix:after {
  display: table;
  content: "";
}

.clearfix:after {
  clear: both
}

.box-card {
  width: 100%;
}

</style>

