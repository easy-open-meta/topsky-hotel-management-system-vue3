<template>
    <div>
      <h1 style="margin-bottom: 15px;">{{ translatedPageTitle }}</h1>
      <a-button @click="refreshData" style="margin-bottom: 15px;margin-right: 15px;"><sync-outlined /> {{ $t('message.refreshData') }}</a-button>
      <a-button type="primary" @click="showModal" style="margin-bottom: 15px;"><plus-outlined /> {{ $t('message.insertMenu') }}</a-button>
      <a-table :columns="columns" :data-source="roles" :loading="loading" :pagination="pagination" @change="handleTableChange" @sorterChange="handleSorterChange" bordered>
        <template #bodyCell="{ column, record }">
          <template v-if="column.key === 'operation'">
            <a-button @click="editMenu(record)" style="margin-right: 15px;"><edit-outlined /> {{ $t('message.edit') }}</a-button>
              <a-popconfirm :title="t('message.areYouSureToDeleteRecord')" @confirm="handleDelete(record)">
              <a-button danger><delete-outlined /> {{ $t('message.delete') }}</a-button>
            </a-popconfirm>
          </template>
        </template>
      </a-table>
  
      <a-modal :open="modalVisible" :title="modalTitle" @ok="handleModalOk" @cancel="handleModalCancel" :confirm-loading="confirmLoading">
        <a-form :model="form" :rules="rules" ref="formRef">
            <a-form-item :label="menuKeyLabel" :name="MenuFields.KEY">
                <a-input v-model:value="form[MenuFields.KEY]" />
            </a-form-item>
            <a-form-item :label="menuTitleLabel" :name="MenuFields.TITLE">
                <a-input v-model:value="form[MenuFields.TITLE]" />
            </a-form-item>
            <a-form-item :label="menuPathLabel" :name="MenuFields.PATH">
                <a-input v-model:value="form[MenuFields.PATH]" />
            </a-form-item>
            <a-form-item :label="menuParentLabel" :name="MenuFields.PARENT">
            <a-select
                v-model:value="form[MenuFields.PARENT]"
                :options="menuOptions"
                :placeholder="t('message.pleaseInputMenuParent')"
            />
            </a-form-item>
            <a-form-item :label="menuIconLabel" :name="MenuFields.ICON">
                <a-input v-model:value="form[MenuFields.ICON]" :placeholder="t('message.onlySupportAntDesignIcons')"/>
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
  import { fetchMenus, addMenu, updateMenu, deleteMenu } from '@/api/menuapi';
  import { 
    MenuFields, 
    initialFormValues, 
    getColumns, 
    getFormRules 
  } from '@/entities/menu.entity';
  import { useI18n } from 'vue-i18n';
  import { emitter } from '@/utils/eventBus';
  
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
  const menuOptions = ref([]);
  
  const form = reactive({ ...initialFormValues });
  
  const rules = getFormRules(t);
  
  const menuKeyLabel = computed(() => t('message.menuKey'));
  const menuTitleLabel = computed(() => t('message.menuTitle'));
  const menuPathLabel = computed(() => t('message.menuPath'));
  const menuParentLabel = computed(() => t('message.menuParent'));
  const menuIconLabel = computed(() => t('message.menuIcon'));
  
  const columns = computed(() => getColumns(t));
  
  const pagination = reactive({
      current: 1,
      pageSize: 15,
      total: 0,
      showSizeChanger: true,
      pageSizeOptions: ['15', '30', '50'],
      showTotal: total => t('message.totalRecords', { total })
    });
  
  const fetchMenuData = async () => {
    loading.value = true;
    try {
      const result = await fetchMenus({
        page: pagination.current,
        pageSize: pagination.pageSize, 
        [MenuFields.IS_DELETED]: 0
      });
      if (result?.listSource) {
        roles.value = result.listSource.map(item => ({
        [MenuFields.ID]: item[MenuFields.ID],
        [MenuFields.KEY]: item[MenuFields.KEY],
        [MenuFields.TITLE]: item[MenuFields.TITLE],
        [MenuFields.PATH]: item[MenuFields.PATH],
        [MenuFields.PARENT]: item[MenuFields.PARENT],
        [MenuFields.ICON]: item[MenuFields.ICON],
      }));
      pagination.total = result.total;
      } else {
        throw new Error('数据格式错误');
      }
    } catch (error) {
      showErrorNotification(t('message.pleaseTryAgainLater'));
    } finally {
      loading.value = false;
    }
  };
  
