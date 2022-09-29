<template>
  <div class="navbar">
    <hamburger :is-active="sidebar.opened" class="hamburger-container" @toggleClick="toggleSideBar"/>
    <breadcrumb class="breadcrumb-container"/>
    <div class="right-menu">
      <a href="https://www.roncoo.net/" target="_blank" class="nav-item">商业版咨询</a><span>&nbsp;&nbsp;|&nbsp;&nbsp;</span>
      <a v-if="checkPermission('system:admin:sys:config:list')" target="_blank" class="nav-item" @click="handleRow">系统配置<span>&nbsp;&nbsp;|&nbsp;&nbsp;</span></a>
      <a href="/" target="_blank" class="nav-item">前端首页</a><span>&nbsp;&nbsp;|</span>
      <el-dropdown class="avatar-container" size="medium" @command="commandFn" trigger="hover">
        <span class="el-link">{{ userInfo.realName }}<el-icon><arrow-down/></el-icon></span>
        <template #dropdown>
          <el-dropdown-menu class="user-dropdown">
            <router-link v-if="checkPermission('user:admin:users:page')" to="/pms/user">
              <el-dropdown-item>账号管理</el-dropdown-item>
            </router-link>
            <!--<el-dropdown-item command="resetPass" divided>
                <span>修改密码</span>
            </el-dropdown-item>-->
            <el-dropdown-item command="logout" divided>
              <span>退出登录</span>
            </el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </div>
  </div>
</template>

<script>
import {mapGetters} from 'vuex';
import {useI18n} from 'vue-i18n'
import Breadcrumb from '@/components/Breadcrumb/index.vue';
import Hamburger from '@/components/Hamburger/index.vue'
import {ArrowDown} from '@element-plus/icons'

export default {
  components: {
    Breadcrumb,
    Hamburger,
    ArrowDown
  },
  data() {
    const i18n = useI18n()
    return {
      customizeDomain: '',
      languageName: '中文',
      languageList: [
        {
          type: 'zh-cn',
          name: '中文'
        },
        {
          type: 'en',
          name: 'English'
        }
      ],
      i18n
    };
  },
  computed: {
    ...mapGetters(['sidebar', 'userInfo', 'language'])
  },
  created() {
    this.languageList.forEach(e => {
      if (e.type === this.language) {
        this.languageName = e.name
      }
    })
  },
  methods: {
    toggleSideBar() {
      this.$store.dispatch('app/toggleSideBar');
    },
    async logout() {
      await this.$store.dispatch('user/logout');
      window.location.reload();
    },
    languageFn(item) {
      this.i18n.locale = item.type
      this.languageName = item.name;
      this.$store.dispatch('app/toggleLanguage', item.type);
    },
    commandFn(e) {
      if (e === 'logout') {
        this.logout();
      }
      if (e === 'resetPass') {
        this.reset();
      }
    },
    async reset() {
      this.$store.dispatch('user/password', true);
    },
    handleRow() {
      this.$router.push(`/pms/config`)
    }
  }
};
</script>

<style lang="scss" scoped>
.navbar {
  height: 32px;
  overflow: hidden;
  position: relative;
  background: #fff;
  padding-left: 182px;
  box-shadow: 0 1px 4px rgba(0, 21, 41, 0.08);

  .hamburger-container {
    line-height: 32px;
    height: 100%;
    float: left;
    cursor: pointer;
    transition: background 0.3s;
    -webkit-tap-highlight-color: transparent;

    &:hover {
      background: rgba(0, 0, 0, 0.025);
    }
  }

  .breadcrumb-container {
    float: left;
  }

  .home {
    width: 32px;
    margin: 0 25px;
    margin-top: 9px;
    display: inline-block;
  }

  .el-icon-user-solid {
    margin: 0 25px;
  }

  .orgHome {
    margin-top: 11px;
  }

  .el-icon-user-solid {
    font-size: 30px;
    color: #26a2ff;
    margin-top: 6px;
    margin-right: 30px;
  }

  .el-dropdown-menu__item {
    padding: 0 20px;
  }

  .right-menu {
    float: right;
    height: 100%;
    margin-right: 30px;
    line-height: 32px;

    &:focus {
      outline: none;
    }

    .right-menu-item {
      display: inline-block;
      padding: 0 8px;
      height: 100%;
      font-size: 18px;
      color: #5a5e66;
      vertical-align: text-bottom;

      &.hover-effect {
        cursor: pointer;
        transition: background 0.3s;

        &:hover {
          background: rgba(0, 0, 0, 0.025);
        }
      }
    }

    .avatar-container {
      margin-right: 30px;

      .avatar-wrapper {
        margin-top: 5px;
        position: relative;

        .user-avatar {
          cursor: pointer;
          width: 30px;
          margin-top: 5px;
          height: 30px;
          border-radius: 20px;
        }

        .el-icon-caret-bottom {
          cursor: pointer;
          position: absolute;
          right: -20px;
          top: 15px;
          font-size: 12px;
        }
      }
    }
  }
}
</style>
