<template>
  <div>
    <h1 style="margin-bottom: 15px;">{{ translatedPageTitle }}</h1>
    <a-button @click="refreshData" style="margin-bottom: 15px;"><sync-outlined /> {{ $t('message.refreshData') }}</a-button>

    <div v-if="!loading">
      <div v-for="(levelRooms, level) in groupedRooms" :key="level">
        <h2>{{ level }}</h2>
        <a-row :gutter="[20, 20]" class="room-grid">
          <a-col
            v-for="room in levelRooms"
            :key="room[RoomFields.NO]"
            class="room-col"
          >
            <a-tooltip placement="right">
              <template #title>
                 <div v-html="getTooltipContent(room)"></div>
              </template>
              <a-card :title="room[RoomFields.NAME]" class="room-card" hoverable>
                <template #extra>
                  <a-tag :color="getTagColor(room[RoomFields.STATE])" :bordered="false">
                    {{ room[RoomFields.STATE] }}
                  </a-tag>
                </template>
                <p class="room-info">{{ $t('message.roomNo') }}: {{ room[RoomFields.NO] }}</p>
                <p class="room-info">{{ $t('message.custoName') }}: {{ room[RoomFields.CUSTOMER_NAME] || '' }}</p>
                <p class="room-info">
                  {{ $t('message.daysofStay') }}: {{ calculateDaysLived(room[RoomFields.CHECK_IN_TIME]) }}
                </p>
              </a-card>
            </a-tooltip>
          </a-col>
        </a-row>
      </div>
    </div>
    <a-spin v-else size="large" />
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { useRoute } from 'vue-router';
import { 
  RoomFields,
  RoomStateColors,
  RoomStateMap 
} from '@/entities/room.entity';
import { getPageTitle } from '@/utils/pageTitle';
import { fetchRooms } from '@/api/roomapi';
import { formatDate, showErrorNotification, showSuccessNotification, formatCurrency } from '@/utils/index';
import { useI18n } from 'vue-i18n';
import dayjs from 'dayjs';

const { t } = useI18n();
const route = useRoute();
const loading = ref(false);
const rooms = ref([]);

const pageTitleKey = computed(() => getPageTitle(route.path));
const translatedPageTitle = computed(() => t(pageTitleKey.value));
const groupedRooms = computed(() => groupRoomsByPosition());

const fetchRoomData = async () => {
  loading.value = true;
  try {
    const response = await fetchRooms({ 
      [RoomFields.IS_DELETED]: 0,
      [RoomFields.IGNOREPAGING]: true
    });
    
    if (response?.listSource) {
      rooms.value = response.listSource.map(item => ({
        [RoomFields.NO]: item[RoomFields.NO],
        [RoomFields.NAME]: item[RoomFields.NAME],
        [RoomFields.STATE]: RoomStateMap[item[RoomFields.STATE]] || item[RoomFields.STATE],
        [RoomFields.POSITION]: item[RoomFields.POSITION],
        [RoomFields.CUSTOMER_NAME]: item[RoomFields.CUSTOMER_NAME],
        [RoomFields.CHECK_IN_TIME]: item[RoomFields.CHECK_IN_TIME],
        [RoomFields.CHECK_OUT_TIME]: item[RoomFields.CHECK_OUT_TIME],
        [RoomFields.RENT]: item[RoomFields.RENT],
        [RoomFields.DEPOSIT]: item[RoomFields.DEPOSIT]
      }));
    }
  } catch (error) {
    showErrorNotification(error.message || t('message.pleaseTryAgainLater'));
  } finally {
    loading.value = false;
  }
};

const groupRoomsByPosition = () => {
  return rooms.value.reduce((acc, room) => {
    const position = room[RoomFields.POSITION];
    if (!acc[position]) acc[position] = [];
    acc[position].push(room);
    return acc;
  }, {});
};

const calculateDaysLived = (checkInTime) => {
  if (!checkInTime) return '';
  return dayjs().diff(dayjs(checkInTime), 'day') + t('message.dayUnit');
};

const getTooltipContent = (room) => `
  <div class="tooltip-content">
    <p>${t('message.checkInTime')}: ${formatDate(room[RoomFields.CHECK_IN_TIME])}</p>
    <p>${t('message.checkOutTime')}: ${formatDate(room[RoomFields.CHECK_OUT_TIME])}</p>
    <p>${t('message.roomRent')}: ${formatCurrency(room[RoomFields.RENT])}</p>
    <p>${t('message.roomDeposit')}: ${formatCurrency(room[RoomFields.DEPOSIT])}</p>
  </div>
`;

const getTagColor = (state) => RoomStateColors[state] || '#888';

onMounted(fetchRoomData);

const refreshData = () => {
  rooms.value = [];
  fetchRoomData();
};
</script>

<style scoped>
.room-grid {
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-start;
}

.room-col {
  width: 250px;
  margin-bottom: 20px;
}

.room-card {
  padding: 10px;
}

.room-card :deep(.ant-card-head-title) {
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

.tooltip-content p {
  margin: 3px 0;
}
</style>