<template>
  <template v-if="hasChildren">
    <a-sub-menu 
      :key="item.key"
    >
      <template #icon>
        <Icon v-if="item.icon" :type="item.icon" />
      </template>
      
      <template #title>
        <span class="menu-item-content">
          {{ t(item.title) }}
        </span>
      </template>

      <template v-for="child in item.children" :key="child.key">
        <RecursiveMenu :item="child" />
      </template>
    </a-sub-menu>
  </template>

  <template v-else>
    <a-menu-item :key="item.key">
      <router-link 
        :to="item.path" 
        custom 
        v-slot="{ navigate, isActive }"
      >
        <div 
          class="menu-link" 
          @click="(e) => handleMenuClick(e, navigate)"
          :class="{ 'active-menu': isActive }"
        >
          <Icon v-if="item.icon" :type="item.icon" />
          {{ t(item.title) }}
        </div>
      </router-link>
    </a-menu-item>
  </template>
</template>

<script setup>
import { computed, h, resolveComponent } from 'vue';
import { useI18n } from 'vue-i18n';
import { emitter } from '@/utils/eventBus';

const { t } = useI18n();
const props = defineProps({
  item: {
    type: Object,
    required: true
  }
});

const Icon = (props) => {
  if (!props.type) return null;
  try {
    const component = resolveComponent(props.type);
    return h(component, { 
      class: 'menu-icon',
      style: { fontSize: '14px' }
    });
  } catch {
    return null;
  }
};

const handleMenuClick = (e, navigate) => {
  e.stopPropagation();
  navigate();
  window.requestAnimationFrame(() => {
    emitter.emit('menu-click');
  });
};

const hasChildren = computed(() => {
  return !!props.item.children?.length;
});
</script>

<style>
.ant-menu-item, .ant-menu-submenu-title {
  display: flex !important;
  align-items: center !important;
}

.menu-link {
  width: 100%;
  display: flex;
  align-items: center;
  gap: 8px;
}

.menu-item-content {
  display: flex;
  align-items: center;
}

.menu-icon {
  font-size: 14px !important;
  margin-right: 8px;
}

/* 修复Ant Design默认样式覆盖 */
.ant-menu-submenu-arrow {
  margin-left: auto !important;
}
</style>