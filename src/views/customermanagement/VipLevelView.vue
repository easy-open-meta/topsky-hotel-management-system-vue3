<template>
  <div>
    <h1 style="margin-bottom: 15px;">{{ translatedPageTitle }}</h1>
    <a-button @click="refreshData" style="margin-bottom: 15px;margin-right: 15px;">{{ $t('message.refreshData') }}</a-button>
    <a-button type="primary" @click="showModal" style="margin-bottom: 15px;">{{ $t('message.insertVipRule') }}</a-button>
    <a-table :columns="filteredColumns" :data-source="viprules" :loading="loading" :pagination="pagination" @change="handleTableChange" @sorterChange="handleSorterChange" bordered>
      <template #bodyCell="{ column, record }">
        <template v-if="column.key === 'operation'">
          <a-button @click="editVipRule(record)" style="margin-right: 15px;">{{ $t('message.edit') }}</a-button>
            <a-popconfirm :title="t('message.areYouSureToDeleteRecord')" @confirm="handleDelete(record)">
            <a-button danger>{{ $t('message.delete') }}</a-button>
          </a-popconfirm>
        </template>
      </template>
    </a-table>

    <a-modal :open="modalVisible" :title="modalTitle" @ok="handleModalOk" @cancel="handleModalCancel" :confirm-loading="confirmLoading">
      <a-form :model="form" :rules="rules" ref="formRef">
        <a-form-item :label="vipruleIdLabel" name="RuleId">
          <a-input v-model:value="form.RuleId" type="hidden" />
          <span>{{ form.RuleId }}</span>
        </a-form-item>
        <a-form-item :label="vipruleNameLabel" name="RuleName">
          <a-input v-model:value="form.RuleName" />
        </a-form-item>
        <a-form-item :label="vipruleValueLabel" name="RuleValue">
          <a-input-number
            v-model:value="form.RuleValue"
            :min="0"
            prefix="￥"
          />
        </a-form-item>
        <a-form-item :label="vipruleCustomerTypeLabel" name="TypeId">
          <a-select
            v-model:value="form.TypeId"
            :options="custoTypeOptions"
            :placeholder="t('message.pleaseInputVipRuleCustomerType')"
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
import { fetchCustomerTypes } from '@/api/custotypeapi';
import { showNotification } from '@/utils/index';
import { useI18n } from 'vue-i18n';
import generateSnowflakeId from '@/utils/snowflake';

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

const form = reactive({
  RuleId: null,
  RuleName: '',
  RuleValue: null,
  TypeId: '',
  IsDelete: null,
  DataInsUsr: '',
  DataInsDate: null,
  DataChgUsr: '',
  DataChgDate: null,
  modifystatus: '',
});

const rules = {
  RuleId: [{ required: true, message: t('message.pleaseInputVipRuleId'), trigger: 'blur' }],
};

const vipruleIdLabel = computed(() => t('message.vipRuleId'));
const vipruleNameLabel = computed(() => t('message.vipRuleName'));
const vipruleValueLabel = computed(() => t('message.vipRuleValue'));
const vipruleCustomerTypeLabel = computed(() => t('message.vipRuleCustomerType'));

const columns = computed(() => [
  {
    title: t('message.vipRuleId'),
    dataIndex: 'RuleId',
    key: 'RuleId',
    sorter: (a, b) => a.RuleId.localeCompare(b.RuleId),
    defaultSortOrder: 'ascend'
  },
  {
    title: t('message.vipRuleName'),
    dataIndex: 'RuleName',
    key: 'RuleName',
  },
  {
    title: t('message.vipRuleValue'),
    dataIndex: 'RuleValue',
    key: 'RuleValue',
  },
  {
    title: t('message.vipRuleCustomerType'),
    dataIndex: 'TypeName',
    key: 'TypeName',
  },
  {
    title: t('message.vipRuleCustomerType'),
    dataIndex: 'TypeId',
    key: 'TypeId',
    hidden:true
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

const fetchVipRuleData = async () => {
  loading.value = true;
  try {
    const result = await fetchVipRules({
      page: pagination.current,
      pageSize: pagination.pageSize,
      isDelete: 0
    });
    viprules.value = result;
    pagination.total = result.length;
  } catch (error) {
    showNotification('error', t('message.operationTitle'), t('message.pleaseTryAgainLater'));
  } finally {
    loading.value = false;
  }
};

const fetchSelectCustomerTypes = async () => {
  try {
    const result = await fetchCustomerTypes();
    custoTypeOptions.value = result.map((item) => ({
      label: item.TypeName,
      value: item.UserType,
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
  form.RuleId = generateSnowflakeId({
      prefix: 'VR-',
      separator: null,
    });
  form.RuleName = '';
  form.RuleValue = null;
  form.TypeId = null;
  form.modifystatus = 'insert';
};

const refreshData = () => 
{
  fetchVipRuleData();
};

const editVipRule = (record) => {
  modalVisible.value = true;
  modalTitle.value = t('message.updateVipRule');
  form.RuleId = record.RuleId;
  form.RuleName = record.RuleName;
  form.RuleValue = record.RuleValue;
  form.TypeId = record.TypeId;
  form.IsDelete = record.IsDelete;
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
    record.isDelete = 1;
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