<template>
  <div>
    <h1 style="margin-bottom: 15px;">{{ translatedPageTitle }}</h1>
    <a-button @click="refreshData" style="margin-bottom: 15px;margin-right: 15px;">{{ $t('message.refreshData') }}</a-button>
    <a-button type="primary" @click="showModal" style="margin-bottom: 15px;">{{ $t('message.insertSupervisionInfo') }}</a-button>
    <a-table :columns="filteredColumns" :data-source="supervisioninfos" :loading="loading" :pagination="pagination" @change="handleTableChange" @sorterChange="handleSorterChange" bordered>
      <template #bodyCell="{ column, record }">
        <template v-if="column.key === 'operation'">
          <a-button @click="editSupervisionInfo(record)" style="margin-right: 15px;">{{ $t('message.edit') }}</a-button>
            <a-popconfirm :title="t('message.areYouSureToDeleteRecord')" @confirm="handleDelete(record)">
            <a-button danger>{{ $t('message.delete') }}</a-button>
          </a-popconfirm>
        </template>
      </template>
    </a-table>

    <a-modal :open="modalVisible" :title="modalTitle" @ok="handleModalOk" @cancel="handleModalCancel" :confirm-loading="confirmLoading">
      <a-form :model="form" :rules="rules" ref="formRef">
        <a-form-item :label="checkNoLabel" name="CheckNo">
          <span>{{ form.CheckNo }}</span>
        </a-form-item>
        <a-form-item :label="checkDepartmentLabel" name="CheckClub">
          <a-select
            v-model:value="form.CheckClub"
            :options="departmentOptions"
            placeholder="Please select department"
          />
        </a-form-item>
        <a-form-item :label="checkProgresLabel" name="CheckProgres">
          <a-textarea v-model:value="form.CheckProgres" />
        </a-form-item>
        <a-form-item :label="checkCashLabel" name="CheckCash">
          <a-textarea v-model:value="form.CheckCash" />
        </a-form-item>
        <a-form-item :label="checkScoreLabel" name="CheckScore">
          <a-input-number id="checkScore" v-model:value="form.CheckScore" :min="0" :max="100" />
        </a-form-item>
        <a-form-item :label="checkPersonLabel" name="CheckPerson">
          <a-input v-model:value="form.CheckPerson" />
        </a-form-item>
        <a-form-item :label="checkAdviceLabel" name="CheckAdvice">
          <a-textarea v-model:value="form.CheckAdvice" />
        </a-form-item>
      </a-form>
    </a-modal>
  </div>
</template>

<script setup>
import { ref, onMounted, computed, reactive } from 'vue';
import { useRoute } from 'vue-router';
import { getPageTitle } from '@/utils/pageTitle';
import { fetchSupervisionInfos, addSupervisionInfo, updateSupervisionInfo, deleteSupervisionInfo } from '@/api/supervisioninfoapi';
import { fetchDepartments } from '@/api/departmentapi';
import { formatDate } from '@/utils/index';
import { useI18n } from 'vue-i18n';
import generateSnowflakeId from '@/utils/snowflake';
import moment from 'moment';

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

const form = reactive({
  CheckNo: null,
  CheckClub: '',
  CheckProgres: '',
  CheckCash: '',
  CheckScore: 0,
  CheckPerson: '',
  CheckAdvice: '',
  DataInsUsr: '',
  DataInsDate: null,
  DataChgUsr: '',
  DataChgDate: null,
  modifystatus: '',
});

const rules = {
  CheckClub: [{ required: true, message: t('message.pleaseInputCheckDepartment'), trigger: 'blur' }],
  CheckProgres: [{ required: true, message: t('message.pleaseInputCheckProgres'), trigger: 'blur' }],
  CheckCash: [{ required: true, message: t('message.pleaseInputCheckCash'), trigger: 'blur' }],
  CheckScore: [{ required: true, message: t('message.pleaseInputCheckScore'), trigger: 'blur' }],
  CheckPerson: [{ required: true, message: t('message.pleaseInputCheckPerson'), trigger: 'blur' }],
  CheckAdvice: [{ required: true, message: t('message.pleaseInputCheckAdvice'), trigger: 'blur' }],
};

