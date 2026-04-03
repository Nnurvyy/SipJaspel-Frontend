<template>
  <div class="page">
    <div class="section-header">
      <h1>Laporan Bulan DES</h1>
      <p>Rekapitulasi Kehadiran & Kinerja — Bulan Januari 2026</p>
    </div>
    
    <div class="card">
      <div class="table-toolbar">
        <button class="export-btn" style="background:var(--accent-teal)">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg> Export Excel
        </button>
      </div>

      <div class="table-scroll">
        <table id="tbl-des" class="complex-header">
          <thead>
            <tr>
              <th rowspan="2">No</th>
              <th rowspan="2">Identitas Karyawan</th>
              <th rowspan="2">Gol</th>
              <th rowspan="2">Jenis Ketenagaan</th>
              <th colspan="5" style="text-align:center; background:#f8fafc">KEHADIRAN</th>
              <th colspan="8" style="text-align:center; background:#eff6ff">TANGGUNG JAWAB PROGRAM & KINERJA</th>
              <th rowspan="2" class="right">Jumlah Total Poin</th>
              <th rowspan="2" class="right">Jaspel Masing2 Pegawai</th>
              <th rowspan="2">PPh 21</th>
              <th rowspan="2" class="right">Jumlah Jaspel Diterima</th>
              <th rowspan="2">Tanda Tangan</th>
            </tr>
            <tr>
              <th class="sub-th" style="background:#f8fafc">Poin Jenis<br>Ketenagaan</th>
              <th class="sub-th" style="background:#f8fafc">Masa Kerja</th>
              <th class="sub-th" style="background:#f8fafc">Jml Hari<br>Masuk Kerja</th>
              <th class="sub-th" style="background:#f8fafc">Jml Hari<br>Kerja</th>
              <th class="sub-th" style="background:#f8fafc">Rangkap<br>Tugas ADM</th>
              
              <th class="sub-th" style="background:#eff6ff">Jenis SDM</th>
              <th class="sub-th" style="background:#eff6ff">Tanggung Jawab<br>Program</th>
              <th class="sub-th" style="background:#eff6ff">Bobot<br>SDM 1</th>
              <th class="sub-th" style="background:#eff6ff">Bobot<br>SDM 2</th>
              <th class="sub-th" style="background:#eff6ff">Bobot<br>SDM 3</th>
              <th class="sub-th" style="background:#eff6ff">Bobot<br>SDM 4</th>
              <th class="sub-th" style="background:#eff6ff">Jumlah<br>Poin</th>
              <th class="sub-th" style="background:#eff6ff">Prosentase<br>Kehadiran</th>
            </tr>
          </thead>
          <tbody>
            <tr v-if="pending">
              <td colspan="23" style="text-align:center;padding:20px;color:var(--text-muted)">Memuat data laporan...</td>
            </tr>
            <tr v-else-if="error">
              <td colspan="23" style="text-align:center;padding:20px;color:var(--accent-red)">Gagal mengambil data dari server. Pastikan backend bejalan.</td>
            </tr>
            <tr v-else v-for="(item, idx) in desData" :key="item.pegawaiId">
              <td>{{ idx + 1 }}</td>
              <td style="white-space:nowrap"><strong>{{ item.nama }}</strong></td>
              <td><span class="badge blue">{{ item.golongan }}</span></td>
              <td>{{ item.jenisKetenagaan }}</td>
              
              <td class="right">{{ item.poinJenisKetenagaan }}</td>
              <td class="right">{{ item.poinMasaKerja }}</td>
              <td class="right">{{ item.jumlahHariMasuk }}</td>
              <td class="right">{{ item.jumlahHariKerja }}</td>
              <td class="right">{{ item.rangkapTugasAdm }}</td>
              
              <td>{{ item.jenisSdm || '-' }}</td>
              <td>{{ item.tanggungJawabProgram || '-' }}</td>
              <td class="right">{{ item.bobotSdm1 || 0 }}</td>
              <td class="right">{{ item.bobotSdm2 || 0 }}</td>
              <td class="right">{{ item.bobotSdm3 || 0 }}</td>
              <td class="right">{{ item.bobotSdm4 || 0 }}</td>
              <td class="right" style="font-weight:600">{{ item.jumlahPoinProgram || 0 }}</td>
              <td class="right">{{ ((item.prosentaseKehadiran || 0) * 100).toFixed(0) }}%</td>
              
              <td class="right" style="font-weight:700; color:var(--text-secondary)">{{ item.jumlahTotalPoin }}</td>
              <td class="right" style="font-weight:600">{{ formatRp(item.jaspelPegawai) }}</td>
              <td><span class="badge" :class="item.pphPercent > 0.05 ? 'amber' : 'green'">{{ (item.pphPercent * 100) }}%</span></td>
              <td class="right" style="color:var(--accent-blue);font-weight:700">{{ formatRp(item.jumlahBersih) }}</td>
              <td></td>
            </tr>
            
            <tr v-if="desData && desData.length > 0" style="background:var(--bg-level2); font-weight:700;">
              <td colspan="17" style="text-align:right;">SUBTOTAL PUSKESMAS</td>
              <td class="right" style="color:var(--text-secondary)">{{ totals.poin }}</td>
              <td class="right">{{ formatRp(totals.jaspelMasing2) }}</td>
              <td class="right">-</td>
              <td class="right" style="color:var(--accent-blue)">{{ formatRp(totals.bersihMasing2) }}</td>
              <td></td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
    
    <div class="metrics-grid" style="margin-top:20px" v-if="desData && desData.length > 0">
      <div class="metric-card blue">
        <div class="metric-label">Total Poin Seluruh Pegawai</div>
        <div class="metric-value">{{ totals.poin }}</div>
      </div>
      <div class="metric-card teal">
        <div class="metric-label">Jaspel Total Puskesmas</div>
        <div class="metric-value">Rp {{ formatRp(totals.jaspelPuskesmas) }}</div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useApi } from '../../composables/useApi';

definePageMeta({ layout: 'main' });

const { data: desData, pending, error } = await useApi<any[]>('/reports/des/2026-01');

// Note: If /reports/des/2026-01 logic doesn't exist yet, this will fail or return empty on the live app
// we'll need to make sure the backend endpoint is created.

const formatRp = (num: number | undefined) => {
  if (num === undefined || num === null || isNaN(num)) return '0';
  return Math.round(num).toLocaleString('id-ID');
}

const totals = computed(() => {
  let poin = 0; let jaspelMasing2 = 0; let bersihMasing2 = 0;
  if(desData.value) {
    desData.value.forEach(r => {
      poin += r.jumlahTotalPoin || 0;
      jaspelMasing2 += r.jaspelPegawai || 0;
      bersihMasing2 += r.jumlahBersih || 0;
    });
  }
  // Jaspel total puskesmas should come from a global config or the sum 
  return { 
    poin: Math.round(poin), 
    jaspelMasing2: Math.round(jaspelMasing2), 
    bersihMasing2: Math.round(bersihMasing2),
    jaspelPuskesmas: Math.round(jaspelMasing2) // simplified
  };
})
</script>

<style scoped>
.complex-header th {
  border: 1px solid var(--border);
  vertical-align: middle;
}
.sub-th {
  font-size: 11px;
  font-weight: 600;
  color: var(--text-muted);
}
#tbl-des td {
  border: 1px solid var(--border);
}
</style>
