<template>
  <div class="page">
    <div class="section-header">
      <h1>TCM (Lain - lain)</h1>
      <p>Input Distribusi Jaspel TCM — {{ selectedPeriode }}</p>
      <div class="header-actions">
        <button @click="openCreate" class="btn primary">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" class="icon-sm"><path d="M12 5v14M5 12h14"/></svg>
          Tambah Karyawan
        </button>
      </div>
    </div>

    <!-- BUDGET SUMMARY -->
    <div class="card summary-card" style="margin-bottom:20px; padding: 20px;">
        <div style="display:flex; justify-content: space-between; align-items: center;">
            <div>
                <div style="font-size: 12px; color: var(--text-muted); text-transform: uppercase; font-weight: 700;">Total Dana Tersedia (Jaspel 60%)</div>
                <div style="font-size: 24px; font-weight: 800; color: var(--accent-blue);">Rp {{ formatRp(totalBudget) }}</div>
            </div>
            <div style="text-align: right;">
                <div style="font-size: 12px; color: var(--text-muted); text-transform: uppercase; font-weight: 700;">Pagu Petugas</div>
                <div style="font-size: 18px; font-weight: 700; color: var(--text-dark);">100%</div>
            </div>
        </div>
    </div>

    <!-- TABLE -->
    <div class="card">
      <div class="card-body" style="padding:0">
        <div style="overflow-x:auto">
          <table class="modern-table">
            <thead>
              <tr>
                <th style="width: 50px">No</th>
                <th>Nama Karyawan</th>
                <th class="right" style="width: 200px">Persentase Pembagian (%)</th>
                <th class="right" style="width: 200px">Total (Rp)</th>
                <th class="center" style="width: 120px">Aksi</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(row, idx) in items" :key="row.id">
                <td class="center">{{ idx + 1 }}</td>
                <td><strong>{{ row.namaKaryawan }}</strong></td>
                <td class="right">{{ row.persentase }}%</td>
                <td class="right mono">Rp {{ formatRp((row.persentase / 100) * totalBudget) }}</td>
                <td class="center">
                  <div class="action-group">
                    <button @click="openEdit(row)" class="action-btn edit" title="Edit">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                    </button>
                    <button @click="deleteItem(row.id)" class="action-btn delete" title="Hapus">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
                    </button>
                  </div>
                </td>
              </tr>
              <tr v-if="items.length === 0">
                <td colspan="5" style="text-align:center;padding:40px;color:var(--text-muted)">
                    Belum ada data karyawan. Klik "Tambah Karyawan" untuk memulai.
                </td>
              </tr>
            </tbody>
            <tfoot v-if="items.length > 0">
                <tr style="background: var(--bg-level2); font-weight: 700;">
                    <td colspan="2" class="right">TOTAL</td>
                    <td class="right" :class="{ 'text-danger': totalPersen > 100 }">{{ totalPersen }}%</td>
                    <td class="right">Rp {{ formatRp((totalPersen / 100) * totalBudget) }}</td>
                    <td></td>
                </tr>
            </tfoot>
          </table>
        </div>
      </div>
    </div>

    <!-- Modal -->
    <div v-if="isModalOpen" class="modal-overlay" @click.self="closeModal">
      <div class="modal-card">
        <div class="modal-header">
          <h3>{{ isEdit ? 'Edit Karyawan TCM' : 'Tambah Karyawan TCM' }}</h3>
          <button class="modal-close" @click="closeModal">×</button>
        </div>
        <div class="modal-body">
          <div class="form-group">
            <label>Cari & Pilih Karyawan</label>
            <div class="searchable-select">
              <input 
                v-model="employeeSearch" 
                type="text" 
                class="form-input" 
                placeholder="Ketik nama karyawan..."
                @focus="showEmployeeDropdown = true"
              />
              <div v-if="showEmployeeDropdown && filteredEmployees.length > 0" class="select-dropdown">
                <div 
                  v-for="p in filteredEmployees" 
                  :key="p.id" 
                  class="select-item"
                  @click="selectEmployee(p)"
                >
                  <div class="item-name">{{ p.nama }}</div>
                  <div class="item-meta">{{ p.nip || '-' }} | {{ p.jenisKetenagaan }}</div>
                </div>
              </div>
            </div>
            <div v-if="form.pegawaiId" class="selected-badge">
              Terpilih: <strong>{{ selectedPegawaiName }}</strong>
              <button class="btn-remove" @click="form.pegawaiId = ''">×</button>
            </div>
          </div>
          <div class="form-group">
            <label>Persentase Pembagian (%)</label>
            <input v-model.number="form.persentase" type="number" class="form-input" placeholder="0" min="0" max="100" />
            <small v-if="totalPersenExcludingCurrent + form.persentase > 100" style="color: #ef4444">
                Peringatan: Total persentase akan melebihi 100% ({{ totalPersenExcludingCurrent + form.persentase }}%)
            </small>
          </div>
        </div>
        <div class="modal-footer">
          <button class="btn secondary" @click="closeModal">Batal</button>
          <button class="btn primary" @click="saveItem" :disabled="saving || !form.pegawaiId">
            {{ saving ? 'Menyimpan...' : 'Simpan Data' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue';
import { useJaspelStore } from '~/stores/jaspelStore';

definePageMeta({ layout: "main" });

const store = useJaspelStore();
const { selectedPeriode } = store;
const config = useRuntimeConfig();

const items = ref<any[]>([]);
const allEmployees = ref<any[]>([]);
const totalBudget = ref(0);
const loading = ref(false);

const loadData = async () => {
    loading.value = true;
    try {
        // 1. Fetch TCM staff
        const staff: any = await $fetch(`${config.public.apiBase}/tcm-staff/${selectedPeriode.value}`);
        items.value = staff;

        // 2. Fetch budget from keuangan-detail
        const keuangan: any[] = await $fetch(`${config.public.apiBase}/keuangan-detail/${selectedPeriode.value}`);
        const tcmEntry = keuangan.find(i => i.jenisPendapatan === 'Lain - lain' && i.namaLayanan?.toLowerCase().includes('tcm'));
        totalBudget.value = tcmEntry ? tcmEntry.jaspel60 : 0;
    } catch (e) {
        console.error(e);
    } finally {
        loading.value = false;
    }
};

const loadEmployees = async () => {
    try {
        const data: any = await $fetch(`${config.public.apiBase}/pegawai`);
        allEmployees.value = data;
    } catch (e) {
        console.error('Gagal memuat data pegawai');
    }
};

onMounted(() => {
    loadEmployees();
});

watch(selectedPeriode, loadData, { immediate: true });

const totalPersen = computed(() => items.value.reduce((sum, i) => sum + (i.persentase || 0), 0));

// Searchable Select State
const employeeSearch = ref('');
const showEmployeeDropdown = ref(false);
const filteredEmployees = computed(() => {
    if (!employeeSearch.value) return allEmployees.value.slice(0, 10);
    const s = employeeSearch.value.toLowerCase();
    return allEmployees.value.filter(p => 
        p.nama?.toLowerCase().includes(s) || p.nip?.toLowerCase().includes(s)
    ).slice(0, 10);
});

const selectedPegawaiName = computed(() => {
    if (!form.value.pegawaiId) return '';
    return allEmployees.value.find(p => p.id === form.value.pegawaiId)?.nama || '';
});

const selectEmployee = (p: any) => {
    form.value.pegawaiId = p.id;
    employeeSearch.value = '';
    showEmployeeDropdown.value = false;
};

// Close dropdown on click outside
if (process.client) {
    window.addEventListener('click', (e) => {
        const target = e.target as HTMLElement;
        if (!target.closest('.searchable-select')) {
            showEmployeeDropdown.value = false;
        }
    });
}

// Modal
const isModalOpen = ref(false);
const isEdit = ref(false);
const saving = ref(false);
const form = ref<any>({
    pegawaiId: '',
    persentase: 0
});

const totalPersenExcludingCurrent = computed(() => {
    if (!isEdit.value) return totalPersen.value;
    return items.value.filter(i => i.id !== form.value.id).reduce((sum, i) => sum + (i.persentase || 0), 0);
});

const openCreate = () => {
    isEdit.value = false;
    form.value = { pegawaiId: '', persentase: 0 };
    employeeSearch.value = '';
    isModalOpen.value = true;
};

const openEdit = (row: any) => {
    isEdit.value = true;
    form.value = { ...row };
    employeeSearch.value = '';
    isModalOpen.value = true;
};

const closeModal = () => { isModalOpen.value = false; };

const saveItem = async () => {
    if (!form.value.pegawaiId) return alert('Pilih karyawan terlebih dahulu');
    
    saving.value = true;
    try {
        const url = isEdit.value 
            ? `${config.public.apiBase}/tcm-staff/${form.value.id}`
            : `${config.public.apiBase}/tcm-staff`;
        
        await $fetch(url, {
            method: isEdit.value ? 'PUT' : 'POST',
            body: { ...form.value, periode: selectedPeriode.value }
        });
        
        await loadData();
        closeModal();
    } catch (e) {
        alert('Gagal menyimpan data');
    } finally {
        saving.value = false;
    }
};

const deleteItem = async (id: string) => {
    if (!confirm('Hapus karyawan ini?')) return;
    try {
        await $fetch(`${config.public.apiBase}/tcm-staff/${id}`, { method: 'DELETE' });
        await loadData();
    } catch (e) {
        alert('Gagal menghapus data');
    }
};

const formatRp = (num: number | undefined) => {
  if (num === undefined || isNaN(num)) return '0';
  return new Intl.NumberFormat('id-ID').format(Math.round(num));
}
</script>

<style scoped>
.section-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 24px; }
.header-actions { display: flex; gap: 10px; }
.modern-table { width: 100%; border-collapse: collapse; }
.modern-table th, .modern-table td { padding: 12px 16px; border-bottom: 1px solid var(--border); font-size: 14px; }
.modern-table th { background: var(--bg-level2); font-weight: 600; text-align: left; font-size: 11px; text-transform: uppercase; letter-spacing: 0.5px; }
.right { text-align: right; }
.center { text-align: center; }
.mono { font-family: 'JetBrains Mono', monospace; }
.text-danger { color: #ef4444; }

.summary-card {
    background: linear-gradient(135deg, #ffffff 0%, #eff6ff 100%);
    border-left: 5px solid var(--accent-blue);
}

/* Searchable Select */
.searchable-select { position: relative; }
.select-dropdown {
    position: absolute;
    top: 100%;
    left: 0;
    right: 0;
    background: white;
    border: 1px solid var(--border);
    border-radius: 8px;
    box-shadow: 0 10px 15px -3px rgba(0,0,0,0.1);
    z-index: 100;
    max-height: 200px;
    overflow-y: auto;
    margin-top: 4px;
}
.select-item {
    padding: 10px 14px;
    cursor: pointer;
    border-bottom: 1px solid var(--bg-level1);
}
.select-item:hover { background: var(--bg-level1); }
.select-item .item-name { font-weight: 600; font-size: 14px; color: var(--text-dark); }
.select-item .item-meta { font-size: 11px; color: var(--text-muted); }

.selected-badge {
    margin-top: 10px;
    padding: 8px 12px;
    background: #eff6ff;
    border: 1px solid #bfdbfe;
    border-radius: 6px;
    font-size: 13px;
    display: flex;
    justify-content: space-between;
    align-items: center;
}
.btn-remove {
    background: none;
    border: none;
    color: #ef4444;
    font-size: 18px;
    cursor: pointer;
    padding: 0 4px;
}
</style>

