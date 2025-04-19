<template>
  <div>
    <h1 style="margin-bottom: 15px;">{{ translatedPageTitle }}</h1>
    <a-button @click="refreshData" style="margin-bottom: 15px;margin-right: 15px;"><sync-outlined /> {{ $t('message.refreshData') }}</a-button>
    <a-button type="primary" @click="showModal" style="margin-bottom: 15px;"><plus-outlined /> {{ $t('message.insertInternalFinance') }}</a-button>
    <a-table :columns="filteredColumns" :data-source="cashs" :loading="loading" :pagination="pagination" @change="handleTableChange" @sorterChange="handleSorterChange" bordered>
      <template #bodyCell="{ column, record }">
        <template v-if="column.key === 'operation'">
          <a-button @click="editInternalfinance(record)" style="margin-right: 15px;"><edit-outlined /> {{ $t('message.edit') }}</a-button>
            <a-popconfirm :title="t('message.areYouSureToDeleteRecord')" @confirm="handleDelete(record)">
            <a-button danger><delete-outlined /> {{ $t('message.delete') }}</a-button>
          </a-popconfirm>
        </template>
        <template v-else-if="column.key === InternalFinanceFields.ACQUISITIONDATE">
          {{ formatDate(record[InternalFinanceFields.ACQUISITIONDATE]) }}
        </template>
      </template>
    </a-table>

    <a-modal :open="modalVisible" :title="modalTitle" @ok="handleModalOk" @cancel="handleModalCancel" :confirm-loading="confirmLoading">
      <a-form :model="form" :rules="rules" ref="formRef">
        <a-form-item :label="cashNoLabel" :name="InternalFinanceFields.NUMBER">
          <span>{{ form[InternalFinanceFields.NUMBER] }}</span>
        </a-form-item>
        <a-form-item :label="cashNameLabel" :name="InternalFinanceFields.NAME">
          <a-input v-model:value="form[InternalFinanceFields.NAME]"/>
        </a-form-item>
        <a-form-item :label="cashPriceLabel" :name="InternalFinanceFields.ASSETVALUE">
          <a-input-number
            v-model:value="form[InternalFinanceFields.ASSETVALUE]"
            :precision="0"
            :formatter="value => value ? `￥ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',') : ''"
            :parser="value => {
              const numStr = value.replace(/[^\d]/g, '');
              return numStr ? parseInt(numStr) : 0;
            }"
            :controls="false"
            style="width: 200px"
          />
        </a-form-item>
        <a-form-item :label="cashClubLabel" :name="InternalFinanceFields.DEPARTMENT">
          <a-select
            v-model:value="form[InternalFinanceFields.DEPARTMENT]"
            :options="departmentOptions"
            :placeholder="t('message.pleaseInputInternalFinanceDepartment')"
          />
        </a-form-item>
        <a-form-item :label="cashTimeLabel" :name="InternalFinanceFields.ACQUISITIONDATE">
          <a-date-picker v-model:value="form[InternalFinanceFields.ACQUISITIONDATE]" show-time/>
        </a-form-item>
        <a-form-item :label="cashSourceLabel" :name="InternalFinanceFields.ASSETSOURCE">
          <a-input v-model:value="form[InternalFinanceFields.ASSETSOURCE]" />
        </a-form-item>
        <a-form-item :label="cashPersonLabel" :name="InternalFinanceFields.ACQUIREDBYEMPLOYEE">
          <a-select
            v-model:value="form[InternalFinanceFields.ACQUIREDBYEMPLOYEE]"
            :options="personOptions"
            :placeholder="t('message.pleaseInputInternalFinancePerson')"
          />
        </a-form-item>
      </a-form>
    </a-modal>
  </div>
</template>

<script setup>
import { ref, onMounted, computed, reactive } from 'vue';
import { useRoute } from 'vue-router';
import { getPageTitle } from '@/utils/pageTitle';
import { fetchInternalFinances, addInternalFinance, updateInternalFinance, deleteInternalFinance } from '@/api/internalfinanceapi';
import { 
  InternalFinanceFields, 
  initialFormValues, 
  getColumns, 
  getFormRules 
} from '@/entities/internalfinance.entity';
import { 
  DepartmentFields
} from '@/entities/department.entity';
import { 
  EmployeeFields
} from '@/entities/employee.entity';
import { fetchDepartments } from '@/api/departmentapi';
import { fetchEmployees } from '@/api/employeeapi';
import { formatDate, showErrorNotification, showSuccessNotification } from '@/utils/index';
import { useI18n } from 'vue-i18n';
import generateSnowflakeId from '@/utils/snowflake';
import dayjs from 'dayjs';

