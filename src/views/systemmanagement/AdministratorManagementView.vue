<template>
  <div>
    <h1 style="margin-bottom: 15px;">{{ translatedPageTitle }}</h1>
    <a-button @click="refreshData" style="margin-bottom: 15px;margin-right: 15px;"><sync-outlined /> {{ $t('message.refreshData') }}</a-button>
    <a-button type="primary" @click="showModal" style="margin-bottom: 15px;"><plus-outlined /> {{ $t('message.insertAdministrator') }}</a-button>
    <a-table :columns="filteredColumns" :data-source="admins" :loading="loading" :pagination="pagination" @change="handleTableChange" @sorterChange="handleSorterChange" bordered>
      <template #bodyCell="{ column, record }">
        <template v-if="column.key === 'operation'">
          <a-button @click="editAdministrator(record)" style="margin-right: 15px;"><edit-outlined /> {{ $t('message.edit') }}</a-button>
            <a-popconfirm :title="t('message.areYouSureToDeleteRecord')" @confirm="handleDelete(record)">
            <a-button danger><delete-outlined /> {{ $t('message.delete') }}</a-button>
          </a-popconfirm>
        </template>
      </template>
    </a-table>

    <a-modal :open="modalVisible" :title="modalTitle" @ok="handleModalOk" @cancel="handleModalCancel" :confirm-loading="confirmLoading">
      <a-form :model="form" :rules="rules" ref="formRef">
        <a-form-item :label="adminNumberLabel" :name="AdministratorFields.NUMBER">
          <a-input v-model:value="form[AdministratorFields.NUMBER]" type="hidden" />
          <span>{{ form[AdministratorFields.NUMBER] }}</span>
        </a-form-item>
        <a-form-item :label="adminNameLabel" :name="AdministratorFields.NAME">
          <a-input v-model:value="form[AdministratorFields.NAME]" :placeholder="t('message.pleaseInputAdminName')" />
        </a-form-item>
        <a-form-item :label="adminAccountLabel" :name="AdministratorFields.ACCOUNT">
          <a-input v-model:value="form[AdministratorFields.ACCOUNT]" :placeholder="t('message.pleaseInputAdminAccount')" />
        </a-form-item>
        <a-form-item :label="adminPasswordLabel" :name="AdministratorFields.PASSWORD">
          <a-input-password v-model:value="form[AdministratorFields.PASSWORD]" :placeholder="form.modifystatus === 'update' ? t('message.passwordEditTip') : t('message.pleaseInputAdminPassword')" />
        </a-form-item>
        <a-form-item :label="adminTypeLabel" :name="AdministratorFields.TYPE">
          <a-select
            v-model:value="form[AdministratorFields.TYPE]"
            :options="adminTypeOptions"
            :placeholder="t('message.pleaseInputAdminType')"
          />
        </a-form-item>
        <a-form-item :label="isSuperAdminLabel" :name="AdministratorFields.ISSUPERADMIN">
          <a-radio-group v-model:value="form[AdministratorFields.ISSUPERADMIN]">
            <a-radio-button :value="SuperAdmin.YES">{{ $t('message.yes') }}</a-radio-button>
            <a-radio-button :value="SuperAdmin.NO">{{ $t('message.no') }}</a-radio-button>
          </a-radio-group>
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
import { fetchAdmins, addAdmin, updateAdmin, deleteAdmin } from '@/api/administratorapi';
import { fetchAdminTypes } from '@/api/administratortypeapi';
import { 
  AdministratorTypeFields
} from '@/entities/administratortype.entity';
import { 
  AdministratorFields,
  SuperAdmin, 
  initialFormValues, 
  getColumns, 
  getFormRules 
} from '@/entities/administrator.entity';
import { useI18n } from 'vue-i18n';
import generateSnowflakeId from '@/utils/snowflake';

const { t } = useI18n();
const route = useRoute();
const pageTitleKey = computed(() => getPageTitle(route.path));
const translatedPageTitle = computed(() => t(pageTitleKey.value));
const loading = ref(false);
const admins = ref([]);
const modalVisible = ref(false);
const modalTitle = ref('');
const confirmLoading = ref(false);
const formRef = ref(null);
const sortedInfo = ref({ order: null, columnKey: null });
const adminTypeOptions = ref([]);

const form = reactive({ ...initialFormValues });

const rules = computed(() => getFormRules(t, form.modifystatus === 'update'));

const adminNumberLabel = computed(() => t('message.adminNumber'));
const adminNameLabel = computed(() => t('message.adminName'));
const adminAccountLabel = computed(() => t('message.adminAccount'));
const adminPasswordLabel = computed(() => t('message.adminPassword'));
const adminTypeLabel = computed(() => t('message.adminType'));
const isSuperAdminLabel = computed(() => t('message.isSuperAdminFlag'));

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

