<template>
  <div>
    {{ name }} <br>
    {{ type }} : {{ value }} <br>
    <div style="cursor: pointer" @click="click"><b> 查看详情 </b></div>
  </div>
</template>

<script>
import router from '@/router'
export default {
  props: [
    'name',
    'type',
    'value'
  ],
  data() {
    return {
      path: {}
    }
  },
  mounted() {
    this.path = {
      name: 'City',
      params: {
        c1: this.name
      }
    }
  },
  methods: {
    click() {
      console.log(this)
      router.push(this.path)
    }
  }
}
</script>
