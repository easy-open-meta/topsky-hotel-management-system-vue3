<template>
  <div>
    <h1 style="margin-bottom: 15px;">{{ translatedPageTitle }}</h1>
    <a-button type="primary" @click="showModal" style="margin-bottom: 15px;">{{ $t('message.insertQualification') }}</a-button>
    <a-table :columns="columns" :data-source="qualifications" :loading="loading" :pagiqualification="pagiqualification" @change="handleTableChange" @sorterChange="handleSorterChange" bordered>
      <template #bodyCell="{ column, record }">
        <template v-if="column.key === 'operation'">
          <a-button @click="editQualification(record)" style="margin-right: 15px;">{{ $t('message.edit') }}</a-button>
            <a-popconfirm :title="t('message.areYouSureToDeleteQualification')" @confirm="handleDelete(record)">
            <a-button danger>{{ $t('message.delete') }}</a-button>
          </a-popconfirm>
        </template>
      </template>
    </a-table>

    <a-modal :open="modalVisible" :title="modalTitle" @ok="handleModalOk" @cancel="handleModalCancel" :confirm-loading="confirmLoading">
      <a-form :model="form" :rules="rules" ref="formRef">
        <a-form-item :label="qualificationNoLabel" name="education_no">
          <a-input v-model:value="form.education_no" type="hidden" />
          <span>{{ form.education_no }}</span>
        </a-form-item>
        <a-form-item :label="qualificationNameLabel" name="education_name">
          <a-input v-model:value="form.education_name" />
        </a-form-item>
      </a-form>
    </a-modal>
  </div>
</template>

<script setup>
import { ref, onMounted, computed, reactive } from 'vue';
import { useRoute } from 'vue-router';
import { getPageTitle } from '@/utils/pageTitle';
import { fetchQualifications, addQualification, updateQualification, deleteQualification } from '@/api/qualificationapi';
import { message } from 'ant-design-vue';
import { formatDate } from '@/utils/index';
import { useI18n } from 'vue-i18n';
import { getListNewId } from '@/utils/generateId';
import moment from 'moment';

const { t, locale } = useI18n();
const route = useRoute();
const pageTitleKey = computed(() => getPageTitle(route.path));
const translatedPageTitle = computed(() => t(pageTitleKey.value));
const loading = ref(false);
const qualifications = ref([]);
const modalVisible = ref(false);
const modalTitle = ref('');
const confirmLoading = ref(false);
const formRef = ref(null);
const sortedInfo = ref({ order: null, columnKey: null });

const form = reactive({
  education_no: null,
  education_name: '',
  delete_mk: 0,
  datains_usr: '',
  datains_date: null,
  datachg_usr: '',
  datachg_date: null,
  modifystatus: '',
});

const rules = {
  qualification_name: [{ required: true, message: t('message.pleaseInputQualificationName'), trigger: 'blur' }],
};

const qualificationNoLabel = computed(() => t('message.qualificationNo'));
const qualificationNameLabel = computed(() => t('message.qualificationName'));

const columns = computed(() => [
  {
    title: t('message.qualificationNo'),
    dataIndex: 'education_no',
    key: 'education_no',
    sorter: (a, b) => a.education_no.localeCompare(b.education_no),
    defaultSortOrder: 'ascend'
  },
  {
    title: t('message.qualificationName'),
    dataIndex: 'education_name',
    key: 'education_name',
  },
  {
    title: t('message.operation'),
    key: 'operation',
  },
]);

const pagiqualification = reactive({
  current: 1,
  pageSize: 10,
  total: 0,
});

const fetchQualificationData = async () => {
  loading.value = true;
  try {
    const result = await fetchQualifications({
      page: pagiqualification.current,
      pageSize: pagiqualification.pageSize,
      delete_mk: 0
    });
    qualifications.value = result;
    pagiqualification.total = result.length;
  } catch (error) {
    window.$notification('error', t('message.operationTitle'), t('message.pleaseTryAgainLater'));
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  fetchQualificationData();
});

const showModal = () => {
  modalVisible.value = true;
  modalTitle.value = t('message.insertQualification');
  form.education_no = getListNewId('E', 3, 1)[0];
  form.education_name = '';
  form.delete_mk = 0;
  form.modifystatus = 'insert';
};

const editQualification = (record) => {
  modalVisible.value = true;
  modalTitle.value = t('message.updateQualification');
  form.education_no = record.education_no;
  form.education_name = record.education_name;
  form.modifystatus = 'update';
};

const handleModalOk = async () => {
  try {
    await formRef.value.validate();
    confirmLoading.value = true;
    if (form.modifystatus === 'update') {
      await updateQualification({ ...form});
      window.$notification('success', t('message.operationTitle') , t('message.updateSuccess'));
    } else {
      await addQualification({ ...form});
      window.$notification('success', t('message.operationTitle') , t('message.addSuccess'));
    }
    modalVisible.value = false;
    fetchQualificationData();
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
    record.delete_mk = 1;
    await deleteQualification(record);
    window.$notification('success', t('message.operationTitle'), t('message.deleteSuccess'));
    fetchQualificationData();
  } catch (error) {
    console.error('Delete error:', error);
    window.$notification('error', t('message.operationTitle'), t('message.pleaseTryAgainLater'));
  }
};

const handleTableChange = (newPagiqualification) => {
  pagiqualification.current = newPagiqualification.current;
  pagiqualification.pageSize = newPagiqualification.pageSize;
  fetchQualificationData();
};

const handleSorterChange = (pagiqualification, filters, sorter) => {
  sortedInfo.value = sorter;
};
</script>