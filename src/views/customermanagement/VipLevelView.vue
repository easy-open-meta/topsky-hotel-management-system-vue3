<template>
  <div>
    <h1 style="margin-bottom: 15px;">{{ translatedPageTitle }}</h1>
    <a-button @click="refreshData" style="margin-bottom: 15px;margin-right: 15px;"><sync-outlined /> {{ $t('message.refreshData') }}</a-button>
    <a-button type="primary" @click="showModal" style="margin-bottom: 15px;"><plus-outlined /> {{ $t('message.insertVipRule') }}</a-button>
    <a-table :columns="filteredColumns" :data-source="viprules" :loading="loading" :pagination="pagination" @change="handleTableChange" @sorterChange="handleSorterChange" bordered>
      <template #bodyCell="{ column, record }">
        <template v-if="column.key === 'operation'">
          <a-button @click="editVipRule(record)" style="margin-right: 15px;"><edit-outlined /> {{ $t('message.edit') }}</a-button>
            <a-popconfirm :title="t('message.areYouSureToDeleteRecord')" @confirm="handleDelete(record)">
            <a-button danger><delete-outlined /> {{ $t('message.delete') }}</a-button>
          </a-popconfirm>
        </template>
        <template v-if="column.key === VipRuleFields.VALUE">
          {{ formatCurrency(record[VipRuleFields.VALUE]) }}
        </template>
      </template>
    </a-table>

    <a-modal :open="modalVisible" :title="modalTitle" @ok="handleModalOk" @cancel="handleModalCancel" :confirm-loading="confirmLoading">
      <a-form :model="form" :rules="rules" ref="formRef">
        <a-form-item :label="vipruleIdLabel" :name="VipRuleFields.ID">
          <span>{{ form[VipRuleFields.ID] }}</span>
        </a-form-item>
        
        <a-form-item :label="vipruleNameLabel" :name="VipRuleFields.NAME">
          <a-input v-model:value="form[VipRuleFields.NAME]" />
        </a-form-item>
        
        <a-form-item :label="vipruleValueLabel" :name="VipRuleFields.VALUE">
          <a-input-number
            v-model:value="form[VipRuleFields.VALUE]"
            :min="0"
            :precision="2"
            :formatter="value => `￥ ${value}`"
          />
        </a-form-item>
        
        <a-form-item :label="vipruleCustomerTypeLabel" :name="VipRuleFields.CUSTOMER_TYPE_ID">
          <a-select
            v-model:value="form[VipRuleFields.CUSTOMER_TYPE_ID]"
            :options="custoTypeOptions"
            :placeholder="t('message.pleaseInputVipRuleCustomerType')"
            show-search
            option-filter-prop="label"
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
import { fetchVipRules, addVipRule, updateVipRule, deleteVipRule } from '@/api/vipruleapi';
import { 
  VipRuleFields,
  initialFormValues,
  getColumns,
  getFormRules
} from '@/entities/viprule.entity';
import { fetchCustomerTypes } from '@/api/custotypeapi';
import { showNotification } from '@/utils/index';
import { useI18n } from 'vue-i18n';
import generateSnowflakeId from '@/utils/snowflake';
import { formatCurrency } from '@/utils/index';

const { t } = useI18n();
const route = useRoute();
const pageTitleKey = computed(() => getPageTitle(route.path));
const translatedPageTitle = computed(() => t(pageTitleKey.value));
const loading = ref(false);
const viprules = ref([]);
const modalVisible = ref(false);
const modalTitle = ref('');
const confirmLoading = ref(false);
const formRef = ref(null);
const sortedInfo = ref({ order: null, columnKey: null });
const custoTypeOptions = ref([]);

const form = reactive({ ...initialFormValues });

const rules = getFormRules(t);

const vipruleIdLabel = computed(() => t('message.vipRuleId'));
const vipruleNameLabel = computed(() => t('message.vipRuleName'));
const vipruleValueLabel = computed(() => t('message.vipRuleValue'));
const vipruleCustomerTypeLabel = computed(() => t('message.vipRuleCustomerType'));

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

