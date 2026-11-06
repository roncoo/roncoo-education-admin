<template>
  <el-card class="info">
    <template #header>
      <div class="card-heading">
        <span class="card-title">数据统计</span>
        <span class="card-caption">经营概览</span>
      </div>
    </template>
    <div class="metric-grid">
      <router-link class="metric-item" to="/common/order">
        <el-statistic title="今天订单数" :value="statData.todayOrder" />
      </router-link>
      <router-link class="metric-item" to="/common/order">
        <el-statistic title="今天收入" :precision="2" :value="statData.todayMoney" prefix="￥" />
      </router-link>
      <router-link class="metric-item" to="/common/order">
        <el-statistic title="昨天订单数" :value="statData.yesterdayOrder" />
      </router-link>
      <router-link class="metric-item" to="/common/order">
        <el-statistic title="昨天收入" :precision="2" :value="statData.yesterdayMoney" prefix="￥" />
      </router-link>
      <router-link class="metric-item" to="/users/list">
        <el-statistic title="总用户数" :value="statData.userSum" />
      </router-link>
      <router-link class="metric-item" to="/course/list">
        <el-statistic title="总课程数" :value="statData.courseSum" />
      </router-link>
      <router-link class="metric-item" to="/common/order">
        <el-statistic title="总订单数" :value="statData.orderSum" />
      </router-link>
      <router-link class="metric-item" to="/common/order">
        <el-statistic title="总收入" :precision="2" :value="statData.orderMoney" prefix="￥" />
      </router-link>
    </div>
  </el-card>
</template>

<script setup>
  import { onMounted, ref } from 'vue'
  import { statApi } from '@/api/dashboard.js'

  const statData = ref({})
  onMounted(() => {
    statApi.data().then((res) => {
      statData.value = res
    })
  })
</script>
<style lang="scss" scoped>
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
      padding: 20px 24px 24px;
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

    .metric-grid {
      display: grid;
      grid-template-columns: repeat(4, minmax(0, 1fr));
      gap: 16px;
    }

    .metric-item {
      min-width: 0;
      padding: 14px 16px;
      border: 1px solid transparent;
      border-radius: 8px;
      transition: background-color 0.2s, border-color 0.2s;

      &:hover {
        color: inherit;
        background: var(--admin-brand-soft);
        border-color: #d6e3fc;
      }

      :deep(.el-statistic__head) {
        margin-bottom: 10px;
        color: var(--admin-muted);
        font-size: 13px;
      }

      :deep(.el-statistic__content) {
        color: var(--admin-ink);
        font-size: 26px;
        font-weight: 650;
        line-height: 1.2;
      }
    }

    @media (max-width: 900px) {
      .metric-grid {
        grid-template-columns: repeat(2, minmax(0, 1fr));
      }
    }

    @media (max-width: 520px) {
      .metric-grid {
        grid-template-columns: 1fr;
      }
    }
  }
</style>
