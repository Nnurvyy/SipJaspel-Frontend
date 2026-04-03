<template>
  <div class="page">
    <div class="section-header">
      <h1>Print 60% Non Kapitasi</h1>
      <p>Distribusi Jaspel Tidak Langsung dari Non Kapitasi — Januari 2026</p>
    </div>

    <div v-if="pending" style="padding:40px;text-align:center;color:var(--text-muted)">Memuat data...</div>
    <div v-else-if="error" class="alert error" style="margin-top:20px">Gagal terhubung ke backend.</div>

    <div class="card" v-else>
      <div class="card-header">
        <div class="card-title">Daftar Penerimaan Jaspel — 60% Non Kapitasi (2026-01)</div>
        <div class="card-subtitle">Kolom yang kosong dapat diisi manual melalui tombol Aksi</div>
      </div>
      <div class="table-scroll">
        <table id="tbl-print-60nk">
          <thead>
            <tr>
              <th>No</th>
              <th>Nama Pegawai</th>
              <th>Golongan</th>
              <th>Jenis Ketenagaan</th>
              <th class="right">Masa Kerja</th>
              <th class="right">Rangkap<br>Tugas ADM</th>
              <th class="right">Jml Hari<br>Masuk Kerja</th>
              <th class="right">Jml Hari<br>Kerja</th>
              <th class="right">% Kehadiran</th>
              <th class="right">Jml Poin</th>
              <th class="right">Bobot</th>
              <th class="right">Jumlah Jaspel</th>
              <th>PPH (%)</th>
              <th class="right">PPH (Rp)</th>
              <th class="right">Jumlah Bersih</th>
              <th>Aksi</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(item, idx) in tableData" :key="item.id || idx">
              <td>{{ idx + 1 }}</td>
              <td style="white-space:nowrap"><strong>{{ item.nama }}</strong></td>
              <td><span class="badge blue">{{ item.golongan }}</span></td>
              <td>{{ item.jenisKetenagaan || '-' }}</td>
              <td class="right">{{ item.masaKerja || '-' }}</td>
              <td class="right">{{ item.rangkapTugasAdm || '-' }}</td>
              <td class="right">{{ item.hariMasukKerja || '-' }}</td>
              <td class="right">{{ item.hariKerja || '-' }}</td>
              <td class="right">{{ item.hariKerja > 0 ? ((item.hariMasukKerja / item.hariKerja) * 100).toFixed(1) + '%' : '-' }}</td>
              <td class="right">{{ item.jumlahPoinKapitasi || '-' }}</td>
              <td class="right">{{ item.bobot ? item.bobot.toFixed(3) : '-' }}</td>
              <td class="right" style="font-weight:600">{{ item.jaspelNonKap ? 'Rp ' + formatRp(item.jaspelNonKap) : '-' }}</td>
              <td>
                <span class="badge" :class="item.pphPercent > 0.05 ? 'amber' : (item.pphPercent > 0 ? 'green' : 'gray')">
                  {{ item.pphPercent ? (item.pphPercent * 100) + '%' : '-' }}
                </span>
              </td>
              <td class="right">{{ item.pphNonKap ? 'Rp ' + formatRp(item.pphNonKap) : '-' }}</td>
              <td class="right" style="font-weight:700;color:var(--accent-blue)">{{ item.bersihNonKap ? 'Rp ' + formatRp(item.bersihNonKap) : '-' }}</td>
              <td>
                <button class="action-btn edit" title="Edit" @click="openEdit(item)">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/></svg>
                </button>
              </td>
            </tr>
            <tr v-if="tableData.length === 0">
              <td colspan="16" style="text-align:center;padding:20px;color:var(--text-muted)">Tidak ada data. Isi data kehadiran di Bobot Kapitasi terlebih dahulu.</td>
            </tr>
            <!-- Subtotal -->
            <tr v-if="tableData.length > 0" style="background:var(--bg-level2);font-weight:700;">
              <td colspan="11" style="text-align:right;">TOTAL</td>
              <td class="right">Rp {{ formatRp(totals.jaspel) }}</td>
              <td></td>
              <td class="right">Rp {{ formatRp(totals.pph) }}</td>
              <td class="right" style="color:var(--accent-blue)">Rp {{ formatRp(totals.bersih) }}</td>
              <td></td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Edit Modal -->
    <div v-if="isEditOpen" class="modal-overlay" @click.self="closeEdit">
      <div class="modal-card">
        <div class="modal-header">
          <h3>Edit Data — {{ editForm.nama }}</h3>
          <button class="modal-close" @click="closeEdit">×</button>
        </div>
        <div class="modal-body">
          <p style="font-size:13px;color:var(--text-muted);margin:0 0 12px">
            Data dari Data Dasar (Golongan, Jenis Ketenagaan, dll) terisi otomatis. Edit kehadiran di halaman Bobot Kapitasi.
          </p>
          <div class="info-row">
            <div class="info-label">Nama</div><div class="info-value">{{ editForm.nama }}</div>
          </div>
          <div class="info-row">
            <div class="info-label">Golongan</div><div class="info-value">{{ editForm.golongan }}</div>
          </div>
          <div class="info-row">
            <div class="info-label">Jumlah Jaspel Non Kap</div><div class="info-value">Rp {{ formatRp(editForm.jaspelNonKap) }}</div>
          </div>
          <div class="info-row">
            <div class="info-label">PPH</div><div class="info-value">Rp {{ formatRp(editForm.pphNonKap) }}</div>
          </div>
          <div class="info-row">
            <div class="info-label">Jumlah Bersih</div><div class="info-value" style="color:var(--accent-blue);font-weight:600">Rp {{ formatRp(editForm.bersihNonKap) }}</div>
          </div>
        </div>
        <div class="modal-footer">
          <button class="btn secondary" @click="closeEdit">Tutup</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useApi } from '../../composables/useApi';

