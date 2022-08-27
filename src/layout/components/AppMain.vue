<template>
  <section v-loading="appLoading" class="app-main">
    <transition name="fade-transform" mode="out-in">
      <router-view :key="key" />
    </transition>
  </section>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
  name: 'AppMain',
  computed: {
    ...mapGetters([
      'appLoading'
    ]),
    key() {
      return this.$route.path
    }
  }
}
</script>

<style scoped>
.app-main {
  /*50 = navbar  */
  min-height: calc(100vh - 85px);
  width: 100%;
  padding: 20px;
  position: relative;
  /*导致上传页面无法出现滚动*/
  /*overflow: hidden;*/
}
.fixed-header+.app-main {
  padding-top: 105px;
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
