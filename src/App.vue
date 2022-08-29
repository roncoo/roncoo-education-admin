<template>
  <el-config-provider :locale="locale === 'en'?ElementPlusEn:ElementPlusZhCn">
    <router-view />
  </el-config-provider>
</template>

<script>
// This starter template is using Vue 3 experimental <script setup> SFCs
// Check out https://github.com/vuejs/rfcs/blob/script-setup-2/active-rfcs/0000-script-setup.md
import {useStore} from "vuex";
import {useI18n} from "vue-i18n";
import {onMounted, ref} from "vue";
import {ElConfigProvider} from 'element-plus'
import ElementPlusZhCn from "element-plus/lib/locale/lang/zh-cn";
import ElementPlusEn from "element-plus/lib/locale/lang/en";
export default {
  components:{[ElConfigProvider.name]:ElConfigProvider},
  setup(){
const {locale} = useI18n()
return {
  locale,
  ElementPlusZhCn,
  ElementPlusEn
}
}
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
}
</style>
