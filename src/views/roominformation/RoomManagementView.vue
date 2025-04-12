<template>
  <div>
    <h1 style="margin-bottom: 15px;">{{ translatedPageTitle }}</h1>
    <a-button @click="refreshData" style="margin-bottom: 15px;margin-right: 15px;"><sync-outlined /> {{ $t('message.refreshData') }}</a-button>
    <a-button type="primary" @click="showModal" style="margin-bottom: 15px;"><plus-outlined /> {{ $t('message.insertRoom') }}</a-button>
    <a-table :columns="filteredColumns" :data-source="rooms" :loading="loading" :pagination="pagination" @change="handleTableChange" @sorterChange="handleSorterChange" bordered>
      <template #bodyCell="{ column, record }">
        <template v-if="column.key === 'operation'">
          <a-button @click="editRoom(record)" style="margin-right: 15px;"><edit-outlined /> {{ $t('message.edit') }}</a-button>
            <a-popconfirm :title="t('message.areYouSureToDeleteRecord')" @confirm="handleDelete(record)">
            <a-button danger><delete-outlined /> {{ $t('message.delete') }}</a-button>
          </a-popconfirm>
        </template>
        <template v-if="column.key === RoomFields.STATE">
          <a-tag :color="getTagColor(record[RoomFields.STATE])">{{ record[RoomFields.STATE] }}</a-tag>
        </template>
      </template>
    </a-table>

    <a-modal :open="modalVisible" :title="modalTitle" @ok="handleModalOk" @cancel="handleModalCancel" :confirm-loading="confirmLoading">
      <a-form :model="form" :rules="rules" ref="formRef">
        <a-form-item :label="roomNoLabel" :name="RoomFields.NO">
          <a-input v-model:value="form[RoomFields.NO]"/>
        </a-form-item>
        <a-form-item :label="roomTypeLabel" :name="RoomFields.TYPE">
          <a-select
            v-model:value="form[RoomFields.TYPE]"
            :options="roomTypeOptions"
            :placeholder="t('message.pleaseInputRoomType')"
            @change="handleRoomTypeSelectChange"
          />
        </a-form-item>
        <a-form-item :label="roomStateLabel" :name="RoomFields.STATE_ID">
          <a-select
            v-model:value="form[RoomFields.STATE_ID]"
            :options="roomStateOptions"
            :placeholder="t('message.pleaseInputRoomState')"
          />
        </a-form-item>
        <a-form-item :label="roomRentLabel" :name="RoomFields.RENT">
          <a-input-number
            v-model:value="form[RoomFields.RENT]"
            :min="0"
            prefix="￥"
          />
        </a-form-item>
        <a-form-item :label="roomDepositLabel" :name="RoomFields.DEPOSIT">
          <a-input-number
            v-model:value="form[RoomFields.DEPOSIT]"
            :min="0"
            prefix="￥"
          />
        </a-form-item>
        <a-form-item :label="roomPositionLabel" :name="RoomFields.POSITION">
          <a-input v-model:value="form[RoomFields.POSITION]" />
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
import { fetchRooms, addRoom, updateRoom, deleteRoom } from '@/api/roomapi';
import { 
  RoomFields,
  initialFormValues,
  getColumns,
  getFormRules,
  RoomStateColors
} from '@/entities/room.entity';
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

const form = reactive({ ...initialFormValues });

const rules = getFormRules(t);

const roomNoLabel = computed(() => t('message.roomNo'));
const roomTypeLabel = computed(() => t('message.roomType'));
const roomStateLabel = computed(() => t('message.roomState'));
const roomRentLabel = computed(() => t('message.roomRent'));
const roomDepositLabel = computed(() => t('message.roomDeposit'));
const roomPositionLabel = computed(() => t('message.roomPosition'));

const columns = computed(() => getColumns(t));

const getTagColor = (state) => RoomStateColors[state] || '#888';

const filteredColumns = computed(() => columns.value.filter(column => !column.hidden));

const pagination = reactive({
    current: 1,
    pageSize: 15,
    total: 0,
    showSizeChanger: true,
    pageSizeOptions: ['15', '30', '50'],
    showTotal: total => t('message.totalRecords', { total })
  });

