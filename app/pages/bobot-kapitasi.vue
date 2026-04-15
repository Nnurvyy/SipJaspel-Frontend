<template>
  <div class="page">
    <div class="section-header">
      <h1>Bobot Kapitasi &amp; 60%</h1>
      <p>Data kehadiran &amp; poin kapitasi pegawai — {{ selectedPeriode }}</p>
    </div>

    <div v-if="pending" style="padding:40px;text-align:center;color:var(--text-muted)">Memuat data...</div>
    <div v-else-if="error" class="alert error" style="margin-top:20px">Gagal terhubung ke backend. Pastikan backend berjalan.</div>

    <div class="card" v-else>
      <div class="card-header">
        <div class="card-title">Daftar Bobot Kapitasi Pegawai ({{ selectedPeriode }})</div>
        <div class="card-subtitle">Klik tombol Edit untuk meng-override nilai kalkulasi sistem</div>
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
              <th class="right">Lama Masa<br>Kerja (Thn)</th>
              <th class="right">Masa<br>Kerja (Poin)</th>
              <th class="right">Jml Hari<br>Masuk</th>
              <th class="right">Jml Hari<br>Kerja</th>
              <th class="right">% Hadir</th>
              <th class="right">Poin<br>Kapitasi</th>
              <th class="right">Bobot<br>Kapitasi</th>
              <th class="right">Poin<br>Non Kap</th>
              <th class="right">Bobot<br>Non Kap</th>
              <th class="center">Aksi</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(item, idx) in kehadiranData" :key="item.id">
              <td>{{ idx + 1 }}</td>
              <td style="white-space:nowrap"><strong>{{ item.nama }}</strong></td>
              <!-- Logical Columns -->
              <td class="right" :class="{ 'overridden': item.isOverrideTJ }">{{ item.poinTanggungJawab }}</td>
              <td class="right">{{ item.poinKetenagaan }}</td>
              <td class="right">{{ item.rangkapTugasAdm }}</td>
              <td class="right">{{ item.lamaMasaKerja }}</td>
              <td class="right">{{ item.poinMasaKerja }}</td>
              <td class="right">{{ item.hariMasukKerja }}</td>
              <td class="right">{{ item.hariKerja }}</td>
              <td class="right">{{ (item.prosentaseKehadiran * 100).toFixed(1) }}%</td>
              <td class="right" style="font-weight:700">{{ item.jumlahPoinKapitasi }}</td>
              <td class="right highlight blue">{{ item.bobotKapitasi.toFixed(2) }}</td>
              <td class="right" style="font-weight:700">{{ item.jumlahPoinNonKapitasi }}</td>
              <td class="right highlight green">{{ item.bobotNonKapitasi.toFixed(2) }}</td>
              <td class="center">
                <button @click="openEdit(item)" class="action-btn edit" title="Edit / Override">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/></svg>
                </button>
              </td>
            </tr>
            <!-- Total Row -->
            <tr class="total-row">
              <td colspan="2"><strong>TOTAL</strong></td>
              <td colspan="8"></td>
              <td class="right"><strong>{{ totalPoinKap }}</strong></td>
              <td class="right"><strong>{{ totalBobotKap.toFixed(2) }}</strong></td>
              <td class="right"><strong>{{ totalPoinNonKap }}</strong></td>
              <td class="right"><strong>{{ totalBobotNonKap.toFixed(2) }}</strong></td>
              <td></td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Edit Modal -->
    <div v-if="isEditOpen" class="modal-overlay" @click.self="closeEdit">
      <div class="modal-card wide">
        <div class="modal-header">
          <h3>Edit &amp; Override Data — {{ editForm.nama }}</h3>
          <button class="modal-close" @click="closeEdit">×</button>
        </div>
        <div class="modal-body scrollable">
          <div class="form-section">
            <h4 class="section-title">Poin &amp; Bobot</h4>
            <div class="form-row items-4">
              <div class="form-group">
                <label>Tanggung Jawab Program</label>
                <input v-model.number="editForm.poinTanggungJawab" type="number" class="form-input" disabled />
                <span class="hint">Otomatis dari PJ & Koordinator: {{ autoValues.poinTanggungJawab }}</span>
              </div>
              <div class="form-group">
                <label>Jenis Ketenagaan</label>
                <input v-model.number="editForm.poinKetenagaan" type="number" class="form-input" @input="updateCalculations" />
              </div>
              <div class="form-group">
                <label>Rangkap Tugas ADM</label>
                <input v-model.number="editForm.rangkapTugasAdm" type="number" class="form-input" @input="updateCalculations" />
              </div>
              <div class="form-group">
                <label>Lama Masa Kerja (Thn)</label>
                <input v-model.number="editForm.lamaMasaKerja" type="number" class="form-input" @input="updateCalculations" />
              </div>
              <div class="form-group">
                <label>Masa Kerja (Poin)</label>
                <input v-model.number="editForm.poinMasaKerja" type="number" class="form-input" @input="updateCalculations" />
                <span class="hint">Auto: {{ autoValues.poinMasaKerja }}</span>
              </div>
            </div>
          </div>

          <div class="form-section">
            <h4 class="section-title">Data Kehadiran</h4>
            <div class="form-row three">
              <div class="form-group">
                <label>Hari Masuk</label>
                <input v-model.number="editForm.hariMasukKerja" type="number" class="form-input" @input="updateCalculations" />
              </div>
              <div class="form-group">
                <label>Hari Kerja</label>
                <input v-model.number="editForm.hariKerja" type="number" class="form-input" @input="updateCalculations" />
              </div>
              <div class="form-group">
                <label>% Kehadiran (Override)</label>
                <input v-model.number="editForm.prosentaseKehadiran" type="number" step="0.01" class="form-input" />
              </div>
            </div>
          </div>

          <div class="form-section">
            <h4 class="section-title">Hasil Akhir (Override)</h4>
            <div class="form-row items-4">
               <div class="form-group">
                <label>Total Poin Kapitasi</label>
                <input v-model.number="editForm.jumlahPoinKapitasi" type="number" class="form-input" />
              </div>
              <div class="form-group">
                <label>Total Poin Non Kap</label>
                <input v-model.number="editForm.jumlahPoinNonKapitasi" type="number" class="form-input" />
              </div>
              <div class="form-group">
                <label>Bobot Kapitasi</label>
                <input v-model.number="editForm.bobotKapitasi" type="number" step="0.01" class="form-input" />
              </div>
              <div class="form-group">
                <label>Bobot Non Kap</label>
                <input v-model.number="editForm.bobotNonKapitasi" type="number" step="0.01" class="form-input" />
              </div>
            </div>
          </div>

          <div class="modal-actions-inline">
             <button @click="resetToAuto" class="btn-reset">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="icon-xs"><path d="M23 4v6h-6M1 20v-6h6"/><path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"/></svg>
                Reset ke Hitungan Otomatis
             </button>
          </div>
        </div>
        <div class="modal-footer">
          <button class="btn secondary" @click="closeEdit">Batal</button>
          <button class="btn primary" @click="saveEdit" :disabled="saving">
            {{ saving ? 'Menyimpan...' : 'Simpan Perubahan' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import { useApi } from '../composables/useApi';
import { useJaspelStore } from '../stores/jaspelStore';

definePageMeta({ layout: 'main' });
 
const { selectedPeriode } = useJaspelStore();
const config = useRuntimeConfig();

const { data: kehadiranData, pending, error, execute: refresh } = await useApi<any[]>(() => `/kehadiran/${selectedPeriode.value}`);

const isEditOpen = ref(false);
const saving = ref(false);
const editForm = ref<any>({});
const autoValues = ref<any>({});

// Totals
const totalPoinKap = computed(() => kehadiranData.value?.reduce((a, b) => a + (b.jumlahPoinKapitasi || 0), 0) || 0);
const totalBobotKap = computed(() => kehadiranData.value?.reduce((a, b) => a + (b.bobotKapitasi || 0), 0) || 0);
const totalPoinNonKap = computed(() => kehadiranData.value?.reduce((a, b) => a + (b.jumlahPoinNonKapitasi || 0), 0) || 0);
const totalBobotNonKap = computed(() => kehadiranData.value?.reduce((a, b) => a + (b.bobotNonKapitasi || 0), 0) || 0);

const openEdit = (item: any) => {
  editForm.value = JSON.parse(JSON.stringify(item));
  // Record auto values for reset hint
  // Note: we'll use the current poinTanggungJawab as the auto value if not overridden, 
  // or we can calculate it if we had the raw sum. 
  // For now, let's assume the one from API (if not overridden) is the sum.
  autoValues.value = {
      poinTanggungJawab: item.sumStruktur, 
      poinMasaKerja: calculatePoinMK(item.lamaMasaKerja)
  };
  isEditOpen.value = true;
};

const closeEdit = () => { isEditOpen.value = false; };

const calculatePoinMK = (thn: number) => {
    if (thn >= 26) return 25;
    if (thn >= 21) return 20;
    if (thn >= 16) return 15;
    if (thn >= 11) return 10;
    if (thn >= 6) return 5;
    return 2;
};

const updateCalculations = () => {
    const f = editForm.value;
    f.prosentaseKehadiran = f.hariKerja > 0 ? f.hariMasukKerja / f.hariKerja : 0;
    
    // Auto-calculate poinMasaKerja from lamaMasaKerja
    if (f.lamaMasaKerja !== undefined) {
        f.poinMasaKerja = calculatePoinMK(f.lamaMasaKerja);
    }

    f.jumlahPoinKapitasi = (f.poinTanggungJawab || 0) + (f.poinKetenagaan || 0) + (f.rangkapTugasAdm || 0) + (f.poinMasaKerja || 0);
    f.jumlahPoinNonKapitasi = (f.poinKetenagaan || 0) + (f.rangkapTugasAdm || 0) + (f.poinMasaKerja || 0);
    f.bobotKapitasi = f.jumlahPoinKapitasi * f.prosentaseKehadiran;
    f.bobotNonKapitasi = f.jumlahPoinNonKapitasi * f.prosentaseKehadiran;
};

const resetToAuto = () => {
    const f = editForm.value;
    f.poinTanggungJawab = autoValues.value.poinTanggungJawab;
    f.poinMasaKerja = autoValues.value.poinMasaKerja;
    // PPH or other fields could also be reset if we had stored them
    updateCalculations();
};

const saveEdit = async () => {
  saving.value = true;
  try {
    const payload = {
      ...editForm.value,
      pegawaiId: editForm.value.id // Map 'id' to 'pegawaiId' as expected by backend validator
    };
    
    await $fetch(`${config.public.apiBase}/kehadiran/${selectedPeriode.value}`, {
      method: 'PUT',
      body: payload
    });
    await refresh();
    closeEdit();
  } catch (e) {
    alert('Gagal menyimpan data');
  } finally {
    saving.value = false;
  }
};

watch(selectedPeriode, () => refresh());
</script>

<style scoped>
#tbl-bobot { border-collapse: collapse; width: 100%; }
#tbl-bobot th, #tbl-bobot td { border: 1px solid var(--border); padding: 10px 12px; font-size: 13px; }
#tbl-bobot th { background: var(--bg-level2); font-weight: 700; text-transform: uppercase; font-size: 11px; letter-spacing: 0.5px; }

.highlight { font-weight: 800; }
.highlight.blue { color: var(--accent-blue); background: #eff6ff; }
.highlight.green { color: #16a34a; background: #f0fdf4; }

/* Modal Styles */
/* Handled by global transition modalFadeIn in main.css */

.icon-xs { width: 14px; height: 14px; }
.scrollable { overflow-y: auto; max-height: calc(90vh - 160px); }

.btn-reset {
  display: flex;
  align-items: center;
  gap: 8px;
  background: #fff;
  border: 1px solid var(--accent-amber);
  color: var(--accent-amber);
  padding: 8px 16px;
  border-radius: 8px;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-reset:hover {
  background: var(--accent-amber);
  color: #fff;
  box-shadow: 0 4px 12px rgba(217, 119, 6, 0.2);
}

.overridden {
  color: var(--accent-amber);
  font-weight: 700;
  position: relative;
}

.overridden::after {
  content: '*';
  position: absolute;
  top: -2px;
  right: -8px;
  font-size: 14px;
}
</style>
