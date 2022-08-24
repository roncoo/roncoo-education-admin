<template>
  <div class="container">
    <div class="text">领课教育系统
    </div>
    <div>
      <div style="background: #f5f5f5; margin-top: 20px;">
        <div class="text">
          <el-alert
            title="官网地址"
            type="info"
            :closable="false">
            详情请看：
            <el-link
              type="primary"
              href="https://www.roncoo.net/?sources=os-admin"
              target="_blank"
              :underline="false">https://www.roncoo.net/
            </el-link>
          </el-alert>
        </div>
        <div class="text">
          <el-alert
            title="项目介绍"
            type="info"
            :closable="false">
            <li>
              <el-link
                type="primary"
                href="https://gitee.com/roncoocom/roncoo-education"
                target="_blank"
                :underline="false">roncoo-education
              </el-link>
              是后台工程，核心框架：Spring Cloud
            </li>
            <li>
              <el-link
                type="primary"
                href="https://gitee.com/roncoocom/roncoo-education-web"
                target="_blank"
                :underline="false">roncoo-education-web
              </el-link>
              是前端门户工程，核心框架：Vuejs + Nuxt.js
            </li>
            <li>
              <el-link
                type="primary"
                href="https://gitee.com/roncoocom/roncoo-education-admin"
                target="_blank"
                :underline="false">roncoo-education-admin
              </el-link>
              是运营管理工程，核心框架：vue-element-admin
            </li>
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
  methods: {},
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
