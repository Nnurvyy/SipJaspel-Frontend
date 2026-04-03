<template>
  <div class="page">
    <div class="section-header">
      <h1>Print 40% PAD Murni</h1>
      <p>Distribusi Jaspel Langsung dari PAD Murni — Januari 2026</p>
    </div>

    <div v-if="pending" style="padding:40px;text-align:center;color:var(--text-muted)">Memuat data...</div>
    <div v-else-if="error" class="alert error" style="margin-top:20px">Gagal terhubung ke backend.</div>

    <div class="card" v-else>
      <div class="card-header">
        <div class="card-title">Distribusi 40% PAD Murni per Unit Pelayanan (2026-01)</div>
        <div class="card-subtitle">Semua nilai dalam Rupiah. Klik aksi edit untuk input manual per baris.</div>
      </div>
      <div class="table-scroll">
        <table id="tbl-print-40pad">
          <thead>
            <tr>
              <th>No</th>
              <th>Nama</th>
              <th>Gol</th>
              <th class="right">UGD</th>
              <th class="right">One Day<br>Care</th>
              <th class="right">PONED</th>
              <th class="right">Konseling</th>
              <th class="right">Haji</th>
              <th class="right">KIA</th>
              <th class="right">USG</th>
              <th class="right">KB</th>
              <th class="right">LAB</th>
              <th class="right">Poli<br>Umum</th>
              <th class="right">Gigi</th>
              <th class="right">Ambulans</th>
              <th class="right">Jumlah</th>
              <th class="right">PPH</th>
              <th class="right">Jumlah Bersih</th>
              <th>Aksi</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(item, idx) in tableData" :key="item.pegawaiId || idx">
              <td>{{ idx + 1 }}</td>
              <td style="white-space:nowrap"><strong>{{ item.nama }}</strong></td>
              <td><span class="badge teal">{{ item.golongan }}</span></td>
              <td class="right">{{ formatRp(item.ugd) }}</td>
              <td class="right">{{ formatRp(item.oneDayCare) }}</td>
              <td class="right">{{ formatRp(item.poned) }}</td>
              <td class="right">{{ formatRp(item.konseling) }}</td>
              <td class="right">{{ formatRp(item.haji) }}</td>
              <td class="right">{{ formatRp(item.kia) }}</td>
              <td class="right">{{ formatRp(item.usg) }}</td>
              <td class="right">{{ formatRp(item.kb) }}</td>
              <td class="right">{{ formatRp(item.lab) }}</td>
              <td class="right">{{ formatRp(item.poliUmum) }}</td>
              <td class="right">{{ formatRp(item.gigi) }}</td>
              <td class="right">{{ formatRp(item.ambulans) }}</td>
              <td class="right" style="font-weight:600">{{ formatRp(item.jumlah) }}</td>
              <td class="right">{{ formatRp(item.pph) }}</td>
              <td class="right" style="font-weight:700;color:var(--accent-blue)">{{ formatRp(item.bersih) }}</td>
              <td>
                <button class="action-btn edit" title="Edit" @click="openEdit(item, idx)">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/></svg>
                </button>
              </td>
            </tr>
            <tr v-if="tableData.length === 0">
              <td colspan="19" style="text-align:center;padding:20px;color:var(--text-muted)">Tidak ada data.</td>
            </tr>
            <tr v-if="tableData.length > 0" style="background:var(--bg-level2);font-weight:700;">
              <td colspan="3" style="text-align:right;">TOTAL</td>
              <td class="right">{{ formatRp(colTotals.ugd) }}</td>
              <td class="right">{{ formatRp(colTotals.oneDayCare) }}</td>
              <td class="right">{{ formatRp(colTotals.poned) }}</td>
              <td class="right">{{ formatRp(colTotals.konseling) }}</td>
              <td class="right">{{ formatRp(colTotals.haji) }}</td>
              <td class="right">{{ formatRp(colTotals.kia) }}</td>
              <td class="right">{{ formatRp(colTotals.usg) }}</td>
              <td class="right">{{ formatRp(colTotals.kb) }}</td>
              <td class="right">{{ formatRp(colTotals.lab) }}</td>
              <td class="right">{{ formatRp(colTotals.poliUmum) }}</td>
              <td class="right">{{ formatRp(colTotals.gigi) }}</td>
              <td class="right">{{ formatRp(colTotals.ambulans) }}</td>
              <td class="right">{{ formatRp(colTotals.jumlah) }}</td>
              <td class="right">{{ formatRp(colTotals.pph) }}</td>
              <td class="right" style="color:var(--accent-blue)">{{ formatRp(colTotals.bersih) }}</td>
              <td></td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <div v-if="isEditOpen" class="modal-overlay" @click.self="closeEdit">
      <div class="modal-card">
        <div class="modal-header">
          <h3>Edit Data 40% PAD — {{ editForm.nama }}</h3>
          <button class="modal-close" @click="closeEdit">×</button>
        </div>
        <div class="modal-body">
          <p style="font-size:13px;color:var(--text-muted);margin:0 0 12px">Input nilai Jaspel PAD Murni per unit pelayanan (Rupiah)</p>
          <div class="form-row">
            <div class="form-group"><label>UGD</label><input v-model.number="editForm.ugd" type="number" class="form-input" /></div>
            <div class="form-group"><label>One Day Care</label><input v-model.number="editForm.oneDayCare" type="number" class="form-input" /></div>
          </div>
          <div class="form-row">
            <div class="form-group"><label>PONED</label><input v-model.number="editForm.poned" type="number" class="form-input" /></div>
            <div class="form-group"><label>Konseling</label><input v-model.number="editForm.konseling" type="number" class="form-input" /></div>
          </div>
          <div class="form-row">
            <div class="form-group"><label>Haji</label><input v-model.number="editForm.haji" type="number" class="form-input" /></div>
            <div class="form-group"><label>KIA</label><input v-model.number="editForm.kia" type="number" class="form-input" /></div>
          </div>
          <div class="form-row">
            <div class="form-group"><label>USG</label><input v-model.number="editForm.usg" type="number" class="form-input" /></div>
            <div class="form-group"><label>KB</label><input v-model.number="editForm.kb" type="number" class="form-input" /></div>
          </div>
          <div class="form-row">
            <div class="form-group"><label>LAB</label><input v-model.number="editForm.lab" type="number" class="form-input" /></div>
            <div class="form-group"><label>Poli Umum</label><input v-model.number="editForm.poliUmum" type="number" class="form-input" /></div>
          </div>
          <div class="form-row">
            <div class="form-group"><label>Gigi</label><input v-model.number="editForm.gigi" type="number" class="form-input" /></div>
            <div class="form-group"><label>Ambulans</label><input v-model.number="editForm.ambulans" type="number" class="form-input" /></div>
          </div>
        </div>
        <div class="modal-footer">
          <button class="btn secondary" @click="closeEdit">Batal</button>
          <button class="btn primary" @click="saveEdit">Simpan</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import { useApi } from '../../composables/useApi';

