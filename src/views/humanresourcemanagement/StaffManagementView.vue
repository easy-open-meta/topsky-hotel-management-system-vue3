<template>
  <div>
    <h1 style="margin-bottom: 15px;">{{ translatedPageTitle }}</h1>
    <a-button @click="refreshData" style="margin-bottom: 15px;margin-right: 15px;"><sync-outlined /> {{ $t('message.refreshData') }}</a-button>
    <a-button type="primary" @click="showModal" style="margin-bottom: 15px;"><plus-outlined /> {{ $t('message.insertStaff') }}</a-button>
    <a-table :columns="filteredColumns" :data-source="staffs" :loading="loading" :pagination="pagination" @change="handleTableChange" @sorterChange="handleSorterChange" bordered>
      <template #bodyCell="{ column, record }">
        <template v-if="column.key === 'operation'">
          <a-button style="margin-right: 15px;" @click="viewDetail(record)"><EyeOutlined /> {{ $t('message.view') }}</a-button>
          <a-button @click="editStaff(record)" style="margin-right: 15px;"><edit-outlined /> {{ $t('message.edit') }}</a-button>
          <a-button 
            @click="disabledStaff(record)" 
            style="margin-right: 15px;"
            :danger="record[EmployeeFields.ISENABLE] === 0">
            <StopOutlined :style="{ color: record[EmployeeFields.ISENABLE] === 1 ? '#52c41a' : '#ff4d4f' }" />
            {{ record[EmployeeFields.ISENABLE] === 0 ? $t('message.disabled') : $t('message.enabled') }}
          </a-button>
          <a-button @click="resetPassword(record)" style="margin-right: 15px;"><RetweetOutlined /> {{ $t('message.resetPassword') }}</a-button>
            <a-popconfirm :title="t('message.areYouSureToDeleteRecord')" @confirm="handleDelete(record)">
            <a-button danger><delete-outlined /> {{ $t('message.delete') }}</a-button>
          </a-popconfirm>
        </template>
        <template v-if="column.key === EmployeeFields.DATEOFBIRTH">
          {{ formatDate(record[EmployeeFields.DATEOFBIRTH]) }}
        </template>
        <template v-else-if="column.key === EmployeeFields.HIREDATE">
          {{ formatDate(record[EmployeeFields.HIREDATE]) }}
        </template>
        <template v-else-if="column.key === EmployeeFields.ISENABLE">
          <a-tag 
            :color="record[EmployeeFields.ISENABLE] === 0 ? 'success' : 'error'"
            class="status-tag"
          >
            {{ record[EmployeeFields.ISENABLE] === 0 ? t('message.enabled') : t('message.disabled') }}
          </a-tag>
        </template>
      </template>
    </a-table>

    <a-modal :open="modalVisible" :title="modalTitle" @ok="handleModalOk" @cancel="handleModalCancel" :confirm-loading="confirmLoading">
      <a-form :model="form" :rules="rules" ref="formRef" layout="vertical">
        <a-row :gutter="24">
          <a-col :span="8">
            <a-form-item :label="staffNoLabel" :name="EmployeeFields.NUMBER">
              <span class="form-value">{{ form[EmployeeFields.NUMBER] }}</span>
            </a-form-item>
          </a-col>
          <a-col :span="16">
            <a-form-item :label="staffNameLabel" :name="EmployeeFields.NAME">
              <a-input
                v-model:value="form[EmployeeFields.NAME]"
                :placeholder="t('message.pleaseInputStaffName')"
              />
            </a-form-item>
          </a-col>
        </a-row>

        <a-row :gutter="24">
          <a-col :span="8">
            <a-form-item :label="staffSexLabel" :name="EmployeeFields.GENDER">
              <a-radio-group v-model:value="form[EmployeeFields.GENDER]">
                <a-radio-button :value="Gender.FEMALE">{{ $t('message.female') }}</a-radio-button>
                <a-radio-button :value="Gender.MALE">{{ $t('message.male') }}</a-radio-button>
              </a-radio-group>
            </a-form-item>
          </a-col>
          <a-col :span="8">
            <a-form-item :label="staffBirthdayLabel" :name="EmployeeFields.DATEOFBIRTH">
              <a-date-picker
                v-model:value="form[EmployeeFields.DATEOFBIRTH]"
                :format="getDateFormat(EmployeeFields.DATEOFBIRTH)"
                :show-time="needsTime(EmployeeFields.DATEOFBIRTH)"
                :valueFormat="getValueFormat(EmployeeFields.DATEOFBIRTH)"
                class="full-width"
              />
            </a-form-item>
          </a-col>
          <a-col :span="8">
            <a-form-item :label="staffTimeLabel" :name="EmployeeFields.HIREDATE">
              <a-date-picker
                v-model:value="form[EmployeeFields.HIREDATE]"
                :format="getDateFormat(EmployeeFields.HIREDATE)"
                :show-time="needsTime(EmployeeFields.HIREDATE)"
                :valueFormat="getValueFormat(EmployeeFields.HIREDATE)"
                class="full-width"
              />
            </a-form-item>
          </a-col>
        </a-row>

        <a-row :gutter="24">
          <a-col :span="8">
            <a-form-item :label="staffNationLabel" :name="EmployeeFields.ETHNICITY">
              <a-select
                v-model:value="form[EmployeeFields.ETHNICITY]"
                :options="staffNationOptions"
                :placeholder="t('message.pleaseInputStaffNation')"
                show-search
              />
            </a-form-item>
          </a-col>
          <a-col :span="8">
            <a-form-item :label="staffFaceLabel" :name="EmployeeFields.POLITICALAFFILIATION">
              <a-select
                v-model:value="form[EmployeeFields.POLITICALAFFILIATION]"
                :options="staffFeaturesOptions"
                :placeholder="t('message.pleaseInputStaffFace')"
                show-search
              />
            </a-form-item>
          </a-col>
          <a-col :span="8">
            <a-form-item :label="staffEducationLabel" :name="EmployeeFields.EDUCATIONLEVEL">
              <a-select
                v-model:value="form[EmployeeFields.EDUCATIONLEVEL]"
                :options="staffQualificationOptions"
                :placeholder="t('message.pleaseInputStaffEducation')"
                show-search
              />
            </a-form-item>
          </a-col>
        </a-row>

        <a-row :gutter="24">
          <a-col :span="12">
            <a-form-item :label="staffDepartmentLabel" :name="EmployeeFields.DEPARTMENT">
              <a-select
                v-model:value="form[EmployeeFields.DEPARTMENT]"
                :options="staffDepartmentOptions"
                :placeholder="t('message.pleaseInputStaffDepartment')"
                show-search
              />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item :label="staffPositionLabel" :name="EmployeeFields.POSITION">
              <a-select
                v-model:value="form[EmployeeFields.POSITION]"
                :options="staffPositionOptions"
                :placeholder="t('message.pleaseInputStaffPosition')"
                show-search
              />
            </a-form-item>
          </a-col>
        </a-row>

        <a-row :gutter="24">
          <a-col :span="12">
            <a-form-item :label="staffCardIDLabel" :name="EmployeeFields.IDCARDNUMBER">
              <a-input
                v-model:value="form[EmployeeFields.IDCARDNUMBER]"
                :placeholder="t('message.pleaseInputStaffCardID')"
              />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item :label="staffTelLabel" :name="EmployeeFields.PHONENUMBER">
              <a-input
                v-model:value="form[EmployeeFields.PHONENUMBER]"
                :placeholder="t('message.pleaseInputStaffTel')"
              />
            </a-form-item>
          </a-col>
        </a-row>

        <a-form-item :label="staffAddressLabel" :name="EmployeeFields.ADDRESS">
          <a-input
            v-model:value="form[EmployeeFields.ADDRESS]"
            :placeholder="t('message.pleaseInputStaffAddress')"
          />
        </a-form-item>
      </a-form>
    </a-modal>
  </div>
