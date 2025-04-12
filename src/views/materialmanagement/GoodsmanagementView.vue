<template>
  <div>
    <h1 style="margin-bottom: 15px;">{{ translatedPageTitle }}</h1>
    <a-button @click="refreshData" style="margin-bottom: 15px;margin-right: 15px;"><sync-outlined /> {{ $t('message.refreshData') }}</a-button>
    <a-button type="primary" @click="showModal" style="margin-bottom: 15px;"><plus-outlined /> {{ $t('message.insertGoods') }}</a-button>
    <a-table :columns="columns" :data-source="goodss" :loading="loading" :pagination="pagination" @change="handleTableChange" @sorterChange="handleSorterChange" bordered>
      <template #bodyCell="{ column, record }">
        <template v-if="column.key === 'operation'">
          <a-button @click="editGoods(record)" style="margin-right: 15px;"><edit-outlined /> {{ $t('message.edit') }}</a-button>
          <a-popconfirm :title="t('message.areYouSureToDeleteRecord')" @confirm="handleDelete(record)">
            <a-button danger><delete-outlined /> {{ $t('message.delete') }}</a-button>
          </a-popconfirm>
        </template>
        <template v-else-if="column.key === GoodsFields.PRICE">
          ￥{{ Number(record[GoodsFields.PRICE]).toFixed(2) }}
        </template>
        <template v-else-if="column.key === GoodsFields.STOCK">
          {{ Math.floor(record[GoodsFields.STOCK]) }}
        </template>
      </template>
    </a-table>

    <a-modal :open="modalVisible" :title="modalTitle" @ok="handleModalOk" @cancel="handleModalCancel" :confirm-loading="confirmLoading">
      <a-form :model="form" :rules="rules" ref="formRef">
        <a-form-item :label="goodsNoLabel" :name="GoodsFields.NUMBER">
          <a-input v-model:value="form[GoodsFields.NUMBER]" type="hidden" />
          <span>{{ form[GoodsFields.NUMBER] }}</span>
        </a-form-item>
        <a-form-item :label="goodsNameLabel" :name="GoodsFields.NAME">
          <a-input v-model:value="form[GoodsFields.NAME]" />
        </a-form-item>
        <a-form-item :label="goodsPriceLabel" :name="GoodsFields.PRICE">
          <a-input-number 
            v-model:value="form[GoodsFields.PRICE]" 
            :min="0" 
            :precision="2" 
            style="width: 100%"
          />
        </a-form-item>
        <a-form-item :label="specificationLabel" :name="GoodsFields.SPECIFICATION">
          <a-textarea v-model:value="form[GoodsFields.SPECIFICATION]" />
        </a-form-item>
        <a-form-item :label="stockLabel" :name="GoodsFields.STOCK">
          <a-input-number 
            v-model:value="form[GoodsFields.STOCK]" 
            :min="0" 
            :precision="0" 
            style="width: 100%"
          />
        </a-form-item>
      </a-form>
    </a-modal>
  </div>
</template>

<script setup>
import { ref, onMounted, computed, reactive } from 'vue';
import { useRoute } from 'vue-router';
import { getPageTitle } from '@/utils/pageTitle';
import { useI18n } from 'vue-i18n';
import { 
  GoodsFields, 
  initialFormValues, 
  getColumns, 
  getFormRules 
} from '@/entities/goods.entity';
import { fetchGoodss, addGoods, updateGoods, deleteGoods } from '@/api/goodsapi';
import { showErrorNotification, showSuccessNotification } from '@/utils/index';
import generateSnowflakeId from '@/utils/snowflake';

const { t } = useI18n();
const route = useRoute();
const pageTitleKey = computed(() => getPageTitle(route.path));
const translatedPageTitle = computed(() => t(pageTitleKey.value));
const loading = ref(false);
const goodss = ref([]);
const modalVisible = ref(false);
const modalTitle = ref('');
const confirmLoading = ref(false);
const formRef = ref(null);

const form = reactive({ ...initialFormValues });

