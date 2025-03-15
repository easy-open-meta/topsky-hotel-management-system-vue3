<template>
  <div>
    <h1 style="margin-bottom: 15px;">{{ translatedPageTitle }}</h1>
    <a-button @click="refreshData" style="margin-bottom: 15px;margin-right: 15px;">{{ $t('message.refreshData') }}</a-button>
    <a-button type="primary" @click="showModal" style="margin-bottom: 15px;">{{ $t('message.insertNation') }}</a-button>
    <a-table :columns="columns" :data-source="nations" :loading="loading" :pagination="pagination" @change="handleTableChange" @sorterChange="handleSorterChange" bordered>
      <template #bodyCell="{ column, record }">
        <template v-if="column.key === 'operation'">
          <a-button @click="editNation(record)" style="margin-right: 15px;">{{ $t('message.edit') }}</a-button>
            <a-popconfirm :title="t('message.areYouSureToDeleteRecord')" @confirm="handleDelete(record)">
            <a-button danger>{{ $t('message.delete') }}</a-button>
          </a-popconfirm>
        </template>
      </template>
    </a-table>

    <a-modal :open="modalVisible" :title="modalTitle" @ok="handleModalOk" @cancel="handleModalCancel" :confirm-loading="confirmLoading">
      <a-form :model="form" :rules="rules" ref="formRef">
        <a-form-item :label="nationNoLabel" :name="NationFields.NUMBER">
          <a-input v-model:value="form[NationFields.NUMBER]" type="hidden" />
          <span>{{ form[NationFields.NUMBER] }}</span>
        </a-form-item>
        <a-form-item :label="nationNameLabel" :name="NationFields.NAME">
          <a-input v-model:value="form[NationFields.NAME]" />
        </a-form-item>
      </a-form>
    </a-modal>
  </div>
</template>

<script setup>
import { ref, onMounted, computed, reactive } from 'vue';
import { useRoute } from 'vue-router';
import { getPageTitle } from '@/utils/pageTitle';
import { showNotification } from '@/utils/index';
import { fetchNations, addNation, updateNation, deleteNation } from '@/api/nationapi';
import { 
  NationFields, 
  initialFormValues, 
  getColumns, 
  getFormRules 
} from '@/entities/nation.entity';
import { useI18n } from 'vue-i18n';
import generateSnowflakeId from '@/utils/snowflake';

const { t } = useI18n();
const route = useRoute();
const pageTitleKey = computed(() => getPageTitle(route.path));
const translatedPageTitle = computed(() => t(pageTitleKey.value));
const loading = ref(false);
const nations = ref([]);
const modalVisible = ref(false);
const modalTitle = ref('');
const confirmLoading = ref(false);
const formRef = ref(null);
const sortedInfo = ref({ order: null, columnKey: null });

const form = reactive({ ...initialFormValues });

const rules = getFormRules(t);

const nationNoLabel = computed(() => t('message.nationNo'));
const nationNameLabel = computed(() => t('message.nationName'));

const columns = computed(() => getColumns(t));

const pagination = reactive({
  current: 1,
  pageSize: 15,
  total: 0,
  showSizeChanger: true,
  pageSizeOptions: ['15', '20', '50'],
  showTotal: (total) => `共 ${total} 条`
});

const fetchNationData = async () => {
  loading.value = true;
  try {
    const result = await fetchNations({
      page: pagination.current,
      pageSize: pagination.pageSize, 
      [NationFields.IS_DELETE]: 0
    });
    if (result?.listSource) {
      nations.value = result.listSource.map(item => ({
      [NationFields.NUMBER]: item[NationFields.NUMBER],
      [NationFields.NAME]: item[NationFields.NAME]
    }));
      pagination.total = result.total;
    } else {
      throw new Error('数据格式错误');
    }
  } catch (error) {
    showNotification('error', t('message.operationTitle'), t('message.pleaseTryAgainLater'));
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  fetchNationData();
});

const showModal = () => {
  modalVisible.value = true;
  modalTitle.value = t('message.insertNation');
  form[NationFields.NUMBER] = generateSnowflakeId({
      prefix: 'N-',
      separator: null,
    });
  form[NationFields.NAME] = '';
  form.modifystatus = 'insert';
};

const refreshData = () => 
{
  fetchNationData();
};

const editNation = (record) => {
  modalVisible.value = true;
  modalTitle.value = t('message.updateNation');
  form[NationFields.NUMBER] = record[NationFields.NUMBER];
  form[NationFields.NAME] = record[NationFields.NAME];
  form.modifystatus = 'update';
};

const handleModalOk = async () => {
  try {
    await formRef.value.validate();
    confirmLoading.value = true;
    if (form.modifystatus === 'update') {
      await updateNation({ ...form});
      showNotification('success', t('message.operationTitle') , t('message.updateSuccess'));
    } else {
      await addNation({ ...form});
      showNotification('success', t('message.operationTitle') , t('message.addSuccess'));
    }
    modalVisible.value = false;
    fetchNationData();
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
    record[NationFields.IS_DELETE] = 1;
    await deleteNation(record);
    showNotification('success', t('message.operationTitle'), t('message.deleteSuccess'));
    fetchNationData();
  } catch (error) {
    console.error('Delete error:', error);
    showNotification('error', t('message.operationTitle'), t('message.pleaseTryAgainLater'));
  }
};

const handleTableChange = (newPagination) => {
  pagination.current = newPagination.current;
  pagination.pageSize = newPagination.pageSize;
  fetchNationData();
};

const handleSorterChange = (pagination, filters, sorter) => {
  sortedInfo.value = sorter;
};
</script>