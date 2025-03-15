<template>
  <div>
    <h1 style="margin-bottom: 15px;">{{ translatedPageTitle }}</h1>
    <a-button @click="refreshData" style="margin-bottom: 15px;margin-right: 15px;">{{ $t('message.refreshData') }}</a-button>
    <a-button type="primary" @click="showModal" style="margin-bottom: 15px;">{{ $t('message.insertStaff') }}</a-button>
    <a-table :columns="filteredColumns" :data-source="staffs" :loading="loading" :pagination="pagination" @change="handleTableChange" @sorterChange="handleSorterChange" bordered>
      <template #bodyCell="{ column, record }">
        <template v-if="column.key === 'operation'">
          <a-button @click="editStaff(record)" style="margin-right: 15px;">{{ $t('message.edit') }}</a-button>
            <a-popconfirm :title="t('message.areYouSureToDeleteRecord')" @confirm="handleDelete(record)">
            <a-button danger>{{ $t('message.delete') }}</a-button>
          </a-popconfirm>
        </template>
        <template v-else-if="column.key === 'WorkerBirthday'">
          {{ formatDate(record.WorkerBirthday) }}
        </template>
        <template v-else-if="column.key === 'WorkerTime'">
          {{ formatDate(record.WorkerTime) }}
        </template>
      </template>
    </a-table>

    <a-modal :open="modalVisible" :title="modalTitle" @ok="handleModalOk" @cancel="handleModalCancel" :confirm-loading="confirmLoading">
      <a-form :model="form" :rules="rules" ref="formRef">
        <a-form-item :label="staffNoLabel" name="WorkerId">
          <a-input v-model:value="form.WorkerId" type="hidden" />
          <span>{{ form.WorkerId }}</span>
        </a-form-item>
        <a-form-item :label="staffNameLabel" name="WorkerName">
          <a-input v-model:value="form.WorkerName" />
        </a-form-item>
        <a-form-item :label="staffSexLabel" name="WorkerSex">
          <a-radio-group v-model:value="form.WorkerSex">
            <a-radio-button :value=0>女</a-radio-button>
            <a-radio-button :value=1>男</a-radio-button>
          </a-radio-group>
        </a-form-item>
        <a-form-item :label="staffBirthdayLabel" name="WorkerBirthday">
          <a-date-picker v-model:value="form.WorkerBirthday" />
        </a-form-item>
        <a-form-item :label="staffTimeLabel" name="WorkerTime">
          <a-date-picker v-model:value="form.WorkerTime" />
        </a-form-item>
        <a-form-item :label="staffNationLabel" name="WorkerNation">
          <a-select
            v-model:value="form.WorkerNation"
            :options="staffNationOptions"
            :placeholder="t('message.pleaseInputStaffNation')"
          />
        </a-form-item>
        <a-form-item :label="staffFaceLabel" name="WorkerFace">
          <a-select
            v-model:value="form.WorkerFace"
            :options="staffFeaturesOptions"
            :placeholder="t('message.pleaseInputStaffFace')"
          />
        </a-form-item>
        <a-form-item :label="staffEducationLabel" name="WorkerEducation">
          <a-select
            v-model:value="form.WorkerEducation"
            :options="staffQualificationOptions"
            :placeholder="t('message.pleaseInputStaffEducation')"
          />
        </a-form-item>
        <a-form-item :label="staffDepartmentLabel" name="WorkerClub">
          <a-select
            v-model:value="form.WorkerClub"
            :options="staffDepartmentOptions"
            :placeholder="t('message.pleaseInputStaffDepartment')"
          />
        </a-form-item>
        <a-form-item :label="staffPositionLabel" name="WorkerPosition">
          <a-select
            v-model:value="form.WorkerPosition"
            :options="staffPositionOptions"
            :placeholder="t('message.pleaseInputStaffPosition')"
          />
        </a-form-item>
        <a-form-item :label="staffCardIDLabel" name="CardId">
          <a-input v-model:value="form.CardId" />
        </a-form-item>
        <a-form-item :label="staffTelLabel" name="WorkerTel">
          <a-input v-model:value="form.WorkerTel" />
        </a-form-item>
        <a-form-item :label="staffAddressLabel" name="WorkerAddress">
          <a-input v-model:value="form.WorkerAddress" />
        </a-form-item>
      </a-form>
    </a-modal>
  </div>