const fetchAdministratorData = async () => {
  loading.value = true;
  try {
    const result = await fetchAdmins({
      page: pagination.current,
      pageSize: pagination.pageSize, 
      [AdministratorFields.IS_DELETED]: 0
    });
    if (result?.listSource) {
      admins.value = result.listSource.map(item => ({
      [AdministratorFields.NUMBER]: item[AdministratorFields.NUMBER],
      [AdministratorFields.NAME]: item[AdministratorFields.NAME],
      [AdministratorFields.ACCOUNT]: item[AdministratorFields.ACCOUNT],
      [AdministratorFields.PASSWORD]: item[AdministratorFields.PASSWORD],
      [AdministratorFields.TYPE]: item[AdministratorFields.TYPE],
      [AdministratorFields.TYPENAME]: item[AdministratorFields.TYPENAME],
      [AdministratorFields.ISSUPERADMIN]: item[AdministratorFields.ISSUPERADMIN],
      [AdministratorFields.ISSUPERADMINDESCRIPTION]: item[AdministratorFields.ISSUPERADMINDESCRIPTION],
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

const fetchSelectAdminTypes = async () => {
  try {
    const result = await fetchAdminTypes({
      [AdministratorTypeFields.IS_DELETED]: 0,
      [AdministratorTypeFields.IGNOREPAGING]: true,
    });
    adminTypeOptions.value = result.listSource.map((item) => ({
      label: item[AdministratorTypeFields.NAME],
      value: item[AdministratorTypeFields.NUMBER],
    }));
  } catch (error) {
    showNotification('error', t('message.fetchDataFailed'), t('message.pleaseTryAgainLater'));
  }
};

onMounted(() => {
  Promise.all([fetchAdministratorData(), fetchSelectAdminTypes()]);
});

const showModal = () => {
  modalVisible.value = true;
  modalTitle.value = t('message.insertAdministrator');
  form[AdministratorFields.NUMBER] = generateSnowflakeId({
      prefix: 'AD-',
      separator: null,
    });
  form[AdministratorFields.NAME] = '';
  form[AdministratorFields.ACCOUNT] = '';
  form[AdministratorFields.PASSWORD] = '';
  form[AdministratorFields.TYPE] = '';
  form[AdministratorFields.ISSUPERADMIN] = null;
  form.modifystatus = 'insert';
};

const refreshData = () => 
{
  fetchAdministratorData();
};

const editAdministrator = (record) => {
  modalVisible.value = true;
  modalTitle.value = t('message.updateAdministrator');
  form[AdministratorFields.NUMBER] = record[AdministratorFields.NUMBER];
  form[AdministratorFields.NAME] = record[AdministratorFields.NAME];
  form[AdministratorFields.ACCOUNT] = record[AdministratorFields.ACCOUNT];
  form[AdministratorFields.PASSWORD] = '';
  form[AdministratorFields.TYPE] = record[AdministratorFields.TYPE];
  form[AdministratorFields.ISSUPERADMIN] = record[AdministratorFields.ISSUPERADMIN];
  form[AdministratorFields.ORIGINALPASSWORD] = record[AdministratorFields.PASSWORD];
  form.modifystatus = 'update';
};

const handleModalOk = async () => {
  try {
    await formRef.value.validate();
    confirmLoading.value = true;

    const submitData = { 
      ...form,
    };

    if (form.modifystatus === 'update') {
      if (!submitData[AdministratorFields.PASSWORD]) {
        submitData[AdministratorFields.PASSWORD] = form.originalPassword;
      }
      if (submitData[AdministratorFields.PASSWORD] === form.originalPassword) {
        delete submitData[AdministratorFields.PASSWORD];
      }
    }

    if (form.modifystatus === 'update') {
      await updateAdmin(submitData);
      showNotification('success', t('message.operationTitle') , t('message.updateSuccess'));
    } else {
      await addAdmin(submitData);
      showNotification('success', t('message.operationTitle') , t('message.addSuccess'));
    }
    modalVisible.value = false;
    fetchAdministratorData();
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
    record[AdministratorFields.IS_DELETED] = 1;
    await deleteAdmin(record);
    showNotification('success', t('message.operationTitle'), t('message.deleteSuccess'));
    fetchAdministratorData();
  } catch (error) {
    console.error('Delete error:', error);
    showNotification('error', t('message.operationTitle'), t('message.pleaseTryAgainLater'));
  }
};

const handleTableChange = (newPagination) => {
  pagination.current = newPagination.current;
  pagination.pageSize = newPagination.pageSize;
  fetchAdministratorData();
};

const handleSorterChange = (pagination, filters, sorter) => {
  sortedInfo.value = sorter;
};
</script>