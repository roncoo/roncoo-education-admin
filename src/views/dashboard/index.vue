<template>
  <div class="container">
    <div class="text">开源协议：MIT
    </div>
    <div>
      <el-divider></el-divider>
      <div style="background: #f5f5f5;">
        <div class="text">
          <el-alert
            title="项目介绍"
            type="info"
            :closable="false">
            <li>roncoo-education 是后台工程，核心框架：Spring Cloud</li>
            <li>roncoo-education-web 是前端门户工程，核心框架：Vuejs + Nuxt.js</li>
            <li>roncoo-education-admin 是后台管理工程，核心框架：vue-element-admin</li>
          </el-alert>
        </div>
      </div>
      <div style="background: #f5f5f5; margin-top: 20px;">
        <div class="text">
          <el-alert
            title="领课教育系统官网"
            type="info"
            :closable="false">
            详情请看：<el-link
                    type="primary"
                    href="https://edu.roncoo.net/?sources=os-admin"
                    target="_blank"
                    :underline="false">https://edu.roncoo.net/</el-link>
          </el-alert>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { mapGetters } from 'vuex'
export default {
  name: 'Dashboard',
  methods: {
  },
  computed: {
    ...mapGetters([
      'name'
    ])
  }
}
</script>
<style scoped>
.container {
  margin: 30px;
}
.template {
  background-color: #EBEEF5
}
.bg-purple {
  background: #d3dce6;
}
.bg-purple-light {
    background: #e5e9f2;
  }
.grid-content {
  border-radius: 4px;
  min-height: 36px;
}
.text {
  font-size: 25px;
  line-height: 46px;
}
</style>
