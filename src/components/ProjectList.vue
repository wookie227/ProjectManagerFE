<template>
  <div class="container">
    <div class="projects-table">
      <n-button
        type="primary"
        @click="showAddProjectModal = true"
        style="margin-bottom: 8px; margin-top: 8px"
        >Добавить проект</n-button
      >
      <n-modal v-model:show="showAddProjectModal" preset="dialog">
        <n-card title="Добавить проект" class="mb-4">
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
      </n-modal>
      <n-modal v-model:show="showEditProjectModal" preset="dialog">
        <n-card title="Редактировать проект" class="mb-4">
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
              type="date"
              placeholder="Дата начала"
            />
            <n-date-picker
              v-model:value="editingProject.endDate"
              type="date"
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
      </n-modal>

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
            <n-th>Загрузка</n-th>
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
            <n-td>{{
              project.projectManagerName && project.projectManagerName.trim()
                ? project.projectManagerName
                : "Менеджера нет"
            }}</n-td>
            <n-td class="">
              <n-button
                size="small"
                @click="editProject(project)"
                style="margin-right: 8px"
                >Редактировать</n-button
              >
              <n-button
                size="small"
                type="error"
                @click="confirmDelete(project.id)"
                style="margin-right: 8px"
                >Удалить</n-button
              >
              <n-button
                size="small"
                type="info"
                @click="viewProjectEmployees(project)"
                style="margin-right: 8px"
                >Посмотреть исполнителей</n-button
              >
              <n-button
                size="small"
                type="success"
                @click="openAddEmployeeModal(project)"
                style="margin-right: 8px"
                >Добавить исполнителя</n-button
              >
              <n-button
                size="small"
                type="success"
                @click="confirmUploadFileModal(project.id)"
                >Загрузить файл</n-button
              >
            </n-td>
            <n-td v-if="project.filePath">
              <n-button
                size="small"
                type="primary"
                @click="downloadFile(project)"
              >
                Скачать
              </n-button>
            </n-td>
            <n-td v-else> No File </n-td>
          </n-tr>
        </n-tbody>
      </n-table>
      <n-modal v-model:show="showUploadFileModal" preset="dialog">
        <n-card title="Загрузить файл"></n-card>
        <n-upload directory-dnd="true" :on-change="handleFileChange">
          <n-upload-dragger>
            <n-text style="font-size: 16px">
              Click or drag a file to this area to upload
            </n-text>
          </n-upload-dragger>
        </n-upload>
        <n-button type="primary" @click="uploadFile">Загрузить</n-button>
      </n-modal>
      <n-modal v-model:show="showDeleteModal" preset="dialog">
        <n-card title="Подтверждение удаления" style="width: 20vw">
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
import { useMessage } from "naive-ui";
export default {
  setup() {
    const message = useMessage();
    return { message };
  },
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
      showAddProjectModal: false,
      showEditProjectModal: false,
      showUploadFileModal: false,
      fileToUpload: null,
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
    confirmUploadFileModal(projectId) {
      this.showUploadFileModal = true;
      this.selectedProjectId = projectId;
    },
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
        this.message.success("Ошибка при загрузке сотрудников!");
        console.error(error);
        this.projectEmployees = [];
      }
    },
    async downloadFile(project) {
      this.selectedProject = project;
      console.log(this.selectedProject.id);
      try {
        const response = await fetch(
          `http://localhost:5116/api/project/${this.selectedProject.id}/download`
        );
        if (!response.ok) throw new Error("Ошибка скачивания файла");

        const blob = await response.blob();
        console.log(blob);

        let filename = this.selectedProject.filePath
          ? this.selectedProject.filePath.split("\\").pop()
          : "file";

        console.log("Скачивание файла с именем:", filename);

        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
      } catch (error) {
        this.message.error("Ошибка при загрузке файла!");
        console.error("Ошибка скачивания файла:", error);
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
        this.message.success("Сотрудник успешно добавлен к проекту!");
        this.viewProjectEmployees(this.selectedProject);
        this.showAddEmployeeModal = false;
      } catch (error) {
        this.message.error("Ошибка при добавлении сотрудника к проекту!");
        console.error(error);
      }
    },
    async fetchProjects() {
      try {
        const response = await fetch("http://localhost:5116/api/project");
        this.projects = await response.json();
      } catch (error) {
        this.message.error("Ошибка при загрузке проектов!");
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
        this.message.error("Ошибка при загрузке компаний!");
        console.error("Ошибка при загрузке компаний:", error);
      }
    },
    async fetchEmployees() {
      try {
        const response = await fetch("http://localhost:5116/api/employee");
        this.employees = await response.json();
      } catch (error) {
        this.message.error("Ошибка при загрузке сотрудников!");
        console.error("Ошибка при загрузке сотрудников:", error);
      }
    },
    async addProject() {
      const projectToSend = {
        ...this.newProject,
        startDate: new Date(this.newProject.startDate)
          .toISOString()
          .split("T")[0],
        endDate: this.newProject.endDate
          ? new Date(this.newProject.endDate).toISOString().split("T")[0]
          : null,
      };

      try {
        const response = await fetch("http://localhost:5116/api/project", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(projectToSend),
        });
        this.message.success("Проект успешно добавлен!");
        this.fetchProjects();
      } catch (error) {
        this.message.error("Ошибка при добавлении проекта!");
        console.error(error);
      }
      this.showAddProjectModal = false;
    },
    handleFileChange(file) {
      this.fileToUpload = file.file.file;
    },
    async uploadFile() {
      if (!this.fileToUpload) return;
      console.log("Тип файла:", this.fileToUpload instanceof File);
      const reader = new FileReader();
      reader.readAsDataURL(this.fileToUpload);

      reader.onload = async () => {
        const base64String = reader.result.split(",")[1];

        const name = this.fileToUpload.name;

        const payload = {
          file: base64String,
          name: name,
        };
        console.log(
          "http://localhost:5116/api/project/${this.selectedProjectId}/upload"
        );
        try {
          const response = await fetch(
            `http://localhost:5116/api/project/${this.selectedProjectId}/upload`,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify(payload),
            }
          );
          if (!response.ok) throw new Error("Ошибка загрузки файла");
          this.message.success("Файл успешно добавлен");
          this.fetchProjects();
          this.showUploadFileModal = false;
          this.fileToUpload = null;
        } catch (error) {
          this.message.error("Ошибка при загрузке файла!");
          console.error(error);
        }
      };

      reader.onerror = (error) => {
        console.error("Ошибка чтения файла", error);
      };
    },

    editProject(project) {
      this.showEditProjectModal = true;
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
        this.message.success("Проект обновлен успешно!");
        this.fetchProjects();
      } catch (error) {
        this.message.error("Ошибка при редактировании проекта!");
        console.error(error);
      }
      this.showEditProjectModal = false;
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
        this.message.success("Проект успешно удален!");
        this.fetchProjects();
        this.showDeleteModal = false;
      } catch (error) {
        this.message.error("Ошибка при удалении проекта!");
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
        this.message.success("Сотрудник успешно удален из проекта!");
        this.viewProjectEmployees(this.selectedProject);
      } catch (error) {
        this.message.error("Ошибка при удалении сотрудника из проекта!");
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