</template>

<script setup>
import { ref, onMounted, computed, reactive } from 'vue';
import { Select } from 'ant-design-vue';
import { useRoute,useRouter } from 'vue-router';
import { getPageTitle } from '@/utils/pageTitle';
import { fetchEmployees, addEmployee, updateEmployee, managerEmployeeAccount, resetEmployeePassword } from '@/api/employeeapi';
import { 
  EmployeeFields,
  Gender,
  initialFormValues,
  getColumns,
  getFormRules
} from '@/entities/employee.entity';
import { fetchPositions } from '@/api/positionapi';
import { 
  PositionFields
} from '@/entities/position.entity';
import { fetchQualifications } from '@/api/qualificationapi';
import { 
  EducationFields
} from '@/entities/qualification.entity';
import { fetchDepartments } from '@/api/departmentapi';
import { 
  DepartmentFields
} from '@/entities/department.entity';
import { fetchNations } from '@/api/nationapi';
import { 
  NationFields
} from '@/entities/nation.entity';
import { fetchWorkerFeatures } from '@/api/workerfeatureapi';
import { formatDate,showNotification } from '@/utils/index';
import { useI18n } from 'vue-i18n';
import generateSnowflakeId from '@/utils/snowflake';
import { dateFieldConfig } from '@/config/dateFields';
import dayjs from 'dayjs';

