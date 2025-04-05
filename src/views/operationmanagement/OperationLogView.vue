<template>
  <div>
    <h1 style="margin-bottom: 15px;">{{ translatedPageTitle }}</h1>
    <div style="margin-bottom: 24px;">
      <a-button @click="refreshData" style="margin-right: 12px;">
        <sync-outlined /> {{ $t('message.refreshData') }}
      </a-button>
      <a-button @click="deleteLogBySevenDays" style="margin-right: 12px;" danger>
        <delete-outlined /> {{ $t('message.deleteLogBySevenDays') }}
      </a-button>
    </div>

    <a-table 
      :columns="columns" 
      :data-source="logs" 
      :loading="loading" 
      :pagination="pagination"
      :scroll="{ x: 1500 }"
      bordered
      @change="handleTableChange"
    >
      <template #bodyCell="{ column, record }">
        <template v-if="column.key === 'operation'">
          <a-popconfirm 
            :title="t('message.confirmDeleteLog')"
            @confirm="handleDelete(record)"
          >
            <a-button danger><delete-outlined /> {{ $t('message.delete') }}</a-button>
          </a-popconfirm>
        </template>
        <template v-else-if="column.key === LogFields.LEVELNAME">
          <a-tag :color="getLogLevelColor(record[LogFields.LEVEL])">
            {{ record[LogFields.LEVELNAME] }}
          </a-tag>
        </template>
        <template v-else-if="column.key === LogFields.IPADDRESS">
          <global-outlined /> {{ record[LogFields.IPADDRESS] }}
        </template>
      </template>
    </a-table>
  </div>
</template>

<script setup>
import { ref, onMounted, computed, reactive } from 'vue';
import { useRoute } from 'vue-router';
import { useI18n } from 'vue-i18n';
import { SyncOutlined, GlobalOutlined } from '@ant-design/icons-vue';
import { 
  LogFields, 
  initialFormValues, 
  getColumns 
} from '@/entities/log.entity';
import { fetchOperationlogs,deleteOperationlogByRange, deleteOperationlog } from '@/api/utilityapi';
import { showNotification } from '@/utils/index';
import { getPageTitle } from '@/utils/pageTitle';

const { t } = useI18n();
const route = useRoute();

const loading = ref(false);
const logs = ref([]);
const logLevelFilter = ref(null);
const dateRange = ref([]);

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

const levelOptions = [
  { label: t('message.normal'), value: 100 },
  { label: t('message.warning'), value: 200 },
  { label: t('message.error'), value: 300 }
];

const fetchLogData = async () => {
  loading.value = true;
  try {
    const params = {
      page: pagination.current,
      pageSize: pagination.pageSize,
      [LogFields.IS_DELETED]: 0
    };

    const result = await fetchOperationlogs(params);
    if (result?.listSource) {
      logs.value = result.listSource.map(item => ({
        ...item,
        [LogFields.LEVELNAME]: getLevelName(item[LogFields.LEVEL])
      }));
      pagination.total = result.total;
    }
  } catch (error) {
    showNotification('error', t('message.operationFailed'), error.message);
  } finally {
    loading.value = false;
  }
};

const getLevelName = (level) => {
  const levels = { 100: t('message.normal'), 300: t('message.error'), 200: t('message.warning') };
  return levels[level] || 'UNKNOWN';
};

const getLogLevelColor = (level) => {
  const colors = { 100: 'green', 300: 'red', 200: 'orange' };
  return colors[level] || 'gray';
};

const handleTableChange = (newPagination) => {
  pagination.current = newPagination.current;
  pagination.pageSize = newPagination.pageSize;
  fetchLogData();
};

const deleteLogBySevenDays = () => {
  const now = new Date();
  
  const sevenDaysAgoStart = new Date(now);
  sevenDaysAgoStart.setDate(now.getDate() - 7);
  sevenDaysAgoStart.setHours(0, 0, 0, 0);

  const sevenDaysAgoEnd = new Date(sevenDaysAgoStart);
  sevenDaysAgoEnd.setHours(23, 59, 59, 999);

  deleteOperationlogByRange({
    startTime: sevenDaysAgoStart.toISOString(), 
    endTime: sevenDaysAgoEnd.toISOString() 
  });
  
  fetchLogData();
};

const handleDelete = async (record) => {
  try {
    deleteOperationlog(record[LogFields.ID]);
    showNotification('success', t('message.deleteSuccess'));
    fetchLogData();
  } catch (error) {
    showNotification('error', t('message.deleteFailed'), error.message);
  }
};

const refreshData = () => {
  pagination.current = 1;
  dateRange.value = [];
  logLevelFilter.value = null;
  fetchLogData();
};

onMounted(fetchLogData);
</script>