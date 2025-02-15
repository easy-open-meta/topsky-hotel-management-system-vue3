<template>
  <div>
    <h1 style="margin-bottom: 15px;">{{ translatedPageTitle }}</h1>
    <a-button @click="refreshData" style="margin-bottom: 15px;margin-right: 15px;">{{ $t('message.refreshData') }}</a-button>
    <a-button type="primary" @click="showModal" style="margin-bottom: 15px;">{{ $t('message.insertCustomer') }}</a-button>
    <a-table :columns="filteredColumns" :data-source="customers" :loading="loading" :pagination="pagination" @change="handleTableChange" @sorterChange="handleSorterChange" bordered>
      <template #bodyCell="{ column, record }">
        <template v-if="column.key === 'operation'">
          <a-button @click="editCustomer(record)" style="margin-right: 15px;">{{ $t('message.edit') }}</a-button>
            <a-popconfirm :title="t('message.areYouSureToDeleteRecord')" @confirm="handleDelete(record)">
            <a-button danger>{{ $t('message.delete') }}</a-button>
          </a-popconfirm>
        </template>
        <template v-else-if="column.key === 'CustoBirth'">
          {{ formatDate(record.CustoBirth) }}
        </template>
      </template>
    </a-table>

    <a-modal :open="modalVisible" :title="modalTitle" @ok="handleModalOk" @cancel="handleModalCancel" :confirm-loading="confirmLoading">
      <a-form :model="form" :rules="rules" ref="formRef">
        <a-form-item :label="customerNoLabel" name="CustoNo">
          <a-input v-model:value="form.CustoNo" type="hidden" />
          <span>{{ form.CustoNo }}</span>
        </a-form-item>
        <a-form-item :label="customerNameLabel" name="CustoName">
          <a-input v-model:value="form.CustoName" />
        </a-form-item>
        <a-form-item :label="customerSexLabel" name="CustoSex">
          <a-radio-group v-model:value="form.CustoSex">
            <a-radio-button :value=0>女</a-radio-button>
            <a-radio-button :value=1>男</a-radio-button>
          </a-radio-group>
        </a-form-item>
        <a-form-item :label="customerBirthdayLabel" name="CustoBirth">
          <a-date-picker v-model:value="form.CustoBirth" />
        </a-form-item>
        <a-form-item :label="customerTypeLabel" name="CustoType">
          <a-select
            v-model:value="form.CustoType"
            :options="customerTypeOptions"
            :placeholder="t('message.pleaseInputCustomerType')"
          />
        </a-form-item>
        <a-form-item :label="customerPassportTypeLabel" name="PassportType">
          <a-select
            v-model:value="form.PassportType"
            :options="passportTypeOptions"
            :placeholder="t('message.pleaseInputCustomerPassportType')"
          />
        </a-form-item>
        <a-form-item :label="customerPassportIDLabel" name="CustoID">
          <a-input v-model:value="form.CustoID" />
        </a-form-item>
        <a-form-item :label="customerTelLabel" name="CustoTel">
          <a-input v-model:value="form.CustoTel" />
        </a-form-item>
        <a-form-item :label="customerAddressLabel" name="CustoAddress">
          <a-input v-model:value="form.CustoAddress" />
        </a-form-item>
      </a-form>
    </a-modal>
  </div>
</template>

<script setup>
import { ref, onMounted, computed, reactive } from 'vue';
import { useRoute } from 'vue-router';
import { getPageTitle } from '@/utils/pageTitle';
import { fetchCustomers, addCustomer, updateCustomer, deleteCustomer } from '@/api/customerapi';
import { fetchCanUsePassports } from '@/api/passportapi';
import { fetchCanUseCustomerTypes } from '@/api/custotypeapi';
import { formatDate,showNotification } from '@/utils/index';
import { useI18n } from 'vue-i18n';
import generateSnowflakeId from '@/utils/snowflake';
import moment from 'moment';