const { t } = useI18n();
const route = useRoute();
const router = useRouter();
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

const needsTime = (fieldName) => {
  return dateFieldConfig.WITH_TIME.includes(fieldName);
};

const getDateFormat = (fieldName) => {
  return needsTime(fieldName) ? 'YYYY-MM-DD HH:mm:ss' : 'YYYY-MM-DD';
};

const getValueFormat = (fieldName) => {
  return needsTime(fieldName) ? 'YYYY-MM-DD HH:mm:ss' : 'YYYY-MM-DD';
};

const viewDetail = (record) => {
  router.push({
    path: `/employeedetail/${record[EmployeeFields.NUMBER]}`
  });
};

const form = reactive({ ...initialFormValues });

const rules = getFormRules(t);

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

const columns = computed(() => getColumns(t));

const filteredColumns = computed(() => columns.value.filter(column => !column.hidden));

const pagination = reactive({
  current: 1,
  pageSize: 15,
  total: 0,
  showSizeChanger: true,
  pageSizeOptions: ['15', '30', '50'],
  showTotal: total => t('message.totalRecords', { total })
});

const fetchStaffData = async () => {
  loading.value = true;
  try {
    const result = await fetchEmployees({
      page: pagination.current,
      pageSize: pagination.pageSize,
      [EmployeeFields.IS_DELETED]: 0,
    });
    if(result?.listSource){
      staffs.value = result.listSource.map(item => ({
        [EmployeeFields.NUMBER]: item[EmployeeFields.NUMBER],
        [EmployeeFields.NAME]: item[EmployeeFields.NAME],
        [EmployeeFields.GENDER]: item[EmployeeFields.GENDER],
        [EmployeeFields.GENDERNAME]: item[EmployeeFields.GENDERNAME] === Gender.MALE 
          ? t('message.male') 
          : t('message.female'),
        [EmployeeFields.DATEOFBIRTH]: formatDate(item[EmployeeFields.DATEOFBIRTH]),
        [EmployeeFields.HIREDATE]: formatDate(item[EmployeeFields.HIREDATE]),
        [EmployeeFields.ETHNICITY]: item[EmployeeFields.ETHNICITY],
        [EmployeeFields.ETHNICITYNAME]: item[EmployeeFields.ETHNICITYNAME],
        [EmployeeFields.EDUCATIONLEVEL]: item[EmployeeFields.EDUCATIONLEVEL],
        [EmployeeFields.EDUCATIONLEVELNAME]: item[EmployeeFields.EDUCATIONLEVELNAME],
        [EmployeeFields.DEPARTMENT]: item[EmployeeFields.DEPARTMENT],
        [EmployeeFields.DEPARTMENTNAME]: item[EmployeeFields.DEPARTMENTNAME],
        [EmployeeFields.POSITION]: item[EmployeeFields.POSITION],
        [EmployeeFields.POSITIONNAME]: item[EmployeeFields.POSITIONNAME],
        [EmployeeFields.IDCARDNUMBER]: item[EmployeeFields.IDCARDNUMBER],
        [EmployeeFields.PHONENUMBER]: item[EmployeeFields.PHONENUMBER],
        [EmployeeFields.ADDRESS]: item[EmployeeFields.ADDRESS],
        [EmployeeFields.IS_DELETED]: item[EmployeeFields.IS_DELETED],
        [EmployeeFields.POLITICALAFFILIATION]: item[EmployeeFields.POLITICALAFFILIATION],
        [EmployeeFields.POLITICALAFFILIATIONNAME]: item[EmployeeFields.POLITICALAFFILIATIONNAME],
        [EmployeeFields.ISENABLE]: item[EmployeeFields.ISENABLE]
      }));
      pagination.total = result.total;
    }
  } catch (error) {
    showNotification('error', t('message.operationTitle'), t('message.pleaseTryAgainLater'));
  } finally {
    loading.value = false;
  }
};