const fetchRoomData = async () => {
  loading.value = true;
  try {
    const result = await fetchRooms({
      page: pagination.current,
      pageSize: pagination.pageSize,
      [RoomFields.IS_DELETED]: 0
    });
    rooms.value = result.listSource.map(item => ({
    [RoomFields.NO]: item[RoomFields.NO],
    [RoomFields.NAME]: item[RoomFields.NAME],
    [RoomFields.TYPE]: item[RoomFields.TYPE],
    [RoomFields.TYPENAME]: item[RoomFields.TYPENAME],
    [RoomFields.STATE]: item[RoomFields.STATE],
    [RoomFields.STATE_ID]: item[RoomFields.STATE_ID],
    [RoomFields.RENT]: item[RoomFields.RENT],
    [RoomFields.DEPOSIT]: item[RoomFields.DEPOSIT],
    [RoomFields.POSITION]: item[RoomFields.POSITION]
  }));
    pagination.total = result.total;
  } catch (error) {
    showErrorNotification(error.message || t('message.pleaseTryAgainLater'));
  } finally {
    loading.value = false;
  }
};

const fetchSelectRoomTypes = async () => {
  try {
    const result = await fetchRoomTypes({
      [RoomFields.IS_DELETED]: 0,
      [RoomFields.IGNOREPAGING]: true
    });
    roomTypeOptions.value = result.listSource.map((item) => ({
      label: item.RoomTypeName,
      value: item.RoomTypeId,
    }));
    roomTypes.value = result;
  } catch (error) {
    showErrorNotification(error.message || t('message.pleaseTryAgainLater'));
  }
};

const fetchSelectRoomStates = async () => {
  try {
    const result = await fetchRoomStates();
    roomStateOptions.value = result.map((item) => ({
      label: item.Description,
      value: item.Id,
    }));
  } catch (error) {
    showErrorNotification(error.message || t('message.pleaseTryAgainLater'));
  }
};

onMounted(() => {
  fetchRoomData();
  fetchSelectRoomTypes();
  fetchSelectRoomStates();
});

const showModal = () => {
  modalVisible.value = true;
  modalTitle.value = t('message.insertRoom');
  form[RoomFields.NO] = null;
  form[RoomFields.TYPE] = null;
  form[RoomFields.RENT] = 0;
  form[RoomFields.DEPOSIT] = 0;
  form[RoomFields.STATE_ID] = null;
  form[RoomFields.POSITION] = '';

  form.modifystatus = 'insert';
};

const refreshData = () => 
{
  fetchRoomData();
};

const editRoom = (record) => {
  modalVisible.value = true;
  modalTitle.value = t('message.updateRoom');
  form[RoomFields.NO] = record[RoomFields.NO];
  form[RoomFields.TYPE] = record[RoomFields.TYPE];
  form[RoomFields.STATE_ID] = record[RoomFields.STATE_ID];
  form[RoomFields.RENT] = record[RoomFields.RENT];
  form[RoomFields.DEPOSIT] = record[RoomFields.DEPOSIT];
  form[RoomFields.POSITION] = record[RoomFields.POSITION];

  form.modifystatus = 'update';
};

const handleModalOk = async () => {
  try {
    await formRef.value.validate();
    confirmLoading.value = true;
    if (form.modifystatus === 'update') {
      var response = await updateRoom({ ...form});
      if (response && response.StatusCode !== 200) {
        showErrorNotification(t('message.updateFailed'));
        return;
      }
      showSuccessNotification(t('message.updateSuccess'));
    } else {
      var response = await addRoom({ ...form});
      if (response && response.StatusCode !== 200) {
        showErrorNotification(t('message.addFailed'));
        return;
      }
      showSuccessNotification(t('message.addSuccess'));
    }
    modalVisible.value = false;
    fetchRoomData();
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
    record[RoomFields.IS_DELETED] = 1;
    var response = await deleteRoom(record);
    if (response && response.StatusCode !== 200) {
      showErrorNotification(t('message.deleteFailed'));
      return;
    }
    showSuccessNotification(t('message.deleteSuccess'));
    fetchRoomData();
  } catch (error) {
    showErrorNotification(error.message || t('message.pleaseTryAgainLater'));
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
  form[RoomFields.TYPE] = value;
  const foundData = roomTypes.value.listSource.find((item) => item.RoomTypeId === value);
  if (foundData) {
    form[RoomFields.RENT] = foundData.RoomRent;
    form[RoomFields.DEPOSIT] = foundData.RoomDeposit;
  } else {
    form[RoomFields.RENT] = 0;
    form[RoomFields.DEPOSIT] = 0;
  }
};
</script>