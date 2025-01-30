<template>
  <div>
    <h1 style="margin-bottom: 15px;">{{ translatedPageTitle }}</h1>
    <a-button type="primary" @click="showModal" style="margin-bottom: 15px;">{{ $t('message.insertDepartment') }}</a-button>
    <a-table :columns="columns" :data-source="departments" :loading="loading" :pagination="pagination" @change="handleTableChange" @sorterChange="handleSorterChange" bordered>
      <template #bodyCell="{ column, record }">
        <template v-if="column.key === 'operation'">
          <a-button @click="editDepartment(record)" style="margin-right: 15px;">{{ $t('message.edit') }}</a-button>
            <a-popconfirm :title="t('message.areYouSureToDeleteDepartment')" @confirm="handleDelete(record)">
            <a-button danger>{{ $t('message.delete') }}</a-button>
          </a-popconfirm>
        </template>
        <template v-else-if="column.key === 'dept_date'">
          {{ formatDate(record.dept_date) }}
        </template>
      </template>
    </a-table>

    <a-modal :open="modalVisible" :title="modalTitle" @ok="handleModalOk" @cancel="handleModalCancel" :confirm-loading="confirmLoading">
      <a-form :model="form" :rules="rules" ref="formRef">
        <a-form-item :label="departmentNoLabel" name="dept_no">
          <a-input v-model:value="form.dept_no" type="hidden" />
          <span>{{ form.dept_no }}</span>
        </a-form-item>
        <a-form-item :label="departmentNameLabel" name="dept_name">
          <a-input v-model:value="form.dept_name" />
        </a-form-item>
        <a-form-item :label="departmentDescLabel" name="dept_desc">
          <a-textarea v-model:value="form.dept_desc" />
        </a-form-item>
        <a-form-item :label="departmentLeaderLabel" name="dept_leader">
          <a-select
            v-model:value="form.dept_leader"
            :options="leaderOptions"
            placeholder="Please select department leader"
          />
        </a-form-item>
        <a-form-item :label="departmentParentLabel" name="dept_parent">
          <a-select
            v-model:value="form.dept_parent"
            :options="departmentOptions"
            placeholder="Please select department parent"
          />
        </a-form-item>
        <a-form-item :label="departmentDateLabel" name="dept_date">
          <a-date-picker v-model:value="form.dept_date" />
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
import { fetchWorkers } from '@/api/workerapi';
import { message } from 'ant-design-vue';
import { formatDate } from '@/utils/index';
import { useI18n } from 'vue-i18n';
import { getListNewId } from '@/utils/generateId';
import moment from 'moment';

const { t, locale } = useI18n();
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

const form = reactive({
  dept_no: null,
  dept_name: '',
  dept_desc: '',
  dept_leader: '',
  dept_parent: '',
  dept_date: null,
  modifystatus: '',
});

const rules = {
  dept_name: [{ required: true, message: t('message.pleaseInputDepartmentName'), trigger: 'blur' }],
};

const departmentNoLabel = computed(() => t('message.departmentNo'));
const departmentNameLabel = computed(() => t('message.departmentName'));
const departmentDescLabel = computed(() => t('message.departmentDesc'));
const departmentLeaderLabel = computed(() => t('message.departmentLeader'));
const departmentParentLabel = computed(() => t('message.departmentParent'));
const departmentDateLabel = computed(() => t('message.departmentDate'));

const columns = computed(() => [
  {
    title: t('message.departmentNo'),
    dataIndex: 'dept_no',
    key: 'dept_no',
    sorter: (a, b) => a.dept_no.localeCompare(b.dept_no),
    defaultSortOrder: 'ascend'
  },
  {
    title: t('message.departmentName'),
    dataIndex: 'dept_name',
    key: 'dept_name',
  },
  {
    title: t('message.departmentDesc'),
    dataIndex: 'dept_desc',
    key: 'dept_desc',
  },
  {
    title: t('message.departmentLeader'),
    dataIndex: 'leader_name',
    key: 'leader_name',
  },
  {
    title: t('message.departmentParent'),
    dataIndex: 'parent_name',
    key: 'parent_name',
  },
  {
    title: t('message.departmentDate'),
    dataIndex: 'dept_date',
    key: 'dept_date',
  },
  {
    title: t('message.operation'),
    key: 'operation',
  },
]);

const pagination = reactive({
  current: 1,
  pageSize: 10,
  total: 0,
});

const fetchDepartmentData = async () => {
  loading.value = true;
  try {
    const result = await fetchDepartments({
      page: pagination.current,
      pageSize: pagination.pageSize,
    });
    departments.value = result;
    pagination.total = result.length;
  } catch (error) {
    window.$notification('error', t('message.operationTitle'), t('message.pleaseTryAgainLater'));
  } finally {
    loading.value = false;
  }
};

const fetchSelectDepartments = async () => {
  try {
    const result = await fetchDepartments();
    departmentOptions.value = result.map((item) => ({
      label: item.dept_name,
      value: item.dept_no,
    }));
  } catch (error) {
    window.$notification('error', t('message.fetchDataFailed'), t('message.pleaseTryAgainLater'));
  }
};

const fetchSelectLeaders = async () => {
  try {
    const result = await fetchWorkers();
    leaderOptions.value = result.map((item) => ({
      label: item.WorkerName,
      value: item.WorkerId,
    }));
  } catch (error) {
    window.$notification('error', t('message.fetchDataFailed'), t('message.pleaseTryAgainLater'));
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
  form.dept_no = getListNewId('D', 3, 1)[0];
  form.dept_name = '';
  form.dept_desc = '';
  form.dept_leader = '';
  form.dept_parent = '';
  form.modifystatus = 'insert';
};

const editDepartment = (record) => {
  modalVisible.value = true;
  modalTitle.value = t('message.updateDepartment');
  form.dept_no = record.dept_no;
  form.dept_name = record.dept_name;
  form.dept_desc = record.dept_desc;
  form.dept_leader = record.dept_leader;
  form.dept_parent = record.dept_parent;
  form.dept_date = record.dept_date ? moment(record.dept_date) : null;
  form.modifystatus = 'update';
};

const handleModalOk = async () => {
  try {
    await formRef.value.validate();
    confirmLoading.value = true;
    if (form.modifystatus === 'update') {
      await updateDepartment({ ...form,dept_date:form.dept_date?form.dept_date.format('YYYY-MM-DD'):null});
      window.$notification('success', t('message.operationTitle') , t('message.updateSuccess'));
    } else {
      await addDepartment({ ...form,dept_date:form.dept_date?form.dept_date.format('YYYY-MM-DD'):null});
      window.$notification('success', t('message.operationTitle') , t('message.addSuccess'));
    }
    modalVisible.value = false;
    fetchDepartmentData();
  } catch (error) {
    window.$notification('error', t('message.operationTitle'), t('message.pleaseTryAgainLater'));
  } finally {
    confirmLoading.value = false;
  }
};

const handleModalCancel = () => {
  modalVisible.value = false;
};

const handleDelete = async (record) => {
  try {
    await deleteDepartment(record);
    window.$notification('success', t('message.operationTitle'), t('message.deleteSuccess'));
    fetchDepartmentData();
  } catch (error) {
    console.error('Delete error:', error);
    window.$notification('error', t('message.operationTitle'), t('message.pleaseTryAgainLater'));
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