<template>
  <div>
    <h1 style="margin-bottom: 15px;">{{ translatedPageTitle }}</h1>
    <a-button @click="refreshData" style="margin-bottom: 15px;">{{ $t('message.refreshData') }}</a-button>

    <div v-if="!loading">
      <div v-for="(levelRooms, level) in groupedRooms" :key="level">
        <h2>{{ level }}</h2>
        <a-row :gutter="[20, 20]" style="display:flex; flex-wrap:wrap; justify-content: flex-start;">
          <a-col
            v-for="room in levelRooms"
            :key="room.RoomNo"
            :style="{ width: '250px', marginBottom: '20px' }"
          >
            <a-tooltip placement="right">
              <template #title>
                 <div v-html="getTooltipContent(room)"></div>
              </template>
              <a-card :title="room.RoomName" :bordered="false" class="room-card" hoverable>
                <template #extra><a-tag :color="getTagColor(room.RoomState)" :bordered="false">{{ room.RoomState }}</a-tag></template>
                <p class="room-info">{{ $t('message.roomNo') }}: {{ room.RoomNo }}</p>
                <p class="room-info">{{ $t('message.custoName') }}: {{ room.CustoName || '' }}</p>
                <p class="room-info" v-if="room.CheckTime">{{ $t('message.daysofStay') }}: {{ calculateDaysLived(room.CheckTime) }}</p>
                <p class="room-info" v-else>{{ $t('message.daysofStay') }}: </p>
              </a-card>
            </a-tooltip>
          </a-col>
        </a-row>
      </div>
    </div>
    <div v-else>
      <a-spin size="large" />
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { useRoute } from 'vue-router';
import { getPageTitle } from '@/utils/pageTitle';
import { showNotification } from '@/utils/index';
import { fetchRooms } from '@/api/roomapi';
import { useI18n } from 'vue-i18n';
import dayjs from 'dayjs';

const { t } = useI18n();
const route = useRoute();
const pageTitleKey = computed(() => getPageTitle(route.path));
const translatedPageTitle = computed(() => t(pageTitleKey.value));
const loading = ref(false);
const rooms = ref([]);
const groupedRooms = ref({});

const fetchRoomData = async () => {
  loading.value = true;
  try {
    const result = await fetchRooms({ delete_mk: 0 });
    rooms.value = result;
    groupRoomsByPosition();
  } catch (error) {
    showNotification('error', t('message.fetchDataFailed'), t('message.pleaseTryAgainLater'));
  } finally {
    loading.value = false;
  }
};

const groupRoomsByPosition = () => {
  const grouped = {};
  rooms.value.forEach(room => {
    if (!grouped[room.RoomPosition]) {
      grouped[room.RoomPosition] = [];
    }
    grouped[room.RoomPosition].push(room);
  });
  groupedRooms.value = grouped;
};

const calculateDaysLived = (checkInTime) => {
  if (!checkInTime) {
    return null;
  }
  const checkInDate = dayjs(checkInTime);
  const now = dayjs();
  const daysLived = now.diff(checkInDate, 'day');
  return `${daysLived} 天`;
};

const getTooltipContent = (room) => {
  const formatMoney = (amount) => {
    if (amount == null) {
      return '';
    }
    const formattedAmount = parseFloat(amount).toFixed(2);
    return `￥${formattedAmount}`;
  };

  return `
    <div>
      <p>${t('message.checkInTime')}: ${room.CheckTime || ''}</p>
      <p>${t('message.checkOutTime')}: ${room.CheckOutTime || ''}</p>
      <p>${t('message.roomRent')}: ${formatMoney(room.RoomMoney)}</p>
      <p>${t('message.roomDeposit')}: ${formatMoney(room.RoomDeposit)}</p>
    </div>
  `;
};

const getTagColor = (state) => {
  let color = 'default';

  switch (state) {
    case '空房':
      color = '#48a54b';
      break;
    case '已住':
      color = '#1f8de5';
      break;
    case '维修中':
      color = '#f0b607';
      break;
    case '脏房':
      color = '#e63f33';
      break;
    case '预约':
      color = '#ff9800';
      break;
  }

  return color;
};

onMounted(() => {
  fetchRoomData();
});

const refreshData = () => {
  fetchRoomData();
};
</script>

<style scoped>
.room-card {
  padding: 10px;
  width: 100%;
}

.room-card .ant-card-head-title {
  font-size: 1em;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.room-info {
  font-size: 0.9em;
  margin-bottom: 5px;
  line-height: 1.2;
}
</style>
