<template>
  <div class="page">
    <div class="section-header">
      <h1>Print Jaspel Lain-lain</h1>
      <p>Distribusi Jaspel dari kategori Lain-lain (TCM) — {{ selectedPeriode }}</p>
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
              <th class="right">TCM</th>
              <th class="right">Jumlah</th>
              <th class="right">PPh (Rp)</th>
              <th class="right">Bersih</th>
              <th class="center">Aksi</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(row, idx) in data" :key="row.id">
              <td>{{ idx + 1 }}</td>
              <td><strong>{{ row.nama }}</strong></td>
              <td>{{ row.golongan }}</td>
              <td class="right text-muted small">Rp {{ formatRp(row.tcm) }}</td>
              <td class="right highlight" :class="{ 'overridden': row.isOverride }">
                Rp {{ formatRp(row.jumlah) }}
              </td>
              <td class="right text-muted small">
                Rp {{ formatRp(row.pphNominal) }}
              </td>
              <td class="right highlight green">
                Rp {{ formatRp(row.bersih) }}
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
              <td colspan="3">TOTAL</td>
              <td class="right">Rp {{ formatRp(totals.tcm) }}</td>
              <td class="right">Rp {{ formatRp(totals.jumlah) }}</td>
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
          <h3>Override Jaspel Lain-lain — {{ editForm.nama }}</h3>
          <button class="modal-close" @click="closeEdit">×</button>
        </div>
        <div class="modal-body">
          <div class="form-group">
            <label>Jumlah Jaspel (Rp)</label>
            <InputCurrency v-model="editForm.jumlah" @update:modelValue="recalc" />
          </div>
          <div class="form-group">
            <label>PPH Nominal (Rp)</label>
            <InputCurrency v-model="editForm.pphNominal" @update:modelValue="recalc" />
          </div>
          <div class="form-group">
            <label>Jaspel Bersih (Rp)</label>
            <InputCurrency v-model="editForm.bersih" />
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

const { data, pending: loading, error, execute: refresh } = await useApi<any[]>(() => `/jaspel-distribusi/print-lain/${selectedPeriode.value}`);

const totals = computed(() => {
    return data.value?.reduce((acc, curr) => {
        acc.tcm += curr.tcm || 0;
        acc.jumlah += curr.jumlah || 0;
        acc.pph += curr.pphNominal || 0;
        acc.bersih += curr.bersih || 0;
        return acc;
    }, { tcm: 0, jumlah: 0, pph: 0, bersih: 0 }) || { tcm: 0, jumlah: 0, pph: 0, bersih: 0 };
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
    f.bersih = (f.jumlah || 0) - (f.pphNominal || 0);
};

const resetToAuto = async () => {
    if(!confirm('Reset override untuk pegawai ini?')) return;
    try {
        await $fetch(`${config.public.apiBase}/jaspel-distribusi/${selectedPeriode.value}`, {
            method: 'PUT',
            body: {
                pegawaiId: editForm.value.id,
                print40LainJumlah: null,
                print40LainPphNominal: null,
                print40LainBersih: null
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
                print40LainJumlah: editForm.value.jumlah,
                print40LainPphNominal: editForm.value.pphNominal,
                print40LainBersih: editForm.value.bersih
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

.highlight { color: #16a34a; font-weight: 700; }
.overridden { color: #f59e0b; }

.table-scroll { max-height: calc(100vh - 200px); overflow: auto; position: relative; }
.report-table th { position: sticky; top: 0; z-index: 10; background: var(--bg-level2, #f8fafc); box-shadow: 0 1px 0 var(--border); }
.report-table td:nth-child(1), .report-table th:nth-child(1) { position: sticky; left: 0; z-index: 5; background: var(--bg-level1, #fff); width: 40px; min-width: 40px; max-width: 40px; box-shadow: 1px 0 0 var(--border); }
.report-table td:nth-child(2), .report-table th:nth-child(2) { position: sticky; left: 40px; z-index: 5; background: var(--bg-level1, #fff); width: 220px; min-width: 220px; max-width: 220px; box-shadow: 1px 0 0 var(--border); white-space: normal; }
.report-table thead th:nth-child(1), .report-table thead th:nth-child(2) { z-index: 15; background: var(--bg-level2, #f8fafc); }
.report-table tfoot td, .report-table .total-row td { position: sticky; bottom: 0; z-index: 10; background: #f8fafc; box-shadow: 0 -1px 0 var(--border); }
.report-table tfoot td:nth-child(1), .report-table tfoot td:nth-child(2), .report-table .total-row td:nth-child(1), .report-table .total-row td:nth-child(2) { z-index: 12; background: #f8fafc; }
</style>
