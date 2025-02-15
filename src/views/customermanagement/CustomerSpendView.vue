<template>
  <div>
    <h1 style="margin-bottom: 15px;">{{ translatedPageTitle }}</h1>
    <a-button @click="refreshData" style="margin-bottom: 15px;margin-right: 15px;">{{ $t('message.refreshData') }}</a-button>
    <a-table :columns="filteredColumns" :data-source="spends" :loading="loading" :pagination="pagination" @change="handleTableChange" @sorterChange="handleSorterChange" bordered>
      <template #bodyCell="{ column, record }">
        <template v-if="column.key === 'operation'">
          <a-button @click="editSpend(record)" style="margin-right: 15px;">{{ $t('message.edit') }}</a-button>
        </template>
        <template v-else-if="column.key === 'SpendTime'">
          {{ formatDate(record.SpendTime) }}
        </template>
      </template>
    </a-table>

    <a-modal :open="modalVisible" :title="modalTitle" @ok="handleModalOk" @cancel="handleModalCancel" :confirm-loading="confirmLoading">
      <a-form :model="form" :rules="rules" ref="formRef">
        <a-form-item :label="roomNoLabel" name="RoomNo">
          <a-input v-model:value="form.RoomNo" disabled />
        </a-form-item>
        <a-form-item :label="customerNoLabel" name="CustoNo">
          <a-input v-model:value="form.CustoNo" disabled />
        </a-form-item>
        <a-form-item :label="spendNameLabel" name="SpendName">
          <a-input v-model:value="form.SpendName" />
        </a-form-item>
        <a-form-item :label="spendAmountLabel" name="SpendAmount">
          <a-input-number
            v-model:value="form.SpendAmount"
            :min="1"
          />
        </a-form-item>
        <a-form-item :label="spendPriceLabel" name="SpendPrice">
          <a-input-number
            v-model:value="form.SpendPrice"
            :min="0"
            prefix="￥"
          />
        </a-form-item>
        <a-form-item :label="spendMoneyLabel" name="SpendMoney">
          <a-input-number
            v-model:value="form.SpendMoney"
            :min="0"
            prefix="￥"
          />
        </a-form-item>
        <a-form-item :label="spendTimeLabel" name="SpendTime">
          <a-date-picker v-model:value="form.SpendTime" />
        </a-form-item>
      </a-form>
    </a-modal>
  </div>
</template>

<script setup>
import { ref, onMounted, computed, reactive } from 'vue';
import { useRoute } from 'vue-router';
import { getPageTitle } from '@/utils/pageTitle';
import { fetchSpendInfos, addSpendInfo, updateSpendInfo } from '@/api/spendinfoapi';
import { formatDate,showNotification } from '@/utils/index';
import { useI18n } from 'vue-i18n';
import moment from 'moment';

const { t } = useI18n();
const route = useRoute();
const pageTitleKey = computed(() => getPageTitle(route.path));
const translatedPageTitle = computed(() => t(pageTitleKey.value));
const loading = ref(false);
const spends = ref([]);
const modalVisible = ref(false);
const modalTitle = ref('');
const confirmLoading = ref(false);
const formRef = ref(null);
const sortedInfo = ref({ order: null, columnKey: null });

const form = reactive({
  RoomNo: null,
  CustoNo: null,
  SpendName: null,
  SpendAmount: null,
  SpendPrice: null,
  SpendMoney: null,
  SpendTime: null,
  SpendState: null,
  IsDelete: null,
  DataInsUsr: '',
  DataInsDate: null,
  DataChgUsr: '',
  DataChgDate: null,
  modifystatus: '',
});

const rules = {
  SpendName: [{ required: true, message: t('message.pleaseInputSpendName'), trigger: 'blur' }],
  SpendAmount: [{ required: true, message: t('message.pleaseInputSpendAmount'), trigger: 'blur' }],
  SpendPrice: [{ required: true, message: t('message.pleaseInputSpendAmount'), trigger: 'blur' }],
  SpendMoney: [{ required: true, message: t('message.pleaseInputSpendMoney'), trigger: 'blur' }],
  SpendTime: [{ required: true, message: t('message.pleaseInputSpendTime'), trigger: 'blur' }],
};

const roomNoLabel = computed(() => t('message.roomNo'));
const customerNoLabel = computed(() => t('message.customerNo'));
const spendNameLabel = computed(() => t('message.spendName'));
const spendAmountLabel = computed(() => t('message.spendAmount'));
const spendPriceLabel = computed(() => t('message.spendPrice'));
const spendMoneyLabel = computed(() => t('message.spendMoney'));
const spendTimeLabel = computed(() => t('message.spendTime'));

const columns = computed(() => [
  {
    title: t('message.roomNo'),
    dataIndex: 'RoomNo',
    key: 'RoomNo',
  },
  {
    title: t('message.customerNo'),
    dataIndex: 'CustoNo',
    key: 'CustoNo',
  },
  {
    title: t('message.spendName'),
    dataIndex: 'SpendName',
    key: 'SpendName',
  },
  {
    title: t('message.spendAmount'),
    dataIndex: 'SpendAmount',
    key: 'SpendAmount',
  },
  {
    title: t('message.spendPrice'),
    dataIndex: 'SpendPrice',
    key: 'SpendPrice'
  },
  {
    title: t('message.spendMoney'),
    dataIndex: 'SpendMoney',
    key: 'SpendMoney'
  },
  {
    title: t('message.spendTime'),
    dataIndex: 'SpendTime',
    key: 'SpendTime'
  },
  {
    title: t('message.moneyState'),
    dataIndex: 'MoneyState',
    key: 'MoneyState',
    hidden: true
  },
  {
    title: t('message.moneyState'),
    dataIndex: 'SpendStateNm',
    key: 'SpendStateNm'
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

const fetchSpendInfoData = async () => {
  loading.value = true;
  try {
    const result = await fetchSpendInfos({
      page: pagination.current,
      pageSize: pagination.pageSize,
      isDelete: 0
    });
    spends.value = result;
    pagination.total = result.length;
  } catch (error) {
    showNotification('error', t('message.operationTitle'), t('message.pleaseTryAgainLater'));
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  fetchSpendInfoData();
});

const refreshData = () => 
{
  fetchSpendInfoData();
};

const editSpend = (record) => {
  modalVisible.value = true;
  modalTitle.value = t('message.updateSpend');
  form.RoomNo = record.RoomNo;
  form.CustoNo = record.CustoNo;
  form.SpendName = record.SpendName;
  form.SpendAmount = record.SpendAmount;
  form.SpendPrice = record.SpendPrice;
  form.SpendMoney = record.SpendMoney;
  form.SpendTime = record.SpendTime ? moment(record.SpendTime) : null;
  form.SpendState = record.SpendState;
  form.modifystatus = 'update';
};

const handleModalOk = async () => {
  try {
    await formRef.value.validate();
    confirmLoading.value = true;
    if (form.modifystatus === 'update') {
      await updateSpendInfo({ ...form});
      showNotification('success', t('message.operationTitle') , t('message.updateSuccess'));
    }
    modalVisible.value = false;
    fetchSpendInfoData();
  } catch (error) {
    showNotification('error', t('message.operationTitle'), t('message.pleaseTryAgainLater'));
  } finally {
    confirmLoading.value = false;
  }
};

const handleModalCancel = () => {
  modalVisible.value = false;
};

const handleTableChange = (newPagination) => {
  pagination.current = newPagination.current;
  pagination.pageSize = newPagination.pageSize;
  fetchSpendInfoData();
};

const handleSorterChange = (pagination, filters, sorter) => {
  sortedInfo.value = sorter;
};
</script>