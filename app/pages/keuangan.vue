<template>
  <div class="page">
    <div class="section-header">
      <h1>Data Keuangan &amp; Parameter</h1>
      <p>Realisasi pendapatan BLUD dan parameter perhitungan Jaspel — {{ selectedPeriode }}</p>
      <div class="header-actions">
        <button @click="openCreate" class="btn primary">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" class="icon-sm"><path d="M12 5v14M5 12h14"/></svg>
          Tambah Baris Baru
        </button>
      </div>
    </div>

    <!-- LOADING STATE -->
    <div v-if="loading && !items" style="padding:40px;text-align:center;color:var(--text-muted)">Memuat data keuangan...</div>

    <div v-else-if="error" style="padding:40px;text-align:center;color:#ef4444">
        Gagal memuat data keuangan ({{ error.message }}).
    </div>

    <template v-else-if="items">
      <!-- Summary Cards -->
      <div class="metrics-grid" style="margin-bottom:20px">
        <div class="metric-card blue">
          <div class="metric-label">Total Pendapatan BLUD</div>
          <div class="metric-value small">Rp {{ formatRp(totals.blud) }}</div>
          <div class="metric-sub">Non Kap + PAD Murni</div>
        </div>
        <div class="metric-card teal">
          <div class="metric-label">Total Jaspel (60%)</div>
          <div class="metric-value small">Rp {{ formatRp(totals.jaspel) }}</div>
        </div>
        <div class="metric-card green">
          <div class="metric-label">Tidak Langsung (60%)</div>
          <div class="metric-value small">Rp {{ formatRp(totals.tidakLangsung) }}</div>
        </div>
        <div class="metric-card amber">
          <div class="metric-label">Langsung (40%)</div>
          <div class="metric-value small">Rp {{ formatRp(totals.langsung) }}</div>
        </div>
      </div>

      <div class="card">
        <div class="card-header">
          <div class="card-title">Rincian Pendapatan per Jenis Layanan — {{ selectedPeriode }}</div>
          <div class="card-subtitle">Parameter: Jaspel=60%, Operasional=40%, TL=60% dari Jaspel, L=40% dari Jaspel</div>
        </div>
        <div class="card-body" style="padding:0">
          <div style="overflow-x:auto">
            <table id="tbl-keuangan">
              <thead>
                <tr>
                  <th>Jenis Pendapatan</th>
                  <th>Pendapatan</th>
                  <th class="right">Jumlah Pendapatan BLUD</th>
                  <th class="right">Jaspel (60%)</th>
                  <th class="right">Operasional (40%)</th>
                  <th class="right">Tidak Langsung (60%)</th>
                  <th class="right">Langsung (40%)</th>
                  <th class="center">Aksi</th>
                </tr>
              </thead>
              <tbody>
                <!-- NON KAPITASI SECTION -->
                <tr class="group-header">
                  <td colspan="8" class="group-label non-kap">NON KAPITASI</td>
                </tr>
                <tr v-for="row in nonKapItems" :key="row.id">
                  <td class="muted">Non Kapitasi</td>
                  <td>{{ row.namaLayanan }}</td>
                  <td class="right mono">Rp {{ formatRp(row.jumlahBlud) }}</td>
                  <td class="right">Rp {{ formatRp(row.jaspel60) }}</td>
                  <td class="right">Rp {{ formatRp(row.operasional40) }}</td>
                  <td class="right">Rp {{ formatRp(row.tidakLangsung) }}</td>
                  <td class="right">Rp {{ formatRp(row.langsung) }}</td>
                  <td class="center">
                    <div class="action-group">
                      <button @click="openEdit(row)" class="action-btn edit" title="Edit Baris">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                      </button>
                      <button @click="deleteItem(row.id)" class="action-btn delete" title="Hapus Baris">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
                      </button>
                    </div>
                  </td>
                </tr>
                <tr class="subtotal-row non-kap-total">
                  <td colspan="2"><strong>Total N. Kapitasi</strong></td>
                  <td class="right mono"><strong>Rp {{ formatRp(subtotals.nonKap.blud) }}</strong></td>
                  <td class="right"><strong>Rp {{ formatRp(subtotals.nonKap.jaspel) }}</strong></td>
                  <td class="right"><strong>Rp {{ formatRp(subtotals.nonKap.operasional) }}</strong></td>
                  <td class="right"><strong>Rp {{ formatRp(subtotals.nonKap.tl) }}</strong></td>
                  <td class="right"><strong>Rp {{ formatRp(subtotals.nonKap.l) }}</strong></td>
                  <td></td>
                </tr>

                <!-- PAD MURNI SECTION -->
                <tr class="group-header">
                  <td colspan="8" class="group-label pad-murni">PAD MURNI</td>
                </tr>
                <tr v-for="row in padMurniItems" :key="row.id">
                  <td class="muted">PAD Murni</td>
                  <td>{{ row.namaLayanan }}</td>
                  <td class="right mono">Rp {{ formatRp(row.jumlahBlud) }}</td>
                  <td class="right">Rp {{ formatRp(row.jaspel60) }}</td>
                  <td class="right">Rp {{ formatRp(row.operasional40) }}</td>
                  <td class="right">Rp {{ formatRp(row.tidakLangsung) }}</td>
                  <td class="right">Rp {{ formatRp(row.langsung) }}</td>
                  <td class="center">
                    <div class="action-group">
                      <button @click="openEdit(row)" class="action-btn edit">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                      </button>
                      <button @click="deleteItem(row.id)" class="action-btn delete">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
                      </button>
                    </div>
                  </td>
                </tr>
                <tr class="subtotal-row pad-total">
                  <td colspan="2"><strong>Total PAD Murni</strong></td>
                  <td class="right mono"><strong>Rp {{ formatRp(subtotals.pad.blud) }}</strong></td>
                  <td class="right"><strong>Rp {{ formatRp(subtotals.pad.jaspel) }}</strong></td>
                  <td class="right"><strong>Rp {{ formatRp(subtotals.pad.operasional) }}</strong></td>
                  <td class="right"><strong>Rp {{ formatRp(subtotals.pad.tl) }}</strong></td>
                  <td class="right"><strong>Rp {{ formatRp(subtotals.pad.l) }}</strong></td>
                  <td></td>
                </tr>

                <!-- Grand Total -->
                <tr class="grand-total-row">
                  <td colspan="2">TOTAL PAD</td>
                  <td class="right mono">Rp {{ formatRp(totals.blud) }}</td>
                  <td class="right">Rp {{ formatRp(totals.jaspel) }}</td>
                  <td class="right">Rp {{ formatRp(totals.operasional) }}</td>
                  <td class="right">Rp {{ formatRp(totals.tidakLangsung) }}</td>
                  <td class="right">Rp {{ formatRp(totals.langsung) }}</td>
                  <td></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </template>

    <!-- Create/Edit Modal -->
    <div v-if="isModalOpen" class="modal-overlay" @click.self="closeModal">
      <div class="modal-card">
        <div class="modal-header">
          <h3>{{ isEdit ? 'Edit Data Keuangan' : 'Tambah Baris Keuangan' }}</h3>
          <button class="modal-close" @click="closeModal">×</button>
        </div>
        <div class="modal-body">
          <div class="form-row">
            <div class="form-group">
              <label>Jenis Pendapatan</label>
              <select v-model="form.jenisPendapatan" class="form-input">
                <option value="Non Kapitasi">Non Kapitasi</option>
                <option value="PAD Murni">PAD Murni</option>
              </select>
            </div>
            <div class="form-group">
              <label>Nama Layanan</label>
              <input v-model="form.namaLayanan" type="text" class="form-input" placeholder="Misal: UGD, Rawat Inap, dsb" />
            </div>
          </div>

          <div class="form-group">
            <label>Jumlah Pendapatan BLUD (Rp)</label>
            <input v-model.number="form.jumlahBlud" type="number" class="form-input" @input="handleBludInput" />
          </div>

          <div class="form-divider">Kalkulasi Jaspel (Dapat diubah manual)</div>

          <div class="form-row">
            <div class="form-group">
              <label>Jaspel (60%)</label>
              <input v-model.number="form.jaspel60" type="number" class="form-input" @input="handleJaspelInput" />
            </div>
            <div class="form-group">
              <label>Operasional (40%)</label>
              <input v-model.number="form.operasional40" type="number" class="form-input" />
            </div>
          </div>

          <div class="form-row">
            <div class="form-group">
              <label>Tidak Langsung (60% TL)</label>
              <input v-model.number="form.tidakLangsung" type="number" class="form-input" />
            </div>
            <div class="form-group">
              <label>Langsung (40% L)</label>
              <input v-model.number="form.langsung" type="number" class="form-input" />
            </div>
          </div>

          <div class="modal-info">
            <button @click="resetToAuto" class="btn-text">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="icon-xs"><path d="M23 4v6h-6M1 20v-6h6"/><path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"/></svg>
              Reset ke Hitungan Otomatis
            </button>
          </div>
        </div>
        <div class="modal-footer">
          <button class="btn secondary" @click="closeModal">Batal</button>
          <button class="btn primary" @click="saveItem" :disabled="saving">
            <svg v-if="saving" class="animate-spin icon-sm" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" fill="none" style="opacity:0.25"></circle><path fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" style="opacity:0.75"></path></svg>
            {{ saving ? 'Menyimpan...' : 'Simpan Data' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import { useApi } from '../composables/useApi';
import { useJaspelStore } from '../stores/jaspelStore';

definePageMeta({ layout: "main" });

const { selectedPeriode } = useJaspelStore();
const config = useRuntimeConfig();

const { data: items, pending: loading, error, execute: refresh } = await useApi<any[]>(() => `/keuangan-detail/${selectedPeriode.value}`);

// Subtotals & Totals
const nonKapItems = computed(() => items.value?.filter(i => i.jenisPendapatan === 'Non Kapitasi') || []);
const padMurniItems = computed(() => items.value?.filter(i => i.jenisPendapatan === 'PAD Murni') || []);

const calculateTotals = (list: any[]) => {
  return list.reduce((acc, curr) => {
    acc.blud += curr.jumlahBlud || 0;
    acc.jaspel += curr.jaspel60 || 0;
    acc.operasional += curr.operasional40 || 0;
    acc.tl += curr.tidakLangsung || 0;
    acc.l += curr.langsung || 0;
    return acc;
  }, { blud: 0, jaspel: 0, operasional: 0, tl: 0, l: 0 });
};

const subtotals = computed(() => ({
  nonKap: calculateTotals(nonKapItems.value),
  pad: calculateTotals(padMurniItems.value)
}));

const totals = computed(() => {
  const nk = subtotals.value.nonKap;
  const pad = subtotals.value.pad;
  return {
    blud: nk.blud + pad.blud,
    jaspel: nk.jaspel + pad.jaspel,
    operasional: nk.operasional + pad.operasional,
    tidakLangsung: nk.tl + pad.tl,
    langsung: nk.l + pad.l
  };
});

// Modal & Form
const isModalOpen = ref(false);
const isEdit = ref(false);
const saving = ref(false);
const form = ref<any>({
  jenisPendapatan: 'Non Kapitasi',
  namaLayanan: '',
  jumlahBlud: 0,
  jaspel60: 0,
  operasional40: 0,
  tidakLangsung: 0,
  langsung: 0
});

const openCreate = () => {
  isEdit.value = false;
  form.value = {
    jenisPendapatan: 'Non Kapitasi',
    namaLayanan: '',
    jumlahBlud: 0,
    jaspel60: 0,
    operasional40: 0,
    tidakLangsung: 0,
    langsung: 0
  };
  isModalOpen.value = true;
};

const openEdit = (item: any) => {
  isEdit.value = true;
  form.value = { ...item };
  isModalOpen.value = true;
};

const closeModal = () => { isModalOpen.value = false; };

const handleBludInput = () => {
    form.value.jaspel60 = Math.round(form.value.jumlahBlud * 0.6);
    form.value.operasional40 = Math.round(form.value.jumlahBlud * 0.4);
    handleJaspelInput();
};

const handleJaspelInput = () => {
    form.value.tidakLangsung = Math.round(form.value.jaspel60 * 0.6);
    form.value.langsung = Math.round(form.value.jaspel60 * 0.4);
};

const resetToAuto = () => {
    handleBludInput();
};

const saveItem = async () => {
  saving.value = true;
  try {
    const url = isEdit.value 
        ? `${config.public.apiBase}/keuangan-detail/${form.value.id}` 
        : `${config.public.apiBase}/keuangan-detail`;
    
    await $fetch(url, {
      method: isEdit.value ? 'PUT' : 'POST',
      body: { ...form.value, periode: selectedPeriode.value }
    });
    
    await refresh();
    closeModal();
  } catch (e) {
    alert('Gagal menyimpan data');
  } finally {
    saving.value = false;
  }
};

const deleteItem = async (id: string) => {
  if(!confirm('Hapus baris ini?')) return;
  try {
    await $fetch(`${config.public.apiBase}/keuangan-detail/${id}`, { method: 'DELETE' });
    await refresh();
  } catch (e) {
    alert('Gagal menghapus data');
  }
};

const formatRp = (num: number | undefined) => {
  if (num === undefined || isNaN(num)) return '0';
  return new Intl.NumberFormat('id-ID').format(Math.round(num));
}

watch(selectedPeriode, () => refresh());
</script>

<style scoped>
.section-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 24px; }
.section-header h1 { margin: 0; }
.header-actions { display: flex; gap: 10px; }

#tbl-keuangan { border-collapse: collapse; width: 100%; }
#tbl-keuangan th, #tbl-keuangan td { border: 1px solid var(--border); padding: 10px 12px; font-size: 13px; }
#tbl-keuangan th { background: var(--bg-level2); font-weight: 600; text-transform: uppercase; font-size: 11px; letter-spacing: 0.5px; }

.group-header td { padding: 8px 14px !important; }
.group-label { font-weight: 700; font-size: 12px; text-transform: uppercase; letter-spacing: 0.5px; }
.group-label.non-kap { background: #e0f2fe; color: #0369a1; }
.group-label.pad-murni { background: #dcfce7; color: #166534; }

.subtotal-row.non-kap-total { background: #f0f9ff; }
.subtotal-row.pad-total { background: #f0fdf4; }
.grand-total { background: #0f172a; color: #fff; font-weight: 800; }
.grand-total td { color: #ffffff !important; border-color: #334155; }

.mono { font-family: 'JetBrains Mono', monospace; font-size: 12px; }

/* Modal Styles */
/* Handled by global transition modalFadeIn in main.css */

.icon-sm { width: 18px; height: 18px; }
.icon-xs { width: 14px; height: 14px; }

.animate-spin {
  animation: spin 1s linear infinite;
}
@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}
</style>
