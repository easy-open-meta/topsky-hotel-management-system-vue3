<template>
  <div>
    <h1 style="margin-bottom: 15px;">{{ translatedPageTitle }}</h1>
    <a-button @click="refreshData" style="margin-bottom: 15px;margin-right: 15px;"><sync-outlined /> {{ $t('message.refreshData') }}</a-button>
    <a-button type="primary" @click="showModal" style="margin-bottom: 15px;"><plus-outlined /> {{ $t('message.insertRoomConfig') }}</a-button>
    <a-table :columns="columns" :data-source="roomconfigs" :loading="loading" :pagination="pagination" @change="handleTableChange" @sorterChange="handleSorterChange" bordered>
      <template #bodyCell="{ column, record }">
        <template v-if="column.key === 'operation'">
          <a-button @click="editRoomConfig(record)" style="margin-right: 15px;"><edit-outlined /> {{ $t('message.edit') }}</a-button>
            <a-popconfirm :title="t('message.areYouSureToDeleteRecord')" @confirm="handleDelete(record)">
            <a-button danger><delete-outlined /> {{ $t('message.delete') }}</a-button>
          </a-popconfirm>
        </template>
        <template v-if="column.key === RoomConfigFields.RENT">
          {{ formatCurrency(record[RoomConfigFields.RENT]) }}
        </template>
        <template v-else-if="column.key === RoomConfigFields.DEPOSIT">
          {{ formatCurrency(record[RoomConfigFields.DEPOSIT]) }}
        </template>
      </template>
    </a-table>

    <a-modal 
      :open="modalVisible" 
      :title="modalTitle"
      @ok="handleModalOk"
      @cancel="handleModalCancel"
      :confirm-loading="confirmLoading"
    >
      <a-form :model="form" :rules="rules" ref="formRef">
        <a-form-item :label="roomTypeCodeLabel" :name="RoomConfigFields.NO">
          <a-input-number 
            v-model:value="form[RoomConfigFields.NO]"
            :min="1"
            :precision="0"
          />
        </a-form-item>
        
        <a-form-item :label="roomTypeNameLabel" :name="RoomConfigFields.NAME">
          <a-input v-model:value="form[RoomConfigFields.NAME]" />
        </a-form-item>
        
        <a-form-item :label="roomRentLabel" :name="RoomConfigFields.RENT">
          <a-input-number
            v-model:value="form[RoomConfigFields.RENT]"
            :min="0"
            :precision="2"
            :formatter="value => `￥ ${value}`"
          />
        </a-form-item>
        
        <a-form-item :label="roomDepositLabel" :name="RoomConfigFields.DEPOSIT">
          <a-input-number
            v-model:value="form[RoomConfigFields.DEPOSIT]"
            :min="0"
            :precision="2"
            :formatter="value => `￥ ${value}`"
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
import { 
  RoomConfigFields,
  initialFormValues,
  getColumns,
  getFormRules
} from '@/entities/roomconfig.entity';
import { useI18n } from 'vue-i18n';
import { formatCurrency } from '@/utils/index';

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

const form = reactive({ ...initialFormValues });

const rules = getFormRules(t);

const roomTypeCodeLabel = computed(() => t('message.roomTypeCode'));
const roomTypeNameLabel = computed(() => t('message.roomTypeName'));
const roomRentLabel = computed(() => t('message.roomRent'));
const roomDepositLabel = computed(() => t('message.roomDeposit'));

const columns = computed(() => getColumns(t));

const pagination = reactive({
    current: 1,
    pageSize: 15,
    total: 0,
    showSizeChanger: true,
    pageSizeOptions: ['15', '30', '50'],
    showTotal: total => t('message.totalRecords', { total })
  });

const fetchRoomConfigData = async () => {
  loading.value = true;
  try {
    const result = await fetchRoomTypes({
      page: pagination.current,
      pageSize: pagination.pageSize,
      [RoomConfigFields.IS_DELETED]: 0
    });
    if (result?.listSource) {
      roomconfigs.value = result.listSource.map(item => ({
        [RoomConfigFields.NO]: item[RoomConfigFields.NO],
        [RoomConfigFields.NAME]: item[RoomConfigFields.NAME],
        [RoomConfigFields.RENT]: item[RoomConfigFields.RENT],
        [RoomConfigFields.DEPOSIT]: item[RoomConfigFields.DEPOSIT]
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
  fetchRoomConfigData();
});

const showModal = () => {
  modalVisible.value = true;
  modalTitle.value = t('message.insertRoomConfig');
  form[RoomConfigFields.NO] = null;
  form[RoomConfigFields.NAME] = '';
  form[RoomConfigFields.RENT] = 0;
  form[RoomConfigFields.DEPOSIT] = 0;

  form.modifystatus = 'insert';
};

const refreshData = () => 
{
  fetchRoomConfigData();
};

const editRoomConfig = (record) => {
  modalVisible.value = true;
  modalTitle.value = t('message.updateRoomConfig');
  form[RoomConfigFields.NO] = record[RoomConfigFields.NO];
  form[RoomConfigFields.NAME] = record[RoomConfigFields.NAME];
  form[RoomConfigFields.RENT] = record[RoomConfigFields.RENT];
  form[RoomConfigFields.DEPOSIT] = record[RoomConfigFields.DEPOSIT];

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
    record[RoomConfigFields.IS_DELETED] = 1;
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