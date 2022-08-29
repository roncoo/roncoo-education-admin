<template>
  <el-scrollbar>
  <section  v-loading="appLoading" class="app-main">
    <router-view v-slot="{ Component, route }">
      <keep-alive :include="cachedViews">
        <component
          :is="Component"
          :key="route.meta.usePathKey ? route.path : undefined"
        />
      </keep-alive>
    </router-view>
  </section>
  </el-scrollbar>
</template>

<script>
import { mapGetters } from "vuex";
export default {
  name: "AppMain",
  computed: {
    ...mapGetters(["appLoading"]),
    cachedViews() {
      return this.$store.state.tags.cachedViews;
    },
    key() {
      return this.$route.path;
    },
  },
  created() {},
};
</script>

<style scoped>
.app-main {
  /*50 = navbar  */
  /* min-height: calc(100vh - 85px); */
  position: relative;
  margin: 0 16px 16px;
  border-top: 78px solid #f3f6fb;
  overflow-y: auto;
  overflow-x: hidden;
  box-sizing: border-box;
  background: #fff;
}
.fixed-header + .app-main {
}
</style>

<style lang="scss">
// fix css style bug in open el-dialog
.el-popup-parent--hidden {
  .fixed-header {
    padding-right: 15px;
  }
}
</style>
