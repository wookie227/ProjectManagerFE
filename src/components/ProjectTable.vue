<template>
  <n-table>
    <n-thead>
      <n-tr>
        <n-th>ID</n-th>
        <n-th>Название</n-th>
        <n-th>Компания-заказчик</n-th>
        <n-th>Компания-исполнитель</n-th>
        <n-th>Дата начала</n-th>
        <n-th>Дата окончания</n-th>
        <n-th>Приоритет</n-th>
      </n-tr>
    </n-thead>
    <n-tbody>
      <n-tr v-for="project in projects" :key="project.id">
        <n-td>{{ project.id }}</n-td>
        <n-td>{{ project.projectName }}</n-td>
        <n-td>{{ project.customerCompanyName }}</n-td>
        <n-td>{{ project.executorCompanyName }}</n-td>
        <n-td>{{ project.startDate }}</n-td>
        <n-td>{{ project.endDate }}</n-td>
        <n-td>{{ project.priority }}</n-td>
      </n-tr>
    </n-tbody>
  </n-table>
</template>

<script setup>
import { ref, onMounted } from 'vue';

const projects = ref([]);

const fetchProjects = async () => {
  try {
    const response = await fetch('http://localhost:5116/api/project');
    projects.value = await response.json();
    console.log(projects.value)
  } catch (error) {
    console.error('Ошибка при загрузке проектов:', error);
  }
};

onMounted(fetchProjects);
</script>