const fetchSelectNations = async () => {
  try {
    const result = await fetchNations({
      [NationFields.IS_DELETED]: 0,
      [NationFields.IGNOREPAGING]: true
    });
    staffNationOptions.value = result.listSource.map((item) => ({
      label: item[NationFields.NAME],
      value: item[NationFields.NUMBER],
    }));
  } catch (error) {
    showNotification('error', t('message.fetchDataFailed'), t('message.pleaseTryAgainLater'));
  }
};

const fetchSelectQualifications = async () => {
  try {
    const result = await fetchQualifications({
      [EducationFields.IS_DELETED]: 0,
      [EducationFields.IGNOREPAGING]: true
    });
    staffQualificationOptions.value = result.listSource.map((item) => ({
      label: item[EducationFields.NAME],
      value: item[EducationFields.NUMBER],
    }));
  } catch (error) {
    showNotification('error', t('message.fetchDataFailed'), t('message.pleaseTryAgainLater'));
  }
};

const fetchSelectDepartments = async () => {
  try {
    const result = await fetchDepartments({
      [DepartmentFields.IS_DELETED]: 0,
      [DepartmentFields.IGNOREPAGING]: true
    });
    staffDepartmentOptions.value = result.listSource.map((item) => ({
      label: item[DepartmentFields.NAME],
      value: item[DepartmentFields.NUMBER],
    }));
  } catch (error) {
    showNotification('error', t('message.fetchDataFailed'), t('message.pleaseTryAgainLater'));
  }
};

const fetchSelectPositions = async () => {
  try {
    const result = await fetchPositions({
      [PositionFields.IS_DELETED]: 0,
      [PositionFields.IGNOREPAGING]: true
    });
    staffPositionOptions.value = result.listSource.map((item) => ({
      label: item[PositionFields.NAME],
      value: item[PositionFields.NUMBER],
    }));
  } catch (error) {
    showNotification('error', t('message.fetchDataFailed'), t('message.pleaseTryAgainLater'));
  }
};

