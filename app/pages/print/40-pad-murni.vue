<template>
  <div class="page">
    <div class="section-header">
      <h1>Print 40% PAD Murni</h1>
      <p>Distribusi Jaspel 40% (Langsung) kategori PAD Murni — {{ selectedPeriode }}</p>
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
              <th rowspan="2">No</th>
              <th rowspan="2">Nama Pegawai</th>
              <th rowspan="2">Gol</th>
              <th colspan="12" class="center">Unit Pelayanan</th>
              <th rowspan="2" class="right">Jumlah</th>
              <th rowspan="2" class="right">PPh (Rp)</th>
              <th rowspan="2" class="right">Bersih</th>
              <th rowspan="2" class="center">Aksi</th>
            </tr>
            <tr>
              <th class="rotate">UGD</th>
              <th class="rotate">One Day Care</th>
              <th class="rotate">PONED</th>
              <th class="rotate">Konseling</th>
              <th class="rotate">Haji</th>
              <th class="rotate">KIA</th>
              <th class="rotate">USG</th>
              <th class="rotate">KB</th>
              <th class="rotate">LAB</th>
              <th class="rotate">Poli Umum</th>
              <th class="rotate">Gigi</th>
              <th class="rotate">Ambulans</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(row, idx) in data" :key="row.id">
              <td>{{ idx + 1 }}</td>
              <td style="white-space:nowrap"><strong>{{ row.nama }}</strong></td>
              <td>{{ row.golongan }}</td>
              <td class="right muted small">{{ formatRp(row.unitBreakdown?.['UGD']?.pad) }}</td>
              <td class="right muted small">{{ formatRp(row.unitBreakdown?.['One Day Care']?.pad) }}</td>
              <td class="right muted small">{{ formatRp(row.unitBreakdown?.['PONED']?.pad) }}</td>
              <td class="right muted small">{{ formatRp(row.unitBreakdown?.['Konseling']?.pad) }}</td>
              <td class="right muted small">{{ formatRp(row.unitBreakdown?.['Haji']?.pad) }}</td>
              <td class="right muted small">{{ formatRp(row.unitBreakdown?.['KIA']?.pad) }}</td>
              <td class="right muted small">{{ formatRp(row.unitBreakdown?.['USG']?.pad) }}</td>
              <td class="right muted small">{{ formatRp(row.unitBreakdown?.['KB']?.pad) }}</td>
              <td class="right muted small">{{ formatRp(row.unitBreakdown?.['LAB']?.pad) }}</td>
              <td class="right muted small">{{ formatRp(row.unitBreakdown?.['Poli Umum']?.pad) }}</td>
              <td class="right muted small">{{ formatRp(row.unitBreakdown?.['Gigi']?.pad) }}</td>
              <td class="right muted small">{{ formatRp(row.unitBreakdown?.['Ambulans']?.pad) }}</td>
              
              <td class="right highlight" :class="{ 'overridden': row.isOverride }">
                Rp {{ formatRp(row.jaspelPadMurni) }}
              </td>
              <td class="right text-muted small">
                Rp {{ formatRp(row.pphPadMurni) }}
              </td>
              <td class="right highlight green">
                Rp {{ formatRp(row.bersihPadMurni) }}
              </td>
              <td class="center">
                <button @click="openEdit(row)" class="action-btn edit">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/></svg>
                </button>
              </td>
            </tr>
          </tbody>
          <tfoot>
            <tr class="total-row">
              <td colspan="15">TOTAL</td>
              <td class="right">Rp {{ formatRp(totals.jaspel) }}</td>
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
          <h3>Override Jaspel 40% PAD — {{ editForm.nama }}</h3>
          <button class="modal-close" @click="closeEdit">×</button>
        </div>
        <div class="modal-body">
          <div class="form-group">
            <label>Jumlah Jaspel (Rp)</label>
            <InputCurrency v-model="editForm.jaspelPadMurni" @update:modelValue="recalc" />
          </div>
          <div class="form-group">
            <label>PPH Nominal (Rp)</label>
            <InputCurrency v-model="editForm.pphPadMurni" @update:modelValue="recalc" />
          </div>
          <div class="form-group">
            <label>Jaspel Bersih (Rp)</label>
            <InputCurrency v-model="editForm.bersihPadMurni" />
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

const { data, pending: loading, error, execute: refresh } = await useApi<any[]>(() => `/jaspel-distribusi/print-40/${selectedPeriode.value}`);

const totals = computed(() => {
    return data.value?.reduce((acc, curr) => {
        acc.jaspel += curr.jaspelPadMurni || 0;
        acc.pph += curr.pphPadMurni || 0;
        acc.bersih += curr.bersihPadMurni || 0;
        return acc;
    }, { jaspel: 0, pph: 0, bersih: 0 }) || { jaspel: 0, pph: 0, bersih: 0 };
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
    f.bersihPadMurni = (f.jaspelPadMurni || 0) - (f.pphPadMurni || 0);
};

const resetToAuto = async () => {
    if(!confirm('Reset override untuk pegawai ini?')) return;
    try {
        await $fetch(`${config.public.apiBase}/jaspel-distribusi/${selectedPeriode.value}`, {
            method: 'PUT',
            body: {
                pegawaiId: editForm.value.id,
                print40PadJumlah: null,
                print40PadPphNominal: null,
                print40PadBersih: null
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
                print40PadJumlah: editForm.value.jaspelPadMurni,
                print40PadPphNominal: editForm.value.pphPadMurni,
                print40PadBersih: editForm.value.bersihPadMurni
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
/* Reuse common styles */
.report-table { width: 100%; border-collapse: collapse; }
.report-table th, .report-table td { border: 1px solid var(--border); padding: 12px; font-size: 13px; }
.report-table th { background: var(--bg-level2); font-weight: 700; text-transform: uppercase; font-size: 11px; }

.highlight { color: #16a34a; font-weight: 700; }
.overridden { color: #f59e0b; }

/* Modal Styles Handled by global main.css */
</style>