</template>

<script setup>
import { ref, onMounted, computed, reactive } from 'vue';
import { Select } from 'ant-design-vue';
import { useRoute } from 'vue-router';
import { getPageTitle } from '@/utils/pageTitle';
import { fetchEmployees, addEmployee, updateEmployee } from '@/api/employeeapi';
import { fetchPositions } from '@/api/positionapi';
import { fetchQualifications } from '@/api/qualificationapi';
import { fetchDepartments } from '@/api/departmentapi';
import { fetchNations } from '@/api/nationapi';
import { fetchWorkerFeatures } from '@/api/workerfeatureapi';
import { formatDate,showNotification } from '@/utils/index';
import { useI18n } from 'vue-i18n';
import generateSnowflakeId from '@/utils/snowflake';
import moment from 'moment';

const { t } = useI18n();
const route = useRoute();
const pageTitleKey = computed(() => getPageTitle(route.path));
const translatedPageTitle = computed(() => t(pageTitleKey.value));
const loading = ref(false);
const staffs = ref([]);
const modalVisible = ref(false);
const modalTitle = ref('');
const confirmLoading = ref(false);
const formRef = ref(null);
const sortedInfo = ref({ order: null, columnKey: null });
const staffNationOptions = ref([]);
const staffFeaturesOptions = ref([]);
const staffQualificationOptions = ref([]);
const staffDepartmentOptions = ref([]);
const staffPositionOptions = ref([]);

const form = reactive({
  WorkerId: null,
  WorkerName: '',
  WorkerSex: null,
  WorkerBirthday: '',
  WorkerNation: null,
  WorkerFace: null,
  WorkerEducation: null,
  WorkerClub: null,
  WorkerPosition: null,
  WorkerPwd:'',
  CardId: '',
  WorkerTel: '',
  WorkerAddress: '',
  DataInsUsr: '',
  DataInsDate: null,
  DataChgUsr: '',
  DataChgDate: null,
  modifystatus: '',
});

const rules = {
  WorkerName: [{ required: true, message: t('message.pleaseInputStaffName'), trigger: 'blur' }],
  WorkerSex: [{ required: true, message: t('message.pleaseInputStaffSex'), trigger: 'blur' }],
  WorkerTel: [{ required: true, message: t('message.pleaseInputStaffTel'), trigger: 'blur' }],
  WorkerEducation: [{ required: true, message: t('message.pleaseInputStaffEducation'), trigger: 'blur' }],
  WorkerFace: [{ required: true, message: t('message.pleaseInputStaffFace'), trigger: 'blur' }],
  WorkerNation: [{ required: true, message: t('message.pleaseInputStaffNation'), trigger: 'blur' }],
  WorkerClub: [{ required: true, message: t('message.pleaseInputStaffDepartment'), trigger: 'blur' }],
  WorkerPosition: [{ required: true, message: t('message.pleaseInputStaffPosition'), trigger: 'blur' }],
  CardId: [{ required: true, message: t('message.pleaseInputStaffCardID'), trigger: 'blur' }],
  WorkerAddress: [{ required: true, message: t('message.pleaseInputStaffAddress'), trigger: 'blur' }],
  WorkerBirthday: [{ required: true, message: t('message.pleaseInputStaffBirthday'), trigger: 'blur' }],
  WorkerTime: [{ required: true, message: t('message.pleaseInputStaffTime'), trigger: 'blur' }],
};

const staffNoLabel = computed(() => t('message.staffId'));
const staffNameLabel = computed(() => t('message.staffName'));
const staffSexLabel = computed(() => t('message.staffSex'));
const staffNationLabel = computed(() => t('message.staffNation'));
const staffTelLabel = computed(() => t('message.staffTel'));
const staffEducationLabel = computed(() => t('message.staffEducation'));
const staffDepartmentLabel = computed(() => t('message.staffDepartment'));
const staffPositionLabel = computed(() => t('message.staffPosition'));
const staffBirthdayLabel = computed(() => t('message.staffBirthday'));
const staffAddressLabel = computed(() => t('message.staffAddress'));
const staffFaceLabel = computed(() => t('message.staffFace'));
const staffTimeLabel = computed(() => t('message.staffTime'));
const staffCardIDLabel = computed(() => t('message.staffCardID'));

