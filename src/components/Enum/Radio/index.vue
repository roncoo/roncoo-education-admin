<template>
  <el-radio-group>
    <el-radio v-for="item in enums" :key="item.code" :label="item.code">{{ item.desc }}</el-radio>
  </el-radio-group>
</template>

<script setup>
import {onMounted, ref} from 'vue';
import {getEnumList} from "@/utils/base";

const props = defineProps({
  enumName: {type, default: ''}
});

const enums = ref([])
onMounted(() => {
  enums.value = getEnumList(props.enumName)
})

</script>