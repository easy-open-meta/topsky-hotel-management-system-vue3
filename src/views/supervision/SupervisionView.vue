<template>
  <div>
    <h1 style="margin-bottom: 15px;">{{ translatedPageTitle }}</h1>
    <a-button @click="refreshData" style="margin-bottom: 15px;margin-right: 15px;"><sync-outlined /> {{ $t('message.refreshData') }}</a-button>
    <a-button type="primary" @click="showModal" style="margin-bottom: 15px;"><plus-outlined /> {{ $t('message.insertSupervisionInfo') }}</a-button>
    <a-table :columns="filteredColumns" :data-source="supervisioninfos" :loading="loading" :pagination="pagination" @change="handleTableChange" @sorterChange="handleSorterChange" bordered>
      <template #bodyCell="{ column, record }">
        <template v-if="column.key === 'operation'">
          <a-button @click="editSupervisionInfo(record)" style="margin-right: 15px;"><edit-outlined /> {{ $t('message.edit') }}</a-button>
            <a-popconfirm :title="t('message.areYouSureToDeleteRecord')" @confirm="handleDelete(record)">
            <a-button danger><delete-outlined /> {{ $t('message.delete') }}</a-button>
          </a-popconfirm>
        </template>
        <template v-else-if="column.key === SupervisionFields.DATA_INS_DATE">
          {{ formatDate(record[SupervisionFields.DATA_INS_DATE]) }}
        </template>
      </template>
    </a-table>

    <a-modal :open="modalVisible" :title="modalTitle" @ok="handleModalOk" @cancel="handleModalCancel" :confirm-loading="confirmLoading">
      <a-form :model="form" :rules="rules" ref="formRef">
        <a-form-item :label="checkNoLabel" :name="SupervisionFields.CHECK_NO">
          <span>{{ form[SupervisionFields.CHECK_NO] }}</span>
        </a-form-item>
        <a-form-item :label="checkDepartmentLabel" :name="SupervisionFields.CHECK_CLUB">
          <a-select
            v-model:value="form[SupervisionFields.CHECK_CLUB]"
            :options="departmentOptions"
            :placeholder="t('message.pleaseInputCheckDepartment')"
          />
        </a-form-item>
        <a-form-item :label="checkProgresLabel" :name="SupervisionFields.CHECK_PROGRES">
          <a-textarea v-model:value="form[SupervisionFields.CHECK_PROGRES]" />
        </a-form-item>
        <a-form-item :label="checkCashLabel" :name="SupervisionFields.CHECK_CASH">
          <a-textarea v-model:value="form[SupervisionFields.CHECK_CASH]" />
        </a-form-item>
        <a-form-item :label="checkScoreLabel" :name="SupervisionFields.CHECK_SCORE">
          <a-input-number 
            v-model:value="form[SupervisionFields.CHECK_SCORE]" 
            :min="0" 
            :max="100" 
          />
        </a-form-item>
        <a-form-item :label="checkPersonLabel" :name="SupervisionFields.CHECK_PERSON">
          <a-input v-model:value="form[SupervisionFields.CHECK_PERSON]" />
        </a-form-item>
        <a-form-item :label="checkAdviceLabel" :name="SupervisionFields.CHECK_ADVICE">
          <a-textarea v-model:value="form[SupervisionFields.CHECK_ADVICE]" />
        </a-form-item>
      </a-form>
    </a-modal>
  </div>
</template>

<script setup>
import { ref, onMounted, computed, reactive } from 'vue';
import { useRoute } from 'vue-router';
import { getPageTitle } from '@/utils/pageTitle';
import { 
  SupervisionFields, 
  initialFormValues, 
  getColumns, 
  getFormRules 
} from '@/entities/supervision.entity';
import { fetchSupervisionInfos, addSupervisionInfo, updateSupervisionInfo, deleteSupervisionInfo } from '@/api/supervisioninfoapi';
import { fetchDepartments } from '@/api/departmentapi';
import { DepartmentFields } from '@/entities/department.entity';
import { formatDate, showNotification } from '@/utils/index';
import { useI18n } from 'vue-i18n';
import generateSnowflakeId from '@/utils/snowflake';
import dayjs from 'dayjs';

const { t } = useI18n();
const route = useRoute();
const pageTitleKey = computed(() => getPageTitle(route.path));
const translatedPageTitle = computed(() => t(pageTitleKey.value));
const loading = ref(false);
const supervisioninfos = ref([]);
const modalVisible = ref(false);
const modalTitle = ref('');
const confirmLoading = ref(false);
const formRef = ref(null);
const sortedInfo = ref({ order: null, columnKey: null });
const departmentOptions = ref([]);

const form = reactive({ ...initialFormValues });

const rules = getFormRules(t);

const checkNoLabel = computed(() => t('message.checkNo'));
const checkDepartmentLabel = computed(() => t('message.checkDepartment'));
const checkProgresLabel = computed(() => t('message.checkProgres'));
const checkCashLabel = computed(() => t('message.checkCash'));
const checkScoreLabel = computed(() => t('message.checkScore'));
const checkPersonLabel = computed(() => t('message.checkPerson'));
const checkAdviceLabel = computed(() => t('message.checkAdvice'));

