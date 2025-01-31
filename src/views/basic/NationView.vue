<template>
  <div>
    <h1 style="margin-bottom: 15px;">{{ translatedPageTitle }}</h1>
    <a-button type="primary" @click="showModal" style="margin-bottom: 15px;">{{ $t('message.insertNation') }}</a-button>
    <a-table :columns="columns" :data-source="nations" :loading="loading" :pagination="pagination" @change="handleTableChange" @sorterChange="handleSorterChange" bordered>
      <template #bodyCell="{ column, record }">
        <template v-if="column.key === 'operation'">
          <a-button @click="editNation(record)" style="margin-right: 15px;">{{ $t('message.edit') }}</a-button>
            <a-popconfirm :title="t('message.areYouSureToDeleteNation')" @confirm="handleDelete(record)">
            <a-button danger>{{ $t('message.delete') }}</a-button>
          </a-popconfirm>
        </template>
      </template>
    </a-table>

    <a-modal :open="modalVisible" :title="modalTitle" @ok="handleModalOk" @cancel="handleModalCancel" :confirm-loading="confirmLoading">
      <a-form :model="form" :rules="rules" ref="formRef">
        <a-form-item :label="nationNoLabel" name="nation_no">
          <a-input v-model:value="form.nation_no" type="hidden" />
          <span>{{ form.nation_no }}</span>
        </a-form-item>
        <a-form-item :label="nationNameLabel" name="nation_name">
          <a-input v-model:value="form.nation_name" />
        </a-form-item>
      </a-form>
    </a-modal>
  </div>
</template>

<script setup>
import { ref, onMounted, computed, reactive } from 'vue';
import { useRoute } from 'vue-router';
import { getPageTitle } from '@/utils/pageTitle';
import { fetchNations, addNation, updateNation, deleteNation } from '@/api/nationapi';
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
const nations = ref([]);
const modalVisible = ref(false);
const modalTitle = ref('');
const confirmLoading = ref(false);
const formRef = ref(null);
const sortedInfo = ref({ order: null, columnKey: null });

const form = reactive({
  nation_no: null,
  nation_name: '',
  datains_usr: '',
  datains_date: null,
  datachg_usr: '',
  datachg_date: null,
  modifystatus: '',
});

const rules = {
  nation_name: [{ required: true, message: t('message.pleaseInputNationName'), trigger: 'blur' }],
};

const nationNoLabel = computed(() => t('message.nationNo'));
const nationNameLabel = computed(() => t('message.nationName'));

const columns = computed(() => [
  {
    title: t('message.nationNo'),
    dataIndex: 'nation_no',
    key: 'nation_no',
    sorter: (a, b) => a.nation_no.localeCompare(b.nation_no),
    defaultSortOrder: 'ascend'
  },
  {
    title: t('message.nationName'),
    dataIndex: 'nation_name',
    key: 'nation_name',
  },
  {
    title: t('message.operation'),
    key: 'operation',
  },
]);

const pagination = reactive({
  current: 1,
  pageSize: 10,
  total: 0,
});

const fetchNationData = async () => {
  loading.value = true;
  try {
    const result = await fetchNations({
      page: pagination.current,
      pageSize: pagination.pageSize,
      delete_mk: 0
    });
    nations.value = result;
    pagination.total = result.length;
  } catch (error) {
    window.$notification('error', t('message.operationTitle'), t('message.pleaseTryAgainLater'));
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  fetchNationData();
});

const showModal = () => {
  modalVisible.value = true;
  modalTitle.value = t('message.insertNation');
  form.nation_no = getListNewId('N', 3, 1)[0];
  form.nation_name = '';
  form.modifystatus = 'insert';
};

const editNation = (record) => {
  modalVisible.value = true;
  modalTitle.value = t('message.updateNation');
  form.nation_no = record.nation_no;
  form.nation_name = record.nation_name;
  form.modifystatus = 'update';
};

const handleModalOk = async () => {
  try {
    await formRef.value.validate();
    confirmLoading.value = true;
    if (form.modifystatus === 'update') {
      await updateNation({ ...form});
      window.$notification('success', t('message.operationTitle') , t('message.updateSuccess'));
    } else {
      await addNation({ ...form});
      window.$notification('success', t('message.operationTitle') , t('message.addSuccess'));
    }
    modalVisible.value = false;
    fetchNationData();
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
    await deleteNation(record);
    window.$notification('success', t('message.operationTitle'), t('message.deleteSuccess'));
    fetchNationData();
  } catch (error) {
    console.error('Delete error:', error);
    window.$notification('error', t('message.operationTitle'), t('message.pleaseTryAgainLater'));
  }
};

const handleTableChange = (newPagination) => {
  pagination.current = newPagination.current;
  pagination.pageSize = newPagination.pageSize;
  fetchNationData();
};

const handleSorterChange = (pagination, filters, sorter) => {
  sortedInfo.value = sorter;
};
</script>