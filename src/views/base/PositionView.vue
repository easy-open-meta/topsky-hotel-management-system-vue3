<template>
  <div>
    <h1 style="margin-bottom: 15px;">{{ translatedPageTitle }}</h1>
    <a-button @click="refreshData" style="margin-bottom: 15px;margin-right: 15px;"><sync-outlined /> {{ $t('message.refreshData') }}</a-button>
    <a-button type="primary" @click="showModal" style="margin-bottom: 15px;"><plus-outlined /> {{ $t('message.insertPosition') }}</a-button>
    <a-table :columns="columns" :data-source="positions" :loading="loading" :pagination="pagination" @change="handleTableChange" @sorterChange="handleSorterChange" bordered>
      <template #bodyCell="{ column, record }">
        <template v-if="column.key === 'operation'">
          <a-button @click="editPosition(record)" style="margin-right: 15px;"><edit-outlined /> {{ $t('message.edit') }}</a-button>
            <a-popconfirm :title="t('message.areYouSureToDeleteRecord')" @confirm="handleDelete(record)">
            <a-button danger><delete-outlined /> {{ $t('message.delete') }}</a-button>
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
import { showErrorNotification, showSuccessNotification } from '@/utils/index';
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

const pagination = reactive({
    current: 1,
    pageSize: 15,
    total: 0,
    showSizeChanger: true,
    pageSizeOptions: ['15', '30', '50'],
    showTotal: total => t('message.totalRecords', { total })
  });

const fetchPositionData = async () => {
  loading.value = true;
  try {
    const result = await fetchPositions({
      page: pagination.current,
      pageSize: pagination.pageSize,
      [PositionFields.IS_DELETED]: 0
    });
    if (result?.listSource) {
      positions.value = result.listSource.map(item => ({
      [PositionFields.NUMBER]: item[PositionFields.NUMBER],
      [PositionFields.NAME]: item[PositionFields.NAME]
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
      var response = await updatePosition({ ...form});
      if(response && response.StatusCode === 200)
      {
        showSuccessNotification('success', t('message.operationTitle') , t('message.updateSuccess'));
      }
      else
      {
        showErrorNotification('error', t('message.operationTitle'), t('message.pleaseTryAgainLater'));
      }
    } else {
      var response = await addPosition({ ...form});
      if(response && response.StatusCode === 200)
      {
        showSuccessNotification('success', t('message.operationTitle') , t('message.addSuccess'));
      }
      else
      {
        showErrorNotification('error', t('message.operationTitle'), t('message.pleaseTryAgainLater'));
      }
    }
    modalVisible.value = false;
    fetchPositionData();
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
    record[PositionFields.IS_DELETED] = 1;
    var response = await deletePosition(record);
    if(response && response.StatusCode === 200)
    {
      showSuccessNotification('success', t('message.operationTitle'), t('message.deleteSuccess'));
    }
    else
    {
      showErrorNotification('error', t('message.operationTitle'), t('message.pleaseTryAgainLater'));
    }
    fetchPositionData();
  } catch (error) {
    showErrorNotification(error.message || t('message.pleaseTryAgainLater'));
  }
};

const handleTableChange = (newPagiposition) => {
  pagination.current = newPagiposition.current;
  pagination.pageSize = newPagiposition.pageSize;
  fetchPositionData();
};

const handleSorterChange = (pagination, filters, sorter) => {
  sortedInfo.value = sorter;
};
</script>