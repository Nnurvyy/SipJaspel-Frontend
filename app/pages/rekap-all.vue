<template>
  <div class="page">
    <div class="section-header">
      <h1>Rekapitulasi Jaspel Keseluruhan</h1>
      <p>Distribusi Jasa Pelayanan seluruh pegawai — {{ selectedPeriode }}</p>
    </div>
    
    <div class="metrics-grid" style="margin-bottom:20px" v-if="!pending && !error">
      <div class="metric-card blue">
        <div class="metric-label">TL Non Kapitasi (60%)</div>
        <div class="metric-value small">Rp {{ formatRp(totalStrips.tlNonKap) }}</div>
      </div>
      <div class="metric-card teal">
        <div class="metric-label">TL PAD Murni (60%)</div>
        <div class="metric-value small">Rp {{ formatRp(totalStrips.tlPad) }}</div>
      </div>
      <div class="metric-card green">
        <div class="metric-label">Lgsg Non Kap (40%)</div>
        <div class="metric-value small">Rp {{ formatRp(totalStrips.lgsgNonKap) }}</div>
      </div>
      <div class="metric-card amber">
        <div class="metric-label">Lgsg PAD Murni (40%)</div>
        <div class="metric-value small">Rp {{ formatRp(totalStrips.lgsgPad) }}</div>
      </div>
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
              <th class="right">TL (60%)</th>
              <th class="right">Non Kap Lgsg</th>
              <th class="right">PAD Lgsg</th>
              <th class="right">L (40%)</th>
              <th class="right highlight">Total Jaspel</th>
              <th>PPh (%)</th>
              <th class="right">PPh (Rp)</th>
              <th class="right highlight blue">Take Home Pay</th>
              <th>Aksi</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(item, idx) in filteredData" :key="item.pegawaiId">
              <td>{{ idx + 1 }}</td>
              <td><strong>{{ item.nama }}</strong></td>
              <td class="right">{{ formatRp(item.tlNonKap) }}</td>
              <td class="right">{{ formatRp(item.tlPad) }}</td>
              <td class="right" style="font-weight:600">{{ formatRp(item.totalTL) }}</td>
              
              <td class="right">{{ formatRp(item.lgsgNonKap) }}</td>
              <td class="right">{{ formatRp(item.lgsgPad) }}</td>
              <td class="right" style="font-weight:600">{{ formatRp(item.totalL) }}</td>
              
              <td class="right highlight" :class="{ 'overridden': item.isOverride }">Rp {{ formatRp(item.totalJaspel) }}</td>
              <td>{{ item.pphPercent }}%</td>
              <td class="right">Rp {{ formatRp(item.pphNominal) }}</td>
              <td class="right highlight blue">Rp {{ formatRp(item.takeHomePay) }}</td>
              <td>
                <button class="action-btn edit" title="Edit / Override" @click="openEditRekap(item)">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/></svg>
                </button>
              </td>
            </tr>
            <tr v-if="filteredData.length === 0">
              <td colspan="13" style="text-align:center;padding:20px;color:var(--text-muted)">Tidak ada data ditemukan</td>
            </tr>
          </tbody>
          <tfoot v-if="filteredData.length > 0">
            <tr class="total-row">
              <td colspan="2">TOTAL</td>
              <td class="right">{{ formatRp(totalStrips.tlNonKap) }}</td>
              <td class="right">{{ formatRp(totalStrips.tlPad) }}</td>
              <td class="right">{{ formatRp(totalStrips.tlTotal) }}</td>
              <td class="right">{{ formatRp(totalStrips.lgsgNonKap) }}</td>
              <td class="right">{{ formatRp(totalStrips.lgsgPad) }}</td>
              <td class="right">{{ formatRp(totalStrips.lgsgTotal) }}</td>
              <td class="right">Rp {{ formatRp(totalStrips.jaspelTotal) }}</td>
              <td></td>
              <td class="right">Rp {{ formatRp(totalStrips.pphTotal) }}</td>
              <td class="right">Rp {{ formatRp(totalStrips.bersihTotal) }}</td>
              <td></td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>

    <!-- Edit Modal -->
    <div v-if="isEditOpen" class="modal-overlay" @click.self="closeEdit">
      <div class="modal-card">
        <div class="modal-header">
          <h3>Override Rekap Jaspel — {{ editForm.nama }}</h3>
          <button class="modal-close" @click="closeEdit">×</button>
        </div>
        <div class="modal-body">
          <div class="form-group">
            <label>Total Jaspel (TL + L)</label>
            <input v-model.number="editForm.totalJaspel" type="number" class="form-input" @input="recalc" />
          </div>
          <div class="form-row">
            <div class="form-group">
              <label>PPH (%)</label>
              <input v-model.number="editForm.pphPercent" type="number" class="form-input" @input="recalc" />
            </div>
            <div class="form-group">
              <label>PPH Nominal (Rp)</label>
              <input v-model.number="editForm.pphNominal" type="number" class="form-input" />
            </div>
          </div>
          <div class="form-group">
            <label>Take Home Pay (Bersih)</label>
            <input v-model.number="editForm.takeHomePay" type="number" class="form-input" />
          </div>

          <div class="modal-actions-inline">
             <button @click="resetToAuto" class="btn-text">Reset ke Otomatis</button>
          </div>
        </div>
        <div class="modal-footer">
          <button class="btn secondary" @click="closeEdit">Batal</button>
          <button class="btn primary" @click="saveEdit" :disabled="saving">Simpan</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { useApi } from '../composables/useApi';
