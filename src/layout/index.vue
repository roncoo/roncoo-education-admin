<template>
  <div :class="classObj" class="app-wrapper">
    <div v-if="device==='mobile'&&sidebar.opened" class="drawer-bg" @click="handleClickOutside" />
    <sidebar class="sidebar-container" />
    <div class="main-container" :class="{'fixed-main-container':fixedHeader}">
      <div :class="{'fixed-header':fixedHeader}">
        <div class="logo">
          <img v-if="orgLogoImg" :src="orgLogoImg" alt="">
          <img src="../assets/logo.svg" style="width: 80%;" alt="">
        </div>
        <navbar />
        <tags-view />
      </div>
      <app-main />
    </div>
    <!-- <reset-password :visible="resetPassword" @close-callback="closeCallback" /> -->
  </div>
</template>

<script>
import { Navbar, Sidebar, AppMain, TagsView } from './components/index.js'
import ResizeMixin from './mixin/ResizeHandler'
import { mapGetters } from 'vuex'

export default {
  name: 'Layout',
  data() {
    return {}
  },
  components: {
    // ResetPassword,
    Navbar,
    Sidebar,
    TagsView,
    AppMain
  },
  mixins: [ResizeMixin],
  computed: {
    ...mapGetters([
      'resetPassword',
      'orgLogoImg'
    ]),
    sidebar() {
      return this.$store.state.app.sidebar
    },
    device() {
      return this.$store.state.app.device
    },
    fixedHeader() {
      return this.$store.state.settings.fixedHeader
    },
    classObj() {
      return {
        hideSidebar: !this.sidebar.opened,
        openSidebar: this.sidebar.opened,
        withoutAnimation: this.sidebar.withoutAnimation,
        mobile: this.device === 'mobile'
      }
    }
  },
  methods: {
    handleClickOutside() {
      this.$store.dispatch('app/closeSideBar', { withoutAnimation: false })
    },
    closeCallback() {
      this.$store.dispatch('app/toggleResetPassword', false)
    }
  }
}
</script>

<style lang="scss" scoped>
  @import "@/styles/mixin.scss";
  @import "@/styles/variables.scss";

  .app-wrapper {
    @include clearfix;
    position: relative;
    height: 100%;
    width: 100%;
    &.mobile.openSidebar{
      position: fixed;
      top: 0;
    }
  }
  .drawer-bg {
    background: #000;
    opacity: 0.3;
    width: 100%;
    top: 0;
    height: 100%;
    position: absolute;
    z-index: 999;
  }

  .fixed-header {
    position: fixed;
    top: 0;
    right: 0;
    z-index: 1002;
    left: 0;
    transition: width 0.28s;
    background: #fff;
    .logo {
      position: absolute;
      left: 0;
      top: 0;
      background: #fff;
      width: 180px;
      text-align: center;
      z-index: 100;
      img {
        margin-top:8%;
        height: 70%;
        max-width: 100%;
      }
    }
  }


  .mobile .fixed-header {
    width: 100%;
  }
</style>
