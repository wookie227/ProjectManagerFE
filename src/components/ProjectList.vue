<template>
  <div class="container">
    <div class="projects-table">
      <n-card v-if="!editingProject" title="Добавить проект" class="mb-4">
        <n-space vertical>
          <n-input
            v-model:value="newProject.projectName"
            placeholder="Название проекта"
          />
          <n-select
            v-model:value="newProject.customerCompanyId"
            :options="companyOptions"
            placeholder="Выберите заказчика"
          />
          <n-select
            v-model:value="newProject.executorCompanyId"
            :options="companyOptions"
            placeholder="Выберите исполнителя"
          />
          <n-date-picker
            v-model:value="newProject.startDate"
            type="date"
            placeholder="Дата начала"
          />
          <n-date-picker
            v-model:value="newProject.endDate"
            type="date"
            placeholder="Дата окончания"
          />
          <n-input-number
            v-model:value="newProject.priority"
            placeholder="Приоритет"
            :min="1"
            :max="10"
          />
          <n-select
            v-model:value="newProject.projectManagerId"
            :options="managerOptions"
            placeholder="Выберите менеджера"
          />
          <n-button type="primary" @click="addProject">Добавить</n-button>
        </n-space>
      </n-card>

      <n-card v-else title="Редактировать проект" class="mb-4">
        <n-space vertical>
          <n-input
            v-model:value="editingProject.projectName"
            placeholder="Название проекта"
          />

          <n-select
            v-model:value="editingProject.customerCompanyId"
            :options="companyOptions"
            placeholder="Выберите заказчика"
          />
          <n-select
            v-model:value="editingProject.executorCompanyId"
            :options="companyOptions"
            placeholder="Выберите исполнителя"
          />

          <n-date-picker
            v-model:value="editingProject.startDate"
            type="datetime"
            placeholder="Дата начала"
          />
          <n-date-picker
            v-model:value="editingProject.endDate"
            type="datetime"
            placeholder="Дата окончания"
          />

          <n-input-number
            v-model:value="editingProject.priority"
            placeholder="Приоритет"
            :min="1"
            :max="10"
          />

          <n-select
            v-model:value="editingProject.projectManagerId"
            :options="managerOptions"
            placeholder="Выберите менеджера"
          />

          <n-button type="primary" @click="updateProject">Сохранить</n-button>
          <n-button type="error" @click="cancelEdit">Отмена</n-button>
        </n-space>
      </n-card>

      <n-table>
        <n-thead>
          <n-tr>
            <n-th>ID</n-th>
            <n-th>Название</n-th>
            <n-th>Заказчик</n-th>
            <n-th>Исполнитель</n-th>
            <n-th>Дата начала</n-th>
            <n-th>Дата окончания</n-th>
            <n-th>Приоритет</n-th>
            <n-th>Менеджер</n-th>
            <n-th>Действия</n-th>
          </n-tr>
        </n-thead>
        <n-tbody>
          <n-tr v-for="project in projects" :key="project.id">
            <n-td>{{ project.id }}</n-td>
            <n-td>{{ project.projectName }}</n-td>
            <n-td>{{ project.customerCompanyName }}</n-td>
            <n-td>{{ project.executorCompanyName }}</n-td>
            <n-td>{{ formatDate(project.startDate) }}</n-td>
            <n-td>{{ formatDate(project.endDate) }}</n-td>
            <n-td>{{ project.priority }}</n-td>
            <n-td>{{ project.projectManagerName }}</n-td>
            <n-td>
              <n-button size="small" @click="editProject(project)"
                >Редактировать</n-button
              >
              <n-button
                size="small"
                type="error"
                @click="confirmDelete(project.id)"
                >Удалить</n-button
              >
              <n-button
                size="small"
                type="info"
                @click="viewProjectEmployees(project)"
                >Посмотреть исполнителей</n-button
              >
              <n-button
                size="small"
                type="success"
                @click="openAddEmployeeModal(project)"
                >Добавить исполнителя</n-button
              >
            </n-td>
          </n-tr>
        </n-tbody>
      </n-table>
      <n-modal v-model:show="showDeleteModal">
        <n-card title="Подтверждение удаления" style="width: 30vw">
          <p>Вы уверены, что хотите удалить этот проект?</p>
          <n-space>
            <n-button type="error" @click="deleteProject">Удалить</n-button>
            <n-button @click="showDeleteModal = false">Отмена</n-button>
          </n-space>
        </n-card>
      </n-modal>
    </div>
    <n-modal v-model:show="showEmployeesInProjectModal">
      <div>
        <n-card :title="`Исполнители проекта`">
          <template #header-extra>
            <p
              style="cursor: pointer"
              @click="showEmployeesInProjectModal = false"
            >
              X
            </p>
          </template>
          <template v-if="projectEmployees.length > 0">
            <n-table>
              <n-thead>
                <n-tr>
                  <n-th>ID</n-th>
                  <n-th>Имя</n-th>
                  <n-th>Фамилия</n-th>
                  <n-th>Действия</n-th>
                </n-tr>
              </n-thead>
              <n-tbody>
                <n-tr v-for="employee in projectEmployees" :key="employee.id">
                  <n-td>{{ employee.id }}</n-td>
                  <n-td>{{ employee.firstName }}</n-td>
                  <n-td>{{ employee.lastName }}</n-td>
                  <n-td>
                    <n-button
                      size="small"
                      type="error"
                      @click="deleteEmployeeFromProject(employee.id)"
                      >Удалить</n-button
                    >
                  </n-td>
                </n-tr>
              </n-tbody>
            </n-table>
          </template>
          <template v-else>
            <p>Сотрудники не найдены</p>
          </template>
        </n-card>
      </div>
    </n-modal>
    <n-modal v-model:show="showAddEmployeeModal">
      <n-card title="Добавить исполнителя" style="width: 400px">
        <n-space vertical>
          <n-select
            v-model:value="selectedEmployeeId"
            :options="employeeOptions"
            placeholder="Выберите сотрудника"
          />
          <n-button type="primary" @click="addEmployeeToProject"
            >Добавить</n-button
          >
          <n-button @click="showAddEmployeeModal = false">Отмена</n-button>
        </n-space>
      </n-card>
    </n-modal>
  </div>