const fetchSelectWorkerFeatures = async () => {
  try {
    const result = await fetchWorkerFeatures({
    });
    staffFeaturesOptions.value = result.map((item) => ({
      label: item.Description,
      value: item.Name,
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
  form[EmployeeFields.NUMBER] = generateSnowflakeId({
      prefix: 'W',
      separator: null,
    });
  form[EmployeeFields.NAME] = '';
  form[EmployeeFields.GENDER] = null;
  form[EmployeeFields.DATEOFBIRTH] = null;
  form[EmployeeFields.EDUCATIONLEVEL] = null;
  form[EmployeeFields.HIREDATE] = null;
  form[EmployeeFields.ETHNICITY] = null;
  form[EmployeeFields.DEPARTMENT] = null;
  form[EmployeeFields.POSITION] = null;
  form[EmployeeFields.IDCARDNUMBER] = '';
  form[EmployeeFields.PHONENUMBER] = '';
  form[EmployeeFields.ADDRESS] = '';
  form[EmployeeFields.POLITICALAFFILIATION] = null;

  form.modifystatus = 'insert';
};

const refreshData = () => 
{
  fetchStaffData();
};

const editStaff = (record) => {
  modalVisible.value = true;
  modalTitle.value = t('message.updateStaff');
  form[EmployeeFields.NUMBER] = record[EmployeeFields.NUMBER];
  form[EmployeeFields.NAME] = record[EmployeeFields.NAME];
  form[EmployeeFields.GENDER] = record[EmployeeFields.GENDER];
  form[EmployeeFields.DATEOFBIRTH] = dayjs(record[EmployeeFields.DATEOFBIRTH]);
  form[EmployeeFields.HIREDATE] = dayjs(record[EmployeeFields.HIREDATE]);
  form[EmployeeFields.EDUCATIONLEVEL] = record[EmployeeFields.EDUCATIONLEVEL];
  form[EmployeeFields.ETHNICITY] = record[EmployeeFields.ETHNICITY];
  form[EmployeeFields.POLITICALAFFILIATION] = record[EmployeeFields.POLITICALAFFILIATION];
  form[EmployeeFields.DEPARTMENT] = record[EmployeeFields.DEPARTMENT];
  form[EmployeeFields.POSITION] = record[EmployeeFields.POSITION];
  form[EmployeeFields.IDCARDNUMBER] = record[EmployeeFields.IDCARDNUMBER];
  form[EmployeeFields.PHONENUMBER] = record[EmployeeFields.PHONENUMBER];
  form[EmployeeFields.ADDRESS] = record[EmployeeFields.ADDRESS];

  form.modifystatus = 'update';
};

const disabledStaff = async (record) => {
  await managerEmployeeAccount({ [EmployeeFields.NUMBER]: record[EmployeeFields.NUMBER], [EmployeeFields.ISENABLE]: record[EmployeeFields.ISENABLE] === 0 ? 1 : 0 });
  fetchStaffData();
}

const resetPassword = async (record) => {
  var result = await resetEmployeePassword({ [EmployeeFields.NUMBER]: record[EmployeeFields.NUMBER] });
  if(result.StatusCode !== 200){
    showNotification('error', t('message.operationTitle'), result.Message);
  }
  else
  {
    showNotification('success', t('message.operationTitle'), t('message.resetPasswordSuccess'));
  }
  fetchStaffData();
}

const handleModalOk = async () => {
  try {
    await formRef.value.validate();
    const payload = { ...form };
    dateFieldConfig.WITH_TIME.forEach(field => {
      if (payload[field]) {
        payload[field] = dayjs(payload[field]).format('YYYY-MM-DD HH:mm:ss');
      }
    });
    dateFieldConfig.WITHOUT_TIME.forEach(field => {
      if (payload[field]) {
        payload[field] = dayjs(payload[field]).format('YYYY-MM-DD');
      }
    });
    confirmLoading.value = true;
    if (form.modifystatus === 'update') {
      await updateEmployee(payload);
      showNotification('success', t('message.operationTitle') , t('message.updateSuccess'));
    } else {
      await addEmployee(payload);
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
    record[EmployeeFields.IS_DELETED] = 1;
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

<style scoped>
.status-tag {
  transition: all 0.3s cubic-bezier(0.645, 0.045, 0.355, 1);
}
</style>