definePageMeta({ layout: 'main' });

const isEditOpen = ref(false);
const editForm = ref<any>({});

// Fetch both kehadiran (for labels) and print60 data (for jaspel amounts)
const { data: kehadiranData, pending: p1 } = await useApi<any[]>('/kehadiran/2026-01');
const { data: print60Data, pending: p2, error } = await useApi<any[]>('/reports/print-60/2026-01');
const pending = computed(() => p1.value || p2.value);

const tableData = computed(() => {
  if (!kehadiranData.value) return [];
  return kehadiranData.value.map((k: any) => {
    const p60 = print60Data.value?.find((p: any) => p.id === k.pegawaiId);
    return {
      ...k,
      bobot: p60?.bobot || null,
      jaspelNonKap: p60?.jaspelNonKap || null,
      pphPercent: p60?.pphPercent || null,
      pphNonKap: p60?.pphNonKap || null,
      bersihNonKap: p60?.bersihNonKap || null,
    };
  });
});

const totals = computed(() => {
  let jaspel = 0, pph = 0, bersih = 0;
  tableData.value.forEach((r: any) => {
    jaspel += r.jaspelNonKap || 0;
    pph += r.pphNonKap || 0;
    bersih += r.bersihNonKap || 0;
  });
  return { jaspel: Math.round(jaspel), pph: Math.round(pph), bersih: Math.round(bersih) };
});

const formatRp = (n: number | null) => {
  if (!n) return '0';
  return Math.round(n).toLocaleString('id-ID');
};

const openEdit = (item: any) => { editForm.value = item; isEditOpen.value = true; };
const closeEdit = () => { isEditOpen.value = false; };
</script>

<style scoped>
.action-btn { width: 28px; height: 28px; border-radius: 6px; border: 1px solid var(--border); background: #fff; display: flex; align-items: center; justify-content: center; cursor: pointer; transition: all .2s; color: var(--text-muted); }
.action-btn:hover.edit { border-color: var(--accent-blue); color: var(--accent-blue); }
.action-btn svg { width: 14px; height: 14px; }
.modal-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.5); z-index: 1000; display: flex; align-items: center; justify-content: center; }
.modal-card { background: var(--bg); border-radius: 16px; width: 460px; max-width: 95vw; box-shadow: 0 20px 60px rgba(0,0,0,0.3); overflow: hidden; }
.modal-header { padding: 20px 24px; border-bottom: 1px solid var(--border); display: flex; align-items: center; justify-content: space-between; }
.modal-header h3 { margin: 0; font-size: 15px; font-weight: 700; }
.modal-close { background: none; border: none; font-size: 24px; cursor: pointer; color: var(--text-muted); }
.modal-body { padding: 24px; display: flex; flex-direction: column; gap: 10px; }
.modal-footer { padding: 16px 24px; border-top: 1px solid var(--border); display: flex; gap: 10px; justify-content: flex-end; }
.info-row { display: flex; justify-content: space-between; font-size: 13px; border-bottom: 1px solid var(--border); padding-bottom: 8px; }
.info-label { color: var(--text-muted); }
.info-value { font-weight: 600; }
.btn { padding: 10px 20px; border-radius: 8px; font-size: 14px; font-weight: 600; cursor: pointer; border: none; }
.btn.secondary { background: var(--bg-level2); color: var(--text); border: 1px solid var(--border); }
#tbl-print-60nk th { font-size: 11px; white-space: nowrap; }
</style>
