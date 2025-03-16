<template>
  <div>
    <h1 style="margin-bottom: 15px;">{{ translatedPageTitle }}</h1>
    <a-button @click="refreshData" style="margin-bottom: 15px;margin-right: 15px;">{{ $t('message.refreshData') }}</a-button>
    <a-button type="primary" @click="showModal" style="margin-bottom: 15px;">{{ $t('message.insertDepartment') }}</a-button>
    <a-table :columns="columns" :data-source="departments" :loading="loading" :pagination="pagination" @change="handleTableChange" @sorterChange="handleSorterChange" bordered>
      <template #bodyCell="{ column, record }">
        <template v-if="column.key === 'operation'">
          <a-button @click="editDepartment(record)" style="margin-right: 15px;">{{ $t('message.edit') }}</a-button>
            <a-popconfirm :title="t('message.areYouSureToDeleteRecord')" @confirm="handleDelete(record)">
            <a-button danger>{{ $t('message.delete') }}</a-button>
          </a-popconfirm>
        </template>
        <template v-else-if="column.key === DepartmentFields.CREATIONDATE">
          {{ formatDate(record[DepartmentFields.CREATIONDATE]) }}
        </template>
      </template>
    </a-table>

    <a-modal :open="modalVisible" :title="modalTitle" @ok="handleModalOk" @cancel="handleModalCancel" :confirm-loading="confirmLoading">
      <a-form :model="form" :rules="rules" ref="formRef">
        <a-form-item :label="departmentNoLabel" :name="DepartmentFields.NUMBER">
          <a-input v-model:value="form[DepartmentFields.NUMBER]" type="hidden" />
          <span>{{ form[DepartmentFields.NUMBER] }}</span>
        </a-form-item>
        <a-form-item :label="departmentNameLabel" :name="DepartmentFields.NAME">
          <a-input v-model:value="form[DepartmentFields.NAME]" />
        </a-form-item>
        <a-form-item :label="departmentDescLabel" :name="DepartmentFields.DESCRIPTION">
          <a-textarea v-model:value="form[DepartmentFields.DESCRIPTION]" />
        </a-form-item>
        <a-form-item :label="departmentLeaderLabel" :name="DepartmentFields.LEADER">
          <a-select
            v-model:value="form[DepartmentFields.LEADER]"
            :options="leaderOptions"
            :placeholder="t('message.pleaseInputDepartmentLeader')"
          />
        </a-form-item>
        <a-form-item :label="departmentParentLabel" :name="DepartmentFields.PARENT">
          <a-select
            v-model:value="form[DepartmentFields.PARENT]"
            :options="departmentOptions"
            :placeholder="t('message.pleaseInputDepartmentParent')"
          />
        </a-form-item>
        <a-form-item :label="departmentDateLabel" :name="DepartmentFields.CREATIONDATE">
          <a-date-picker v-model:value="form[DepartmentFields.CREATIONDATE]" />
        </a-form-item>
      </a-form>
    </a-modal>
  </div>
</template>

<script setup>
import { ref, onMounted, computed, reactive } from 'vue';
import { useRoute } from 'vue-router';
import { getPageTitle } from '@/utils/pageTitle';
import { fetchDepartments, addDepartment, updateDepartment, deleteDepartment } from '@/api/departmentapi';
import { 
  DepartmentFields, 
  initialFormValues, 
  getColumns, 
  getFormRules 
} from '@/entities/department.entity';
import { 
  EmployeeFields
} from '@/entities/employee.entity';
import { fetchEmployees } from '@/api/employeeapi';
import { formatDate,showNotification } from '@/utils/index';
import { useI18n } from 'vue-i18n';
import generateSnowflakeId from '@/utils/snowflake';
import moment from 'moment';

const { t } = useI18n();
const route = useRoute();
const pageTitleKey = computed(() => getPageTitle(route.path));
const translatedPageTitle = computed(() => t(pageTitleKey.value));
const loading = ref(false);
const departments = ref([]);
const modalVisible = ref(false);
const modalTitle = ref('');
const confirmLoading = ref(false);
const formRef = ref(null);
const sortedInfo = ref({ order: null, columnKey: null });
const departmentOptions = ref([]);
const leaderOptions = ref([]);

const form = reactive({ ...initialFormValues });

const rules = getFormRules(t);

const departmentNoLabel = computed(() => t('message.departmentNo'));
const departmentNameLabel = computed(() => t('message.departmentName'));
const departmentDescLabel = computed(() => t('message.departmentDesc'));
const departmentLeaderLabel = computed(() => t('message.departmentLeader'));
const departmentParentLabel = computed(() => t('message.departmentParent'));
const departmentDateLabel = computed(() => t('message.departmentDate'));

const columns = computed(() => getColumns(t));

const pagination = reactive({
  current: 1,
  pageSize: 15,
  total: 0,
  showSizeChanger: true,
  pageSizeOptions: ['15', '20', '50'],
  showTotal: (total) => `共 ${total} 条`
});

