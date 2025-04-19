<template>
    <div>
      <h1 style="margin-bottom: 15px;">{{ translatedPageTitle }}</h1>
      <a-button @click="refreshData" style="margin-bottom: 15px;margin-right: 15px;"><sync-outlined /> {{ $t('message.refreshData') }}</a-button>
      <a-button type="primary" @click="showModal" style="margin-bottom: 15px;"><plus-outlined /> {{ $t('message.insertReser') }}</a-button>
      <a-table :columns="filteredColumns" :data-source="resers" :loading="loading" :pagination="pagination" @change="handleTableChange" @sorterChange="handleSorterChange" bordered>
        <template #bodyCell="{ column, record }">
          <template v-if="column.key === 'operation'">
            <a-button @click="editReser(record)" style="margin-right: 15px;"><edit-outlined /> {{ $t('message.edit') }}</a-button>
              <a-popconfirm :title="t('message.areYouSureToDeleteRecord')" @confirm="handleDelete(record)">
              <a-button danger><delete-outlined /> {{ $t('message.delete') }}</a-button>
            </a-popconfirm>
          </template>
          <template v-else-if="column.key === ReserFields.STARTDATE">
            {{ formatDate(record[ReserFields.STARTDATE]) }}
          </template>
          <template v-else-if="column.key === ReserFields.ENDDATE">
            {{ formatDate(record[ReserFields.ENDDATE]) }}
          </template>
        </template>
      </a-table>
  
      <a-modal :open="modalVisible" :title="modalTitle" @ok="handleModalOk" @cancel="handleModalCancel" :confirm-loading="confirmLoading">
        <a-form :model="form" :rules="rules" ref="formRef">
            <a-form-item :label="reserNoLabel" :name="ReserFields.NUMBER">
                <a-input v-model:value="form[ReserFields.NUMBER]" type="hidden" />
                <span>{{ form[ReserFields.NUMBER] }}</span>
            </a-form-item>
            <a-form-item :label="reserCustomerNameLabel" :name="ReserFields.CUSTOMERNAME">
                <a-input v-model:value="form[ReserFields.CUSTOMERNAME]"/>
            </a-form-item>
            <a-form-item :label="reserPhoneNumberLabel" :name="ReserFields.PHONENUMBER">
                <a-input v-model:value="form[ReserFields.PHONENUMBER]"/>
            </a-form-item>
            <a-form-item :label="reserChannelLabel" :name="ReserFields.CHANNEL">
                <a-input v-model:value="form[ReserFields.CHANNEL]"/>
            </a-form-item>
            <a-form-item :label="reserRoomNumberLabel" :name="ReserFields.ROOMNUMBER">
                <a-select
                    v-model:value="form[ReserFields.ROOMNUMBER]"
                    :options="roomOptions"
                    :placeholder="t('message.pleaseInputReserRoomNumber')"
                />
            </a-form-item>
            <a-form-item :label="reserStartDateLabel" :name="ReserFields.STARTDATE">
                <a-date-picker v-model:value="form[ReserFields.STARTDATE]" />
            </a-form-item>
            <a-form-item :label="reserEndDateLabel" :name="ReserFields.ENDDATE">
                <a-date-picker v-model:value="form[ReserFields.ENDDATE]" />
            </a-form-item>
        </a-form>
      </a-modal>
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted, computed, reactive } from 'vue';
  import { useRoute } from 'vue-router';
  import { getPageTitle } from '@/utils/pageTitle';
  import { formatDate, showErrorNotification, showSuccessNotification } from '@/utils/index';
  import { fetchResers, addReser, updateReser, deleteReser } from '@/api/reserapi';
  import { fetchRooms } from '@/api/roomapi';
  import { 
    ReserFields,
    initialFormValues,
    getColumns,
    getFormRules
  } from '@/entities/reser.entity';
  import { RoomFields } from '@/entities/room.entity';
  import { useI18n } from 'vue-i18n';
  import generateSnowflakeId from '@/utils/snowflake';
  
  const { t } = useI18n();
  const route = useRoute();
  const pageTitleKey = computed(() => getPageTitle(route.path));
  const translatedPageTitle = computed(() => t(pageTitleKey.value));
  const loading = ref(false);
  const resers = ref([]);
  const modalVisible = ref(false);
  const modalTitle = ref('');
  const confirmLoading = ref(false);
  const formRef = ref(null);
  const roomOptions = ref([]);
  const sortedInfo = ref({ order: null, columnKey: null });
  
  const form = reactive({ ...initialFormValues });
  
  const rules = getFormRules(t);
  
  const reserNoLabel = computed(() => t('message.reserNo'));
  const reserCustomerNameLabel = computed(() => t('message.reserCustomerName'));
  const reserPhoneNumberLabel = computed(() => t('message.reserPhoneNumber'));
  const reserChannelLabel = computed(() => t('message.reserChannel'));
  const reserRoomNumberLabel = computed(() => t('message.reserRoomNumber'));
  const reserStartDateLabel = computed(() => t('message.reserStartDate'));
  const reserEndDateLabel = computed(() => t('message.reserEndDate'));
  
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
  
  const fetchReserData = async () => {
    loading.value = true;
    try {
      const result = await fetchResers({
        page: pagination.current,
        pageSize: pagination.pageSize,
        [ReserFields.IS_DELETED]: 0
      });
      resers.value = result.listSource.map(item => ({
      [ReserFields.NUMBER]: item[ReserFields.NUMBER],
      [ReserFields.PHONENUMBER]: item[ReserFields.PHONENUMBER],
      [ReserFields.CHANNEL]: item[ReserFields.CHANNEL],
      [ReserFields.CUSTOMERNAME]: item[ReserFields.CUSTOMERNAME],
      [ReserFields.ROOMNUMBER]: item[ReserFields.ROOMNUMBER],
      [ReserFields.STARTDATE]: item[ReserFields.STARTDATE],
      [ReserFields.ENDDATE]: item[ReserFields.ENDDATE]
    }));
      pagination.total = result.total;
    } catch (error) {
      showErrorNotification(error.message || t('message.pleaseTryAgainLater'));
    } finally {
      loading.value = false;
    }
  };
  
