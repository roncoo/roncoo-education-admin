<template>
  <div class="container">
    <div class="text">开源协议：MIT | 官网：
      <el-link
        type="primary"
        href="https://www.roncoo.net/"
        target="_blank"
        :underline="false">https://edu.roncoo.net/</el-link>
    </div>
    <div>
      <el-divider></el-divider>
      <div style="background: #f5f5f5;">
        <div>
          <el-alert
            title="商业版"
            type="info"
            :closable="false">
            <template slot>专业版、SaaS版、定制版，详情请看各版本适用场景介绍及包含的功能明细。</template>
            <li><el-link
                type="primary"
                href="http://edu.roncoo.com/"
                target="_blank"
                :underline="false">演示环境</el-link>
            </li>
            <li><el-link
                type="primary"
                href="https://edu.roncoo.net/business.html"
                target="_blank"
                :underline="false">官网介绍</el-link>
            </li>
          </el-alert>
        </div>
        <div>
          <el-alert
            title="开源版"
            type="info"
            :closable="false">
            <template slot>领课教育系统是基于领课网络多年的在线教育平台开发和运营经验打造出来的产品，致力于打造一个全行业都适用的分布式在线教育系统。</template>
            <li><el-link
              type="primary"
              href="http://edu.os.roncoo.com/"
              target="_blank"
              :underline="false">演示环境</el-link></li>
            <li><el-link
              type="primary"
              href="https://edu.roncoo.net/opensource.html"
              target="_blank"
              :underline="false">官网介绍</el-link></li>
          </el-alert>
        </div>
        <div>
          <el-alert
            title="项目推荐"
            type="info"
            :closable="false">
            <li><el-link
              type="primary"
              href="https://pay.roncoo.net/"
              target="_blank"
              :underline="false">龙果支付系统(roncoo-pay)</el-link></li>
          </el-alert>
        </div>
        <!--<el-row :gutter="24">
          <el-col :span="12">
            <el-card class="box-card">
              <div slot="header" class="clearfix">
                <span>商业版</span>
              </div>
              <div style="font-size: 15px;text-indent: 2em;padding: 0px;">专业版、SaaS版、定制版，详情请看各版本适用场景介绍及包含的功能明细。</div>
              <br/>
              <br/>
              <div class="text-right">
                <el-button style="float:right;margin-left:6px;" size="mini" type="primary" @click="jumpUrl('demo')">演示环境</el-button>
                <el-button style="float:right;" type="warning" size="mini" @click="jumpUrl('business')">官网介绍</el-button>
              </div>
              <br/>
            </el-card>
          </el-col>
          <el-col :span="12">
            <el-card class="box-card">
              <div slot="header" class="clearfix">
                <span>开源版</span>
              </div>
              <div style="font-size: 15px;text-indent: 2em;padding: 0px;">领课教育系统是基于领课网络多年的在线教育平台开发和运营经验打造出来的产品，致力于打造一个全行业都适用的分布式在线教育系统。</div>
              <br/>
              <div class="text-right">
                <el-button style="float:right;margin-left:6px;" size="mini" type="primary" @click="jumpUrl('fineUI')">演示环境</el-button>
                <el-button style="float:right;" type="warning" size="mini" @click="jumpUrl('opensource')">官网介绍</el-button>
              </div>
              <br/>
            </el-card>
          </el-col>
        </el-row>-->
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
  font-size: 20px;
  line-height: 46px;
}
</style>
