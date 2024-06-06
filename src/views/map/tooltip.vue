<template>
  <div>
    {{ name }} <br>
    <div v-for="item in dataTypes" :key="item.index">
      {{ item.name }} : {{ value[item.index + 1] }} <br>
    </div>
    <div style="cursor: pointer" @click="click"><b> 查看详情 </b></div>
  </div>
</template>

<script>
import { getDataTypes } from '../../api/dataApi'
import router from '@/router'
export default {
  props: [
    'name',
    'value'
  ],
  data() {
    return {
      path: {},
      dataTypes: []
    }
  },
  mounted() {
    getDataTypes().then((res) => {
      this.dataTypes = res.data
    })
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
