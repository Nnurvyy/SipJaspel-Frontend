<template>
  <div class="page">
    <div class="section-header">
      <h1>Rekapitulasi Jaspel Keseluruhan</h1>
      <p>Distribusi Jasa Pelayanan seluruh pegawai — Januari 2026</p>
    </div>
    
    <div class="rekap-strip" v-if="!pending && !error">
      <div class="strip-item"><div class="strip-label">TL Non Kapitasi (60%)</div><div class="strip-value blue">Rp {{ totalStrips.tlNonKap.toLocaleString('id-ID') }}</div></div>
      <div class="strip-item"><div class="strip-label">TL PAD Murni (60%)</div><div class="strip-value teal">Rp {{ totalStrips.tlPad.toLocaleString('id-ID') }}</div></div>
      <div class="strip-item"><div class="strip-label">Lgsg Non Kap (40%)</div><div class="strip-value green">Rp {{ totalStrips.lgsgNonKap.toLocaleString('id-ID') }}</div></div>
      <div class="strip-item"><div class="strip-label">Lgsg PAD Murni (40%)</div><div class="strip-value amber">Rp {{ totalStrips.lgsgPad.toLocaleString('id-ID') }}</div></div>
    </div>
    
    <div class="card">
      <div class="table-toolbar">
        <div class="search-box">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
          <input type="text" v-model="searchQuery" placeholder="Cari nama petugas...">
        </div>
      </div>

       <!-- Status info -->
      <div v-if="error" class="alert error" style="margin: 20px;">
        Gagal mengambil data dari server.
      </div>
      <div v-if="pending" style="padding: 40px; text-align: center; color: var(--text-muted)">
        Memuat tabel rekapitulasi...
      </div>
      
      <div class="table-scroll" v-if="!pending && !error">
        <table id="tbl-rekap">
          <thead>
            <tr>
              <th>No</th>
              <th>Nama Petugas</th>
              <th class="right">Non Kapitasi</th>
              <th class="right">PAD Murni</th>
              <th class="right">Jaspel TL (60%)</th>
              <th class="right">Non Kap Lgsg</th>
              <th class="right">PAD Lgsg</th>
              <th class="right">Jaspel L (40%)</th>
              <th class="right">Total Jaspel</th>
              <th>PPh (%)</th>
              <th class="right">PPh (Rp)</th>
              <th class="right">Jumlah Bersih</th>
              <th>Aksi</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(item, idx) in filteredData" :key="item.pegawaiId">
              <td>{{ idx + 1 }}</td>
              <td><strong>{{ item.nama }}</strong></td>
              <td class="right">{{ Math.round(item.tlNonKap).toLocaleString('id-ID') }}</td>
              <td class="right">{{ Math.round(item.tlPad).toLocaleString('id-ID') }}</td>
              <td class="right" style="font-weight:600">{{ Math.round(item.jumlahTL).toLocaleString('id-ID') }}</td>
              
              <td class="right">{{ Math.round(item.lgsgNonKap).toLocaleString('id-ID') }}</td>
              <td class="right">{{ Math.round(item.lgsgPad).toLocaleString('id-ID') }}</td>
              <td class="right" style="font-weight:600">{{ Math.round(item.jumlahLangsung).toLocaleString('id-ID') }}</td>
              
              <td class="right">{{ Math.round(item.totalJaspel).toLocaleString('id-ID') }}</td>
              <td>
                <span class="badge" :class="item.pphPercent > 0.05 ? 'amber' : 'green'">{{ item.pphPercent * 100 }}%</span>
              </td>
              <td class="right">{{ Math.round(item.pph).toLocaleString('id-ID') }}</td>
              <td class="right" style="color:var(--accent-blue);font-weight:700">{{ Math.round(item.jumlahBersih).toLocaleString('id-ID') }}</td>
              <td>
                <button class="action-btn edit" title="Edit" @click="openEditRekap(item)">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/></svg>
                </button>
              </td>
            </tr>
            <tr v-if="filteredData.length === 0">
              <td colspan="12" style="text-align:center;padding:20px;color:var(--text-muted)">Tidak ada data ditemukan</td>
            </tr>
            <tr v-if="filteredData.length > 0" style="background:var(--bg-level2); font-weight:700;">
              <td colspan="2" style="text-align:right;">TOTAL KESELURUHAN</td>
              <td class="right">{{ totalStrips.tlNonKap.toLocaleString('id-ID') }}</td>
              <td class="right">{{ totalStrips.tlPad.toLocaleString('id-ID') }}</td>
              <td class="right">{{ totalStrips.tlTotal.toLocaleString('id-ID') }}</td>
              <td class="right">{{ totalStrips.lgsgNonKap.toLocaleString('id-ID') }}</td>
              <td class="right">{{ totalStrips.lgsgPad.toLocaleString('id-ID') }}</td>
              <td class="right">{{ totalStrips.lgsgTotal.toLocaleString('id-ID') }}</td>
              <td class="right">{{ totalStrips.jaspelTotal.toLocaleString('id-ID') }}</td>
              <td></td>
              <td class="right">{{ totalStrips.pphTotal.toLocaleString('id-ID') }}</td>
              <td class="right" style="color:var(--accent-blue)">{{ totalStrips.bersihTotal.toLocaleString('id-ID') }}</td>
              <td></td>
            </tr>
          </tbody>
        </table>
      </div>
      <div class="pagination" v-if="!pending && filteredData.length > 0">
        <div class="pagination-info">Menampilkan {{ filteredData.length }} pegawai</div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useApi } from '../composables/useApi';