import { useJaspelStore } from '../stores/jaspelStore';

definePageMeta({ layout: 'main' })

const { selectedPeriode } = useJaspelStore();
const config = useRuntimeConfig();

const searchQuery = ref('')
const isEditOpen = ref(false);
const saving = ref(false);
const editForm = ref<any>({});

const { data: rekapData, pending, error, execute: refresh } = await useApi<any[]>(() => `/jaspel-distribusi/rekap/${selectedPeriode.value}`)

const periodeLabel = computed(() => {
  const p = selectedPeriode.value || '2026-01';
  const [y, m] = p.split('-');
  return `${m}-${y}`;
})

const filteredData = computed(() => {
  const q = searchQuery.value.toLowerCase()
  if (!rekapData.value) return [];
  if (!q) return rekapData.value;
  return rekapData.value.filter((item: any) => item.nama.toLowerCase().includes(q))
})

const totalStrips = computed(() => {
  let tlNK = 0; let tlPad = 0; let tlT = 0; 
  let lNK = 0; let lPad = 0; let lT = 0;
  let jT = 0; let pT = 0; let bT = 0;
  
  filteredData.value.forEach((r: any) => {
      tlNK += r.tlNonKap; tlPad += r.tlPad; tlT += r.totalTL;
      lNK += r.lgsgNonKap; lPad += r.lgsgPad; lT += r.totalL;
      jT += r.totalJaspel; pT += r.pphNominal; bT += r.takeHomePay;
  });
  
  return { 
    tlNonKap: tlNK, tlPad, tlTotal: tlT,
    lgsgNonKap: lNK, lgsgPad: lPad, lgsgTotal: lT,
    jaspelTotal: jT, pphTotal: pT, bersihTotal: bT
  };
})

const formatRp = (v: number) => new Intl.NumberFormat('id-ID').format(Math.round(v || 0));

const openEditRekap = (item: any) => {
    editForm.value = { ...item };
    isEditOpen.value = true;
}
const closeEdit = () => { isEditOpen.value = false; }

const recalc = () => {
    const f = editForm.value;
    f.pphNominal = Math.round(f.totalJaspel * (f.pphPercent / 100));
    f.takeHomePay = f.totalJaspel - f.pphNominal;
}

const resetToAuto = async () => {
    if(!confirm('Reset override untuk pegawai ini?')) return;
    try {
        await $fetch(`${config.public.apiBase}/jaspel-distribusi/${selectedPeriode.value}`, {
            method: 'PUT',
            body: { 
                pegawaiId: editForm.value.pegawaiId,
                rekapTotalJaspel: null,
                rekapPphPersen: null,
                rekapPphNominal: null,
                rekapTakeHomePay: null
            }
        });
        await refresh();
        closeEdit();
    } catch (e) {
        alert('Gagal reset data');
    }
}

const saveEdit = async () => {
    saving.value = true;
    try {
        await $fetch(`${config.public.apiBase}/jaspel-distribusi/${selectedPeriode.value}`, {
            method: 'PUT',
            body: { 
                pegawaiId: editForm.value.pegawaiId,
                rekapTotalJaspel: editForm.value.totalJaspel,
                rekapPphPersen: editForm.value.pphPercent,
                rekapPphNominal: editForm.value.pphNominal,
                rekapTakeHomePay: editForm.value.takeHomePay
            }
        });
        await refresh();
        closeEdit();
    } catch (e) {
        alert('Gagal menyimpan data');
    } finally {
        saving.value = false;
    }
}

watch(selectedPeriode, () => refresh());
</script>

<style scoped>
#tbl-rekap { width: 100%; border-collapse: collapse; }
#tbl-rekap th, #tbl-rekap td { border: 1px solid var(--border); padding: 10px 12px; font-size: 11px; }
#tbl-rekap th { background: var(--bg-level2); font-weight: 700; text-transform: uppercase; }

.highlight { font-weight: 700; color: #1e293b; }
.highlight.blue { color: var(--accent-blue); }
.overridden { color: #f59e0b; }

.total-row { background: var(--bg-level2); font-weight: 800; font-size: 11px; }

/* Modal Styles Handled by global main.css */
</style>
