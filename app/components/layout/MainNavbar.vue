<template>
  <div id="topbar">
    <div class="topbar-left">
      <button class="sidebar-toggle" @click="isSidebarCollapsed = !isSidebarCollapsed" :title="isSidebarCollapsed ? 'Buka Sidebar' : 'Tutup Sidebar'">
        <!-- Icon: Expand/Menu if collapsed, Shrink/Left if open -->
        <svg v-if="isSidebarCollapsed" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="18" x2="21" y2="18"/></svg>
        <svg v-else viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
          <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
          <line x1="9" y1="3" x2="9" y2="21"/>
          <path d="M16 15l-3-3 3-3"/>
        </svg>
      </button>
      <div class="topbar-title">
        <h2>{{ heading }}</h2>
        <p>{{ sub }}</p>
      </div>
    </div>
    <div class="topbar-actions">
      <div class="period-picker-container">
        <label for="period-select">Periode:</label>
        <input type="month" id="period-select" v-model="selectedPeriode" class="period-input" />
      </div>
      <div class="topbar-btn notif-dot" title="Notifikasi">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>
      </div>
      <div class="topbar-btn" title="Pengaturan">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.07 4.93l-1.41 1.41M4.93 4.93l1.41 1.41M19.07 19.07l-1.41-1.41M4.93 19.07l1.41-1.41M20 12h2M2 12h2M12 20v2M12 2v2"/></svg>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useRoute } from 'vue-router';
import { useJaspelStore } from '~/stores/jaspelStore';

const route = useRoute();
const { pageMap, unitData, selectedPeriode, isSidebarCollapsed } = useJaspelStore();

const heading = computed(() => {
  const routeName = route.name?.toString() || '';
  if (routeName === 'index') return 'Dashboard';
  if (routeName.startsWith('unit-id')) {
    const id = route.params.id as string;
    return (unitData as any)[id]?.title || 'Unit Pelayanan';
  }
  return (pageMap as any)[routeName]?.heading || 'SIPJASPEL';
});

const sub = computed(() => {
  const routeName = route.name?.toString() || '';
  if (routeName === 'index') return 'Sistem Informasi Jaspel Puskesmas';
  if (routeName.startsWith('unit-id')) return 'Distribusi Jaspel Langsung — ' + selectedPeriode.value;
  return (pageMap as any)[routeName]?.sub || '';
});
</script>

<style scoped>
.topbar-left {
  display: flex;
  align-items: center;
  gap: 16px;
  flex: 1;
}

.sidebar-toggle {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 38px;
  height: 38px;
  background: #fff;
  border: 1.5px solid var(--border);
  border-radius: 10px;
  color: var(--text-secondary);
  cursor: pointer;
  transition: all 0.2s;
  flex-shrink: 0;
}

.sidebar-toggle:hover {
  background: #f8fafc;
  color: var(--accent-blue);
  border-color: var(--accent-blue);
  box-shadow: 0 4px 12px rgba(13, 127, 232, 0.1);
  transform: translateY(-1px);
}

.sidebar-toggle svg {
  width: 20px;
  height: 20px;
}

.period-picker-container {
  display: flex;
  align-items: center;
  gap: 8px;
  background: var(--bg-level2);
  padding: 4px 12px;
  border-radius: 8px;
  border: 1px solid var(--border);
}
.period-picker-container label {
  font-size: 11px;
  font-weight: 700;
  color: var(--text-muted);
  text-transform: uppercase;
  letter-spacing: 0.5px;
}
.period-input {
  background: transparent;
  border: none;
  font-family: inherit;
  font-size: 13px;
  font-weight: 700;
  color: var(--accent-blue);
  outline: none;
  cursor: pointer;
}
</style>
