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
        <a-form-item :label="positionNoLabel" name="position_no">
          <a-input v-model:value="form.position_no" type="hidden" />
          <span>{{ form.position_no }}</span>
        </a-form-item>
        <a-form-item :label="positionNameLabel" name="position_name">
          <a-input v-model:value="form.position_name" />
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

const form = reactive({
  position_no: null,
  position_name: '',
  delete_mk: 0,
  datains_usr: '',
  datains_date: null,
  datachg_usr: '',
  datachg_date: null,
  modifystatus: '',
});

const rules = {
  position_name: [{ required: true, message: t('message.pleaseInputPositionName'), trigger: 'blur' }],
};

const positionNoLabel = computed(() => t('message.positionNo'));
const positionNameLabel = computed(() => t('message.positionName'));

const columns = computed(() => [
  {
    title: t('message.positionNo'),
    dataIndex: 'position_no',
    key: 'position_no',
    sorter: (a, b) => a.position_no.localeCompare(b.position_no),
    defaultSortOrder: 'ascend'
  },
  {
    title: t('message.positionName'),
    dataIndex: 'position_name',
    key: 'position_name',
  },
  {
    title: t('message.operation'),
    key: 'operation',
  },
]);

const pagiposition = reactive({
  current: 1,
  pageSize: 10,
  total: 0,
});

const fetchPositionData = async () => {
  loading.value = true;
  try {
    const result = await fetchPositions({
      page: pagiposition.current,
      pageSize: pagiposition.pageSize,
      delete_mk: 0
    });
    positions.value = result;
    pagiposition.total = result.length;
  } catch (error) {
    showNotification('error', t('message.operationTitle'), t('message.pleaseTryAgainLater'));
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
  form.position_no = generateSnowflakeId({
      prefix: 'P-',
      separator: null,
    });
  form.position_name = '';
  form.delete_mk = 0;
  form.modifystatus = 'insert';
};

const refreshData = () => 
{
  fetchPositionData();
};

const editPosition = (record) => {
  modalVisible.value = true;
  modalTitle.value = t('message.updatePosition');
  form.position_no = record.position_no;
  form.position_name = record.position_name;
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
    record.delete_mk = 1;
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