const fetchSelectRooms = async () => {
  try {
    const result = await fetchRooms({
        [ReserFields.IGNOREPAGING]: true,
        [RoomFields.STATE_ID]: 0
    });
    roomOptions.value = result.listSource.map((item) => ({
      label: item[RoomFields.NO],
      value: item[RoomFields.NO],
    }));
  } catch (error) {
    showErrorNotification(error.message || t('message.pleaseTryAgainLater'));
  }
};

  onMounted(() => {
    fetchReserData();
    fetchSelectRooms();
  });
  
  const showModal = () => {
    modalVisible.value = true;
    modalTitle.value = t('message.insertReser');
    form[ReserFields.NUMBER] = generateSnowflakeId({
      prefix: 'R-',
      separator: null,
    });
    form[ReserFields.CUSTOMERNAME] = '';
    form[ReserFields.PHONENUMBER] = '';
    form[ReserFields.ROOMNUMBER] = '';
    form[ReserFields.STARTDATE] = null;
    form[ReserFields.ENDDATE] = null;
    form[ReserFields.CHANNEL] = '';
  
    form.modifystatus = 'insert';
  };
  
  const refreshData = () => 
  {
    fetchReserData();
  };
  
  const editReser = (record) => {
    modalVisible.value = true;
    modalTitle.value = t('message.updateReser');
    form[ReserFields.NUMBER] = record[ReserFields.NUMBER];
    form[ReserFields.CUSTOMERNAME] = record[ReserFields.CUSTOMERNAME];
    form[ReserFields.PHONENUMBER] = record[ReserFields.PHONENUMBER];
    form[ReserFields.ROOMNUMBER] = record[ReserFields.ROOMNUMBER];
    form[ReserFields.STARTDATE] = record[ReserFields.STARTDATE];
    form[ReserFields.ENDDATE] = record[ReserFields.ENDDATE];
    form[ReserFields.CHANNEL] = record[ReserFields.CHANNEL];
  
    form.modifystatus = 'update';
  };
  
  const handleModalOk = async () => {
    try {
      await formRef.value.validate();
      confirmLoading.value = true;
      if (form.modifystatus === 'update') {
        var response = await updateReser({ ...form});
        if (response && response.StatusCode !== 200) {
          showErrorNotification(t('message.operationTitle'), t('message.updateFailed'));
          return;
        }
        showSuccessNotification(t('message.updateSuccess'));
      } else {
        var response = await addReser({ ...form});
        if (response && response.StatusCode !== 200) {
          showErrorNotification(t('message.operationTitle'), t('message.addFailed'));
          return;
        }
        showSuccessNotification(t('message.addSuccess'));
      }
      modalVisible.value = false;
      fetchReserData();
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
      record[ReserFields.IS_DELETED] = 1;
      var response = await deleteReser(record);
      if (response && response.StatusCode !== 200) {
        showErrorNotification(t('message.operationTitle'), t('message.deleteFailed'));
        return;
      }
      showSuccessNotification(t('message.deleteSuccess'));
      fetchReserData();
    } catch (error) {
      showErrorNotification(error.message || t('message.pleaseTryAgainLater'));
    }
  };
  
  const handleTableChange = (newPagination) => {
    pagination.current = newPagination.current;
    pagination.pageSize = newPagination.pageSize;
    fetchReserData();
  };
  
  const handleSorterChange = (pagination, filters, sorter) => {
    sortedInfo.value = sorter;
  };
  </script>