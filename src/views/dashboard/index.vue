<template>
  <div class="container">
    <div class="text">开源协议：MIT
    </div>
    <div>
      <el-divider></el-divider>
      <div style="background: #f5f5f5;">
        <div class="text">
          <el-alert
            title="商业版介绍"
            type="info"
            :closable="false">
            <el-link
                    type="primary"
                    href="https://edu.roncoo.net/?sources=os"
                    target="_blank"
                    :underline="false">https://edu.roncoo.net/</el-link>
            <li>专 业 版：拥有完善的在线教学功能，适合教育机构或企业运营自主品牌的在线教育平台使用。</li>
            <li>SaaS版：也称多机构版，一套系统即可管理和维护多个独立域名、独立品牌的在线教育平台。</li>
            <li>定  制  版：在领课教育系统的基础上按企业需求进行定制化开发。</li>
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
