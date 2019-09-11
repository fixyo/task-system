<template>
  <div id="app">
    <router-view v-if="isRouterAlive"/>
  </div>
</template>

<script>
export default {
    name: 'App',
    provide () {
        return {
        reload: this.reload
        }
    },
    data(){
        return{
            isRouterAlive: true
        }
    },
    methods:{
        reload(){
            this.isRouterAlive = false
            this.$nextTick(function(){
                this.isRouterAlive = true
            })
        }
    }
  // mounted () {
  //   // 页面关闭的时候清空标签栏
  //   window.onbeforeunload = function (e) {
  //     localStorage.tagNaveList = ''
  //   }
  // }
}
</script>

<style lang="less">
.size {
  width: 100%;
  height: 100%;
}
html,
body {
  .size;
  overflow: hidden;
  margin: 0;
  padding: 0;
}
#app {
  .size;
}
</style>