definePageMeta({ layout: 'main' });

const isEditOpen = ref(false);
const editForm = ref<any>({});
const editIdx = ref(-1);

const { data: pegawaiData, pending, error } = await useApi<any[]>('/pegawai');
const rows = ref<any[]>([]);

watch(pegawaiData, (val) => {
  if (val && rows.value.length === 0) {
    rows.value = val.map((p: any) => ({
      pegawaiId: p.id,
      nama: p.nama,
      golongan: p.golongan,
      ugd: 0, oneDayCare: 0, poned: 0, konseling: 0, haji: 0,
      kia: 0, usg: 0, kb: 0, lab: 0, poliUmum: 0, gigi: 0, ambulans: 0,
      pphPercent: p.golongan === 'IV' ? 0.15 : p.golongan?.startsWith('III') ? 0.05 : 0,
    }));
  }
}, { immediate: true });

const tableData = computed(() => rows.value.map((r: any) => {
  const jumlah = r.ugd + r.oneDayCare + r.poned + r.konseling + r.haji + r.kia + r.usg + r.kb + r.lab + r.poliUmum + r.gigi + r.ambulans;
  const pph = jumlah * (r.pphPercent || 0);
  return { ...r, jumlah, pph, bersih: jumlah - pph };
}));

const colTotals = computed(() => {
  const t: any = { ugd:0,oneDayCare:0,poned:0,konseling:0,haji:0,kia:0,usg:0,kb:0,lab:0,poliUmum:0,gigi:0,ambulans:0,jumlah:0,pph:0,bersih:0 };
  tableData.value.forEach((r: any) => { Object.keys(t).forEach(k => { t[k] += r[k] || 0; }); });
  return t;
});

const formatRp = (n: number) => { if (!n) return '-'; return Math.round(n).toLocaleString('id-ID'); };
const openEdit = (item: any, idx: number) => { editForm.value = { ...item }; editIdx.value = idx; isEditOpen.value = true; };
const saveEdit = () => { if (editIdx.value >= 0) rows.value[editIdx.value] = { ...editForm.value }; isEditOpen.value = false; };
const closeEdit = () => { isEditOpen.value = false; };
</script>

<style scoped>
.action-btn { width: 28px; height: 28px; border-radius: 6px; border: 1px solid var(--border); background: #fff; display: flex; align-items: center; justify-content: center; cursor: pointer; transition: all .2s; color: var(--text-muted); }
.action-btn:hover.edit { border-color: var(--accent-blue); color: var(--accent-blue); }
.action-btn svg { width: 14px; height: 14px; }
.modal-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.5); z-index: 1000; display: flex; align-items: center; justify-content: center; }
.modal-card { background: var(--bg); border-radius: 16px; width: 540px; max-width: 95vw; max-height: 90vh; overflow-y: auto; box-shadow: 0 20px 60px rgba(0,0,0,0.3); }
.modal-header { padding: 20px 24px; border-bottom: 1px solid var(--border); display: flex; justify-content: space-between; align-items: center; position: sticky; top: 0; background: var(--bg); }
.modal-header h3 { margin: 0; font-size: 15px; }
.modal-close { background: none; border: none; font-size: 24px; cursor: pointer; color: var(--text-muted); }
.modal-body { padding: 24px; display: flex; flex-direction: column; gap: 12px; }
.modal-footer { padding: 16px 24px; border-top: 1px solid var(--border); display: flex; justify-content: flex-end; gap: 10px; position: sticky; bottom: 0; background: var(--bg); }
.form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
.form-group { display: flex; flex-direction: column; gap: 4px; }
.form-group label { font-size: 12px; font-weight: 600; color: var(--text-secondary); }
.form-input { padding: 8px 10px; border: 1px solid var(--border); border-radius: 6px; background: var(--bg-level2); color: var(--text); font-size: 13px; outline: none; width: 100%; box-sizing: border-box; }
.btn { padding: 10px 20px; border-radius: 8px; font-size: 14px; font-weight: 600; cursor: pointer; border: none; }
.btn.primary { background: var(--accent-blue); color: white; }
.btn.secondary { background: var(--bg-level2); color: var(--text); border: 1px solid var(--border); }
#tbl-print-40pad th { font-size: 11px; white-space: nowrap; }
</style>
