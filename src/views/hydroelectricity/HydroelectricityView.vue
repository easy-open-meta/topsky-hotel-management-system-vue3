<template>
  <div>
    <h1 style="margin-bottom: 15px;">{{ translatedPageTitle }}</h1>
    <a-button @click="refreshData" style="margin-bottom: 15px;margin-right: 15px;">{{ $t('message.refreshData') }}</a-button>
    <a-table :columns="columns" :data-source="hydroelectricitys" :loading="loading" :pagination="pagination" @change="handleTableChange" @sorterChange="handleSorterChange" bordered>
      <template #bodyCell="{ column, record }">
        <template v-if="column.key === 'operation'">
          <a-button @click="editHydroelectricity(record)" style="margin-right: 15px;">{{ $t('message.edit') }}</a-button>
            <a-popconfirm :title="t('message.areYouSureToDeleteRecord')" @confirm="handleDelete(record)">
            <a-button danger>{{ $t('message.delete') }}</a-button>
          </a-popconfirm>
        </template>
      </template>
    </a-table>

    <a-modal :open="modalVisible" :title="modalTitle" @ok="handleModalOk" @cancel="handleModalCancel" :confirm-loading="confirmLoading">
      <a-form :model="form" :rules="rules" ref="formRef">
        <a-form-item :label="wtiNoLabel" name="WtiNo">
          <span>{{ form.WtiNo }}</span>
        </a-form-item>
        <a-form-item :label="roomNoLabel" name="RoomNo">
          <span>{{ form.RoomNo }}</span>
        </a-form-item>
        <a-form-item :label="custoNoLabel" name="CustoNo">
          <span>{{ form.CustoNo }}</span>
        </a-form-item>
        <a-form-item :label="useDateLabel" name="UseDate">
          <span>{{ formatDate(form.UseDate) }}</span>
        </a-form-item>
        <a-form-item :label="endDateLabel" name="EndDate">
          <span>{{ formatDate(form.EndDate) }}</span>
        </a-form-item>
        <a-form-item :label="waterUseLabel" name="WaterUse">
          <a-input v-model:value="form.WaterUse" />
        </a-form-item>
        <a-form-item :label="powerUseLabel" name="PowerUse">
          <a-input v-model:value="form.PowerUse" />
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
import { fetchHydroelectricitys, updateHydroelectricity, deleteHydroelectricity } from '@/api/hydroelectricityapi';
import { formatDate } from '@/utils/index';
import { useI18n } from 'vue-i18n';
import moment from 'moment';

const { t } = useI18n();
const route = useRoute();
const pageTitleKey = computed(() => getPageTitle(route.path));
const translatedPageTitle = computed(() => t(pageTitleKey.value));
const loading = ref(false);
const hydroelectricitys = ref([]);
const modalVisible = ref(false);
const modalTitle = ref('');
const confirmLoading = ref(false);
const formRef = ref(null);
const sortedInfo = ref({ order: null, columnKey: null });

const form = reactive({
  WtiNo: '',
  RoomNo: '',
  CustoNo: '',
  UseDate: null,
  EndDate: null,
  WaterUse: 0,
  PowerUse: 0,
  Record: '',
  datains_usr: '',
  datains_date: null,
  datachg_usr: '',
  datachg_date: null,
  modifystatus: '',
});

const rules = {
  WaterUse: [{ required: true, message: t('message.pleaseInputWaterUse'), trigger: 'blur' }],
  PowerUse: [{ required: true, message: t('message.pleaseInputPowerUse'), trigger: 'blur' }],
};

const wtiNoLabel = computed(() => t('message.wtiNo'));
const roomNoLabel = computed(() => t('message.roomNo'));
const custoNoLabel = computed(() => t('message.custoNo'));
const useDateLabel = computed(() => t('message.useDate'));
const endDateLabel = computed(() => t('message.endDate'));
const waterUseLabel = computed(() => t('message.waterUse'));
const powerUseLabel = computed(() => t('message.powerUse'));

const columns = computed(() => [
  {
    title: t('message.wtiNo'),
    dataIndex: 'WtiNo',
    key: 'WtiNo',
  },
  {
    title: t('message.roomNo'),
    dataIndex: 'RoomNo',
    key: 'RoomNo',
  },
  {
    title: t('message.custoNo'),
    dataIndex: 'CustoNo',
    key: 'CustoNo',
  },
  {
    title: t('message.useDate'),
    dataIndex: 'UseDate',
    key: 'UseDate',
  },
  {
    title: t('message.endDate'),
    dataIndex: 'EndDate',
    key: 'EndDate',
  },
  {
    title: t('message.waterUse'),
    dataIndex: 'WaterUse',
    key: 'WaterUse',
  },
  {
    title: t('message.powerUse'),
    dataIndex: 'PowerUse',
    key: 'PowerUse',
  },
  {
    title: t('message.recorder'),
    dataIndex: 'Record',
    key: 'Record',
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

const fetchHydroelectricityData = async () => {
  loading.value = true;
  try {
    const result = await fetchHydroelectricitys({
    });
    hydroelectricitys.value = result;
    pagination.total = result.length;
  } catch (error) {
    showNotification('error', t('message.operationTitle'), t('message.pleaseTryAgainLater'));
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  fetchHydroelectricityData();
});

const editHydroelectricity = (record) => {
  modalVisible.value = true;
  modalTitle.value = t('message.updateHydroelectricity');
  form.WtiNo = record.WtiNo;
  form.RoomNo = record.RoomNo;
  form.CustoNo = record.CustoNo;
  form.UseDate = record.UseDate ? moment(record.UseDate) : null;
  form.EndDate = record.EndDate ? moment(record.EndDate) : null;
  form.WaterUse = record.WaterUse;
  form.PowerUse = record.PowerUse;
  form.Record = record.Record;
  form.modifystatus = 'update';
};

const handleModalOk = async () => {
  try {
    await formRef.value.validate();
    confirmLoading.value = true;
    if (form.modifystatus === 'update') {
      await updateHydroelectricity({ ...form,UseDate:form.UseDate?form.UseDate.format('YYYY-MM-DD HH:mm:ss'):null,EndDate:form.EndDate?form.EndDate.format('YYYY-MM-DD HH:mm:ss'):null});
      showNotification('success', t('message.operationTitle') , t('message.updateSuccess'));
    }
    modalVisible.value = false;
    fetchHydroelectricityData();
  } catch (error) {
    showNotification('error', t('message.operationTitle'), t('message.pleaseTryAgainLater'));
  } finally {
    confirmLoading.value = false;
  }
};

const refreshData = () => 
{
  fetchHydroelectricityData();
};

const handleModalCancel = () => {
  modalVisible.value = false;
};

const handleDelete = async (record) => {
  try {
    record.delete_mk = 1;
    await deleteHydroelectricity(record);
    showNotification('success', t('message.operationTitle'), t('message.deleteSuccess'));
    fetchHydroelectricityData();
  } catch (error) {
    showNotification('error', t('message.operationTitle'), t('message.pleaseTryAgainLater'));
  }
};

const handleTableChange = (newPagination) => {
  pagination.current = newPagination.current;
  pagination.pageSize = newPagination.pageSize;
  fetchHydroelectricityData();
};

const handleSorterChange = (pagination, filters, sorter) => {
  sortedInfo.value = sorter;
};
</script>