const fetchVipRuleData = async () => {
  loading.value = true;
  try {
    const result = await fetchVipRules({
      page: pagination.current,
      pageSize: pagination.pageSize,
      [VipRuleFields.IS_DELETED]: 0,
    });
    if (result?.listSource) {
      viprules.value = result.listSource.map(item => ({
      [VipRuleFields.ID]: item[VipRuleFields.ID],
      [VipRuleFields.NAME]: item[VipRuleFields.NAME],
      [VipRuleFields.VALUE]: item[VipRuleFields.VALUE],
      [VipRuleFields.CUSTOMER_TYPE_ID]: item[VipRuleFields.CUSTOMER_TYPE_ID],
      [VipRuleFields.CUSTOMER_TYPE_NAME]: item[VipRuleFields.CUSTOMER_TYPE_NAME]
    }));
    pagination.total = result.total;
    }
  } catch (error) {
    showNotification('error', t('message.operationTitle'), t('message.pleaseTryAgainLater'));
  } finally {
    loading.value = false;
  }
};

const fetchSelectCustomerTypes = async () => {
  try {
    const result = await fetchCustomerTypes({
      [VipRuleFields.IS_DELETED]: 0,
      [VipRuleFields.IGNOREPAGING]: true,
    });
    custoTypeOptions.value = result.listSource.map((item) => ({
      label: item.CustomerTypeName,
      value: item.CustomerType,
    }));
  } catch (error) {
    showNotification('error', t('message.fetchDataFailed'), t('message.pleaseTryAgainLater'));
  }
};

onMounted(() => {
  fetchVipRuleData();
  fetchSelectCustomerTypes();
});

const showModal = () => {
  modalVisible.value = true;
  modalTitle.value = t('message.insertVipRule');
  form[VipRuleFields.ID] = generateSnowflakeId({
      prefix: 'VR-',
      separator: null,
    });
  form[VipRuleFields.NAME] = '';
  form[VipRuleFields.VALUE] = null;
  form[VipRuleFields.CUSTOMER_TYPE_ID] = null;
  form.modifystatus = 'insert';
};

const refreshData = () => 
{
  fetchVipRuleData();
};

const editVipRule = (record) => {
  modalVisible.value = true;
  modalTitle.value = t('message.updateVipRule');
  form[VipRuleFields.ID] = record[VipRuleFields.ID];
  form[VipRuleFields.NAME] = record[VipRuleFields.NAME];
  form[VipRuleFields.VALUE] = record[VipRuleFields.VALUE];
  form[VipRuleFields.CUSTOMER_TYPE_ID] = record[VipRuleFields.CUSTOMER_TYPE_ID];
  form[VipRuleFields.IS_DELETED] = record[[VipRuleFields.IS_DELETED]];
  form.modifystatus = 'update';
};

const handleModalOk = async () => {
  try {
    await formRef.value.validate();
    confirmLoading.value = true;
    if (form.modifystatus === 'update') {
      await updateVipRule({ ...form});
      showNotification('success', t('message.operationTitle') , t('message.updateSuccess'));
    } else {
      await addVipRule({ ...form});
      showNotification('success', t('message.operationTitle') , t('message.addSuccess'));
    }
    modalVisible.value = false;
    fetchVipRuleData();
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
    record[VipRuleFields.IS_DELETED] = 1;
    await deleteVipRule(record);
    showNotification('success', t('message.operationTitle'), t('message.deleteSuccess'));
    fetchVipRuleData();
  } catch (error) {
    console.error('Delete error:', error);
    showNotification('error', t('message.operationTitle'), t('message.pleaseTryAgainLater'));
  }
};

const handleTableChange = (newPagination) => {
  pagination.current = newPagination.current;
  pagination.pageSize = newPagination.pageSize;
  fetchVipRuleData();
};

const handleSorterChange = (pagination, filters, sorter) => {
  sortedInfo.value = sorter;
};
</script>