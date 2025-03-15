<template>
  <div>
    <h1 style="margin-bottom: 15px;">{{ translatedPageTitle }}</h1>
    <a-button @click="refreshData" style="margin-bottom: 15px;margin-right: 15px;">{{ $t('message.refreshData') }}</a-button>
    <a-button type="primary" @click="showModal" style="margin-bottom: 15px;">{{ $t('message.insertPosition') }}</a-button>
    <a-table :columns="columns" :data-source="positions" :loading="loading" :pagiposition="pagiposition" @change="handleTableChange" @sorterChange="handleSorterChange" bordered>
      <template #bodyCell="{ column, record }">
        <template v-if="column.key === 'operation'">
          <a-button @click="editPosition(record)" style="margin-right: 15px;">{{ $t('message.edit') }}</a-button>
            <a-popconfirm :title="t('message.areYouSureToDeleteRecord')" @confirm="handleDelete(record)">
            <a-button danger>{{ $t('message.delete') }}</a-button>
          </a-popconfirm>
        </template>
      </template>
    </a-table>

    <a-modal :open="modalVisible" :title="modalTitle" @ok="handleModalOk" @cancel="handleModalCancel" :confirm-loading="confirmLoading">
      <a-form :model="form" :rules="rules" ref="formRef">
        <a-form-item :label="positionNoLabel" :name="PositionFields.NUMBER">
          <a-input v-model:value="form[PositionFields.NUMBER]" type="hidden" />
          <span>{{ form[PositionFields.NUMBER] }}</span>
        </a-form-item>
        <a-form-item :label="positionNameLabel" :name="PositionFields.NAME">
          <a-input v-model:value="form[PositionFields.NAME]" />
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
import { fetchPositions, addPosition, updatePosition, deletePosition } from '@/api/positionapi';
import { 
  PositionFields, 
  initialFormValues, 
  getColumns, 
  getFormRules 
} from '@/entities/position.entity';
import { useI18n } from 'vue-i18n';
import generateSnowflakeId from '@/utils/snowflake';

const { t } = useI18n();
const route = useRoute();
const pageTitleKey = computed(() => getPageTitle(route.path));
const translatedPageTitle = computed(() => t(pageTitleKey.value));
const loading = ref(false);
const positions = ref([]);
const modalVisible = ref(false);
const modalTitle = ref('');
const confirmLoading = ref(false);
const formRef = ref(null);
const sortedInfo = ref({ order: null, columnKey: null });

const form = reactive({ ...initialFormValues });

const rules = getFormRules(t);

const positionNoLabel = computed(() => t('message.positionNo'));
const positionNameLabel = computed(() => t('message.positionName'));

const columns = computed(() => getColumns(t));

const pagiposition = reactive({
  current: 1,
  pageSize: 15,
  total: 0,
  showSizeChanger: true,
  pageSizeOptions: ['15', '20', '50'],
  showTotal: (total) => `共 ${total} 条`
});

const fetchPositionData = async () => {
  loading.value = true;
  try {
    const result = await fetchPositions({
      page: pagiposition.current,
      pageSize: pagiposition.pageSize,
      [PositionFields.IS_DELETE]: 0
    });
    if (result?.listSource) {
      positions.value = result.listSource.map(item => ({
      [PositionFields.NUMBER]: item[PositionFields.NUMBER],
      [PositionFields.NAME]: item[PositionFields.NAME]
    }));
      pagiposition.total = result.total;
    } else {
      throw new Error('数据格式错误');
    }
  } catch (error) {
    showNotification('error', t('message.operationTitle'), error.message || t('message.pleaseTryAgainLater'));
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  fetchPositionData();
});

const showModal = () => {
  modalVisible.value = true;
  modalTitle.value = t('message.insertPosition');
  form[PositionFields.NUMBER] = generateSnowflakeId({
      prefix: 'P-',
      separator: null,
    });
  form[PositionFields.NAME] = '';
  form.isDelete = 0;
  form.modifystatus = 'insert';
};

const refreshData = () => 
{
  fetchPositionData();
};

const editPosition = (record) => {
  console.log(record);
  modalVisible.value = true;
  modalTitle.value = t('message.updatePosition');
  form[PositionFields.NUMBER] = record.PositionNumber;
  form[PositionFields.NAME] = record.PositionName;
  form.modifystatus = 'update';
};

const handleModalOk = async () => {
  try {
    await formRef.value.validate();
    confirmLoading.value = true;
    if (form.modifystatus === 'update') {
      await updatePosition({ ...form});
      showNotification('success', t('message.operationTitle') , t('message.updateSuccess'));
    } else {
      await addPosition({ ...form});
      showNotification('success', t('message.operationTitle') , t('message.addSuccess'));
    }
    modalVisible.value = false;
    fetchPositionData();
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
    record[PositionFields.IS_DELETE] = 1;
    await deletePosition(record);
    showNotification('success', t('message.operationTitle'), t('message.deleteSuccess'));
    fetchPositionData();
  } catch (error) {
    console.error('Delete error:', error);
    showNotification('error', t('message.operationTitle'), t('message.pleaseTryAgainLater'));
  }
};

const handleTableChange = (newPagiposition) => {
  pagiposition.current = newPagiposition.current;
  pagiposition.pageSize = newPagiposition.pageSize;
  fetchPositionData();
};

const handleSorterChange = (pagiposition, filters, sorter) => {
  sortedInfo.value = sorter;
};
</script>