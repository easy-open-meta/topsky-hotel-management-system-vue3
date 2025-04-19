<template>
    <div>
      <h1 style="margin-bottom: 15px;">{{ translatedPageTitle }}</h1>
      <div class="operation-bar">
        <a-button @click="refreshData" style="margin-right: 12px;">
          <sync-outlined /> {{ $t('message.refreshData') }}
        </a-button>
        <a-button type="primary" @click="showModal">
          <plus-outlined /> {{ $t('message.insertCustomerType') }}
        </a-button>
      </div>
  
      <a-table 
        :columns="columns" 
        :data-source="customerTypes" 
        :loading="loading"
        :pagination="pagination"
        bordered
        @change="handleTableChange"
      >
        <template #bodyCell="{ column, record }">
          <template v-if="column.key === 'operation'">
            <a-button @click="editCustomerType(record)" style="margin-right: 12px;">
              <edit-outlined /> {{ $t('message.edit') }}
            </a-button>
            <a-popconfirm 
              :title="t('message.areYouSureToDeleteRecord')"
              @confirm="handleDelete(record)"
            >
              <a-button danger>
                <delete-outlined /> {{ $t('message.delete') }}
              </a-button>
            </a-popconfirm>
          </template>
        </template>
      </a-table>
  
      <a-modal 
        :open="modalVisible" 
        :title="modalTitle"
        :confirm-loading="confirmLoading"
        @ok="handleModalOk"
        @cancel="handleModalCancel"
      >
        <a-form
          :model="form"
          :rules="rules"
          ref="formRef"
          layout="vertical"
        >
            <a-form-item :name="CustomerTypeFields.NUMBER" :label="t('message.customerTypeNo')">
                <a-input-number v-model:value="form[CustomerTypeFields.NUMBER]" :disabled="form.modifystatus == 'update'" />
            </a-form-item>
            <a-form-item :label="t('message.customerTypeName')" :name="CustomerTypeFields.NAME">
                <a-input v-model:value="form[CustomerTypeFields.NAME]" :placeholder="t('message.pleaseInputCustomerTypeNo')"/>
            </a-form-item>
        </a-form>
      </a-modal>
    </div>
  </template>
  
  <script setup>
  import { ref, reactive, onMounted, computed } from 'vue';
  import { useRoute } from 'vue-router';
  import { getPageTitle } from '@/utils/pageTitle';
  import { useI18n } from 'vue-i18n';
  import { 
    CustomerTypeFields, 
    initialFormValues, 
    getColumns, 
    getFormRules 
  } from '@/entities/customertype.entity';
  import { 
    fetchCustomerTypes, 
    addCustomerType, 
    updateCustomerType, 
    deleteCustomerType 
  } from '@/api/customertypeapi';
  import { 
    SyncOutlined, 
    PlusOutlined, 
    EditOutlined, 
    DeleteOutlined 
  } from '@ant-design/icons-vue';
  import { showErrorNotification, showSuccessNotification } from '@/utils/index';
  
  const { t } = useI18n();
  const route = useRoute();
  
  const loading = ref(false);
  const customerTypes = ref([]);
  const modalVisible = ref(false);
  const modalTitle = ref('');
  const confirmLoading = ref(false);
  const formRef = ref(null);
  
  const form = reactive({ ...initialFormValues });
  
  const pagination = reactive({
    current: 1,
    pageSize: 15,
    total: 0,
    showSizeChanger: true,
    pageSizeOptions: ['15', '30', '50'],
    showTotal: total => t('message.totalRecords', { total })
  });
  
  const translatedPageTitle = computed(() => t(getPageTitle(route.path)));
  const columns = computed(() => getColumns(t));
  const rules = getFormRules(t);
  
const fetchCustomerTypeData = async () => {
  loading.value = true;
  try {
    const result = await fetchCustomerTypes({
      page: pagination.current,
      pageSize: pagination.pageSize, 
      [CustomerTypeFields.IS_DELETED]: 0
    });
    if (result?.listSource) {
        customerTypes.value = result.listSource.map(item => ({
            [CustomerTypeFields.NUMBER]: item[CustomerTypeFields.NUMBER],
            [CustomerTypeFields.NAME]: item[CustomerTypeFields.NAME]
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
    fetchCustomerTypeData();
});

const showModal = () => {
  modalVisible.value = true;
  modalTitle.value = t('message.insertCustomerType');
  form[CustomerTypeFields.NUMBER] = null;
  form[CustomerTypeFields.NAME] = '';
  form.modifystatus = 'insert';
};

const refreshData = () => 
{
    fetchCustomerTypeData();
};

const editCustomerType = (record) => {
  modalVisible.value = true;
  modalTitle.value = t('message.updateCustomerType');
  form[CustomerTypeFields.NUMBER] = record[CustomerTypeFields.NUMBER];
  form[CustomerTypeFields.NAME] = record[CustomerTypeFields.NAME];
  form.modifystatus = 'update';
};

const handleModalOk = async () => {
  try {
    await formRef.value.validate();
    confirmLoading.value = true;
    if (form.modifystatus === 'update') {
      var response = await updateCustomerType({ ...form});
      if(response && response.StatusCode === 200)
      {
        showSuccessNotification(t('message.updateSuccess'));
      }
      else
      {
        showErrorNotification(t('message.pleaseTryAgainLater'));
      }
    } else {
      var response = await addCustomerType({ ...form});
      if(response && response.StatusCode === 200)
      {
        showSuccessNotification(t('message.addSuccess'));
      }
      else
      {
        showErrorNotification(t('message.pleaseTryAgainLater'));
      }
    }
    modalVisible.value = false;
    fetchCustomerTypeData();
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
    record[CustomerTypeFields.IS_DELETED] = 1;
    var response = await deleteCustomerType(record);
    if(response && response.StatusCode === 200)
    {
      showSuccessNotification(t('message.deleteSuccess'));
    }
    else
    {
      showErrorNotification(t('message.pleaseTryAgainLater'));
    }
    fetchCustomerTypeData();
  } catch (error) {
    showErrorNotification(error.message || t('message.pleaseTryAgainLater'));
  }
};

const handleTableChange = (newPagination) => {
  pagination.current = newPagination.current;
  pagination.pageSize = newPagination.pageSize;
  fetchCustomerTypeData();
};

const handleSorterChange = (pagination, filters, sorter) => {
  sortedInfo.value = sorter;
};
</script>
  
<style scoped>
.operation-bar {
margin-bottom: 24px;
}
</style>