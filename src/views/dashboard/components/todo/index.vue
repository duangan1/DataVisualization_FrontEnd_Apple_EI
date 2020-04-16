<template>
  <el-card class="box-card todo">
    <div slot="header" class="clearfix">
      <h4>{{ title }}</h4>

      <el-divider />
      <div>
        <div class="counter">
          <h1>18</h1>
          <span>待办</span>
        </div>
        <div class="counter">
          <h1>8</h1>
          <span class="finished">完成</span>
        </div>
      </div>
    </div>
    <ul>
      <li v-for="o in tasks" :key="o" class="text item">
        <svg-icon slot="icon" icon-class="sample" /> {{ '列表内容 ' + o.subject }}
      </li>
    </ul>
  </el-card>
</template>
<script>

export default {
  name: 'Todo',
  props: {
    title: { type: String, required: true },
    tasks: { type: Array, required: true }
  },
  created() {

  }
}
</script>
<style lang="scss" scoped>
.todo {
  padding: 0;
  .el-divider--horizontal {
    margin: 5px 0;
  }
  h4 {
    font-weight: 500;
    margin: 0;
  }

  .counter {
    float: left;
    width: 50%;
    text-align: center;
    h1 {
      margin: 0;
    }
    span {
      font-size: 13px;
      &:before {
        content: "";
        display: inline-block;
        width: 5px;
        height: 5px;
        background-color: red;
        border-radius: 50px;
        margin: 0 2px 2px;
      }
    }
    .finished {
      &:before {
        background-color: #009688;
      }
    }
  }
}
</style>
