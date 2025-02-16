<template>
    <n-layout-header bordered class="header">
      <n-space justify="center">
        <n-button @click="goToProjects" type="primary">Список проектов</n-button>
        <n-button @click="goToEmployees" type="primary">Список сотрудников</n-button>
      </n-space>
    </n-layout-header>
  </template>
  
  <script>
  export default {
    methods: {
      goToProjects() {
        this.$router.push('/projects');
      },
      goToEmployees() {
        this.$router.push('/employees');
      }
    }
  };
  </script>
  
  <style scoped>
  .header {
    padding: 10px;
    background: #f5f5f5;
  }
  </style>
  