const rules = getFormRules(t);

const goodsNoLabel = computed(() => t('message.goodsNumber'));
const goodsNameLabel = computed(() => t('message.goodsName'));
const goodsPriceLabel = computed(() => t('message.goodsPrice'));
const specificationLabel = computed(() => t('message.goodsSpecification'));
const stockLabel = computed(() => t('message.goodsStock'));

const columns = computed(() => getColumns(t));

const pagination = reactive({
  current: 1,
  pageSize: 15,
  total: 0,
  showSizeChanger: true,
  pageSizeOptions: ['15', '20', '50'],
  showTotal: (total) => t('message.totalRecords', { total })
});

const fetchGoodsData = async () => {
  loading.value = true;
  try {
    const result = await fetchGoodss({
      page: pagination.current,
      pageSize: pagination.pageSize,
      [GoodsFields.IS_DELETED]: 0
    });
    if (result?.listSource) {
      goodss.value = result.listSource.map(item => ({
        [GoodsFields.NUMBER]: item[GoodsFields.NUMBER],
        [GoodsFields.NAME]: item[GoodsFields.NAME],
        [GoodsFields.SPECIFICATION]: item[GoodsFields.SPECIFICATION],
        [GoodsFields.PRICE]: item[GoodsFields.PRICE],
        [GoodsFields.STOCK]: item[GoodsFields.STOCK],
        [GoodsFields.IS_DELETED]: item[GoodsFields.IS_DELETED]
      }));
      pagination.total = result.total;
    }
  } catch (error) {
    showErrorNotification(error.message || t('message.fetchDataFailed'));
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  fetchGoodsData();
});

const showModal = () => {
  modalVisible.value = true;
  modalTitle.value = t('message.insertGoods');
  Object.assign(form, {
    ...initialFormValues,
    [GoodsFields.NUMBER]: generateSnowflakeId({ prefix: 'ST-' }),
    modifystatus: 'insert'
  });
};

const refreshData = () => 
{
  fetchGoodsData();
};

const editGoods = (record) => {
  modalVisible.value = true;
  modalTitle.value = t('message.updateGoods');
  Object.assign(form, {
    ...record,
    modifystatus: 'update'
  });
};

const handleModalOk = async () => {
  try {
    await formRef.value.validate();
    confirmLoading.value = true;
    
    const payload = {
      ...form,
      [GoodsFields.PRICE]: Number(form[GoodsFields.PRICE]),
      [GoodsFields.STOCK]: Math.floor(form[GoodsFields.STOCK])
    };

    if (form.modifystatus === 'update') {
      var response = await updateGoods(payload);
      if (response && response.StatusCode !== 200) {
        showErrorNotification(response.message);
        return;
      }
      showSuccessNotification(t('message.updateSuccess'));
    } else {
      var response = await addGoods(payload);
      if (response && response.StatusCode !== 200) {
        showErrorNotification(response.message);
        return;
      }
      showSuccessNotification(t('message.addSuccess'));
    }
    
    modalVisible.value = false;
    fetchGoodsData();
  } catch (error) {
    showErrorNotification(error.message);
  } finally {
    confirmLoading.value = false;
  }
};

const handleModalCancel = () => {
  modalVisible.value = false;
};

const handleDelete = async (record) => {
  try {
    record[DepartmentFields.IS_DELETED] = 1;
    var response = await deleteDepartment(record);
    if (response && response.StatusCode === 200) {
      showErrorNotification(response.message);
      return;
    }
    showSuccessNotification(t('message.deleteSuccess'));
    fetchDepartmentData();
  } catch (error) {
    showErrorNotification(error.message || t('message.pleaseTryAgainLater'));
  }
};

const handleTableChange = (newPagination) => {
  pagination.current = newPagination.current;
  pagination.pageSize = newPagination.pageSize;
  fetchDepartmentData();
};

const handleSorterChange = (pagination, filters, sorter) => {
  sortedInfo.value = sorter;
};
</script>