const checkNoLabel = computed(() => t('message.checkNo'));
const checkDepartmentLabel = computed(() => t('message.checkDepartment'));
const checkProgresLabel = computed(() => t('message.checkProgres'));
const checkCashLabel = computed(() => t('message.checkCash'));
const checkScoreLabel = computed(() => t('message.checkScore'));
const checkPersonLabel = computed(() => t('message.checkPerson'));
const checkAdviceLabel = computed(() => t('message.checkAdvice'));

const columns = computed(() => [
  {
    title: t('message.checkNo'),
    dataIndex: 'CheckNo',
    key: 'CheckNo',
    sorter: (a, b) => a.CheckNo.localeCompare(b.CheckNo),
    defaultSortOrder: 'ascend'
  },
  {
    title: t('message.checkDepartment'),
    dataIndex: 'CheckClub',
    key: 'CheckClub',
    hidden: true
  },
  {
    title: t('message.checkDepartment'),
    dataIndex: 'CheckClubName',
    key: 'CheckClubName',
  },
  {
    title: t('message.checkProgres'),
    dataIndex: 'CheckProgres',
    key: 'CheckProgres',
  },
  {
    title: t('message.checkCash'),
    dataIndex: 'CheckCash',
    key: 'CheckCash',
  },
  {
    title: t('message.checkScore'),
    dataIndex: 'CheckScore',
    key: 'CheckScore',
  },
  {
    title: t('message.checkPerson'),
    dataIndex: 'CheckPerson',
    key: 'CheckPerson',
  },
  {
    title: t('message.checkAdvice'),
    dataIndex: 'CheckAdvice',
    key: 'CheckAdvice',
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

const fetchSupervisionInfoData = async () => {
  loading.value = true;
  try {
    const result = await fetchSupervisionInfos({
      page: pagination.current,
      pageSize: pagination.pageSize,
      isDelete: 0
    });
    supervisioninfos.value = result;
    pagination.total = result.length;
  } catch (error) {
    window.$notification('error', t('message.operationTitle'), t('message.pleaseTryAgainLater'));
  } finally {
    loading.value = false;
  }
};

const fetchSelectDepartments = async () => {
  try {
    const result = await fetchDepartments();
    departmentOptions.value = result.map((item) => ({
      label: item.dept_name,
      value: item.dept_no,
    }));
  } catch (error) {
    window.$notification('error', t('message.fetchDataFailed'), t('message.pleaseTryAgainLater'));
  }
};

onMounted(() => {
  fetchSupervisionInfoData();
  fetchSelectDepartments();
});

const showModal = () => {
  modalVisible.value = true;
  modalTitle.value = t('message.insertSupervisionInfo');
  form.CheckNo = generateSnowflakeId({
      prefix: 'SI-',
      separator: null,
    });
  form.CheckClub = '';
  form.CheckProgres = '';
  form.CheckCash = '';
  form.CheckScore = 0;
  form.CheckPerson = '';
  form.CheckAdvice = '';
  form.modifystatus = 'insert';
};

const refreshData = () => 
{
  fetchSupervisionInfoData();
};

const editSupervisionInfo = (record) => {
  modalVisible.value = true;
  modalTitle.value = t('message.updateSupervisionInfo');
  form.CheckNo = record.CheckNo;
  form.CheckClub = record.CheckClub;
  form.CheckProgres = record.CheckProgres;
  form.CheckCash = record.CheckCash;
  form.CheckScore = record.CheckScore;
  form.CheckPerson = record.CheckPerson;
  form.CheckAdvice = record.CheckAdvice;
  form.modifystatus = 'update';
};

const handleModalOk = async () => {
  try {
    await formRef.value.validate();
    confirmLoading.value = true;
    if (form.modifystatus === 'update') {
      await updateSupervisionInfo({ ...form });
      window.$notification('success', t('message.operationTitle') , t('message.updateSuccess'));
    } else {
      await addSupervisionInfo({ ...form });
      window.$notification('success', t('message.operationTitle') , t('message.addSuccess'));
    }
    modalVisible.value = false;
    fetchSupervisionInfoData();
  } catch (error) {
    window.$notification('error', t('message.operationTitle'), t('message.pleaseTryAgainLater'));
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
    await deleteSupervisionInfo(record);
    window.$notification('success', t('message.operationTitle'), t('message.deleteSuccess'));
    fetchSupervisionInfoData();
  } catch (error) {
    console.error('Delete error:', error);
    window.$notification('error', t('message.operationTitle'), t('message.pleaseTryAgainLater'));
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