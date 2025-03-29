<template>
  <div>
    <h1 style="margin-bottom: 15px;">{{ translatedPageTitle }}</h1>
    <a-button @click="refreshData" style="margin-bottom: 15px;margin-right: 15px;"><sync-outlined /> {{ $t('message.refreshData') }}</a-button>
    <a-table :columns="filteredColumns" :data-source="spends" :loading="loading" :pagination="pagination" @change="handleTableChange" @sorterChange="handleSorterChange" bordered>
      <template #bodyCell="{ column, record }">
        <template v-if="column.key === 'operation'">
          <a-button @click="editSpend(record)" style="margin-right: -5px;"><edit-outlined /> {{ $t('message.edit') }}</a-button>
        </template>
        <template v-else-if="column.key === SpendInfoFields.STATE">
          <a-tag :color="getStateColor(record[SpendInfoFields.STATE])">
            {{ record[SpendInfoFields.STATE_NAME] }}
          </a-tag>
        </template>
      </template>
    </a-table>

    <a-modal :open="modalVisible" :title="modalTitle" @ok="handleModalOk" @cancel="handleModalCancel" :confirm-loading="confirmLoading">
      <a-form :model="form" :rules="rules" ref="formRef" layout="vertical">
        <a-row :gutter="24">
          <a-col :span="12">
            <a-form-item :label="roomNoLabel" :name="SpendInfoFields.ROOM_NO">
              <a-input 
                v-model:value="form[SpendInfoFields.ROOM_NO]" 
                disabled
              />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item :label="customerNoLabel" :name="SpendInfoFields.CUSTO_NO">
              <a-input 
                v-model:value="form[SpendInfoFields.CUSTO_NO]"
                disabled
              />
            </a-form-item>
          </a-col>
        </a-row>

        <a-form-item :label="spendNameLabel" :name="SpendInfoFields.NAME">
          <a-input
            v-model:value="form[SpendInfoFields.NAME]"
            :placeholder="t('message.pleaseEnter')"
          />
        </a-form-item>

        <a-row :gutter="24">
          <a-col :span="8">
            <a-form-item :label="spendAmountLabel" :name="SpendInfoFields.AMOUNT">
              <a-input-number
                v-model:value="form[SpendInfoFields.AMOUNT]"
                :min="1"
                :precision="0"
                class="full-width"
              />
            </a-form-item>
          </a-col>
          <a-col :span="8">
            <a-form-item :label="spendPriceLabel" :name="SpendInfoFields.PRICE">
              <a-input-number
                v-model:value="form[SpendInfoFields.PRICE]"
                :min="0"
                :precision="2"
                class="full-width"
                :formatter="value => `￥ ${value}`"
              />
            </a-form-item>
          </a-col>
          <a-col :span="8">
            <a-form-item :label="spendMoneyLabel" :name="SpendInfoFields.MONEY">
              <a-input-number
                v-model:value="form[SpendInfoFields.MONEY]"
                :min="0"
                :precision="2"
                class="full-width"
                :formatter="value => `￥ ${value}`"
              />
            </a-form-item>
          </a-col>
        </a-row>

        <a-form-item :label="spendTimeLabel" :name="SpendInfoFields.TIME">
          <a-date-picker
            v-model:value="form[SpendInfoFields.TIME]"
            :format="DATE_FORMAT"
            class="full-width"
            show-time
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
import { fetchSpendInfos, addSpendInfo, updateSpendInfo } from '@/api/spendinfoapi';
import { 
  SpendInfoFields,
  SpendState,
  DATE_FORMAT,
  initialFormValues,
  getColumns,
  getFormRules,
  StateColors
} from '@/entities/spendinfo.entity';
import { formatDate,showNotification } from '@/utils/index';
import { useI18n } from 'vue-i18n';
import dayjs from 'dayjs';

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

const form = reactive({ ...initialFormValues });

const rules = getFormRules(t);

const roomNoLabel = computed(() => t('message.roomNo'));
const customerNoLabel = computed(() => t('message.customerNo'));
const spendNameLabel = computed(() => t('message.spendName'));
const spendAmountLabel = computed(() => t('message.spendAmount'));
const spendPriceLabel = computed(() => t('message.spendPrice'));
const spendMoneyLabel = computed(() => t('message.spendMoney'));
const spendTimeLabel = computed(() => t('message.spendTime'));

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

const getStateColor = (state) => StateColors[state] || '#888';

const fetchSpendInfoData = async () => {
  loading.value = true;
  try {
    const result = await fetchSpendInfos({
      page: pagination.current,
      pageSize: pagination.pageSize,
      [SpendInfoFields.IS_DELETED]: 0,
    });
    if(result?.listSource){
    spends.value = result.listSource.map(item => ({
      [SpendInfoFields.ROOM_NO]: item[SpendInfoFields.ROOM_NO],
      [SpendInfoFields.CUSTO_NO]: item[SpendInfoFields.CUSTO_NO],
      [SpendInfoFields.NAME]: item[SpendInfoFields.NAME],
      [SpendInfoFields.AMOUNT]: item[SpendInfoFields.AMOUNT],
      [SpendInfoFields.PRICE]: item[SpendInfoFields.PRICE],
      [SpendInfoFields.MONEY]: item[SpendInfoFields.MONEY],
      [SpendInfoFields.PRICEFORMATTED]: item[SpendInfoFields.PRICEFORMATTED],
      [SpendInfoFields.MONEYFORMATTED]: item[SpendInfoFields.MONEYFORMATTED],
      [SpendInfoFields.TIME]: item[SpendInfoFields.TIME],
      [SpendInfoFields.STATE]: item[SpendInfoFields.STATE],
      [SpendInfoFields.STATE_NAME]: item[SpendInfoFields.STATE_NAME],
    }));
    pagination.total = result.total;
    }
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
  form[SpendInfoFields.ROOM_NO] = record[SpendInfoFields.ROOM_NO];
  form[SpendInfoFields.CUSTO_NO] = record[SpendInfoFields.CUSTO_NO];
  form[SpendInfoFields.NAME] = record[SpendInfoFields.NAME];
  form[SpendInfoFields.AMOUNT] = record[SpendInfoFields.AMOUNT];
  form[SpendInfoFields.PRICE] = record[SpendInfoFields.PRICE];
  form[SpendInfoFields.MONEY] = record[SpendInfoFields.MONEY];
  form[SpendInfoFields.TIME] = record[SpendInfoFields.TIME] ? dayjs(record[SpendInfoFields.TIME]) : null;
  form[SpendInfoFields.STATE] = record[SpendInfoFields.STATE];
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