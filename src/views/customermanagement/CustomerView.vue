<template>
  <div>
    <h1 style="margin-bottom: 15px;">{{ translatedPageTitle }}</h1>
    <a-button @click="refreshData" style="margin-bottom: 15px;margin-right: 15px;"><sync-outlined /> {{ $t('message.refreshData') }}</a-button>
    <a-button type="primary" @click="showModal" style="margin-bottom: 15px;"><plus-outlined /> {{ $t('message.insertCustomer') }}</a-button>
    <a-table :columns="filteredColumns" :data-source="customers" :loading="loading" :pagination="pagination" @change="handleTableChange" @sorterChange="handleSorterChange" bordered>
      <template #bodyCell="{ column, record }">
        <template v-if="column.key === 'operation'">
          <a-button @click="editCustomer(record)" style="margin-right: 15px;"><edit-outlined /> {{ $t('message.edit') }}</a-button>
            <a-popconfirm :title="t('message.areYouSureToDeleteRecord')" @confirm="handleDelete(record)">
            <a-button danger><delete-outlined /> {{ $t('message.delete') }}</a-button>
          </a-popconfirm>
        </template>
        <template v-if="column.key === CustomerFields.BIRTH_DATE">
          {{ formatDate(record[CustomerFields.BIRTH_DATE]) }}
        </template>
      </template>
    </a-table>

    <a-modal :open="modalVisible" :title="modalTitle" @ok="handleModalOk" @cancel="handleModalCancel" :confirm-loading="confirmLoading">
      <a-form :model="form" :rules="rules" ref="formRef">
        <a-form-item :label="customerNoLabel" :name="CustomerFields.ID">
          <span>{{ form[CustomerFields.ID] }}</span>
        </a-form-item>

        <a-form-item :label="customerNameLabel" :name="CustomerFields.NAME">
          <a-input v-model:value="form[CustomerFields.NAME]" />
        </a-form-item>

        <a-form-item :label="customerSexLabel" :name="CustomerFields.GENDER">
          <a-radio-group v-model:value="form[CustomerFields.GENDER]">
            <a-radio-button :value="Gender.FEMALE">{{ $t('message.female') }}</a-radio-button>
            <a-radio-button :value="Gender.MALE">{{ $t('message.male') }}</a-radio-button>
          </a-radio-group>
        </a-form-item>

        <a-form-item :label="customerBirthdayLabel" :name="CustomerFields.BIRTH_DATE">
          <a-date-picker 
            v-model:value="form[CustomerFields.BIRTH_DATE]"
          />
        </a-form-item>

        <a-form-item :label="customerTypeLabel" :name="CustomerFields.TYPE">
          <a-select
            v-model:value="form[CustomerFields.TYPE]"
            :options="customerTypeOptions"
            :placeholder="t('message.pleaseInputCustomerType')"
            show-search
          />
        </a-form-item>

        <a-form-item :label="customerPassportTypeLabel" :name="CustomerFields.PASSPORTTYPE">
          <a-select
            v-model:value="form[CustomerFields.PASSPORTTYPE]"
            :options="passportTypeOptions"
            :placeholder="t('message.pleaseInputCustomerPassportType')"
            show-search
          />
        </a-form-item>

        <a-form-item :label="customerPassportIDLabel" :name="CustomerFields.ID_NUMBER">
          <a-input v-model:value="form[CustomerFields.ID_NUMBER]" />
        </a-form-item>

        <a-form-item :label="customerTelLabel" :name="CustomerFields.PHONE">
          <a-input v-model:value="form[CustomerFields.PHONE]" />
        </a-form-item>

        <a-form-item :label="customerAddressLabel" :name="CustomerFields.ADDRESS">
          <a-input v-model:value="form[CustomerFields.ADDRESS]" />
        </a-form-item>
      </a-form>
    </a-modal>
  </div>
</template>

<script setup>
import { ref, onMounted, computed, reactive, watch, onBeforeUnmount } from 'vue';
import { useRoute } from 'vue-router';
import { getPageTitle } from '@/utils/pageTitle';
import { fetchCustomers, addCustomer, updateCustomer, deleteCustomer } from '@/api/customerapi';
import { fetchCardCode } from '@/api/utilityapi';
import { debounce } from 'lodash-es';
import { 
  CustomerFields,
  Gender,
  initialFormValues,
  getColumns,
  getFormRules
} from '@/entities/customer.entity';
import { CustomerTypeFields } from '@/entities/customertype.entity';
import { PassportFields } from '@/entities/passport.entity';
import { fetchCanUsePassports } from '@/api/passportapi';
import { fetchCanUseCustomerTypes } from '@/api/custotypeapi';
import { formatDate,showNotification } from '@/utils/index';
import { useI18n } from 'vue-i18n';
import generateSnowflakeId from '@/utils/snowflake';
import dayjs from 'dayjs';

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

const form = reactive({ ...initialFormValues });

const rules = getFormRules(t);

const customerNoLabel = computed(() => t('message.customerNo'));
const customerNameLabel = computed(() => t('message.customerName'));
const customerSexLabel = computed(() => t('message.customerSex'));
const customerPassportTypeLabel = computed(() => t('message.customerPassportType'));
const customerPassportIDLabel = computed(() => t('message.customerPassportID'));
const customerTypeLabel = computed(() => t('message.customerType'));
const customerTelLabel = computed(() => t('message.customerTel'));
const customerBirthdayLabel = computed(() => t('message.customerBirth'));
const customerAddressLabel = computed(() => t('message.customerAddress'));

const columns = computed(() => getColumns(t));

const filteredColumns = computed(() => columns.value.filter(column => !column.hidden));

