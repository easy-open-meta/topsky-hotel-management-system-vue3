<template>
  <div>
    <h1 style="margin-bottom: 15px;">{{ translatedPageTitle }}</h1>
    <a-button @click="refreshData" style="margin-bottom: 15px;margin-right: 15px;">{{ $t('message.refreshData') }}</a-button>
    <a-button type="primary" @click="showModal" style="margin-bottom: 15px;">{{ $t('message.insertRoom') }}</a-button>
    <a-table :columns="filteredColumns" :data-source="rooms" :loading="loading" :pagination="pagination" @change="handleTableChange" @sorterChange="handleSorterChange" bordered>
      <template #bodyCell="{ column, record }">
        <template v-if="column.key === 'operation'">
          <a-button @click="editRoom(record)" style="margin-right: 15px;">{{ $t('message.edit') }}</a-button>
            <a-popconfirm :title="t('message.areYouSureToDeleteRecord')" @confirm="handleDelete(record)">
            <a-button danger>{{ $t('message.delete') }}</a-button>
          </a-popconfirm>
        </template>
        <template v-else-if="column.key === 'RoomState'">
          <a-tag :color="getTagColor(record.RoomState)" :bordered="false">{{ record.RoomState }}</a-tag>
        </template>
      </template>
    </a-table>

    <a-modal :open="modalVisible" :title="modalTitle" @ok="handleModalOk" @cancel="handleModalCancel" :confirm-loading="confirmLoading">
      <a-form :model="form" :rules="rules" ref="formRef">
        <a-form-item :label="roomNoLabel" name="RoomNo">
          <a-input v-model:value="form.RoomNo"/>
        </a-form-item>
        <a-form-item :label="roomTypeLabel" name="RoomType">
          <a-select
            v-model:value="form.RoomType"
            :options="roomTypeOptions"
            :placeholder="t('message.pleaseInputRoomType')"
            @change="handleRoomTypeSelectChange"
          />
        </a-form-item>
        <a-form-item :label="roomStateLabel" name="RoomState">
          <a-select
            v-model:value="form.RoomStateId"
            :options="roomStateOptions"
            :placeholder="t('message.pleaseInputRoomState')"
          />
        </a-form-item>
        <a-form-item :label="roomRentLabel" name="RoomMoney">
          <a-input-number
            v-model:value="form.RoomMoney"
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
        <a-form-item :label="roomPositionLabel" name="RoomPosition">
          <a-input v-model:value="form.RoomPosition" />
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
import { fetchRooms, addRoom, updateRoom, deleteRoom } from '@/api/roomapi';
import { fetchRoomTypes } from '@/api/roomtypeapi.js';
import { fetchRoomStates } from '@/api/roomstateapi.js';
import { useI18n } from 'vue-i18n';

const { t } = useI18n();
const route = useRoute();
const pageTitleKey = computed(() => getPageTitle(route.path));
const translatedPageTitle = computed(() => t(pageTitleKey.value));
const loading = ref(false);
const rooms = ref([]);
const modalVisible = ref(false);
const modalTitle = ref('');
const confirmLoading = ref(false);
const formRef = ref(null);
const sortedInfo = ref({ order: null, columnKey: null });
const roomTypeOptions = ref([]);
const roomStateOptions = ref([]);
const roomTypes = ref([]);

const form = reactive({
  RoomNo: null,
  RoomType: null,
  RoomMoney:0,
  RoomDeposit:0,
  RoomStateId:null,
  RoomPosition:'',
  DataInsUsr: '',
  DataInsDate: null,
  DataChgUsr: '',
  DataChgDate: null,
  modifystatus: '',
});

const rules = {
  RoomNo: [{ required: true, message: t('message.pleaseInputRoomNo'), trigger: 'blur' }],
  RoomType: [{ required: true, message: t('message.pleaseInputRoomType'), trigger: 'blur' }],
};

const roomNoLabel = computed(() => t('message.roomNo'));
const roomTypeLabel = computed(() => t('message.roomType'));
const roomStateLabel = computed(() => t('message.roomState'));
const roomRentLabel = computed(() => t('message.roomRent'));
const roomDepositLabel = computed(() => t('message.roomDeposit'));
const roomPositionLabel = computed(() => t('message.roomPosition'));

