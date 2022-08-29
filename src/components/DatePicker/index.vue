<template>
  <div class="wrapper">
    <el-select v-model="collectDateType" placeholder="请选择" class="mgr10 select_date_type" fit-input-width popper-class="select_date_type" @change="handleDateTypeChange">
    <el-option label="自然天" :value="1" />
    <el-option label="自然周" :value="2" v-if="useWeek" />
    <el-option label="自然月" :value="3" v-if="useMonth" />
    <el-option label="自然年" :value="4" v-if="useYear" />
  </el-select>
  <el-date-picker v-model="startDate" value-format="YYYY-MM-DD" type="date" placeholder="选择天" v-if="collectDateType === 1" class="w250" :editable="false" :clearable="false" :disabled-date="disabledDate"/>
  <el-date-picker
    v-model="startDate"
    type="week"
    :format="format.startTime + ' 至 ' + format.endTime"
    value-format="YYYY-MM-DD"
    placeholder="选择周"
    v-if="collectDateType === 2"
    @change="handleWeekChange"
    class="w250"
    :editable="false"
    :disabled-date="disabledDate"
  />
  <el-date-picker v-model="startDate" value-format="YYYY-MM-DD" type="month" placeholder="选择月" v-if="collectDateType === 3" class="w250" :editable="false" :clearable="false" :disabled-date="disabledDate"/>
  <el-date-picker v-model="startDate" value-format="YYYY-MM-DD" type="year" placeholder="选择年" v-if="collectDateType === 4" class="w250" :editable="false" :clearable="false" :disabled-date="disabledDate"/>
  </div>
</template>

<script setup>
import { parseTime } from '@/utils';
import { onMounted, reactive, ref, watch } from 'vue';
const dayTime = 24 * 60 * 60 * 1000
const getLastDate = () => {
  return new Date().getTime() - dayTime;
};
const disabledDate = (time) => {
  return time.getTime() > getLastDate();
};
const props = defineProps({
  modelValue:{
    type:Object,
    default:()=>{
      return {
        collectDateType: 1,
        startDate: parseTime(new Date() - 24 * 60 * 60 * 1000, '{y}-{m}-{d}')
      }
    }
  },
  useWeek: {
    type: Boolean,
    default: () => {
      return true;
    },
  },
  useMonth: {
    type: Boolean,
    default: () => {
      return true;
    },
  },
  useYear: {
    type: Boolean,
    default: () => {
      return true;
    },
  },
});
const emit = defineEmits(['callback','update:modelValue'])
const collectDateType = ref(1);
const startDate = ref('');
const format = reactive({
  startTime: '',
  endTime: '',
});
onMounted(()=>{
  startDate.value = props.modelValue.startDate
})
watch(()=>{
  return props.modelValue
},(params)=>{
  if(params){
    startDate.value = params.startDate
    collectDateType.value = params.collectDateType
  }
})
const handleDateTypeChange = ()=>{
  startDate.value = ''
  emit('update:modelValue','')
}
const handleWeekChange = (value) => {
  if (value) {
    const timeStamp = new Date(value).getTime();
    const timeStamp2 = timeStamp + 24 * 60 * 60 * 1000 * 6;
    format.startTime = parseTime(timeStamp, '{y}-{m}-{d}');
    format.endTime = parseTime(timeStamp2, '{y}-{m}-{d}');
  }
};
watch(startDate,(value)=>{
  if(value){
    emit('callback',{collectDateType,startDate:value})
  }
})
</script>
<style lang="scss" scoped>
.select_date_type {
  width: 108px;
  min-width: 108px;
}
</style>
<style>
.w250{
  width: 250px !important;
}
</style>
