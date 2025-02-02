<template>
  <div>
    <h1 style="margin-bottom: 15px;">{{ translatedPageTitle }}</h1>
    <a-button @click="refreshData" style="margin-bottom: 15px;margin-right: 15px;">{{ $t('message.refreshData') }}</a-button>
    <a-button type="primary" @click="showModal" style="margin-bottom: 15px;">{{ $t('message.insertInternalFinance') }}</a-button>
    <a-table :columns="filteredColumns" :data-source="cashs" :loading="loading" :pagicash="pagicash" @change="handleTableChange" @sorterChange="handleSorterChange" bordered>
      <template #bodyCell="{ column, record }">
        <template v-if="column.key === 'operation'">
          <a-button @click="editInternalfinance(record)" style="margin-right: 15px;">{{ $t('message.edit') }}</a-button>
            <a-popconfirm :title="t('message.areYouSureToDeleteRecord')" @confirm="handleDelete(record)">
            <a-button danger>{{ $t('message.delete') }}</a-button>
          </a-popconfirm>
        </template>
        <template v-else-if="column.key === 'CashTime'">
          {{ formatDate(record.CashTime) }}
        </template>
      </template>
    </a-table>

    <a-modal :open="modalVisible" :title="modalTitle" @ok="handleModalOk" @cancel="handleModalCancel" :confirm-loading="confirmLoading">
      <a-form :model="form" :rules="rules" ref="formRef">
        <a-form-item :label="cashNoLabel" name="CashNo">
          <span>{{ form.CashNo }}</span>
        </a-form-item>
        <a-form-item :label="cashNameLabel" name="CashName">
          <a-input v-model:value="form.CashName"/>
        </a-form-item>
        <a-form-item :label="cashPriceLabel" name="CashPrice">
          <a-input-number
            v-model:value="form.CashPrice"
            :formatter="value => `￥ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')"
            :parser="value => value.replace(/\$\s?|(,*)/g, '')"
          />
        </a-form-item>
        <a-form-item :label="cashClubLabel" name="CashClub">
          <a-select
            v-model:value="form.CashClub"
            :options="departmentOptions"
            placeholder="Please select Cash department"
          />
        </a-form-item>
        <a-form-item :label="cashTimeLabel" name="CashTime">
          <a-date-picker format="YYYY-MM-DD" v-model:value="form.CashTime"/>
        </a-form-item>
        <a-form-item :label="cashSourceLabel" name="CashSource">
          <a-input v-model:value="form.CashSource" />
        </a-form-item>
        <a-form-item :label="cashPersonLabel" name="CashPerson">
          <a-select
            v-model:value="form.CashPerson"
            :options="personOptions"
            placeholder="Please select Cash Person"
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
import { fetchDepartments } from '@/api/departmentapi';
import { fetchWorkers } from '@/api/workerapi';
import { formatDate,showNotification } from '@/utils/index';
import { useI18n } from 'vue-i18n';
import generateSnowflakeId from '@/utils/snowflake';
import moment from 'moment';

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

const form = reactive({
  CashNo: null,
  CashName: '',
  CashClub: '',
  CashPerson: '',
  CashPrice: 0,
  CashSource: '',
  CashTime: null,
  delete_mk: 0,
  datains_usr: '',
  datains_date: null,
  datachg_usr: '',
  datachg_date: null,
  modifystatus: '',
});

const rules = {
  CashName: [{ required: true, message: t('message.pleaseInputInternalFinanceName'), trigger: 'blur' }],
  CashPrice: [{ required: true, message: t('message.pleaseInputInternalFinancePrice'), trigger: 'blur' }],
  CashClub: [{ required: true, message: t('message.pleaseInputInternalFinanceDepartment'), trigger: 'blur' }],
  CashTime: [{ required: true, message: t('message.pleaseInputInternalFinanceTime'), trigger: 'blur' }],
  CashSource: [{ required: true, message: t('message.pleaseInputInternalFinanceSource'), trigger: 'blur' }],
  CashPerson: [{ required: true, message: t('message.pleaseInputInternalFinancePerson'), trigger: 'blur' }],
};

const cashNoLabel = computed(() => t('message.internalfinanceNo'));
const cashNameLabel = computed(() => t('message.internalfinanceName'));
const cashClubLabel = computed(() => t('message.internalfinanceDepartment'));
const cashPersonLabel = computed(() => t('message.internalfinancePerson'));
const cashPriceLabel = computed(() => t('message.internalfinancePrice'));
const cashSourceLabel = computed(() => t('message.internalfinanceSource'));
const cashTimeLabel = computed(() => t('message.internalfinanceTime'));

