<script setup>
import AMapLoader from '@amap/amap-jsapi-loader'
import {shallowRef} from '@vue/reactivity'
import {onMounted, reactive} from 'vue'

let map = shallowRef(null)

const data = reactive({
  height: document.documentElement.clientHeight * 0.75 + 'px',
})

const initMap = () => {
  AMapLoader.load({key: '4beec37e4dc6a08726724e3fc90afb36', version: '2.0', plugins: [''],})
      .then((AMap) => {
        map = new AMap.Map("container", {
          zoom: 11,
        });
      })
      .catch(e => {
        console.log(e)
      })
}

onMounted(() => {
  initMap()
})

</script>

<template>
  <el-card>
    <div id="container" :style="{height: data.height, width: '100%'}"></div>
  </el-card>
</template>

<style scoped>
</style>