const fetchDepartmentData = async () => {
  loading.value = true;
  try {
    const result = await fetchDepartments({
      page: pagination.current,
      pageSize: pagination.pageSize,
      [DepartmentFields.IS_DELETE]: 0
    });
    if (result?.listSource) {
      departments.value = result.listSource.map(item => ({
      [DepartmentFields.NUMBER]: item[DepartmentFields.NUMBER],
      [DepartmentFields.NAME]: item[DepartmentFields.NAME],
      [DepartmentFields.DESCRIPTION]: item[DepartmentFields.DESCRIPTION],
      [DepartmentFields.LEADER]: item[DepartmentFields.LEADER],
      [DepartmentFields.LEADERNAME]: item[DepartmentFields.LEADERNAME],
      [DepartmentFields.PARENT]: item[DepartmentFields.PARENT],
      [DepartmentFields.PARENTNAME]: item[DepartmentFields.PARENTNAME],
      [DepartmentFields.CREATIONDATE]: item[DepartmentFields.CREATIONDATE],
      [DepartmentFields.IS_DELETE]: item[DepartmentFields.IS_DELETE]
    }));
    pagination.total = result.total;
    } else {
      throw new Error('数据格式错误');
    }
  } catch (error) {
    showNotification('error', t('message.operationTitle'), t('message.pleaseTryAgainLater'));
  } finally {
    loading.value = false;
  }
};

const fetchSelectDepartments = async () => {
  try {
    const result = await fetchDepartments({
      [DepartmentFields.IS_DELETE]: 0
    });
    departmentOptions.value = result.listSource.map((item) => ({
      label: item[DepartmentFields.NAME],
      value: item[DepartmentFields.NUMBER],
    }));
  } catch (error) {
    showNotification('error', t('message.fetchDataFailed'), t('message.pleaseTryAgainLater'));
  }
};

const fetchSelectLeaders = async () => {
  try {
    const result = await fetchEmployees({
      [EmployeeFields.IS_DELETE]: 0,
      page: 1,
      pageSize: 9999
    });
    leaderOptions.value = result.listSource.map((item) => ({
      label: item[EmployeeFields.NAME],
      value: item[EmployeeFields.NUMBER],
    }));
  } catch (error) {
    showNotification('error', t('message.fetchDataFailed'), t('message.pleaseTryAgainLater'));
  }
};

onMounted(() => {
  fetchDepartmentData();
  fetchSelectDepartments();
  fetchSelectLeaders();
});

const showModal = () => {
  modalVisible.value = true;
  modalTitle.value = t('message.insertDepartment');
  form[DepartmentFields.NUMBER] = generateSnowflakeId({
      prefix: 'D-',
      separator: null,
    });
  form[DepartmentFields.NAME] = '';
  form[DepartmentFields.DESCRIPTION] = '';
  form[DepartmentFields.LEADER] = '';
  form[DepartmentFields.PARENT] = '';
  form[DepartmentFields.CREATIONDATE] = null;
  form.modifystatus = 'insert';
};

const refreshData = () => 
{
  fetchDepartmentData();
};

const editDepartment = (record) => {
  modalVisible.value = true;
  modalTitle.value = t('message.updateDepartment');
  form[DepartmentFields.NUMBER] = record[DepartmentFields.NUMBER];
  form[DepartmentFields.NAME] = record[DepartmentFields.NAME];
  form[DepartmentFields.DESCRIPTION] = record[DepartmentFields.DESCRIPTION];
  form[DepartmentFields.LEADER] = record[DepartmentFields.LEADER];
  form[DepartmentFields.PARENT] = record[DepartmentFields.PARENT];
  form[DepartmentFields.CREATIONDATE] = record[DepartmentFields.CREATIONDATE] ? moment(record[DepartmentFields.CREATIONDATE]) : null;
  form.modifystatus = 'update';
};

const handleModalOk = async () => {
  try {
    await formRef.value.validate();
    confirmLoading.value = true;
    if (form.modifystatus === 'update') {
      await updateDepartment({ ...form,[DepartmentFields.CREATIONDATE]:form[DepartmentFields.CREATIONDATE]?form[DepartmentFields.CREATIONDATE].format('YYYY-MM-DD'):null});
      showNotification('success', t('message.operationTitle') , t('message.updateSuccess'));
    } else {
      await addDepartment({ ...form,[DepartmentFields.CREATIONDATE]:form[DepartmentFields.CREATIONDATE]?form[DepartmentFields.CREATIONDATE].format('YYYY-MM-DD'):null});
      showNotification('success', t('message.operationTitle') , t('message.addSuccess'));
    }
    modalVisible.value = false;
    fetchDepartmentData();
  } catch (error) {
    showNotification('error', t('message.operationTitle'), t('message.pleaseTryAgainLater'));
  } finally {
    confirmLoading.value = false;
  }
};

const handleModalCancel = () => {
  modalVisible.value = false;
};

const handleDelete = async (record) => {
  try {
    record[DepartmentFields.IS_DELETE] = 1;
    await deleteDepartment(record);
    showNotification('success', t('message.operationTitle'), t('message.deleteSuccess'));
    fetchDepartmentData();
  } catch (error) {
    console.error('Delete error:', error);
    showNotification('error', t('message.operationTitle'), t('message.pleaseTryAgainLater'));
  }
};

const handleTableChange = (newPagination) => {
  pagination.current = newPagination.current;
  pagination.pageSize = newPagination.pageSize;
  fetchDepartmentData();
};

const handleSorterChange = (pagination, filters, sorter) => {
  sortedInfo.value = sorter;
};
</script>