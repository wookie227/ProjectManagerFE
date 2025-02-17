<template>
  <div>
    <n-button
      type="primary"
      @click="showAddEmployeeModal = true"
      style="margin-top: 8px; margin-bottom: 8px"
      >Добавить сотрудника</n-button
    >
    <n-modal v-model:show="showAddEmployeeModal" preset="dialog">
      <n-card title="Добавить сотрудника" class="mb-4">
        <n-space vertical>
          <n-input v-model:value="newEmployee.firstName" placeholder="Имя" />
          <n-input v-model:value="newEmployee.lastName" placeholder="Фамилия" />
          <n-input
            v-model:value="newEmployee.middleName"
            placeholder="Отчество"
          />
          <n-input v-model:value="newEmployee.email" placeholder="Email" />

          <n-select
            v-model:value="newEmployee.companyId"
            :options="companyOptions"
            placeholder="Выберите компанию"
          />

          <n-button type="primary" @click="addEmployee">Добавить</n-button>
        </n-space>
      </n-card>
    </n-modal>

    <n-modal v-model:show="showEditEmployeeModal" preset="dialog">
      <n-card title="Редактировать сотрудника" class="mb-4">
        <n-space vertical>
          <n-input
            v-model:value="editingEmployee.firstName"
            placeholder="Имя"
          />
          <n-input
            v-model:value="editingEmployee.lastName"
            placeholder="Фамилия"
          />
          <n-input
            v-model:value="editingEmployee.middleName"
            placeholder="Отчество"
          />
          <n-input v-model:value="editingEmployee.email" placeholder="Email" />

          <n-select
            v-model:value="editingEmployee.companyId"
            :options="companyOptions"
            placeholder="Выберите компанию"
          />

          <n-button type="primary" @click="updateEmployee">Сохранить</n-button>
          <n-button type="error" @click="cancelEdit">Отмена</n-button>
        </n-space>
      </n-card>
    </n-modal>

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
            <n-button
              size="small"
              @click="editEmployee(employee)"
              style="margin-right: 8px"
              >Редактировать</n-button
            >
            <n-button
              size="small"
              type="error"
              @click="confirmDelete(employee.id)"
              >Удалить</n-button
            >
          </n-td>
        </n-tr>
      </n-tbody>
    </n-table>

    <!-- Модальное окно подтверждения удаления -->
    <n-modal v-model:show="showDeleteModal" preset="dialog">
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
import { useMessage } from "naive-ui";
export default {
  setup() {
    const message = useMessage();
    return { message };
  },
  data() {
    return {
      employees: [],
      companies: [],
      showAddEmployeeModal: false,
      showEditEmployeeModal: false,
      newEmployee: {
        firstName: "",
        lastName: "",
        middleName: "",
        email: "",
        companyId: null,
      },
      editingEmployee: null,
      showDeleteModal: false,
      employeeToDelete: null,
    };
  },
  computed: {
    companyOptions() {
      return this.companies.map((company) => ({
        label: company.name,
        value: company.id,
      }));
    },
  },
  methods: {
    async fetchEmployees() {
      try {
        const response = await fetch("http://localhost:5116/api/employee");
        this.employees = await response.json();
      } catch (error) {
        this.message.error("Ошибка при загрузке сотрудников!");
        console.error("Ошибка при загрузке сотрудников:", error);
      }
    },
    async fetchCompanies() {
      try {
        const response = await fetch("http://localhost:5116/api/company");
        this.companies = await response.json();
      } catch (error) {
        this.message.error("Ошибка при загрузке компаний!");
        console.error("Ошибка при загрузке компаний:", error);
      }
    },
    async addEmployee() {
      try {
        const response = await fetch("http://localhost:5116/api/employee", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(this.newEmployee),
        });

        if (!response.ok) throw new Error("Ошибка при добавлении сотрудника");

        this.message.success("Сотрудник успешно добавлен!");
        this.fetchEmployees();
        this.resetForm();
      } catch (error) {
        this.message.error("Ошибка при добавлении сотрудника!");
        console.error(error);
      }
      this.showAddEmployeeModal = false;
    },
    async updateEmployee() {
      try {
        const response = await fetch(
          `http://localhost:5116/api/employee/${this.editingEmployee.id}`,
          {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(this.editingEmployee),
          }
        );

        if (!response.ok) throw new Error("Ошибка при обновлении сотрудника");
        this.message.success("Сотрудник успешно обновлен!");
        this.fetchEmployees();
        this.showEditEmployeeModal = false;
      } catch (error) {
        this.message.error("Ошибка при обновлении сотрудника!");
        console.error(error);
      }
    },
    editEmployee(employee) {
      if (!employee) return;
      this.showEditEmployeeModal = true;
      this.editingEmployee = {
        ...employee,
        companyId:
          this.companies.find(
            (company) => company.name === employee.companyName
          )?.id || null,
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
      console.log(this.employeeToDelete);
      if (!this.employeeToDelete) return;
      try {
        const response = await fetch(
          `http://localhost:5116/api/employee/${this.employeeToDelete}`,
          {
            method: "DELETE",
          }
        );
        if (!response.ok) throw new Error("Ошибка при удалении сотрудника");

        this.message.success("Сотрудник успешно удален!");
        this.fetchEmployees();
        this.showDeleteModal = false;
      } catch (error) {
        this.message.error("Ошибка при удалении сотрудника!");
        console.error(error);
      }
    },
    resetForm() {
      this.newEmployee = {
        firstName: "",
        lastName: "",
        middleName: "",
        email: "",
        companyId: null,
      };
    },
  },
  mounted() {
    this.fetchEmployees();
    this.fetchCompanies();
  },
};
</script>

<style scoped>
.mb-4 {
  margin-bottom: 16px;
}
</style>