const { t } = useI18n();
const route = useRoute();
const pageTitleKey = computed(() => getPageTitle(route.path));
const translatedPageTitle = computed(() => t(pageTitleKey.value));
const loading = ref(false);
const cashs = ref([]);
const modalVisible = ref(false);
const modalTitle = ref('');
const confirmLoading = ref(false);
const formRef = ref(null);
const sortedInfo = ref({ order: null, columnKey: null });
const departmentOptions = ref([]);
const personOptions = ref([]);

const form = reactive({ ...initialFormValues });

const rules = getFormRules(t);

const cashNoLabel = computed(() => t('message.internalfinanceNo'));
const cashNameLabel = computed(() => t('message.internalfinanceName'));
const cashClubLabel = computed(() => t('message.internalfinanceDepartment'));
const cashPersonLabel = computed(() => t('message.internalfinancePerson'));
const cashPriceLabel = computed(() => t('message.internalfinancePrice'));
const cashSourceLabel = computed(() => t('message.internalfinanceSource'));
const cashTimeLabel = computed(() => t('message.internalfinanceTime'));

const columns = computed(() => getColumns(t));

const filteredColumns = computed(() => columns.value.filter(column => !column.hidden));

const pagination = reactive({
  current: 1,
  pageSize: 15,
  total: 0,
  showSizeChanger: true,
  pageSizeOptions: ['15', '20', '50'],
  showTotal: total => t('message.totalRecords', { total })
});

const fetchInternalfinanceData = async () => {
  loading.value = true;
  try {
    const result = await fetchInternalFinances({
      page: pagination.current,
      pageSize: pagination.pageSize,
      [InternalFinanceFields.IS_DELETED]: 0
    });
    if (result?.listSource) {
      cashs.value = result.listSource.map(item => ({
      [InternalFinanceFields.NUMBER]: item[InternalFinanceFields.NUMBER],
      [InternalFinanceFields.NAME]: item[InternalFinanceFields.NAME],
      [InternalFinanceFields.ASSETVALUE]: item[InternalFinanceFields.ASSETVALUE],
      [InternalFinanceFields.ASSETVALUEFORMATTED]: item[InternalFinanceFields.ASSETVALUEFORMATTED],
      [InternalFinanceFields.DEPARTMENT]: item[InternalFinanceFields.DEPARTMENT],
      [InternalFinanceFields.DEPARTMENTNAME]: item[InternalFinanceFields.DEPARTMENTNAME],
      [InternalFinanceFields.ACQUISITIONDATE]: item[InternalFinanceFields.ACQUISITIONDATE],
      [InternalFinanceFields.ASSETSOURCE]: item[InternalFinanceFields.ASSETSOURCE],
      [InternalFinanceFields.ACQUIREDBYEMPLOYEE]: item[InternalFinanceFields.ACQUIREDBYEMPLOYEE],
      [InternalFinanceFields.ACQUIREDBYEMPLOYEENAME]: item[InternalFinanceFields.ACQUIREDBYEMPLOYEENAME],
      [InternalFinanceFields.IS_DELETED]: item[InternalFinanceFields.IS_DELETED]
    }));
    pagination.total = result.total;
    } else {
      throw new Error('数据格式错误');
    }
  } catch (error) {
    showErrorNotification(error.message || t('message.pleaseTryAgainLater'));
  } finally {
    loading.value = false;
  }
};

const fetchSelectDepartments = async () => {
  try {
    const result = await fetchDepartments({
      [DepartmentFields.IS_DELETED]: 0,
      page: 1,
      pageSize: 9999
    });
    departmentOptions.value = result.listSource.map((item) => ({
      label: item[DepartmentFields.NAME],
      value: item[DepartmentFields.NUMBER],
    }));
  } catch (error) {
    showErrorNotification(error.message || t('message.pleaseTryAgainLater'));
  }
};

