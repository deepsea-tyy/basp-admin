<template>
  <div class="app-container">
    <div style="margin-bottom: 15px;">
      <el-input placeholder="请输入内容" v-model="new_route" class="input-with-select">
        <el-button @click="newRoute()" slot="append" icon="el-icon-plus"></el-button>
      </el-input>
    </div>
    <el-row :gutter="20">
      <el-col :span="8">
        <input class="search el-input__inner" @change="searched('available')" data-target="available" placeholder="Search for available">
        <select class="list" style="width: 100%;border: 1px solid #DCDFE6;" v-model="savailable" multiple size="20" data-target="available">
        </select>
      </el-col>
      <el-col :span="4">
          <br>
          <br>
          <br>
          <el-button type="success" size="small" @click="assign()">
            <a :title="$t('common.view')">
              <i class="el-icon-d-arrow-right" />
            </a>
          </el-button>
          <br>
          <br>
          <br>
          <el-button type="danger" size="small" @click="remove()">
            <a :title="$t('common.view')">
              <i class="el-icon-d-arrow-left" />
            </a>
          </el-button>
      </el-col>
      <el-col :span="8">
        <input class="search el-input__inner" @change="searched('assigned')" data-target="assigned" placeholder="Search for assigned">
        <select class="list" style="width: 100%;border: 1px solid #DCDFE6;" v-model="sassign" multiple size="20" data-target="assigned">
        </select>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { getRoutes,assign,remove,addRoute } from '@/api/rbac/route'
import $ from 'jquery'

export default {
  name: 'RoleView',
  data(){
    return {
      available:[],
      assigned:[],
      savailable:[],
      sassign:[],
      _opts:[],
      new_route:''
    }
  },
  created() {
    this.viewRoute()
  },
  methods: {
    async viewRoute() {
      const res = await getRoutes()
      this.available = res.data.available
      this.assigned = res.data.assigned
      this._opts = res.data
      this.initRoute()
    },
    async assign(){
      const res = await assign({routes:this.savailable});
      this.available = res.data.available
      this.assigned = res.data.assigned
      this._opts = res.data
      this.initRoute()
    },
    async remove(){
      const res = await remove({routes:this.sassign});
      this.available = res.data.available
      this.assigned = res.data.assigned
      this._opts = res.data
      this.initRoute()
    },
    searched(target) {
      search(target,this._opts);
    },
    async newRoute() {
      if (this.new_route != "") {
        const res = await addRoute({route:this.new_route})
        this.new_route = ""
        this._opts = res.data
        this.initRoute()
      }
    },
    initRoute(){
      search('available',this._opts)
      search('assigned',this._opts)
    }
  }
}

function search(target,$_opts) {
    var $list = $('select.list[data-target="' + target + '"]');
    $list.html('');
    var q = $('.search[data-target="' + target + '"]').val();

    $.each($_opts[target], function (i, v) {
      if (v.indexOf(q) >= 0) {
          $('<option>').text(v).val(v).appendTo($list);
      }
    });
}
</script>