const fetchSelectMenus = async () => {
  try {
    const result = await fetchMenus({
      [MenuFields.IGNOREPAGING]: true,
      [MenuFields.IS_DELETED]: 0,
      [MenuFields.ID]: null,
    });
    menuOptions.value = result.listSource.map((item) => ({
      label: item[MenuFields.TITLE],
      value: item[MenuFields.ID],
    }));
  } catch (error) {
    showErrorNotification(t('message.pleaseTryAgainLater'));
  }
};

  onMounted(() => {
    fetchMenuData();
    fetchSelectMenus();
  });
  
  const showModal = () => {
    modalVisible.value = true;
    modalTitle.value = t('message.insertMenu');
    form[MenuFields.KEY] = '';
    form[MenuFields.TITLE] = '';
    form[MenuFields.PATH] = '';
    form[MenuFields.PARENT] = null;
    form[MenuFields.ICON] = '';
    form.modifystatus = 'insert';
  };
  
  const refreshData = () => 
  {
    fetchMenuData();
  };
  
  const editMenu = (record) => {
    modalVisible.value = true;
    modalTitle.value = t('message.updateMenu');
    form[MenuFields.ID] = record[MenuFields.ID];
    form[MenuFields.KEY] = record[MenuFields.KEY];
    form[MenuFields.TITLE] = record[MenuFields.TITLE];
    form[MenuFields.PATH] = record[MenuFields.PATH];
    form[MenuFields.PARENT] = record[MenuFields.PARENT];
    form[MenuFields.ICON] = record[MenuFields.ICON];
    form.modifystatus = 'update';
  };
  
  const handleModalOk = async () => {
    try {
      await formRef.value.validate();
      confirmLoading.value = true;
      if (form.modifystatus === 'update') {
        var response = await updateMenu({ ...form});
        if(response && response.StatusCode === 200) {
          showSuccessNotification(t('message.updateSuccess'));
        }
        else {
          showErrorNotification(response.Message);
        }
      } else {
        var response = await addMenu({ ...form});
        if(response && response.StatusCode === 200) {
          showSuccessNotification(t('message.addSuccess'));
        }
        else {
          showErrorNotification(response.Message);
        }
      }
      modalVisible.value = false;
      fetchMenuData();
      emitter.emit('refresh-menu');
    } catch (error) {
      showErrorNotification(t('message.pleaseTryAgainLater'));
    } finally {
      confirmLoading.value = false;
    }
  };
  
  const handleModalCancel = () => {
    modalVisible.value = false;
  };
  
  const handleDelete = async (record) => {
    try {
      record[MenuFields.ID] = record[MenuFields.ID];
      record[MenuFields.KEY] = record[MenuFields.KEY];
      record[MenuFields.TITLE] = record[MenuFields.TITLE];
      record[MenuFields.PATH] = record[MenuFields.PATH]; 
      record[MenuFields.PARENT] = record[MenuFields.PARENT];
      record[MenuFields.ICON] = record[MenuFields.ICON];
      record[MenuFields.IS_DELETED] = 1;
      await deleteMenu(record);
      showSuccessNotification(t('message.deleteSuccess'));
      emitter.emit('refresh-menu');
      fetchMenuData();
    } catch (error) {
      console.error('Delete error:', error);
      showErrorNotification(t('message.pleaseTryAgainLater'));
    }
  };
  
  const handleTableChange = (newPagination) => {
    pagination.current = newPagination.current;
    pagination.pageSize = newPagination.pageSize;
    fetchMenuData();
  };
  
  const handleSorterChange = (pagination, filters, sorter) => {
    sortedInfo.value = sorter;
  };
  </script>