<template>
  <el-radio-group>
    <el-radio v-for="item in enums" :key="item.code" :label="item.code">{{ item.desc }}</el-radio>
  </el-radio-group>
</template>

<script setup lang="ts">
import {onMounted, ref} from 'vue';
import {getEnum} from "@/utils/base";

const props = defineProps({
  enumName: {type: String, default: ''}
});

const enums = ref([])
onMounted(() => {
  enums.value = getEnum(props.enumName)
})

</script>