const columns = computed(() => [
  {
    title: t('message.internalfinanceNo'),
    dataIndex: 'CashNo',
    key: 'CashNo',
    sorter: (a, b) => a.CashNo.localeCompare(b.CashNo),
    defaultSortOrder: 'ascend'
  },
  {
    title: t('message.internalfinanceName'),
    dataIndex: 'CashName',
    key: 'CashName',
  },
  {
    title: t('message.internalfinancePrice'),
    dataIndex: 'CashPrice',
    key: 'CashPrice',
  },
  {
    title: t('message.internalfinanceDepartment'),
    dataIndex: 'CashClub',
    key: 'CashClub',
    hidden: true,
  },
  {
    title: t('message.internalfinanceDepartment'),
    dataIndex: 'DeptName',
    key: 'DeptName',
    hidden: false,
  },
  {
    title: t('message.internalfinanceTime'),
    dataIndex: 'CashTime',
    key: 'CashTime',
  },
  {
    title: t('message.internalfinanceSource'),
    dataIndex: 'CashSource',
    key: 'CashSource',
  },
  {
    title: t('message.internalfinancePerson'),
    dataIndex: 'CashPerson',
    key: 'CashPerson',
    hidden: true,
  },
  {
    title: t('message.internalfinancePerson'),
    dataIndex: 'PersonName',
    key: 'PersonName',
    hidden: false,
  },
  {
    title: t('message.operation'),
    key: 'operation',
  },
]);

const filteredColumns = computed(() => columns.value.filter(column => !column.hidden));

const pagicash = reactive({
  current: 1,
  pageSize: 10,
  total: 0,
});

const fetchInternalfinanceData = async () => {
  loading.value = true;
  try {
    const result = await fetchInternalFinances({
      page: pagicash.current,
      pageSize: pagicash.pageSize,
      delete_mk: 0
    });
    cashs.value = result;
    pagicash.total = result.length;
  } catch (error) {
    showNotification('error', t('message.operationTitle'), t('message.pleaseTryAgainLater'));
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
    showNotification('error', t('message.fetchDataFailed'), t('message.pleaseTryAgainLater'));
  }
};

const fetchSelectPersons = async () => {
  try {
    const result = await fetchWorkers();
    personOptions.value = result.map((item) => ({
      label: item.WorkerName,
      value: item.WorkerId,
    }));
  } catch (error) {
    showNotification('error', t('message.fetchDataFailed'), t('message.pleaseTryAgainLater'));
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
  form.CashNo = generateSnowflakeId({
      prefix: 'IF-',
      separator: null,
    });
  form.CashName = '';
  form.CashPrice = 0;
  form.CashClub = '';
  form.CashTime = null;
  form.CashSource = '';
  form.CashPerson = '';
  form.delete_mk = 0;
  form.modifystatus = 'insert';
};

const refreshData = () => 
{
  fetchInternalfinanceData();
};

const editInternalfinance = (record) => {
  modalVisible.value = true;
  modalTitle.value = t('message.updateInternalFinance');
  form.CashNo = record.CashNo;
  form.CashName = record.CashName;
  form.CashPrice = record.CashPrice;
  form.CashClub = record.CashClub;
  form.CashTime = moment(record.CashTime, 'YYYY-MM-DD HH:mm:ss')
  form.CashSource = record.CashSource;
  form.CashPerson = record.CashPerson;
  form.modifystatus = 'update';
};

const handleModalOk = async () => {
  try {
    await formRef.value.validate();
    confirmLoading.value = true;
    if (form.modifystatus === 'update') {
      await updateInternalFinance({ ...form});
      showNotification('success', t('message.operationTitle') , t('message.updateSuccess'));
    } else {
      await addInternalFinance({ ...form});
      showNotification('success', t('message.operationTitle') , t('message.addSuccess'));
    }
    modalVisible.value = false;
    fetchInternalfinanceData();
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
    record.delete_mk = 1;
    await deleteInternalFinance(record);
    showNotification('success', t('message.operationTitle'), t('message.deleteSuccess'));
    fetchInternalfinanceData();
  } catch (error) {
    console.error('Delete error:', error);
    showNotification('error', t('message.operationTitle'), t('message.pleaseTryAgainLater'));
  }
};

const handleTableChange = (newPagicash) => {
  pagicash.current = newPagicash.current;
  pagicash.pageSize = newPagicash.pageSize;
  fetchInternalfinanceData();
};

const handleSorterChange = (pagicash, filters, sorter) => {
  sortedInfo.value = sorter;
};
</script>