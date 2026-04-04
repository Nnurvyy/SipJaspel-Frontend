<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import { useJaspelStore } from '~/stores/jaspelStore'

definePageMeta({ layout: 'main' })

const { selectedPeriode } = useJaspelStore()
const config = useRuntimeConfig()

interface DashboardStats {
  totalPegawai: number;
  totalJaspelPad: number;
  nonKapitasi: { total: number, tidakLangsung: number, langsung: number };
  padMurni: { total: number, tidakLangsung: number, langsung: number };
  topUnits: { name: string, value: number }[];
  topEarners: any[];
}

const { data: stats, pending: loading, error } = await useApi<DashboardStats>(() => `/jaspel-distribusi/dashboard-summary/${selectedPeriode.value}`);

let chartInstance: any = null

const updateChart = () => {
  if (typeof window === 'undefined' || !(window as any).Chart || !stats.value) return
  
  const ctx = document.getElementById('chartDistribusi') as HTMLCanvasElement
  if (!ctx) return

  if (chartInstance) chartInstance.destroy()

  chartInstance = new (window as any).Chart(ctx, {
    type: 'doughnut',
    data: {
      labels: ['Non Kapitasi', 'PAD Murni'],
      datasets: [{
        data: [stats.value.nonKapitasi.total, stats.value.padMurni.total],
        backgroundColor: ['#10b981', '#3b82f6'],
        borderWidth: 0,
        hoverOffset: 4
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      cutout: '75%',
      plugins: {
        legend: { position: 'bottom', labels: { usePointStyle: true, boxWidth: 8, font: { family: 'Poppins', size: 12 } } }
      }
    }
  })
}

const formatRp = (val: number) => {
  return new Intl.NumberFormat('id-ID').format(Math.floor(val))
}

const getProgWidth = (val: number) => {
  if (!stats.value?.topUnits.length) return '0%'
  const max = Math.max(...stats.value.topUnits.map(u => u.value))
  return `${(val / max) * 100}%`
}

onMounted(() => {
    if (stats.value) updateChart();
})

watch(stats, () => {
  updateChart()
})

const exportAllExcel = () => {
  window.open(`${config.public.apiBase}/export-rekap/${selectedPeriode.value}`, '_blank');
}
</script>

<template>
  <div class="page">
    <div class="section-header" style="display: flex; justify-content: space-between; align-items: flex-start; flex-wrap: wrap; gap: 16px;">
      <div>
        <h1>Dashboard Jaspel</h1>
        <p>Ringkasan kinerja dan realisasi Jasa Pelayanan — <strong>{{ selectedPeriode }}</strong></p>
      </div>
      <button class="export-btn" @click="exportAllExcel" style="padding: 10px 20px; font-size: 14px; border-radius: 12px; background: var(--sidebar-bg); color: #fff; display: flex; align-items: center; gap: 8px; border:none; cursor:pointer;">
        <svg style="width:18px; height:18px" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
        Revisi Export (Excel)
      </button>
    </div>

    <!-- LOADING STATE -->
    <div v-if="loading && !stats" style="padding: 100px; text-align: center; color: var(--text-muted);">
      Sedang memuat data...
    </div>

    <div v-else-if="error" style="padding: 100px; text-align: center; color: #ef4444;">
        Gagal memuat data dashboard ({{ error.message }}).
    </div>

    <template v-else-if="stats">
      <div class="metrics-grid">
        <div class="metric-card blue">
          <div class="metric-icon"></div>
          <div class="metric-icon-overlay"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg></div>
          <div class="metric-label">Total Pegawai</div>
          <div class="metric-value">{{ stats.totalPegawai }}</div>
          <div class="metric-sub">Puskesmas Majalengka</div>
        </div>
        <div class="metric-card teal">
          <div class="metric-icon"></div>
          <div class="metric-icon-overlay"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg></div>
          <div class="metric-label">Total Jaspel (60%)</div>
          <div class="metric-value small">Rp {{ formatRp(stats.nonKapitasi.total + stats.padMurni.total) }}</div>
          <div class="metric-sub">Netto (60% dari BLUD)</div>
        </div>
        <div class="metric-card green">
          <div class="metric-icon"></div>
          <div class="metric-icon-overlay"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg></div>
          <div class="metric-label">Non Kapitasi (60%)</div>
          <div class="metric-value small">Rp {{ formatRp(stats.nonKapitasi.total) }}</div>
          <div class="metric-sub">Lansgung: Rp {{ formatRp(stats.nonKapitasi.langsung) }}</div>
        </div>
        <div class="metric-card amber">
          <div class="metric-icon"></div>
          <div class="metric-icon-overlay"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg></div>
          <div class="metric-label">PAD Murni (60%)</div>
          <div class="metric-value small">Rp {{ formatRp(stats.padMurni.total) }}</div>
          <div class="metric-sub">Langsung: Rp {{ formatRp(stats.padMurni.langsung) }}</div>
        </div>
      </div>

      <div class="grid-3">
        <!-- Distribusi Pendapatan Chart -->
        <div class="card">
          <div class="card-header">
            <div>
              <div class="card-title">Proporsi Jaspel</div>
              <div class="card-subtitle">Non Kapitasi vs PAD Murni</div>
            </div>
          </div>
          <div class="card-body">
            <div class="chart-wrap">
              <canvas id="chartDistribusi"></canvas>
            </div>
          </div>
        </div>
        <!-- Top 5 Unit -->
        <div class="card">
          <div class="card-header">
            <div class="card-title">Kinerja Pendapatan Per Unit</div>
          </div>
          <div class="card-body" style="padding-top:12px">
            <div v-if="stats.topUnits.length > 0" style="display:flex;flex-direction:column;gap:12px">
              <div v-for="(u, i) in stats.topUnits" :key="i">
                <div style="display:flex;justify-content:space-between;font-size:12.5px;margin-bottom:4px">
                  <span style="font-weight:600">{{ u.name }}</span>
                  <span style="color:var(--accent-blue); font-weight:700">Rp {{ formatRp(u.value) }}</span>
                </div>
                <div class="prog-bar-wrap">
                  <div class="prog-bar" :style="{ width: getProgWidth(u.value), background: 'var(--accent-blue)', opacity: 1 - (i * 0.15) }"></div>
                </div>
              </div>
            </div>
            <div v-else style="padding: 20px; text-align: center; color: var(--text-muted);">
              Data unit belum tersedia untuk periode ini.
            </div>
          </div>
        </div>
      </div>

      <!-- Rekap strip -->
      <div class="rekap-strip">
        <div class="strip-item">
          <div class="strip-label">TL Non Kapitasi</div>
          <div class="strip-value blue">Rp {{ formatRp(stats.nonKapitasi.tidakLangsung) }}</div>
        </div>
        <div class="strip-item">
          <div class="strip-label">TL PAD Murni</div>
          <div class="strip-value teal">Rp {{ formatRp(stats.padMurni.tidakLangsung) }}</div>
        </div>
        <div class="strip-item">
          <div class="strip-label">Lgsg Non Kapitasi</div>
          <div class="strip-value green">Rp {{ formatRp(stats.nonKapitasi.langsung) }}</div>
        </div>
        <div class="strip-item">
          <div class="strip-label">Lgsg PAD Murni</div>
          <div class="strip-value amber">Rp {{ formatRp(stats.padMurni.langsung) }}</div>
        </div>
      </div>

      <!-- Top 5 Jaspel Pegawai -->
      <div class="card">
        <div class="card-header">
          <div>
            <div class="card-title">Penerima Jaspel Tertinggi</div>
            <div class="card-subtitle">Berdasarkan Total Bersih (Take Home Pay)</div>
          </div>
          <NuxtLink to="/rekap-all" class="card-action" style="text-decoration:none">
            Lihat Rekap Lengkap →
          </NuxtLink>
        </div>
        <div class="table-scroll">
          <table>
            <thead>
              <tr>
                <th>No</th>
                <th>Nama Petugas</th>
                <th class="right">Jaspel TL</th>
                <th class="right">Jaspel Lgsg</th>
                <th class="right">Total Kotor</th>
                <th class="right">PPh (%)</th>
                <th class="right">Bersih (Rp)</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(p, i) in stats.topEarners" :key="p.pegawaiId">
                <td>{{ i + 1 }}</td>
                <td><strong>{{ p.nama }}</strong></td>
                <td class="right">{{ formatRp(p.totalTL) }}</td>
                <td class="right">{{ formatRp(p.totalL) }}</td>
                <td class="right">{{ formatRp(p.totalJaspel) }}</td>
                <td class="right"><span class="badge" :class="p.pphPercent > 10 ? 'amber' : 'green'">{{ p.pphPercent }}%</span></td>
                <td class="right" style="color:var(--accent-blue); font-weight:700">Rp {{ formatRp(p.takeHomePay) }}</td>
              </tr>
              <tr v-if="stats.topEarners.length === 0">
                <td colspan="7" style="text-align: center; padding: 20px; color: var(--text-muted);">Belum ada data distribusi.</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </template>
  </div>
</template>
