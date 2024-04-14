<template>
  <div class="course">
    <div class="image">
      <img
        :src="'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAB4AAAAeCAYAAAA7MK6iAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAJESURBVHgB7ZZNaBNBGIaf3cQ2tV2tNv0xWinUIlXwYtBWRW0RPRkP0iomIKhgg0UQbPASCfYkXnqRXNQeRBDxVPAiQr2pUA8iiBdBKAQKrRdbLSWbNV/sNmazmwbdvdg+sLszszPzMu+38+3AOv87yp+VfTeN+oZGgmoWHy6S86Nnssx8TSmLZcJHbhlblADteMgPyLxPKbNSVs1GPUArHhNQaR0YMApu+uV2PGUEdKgxO4zHibZton9unqnYfdK4hJrD92ZHQednYcXf5osxPd9DqLOFRH2A8M4gQ7fPEsZF9oR+u6xaX2QtdW0jGh5QJvz8LZmP0yQXFpmaniM98phJPMBv13jtERP5xwQeouISPR1oclXb348LyAd55QQPpfzgFZef5sO12hhXVjx4iHiNj5BcF48xWs2YisJi3b0L9O2vYKHs+aBGxKzLNhy/SpR/EU6e487BLsZSg/arEIs7molb2zvbSFw/yW7+Rjh9iYgWoF/Km+vos0skElefYu9G5ABjlZxyFO4Kla6kd1dp/ckwQxJTp/HyLnGm3I2KwhI366QSO3FBymJxe5PzpCbbGok6pdwy4eVJY3adu7eTEPvMrVMNR7sZtbO8TPh0mIiThaqKdjfGs0oWW5G+w6eKX71JIYFsbUDXlxvefWGyOf9LFBGnyZb01ROESU7n+4sPxXz/KUNOnisnkMNJY6/qc/fIYyU/+dLrlPJZyitWb/Axg8dka4saJYe93htGndJEixeHvYZaZl+OKAuss2b4BavYgJM8p1ouAAAAAElFTkSuQmCC'"
      />
    </div>
    <div class="title">课程名称</div>
    <div class="content">￥999.99</div>
  </div>
</template>

<script setup>
  import { defineProps, onMounted } from 'vue'

  const props = defineProps({
    componentInfo: {
      type: Array,
      default: () => {
        return null
      }
    }
  })
  onMounted(() => {})
</script>

<style lang="scss" scoped>
  .course {
    .image {
      width: 285px;
      height: 222px;
      background: #3d7fff12;
    }
  }
</style>
