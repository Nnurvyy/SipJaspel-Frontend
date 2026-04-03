<template>
  <div class="page">
    <div class="section-header">
      <h1>Laporan Bulanan</h1>
      <p>Realisasi Jaspel per bulan — Tahun 2026</p>
    </div>
    <div class="bulan-nav">
      <div v-for="b in bulanList" :key="b" 
           class="bulan-btn" 
           :class="{ active: currentBulan === b }"
           @click="currentBulan = b">
        {{ b }}
      </div>
    </div>
    <div class="card">
      <div class="card-header">
        <div>
          <div class="card-title">Laporan — {{ currentBulan }} 2026</div>
          <div class="card-subtitle">Klik bulan di atas untuk berpindah</div>
        </div>
        <div class="print-hint" style="margin:0">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 6 2 18 2 18 9"/><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/><rect x="6" y="14" width="12" height="8"/></svg>
          <p><strong>{{ currentBulan }} 2026</strong> — {{ isDataAvailable ? 'Data tersedia' : 'Belum ada data' }}</p>
        </div>
      </div>
      <div class="table-scroll" v-if="isDataAvailable">
        <table>
          <thead>
            <tr>
              <th>No</th>
              <th>Nama Petugas</th>
              <th class="right">Total Jaspel</th>
              <th class="right">PPh</th>
              <th class="right">Jumlah Bersih</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(item, idx) in laporanData" :key="idx">
              <td>{{ item.no }}</td>
              <td><strong>{{ item.nama }}</strong></td>
              <td class="right">{{ item.total.toLocaleString('id-ID') }}</td>
              <td class="right">{{ item.pph.toLocaleString('id-ID') }}</td>
              <td class="right" style="color:var(--accent-blue);font-weight:700">{{ item.bersih.toLocaleString('id-ID') }}</td>
              <td><span class="badge" :class="item.bersih > 0 ? 'green' : 'amber'">Sudah Cetak</span></td>
            </tr>
          </tbody>
        </table>
      </div>
      <div class="empty-state" v-else>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
        <p>Data Jasa Pelayanan untuk bulan <strong>{{ currentBulan }} 2026</strong> belum dimasukkan.</p>
      </div>
      <div class="pagination" v-if="isDataAvailable">
        <div class="pagination-info">Menampilkan 1–{{ laporanData.length }} dari 52 pegawai</div>
        <div class="pagination-btns">
          <div class="page-btn active">1</div>
          <div class="page-btn">2</div>
          <div class="page-btn">3</div>
          <div class="page-btn">›</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useJaspelStore } from '~/stores/jaspelStore'

definePageMeta({ layout: 'main' })

const store = useJaspelStore()
const bulanList = store.bulanList
const currentBulan = ref('Jan')

const laporanData = computed(() => store.laporanData)
const isDataAvailable = computed(() => currentBulan.value === 'Jan')
</script>