</template>

<script>
export default {
  data() {
    return {
      projects: [],
      companies: [],
      employees: [],
      managers: [],
      projectEmployees: [],
      selectedEmployeeId: null,
      showAddEmployeeModal: false,
      showEmployeesInProjectModal: false,
      selectedProject: null,
      selectedProjectId: null,
      newProject: {
        projectName: "",
        customerCompanyId: null,
        executorCompanyId: null,
        startDate: null,
        endDate: null,
        priority: 1,
        projectManagerId: null,
      },
      editingProject: null,
      showDeleteModal: false,
      projectToDelete: null,
    };
  },
  computed: {
    employeeOptions() {
      return this.employees.map((emp) => ({
        label: `${emp.firstName} ${emp.lastName}`,
        value: emp.id,
      }));
    },
    companyOptions() {
      return this.companies.map((company) => ({
        label: company.name,
        value: company.id,
      }));
    },
    managerOptions() {
      return this.employees.map((employee) => ({
        label: `${employee.firstName} ${employee.lastName}`,
        value: employee.id,
      }));
    },
  },
  methods: {
    async viewProjectEmployees(project) {
      this.showEmployeesInProjectModal = true;
      this.selectedProject = project;
      this.projectEmployees = [];

      try {
        const response = await fetch(
          `http://localhost:5116/api/project/${project.id}/employees`
        );

        if (response.status === 404) {
          console.warn("Сотрудники не найдены");
          this.projectEmployees = [];
          return;
        }

        if (!response.ok) throw new Error("Ошибка загрузки сотрудников");

        this.projectEmployees = await response.json();
      } catch (error) {
        console.error(error);
        this.projectEmployees = [];
      }
    },
    openAddEmployeeModal(project) {
      this.selectedProject = project;
      this.showAddEmployeeModal = true;
    },
    async addEmployeeToProject() {
      if (!this.selectedProject || !this.selectedEmployeeId) return;

      try {
        const response = await fetch(
          `http://localhost:5116/api/project/${this.selectedProject.id}/employees/${this.selectedEmployeeId}`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              projectId: this.selectedProject.id,
              employeeId: this.selectedEmployeeId,
            }),
          }
        );

        if (!response.ok) throw new Error("Ошибка при добавлении исполнителя");

        this.viewProjectEmployees(this.selectedProject);
        this.showAddEmployeeModal = false;
      } catch (error) {
        console.error(error);
      }
    },
    async fetchProjects() {
      try {
        const response = await fetch("http://localhost:5116/api/project");
        this.projects = await response.json();
      } catch (error) {
        console.error("Ошибка при загрузке проектов:", error);
      }
    },
    formatDate(date) {
      if (!date) return "";
      return new Date(date).toLocaleDateString();
    },
    async fetchCompanies() {
      try {
        const response = await fetch("http://localhost:5116/api/company");
        this.companies = await response.json();
      } catch (error) {
        console.error("Ошибка при загрузке компаний:", error);
      }
    },
    async fetchEmployees() {
      try {
        const response = await fetch("http://localhost:5116/api/employee");
        this.employees = await response.json();
      } catch (error) {
        console.error("Ошибка при загрузке сотрудников:", error);
      }
    },
    async addProject() {
      const projectToSend = {
        ...this.newProject,
        startDate: new Date(this.newProject.startDate)
          .toISOString()
          .split("T")[0],
        endDate: new Date(this.newProject.endDate).toISOString().split("T")[0],
      };

      try {
        const response = await fetch("http://localhost:5116/api/project", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(projectToSend),
        });
        if (!response.ok) throw new Error("Ошибка при добавлении проекта");
        this.fetchProjects();
      } catch (error) {
        console.error(error);
      }
    },
    editProject(project) {
      this.editingProject = {
        ...project,
        customerCompanyId:
          this.companies.find(
            (company) => company.name === project.customerCompanyName
          )?.id || null,
        executorCompanyId:
          this.companies.find(
            (company) => company.name === project.executorCompanyName
          )?.id || null,
        projectManagerId:
          this.employees.find(
            (employee) =>
              `${employee.firstName} ${employee.lastName}` ===
              project.projectManagerName
          )?.id || null,
      };
    },
    async updateProject() {
      const projectToSend = {
        ...this.editingProject,
        startDate: new Date(this.editingProject.startDate)
          .toISOString()
          .split("T")[0],
        endDate: new Date(this.editingProject.endDate)
          .toISOString()
          .split("T")[0],
      };
      try {
        const response = await fetch(
          `http://localhost:5116/api/project/${this.editingProject.id}`,
          {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(projectToSend),
          }
        );
        if (!response.ok) throw new Error("Ошибка при обновлении проекта");
        this.fetchProjects();
        this.cancelEdit();
      } catch (error) {
        console.error(error);
      }
    },
    cancelEdit() {
      this.editingProject = null;
    },
    confirmDelete(projectId) {
      this.projectToDelete = projectId;
      this.showDeleteModal = true;
    },
    async deleteProject() {
      try {
        const response = await fetch(
          `http://localhost:5116/api/project/${this.projectToDelete}`,
          { method: "DELETE" }
        );
        if (!response.ok) throw new Error("Ошибка при удалении проекта");
        this.fetchProjects();
        this.showDeleteModal = false;
      } catch (error) {
        console.error(error);
      }
    },
    async deleteEmployeeFromProject(employeeId) {
      try {
        const response = await fetch(
          `http://localhost:5116/api/project/${this.selectedProject.id}/employees/${employeeId}`,
          { method: "DELETE" }
        );
        if (!response.ok)
          throw new Error("Ошибка при удалении сотрудника из проекта");
        this.viewProjectEmployees(this.selectedProject);
      } catch (error) {
        console.error(error);
      }
    },
  },
  mounted() {
    this.fetchProjects();
    this.fetchCompanies();
    this.fetchEmployees();
  },
};
</script>

<style scoped>
.container {
  display: flex;
  gap: 20px;
}
</style>
