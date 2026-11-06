<template>
  <div class="dashboard-container">
    <el-row :gutter="20" class="dashboard-top">
      <el-col v-if="hasPermission('stat:data')" :span="12" :xs="24" :sm="24" :lg="12">
        <stat-data />
      </el-col>
      <el-col :span="12" :xs="24" :sm="24" :lg="12">
        <el-card class="info">
          <template #header>
            <div class="card-heading">
              <span class="card-title">特别说明</span>
              <span class="card-caption">系统使用提示</span>
            </div>
          </template>
          <div class="info-body">
            <div class="info-content">
              <p><span class="info-index">01</span>演示环境仅有查看功能，更多体验需本地部署</p>
              <p><span class="info-index">02</span>我们有功能更丰富的商业版本，并支持定制</p>
              <p><span class="info-index">03</span>商业版本请联系作者：18302045627（微信同号）</p>
              <p><span class="info-index">04</span>关注公众号，获取更多资料：SQL脚本、教程</p>
            </div>
            <img class="info-image" src="@/assets/images/weixin.jpg" alt="作者微信公众号" />
          </div>
        </el-card>
      </el-col>
    </el-row>

    <div v-if="hasPermission('stat:login')">
      <stat-login />
    </div>
    <div v-if="hasPermission('stat:vod')">
      <stat-vod />
    </div>
  </div>
</template>
<script setup>
  import StatVod from './StatVod.vue'
  import StatLogin from './StatLogin.vue'
  import StatData from './StatData.vue'
  import { hasPermission } from '@/utils/permission.js'
</script>
<style lang="scss" scoped>
  .dashboard-container {
    min-width: 0;
  }

  .dashboard-top {
    margin-bottom: 20px;
  }

  .info {
    height: 100%;
    border: 1px solid var(--admin-line);
    border-radius: 10px;
    box-shadow: var(--admin-shadow);

    :deep(.el-card__header) {
      padding: 20px 24px 16px;
      border-bottom-color: var(--admin-line);
    }

    :deep(.el-card__body) {
      padding: 22px 24px;
    }

    .card-heading {
      display: flex;
      align-items: baseline;
      justify-content: space-between;
      gap: 16px;
    }

    .card-title {
      color: var(--admin-ink);
      font-size: 18px;
      font-weight: 650;
    }

    .card-caption {
      color: var(--admin-muted);
      font-size: 12px;
    }

    .info-body {
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 24px;
    }

    .info-content {
      flex: 1;
      min-width: 0;

      p {
        display: flex;
        align-items: flex-start;
        gap: 12px;
        margin: 0;
        color: #334155;
        font-size: 14px;
        line-height: 30px;
      }

      .info-index {
        flex: 0 0 auto;
        color: var(--admin-brand);
        font-size: 12px;
        font-weight: 700;
      }
    }

    .info-image {
      flex: 0 0 auto;
      width: 120px;
      height: 120px;
      object-fit: cover;
      border: 1px solid var(--admin-line);
      border-radius: 6px;
    }
  }

  @media (max-width: 700px) {
    .info .info-body {
      align-items: flex-start;
      flex-direction: column;
    }

    .info .info-image {
      width: 96px;
      height: 96px;
    }
  }
</style>
