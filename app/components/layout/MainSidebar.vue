<template>
  <nav id="sidebar" :class="{ collapsed: isSidebarCollapsed }">
    <div class="sidebar-logo">
      <div class="logo-icon">
        <svg viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M8 21h12a2 2 0 0 0 2-2v-2H10v2a2 2 0 1 1-4 0V5a2 2 0 1 0-4 0v3h4"/><path d="M19 3v4M17 5h4M14 5h-4M12 3v4"/></svg>
      </div>
      <div class="logo-text">
        <div class="name">SIPJASPEL</div>
        <div class="sub">Puskesmas Majalengka</div>
      </div>
    </div>

    <div class="sidebar-section">
      <div class="sidebar-section-label">Utama</div>
      <div class="nav-item">
        <NuxtLink to="/" class="nav-link" active-class="active">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>
          <span class="nav-text">Dashboard</span>
        </NuxtLink>
      </div>
    </div>

    <div class="sidebar-section">
      <div class="sidebar-section-label">Data Master</div>
      <div class="nav-item">
        <div class="nav-link" :class="{ open: menus.master }" @click="menus.master = !menus.master">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
          <span class="nav-text">Master & Struktur</span>
          <svg class="chevron" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"/></svg>
        </div>
        <div class="submenu" :class="{ open: menus.master }">
          <NuxtLink to="/data-dasar" class="submenu-link" active-class="active">Data Dasar</NuxtLink>
          <NuxtLink to="/bobot-staff" class="submenu-link" active-class="active">Bobot Staff</NuxtLink>
          <NuxtLink to="/struktur" class="submenu-link" active-class="active">Struktur</NuxtLink>
        </div>
      </div>
    </div>

    <div class="sidebar-section">
      <div class="sidebar-section-label">Pengelolaan</div>
      <div class="nav-item">
        <div class="nav-link" :class="{ open: menus.pengelolaan }" @click="menus.pengelolaan = !menus.pengelolaan">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="7" width="20" height="14" rx="2" ry="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg>
          <span class="nav-text">Keuangan</span>
          <svg class="chevron" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"/></svg>
        </div>
        <div class="submenu" :class="{ open: menus.pengelolaan }">
          <NuxtLink to="/keuangan" class="submenu-link" active-class="active">Keuangan</NuxtLink>
        </div>
      </div>
    </div>

    <div class="sidebar-section">
      <div class="sidebar-section-label">Rekapitulasi</div>
      <div class="nav-item">
        <div class="nav-link" :class="{ open: menus.rekap }" @click="menus.rekap = !menus.rekap">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>
          <span class="nav-text">Cetak Jaspel</span>
          <svg class="chevron" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"/></svg>
        </div>
        <div class="submenu" :class="{ open: menus.rekap }">
          <NuxtLink to="/bobot-kapitasi" class="submenu-link" active-class="active">Bobot Kapitasi &amp; 60%</NuxtLink>
          <NuxtLink to="/rekap-all" class="submenu-link" active-class="active">Rekap Keseluruhan</NuxtLink>
          <NuxtLink to="/print-jaspel" class="submenu-link" active-class="active">Cetak Lembar (Pilih)</NuxtLink>
          <div class="submenu-divider"></div>
          <NuxtLink to="/print/60-non-kapitasi" class="submenu-link small" active-class="active">60% Non Kapitasi</NuxtLink>
          <NuxtLink to="/print/60-pad-murni" class="submenu-link small" active-class="active">60% PAD Murni</NuxtLink>
          <NuxtLink to="/print/40-non-kapitasi" class="submenu-link small" active-class="active">40% Non Kapitasi</NuxtLink>
          <NuxtLink to="/print/40-pad-murni" class="submenu-link small" active-class="active">40% PAD Murni</NuxtLink>
        </div>
      </div>
    </div>

    <div class="sidebar-section">
      <div class="sidebar-section-label">Unit Pelayanan</div>
      <div class="nav-item">
        <div class="nav-link" :class="{ open: menus.unit }" @click="menus.unit = !menus.unit">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg>
          <span class="nav-text">Input Tindakan</span>
          <svg class="chevron" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"/></svg>
        </div>
          <div class="submenu" :class="{ open: menus.unit }">
          <NuxtLink to="/unit/ugd" class="submenu-link" active-class="active">UGD</NuxtLink>
          <NuxtLink to="/unit/one-day-care" class="submenu-link" active-class="active">One Day Care</NuxtLink>
          <NuxtLink to="/unit/poned" class="submenu-link" active-class="active">PONED</NuxtLink>
          <NuxtLink to="/unit/konseling" class="submenu-link" active-class="active">Konseling</NuxtLink>
          <NuxtLink to="/unit/haji" class="submenu-link" active-class="active">Haji</NuxtLink>
          <NuxtLink to="/unit/kia" class="submenu-link" active-class="active">KIA</NuxtLink>
          <NuxtLink to="/unit/usg" class="submenu-link" active-class="active">USG</NuxtLink>
          <NuxtLink to="/unit/kb" class="submenu-link" active-class="active">KB</NuxtLink>
          <NuxtLink to="/unit/lab" class="submenu-link" active-class="active">LAB</NuxtLink>
          <NuxtLink to="/unit/poli-umum" class="submenu-link" active-class="active">Poli Umum</NuxtLink>
          <NuxtLink to="/unit/gigi" class="submenu-link" active-class="active">Gigi</NuxtLink>
          <NuxtLink to="/unit/ambulans" class="submenu-link" active-class="active">Ambulans</NuxtLink>
        </div>
      </div>
    </div>

    <div class="sidebar-footer">
      <div class="user-info">
        <div class="user-avatar">EE</div>
        <div class="user-meta">
          <div class="user-name">Eva Evianti</div>
          <div class="user-role">Administrator</div>
        </div>
        <div class="logout-btn" @click="handleLogout" title="Logout">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
        </div>
      </div>
    </div>
  </nav>
</template>

<script setup lang="ts">
import { reactive, watchEffect } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useJaspelStore } from '~/stores/jaspelStore';

const route = useRoute();
const router = useRouter();
const store = useJaspelStore();
const { isSidebarCollapsed } = store;

const menus = reactive({
  master: false,
  pengelolaan: false,
  rekap: false,
  unit: false
});

watchEffect(() => {
  if (isSidebarCollapsed.value) return; 
  const path = route.path;
  if (path.includes('/data-dasar') || path.includes('/struktur')) {
    menus.master = true;
  }
  if (path.includes('/keuangan') || path.includes('/laporan')) {
    menus.pengelolaan = true;
  }
  if (path.includes('/rekap') || path.includes('/bobot') || path.includes('/print')) {
    menus.rekap = true;
  }
  if (path.includes('/unit')) {
    menus.unit = true;
  }
});

const handleLogout = () => {
  const token = useCookie('auth_token');
  token.value = null;
  store.isAuthenticated.value = false;
  router.push('/login');
};
</script>

<style scoped>
/* Additional specific CSS added for the logout btn */
.mt-1 { margin-top: 5px; }

.logout-btn {
  margin-left: auto;
  cursor: pointer;
  padding: 8px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #94a3b8;
  transition: all 0.2s;
}

.logout-btn:hover {
  background: rgba(239, 68, 68, 0.1);
  color: #ef4444;
}

.logout-btn svg {
  width: 18px;
  height: 18px;
}

.submenu-divider {
  height: 1px;
  background: rgba(255,255,255,0.05);
  margin: 8px 12px;
}

.submenu-link.small {
  font-size: 11.5px;
  padding-left: 36px;
  opacity: 0.8;
}
</style>
