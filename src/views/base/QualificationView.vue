<template>
  <div>
    <h1 style="margin-bottom: 15px;">{{ translatedPageTitle }}</h1>
    <a-button @click="refreshData" style="margin-bottom: 15px;margin-right: 15px;"><sync-outlined /> {{ $t('message.refreshData') }}</a-button>
    <a-button type="primary" @click="showModal" style="margin-bottom: 15px;"><plus-outlined /> {{ $t('message.insertQualification') }}</a-button>
    <a-table :columns="columns" :data-source="qualifications" :loading="loading" :pagination="pagination" @change="handleTableChange" @sorterChange="handleSorterChange" bordered>
      <template #bodyCell="{ column, record }">
        <template v-if="column.key === 'operation'">
          <a-button @click="editQualification(record)" style="margin-right: 15px;"><edit-outlined /> {{ $t('message.edit') }}</a-button>
            <a-popconfirm :title="t('message.areYouSureToDeleteRecord')" @confirm="handleDelete(record)">
              <a-button danger><delete-outlined /> {{ $t('message.delete') }}</a-button>
          </a-popconfirm>
        </template>
      </template>
    </a-table>

    <a-modal :open="modalVisible" :title="modalTitle" @ok="handleModalOk" @cancel="handleModalCancel" :confirm-loading="confirmLoading">
      <a-form :model="form" :rules="rules" ref="formRef">
        <a-form-item :label="qualificationNoLabel" :name="EducationFields.NUMBER">
          <a-input v-model:value="form[EducationFields.NUMBER]" type="hidden" />
          <span>{{ form[EducationFields.NUMBER] }}</span>
        </a-form-item>
        <a-form-item :label="qualificationNameLabel" :name="EducationFields.NAME">
          <a-input v-model:value="form[EducationFields.NAME]" />
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
import { fetchQualifications, addQualification, updateQualification, deleteQualification } from '@/api/qualificationapi';
import { 
  EducationFields, 
  initialFormValues, 
  getColumns, 
  getFormRules 
} from '@/entities/qualification.entity';
import { useI18n } from 'vue-i18n';
import generateSnowflakeId from '@/utils/snowflake';

const { t } = useI18n();
const route = useRoute();
const pageTitleKey = computed(() => getPageTitle(route.path));
const translatedPageTitle = computed(() => t(pageTitleKey.value));
const loading = ref(false);
const qualifications = ref([]);
const modalVisible = ref(false);
const modalTitle = ref('');
const confirmLoading = ref(false);
const formRef = ref(null);
const form = reactive({ ...initialFormValues });
const rules = getFormRules(t);
const sortedInfo = ref({ order: null, columnKey: null });

const qualificationNoLabel = computed(() => t('message.qualificationNo'));
const qualificationNameLabel = computed(() => t('message.qualificationName'));

const columns = computed(() => getColumns(t));

const pagination = reactive({
    current: 1,
    pageSize: 15,
    total: 0,
    showSizeChanger: true,
    pageSizeOptions: ['15', '30', '50'],
    showTotal: total => t('message.totalRecords', { total })
  });

const fetchQualificationData = async () => {
  loading.value = true;
  try {
    const result = await fetchQualifications({
      page: pagination.current,
      pageSize: pagination.pageSize,
      [EducationFields.IS_DELETED]: 0
    });
    if (result?.listSource) {
      qualifications.value = result.listSource.map(item => ({
      [EducationFields.NUMBER]: item[EducationFields.NUMBER],
      [EducationFields.NAME]: item[EducationFields.NAME]
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

onMounted(() => {
  fetchQualificationData();
});

const showModal = () => {
  modalVisible.value = true;
  modalTitle.value = t('message.insertQualification');
  form[EducationFields.NUMBER] = generateSnowflakeId({
      prefix: 'E-',
      separator: null,
    });
  form[EducationFields.NAME] = '';
  form[EducationFields.IS_DELETED] = 0;
  form.modifystatus = 'insert';
};

const refreshData = () => 
{
  fetchQualificationData();
};

const editQualification = (record) => {
  modalVisible.value = true;
  modalTitle.value = t('message.updateQualification');
  form[EducationFields.NUMBER] = record.EducationNumber;
  form[EducationFields.NAME] = record.EducationName;
  form.modifystatus = 'update';
};

const handleModalOk = async () => {
  try {
    await formRef.value.validate();
    confirmLoading.value = true;
    if (form.modifystatus === 'update') {
      await updateQualification({ ...form});
      showNotification('success', t('message.operationTitle') , t('message.updateSuccess'));
    } else {
      await addQualification({ ...form});
      showNotification('success', t('message.operationTitle') , t('message.addSuccess'));
    }
    modalVisible.value = false;
    fetchQualificationData();
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
    record[EducationFields.IS_DELETED] = 1;
    await deleteQualification(record);
    showNotification('success', t('message.operationTitle'), t('message.deleteSuccess'));
    fetchQualificationData();
  } catch (error) {
    console.error('Delete error:', error);
    showNotification('error', t('message.operationTitle'), t('message.pleaseTryAgainLater'));
  }
};

const handleTableChange = (newPagiqualification) => {
  pagination.current = newPagiqualification.current;
  pagination.pageSize = newPagiqualification.pageSize;
  fetchQualificationData();
};

const handleSorterChange = (pagination, filters, sorter) => {
  sortedInfo.value = sorter;
};
</script>