<template>
  <div>
    <h1 style="margin-bottom: 15px;">{{ translatedPageTitle }}</h1>
    <a-button @click="refreshData" style="margin-bottom: 15px;margin-right: 15px;">{{ $t('message.refreshData') }}</a-button>
    <a-button type="primary" @click="showModal" style="margin-bottom: 15px;">{{ $t('message.insertRoomConfig') }}</a-button>
    <a-table :columns="columns" :data-source="roomconfigs" :loading="loading" :pagination="pagination" @change="handleTableChange" @sorterChange="handleSorterChange" bordered>
      <template #bodyCell="{ column, record }">
        <template v-if="column.key === 'operation'">
          <a-button @click="editRoomConfig(record)" style="margin-right: 15px;">{{ $t('message.edit') }}</a-button>
            <a-popconfirm :title="t('message.areYouSureToDeleteRecord')" @confirm="handleDelete(record)">
            <a-button danger>{{ $t('message.delete') }}</a-button>
          </a-popconfirm>
        </template>
      </template>
    </a-table>

    <a-modal :open="modalVisible" :title="modalTitle" @ok="handleModalOk" @cancel="handleModalCancel" :confirm-loading="confirmLoading">
      <a-form :model="form" :rules="rules" ref="formRef">
        <a-form-item :label="roomTypeCodeLabel" name="Roomtype">
          <a-input-number
            v-model:value="form.Roomtype"
            :min="0"
          />
        </a-form-item>
        <a-form-item :label="roomTypeNameLabel" name="RoomName">
          <a-input v-model:value="form.RoomName"/>
        </a-form-item>
        <a-form-item :label="roomRentLabel" name="RoomRent">
          <a-input-number
            v-model:value="form.RoomRent"
            :min="0"
            prefix="￥"
          />
        </a-form-item>
        <a-form-item :label="roomDepositLabel" name="RoomDeposit">
          <a-input-number
            v-model:value="form.RoomDeposit"
            :min="0"
            prefix="￥"
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
import { showNotification } from '@/utils/index';
import { fetchRoomTypes, addRoomType, updateRoomType, deleteRoomType } from '@/api/roomtypeapi.js';
import { useI18n } from 'vue-i18n';

const { t } = useI18n();
const route = useRoute();
const pageTitleKey = computed(() => getPageTitle(route.path));
const translatedPageTitle = computed(() => t(pageTitleKey.value));
const loading = ref(false);
const roomconfigs = ref([]);
const modalVisible = ref(false);
const modalTitle = ref('');
const confirmLoading = ref(false);
const formRef = ref([]);
const sortedInfo = ref({ order: null, columnKey: null });

const form = reactive({
  Roomtype: null,
  RoomName: null,
  RoomDeposit:null,
  RoomRent:null,
  DataInsUsr: '',
  DataInsDate: null,
  DataChgUsr: '',
  DataChgDate: null,
  modifystatus: '',
});

const rules = {
  Roomtype: [{ required: true, message: t('message.pleaseInputRoomTypeCode'), trigger: 'blur' }],
  RoomName: [{ required: true, message: t('message.pleaseInputRoomTypeName'), trigger: 'blur' }],
  RoomDeposit: [{ required: true, message: t('message.pleaseInputRoomDeposit'), trigger: 'blur' }],
  RoomRent: [{ required: true, message: t('message.pleaseInputRoomRent'), trigger: 'blur' }],
};

const roomTypeCodeLabel = computed(() => t('message.roomTypeCode'));
const roomTypeNameLabel = computed(() => t('message.roomTypeName'));
const roomRentLabel = computed(() => t('message.roomRent'));
const roomDepositLabel = computed(() => t('message.roomDeposit'));

const columns = computed(() => [
  {
    title: t('message.roomTypeCode'),
    dataIndex: 'Roomtype',
    key: 'Roomtype'
  },
  {
    title: t('message.roomTypeName'),
    dataIndex: 'RoomName',
    key: 'RoomName'
  },
  {
    title: t('message.roomRent'),
    dataIndex: 'RoomRent',
    key: 'RoomRent'
  },
  {
    title: t('message.roomDeposit'),
    dataIndex: 'RoomDeposit',
    key: 'RoomDeposit'
  },
  {
    title: t('message.operation'),
    key: 'operation',
  },
]);

const pagination = reactive({
  current: 1,
  pageSize: 10,
  total: 0,
});

const fetchRoomConfigData = async () => {
  loading.value = true;
  try {
    const result = await fetchRoomTypes({
      page: pagination.current,
      pageSize: pagination.pageSize,
      isDelete: 0
    });
    roomconfigs.value = result;
    pagination.total = result.length;
  } catch (error) {
    showNotification('error', t('message.operationTitle'), t('message.pleaseTryAgainLater'));
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  fetchRoomConfigData();
});

const showModal = () => {
  modalVisible.value = true;
  modalTitle.value = t('message.insertRoomConfig');
  form.Roomtype = null;
  form.RoomName = '';
  form.RoomRent = '';
  form.RoomDeposit = '';

  form.modifystatus = 'insert';
};

const refreshData = () => 
{
  fetchRoomConfigData();
};

const editRoomConfig = (record) => {
  modalVisible.value = true;
  modalTitle.value = t('message.updateRoomConfig');
  form.Roomtype = record.Roomtype;
  form.RoomName = record.RoomName;
  form.RoomRent = record.RoomRent;
  form.RoomDeposit = record.RoomDeposit;

  form.modifystatus = 'update';
};

const handleModalOk = async () => {
  try {
    await formRef.value.validate();
    confirmLoading.value = true;
    if (form.modifystatus === 'update') {
      await updateRoomType({ ...form});
      showNotification('success', t('message.operationTitle') , t('message.updateSuccess'));
    } else {
      await addRoomType({ ...form});
      showNotification('success', t('message.operationTitle') , t('message.addSuccess'));
    }
    modalVisible.value = false;
    fetchRoomConfigData();
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
    await deleteRoomType(record);
    showNotification('success', t('message.operationTitle'), t('message.deleteSuccess'));
    fetchRoomConfigData();
  } catch (error) {
    console.error('Delete error:', error);
    showNotification('error', t('message.operationTitle'), t('message.pleaseTryAgainLater'));
  }
};

const handleTableChange = (newPagination) => {
  pagination.current = newPagination.current;
  pagination.pageSize = newPagination.pageSize;
  fetchRoomConfigData();
};

const handleSorterChange = (pagination, filters, sorter) => {
  sortedInfo.value = sorter;
};
</script>