const columns = computed(() => [
  {
    title: t('message.staffId'),
    dataIndex: 'WorkerId',
    key: 'WorkerId',
    sorter: (a, b) => a.WorkerId.localeCompare(b.WorkerId),
    defaultSortOrder: 'ascend'
  },
  {
    title: t('message.staffName'),
    dataIndex: 'WorkerName',
    key: 'WorkerName',
  },
  {
    title: t('message.staffSex'),
    dataIndex: 'WorkerSex',
    key: 'WorkerSex',
    hidden: true,
  },
  {
    title: t('message.staffSex'),
    dataIndex: 'WorkerSexName',
    key: 'WorkerSexName',
  },
  {
    title: t('message.staffBirthday'),
    dataIndex: 'WorkerBirthday',
    key: 'WorkerBirthday',
  },
  {
    title: t('message.staffEducation'),
    dataIndex: 'WorkerEducation',
    key: 'WorkerEducation',
    hidden: true,
  },
  {
    title: t('message.staffEducation'),
    dataIndex: 'EducationName',
    key: 'EducationName',
  },
  {
    title: t('message.staffNation'),
    dataIndex: 'WorkerNation',
    key: 'WorkerNation',
    hidden: true
  },
  {
    title: t('message.staffNation'),
    dataIndex: 'NationName',
    key: 'NationName'
  },
  {
    title: t('message.staffDepartment'),
    dataIndex: 'WorkerClub',
    key: 'WorkerClub',
    hidden: true
  },
  {
    title: t('message.staffDepartment'),
    dataIndex: 'ClubName',
    key: 'ClubName'
  },
  {
    title: t('message.staffPosition'),
    dataIndex: 'WorkerPosition',
    key: 'WorkerPosition',
    hidden: true
  },
  {
    title: t('message.staffPosition'),
    dataIndex: 'PositionName',
    key: 'PositionName'
  },
  {
    title: t('message.staffCardID'),
    dataIndex: 'CardId',
    key: 'CardId'
  },
  {
    title: t('message.staffTel'),
    dataIndex: 'WorkerTel',
    key: 'WorkerTel'
  },
  {
    title: t('message.staffAddress'),
    dataIndex: 'WorkerAddress',
    key: 'WorkerAddress'
  },
  {
    title: t('message.operation'),
    key: 'operation',
  },
]);

const filteredColumns = computed(() => columns.value.filter(column => !column.hidden));

const pagination = reactive({
  current: 1,
  pageSize: 10,
  total: 0,
});

const fetchStaffData = async () => {
  loading.value = true;
  try {
    const result = await fetchEmployees({
      page: pagination.current,
      pageSize: pagination.pageSize,
      isDelete: 0
    });
    staffs.value = result;
    pagination.total = result.total;
  } catch (error) {
    showNotification('error', t('message.operationTitle'), t('message.pleaseTryAgainLater'));
  } finally {
    loading.value = false;
  }
};

const fetchSelectNations = async () => {
  try {
    const result = await fetchNations({
      isDelete: 0
    });
    staffNationOptions.value = result.map((item) => ({
      label: item.nation_name,
      value: item.nation_no,
    }));
  } catch (error) {
    showNotification('error', t('message.fetchDataFailed'), t('message.pleaseTryAgainLater'));
  }
};

const fetchSelectQualifications = async () => {
  try {
    const result = await fetchQualifications({
      isDelete: 0
    });
    staffQualificationOptions.value = result.map((item) => ({
      label: item.education_name,
      value: item.education_no,
    }));
  } catch (error) {
    showNotification('error', t('message.fetchDataFailed'), t('message.pleaseTryAgainLater'));
  }
};

const fetchSelectDepartments = async () => {
  try {
    const result = await fetchDepartments({
      isDelete: 0
    });
    staffDepartmentOptions.value = result.map((item) => ({
      label: item.dept_name,
      value: item.dept_no,
    }));
  } catch (error) {
    showNotification('error', t('message.fetchDataFailed'), t('message.pleaseTryAgainLater'));
  }
};

