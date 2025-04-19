<template>
    <div>
      <h1 style="margin-bottom: 15px;">{{ translatedPageTitle }}</h1>
      <a-button @click="refreshData" style="margin-bottom: 15px;margin-right: 15px;"><sync-outlined /> {{ $t('message.refreshData') }}</a-button>
      <a-button type="primary" @click="showModal" style="margin-bottom: 15px;"><plus-outlined /> {{ $t('message.insertRole') }}</a-button>
      <a-table :columns="columns" :data-source="roles" :loading="loading" :pagination="pagination" @change="handleTableChange" @sorterChange="handleSorterChange" bordered>
        <template #bodyCell="{ column, record }">
          <template v-if="column.key === 'operation'">
            <a-button @click="editRole(record)" style="margin-right: 15px;"><edit-outlined /> {{ $t('message.edit') }}</a-button>
              <a-popconfirm :title="t('message.areYouSureToDeleteRecord')" @confirm="handleDelete(record)">
              <a-button danger><delete-outlined /> {{ $t('message.delete') }}</a-button>
            </a-popconfirm>
          </template>
        </template>
      </a-table>
  
      <a-modal :open="modalVisible" :title="modalTitle" @ok="handleModalOk" @cancel="handleModalCancel" :confirm-loading="confirmLoading">
        <a-form :model="form" :rules="rules" ref="formRef">
          <a-form-item :label="roleNoLabel" :name="RoleFields.NUMBER">
            <a-input v-model:value="form[RoleFields.NUMBER]" type="hidden" />
            <span>{{ form[RoleFields.NUMBER] }}</span>
          </a-form-item>
          <a-form-item :label="roleNameLabel" :name="RoleFields.NAME">
            <a-input v-model:value="form[RoleFields.NAME]" />
          </a-form-item>
          <a-form-item :label="roleDescriptionLabel" :name="RoleFields.DESCRIPTION">
            <a-textarea v-model:value="form[RoleFields.DESCRIPTION]" :placeholder="t('message.pleaseInputRoleDescription')" />
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
  import { fetchRoles, addRole, updateRole, deleteRole } from '@/api/roleapi';
  import { 
    RoleFields, 
    initialFormValues, 
    getColumns, 
    getFormRules 
  } from '@/entities/role.entity';
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
  
  const roleNoLabel = computed(() => t('message.roleNumber'));
  const roleNameLabel = computed(() => t('message.roleName'));
  const roleDescriptionLabel = computed(() => t('message.roleDescription'));
  
  const columns = computed(() => getColumns(t));
  
  const pagination = reactive({
      current: 1,
      pageSize: 15,
      total: 0,
      showSizeChanger: true,
      pageSizeOptions: ['15', '30', '50'],
      showTotal: total => t('message.totalRecords', { total })
    });
  
  const fetchRoleData = async () => {
    loading.value = true;
    try {
      const result = await fetchRoles({
        page: pagination.current,
        pageSize: pagination.pageSize, 
        [RoleFields.IS_DELETED]: 0
      });
      if (result?.listSource) {
        roles.value = result.listSource.map(item => ({
        [RoleFields.NUMBER]: item[RoleFields.NUMBER],
        [RoleFields.NAME]: item[RoleFields.NAME],
        [RoleFields.DESCRIPTION]: item[RoleFields.DESCRIPTION]
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
    fetchRoleData();
  });
  
  const showModal = () => {
    modalVisible.value = true;
    modalTitle.value = t('message.insertRole');
    form[RoleFields.NUMBER] = generateSnowflakeId({
        prefix: 'RL-',
        separator: null,
      });
    form[RoleFields.NAME] = '';
    form[RoleFields.DESCRIPTION] = '';
    form.modifystatus = 'insert';
  };
  
  const refreshData = () => 
  {
    fetchRoleData();
  };
  
  const editRole = (record) => {
    modalVisible.value = true;
    modalTitle.value = t('message.updateRole');
    form[RoleFields.NUMBER] = record[RoleFields.NUMBER];
    form[RoleFields.NAME] = record[RoleFields.NAME];
    form[RoleFields.DESCRIPTION] = record[RoleFields.DESCRIPTION];
    form.modifystatus = 'update';
  };
  
  const handleModalOk = async () => {
    try {
      await formRef.value.validate();
      confirmLoading.value = true;
      if (form.modifystatus === 'update') {
        var response = await updateRole({ ...form});
      if (response && response.StatusCode !== 200) {
        showErrorNotification(t('message.updateFailed'));
        return;
      }
        showSuccessNotification(t('message.updateSuccess'));
      } else {
        var response = await addRole({ ...form});
        if (response && response.StatusCode !== 200) {
          showErrorNotification(t('message.addFailed'));
          return;
        }
        showSuccessNotification(t('message.addSuccess'));
      }
      modalVisible.value = false;
      fetchRoleData();
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
      record[RoleFields.IS_DELETED] = 1;
      var response = await deleteRole(record);
      if (response && response.StatusCode !== 200) {
        showErrorNotification(t('message.deleteFailed'));
        return;
      }
      showSuccessNotification(t('message.deleteSuccess'));
      fetchRoleData();
    } catch (error) {
      showErrorNotification(error.message || t('message.pleaseTryAgainLater'));
    }
  };
  
  const handleTableChange = (newPagirole) => {
    pagirole.current = newPagirole.current;
    pagirole.pageSize = newPagirole.pageSize;
    fetchRoleData();
  };
  
  const handleSorterChange = (pagirole, filters, sorter) => {
    sortedInfo.value = sorter;
  };
  </script>