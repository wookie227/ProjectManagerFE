<template>
    <div>
      <n-card v-if="!editingEmployee" title="Добавить сотрудника" class="mb-4">
        <n-space vertical>
          <n-input v-model:value="newEmployee.firstName" placeholder="Имя" />
          <n-input v-model:value="newEmployee.lastName" placeholder="Фамилия" />
          <n-input v-model:value="newEmployee.middleName" placeholder="Отчество" />
          <n-input v-model:value="newEmployee.email" placeholder="Email" />
          
          <n-select v-model:value="newEmployee.companyId" :options="companyOptions" placeholder="Выберите компанию" />
          
          <n-button type="primary" @click="addEmployee">Добавить</n-button>
        </n-space>
      </n-card>
  
      <!-- Форма редактирования сотрудника -->
      <n-card v-else title="Редактировать сотрудника" class="mb-4">
        <n-space vertical>
          <n-input v-model:value="editingEmployee.firstName" placeholder="Имя" />
          <n-input v-model:value="editingEmployee.lastName" placeholder="Фамилия" />
          <n-input v-model:value="editingEmployee.middleName" placeholder="Отчество" />
          <n-input v-model:value="editingEmployee.email" placeholder="Email" />
          
          <n-select v-model:value="editingEmployee.companyId" :options="companyOptions" placeholder="Выберите компанию" />
          
          <n-button type="primary" @click="updateEmployee">Сохранить</n-button>
          <n-button type="error" @click="cancelEdit">Отмена</n-button>
        </n-space>
      </n-card>
  
      <n-table>
        <n-thead>
          <n-tr>
            <n-th>ID</n-th>
            <n-th>Фамилия</n-th>
            <n-th>Имя</n-th>
            <n-th>Отчество</n-th>
            <n-th>Email</n-th>
            <n-th>Компания</n-th>
            <n-th>Действия</n-th>
          </n-tr>
        </n-thead>
        <n-tbody>
          <n-tr v-for="employee in employees" :key="employee.id">
            <n-td>{{ employee.id }}</n-td>
            <n-td>{{ employee.lastName }}</n-td>
            <n-td>{{ employee.firstName }}</n-td>
            <n-td>{{ employee.middleName }}</n-td>
            <n-td>{{ employee.email }}</n-td>
            <n-td>{{ employee.companyName }}</n-td>
            <n-td>
              <n-button size="small" @click="editEmployee(employee)">Редактировать</n-button>
              <n-button size="small" type="error" @click="confirmDelete(employee.id)">Удалить</n-button>
            </n-td>
          </n-tr>
        </n-tbody>
      </n-table>
  
      <!-- Модальное окно подтверждения удаления -->
      <n-modal v-model:show="showDeleteModal">
        <n-card title="Подтверждение удаления">
          <p>Вы уверены, что хотите удалить этого сотрудника?</p>
          <n-space>
            <n-button type="error" @click="deleteEmployee">Удалить</n-button>
            <n-button @click="showDeleteModal = false">Отмена</n-button>
          </n-space>
        </n-card>
      </n-modal>
    </div>
  </template>
  
  <script>
  export default {
    data() {
      return {
        employees: [],
        companies: [],
        newEmployee: {
          firstName: '',
          lastName: '',
          middleName: '',
          email: '',
          companyId: null
        },
        editingEmployee: null,
        showDeleteModal: false,
        employeeToDelete: null
      };
    },
    computed: {
      companyOptions() {
        return this.companies.map(company => ({
          label: company.name,
          value: company.id
        }));
      }
    },
    methods: {
      async fetchEmployees() {
        try {
          const response = await fetch('http://localhost:5116/api/employee');
          this.employees = await response.json();
        } catch (error) {
          console.error('Ошибка при загрузке сотрудников:', error);
        }
      },
      async fetchCompanies() {
        try {
          const response = await fetch('http://localhost:5116/api/company');
          this.companies = await response.json();
        } catch (error) {
          console.error('Ошибка при загрузке компаний:', error);
        }
      },
      async addEmployee() {
        try {
          const response = await fetch('http://localhost:5116/api/employee', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(this.newEmployee)
          });
  
          if (!response.ok) throw new Error('Ошибка при добавлении сотрудника');
  
          this.fetchEmployees();
          this.resetForm();
        } catch (error) {
          console.error(error);
        }
      },
      async updateEmployee() {
        try {
          const response = await fetch(`http://localhost:5116/api/employee/${this.editingEmployee.id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(this.editingEmployee)
          });
  
          if (!response.ok) throw new Error('Ошибка при обновлении сотрудника');
  
          this.fetchEmployees();
          this.cancelEdit();
        } catch (error) {
          console.error(error);
        }
      },
      editEmployee(employee) {
        this.editingEmployee = { 
            ...employee,
            companyId: this.companies.find(company => company.name === employee.companyName)?.id || null
        };
       },
      cancelEdit() {
        this.editingEmployee = null;
      },
      confirmDelete(employeeId) {
        this.employeeToDelete = employeeId;
        this.showDeleteModal = true;
      },
      async deleteEmployee() {
        console.log(this.employeeToDelete)
        if (!this.employeeToDelete) return;
  
        try {
          const response = await fetch(`http://localhost:5116/api/employee/${this.employeeToDelete}`, {
            method: 'DELETE'
          });
  
          if (!response.ok) throw new Error('Ошибка при удалении сотрудника');
  
          this.fetchEmployees();
          this.showDeleteModal = false;
        } catch (error) {
          console.error(error);
        }
      },
      resetForm() {
        this.newEmployee = {
          firstName: '',
          lastName: '',
          middleName: '',
          email: '',
          companyId: null
        };
      }
    },
    mounted() {
      this.fetchEmployees();
      this.fetchCompanies();
    }
  };
  </script>
  
  <style scoped>
  .mb-4 {
    margin-bottom: 16px;
  }
  </style>
  