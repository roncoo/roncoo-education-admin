<template>
  <div class="tags-view-container">
    <!-- <scroll-pane ref="scrollPane" class="tags-view-wrapper"> -->
    <el-scrollbar class="tags-view-wrapper">
      <router-link
        v-for="tag in visitedViews"
        ref="tag"
        :key="tag.route.fullPath"
        :class="isActive(tag) ? 'active' : ''"
        :to="tag.route"
        tag="span"
        class="tags-view-item"
        @click.middle="closeSelectedTag(tag)"
        @contextmenu.prevent="openMenu(tag, $event)"
      >
        {{ tag.title }}
        <el-icon class="el-close" @click.prevent.stop="closeSelectedTag(tag)">
          <close/>
        </el-icon>
      </router-link>
    </el-scrollbar>

    <!-- </scroll-pane> -->
    <ul
      v-show="visible"
      :style="{ left: left + 'px', top: top + 'px' }"
      class="contextmenu"
    >
      <li @click="refreshSelectedTag(selectedTag)">刷新</li>
      <li @click="closeSelectedTag(selectedTag)">关闭</li>
      <li @click="closeOthersTags">关闭其它</li>
      <li @click="closeAllTags">关闭所有</li>
    </ul>
  </div>
</template>

<script>
import ScrollPane from '@/components/ScrollPane/index.vue';
import pathToRegexp from 'path-to-regexp';
import {Close} from '@element-plus/icons-vue'

export default {
  name: 'TagsView',
  components: {ScrollPane, Close},
  data() {
    return {
      visible: false,
      top: 26,
      left: 0,
      selectedTag: {}
    };
  },
  computed: {
    visitedViews() {
      return this.$store.state.tags.visitedViews;
    }
  },
  watch: {
    $route() {
      this.refreshTagsView();

      // this.addViewTags()
      this.moveToCurrentTag();
    },
    visible(value) {
      if (value) {
        document.body.addEventListener('click', this.closeMenu);
      } else {
        document.body.removeEventListener('click', this.closeMenu);
      }
    }
  },
  mounted() {
    this.refreshTagsView();
  },
  methods: {
    isActive(tag) {
      return tag.route.fullPath === this.$route.fullPath;
    },
    refreshTagsView() {
      if (pathToRegexp('/redirect/:path*') && pathToRegexp('/redirect/:path*').test && !pathToRegexp('/redirect/:path*').test(this.$route.path)) {
        this.$store.dispatch('addView', this.$route);
        //console.log('refreshTagsView', this.$route);
      }
    },
    moveToCurrentTag() {
      const tags = this.$refs.tag;
      this.$nextTick(() => {
        if (tags && tags.length) {
          for (const tag of tags) {
            if (tag.to.path === this.$route.path) {
              // this.$refs.scrollPane.moveToTarget(tag);
              // when query is different then update
              if (tag.to.fullPath !== this.$route.fullPath) {
                this.$store.dispatch('updateVisitedView', this.$route);
              }
              break;
            }
          }
        }
      });
    },
    refreshSelectedTag(view) {
      this.$store.dispatch('delCachedView', view.route).then(() => {
        const {fullPath} = view.route;
        this.$nextTick(() => {
          this.$router.push({
            path: '/redirect' + fullPath
          });
        });
      });
    },
    closeSelectedTag(view) {
      this.$store.dispatch('delView', view).then(({visitedViews}) => {
        if (this.isActive(view)) {
          const latestView = visitedViews.slice(-1)[0];
          if (latestView) {
            this.$router.push(latestView.route.fullPath);
          } else {
            this.$router.push('/');
          }
        }
      });
    },
    closeOthersTags() {
      this.$router.push(this.selectedTag.route);
      this.$store.dispatch('delOthersViews', this.selectedTag).then(() => {
        this.moveToCurrentTag();
      });
    },
    closeAllTags() {

      this.$store.dispatch('delAllViews');
      this.$router.push('/');
    },
    openMenu(tag, e) {
      const menuMinWidth = 105;
      const offsetLeft = this.$el.getBoundingClientRect().left; // container margin left
      const offsetWidth = this.$el.offsetWidth; // container width
      const maxLeft = offsetWidth - menuMinWidth; // left boundary
      const left = e.clientX - offsetLeft + 15; // 15: margin right

      if (left > maxLeft) {
        this.left = maxLeft;
      } else {
        this.left = left;
      }
      // this.top = e.clientY

      this.visible = true;
      this.selectedTag = tag;
    },
    closeMenu() {
      this.visible = false;
    }
  }
};
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.tags-view-container {
  position: relative;
  z-index: 99;
  height: 30px;
  width: 100%;
  background: #fff;
  padding-left: 182px;
  border-bottom: 1px solid #d8dce5;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.12), 0 0 3px 0 rgba(0, 0, 0, 0.04);

  .tags-view-wrapper {
    .tags-view-item {
      display: inline-block;
      position: relative;
      cursor: pointer;
      height: 22px;
      line-height: 22px;
      border: 1px solid #d8dce5;
      color: #495060;
      background: #fff;
      padding: 0 8px;
      font-size: 12px;
      margin-left: 5px;
      margin-top: 4px;

      &:first-of-type {
        margin-left: 15px;
      }

      &:last-of-type {
        margin-right: 15px;
      }

      &.active {
        background-color: #42b983;
        color: #fff;
        border-color: #42b983;

        &::before {
          content: "";
          background: #fff;
          display: inline-block;
          width: 8px;
          height: 8px;
          border-radius: 50%;
          position: relative;
          margin-right: 2px;
        }
      }
    }
  }

  .contextmenu {
    margin: 0;
    background: #fff;
    z-index: 100;
    position: absolute;
    list-style-type: none;
    padding: 5px 0;
    border-radius: 4px;
    font-size: 12px;
    font-weight: 400;
    color: #333;
    box-shadow: 2px 2px 3px 0 rgba(0, 0, 0, 0.3);

    li {
      margin: 0;
      padding: 7px 16px;
      cursor: pointer;

      &:hover {
        background: #eee;
      }
    }
  }
}
</style>

<style rel="stylesheet/scss" lang="scss">
//reset element css of el-icon-close
.tags-view-wrapper {
  .tags-view-item {
    .el-close {
      width: 16px;
      height: 16px;
      vertical-align: -1px;
      border-radius: 50%;
      margin-left: 6px;
      text-align: center;
      transition: all 0.3s cubic-bezier(0.645, 0.045, 0.355, 1);
      transform-origin: 100% 50%;

      &:before {
        transform: scale(0.6);
        display: inline-block;
        vertical-align: -3px;
      }

      &:hover {
        background-color: #b4bccc;
        color: #fff;
      }
    }
  }
}
</style>