const { t } = useI18n();
const route = useRoute();
const pageTitleKey = computed(() => getPageTitle(route.path));
const translatedPageTitle = computed(() => t(pageTitleKey.value));
const loading = ref(false);
const customers = ref([]);
const modalVisible = ref(false);
const modalTitle = ref('');
const confirmLoading = ref(false);
const formRef = ref(null);
const sortedInfo = ref({ order: null, columnKey: null });
const customerTypeOptions = ref([]);
const passportTypeOptions = ref([]);

const form = reactive({
  CustoNo: null,
  CustoName: '',
  CustoSex: null,
  CustoBirth: '',
  PassportType: null,
  CustoID: '',
  CustoType: null,
  CustoTel: '',
  CustoAddress: '',
  DataInsUsr: '',
  DataInsDate: null,
  DataChgUsr: '',
  DataChgDate: null,
  modifystatus: '',
});

const rules = {
  CustoNo: [{ required: true, message: t('message.pleaseInputCustomerNo'), trigger: 'blur' }],
  CustoName: [{ required: true, message: t('message.pleaseInputCustomerName'), trigger: 'blur' }],
  CustoSex: [{ required: true, message: t('message.pleaseInputCustomerSex'), trigger: 'blur' }],
  CustoTel: [{ required: true, message: t('message.pleaseInputCustomerTel'), trigger: 'blur' }],
  PassportType: [{ required: true, message: t('message.pleaseInputCustomerPassportType'), trigger: 'blur' }],
  CustoID: [{ required: true, message: t('message.pleaseInputCustomerPassportID'), trigger: 'blur' }],
  CustoAddress: [{ required: true, message: t('message.pleaseInputCustomerAddress'), trigger: 'blur' }],
  CustoBirth: [{ required: true, message: t('message.pleaseInputCustomerBirth'), trigger: 'blur' }],
  CustoType: [{ required: true, message: t('message.pleaseInputCustomerType'), trigger: 'blur' }],
};

const customerNoLabel = computed(() => t('message.customerNo'));
const customerNameLabel = computed(() => t('message.customerName'));
const customerSexLabel = computed(() => t('message.customerSex'));
const customerPassportTypeLabel = computed(() => t('message.customerPassportType'));
const customerPassportIDLabel = computed(() => t('message.customerPassportID'));
const customerTypeLabel = computed(() => t('message.customerType'));
const customerTelLabel = computed(() => t('message.customerTel'));
const customerBirthdayLabel = computed(() => t('message.customerBirth'));
const customerAddressLabel = computed(() => t('message.customerAddress'));

