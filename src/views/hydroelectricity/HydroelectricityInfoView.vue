<template>
  <div>
    <h1 style="margin-bottom: 15px;">{{ translatedPageTitle }}</h1>
    <a-button @click="refreshData" style="margin-bottom: 15px;margin-right: 15px;"><sync-outlined /> {{ $t('message.refreshData') }}</a-button>
    <a-table :columns="columns" :data-source="hydroelectricitys" :loading="loading" :pagination="pagination" @change="handleTableChange" @sorterChange="handleSorterChange" bordered>
      <template #bodyCell="{ column, record }">
        <template v-if="column.key === 'operation'">
          <a-button @click="editHydroelectricity(record)" style="margin-right: 15px;"><edit-outlined /> {{ $t('message.edit') }}</a-button>
            <a-popconfirm :title="t('message.areYouSureToDeleteRecord')" @confirm="handleDelete(record)">
            <a-button danger><delete-outlined /> {{ $t('message.delete') }}</a-button>
          </a-popconfirm>
        </template>
        <template v-else-if="column.key === EnergyManagementFields.STARTDATE">
          {{ formatDate(record[EnergyManagementFields.STARTDATE]) }}
        </template>
        <template v-else-if="column.key === EnergyManagementFields.ENDDATE">
          {{ formatDate(record[EnergyManagementFields.ENDDATE]) }}
        </template>
      </template>
    </a-table>

    <a-modal :open="modalVisible" :title="modalTitle" @ok="handleModalOk" @cancel="handleModalCancel" :confirm-loading="confirmLoading">
      <a-form :model="form" :rules="rules" ref="formRef">
        <a-form-item :label="wtiNoLabel" :name="EnergyManagementFields.NUMBER">
          <span>{{ form[EnergyManagementFields.NUMBER] }}</span>
        </a-form-item>
        <a-form-item :label="roomNoLabel" :name="EnergyManagementFields.ROOMNUMBER">
          <span>{{ form[EnergyManagementFields.ROOMNUMBER] }}</span>
        </a-form-item>
        <a-form-item :label="custoNoLabel" :name="EnergyManagementFields.CUSTOMERNUMBER">
          <span>{{ form[EnergyManagementFields.CUSTOMERNUMBER] }}</span>
        </a-form-item>
        <a-form-item :label="useDateLabel" :name="EnergyManagementFields.STARTDATE">
          <span>{{ formatDate(form[EnergyManagementFields.STARTDATE]) }}</span>
        </a-form-item>
        <a-form-item :label="endDateLabel" :name="EnergyManagementFields.ENDDATE">
          <span>{{ formatDate(form[EnergyManagementFields.ENDDATE]) }}</span>
        </a-form-item>
        <a-form-item :label="waterUseLabel" :name="EnergyManagementFields.WATERUSAGE">
          <a-input v-model:value="form[EnergyManagementFields.WATERUSAGE]" />
        </a-form-item>
        <a-form-item :label="powerUseLabel" :name="EnergyManagementFields.POWERUSAGE">
          <a-input v-model:value="form[EnergyManagementFields.POWERUSAGE]" />
        </a-form-item>
      </a-form>
    </a-modal>
  </div>
</template>

<script setup>
import { ref, onMounted, computed, reactive } from 'vue';
import { useRoute } from 'vue-router';
import { getPageTitle } from '@/utils/pageTitle';
import { fetchHydroelectricitys, updateHydroelectricity, deleteHydroelectricity } from '@/api/hydroelectricityapi';
import { 
  EnergyManagementFields, 
  initialFormValues, 
  getColumns, 
  getFormRules 
} from '@/entities/energymanagement.entity';
import { formatDate, showErrorNotification, showSuccessNotification } from '@/utils/index';
import { useI18n } from 'vue-i18n';
import dayjs from 'dayjs';

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

const form = reactive({ ...initialFormValues });

const rules = getFormRules(t);

const wtiNoLabel = computed(() => t('message.wtiNo'));
const roomNoLabel = computed(() => t('message.roomNo'));
const custoNoLabel = computed(() => t('message.custoNo'));
const useDateLabel = computed(() => t('message.useDate'));
const endDateLabel = computed(() => t('message.endDate'));
const waterUseLabel = computed(() => t('message.waterUse'));
const powerUseLabel = computed(() => t('message.powerUse'));