const columns = computed(() => getColumns(t));
const filteredColumns = computed(() => columns.value.filter(column => !column.hidden));

const pagination = reactive({
  current: 1,
  pageSize: 15,
  total: 0,
  showSizeChanger: true,
  pageSizeOptions: ['15', '20', '50'],
  showTotal: total => t('message.totalRecords', { total })
});

const fetchSupervisionInfoData = async () => {
  loading.value = true;
  try {
    const result = await fetchSupervisionInfos({
      page: pagination.current,
      pageSize: pagination.pageSize,
      [SupervisionFields.IS_DELETED]: 0
    });
    if (result?.listSource) {
      supervisioninfos.value = result.listSource.map(item => ({
        [SupervisionFields.CHECK_NO]: item[SupervisionFields.CHECK_NO],
        [SupervisionFields.CHECK_CLUB]: item[SupervisionFields.CHECK_CLUB],
        [SupervisionFields.CHECK_CLUB_NAME]: item[SupervisionFields.CHECK_CLUB_NAME],
        [SupervisionFields.CHECK_PROGRES]: item[SupervisionFields.CHECK_PROGRES],
        [SupervisionFields.CHECK_CASH]: item[SupervisionFields.CHECK_CASH],
        [SupervisionFields.CHECK_SCORE]: item[SupervisionFields.CHECK_SCORE],
        [SupervisionFields.CHECK_PERSON]: item[SupervisionFields.CHECK_PERSON],
        [SupervisionFields.CHECK_ADVICE]: item[SupervisionFields.CHECK_ADVICE],
        [SupervisionFields.DATA_INS_USR]: item[SupervisionFields.DATA_INS_USR],
        [SupervisionFields.DATA_INS_DATE]: item[SupervisionFields.DATA_INS_DATE],
        [SupervisionFields.DATA_CHG_USR]: item[SupervisionFields.DATA_CHG_USR],
        [SupervisionFields.DATA_CHG_DATE]: item[SupervisionFields.DATA_CHG_DATE],
      }));
      pagination.total = result.total;
    } else {
      throw new Error('数据格式错误');
    }
  } catch (error) {
    showNotification('error', t('message.operationTitle'), t('message.pleaseTryAgainLater'));
  } finally {
    loading.value = false;
  }
};

const fetchSelectDepartments = async () => {
  try {
    const result = await fetchDepartments({
      [SupervisionFields.IS_DELETED]: 0
    });
    departmentOptions.value = result.listSource.map((item) => ({
      label: item[DepartmentFields.NAME],
      value: item[DepartmentFields.NUMBER],
    }));
  } catch (error) {
    showNotification('error', t('message.fetchDataFailed'), t('message.pleaseTryAgainLater'));
  }
};

onMounted(() => {
  fetchSupervisionInfoData();
  fetchSelectDepartments();
});

const showModal = () => {
  modalVisible.value = true;
  modalTitle.value = t('message.insertSupervisionInfo');
  Object.assign(form, initialFormValues);
  form[SupervisionFields.CHECK_NO] = generateSnowflakeId({
    prefix: 'SI-',
    separator: null,
  });
  form.modifystatus = 'insert';
};

const refreshData = () => {
  fetchSupervisionInfoData();
};

const editSupervisionInfo = (record) => {
  modalVisible.value = true;
  modalTitle.value = t('message.updateSupervisionInfo');
  Object.keys(SupervisionFields).forEach(field => {
    form[field] = record[field] || initialFormValues[field];
  });
  form.modifystatus = 'update';
};

const handleModalOk = async () => {
  try {
    await formRef.value.validate();
    confirmLoading.value = true;
    const payload = { 
      ...form,
      [SupervisionFields.DATA_INS_DATE]: form[SupervisionFields.DATA_INS_DATE]?.format('YYYY-MM-DD'),
      [SupervisionFields.DATA_CHG_DATE]: dayjs().format('YYYY-MM-DD')
    };

    if (form.modifystatus === 'update') {
      await updateSupervisionInfo(payload);
      showNotification('success', t('message.operationTitle'), t('message.updateSuccess'));
    } else {
      await addSupervisionInfo(payload);
      showNotification('success', t('message.operationTitle'), t('message.addSuccess'));
    }
    modalVisible.value = false;
    fetchSupervisionInfoData();
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
    record[SupervisionFields.IS_DELETED] = 1;
    await deleteSupervisionInfo(record);
    showNotification('success', t('message.operationTitle'), t('message.deleteSuccess'));
    fetchSupervisionInfoData();
  } catch (error) {
    console.error('Delete error:', error);
    showNotification('error', t('message.operationTitle'), t('message.pleaseTryAgainLater'));
  }
};

const handleTableChange = (newPagination) => {
  pagination.current = newPagination.current;
  pagination.pageSize = newPagination.pageSize;
  fetchSupervisionInfoData();
};

const handleSorterChange = (pagination, filters, sorter) => {
  sortedInfo.value = sorter;
};
</script>