definePageMeta({ layout: 'main' })

const searchQuery = ref('')

const { data: rekapData, pending, error } = await useApi<any[]>('/reports/rekap/2026-01')

const filteredData = computed(() => {
  const q = searchQuery.value.toLowerCase()
  if (!rekapData.value) return [];
  if (!q) return rekapData.value;
  
  return rekapData.value.filter((item: any) => 
    item.nama.toLowerCase().includes(q)
  )
})

const totalStrips = computed(() => {
  let tlNonKap = 0; let tlPad = 0; let tlTotal = 0; 
  let lgsgNonKap = 0; let lgsgPad = 0; let lgsgTotal = 0;
  let jaspelTotal = 0; let pphTotal = 0; let bersihTotal = 0;
  if(filteredData.value) {
    filteredData.value.forEach((r: any) => {
      tlNonKap += r.tlNonKap;
      tlPad += r.tlPad;
      tlTotal += r.jumlahTL;
      lgsgNonKap += r.lgsgNonKap;
      lgsgPad += r.lgsgPad;
      lgsgTotal += r.jumlahLangsung;
      jaspelTotal += r.totalJaspel;
      pphTotal += r.pph;
      bersihTotal += r.jumlahBersih;
    });
  }
  return { 
    tlNonKap: Math.round(tlNonKap), 
    tlPad: Math.round(tlPad), 
    tlTotal: Math.round(tlTotal),
    lgsgNonKap: Math.round(lgsgNonKap), 
    lgsgPad: Math.round(lgsgPad),
    lgsgTotal: Math.round(lgsgTotal),
    jaspelTotal: Math.round(jaspelTotal),
    pphTotal: Math.round(pphTotal),
    bersihTotal: Math.round(bersihTotal)
  };
})

// Edit handler — for now shows an alert (manual override could be stored in a local or backend override table)
const openEditRekap = (item: any) => {
  alert(`Edit manual untuk: ${item.nama}\n(Fitur override manual sedang dalam pengembangan. Data rekap dihitung otomatis dari bobot & kehadiran.)`);
}
</script>

<style scoped>
/* Strip Styles remain intact */
.rekap-strip { margin-bottom: 20px; }
.action-btn { width: 28px; height: 28px; border-radius: 6px; border: 1px solid var(--border); background: #fff; display: flex; align-items: center; justify-content: center; cursor: pointer; transition: all .2s; color: var(--text-muted); }
.action-btn:hover.edit { border-color: var(--accent-blue); color: var(--accent-blue); }
.action-btn:hover.delete { border-color: var(--accent-red); color: var(--accent-red); }
.action-btn svg { width: 14px; height: 14px; }
</style>