const columns = computed(() => [
  {
    title: t('message.roomNo'),
    dataIndex: 'RoomNo',
    key: 'RoomNo',
    sorter: (a, b) => a.RoomNo.localeCompare(b.RoomNo),
    defaultSortOrder: 'ascend'
  },
  {
    title: t('message.roomType'),
    dataIndex: 'RoomType',
    key: 'RoomType',
    hidden:true
  },
  {
    title: t('message.roomType'),
    dataIndex: 'RoomName',
    key: 'RoomName'
  },
  {
    title: t('message.roomState'),
    dataIndex: 'RoomStateId',
    key: 'RoomStateId',
    hidden: true
  },
  {
    title: t('message.roomState'),
    dataIndex: 'RoomState',
    key: 'RoomState'
  },
  {
    title: t('message.roomRent'),
    dataIndex: 'RoomMoney',
    key: 'RoomMoney'
  },
  {
    title: t('message.roomDeposit'),
    dataIndex: 'RoomDeposit',
    key: 'RoomDeposit'
  },
  {
    title: t('message.roomPosition'),
    dataIndex: 'RoomPosition',
    key: 'RoomPosition'
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

const fetchRoomData = async () => {
  loading.value = true;
  try {
    const result = await fetchRooms({
      page: pagination.current,
      pageSize: pagination.pageSize,
      isDelete: 0
    });
    rooms.value = result;
    pagination.total = result.length;
  } catch (error) {
    showNotification('error', t('message.operationTitle'), t('message.pleaseTryAgainLater'));
  } finally {
    loading.value = false;
  }
};

const fetchSelectRoomTypes = async () => {
  try {
    const result = await fetchRoomTypes();
    roomTypeOptions.value = result.map((item) => ({
      label: item.RoomName,
      value: item.Roomtype,
    }));
    roomTypes.value = result;
  } catch (error) {
    showNotification('error', t('message.fetchDataFailed'), t('message.pleaseTryAgainLater'));
  }
};

const fetchSelectRoomStates = async () => {
  try {
    const result = await fetchRoomStates();
    roomStateOptions.value = result.map((item) => ({
      label: item.RoomStateName,
      value: item.RoomStateId,
    }));
  } catch (error) {
    showNotification('error', t('message.fetchDataFailed'), t('message.pleaseTryAgainLater'));
  }
};

const getTagColor = (state) => {
  let color = 'default';

  switch (state) {
    case '空房':
      color = '#48a54b';
      break;
    case '已住':
      color = '#1f8de5';
      break;
    case '维修中':
      color = '#f0b607';
      break;
    case '脏房':
      color = '#e63f33';
      break;
    case '预约':
      color = '#ff9800';
      break;
  }

  return color;
};

onMounted(() => {
  fetchRoomData();
  fetchSelectRoomTypes();
  fetchSelectRoomStates();
});

const showModal = () => {
  modalVisible.value = true;
  modalTitle.value = t('message.insertRoom');
  form.RoomNo = null;
  form.RoomType = null;
  form.RoomMoney = 0;
  form.RoomDeposit = 0;
  form.RoomStateId = null;
  form.RoomPosition = '';

  form.modifystatus = 'insert';
};

const refreshData = () => 
{
  fetchRoomData();
};

const editRoom = (record) => {
  modalVisible.value = true;
  modalTitle.value = t('message.updateRoom');
  form.RoomNo = record.RoomNo;
  form.RoomType = record.RoomType;
  form.RoomStateId = record.RoomStateId;
  form.RoomMoney = record.RoomMoney;
  form.RoomDeposit = record.RoomDeposit;
  form.RoomPosition = record.RoomPosition;

  form.modifystatus = 'update';
};

const handleModalOk = async () => {
  try {
    await formRef.value.validate();
    confirmLoading.value = true;
    if (form.modifystatus === 'update') {
      await updateRoom({ ...form});
      showNotification('success', t('message.operationTitle') , t('message.updateSuccess'));
    } else {
      await addRoom({ ...form});
      showNotification('success', t('message.operationTitle') , t('message.addSuccess'));
    }
    modalVisible.value = false;
    fetchRoomData();
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
    await deleteRoom(record);
    showNotification('success', t('message.operationTitle'), t('message.deleteSuccess'));
    fetchRoomData();
  } catch (error) {
    console.error('Delete error:', error);
    showNotification('error', t('message.operationTitle'), t('message.pleaseTryAgainLater'));
  }
};

const handleTableChange = (newPagination) => {
  pagination.current = newPagination.current;
  pagination.pageSize = newPagination.pageSize;
  fetchRoomData();
};

const handleSorterChange = (pagination, filters, sorter) => {
  sortedInfo.value = sorter;
};
const handleRoomTypeSelectChange = (value) => {
  form.RoomType = value;
  const foundData = roomTypes.value.find((item) => item.Roomtype === value);
  if (foundData) {
    form.RoomMoney = foundData.RoomRent;
    form.RoomDeposit = foundData.RoomDeposit;
  } else {
    form.RoomMoney = 0;
    form.RoomDeposit = 0;
  }
};
</script>