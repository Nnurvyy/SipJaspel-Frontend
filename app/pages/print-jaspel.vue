<template>
  <div class="page">
    <div class="section-header" style="display:flex; justify-content:space-between; align-items:flex-end;">
      <div>
        <h1>Cetak & Export Jaspel</h1>
        <p>Cetak lembar Jasa Pelayanan per kategori & Unduh Excel — {{ selectedPeriode }}</p>
      </div>
      <div>
        <a :href="exportUrl" target="_blank" class="btn primary" style="display:inline-flex; align-items:center; gap:8px; text-decoration:none;">
          <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
          Export Rekapitulasi (Excel)
        </a>
      </div>
    </div>
    <div class="print-hint">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 6 2 18 2 18 9"/><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/><rect x="6" y="14" width="12" height="8"/></svg>
      <p><strong>Pilih kategori print</strong> di bawah. Fitur cetak PDF tersedia setelah memilih kategori atau langsung Export ke Excel.</p>
    </div>
    
    <div v-if="pending" style="padding: 40px; text-align: center; color: var(--text-muted)">
      Memuat summary data...
    </div>
    <div class="grid-2" v-else-if="!error">
      <NuxtLink to="/print/60-non-kapitasi" class="card-link">
        <div class="card clickable-card">
          <div class="card-body" style="display:flex;align-items:center;gap:18px">
            <div style="width:52px;height:52px;border-radius:12px;background:linear-gradient(135deg,#0d7fe8,#06b6d4);display:flex;align-items:center;justify-content:center;flex-shrink:0">
              <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 6 2 18 2 18 9"/><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/><rect x="6" y="14" width="12" height="8"/></svg>
            </div>
            <div>
              <div style="font-size:14px;font-weight:700;margin-bottom:4px">60% Non Kapitasi</div>
              <div style="font-size:12.5px;color:var(--text-muted)">Jaspel tidak langsung dari dana Non Kapitasi</div>
              <div style="margin-top:8px"><span class="badge blue">Rp {{ summary.tlNonKap.toLocaleString('id-ID') }}</span></div>
            </div>
          </div>
        </div>
      </NuxtLink>

      <NuxtLink to="/print/60-pad-murni" class="card-link">
        <div class="card clickable-card">
          <div class="card-body" style="display:flex;align-items:center;gap:18px">
            <div style="width:52px;height:52px;border-radius:12px;background:linear-gradient(135deg,#0d9488,#16a34a);display:flex;align-items:center;justify-content:center;flex-shrink:0">
              <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 6 2 18 2 18 9"/><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/><rect x="6" y="14" width="12" height="8"/></svg>
            </div>
            <div>
              <div style="font-size:14px;font-weight:700;margin-bottom:4px">60% PAD Murni</div>
              <div style="font-size:12.5px;color:var(--text-muted)">Jaspel tidak langsung dari dana PAD Murni</div>
              <div style="margin-top:8px"><span class="badge teal">Rp {{ summary.tlPad.toLocaleString('id-ID') }}</span></div>
            </div>
          </div>
        </div>
      </NuxtLink>

      <NuxtLink to="/print/40-non-kapitasi" class="card-link">
        <div class="card clickable-card">
          <div class="card-body" style="display:flex;align-items:center;gap:18px">
            <div style="width:52px;height:52px;border-radius:12px;background:linear-gradient(135deg,#d97706,#f59e0b);display:flex;align-items:center;justify-content:center;flex-shrink:0">
              <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 6 2 18 2 18 9"/><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/><rect x="6" y="14" width="12" height="8"/></svg>
            </div>
            <div>
              <div style="font-size:14px;font-weight:700;margin-bottom:4px">40% Non Kapitasi</div>
              <div style="font-size:12.5px;color:var(--text-muted)">Jaspel langsung dari dana Non Kapitasi</div>
              <div style="margin-top:8px"><span class="badge amber">Rp {{ summary.lgsgNonKap.toLocaleString('id-ID') }}</span></div>
            </div>
          </div>
        </div>
      </NuxtLink>

      <NuxtLink to="/print/40-pad-murni" class="card-link">
        <div class="card clickable-card">
          <div class="card-body" style="display:flex;align-items:center;gap:18px">
            <div style="width:52px;height:52px;border-radius:12px;background:linear-gradient(135deg,#7c3aed,#a855f7);display:flex;align-items:center;justify-content:center;flex-shrink:0">
              <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 6 2 18 2 18 9"/><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/><rect x="6" y="14" width="12" height="8"/></svg>
            </div>
            <div>
              <div style="font-size:14px;font-weight:700;margin-bottom:4px">40% PAD Murni</div>
              <div style="font-size:12.5px;color:var(--text-muted)">Jaspel langsung dari dana PAD Murni</div>
              <div style="margin-top:8px"><span class="badge purple">Rp {{ summary.lgsgPad.toLocaleString('id-ID') }}</span></div>
            </div>
          </div>
        </div>
      </NuxtLink>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useRuntimeConfig } from '#app';
import { useApi } from '../composables/useApi';
import { useJaspelStore } from '../stores/jaspelStore';

definePageMeta({ layout: 'main' });

const config = useRuntimeConfig();
const { selectedPeriode } = useJaspelStore();

const exportUrl = computed(() => `${config.public.apiBase}/export/rekap/${selectedPeriode.value}`);

const { data: rekapData, pending, error } = useApi<any[]>(() => `/reports/rekap/${selectedPeriode.value}`);

const summary = computed(() => {
  let tlNonKap = 0; let tlPad = 0; let lgsgNonKap = 0; let lgsgPad = 0;
  if(rekapData.value) {
    rekapData.value.forEach((r: any) => {
      tlNonKap += r.tlNonKap || 0;
      tlPad += r.tlPad || 0;
      lgsgNonKap += r.lgsgNonKap || 0;
      lgsgPad += r.lgsgPad || 0;
    });
  }
  return { 
    tlNonKap: Math.round(tlNonKap), 
    tlPad: Math.round(tlPad), 
    lgsgNonKap: Math.round(lgsgNonKap), 
    lgsgPad: Math.round(lgsgPad) 
  };
})
</script>

<style scoped>
.card-link { text-decoration: none; color: inherit; display: block; }
.clickable-card { cursor: pointer; transition: all 0.2s; }
.clickable-card:hover { transform: translateY(-4px); box-shadow: var(--shadow-lg); }
</style>
