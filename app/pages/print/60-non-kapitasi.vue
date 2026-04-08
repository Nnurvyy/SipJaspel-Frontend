<template>
  <div class="page">
    <div class="section-header">
      <h1>Print 60% Non Kapitasi</h1>
      <p>Distribusi Jaspel 60% (Tidak Langsung) kategori Non Kapitasi — {{ selectedPeriode }}</p>
    </div>

    <!-- LOADING STATE -->
    <div v-if="loading && !data" style="padding:40px;text-align:center;color:var(--text-muted)">Memuat data...</div>

    <div v-else-if="error" style="padding:40px;text-align:center;color:#ef4444">
        Gagal memuat data ({{ error.message }}).
    </div>

    <div class="card" v-else-if="data">
      <div class="table-scroll">
        <table class="report-table">
          <thead>
            <tr>
              <th>No</th>
              <th>Nama Pegawai</th>
              <th>Gol</th>
              <th>Jenis Ketenagaan</th>
              <th>Masa Kerja</th>
              <th>Rangkap Tugas ADM</th>
              <th>Jumlah Hari Masuk Kerja</th>
              <th>Jumlah Hari Kerja</th>
              <th>Prosentase Kehadiran</th>
              <th>Poin</th>
              <th>Bobot</th>
              <th class="right">Jaspel Non Kap</th>
              <th class="right">PPh (%)</th>
              <th class="right">PPh (Rp)</th>
              <th class="right">Jaspel Bersih</th>
              <th class="center">Aksi</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(row, idx) in data" :key="row.id">
              <td>{{ idx + 1 }}</td>
              <td style="white-space:nowrap"><strong>{{ row.nama }}</strong></td>
              <td>{{ row.golongan }}</td>
              <td class="center">{{ row.jenisKetenagaanPoin }}</td>
              <td>{{ row.masaKerja }}</td>
              <td>{{ row.rangkapTugasAdm }}</td>
              <td>{{ row.hariMasukKerja }}</td>
              <td>{{ row.hariKerja }}</td>
              <td>{{ (row.prosentaseKehadiran * 100).toFixed(0) }}%</td>
              <td>{{ row.jumlahPoin?.toFixed(2) }}</td>
              <td>{{ row.bobot?.toFixed(2) }}</td>
              <td class="right" :class="{ 'overridden': row.isOverride }">Rp {{ formatRp(row.jaspelNonKap) }}</td>
              <td class="right">{{ row.pphPercentNonKap }}%</td>
              <td class="right">Rp {{ formatRp(row.pphNonKap) }}</td>
              <td class="right highlight">Rp {{ formatRp(row.bersihNonKap) }}</td>
              <td class="center">
                <button @click="openEdit(row)" class="action-btn edit">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/></svg>
                </button>
              </td>
            </tr>
          </tbody>
          <tfoot>
            <tr class="total-row">
              <td colspan="10">TOTAL</td>
              <td class="center">{{ totals.bobot.toFixed(2) }}</td>
              <td class="right">Rp {{ formatRp(totals.jaspel) }}</td>
              <td></td>
              <td class="right">Rp {{ formatRp(totals.pph) }}</td>
              <td class="right">Rp {{ formatRp(totals.bersih) }}</td>
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
          <h3>Override Jaspel — {{ editForm.nama }}</h3>
          <button class="modal-close" @click="closeEdit">×</button>
        </div>
        <div class="modal-body">
          <div class="form-group">
            <label>Jumlah Jaspel Kotor (Rp)</label>
            <InputCurrency v-model="editForm.jaspelNonKap" @update:modelValue="recalc" />
          </div>
          <div class="form-row">
            <div class="form-group">
              <label>PPH (%)</label>
              <input v-model.number="editForm.pphPercentNonKap" type="number" class="form-input" @input="recalc" />
            </div>
            <div class="form-group">
              <label>PPH Nominal (Rp)</label>
              <InputCurrency v-model="editForm.pphNonKap" />
            </div>
          </div>
          <div class="form-group">
            <label>Jaspel Bersih (Rp)</label>
            <InputCurrency v-model="editForm.bersihNonKap" />
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
import { ref, computed, watch } from 'vue';
import { useApi } from '~/composables/useApi';
import { useJaspelStore } from '~/stores/jaspelStore';

definePageMeta({ layout: 'main' });

const { selectedPeriode } = useJaspelStore();
const config = useRuntimeConfig();

const { data, pending: loading, error, execute: refresh } = await useApi<any[]>(() => `/jaspel-distribusi/print-60/${selectedPeriode.value}`);

const totals = computed(() => {
    return data.value?.reduce((acc, curr) => {
        acc.bobot += curr.bobot || 0;
        acc.jaspel += curr.jaspelNonKap || 0;
        acc.pph += curr.pphNonKap || 0;
        acc.bersih += curr.bersihNonKap || 0;
        return acc;
    }, { bobot: 0, jaspel: 0, pph: 0, bersih: 0 }) || { bobot: 0, jaspel: 0, pph: 0, bersih: 0 };
});

const isEditOpen = ref(false);
const saving = ref(false);
const editForm = ref<any>({});

const openEdit = (row: any) => {
    editForm.value = { ...row };
    isEditOpen.value = true;
};
const closeEdit = () => { isEditOpen.value = false; };

const recalc = () => {
    const f = editForm.value;
    f.pphNonKap = Math.round(f.jaspelNonKap * (f.pphPercentNonKap / 100));
    f.bersihNonKap = f.jaspelNonKap - f.pphNonKap;
};

const resetToAuto = async () => {
    if(!confirm('Reset override untuk pegawai ini?')) return;
    try {
        await $fetch(`${config.public.apiBase}/jaspel-distribusi/${selectedPeriode.value}`, {
            method: 'PUT',
            body: {
                pegawaiId: editForm.value.id,
                print60NonKapJumlah: null,
                print60NonKapPphPersen: null,
                print60NonKapPphNominal: null,
                print60NonKapBersih: null
            }
        });
        await refresh();
        closeEdit();
    } catch (e) {
        alert('Gagal reset data');
    }
};

const saveEdit = async () => {
    saving.value = true;
    try {
        await $fetch(`${config.public.apiBase}/jaspel-distribusi/${selectedPeriode.value}`, {
            method: 'PUT',
            body: {
                pegawaiId: editForm.value.id,
                print60NonKapJumlah: editForm.value.jaspelNonKap,
                print60NonKapPphPersen: editForm.value.pphPercentNonKap,
                print60NonKapPphNominal: editForm.value.pphNonKap,
                print60NonKapBersih: editForm.value.bersihNonKap
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

const formatRp = (v: number) => new Intl.NumberFormat('id-ID').format(Math.round(v || 0));
watch(selectedPeriode, () => refresh());
</script>

<style scoped>
.report-table { width: 100%; border-collapse: collapse; }
.report-table th, .report-table td { border: 1px solid var(--border); padding: 12px; font-size: 13px; }
.report-table th { background: var(--bg-level2); font-weight: 700; text-transform: uppercase; font-size: 11px; }

.highlight { color: var(--accent-blue); font-weight: 700; }
.overridden { color: #f59e0b; }

/* Modal Styles Handled by global main.css */
</style>
