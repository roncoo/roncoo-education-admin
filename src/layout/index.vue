<template>
  <div :class="classObj" class="app-wrapper">
    <div v-if="device==='mobile'&&sidebar.opened" class="drawer-bg" @click="handleClickOutside" />
    <sidebar class="sidebar-container" />
    <div :class="{'fixed-main-container':fixedHeader}" class="main-container">
      <div :class="{'fixed-header':fixedHeader}">
        <navbar />
        <tags-view />
      </div>
      <app-main />
    </div>
    <global-uploader v-if="load" />
    <reset-password :visible="resetPassword" @close-callback="closeCallback" />
  </div>
</template>

<script>
import {AppMain, Navbar, ResetPassword, Sidebar, TagsView} from './components'
import ResizeMixin from './mixin/ResizeHandler'
import {mapGetters} from 'vuex'
import GlobalUploader from '@/components/Upload';

export default {
  name: 'Layout',
  components: {
    GlobalUploader,
    ResetPassword,
    Navbar,
    Sidebar,
    TagsView,
    AppMain
  },
  mixins: [ResizeMixin],
  data() {
    return {
      load: false
    }
  },
  computed: {
    ...mapGetters([
      'resetPassword'
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
  mounted() {
    this.load = true
  },
  methods: {
    handleClickOutside() {
      this.$store.dispatch('app/closeSideBar', {withoutAnimation: false})
    },
    closeCallback() {
      this.$store.dispatch('app/toggleResetPassword', false)
    }
  }
}
</script>

<style lang="scss" scoped>
@import "~@/styles/mixin.scss";
@import "~@/styles/variables.scss";

.app-wrapper {
  @include clearfix;
  position: relative;
  height: 100%;
  width: 100%;

  &.mobile.openSidebar {
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
  z-index: 9;
  width: calc(100% - #{$sideBarWidth});
  transition: width 0.28s;
}

.hideSidebar .fixed-header {
  width: calc(100% - 54px)
}

.mobile .fixed-header {
  width: 100%;
}
</style>
