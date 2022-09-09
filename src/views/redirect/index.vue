<template>
  <div/>
</template>
<script>
export default {
  name: 'NoCache',
  beforeCreate() {
    const {params, query} = this.$route
    const {path} = params
    let url = '';
    if (path && path.length) {
      url = path.join('/')
    }
    this.$router.replace({path: '/' + url, query})
  }
}
</script>
