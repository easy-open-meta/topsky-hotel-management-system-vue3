<template>
    <div>
      <h1 style="margin-bottom: 15px;">{{ translatedPageTitle }}</h1>
      <a-button @click="refreshData" style="margin-bottom: 15px;margin-right: 15px;"><sync-outlined /> {{ $t('message.refreshData') }}</a-button>
      <a-button type="primary" @click="showModal" style="margin-bottom: 15px;"><plus-outlined /> {{ $t('message.insertAdminType') }}</a-button>
      <a-table :columns="columns" :data-source="roles" :loading="loading" :pagination="pagination" @change="handleTableChange" @sorterChange="handleSorterChange" bordered>
        <template #bodyCell="{ column, record }">
          <template v-if="column.key === 'operation'">
            <a-button @click="editAdminType(record)" style="margin-right: 15px;"><edit-outlined /> {{ $t('message.edit') }}</a-button>
              <a-popconfirm :title="t('message.areYouSureToDeleteRecord')" @confirm="handleDelete(record)">
              <a-button danger><delete-outlined /> {{ $t('message.delete') }}</a-button>
            </a-popconfirm>
          </template>
        </template>
      </a-table>
  
      <a-modal :open="modalVisible" :title="modalTitle" @ok="handleModalOk" @cancel="handleModalCancel" :confirm-loading="confirmLoading">
        <a-form :model="form" :rules="rules" ref="formRef">
          <a-form-item :label="typeNoLabel" :name="AdministratorTypeFields.NUMBER">
            <a-input v-model:value="form[AdministratorTypeFields.NUMBER]" type="hidden" />
            <span>{{ form[AdministratorTypeFields.NUMBER] }}</span>
          </a-form-item>
          <a-form-item :label="typeNameLabel" :name="AdministratorTypeFields.NAME">
            <a-input v-model:value="form[AdministratorTypeFields.NAME]" />
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
  import { fetchAdminTypes, addAdminType, updateAdminType, deleteAdminType } from '@/api/administratortypeapi';
  import { 
    AdministratorTypeFields, 
    initialFormValues, 
    getColumns, 
    getFormRules 
  } from '@/entities/administratortype.entity';
  import { useI18n } from 'vue-i18n';
  import generateSnowflakeId from '@/utils/snowflake';
  
  const { t } = useI18n();
  const route = useRoute();
  const pageTitleKey = computed(() => getPageTitle(route.path));
  const translatedPageTitle = computed(() => t(pageTitleKey.value));
  const loading = ref(false);
  const roles = ref([]);
  const modalVisible = ref(false);
  const modalTitle = ref('');
  const confirmLoading = ref(false);
  const formRef = ref(null);
  const sortedInfo = ref({ order: null, columnKey: null });
  
  const form = reactive({ ...initialFormValues });
  
  const rules = getFormRules(t);
  
  const typeNoLabel = computed(() => t('message.adminTypeNumber'));
  const typeNameLabel = computed(() => t('message.adminTypeName'));
  
  const columns = computed(() => getColumns(t));
  
  const pagination = reactive({
      current: 1,
      pageSize: 15,
      total: 0,
      showSizeChanger: true,
      pageSizeOptions: ['15', '30', '50'],
      showTotal: total => t('message.totalRecords', { total })
    });
  
  const fetchAdminTypeData = async () => {
    loading.value = true;
    try {
      const result = await fetchAdminTypes({
        page: pagination.current,
        pageSize: pagination.pageSize, 
        [AdministratorTypeFields.IS_DELETED]: 0
      });
      if (result?.listSource) {
        roles.value = result.listSource.map(item => ({
        [AdministratorTypeFields.NUMBER]: item[AdministratorTypeFields.NUMBER],
        [AdministratorTypeFields.NAME]: item[AdministratorTypeFields.NAME]
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
    fetchAdminTypeData();
  });
  
  const showModal = () => {
    modalVisible.value = true;
    modalTitle.value = t('message.insertAdminType');
    form[AdministratorTypeFields.NUMBER] = generateSnowflakeId({
        prefix: 'AT-',
        separator: null,
      });
    form[AdministratorTypeFields.NAME] = '';
    form.modifystatus = 'insert';
  };
  
  const refreshData = () => 
  {
    fetchAdminTypeData();
  };
  
  const editAdminType = (record) => {
    modalVisible.value = true;
    modalTitle.value = t('message.updateAdminType');
    form[AdministratorTypeFields.NUMBER] = record[AdministratorTypeFields.NUMBER];
    form[AdministratorTypeFields.NAME] = record[AdministratorTypeFields.NAME];
    form.modifystatus = 'update';
  };
  
  const handleModalOk = async () => {
    try {
      await formRef.value.validate();
      confirmLoading.value = true;
      if (form.modifystatus === 'update') {
        var response = await updateAdminType({ ...form});
      if (response && response.StatusCode !== 200) {
        showErrorNotification(t('message.updateFailed'));
        return;
      }
        showSuccessNotification(t('message.updateSuccess'));
      } else {
        var response = await addAdminType({ ...form});
        if (response && response.StatusCode !== 200) {
          showErrorNotification(t('message.addFailed'));
          return;
        }
        showSuccessNotification(t('message.addSuccess'));
      }
      modalVisible.value = false;
      fetchAdminTypeData();
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
      record[AdministratorTypeFields.IS_DELETED] = 1;
      var response = await deleteAdminType(record);
      if (response && response.StatusCode !== 200) {
        showErrorNotification(t('message.operationTitle'), t('message.deleteFailed'));
        return;
      }
      showSuccessNotification(t('message.deleteSuccess'));
      fetchAdminTypeData();
    } catch (error) {
      showErrorNotification(error.message || t('message.pleaseTryAgainLater'));
    }
  };
  
  const handleTableChange = (newPagirole) => {
    pagirole.current = newPagirole.current;
    pagirole.pageSize = newPagirole.pageSize;
    fetchAdminTypeData();
  };
  
  const handleSorterChange = (pagirole, filters, sorter) => {
    sortedInfo.value = sorter;
  };
  </script>