const fetchSelectPositions = async () => {
  try {
    const result = await fetchPositions({
      isDelete: 0
    });
    staffPositionOptions.value = result.map((item) => ({
      label: item.position_name,
      value: item.position_no,
    }));
  } catch (error) {
    showNotification('error', t('message.fetchDataFailed'), t('message.pleaseTryAgainLater'));
  }
};

const fetchSelectWorkerFeatures = async () => {
  try {
    const result = await fetchWorkerFeatures({
      isDelete: 0
    });
    staffFeaturesOptions.value = result.map((item) => ({
      label: item.description,
      value: item.code,
    }));
  } catch (error) {
    showNotification('error', t('message.fetchDataFailed'), t('message.pleaseTryAgainLater'));
  }
};

onMounted(() => {
  fetchStaffData();
  fetchSelectNations();
  fetchSelectQualifications();
  fetchSelectDepartments();
  fetchSelectPositions();
  fetchSelectWorkerFeatures();
});

const showModal = () => {
  modalVisible.value = true;
  modalTitle.value = t('message.insertStaff');
  form.WorkerId = generateSnowflakeId({
      prefix: 'W',
      separator: null,
    });
  form.WorkerName = '';
  form.WorkerSex = null;
  form.WorkerBirthday = null;
  form.WorkerEducation = null;
  form.WorkerNation = null;
  form.WorkerTime = null;
  form.WorkerFace = null;
  form.WorkerClub = null;
  form.WorkerPosition = null;
  form.CardId = '';
  form.WorkerTel = '';
  form.WorkerAddress = '';

  form.modifystatus = 'insert';
};

const refreshData = () => 
{
  fetchStaffData();
};

const editStaff = (record) => {
  modalVisible.value = true;
  modalTitle.value = t('message.updateStaff');
  form.WorkerId = record.WorkerId;
  form.WorkerName = record.WorkerName;
  form.WorkerSex = record.WorkerSex;
  form.WorkerBirthday = record.WorkerBirthday ? moment(record.WorkerBirthday) : null;
  form.WorkerTime = record.WorkerTime ? moment(record.WorkerTime) : null;
  form.WorkerEducation = record.WorkerEducation;
  form.WorkerNation = record.WorkerNation;
  form.WorkerFace = record.WorkerFace;
  form.WorkerClub = record.WorkerClub;
  form.WorkerPosition = record.WorkerPosition;
  form.CardId = record.CardId;
  form.WorkerTel = record.WorkerTel;
  form.WorkerAddress = record.WorkerAddress;

  form.modifystatus = 'update';
};

const handleModalOk = async () => {
  try {
    await formRef.value.validate();
    confirmLoading.value = true;
    if (form.modifystatus === 'update') {
      await updateEmployee({ ...form,WorkerBirthday:form.WorkerBirthday?form.WorkerBirthday.format('YYYY-MM-DD'):null,WorkerTime:form.WorkerTime?form.WorkerTime.format('YYYY-MM-DD'):null});
      showNotification('success', t('message.operationTitle') , t('message.updateSuccess'));
    } else {
      await addEmployee({ ...form,WorkerBirthday:form.WorkerBirthday?form.WorkerBirthday.format('YYYY-MM-DD'):null,WorkerTime:form.WorkerTime?form.WorkerTime.format('YYYY-MM-DD'):null});
      showNotification('success', t('message.operationTitle') , t('message.addSuccess'));
    }
    modalVisible.value = false;
    fetchStaffData();
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
    record.isDelete = 1;
    await updateEmployee(record);
    showNotification('success', t('message.operationTitle'), t('message.deleteSuccess'));
    fetchStaffData();
  } catch (error) {
    console.error('Delete error:', error);
    showNotification('error', t('message.operationTitle'), t('message.pleaseTryAgainLater'));
  }
};

const handleTableChange = (newPagination) => {
  pagination.current = newPagination.current;
  pagination.pageSize = newPagination.pageSize;
  fetchStaffData();
};

const handleSorterChange = (pagination, filters, sorter) => {
  sortedInfo.value = sorter;
};
</script>