const queryAddress = debounce(async (idCard) => {
  try {
    if (!idCard || idCard.length < 15) return;
    
    const result = await fetchCardCode({
      IdentityCardNumber:idCard
    });
    
    if (result?.Source) {
      const { 
        Province = '', 
        City = '', 
        District = '' 
    } = result?.Source || {};
    const fullAddress = [Province, City, District]
        .filter(part => part?.trim())
        .join('');
        if (fullAddress) {
        form[CustomerFields.ADDRESS] = fullAddress;
      }
    }
  } catch (e) {
    showNotification('error', t('message.operationTitle'), t('message.pleaseTryAgainLater'));
  }
}, 500);

watch(
  () => form[CustomerFields.ID_NUMBER],
  (newVal) => {
    queryAddress(newVal.trim());
  }
);

onBeforeUnmount(() => {
  queryAddress.cancel();
});

const pagination = reactive({
  current: 1,
  pageSize: 15,
  total: 0,
  showSizeChanger: true,
  pageSizeOptions: ['15', '30', '50'],
  showTotal: total => t('message.totalRecords', { total })
});

const fetchCustomerData = async () => {
  loading.value = true;
  try {
    const result = await fetchCustomers({
      page: pagination.current,
      pageSize: pagination.pageSize,
      [CustomerFields.IS_DELETED]: 0,
    });
    if (result?.listSource){
      customers.value = result.listSource.map(item => ({
        [CustomerFields.ID]: item[CustomerFields.ID],
        [CustomerFields.NAME]: item[CustomerFields.NAME],
        [CustomerFields.GENDER]: item[CustomerFields.GENDER],
        [CustomerFields.GENDER_NAME]: item[CustomerFields.GENDER] === Gender.MALE 
          ? t('message.male') 
          : t('message.female'),
        [CustomerFields.BIRTH_DATE]: item[CustomerFields.BIRTH_DATE],
        [CustomerFields.TYPE]: item[CustomerFields.TYPE],
        [CustomerFields.TYPE_NAME]: item[CustomerFields.TYPE_NAME],
        [CustomerFields.PASSPORTTYPE]: item[CustomerFields.PASSPORTTYPE],
        [CustomerFields.PASSPORTNAME]: item[CustomerFields.PASSPORTNAME],
        [CustomerFields.ID_NUMBER]: item[CustomerFields.ID_NUMBER],
        [CustomerFields.PHONE]: item[CustomerFields.PHONE],
        [CustomerFields.ADDRESS]: item[CustomerFields.ADDRESS],
        [CustomerFields.IS_DELETED]: item[CustomerFields.IS_DELETE]
      }));
      pagination.total = result.total;
    }
  } catch (error) {
    showNotification('error', t('message.operationTitle'), t('message.pleaseTryAgainLater'));
  } finally {
    loading.value = false;
  }
};

const fetchSelectPassports = async () => {
  try {
    const result = await fetchCanUsePassports();
    passportTypeOptions.value = result.listSource.map((item) => ({
      label: item[PassportFields.NAME],
      value: item[PassportFields.NUMBER],
    }));
  } catch (error) {
    showNotification('error', t('message.fetchDataFailed'), t('message.pleaseTryAgainLater'));
  }
};

const fetchSelectCustoTypes = async () => {
  try {
    const result = await fetchCanUseCustomerTypes();
    customerTypeOptions.value = result.listSource.map((item) => ({
      label: item[CustomerTypeFields.NAME],
      value: item[CustomerTypeFields.NUMBER],
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
  form[CustomerFields.ID] = generateSnowflakeId({
      prefix: 'TS-',
      separator: null,
    });
  form[CustomerFields.NAME] = '';
  form[CustomerFields.GENDER] = null;
  form[CustomerFields.BIRTH_DATE] = null;
  form[CustomerFields.TYPE] = null;
  form[CustomerFields.PASSPORTTYPE] = null;
  form[CustomerFields.ID_NUMBER] = '';
  form[CustomerFields.PHONE] = '';
  form[CustomerFields.ADDRESS] = '';

  form.modifystatus = 'insert';
};

const refreshData = () => 
{
  fetchCustomerData();
};

const editCustomer = (record) => {
  modalVisible.value = true;
  modalTitle.value = t('message.updateDepartment');
  form[CustomerFields.ID] = record[CustomerFields.ID];
  form[CustomerFields.NAME] = record[CustomerFields.NAME];
  form[CustomerFields.GENDER] = record[CustomerFields.GENDER];
  form[CustomerFields.BIRTH_DATE] = record[CustomerFields.BIRTH_DATE] ? dayjs(record[CustomerFields.BIRTH_DATE]) : null;
  form[CustomerFields.TYPE] = record[CustomerFields.TYPE];
  form[CustomerFields.PASSPORTTYPE] = record[CustomerFields.PASSPORTTYPE];
  form[CustomerFields.ID_NUMBER] = record[CustomerFields.ID_NUMBER];
  form[CustomerFields.PHONE] = record[CustomerFields.PHONE];
  form[CustomerFields.ADDRESS] = record[CustomerFields.ADDRESS];

  form.modifystatus = 'update';
};

const handleModalOk = async () => {
  try {
    await formRef.value.validate();
    confirmLoading.value = true;
    if (form.modifystatus === 'update') {
      await updateCustomer({ ...form,[CustomerFields.BIRTH_DATE]:form[CustomerFields.BIRTH_DATE]?form[CustomerFields.BIRTH_DATE].format('YYYY-MM-DD'):null});
      showNotification('success', t('message.operationTitle') , t('message.updateSuccess'));
    } else {
      await addCustomer({ ...form,[CustomerFields.BIRTH_DATE]:form[CustomerFields.BIRTH_DATE]?form[CustomerFields.BIRTH_DATE].format('YYYY-MM-DD'):null});
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
    record[CustomerFields.IS_DELETED] = 1;
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