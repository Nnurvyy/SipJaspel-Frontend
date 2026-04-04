<template>
  <div id="topbar">
    <div class="topbar-title">
      <h2>{{ heading }}</h2>
      <p>{{ sub }}</p>
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
const { pageMap, unitData, selectedPeriode } = useJaspelStore();

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
  if (routeName === 'index') return 'Selamat datang di Sistem Informasi Jaspel Puskesmas';
  if (routeName.startsWith('unit-id')) return 'Distribusi Jaspel unit pelayanan — ' + selectedPeriode.value;
  return (pageMap as any)[routeName]?.sub || '';
});
</script>

<style scoped>
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
