<template>
    <div>
      <h1 style="margin-bottom: 15px;">{{ translatedPageTitle }}</h1>
      <a-button @click="refreshData" style="margin-bottom: 15px;margin-right: 15px;"><sync-outlined /> {{ $t('message.refreshData') }}</a-button>
      <a-button type="primary" @click="showModal" style="margin-bottom: 15px;"><plus-outlined /> {{ $t('message.insertPassport') }}</a-button>
      <a-table :columns="columns" :data-source="passports" :loading="loading" :pagipassport="pagipassport" @change="handleTableChange" @sorterChange="handleSorterChange" bordered>
        <template #bodyCell="{ column, record }">
          <template v-if="column.key === 'operation'">
            <a-button @click="editPassport(record)" style="margin-right: 15px;"><edit-outlined /> {{ $t('message.edit') }}</a-button>
              <a-popconfirm :title="t('message.areYouSureToDeleteRecord')" @confirm="handleDelete(record)">
              <a-button danger><delete-outlined /> {{ $t('message.delete') }}</a-button>
            </a-popconfirm>
          </template>
        </template>
      </a-table>
  
      <a-modal :open="modalVisible" :title="modalTitle" @ok="handleModalOk" @cancel="handleModalCancel" :confirm-loading="confirmLoading">
        <a-form :model="form" :rules="rules" ref="formRef">
          <a-form-item :label="passportNoLabel" :name="PassportFields.NUMBER">
            <a-input v-model:value="form[PassportFields.NUMBER]" type="hidden" />
            <span>{{ form[PassportFields.NUMBER] }}</span>
          </a-form-item>
          <a-form-item :label="passportNameLabel" :name="PassportFields.NAME">
            <a-input v-model:value="form[PassportFields.NAME]" />
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
  import { fetchPassports, addPassport, updatePassport, deletePassport } from '@/api/passportapi';
  import { 
    PassportFields, 
    initialFormValues, 
    getColumns, 
    getFormRules 
  } from '@/entities/passport.entity';
  import { useI18n } from 'vue-i18n';
  import generateSnowflakeId from '@/utils/snowflake';
  
  const { t } = useI18n();
  const route = useRoute();
  const pageTitleKey = computed(() => getPageTitle(route.path));
  const translatedPageTitle = computed(() => t(pageTitleKey.value));
  const loading = ref(false);
  const passports = ref([]);
  const modalVisible = ref(false);
  const modalTitle = ref('');
  const confirmLoading = ref(false);
  const formRef = ref(null);
  const sortedInfo = ref({ order: null, columnKey: null });
  
  const form = reactive({ ...initialFormValues });
  
  const rules = getFormRules(t);
  
  const passportNoLabel = computed(() => t('message.passportNo'));
  const passportNameLabel = computed(() => t('message.passportName'));
  
  const columns = computed(() => getColumns(t));
  
  const pagipassport = reactive({
      current: 1,
      pageSize: 15,
      total: 0,
      showSizeChanger: true,
      pageSizeOptions: ['15', '30', '50'],
      showTotal: total => t('message.totalRecords', { total })
    });
  
  const fetchPassportData = async () => {
    loading.value = true;
    try {
      const result = await fetchPassports({
        page: pagipassport.current,
        pageSize: pagipassport.pageSize, 
        [PassportFields.IS_DELETED]: 0
      });
      if (result?.listSource) {
        passports.value = result.listSource.map(item => ({
        [PassportFields.NUMBER]: item[PassportFields.NUMBER],
        [PassportFields.NAME]: item[PassportFields.NAME]
      }));
      pagipassport.total = result.total;
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
    fetchPassportData();
  });
  
  const showModal = () => {
    modalVisible.value = true;
    modalTitle.value = t('message.insertPassport');
    form[PassportFields.NUMBER] = generateSnowflakeId({
        prefix: 'N-',
        separator: null,
      });
    form[PassportFields.NAME] = '';
    form.modifystatus = 'insert';
  };
  
  const refreshData = () => 
  {
    fetchPassportData();
  };
  
  const editPassport = (record) => {
    modalVisible.value = true;
    modalTitle.value = t('message.updatePassport');
    form[PassportFields.NUMBER] = record[PassportFields.NUMBER];
    form[PassportFields.NAME] = record[PassportFields.NAME];
    form.modifystatus = 'update';
  };
  
  const handleModalOk = async () => {
    try {
      await formRef.value.validate();
      confirmLoading.value = true;
      if (form.modifystatus === 'update') {
        await updatePassport({ ...form});
        showNotification('success', t('message.operationTitle') , t('message.updateSuccess'));
      } else {
        await addPassport({ ...form});
        showNotification('success', t('message.operationTitle') , t('message.addSuccess'));
      }
      modalVisible.value = false;
      fetchPassportData();
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
      record[PassportFields.IS_DELETED] = 1;
      await deletePassport(record);
      showNotification('success', t('message.operationTitle'), t('message.deleteSuccess'));
      fetchPassportData();
    } catch (error) {
      console.error('Delete error:', error);
      showNotification('error', t('message.operationTitle'), t('message.pleaseTryAgainLater'));
    }
  };
  
  const handleTableChange = (newPagipassport) => {
    pagipassport.current = newPagipassport.current;
    pagipassport.pageSize = newPagipassport.pageSize;
    fetchPassportData();
  };
  
  const handleSorterChange = (pagipassport, filters, sorter) => {
    sortedInfo.value = sorter;
  };
  </script>