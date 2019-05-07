<template>
  <div>
    <el-card>
      <img :src="'/api2/image?type=driver&fileName=' + pictureURL">
      <el-button @click="closePicture()" style="float: right">关 闭</el-button>
    </el-card>
  </div>
</template>

<script>
export default {
  props: ['pictureURL'],
  methods: {
    closePicture () {
      this.$emit('closePicture')
    }
  }
}
</script>

<style>

</style>