const columns = computed(() => [
  {
    title: t('message.customerNo'),
    dataIndex: 'CustoNo',
    key: 'CustoNo',
    sorter: (a, b) => a.CustoNo.localeCompare(b.CustoNo),
    defaultSortOrder: 'ascend'
  },
  {
    title: t('message.customerName'),
    dataIndex: 'CustoName',
    key: 'CustoName',
  },
  {
    title: t('message.customerSex'),
    dataIndex: 'CustoSex',
    key: 'CustoSex',
    hidden: true,
  },
  {
    title: t('message.customerSex'),
    dataIndex: 'SexName',
    key: 'SexName',
  },
  {
    title: t('message.customerBirth'),
    dataIndex: 'CustoBirth',
    key: 'CustoBirth',
  },
  {
    title: t('message.customerType'),
    dataIndex: 'CustoType',
    key: 'CustoType',
    hidden: true,
  },
  {
    title: t('message.customerType'),
    dataIndex: 'typeName',
    key: 'typeName',
  },
  {
    title: t('message.customerPassportType'),
    dataIndex: 'PassportType',
    key: 'PassportType',
    hidden: true
  },
  {
    title: t('message.customerPassportType'),
    dataIndex: 'PassportName',
    key: 'PassportName'
  },
  {
    title: t('message.customerPassportID'),
    dataIndex: 'CustoID',
    key: 'CustoID'
  },
  {
    title: t('message.customerTel'),
    dataIndex: 'CustoTel',
    key: 'CustoTel'
  },
  {
    title: t('message.customerAddress'),
    dataIndex: 'CustoAddress',
    key: 'CustoAddress'
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

const fetchCustomerData = async () => {
  loading.value = true;
  try {
    const result = await fetchCustomers({
      page: pagination.current,
      pageSize: pagination.pageSize,
      isDelete: 0
    });
    customers.value = result.listSource;
    pagination.total = result.total;
  } catch (error) {
    showNotification('error', t('message.operationTitle'), t('message.pleaseTryAgainLater'));
  } finally {
    loading.value = false;
  }
};

const fetchSelectPassports = async () => {
  try {
    const result = await fetchCanUsePassports();
    passportTypeOptions.value = result.map((item) => ({
      label: item.PassportName,
      value: item.PassportId,
    }));
  } catch (error) {
    showNotification('error', t('message.fetchDataFailed'), t('message.pleaseTryAgainLater'));
  }
};

const fetchSelectCustoTypes = async () => {
  try {
    const result = await fetchCanUseCustomerTypes();
    customerTypeOptions.value = result.map((item) => ({
      label: item.TypeName,
      value: item.UserType,
    }));
  } catch (error) {
    showNotification('error', t('message.fetchDataFailed'), t('message.pleaseTryAgainLater'));
  }
};

onMounted(() => {
  fetchCustomerData();
  fetchSelectPassports();
  fetchSelectCustoTypes();
});

const showModal = () => {
  modalVisible.value = true;
  modalTitle.value = t('message.insertCustomer');
  form.CustoNo = generateSnowflakeId({
      prefix: 'TS-',
      separator: null,
    });
  form.CustoName = '';
  form.CustoSex = null;
  form.CustoBirth = null;
  form.CustoType = null;
  form.PassportType = null;
  form.CustoID = '';
  form.CustoTel = '';
  form.CustoAddress = '';

  form.modifystatus = 'insert';
};

const refreshData = () => 
{
  fetchCustomerData();
};

const editCustomer = (record) => {
  modalVisible.value = true;
  modalTitle.value = t('message.updateDepartment');
  form.CustoNo = record.CustoNo;
  form.CustoName = record.CustoName;
  form.CustoSex = record.CustoSex;
  form.CustoBirth = record.CustoBirth ? moment(record.CustoBirth) : null;
  form.CustoType = record.CustoType;
  form.PassportType = record.PassportType;
  form.CustoID = record.CustoID;
  form.CustoTel = record.CustoTel;
  form.CustoAddress = record.CustoAddress;

  form.modifystatus = 'update';
};

const handleModalOk = async () => {
  try {
    await formRef.value.validate();
    confirmLoading.value = true;
    if (form.modifystatus === 'update') {
      await updateCustomer({ ...form,CustoBirth:form.CustoBirth?form.CustoBirth.format('YYYY-MM-DD'):null});
      showNotification('success', t('message.operationTitle') , t('message.updateSuccess'));
    } else {
      await addCustomer({ ...form,CustoBirth:form.CustoBirth?form.CustoBirth.format('YYYY-MM-DD'):null});
      showNotification('success', t('message.operationTitle') , t('message.addSuccess'));
    }
    modalVisible.value = false;
    fetchCustomerData();
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
    await deleteCustomer(record);
    showNotification('success', t('message.operationTitle'), t('message.deleteSuccess'));
    fetchCustomerData();
  } catch (error) {
    console.error('Delete error:', error);
    showNotification('error', t('message.operationTitle'), t('message.pleaseTryAgainLater'));
  }
};

const handleTableChange = (newPagination) => {
  pagination.current = newPagination.current;
  pagination.pageSize = newPagination.pageSize;
  fetchCustomerData();
};

const handleSorterChange = (pagination, filters, sorter) => {
  sortedInfo.value = sorter;
};
</script>