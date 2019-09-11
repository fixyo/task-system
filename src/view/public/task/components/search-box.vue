<template>
  <div class="search-box">
    <Input
      search
      clearable 
      placeholder="模糊搜索"
      v-model="searchCont"
      @on-change="handleSearchContentChange"
      @on-search="handleSearch"
    />
    <Button>
      <Icon type="md-refresh"></Icon>
    </Button>
  </div>

</template>

<script>
  export default {
    props: {
      searchContent: {
        type: String,
        default: ''
      }
    },
    data() {
      return {
        searchCont: this.searchContent 
      }
    },
    created() {
      console.log(this.searchCont, 'searchCont')
    },
    methods: {
      handleSearchContentChange() {
        this.$emit('search-content-change', this.searchCont)
      },
      handleSearch() {
        this.$emit('inaccurate-search')
      }
    }
  } 
</script>

<style lang="less" scoped>
  .search-box {
    display: flex;
  }
</style>