<template>
  <div class="page">
    <div class="section-header">
      <h1>Bobot Kapitasi &amp; 60%</h1>
      <p>Data kehadiran &amp; poin kapitasi pegawai — Januari 2026</p>
    </div>

    <div v-if="pending" style="padding:40px;text-align:center;color:var(--text-muted)">Memuat data...</div>
    <div v-else-if="error" class="alert error" style="margin-top:20px">Gagal terhubung ke backend. Pastikan backend berjalan.</div>

    <div class="card" v-else>
      <div class="card-header">
        <div class="card-title">Daftar Bobot Kapitasi Pegawai (2026-01)</div>
        <div class="card-subtitle">Kolom yang kosong dapat diisi manual melalui tombol Aksi</div>
      </div>
      <div class="table-scroll">
        <table id="tbl-bobot">
          <thead>
            <tr>
              <th>No</th>
              <th>Nama Pegawai</th>
              <th class="right">Tanggung Jawab<br>Program</th>
              <th class="right">Jenis<br>Ketenagaan</th>
              <th class="right">Rangkap<br>Tugas ADM</th>
              <th class="right">Lama Masa<br>Kerja</th>
              <th class="right">Masa<br>Kerja</th>
              <th class="right">Jml Hari<br>Masuk Kerja</th>
              <th class="right">Jml Hari<br>Kerja</th>
              <th class="right">% Kehadiran</th>
              <th class="right">Jml Poin<br>Kapitasi</th>
              <th>Aksi</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(item, idx) in kehadiranData" :key="item.pegawaiId">
              <td>{{ idx + 1 }}</td>
              <td style="white-space:nowrap"><strong>{{ item.nama }}</strong></td>
              <td class="right">{{ item.poinTanggungJawab || '-' }}</td>
              <td class="right">{{ item.poinKetenagaan || '-' }}</td>
              <td class="right">{{ item.rangkapTugasAdm || '-' }}</td>
              <td class="right">{{ item.lamaMasaKerja || '-' }}</td>
              <td class="right">{{ item.masaKerja || '-' }}</td>
              <td class="right">{{ item.hariMasukKerja || '-' }}</td>
              <td class="right">{{ item.hariKerja || '-' }}</td>
              <td class="right">
                <span v-if="item.hariKerja > 0">{{ (item.prosentaseKehadiran * 100).toFixed(1) }}%</span>
                <span v-else class="muted">-</span>
              </td>
              <td class="right" style="font-weight:700;color:var(--accent-blue)">
                {{ item.jumlahPoinKapitasi > 0 ? item.jumlahPoinKapitasi : '-' }}
              </td>
              <td>
                <button @click="openEdit(item)" class="action-btn edit" title="Edit Data">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/></svg>
                </button>
              </td>
            </tr>
            <tr v-if="!kehadiranData || kehadiranData.length === 0">
              <td colspan="12" style="text-align:center;padding:20px;color:var(--text-muted)">
                Tidak ada data pegawai. Tambahkan pegawai di Data Dasar terlebih dahulu.
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Edit Modal -->
    <div v-if="isEditOpen" class="modal-overlay" @click.self="closeEdit">
      <div class="modal-card">
        <div class="modal-header">
          <h3>Edit Data Kehadiran — {{ editForm.nama }}</h3>
          <button class="modal-close" @click="closeEdit">×</button>
        </div>
        <div class="modal-body">
          <div class="form-row">
            <div class="form-group">
              <label>Jumlah Hari Masuk Kerja</label>
              <input v-model.number="editForm.hariMasukKerja" type="number" class="form-input" min="0" />
            </div>
            <div class="form-group">
              <label>Jumlah Hari Kerja</label>
              <input v-model.number="editForm.hariKerja" type="number" class="form-input" min="0" />
            </div>
          </div>
          <div class="form-row">
            <div class="form-group">
              <label>Rangkap Tugas ADM</label>
              <input v-model.number="editForm.rangkapTugasAdm" type="number" class="form-input" step="0.5" />
            </div>
            <div class="form-group">
              <label>Tanggung Jawab Program</label>
              <input v-model="editForm.tanggungJawabProgram" type="text" class="form-input" placeholder="cth: Program Imunisasi" />
            </div>
          </div>
          <div v-if="editForm.hariKerja > 0" class="info-box">
            Persentase Kehadiran: <strong>{{ ((editForm.hariMasukKerja / editForm.hariKerja) * 100).toFixed(1) }}%</strong>
          </div>
        </div>
        <div class="modal-footer">
          <button class="btn secondary" @click="closeEdit">Batal</button>
          <button class="btn primary" @click="saveEdit" :disabled="saving">
            {{ saving ? 'Menyimpan...' : 'Simpan' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useApi } from '../composables/useApi';

definePageMeta({ layout: 'main' });

const config = useRuntimeConfig();
const isEditOpen = ref(false);
const saving = ref(false);
const editForm = ref<any>({});

const { data: kehadiranData, pending, error, execute: refresh } = await useApi<any[]>('/kehadiran/2026-01');

const openEdit = (item: any) => {
  editForm.value = {
    pegawaiId: item.pegawaiId,
    nama: item.nama,
    hariMasukKerja: item.hariMasukKerja || 0,
    hariKerja: item.hariKerja || 0,
    rangkapTugasAdm: item.rangkapTugasAdm || 0,
    tanggungJawabProgram: item.tanggungJawabProgram || '',
  };
  isEditOpen.value = true;
};

const closeEdit = () => { isEditOpen.value = false; };

const saveEdit = async () => {
  saving.value = true;
  try {
    await $fetch(`${config.public.apiBase}/kehadiran/2026-01`, {
      method: 'PUT',
      body: {
        pegawaiId: editForm.value.pegawaiId,
        hariMasukKerja: editForm.value.hariMasukKerja,
        hariKerja: editForm.value.hariKerja,
        rangkapTugasAdm: editForm.value.rangkapTugasAdm,
        tanggungJawabProgram: editForm.value.tanggungJawabProgram,
      }
    });
    await refresh();
    closeEdit();
  } catch (e) {
    alert('Gagal menyimpan data');
  } finally {
    saving.value = false;
  }
};
</script>

<style scoped>
.action-btn {
  width: 28px; height: 28px; border-radius: 6px; border: 1px solid var(--border);
  background: #fff; display: flex; align-items: center; justify-content: center;
  cursor: pointer; transition: all .2s; color: var(--text-muted);
}
.action-btn:hover.edit { border-color: var(--accent-blue); color: var(--accent-blue); }
.action-btn svg { width: 14px; height: 14px; }
.modal-overlay {
  position: fixed; inset: 0; background: rgba(0,0,0,0.5); z-index: 1000;
  display: flex; align-items: center; justify-content: center;
}
.modal-card {
  background: var(--bg); border-radius: 16px; width: 520px; max-width: 95vw;
  box-shadow: 0 20px 60px rgba(0,0,0,0.3); overflow: hidden;
}
.modal-header {
  padding: 20px 24px; border-bottom: 1px solid var(--border);
  display: flex; align-items: center; justify-content: space-between;
}
.modal-header h3 { margin: 0; font-size: 15px; font-weight: 700; }
.modal-close { background: none; border: none; font-size: 24px; cursor: pointer; color: var(--text-muted); }
.modal-body { padding: 24px; display: flex; flex-direction: column; gap: 16px; }
.modal-footer { padding: 16px 24px; border-top: 1px solid var(--border); display: flex; gap: 10px; justify-content: flex-end; }
.form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
.form-group { display: flex; flex-direction: column; gap: 6px; }
.form-group label { font-size: 13px; font-weight: 600; color: var(--text-secondary); }
.form-input { padding: 10px 12px; border: 1px solid var(--border); border-radius: 8px; background: var(--bg-level2); color: var(--text); font-size: 14px; outline: none; width: 100%; box-sizing: border-box; }
.form-input:focus { border-color: var(--accent-blue); }
.btn { padding: 10px 20px; border-radius: 8px; font-size: 14px; font-weight: 600; cursor: pointer; border: none; }
.btn.primary { background: var(--accent-blue); color: white; }
.btn.secondary { background: var(--bg-level2); color: var(--text); border: 1px solid var(--border); }
.info-box { background: #eff6ff; border: 1px solid #bfdbfe; border-radius: 8px; padding: 12px 16px; font-size: 13px; color: #1e40af; }
#tbl-bobot th { white-space: nowrap; font-size: 12px; }
</style>