const fetchSelectPersons = async () => {
  try {
    const result = await fetchEmployees({
      [EmployeeFields.IS_DELETED]: 0,
      page: 1,
      pageSize: 9999
    });
    personOptions.value = result.listSource.map((item) => ({
      label: item[EmployeeFields.NAME],
      value: item[EmployeeFields.NUMBER],
    }));
  } catch (error) {
    showErrorNotification(error.message || t('message.pleaseTryAgainLater'));
  }
};

onMounted(() => {
  fetchInternalfinanceData();
  fetchSelectDepartments();
  fetchSelectPersons();
});

const showModal = () => {
  modalVisible.value = true;
  modalTitle.value = t('message.insertInternalFinance');
  form[InternalFinanceFields.NUMBER] = generateSnowflakeId({
      prefix: 'IF-',
      separator: null,
    });
  form[InternalFinanceFields.NAME] = '';
  form[InternalFinanceFields.ASSETVALUE] = 0;
  form[InternalFinanceFields.DEPARTMENT] = null;
  form[InternalFinanceFields.ACQUISITIONDATE] = null;
  form[InternalFinanceFields.ASSETSOURCE] = '';
  form[InternalFinanceFields.ACQUIREDBYEMPLOYEE] = null;
  form[InternalFinanceFields.IS_DELETED] = 0;
  form.modifystatus = 'insert';
};

const refreshData = () => 
{
  fetchInternalfinanceData();
};

const editInternalfinance = (record) => {
  modalVisible.value = true;
  modalTitle.value = t('message.updateInternalFinance');
  form[InternalFinanceFields.NUMBER] = record[InternalFinanceFields.NUMBER];
  form[InternalFinanceFields.NAME] = record[InternalFinanceFields.NAME];
  form[InternalFinanceFields.ASSETVALUE] = record[InternalFinanceFields.ASSETVALUE];
  form[InternalFinanceFields.DEPARTMENT] = record[InternalFinanceFields.DEPARTMENT];
  form[InternalFinanceFields.ACQUISITIONDATE] = dayjs(record[InternalFinanceFields.ACQUISITIONDATE], 'YYYY-MM-DD HH:mm:ss')
  form[InternalFinanceFields.ASSETSOURCE] = record[InternalFinanceFields.ASSETSOURCE];
  form[InternalFinanceFields.ACQUIREDBYEMPLOYEE] = record[InternalFinanceFields.ACQUIREDBYEMPLOYEE];
  form.modifystatus = 'update';
};

const handleModalOk = async () => {
  try {
    await formRef.value.validate();
    confirmLoading.value = true;
    if (form.modifystatus === 'update') {
      var response = await updateInternalFinance({ ...form});
      if(response && response.StatusCode === 200)
      {
        showSuccessNotification(t('message.updateSuccess'));
      }
      else
      {
        showErrorNotification(response.Message);        
      }
    } else {
      var response = await addInternalFinance({ ...form});
      if(response && response.StatusCode === 200)
      {
        showSuccessNotification(t('message.addSuccess'));
      }
      else
      {
        showErrorNotification(response.Message);        
      }
    }
    modalVisible.value = false;
    fetchInternalfinanceData();
  } catch (error) {
    showErrorNotification(error.message || t('message.pleaseTryAgainLater'));
  } finally {
    confirmLoading.value = false;
  }
};

const handleModalCancel = () => {
  modalVisible.value = false;
};

const handleDelete = async (record) => {
  try {
    record[InternalFinanceFields.IS_DELETED] = 1;
    var response = await deleteInternalFinance(record);
    if(response && response.StatusCode === 200)
    {
      showSuccessNotification(t('message.deleteSuccess'));
    }
    else
    {
      showErrorNotification(t('message.pleaseTryAgainLater'));
    }
    fetchInternalfinanceData();
  } catch (error) {
    showErrorNotification(error.message || t('message.pleaseTryAgainLater'));
  }
};

const handleTableChange = (newPagicash) => {
  pagination.current = newPagicash.current;
  pagination.pageSize = newPagicash.pageSize;
  fetchInternalfinanceData();
};

const handleSorterChange = (pagination, filters, sorter) => {
  sortedInfo.value = sorter;
};
</script>