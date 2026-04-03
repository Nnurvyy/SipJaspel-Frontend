<template>
  <div class="page">
    <div class="section-header" style="display: flex; justify-content: space-between; align-items: flex-start; flex-wrap: wrap; gap: 16px;">
      <div>
        <h1>Dashboard Jaspel</h1>
        <p>Ringkasan kinerja dan realisasi Jasa Pelayanan — Januari 2026</p>
      </div>
      <button class="export-btn" @click="exportAllExcel" style="padding: 10px 20px; font-size: 14px; border-radius: 10px;">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
        Export Semua (Excel)
      </button>
    </div>

    <div class="metrics-grid">
      <div class="metric-card blue">
        <div class="metric-icon"></div>
        <div class="metric-icon-overlay"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg></div>
        <div class="metric-label">Total Pegawai</div>
        <div class="metric-value">52</div>
        <div class="metric-sub"><span class="trend up">↑ 2</span> pegawai baru bulan ini</div>
      </div>
      <div class="metric-card teal">
        <div class="metric-icon"></div>
        <div class="metric-icon-overlay"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg></div>
        <div class="metric-label">Total Jaspel PAD</div>
        <div class="metric-value small">Rp 8.321.400</div>
        <div class="metric-sub">Realisasi Non-Kapitasi + PAD Murni</div>
      </div>
      <div class="metric-card green">
        <div class="metric-icon"></div>
        <div class="metric-icon-overlay"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg></div>
        <div class="metric-label">Non Kapitasi (60%)</div>
        <div class="metric-value small">Rp 4.368.000</div>
        <div class="metric-sub">Tidak Langsung: Rp 2.620.800</div>
      </div>
      <div class="metric-card amber">
        <div class="metric-icon"></div>
        <div class="metric-icon-overlay"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg></div>
        <div class="metric-label">Total PAD Murni</div>
        <div class="metric-value small">Rp 13.869.000</div>
        <div class="metric-sub">7 sumber pendapatan aktif</div>
      </div>
      <div class="metric-card purple">
        <div class="metric-icon"></div>
        <div class="metric-icon-overlay"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg></div>
        <div class="metric-label">Total PAD (Gross)</div>
        <div class="metric-value small">Rp 21.149.000</div>
        <div class="metric-sub">Jaspel: Rp 12.689.400</div>
      </div>
    </div>

    <div class="grid-3">
      <!-- Distribusi Pendapatan Chart -->
      <div class="card">
        <div class="card-header">
          <div>
            <div class="card-title">Distribusi Pendapatan Jaspel</div>
            <div class="card-subtitle">Non Kapitasi vs PAD Murni — Jan 2026</div>
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
          <div class="card-title">Top Unit Pendapatan</div>
        </div>
        <div class="card-body" style="padding-top:12px">
          <div style="display:flex;flex-direction:column;gap:12px">
            <div>
              <div style="display:flex;justify-content:space-between;font-size:12.5px;margin-bottom:4px"><span style="font-weight:600">LAB</span><span style="color:var(--accent-blue);font-family:'DM Mono',monospace">Rp 3.453.000</span></div>
              <div class="prog-bar-wrap"><div class="prog-bar" style="width:100%;background:var(--accent-blue)"></div></div>
            </div>
            <div>
              <div style="display:flex;justify-content:space-between;font-size:12.5px;margin-bottom:4px"><span style="font-weight:600">ANC (Non Kap)</span><span style="color:var(--accent-teal);font-family:'DM Mono',monospace">Rp 1.320.000</span></div>
              <div class="prog-bar-wrap"><div class="prog-bar" style="width:38%;background:var(--accent-teal)"></div></div>
            </div>
            <div>
              <div style="display:flex;justify-content:space-between;font-size:12.5px;margin-bottom:4px"><span style="font-weight:600">Rawat Jalan</span><span style="color:var(--accent-green);font-family:'DM Mono',monospace">Rp 1.791.000</span></div>
              <div class="prog-bar-wrap"><div class="prog-bar" style="width:52%;background:var(--accent-green)"></div></div>
            </div>
            <div>
              <div style="display:flex;justify-content:space-between;font-size:12.5px;margin-bottom:4px"><span style="font-weight:600">Gigi & Mulut</span><span style="color:var(--accent-amber);font-family:'DM Mono',monospace">Rp 999.000</span></div>
              <div class="prog-bar-wrap"><div class="prog-bar" style="width:29%;background:var(--accent-amber)"></div></div>
            </div>
            <div>
              <div style="display:flex;justify-content:space-between;font-size:12.5px;margin-bottom:4px"><span style="font-weight:600">USG</span><span style="color:var(--accent-purple);font-family:'DM Mono',monospace">Rp 2.268.000</span></div>
              <div class="prog-bar-wrap"><div class="prog-bar" style="width:66%;background:var(--accent-purple)"></div></div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Rekap strip -->
    <div class="rekap-strip">
      <div class="strip-item">
        <div class="strip-label">TL Non Kapitasi (60%)</div>
        <div class="strip-value blue">Rp 2.620.800</div>
      </div>
      <div class="strip-item">
        <div class="strip-label">TL PAD Murni (60%)</div>
        <div class="strip-value teal">Rp 4.992.840</div>
      </div>
      <div class="strip-item">
        <div class="strip-label">Lgsg Non Kapitasi (40%)</div>
        <div class="strip-value green">Rp 1.747.200</div>
      </div>
      <div class="strip-item">
        <div class="strip-label">Lgsg PAD Murni (40%)</div>
        <div class="strip-value amber">Rp 3.328.560</div>
      </div>
    </div>

    <!-- Top 5 Jaspel Pegawai -->
    <div class="card">
      <div class="card-header">
        <div>
          <div class="card-title">Top 5 Penerima Jaspel Tertinggi</div>
          <div class="card-subtitle">Berdasarkan total bersih (setelah PPh) — Januari 2026</div>
        </div>
        <NuxtLink to="/rekap-all" class="card-action" style="text-decoration:none">
          Lihat Semua →
        </NuxtLink>
      </div>
      <div class="table-scroll">
        <table>
          <thead>
            <tr>
              <th>No</th>
              <th>Nama Petugas</th>
              <th>Tidak Langsung (60%)</th>
              <th>Langsung (40%)</th>
              <th>Total Jaspel</th>
              <th>PPh (%)</th>
              <th>Jumlah Bersih</th>
            </tr>
          </thead>
          <tbody>
            <tr><td>1</td><td><strong>dr. Rafi Rizki</strong></td><td class="right">312.041</td><td class="right">1.279.032</td><td class="right">1.591.073</td><td class="right"><span class="badge green">5%</span></td><td class="right" style="color:var(--accent-blue);font-weight:700">1.511.519</td></tr>
            <tr><td>2</td><td><strong>Eva Evianti, AMAK, S.K.M.</strong></td><td class="right">236.084</td><td class="right">1.017.598</td><td class="right">1.253.681</td><td class="right"><span class="badge green">5%</span></td><td class="right" style="color:var(--accent-blue);font-weight:700">1.190.997</td></tr>
            <tr><td>3</td><td><strong>H. Otong Memet, S.Kkep., Ners., MM</strong></td><td class="right">461.903</td><td class="right">253.788</td><td class="right">715.691</td><td class="right"><span class="badge amber">15%</span></td><td class="right" style="color:var(--accent-blue);font-weight:700">608.337</td></tr>
            <tr><td>4</td><td><strong>drg. Bertha Ayu SKS.</strong></td><td class="right">369.522</td><td class="right">225.179</td><td class="right">594.701</td><td class="right"><span class="badge amber">15%</span></td><td class="right" style="color:var(--accent-blue);font-weight:700">505.496</td></tr>
            <tr><td>5</td><td><strong>Nenden Dewi Irmayanti, S.IP., M.Si.</strong></td><td class="right">266.056</td><td class="right">101.515</td><td class="right">367.571</td><td class="right"><span class="badge green">5%</span></td><td class="right" style="color:var(--accent-blue);font-weight:700">349.193</td></tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'

definePageMeta({
  layout: 'main'
})

const exportAllExcel = () => {
  alert('Menyiapkan file .xlsx dengan multy-sheet... (Dummy Frontend)');
}

onMounted(() => {
  // Hanya dirender di client
  if (typeof window !== 'undefined' && (window as any).Chart) {
    const ctx = document.getElementById('chartDistribusi') as HTMLCanvasElement;
    if(ctx) {
      new (window as any).Chart(ctx, {
        type: 'doughnut',
        data: {
          labels: ['Non Kapitasi', 'PAD Murni'],
          datasets: [{
            data: [4368000, 8321400],
            backgroundColor: ['#0d9488', '#0d7fe8'],
            borderWidth: 0,
            hoverOffset: 4
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          cutout: '75%',
          plugins: {
            legend: { position: 'right', labels: { usePointStyle: true, boxWidth: 8, font: { family: 'Plus Jakarta Sans', size: 11.5 } } }
          }
        }
      });
    }
  }
})
</script>