const columns = computed(() => getColumns(t));

const pagination = reactive({
  current: 1,
  pageSize: 15,
  total: 0,
  showSizeChanger: true,
  pageSizeOptions: ['15', '20', '50'],
  showTotal: total => t('message.totalRecords', { total })
});

const fetchHydroelectricityData = async () => {
  loading.value = true;
  try {
    const result = await fetchHydroelectricitys({
      page: pagination.current,
      pageSize: pagination.pageSize,
      [EnergyManagementFields.IS_DELETED]: 0
    });
    if (result?.listSource) {
      hydroelectricitys.value = result.listSource.map(item => ({
      [EnergyManagementFields.NUMBER]: item[EnergyManagementFields.NUMBER],
      [EnergyManagementFields.ROOMNUMBER]: item[EnergyManagementFields.ROOMNUMBER],
      [EnergyManagementFields.CUSTOMERNUMBER]: item[EnergyManagementFields.CUSTOMERNUMBER],
      [EnergyManagementFields.STARTDATE]: item[EnergyManagementFields.STARTDATE],
      [EnergyManagementFields.ENDDATE]: item[EnergyManagementFields.ENDDATE],
      [EnergyManagementFields.WATERUSAGE]: item[EnergyManagementFields.WATERUSAGE],
      [EnergyManagementFields.POWERUSAGE]: item[EnergyManagementFields.POWERUSAGE],
      [EnergyManagementFields.RECORDER]: item[EnergyManagementFields.RECORDER],
      [EnergyManagementFields.IS_DELETED]: item[EnergyManagementFields.IS_DELETED]
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
  fetchHydroelectricityData();
});

const editHydroelectricity = (record) => {
  modalVisible.value = true;
  modalTitle.value = t('message.updateHydroelectricity');
  form[EnergyManagementFields.NUMBER] = record[EnergyManagementFields.NUMBER];
  form[EnergyManagementFields.ROOMNUMBER] = record[EnergyManagementFields.ROOMNUMBER];
  form[EnergyManagementFields.CUSTOMERNUMBER] = record[EnergyManagementFields.CUSTOMERNUMBER];
  form[EnergyManagementFields.STARTDATE] = record[EnergyManagementFields.STARTDATE] ? dayjs(record[EnergyManagementFields.STARTDATE]) : null;
  form[EnergyManagementFields.ENDDATE] = record[EnergyManagementFields.ENDDATE] ? dayjs(record[EnergyManagementFields.ENDDATE]) : null;
  form[EnergyManagementFields.WATERUSAGE] = record[EnergyManagementFields.WATERUSAGE];
  form[EnergyManagementFields.POWERUSAGE] = record[EnergyManagementFields.POWERUSAGE];
  form[EnergyManagementFields.RECORDER] = record[EnergyManagementFields.RECORDER];
  form.modifystatus = 'update';
};

const handleModalOk = async () => {
  try {
    await formRef.value.validate();
    confirmLoading.value = true;
    if (form.modifystatus === 'update') {
      var response = await updateHydroelectricity({ ...form,[EnergyManagementFields.STARTDATE]:form[EnergyManagementFields.STARTDATE]?form[EnergyManagementFields.STARTDATE].format('YYYY-MM-DD HH:mm:ss'):null,[EnergyManagementFields.ENDDATE]:form[EnergyManagementFields.ENDDATE]?form[EnergyManagementFields.ENDDATE].format('YYYY-MM-DD HH:mm:ss'):null});
      if (response.code !== 200) {
        showErrorNotification(response.message);
        return;
      }
      showSuccessNotification(t('message.updateSuccess'));
    }
    modalVisible.value = false;
    fetchHydroelectricityData();
  } catch (error) {
    showErrorNotification(error.message || t('message.pleaseTryAgainLater'));
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
    record[EnergyManagementFields.IS_DELETED] = 1;
    var response = await deleteHydroelectricity(record);
    if (response.code !== 200) {
      showErrorNotification(response.message);
      return;
    }
    showSuccessNotification(t('message.deleteSuccess'));
    fetchHydroelectricityData();
  } catch (error) {
    showErrorNotification(t('message.pleaseTryAgainLater'));
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