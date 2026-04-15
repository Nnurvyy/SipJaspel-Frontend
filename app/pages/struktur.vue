<template>
  <div class="page">
    <div class="section-header">
      <h1>PJ dan Koordinator</h1>
      <p>UPTD Puskesmas Majalengka — Penanggung Jawab &amp; Koordinator Program</p>
    </div>

    <div class="card">
      <div class="table-toolbar">
        <div class="search-box">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
          <input type="text" v-model="searchQuery" placeholder="Cari nama pegawai...">
        </div>
        <div class="info-chip">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
          10 poin per jabatan
        </div>
      </div>

      <div v-if="pending" style="padding: 40px; text-align: center; color: var(--text-muted)">Memuat data PJ dan Koordinator...</div>
      <div v-else-if="error" class="alert error" style="margin:20px">Gagal memuat data.</div>
      <div class="table-scroll" v-else>
        <table id="tbl-struktur">
          <thead>
            <tr class="header-row-1">
              <th rowspan="2" class="col-no">No</th>
              <th rowspan="2" class="col-nama">Nama</th>
              <th colspan="6" class="header-group">Penanggung Jawab dan Koordinator</th>
              <th rowspan="2" class="col-total">Jumlah<br>Poin</th>
              <th rowspan="2" class="col-aksi">Aksi</th>
            </tr>
            <tr class="header-row-2">
              <th class="col-jabatan">1</th>
              <th class="col-poin">Poin</th>
              <th class="col-jabatan">2</th>
              <th class="col-poin">Poin</th>
              <th class="col-jabatan">3</th>
              <th class="col-poin">Poin</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(item, idx) in filteredList" :key="item.pegawaiId">
              <td class="center">{{ idx + 1 }}</td>
              <td class="nama-cell"><strong>{{ item.nama }}</strong></td>
              <td class="jabatan-cell">{{ item.jabatan1 || '' }}</td>
              <td class="poin-cell">
                <span v-if="item.jabatan1" class="poin-badge">{{ item.poin1 }}</span>
              </td>
              <td class="jabatan-cell">{{ item.jabatan2 || '' }}</td>
              <td class="poin-cell">
                <span v-if="item.jabatan2" class="poin-badge">{{ item.poin2 }}</span>
              </td>
              <td class="jabatan-cell">{{ item.jabatan3 || '' }}</td>
              <td class="poin-cell">
                <span v-if="item.jabatan3" class="poin-badge">{{ item.poin3 }}</span>
              </td>
              <td class="poin-cell total-poin">
                <span v-if="item.jumlahPoin > 0" class="total-badge">{{ item.jumlahPoin }}</span>
                <span v-else class="zero-badge">0</span>
              </td>
              <td class="center">
                <button @click="openEdit(item)" class="action-btn edit" title="Edit Jabatan">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/></svg>
                </button>
              </td>
            </tr>
            <tr v-if="filteredList.length === 0">
              <td colspan="10" style="text-align:center;padding:30px;color:var(--text-muted)">Tidak ada data ditemukan.</td>
            </tr>
          </tbody>
          <tfoot v-if="filteredList.length > 0">
            <tr class="total-row">
              <td colspan="8" class="right" style="font-weight:700">Total Poin Seluruh Pegawai</td>
              <td class="poin-cell total-poin"><strong>{{ totalPoin }}</strong></td>
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
          <div>
            <h3>Edit Jabatan &amp; Poin</h3>
            <p class="modal-subhead">{{ editForm.nama }}</p>
          </div>
          <button class="modal-close" @click="closeEdit">×</button>
        </div>
        <div class="modal-body">
          <!-- Jabatan 1 -->
          <div class="jabatan-edit-group">
            <div class="jabatan-label">
              <span class="jabatan-num">1</span>
              <span>Jabatan / Tanggung Jawab Pertama</span>
            </div>
            <div class="jabatan-inputs">
              <div class="form-group flex-1">
                <label>Nama Jabatan</label>
                <input v-model="editForm.jabatan1" type="text" class="form-input" placeholder="Kosongkan jika tidak ada" @input="recalcPoin" />
              </div>
              <div class="form-group poin-input-group">
                <label>Poin</label>
                <input v-model.number="editForm.poin1" type="number" class="form-input" :disabled="!editForm.jabatan1" />
              </div>
            </div>
          </div>

          <!-- Jabatan 2 -->
          <div class="jabatan-edit-group">
            <div class="jabatan-label">
              <span class="jabatan-num">2</span>
              <span>Jabatan / Tanggung Jawab Kedua</span>
            </div>
            <div class="jabatan-inputs">
              <div class="form-group flex-1">
                <label>Nama Jabatan</label>
                <input v-model="editForm.jabatan2" type="text" class="form-input" placeholder="Kosongkan jika tidak ada" @input="recalcPoin" />
              </div>
              <div class="form-group poin-input-group">
                <label>Poin</label>
                <input v-model.number="editForm.poin2" type="number" class="form-input" :disabled="!editForm.jabatan2" />
              </div>
            </div>
          </div>

          <!-- Jabatan 3 -->
          <div class="jabatan-edit-group">
            <div class="jabatan-label">
              <span class="jabatan-num">3</span>
              <span>Jabatan / Tanggung Jawab Ketiga</span>
            </div>
            <div class="jabatan-inputs">
              <div class="form-group flex-1">
                <label>Nama Jabatan</label>
                <input v-model="editForm.jabatan3" type="text" class="form-input" placeholder="Kosongkan jika tidak ada" @input="recalcPoin" />
              </div>
              <div class="form-group poin-input-group">
                <label>Poin</label>
                <input v-model.number="editForm.poin3" type="number" class="form-input" :disabled="!editForm.jabatan3" />
              </div>
            </div>
          </div>

          <!-- Jumlah Poin -->
          <div class="total-poin-display">
            <span class="total-label">Jumlah Poin</span>
            <span class="total-value">{{ editForm.jumlahPoin }}</span>
          </div>
        </div>
        <div class="modal-footer">
          <button class="btn secondary" @click="closeEdit">Batal</button>
          <button class="btn primary" @click="handleSave" :disabled="saving">
            {{ saving ? 'Menyimpan...' : 'Simpan Perubahan' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useApi } from '../composables/useApi'

definePageMeta({ layout: 'main' })

const config = useRuntimeConfig()
const searchQuery = ref('')
const isEditOpen = ref(false)
const saving = ref(false)

const editForm = ref<any>({
  pegawaiId: '',
  nama: '',
  jabatan1Id: null,
  jabatan1: '',
  poin1: 0,
  jabatan2Id: null,
  jabatan2: '',
  poin2: 0,
  jabatan3Id: null,
  jabatan3: '',
  poin3: 0,
  jumlahPoin: 0,
})

const { data: strukturData, pending, error, execute: refresh } = await useApi<any[]>('/struktur')

const filteredList = computed(() => {
  const q = searchQuery.value.toLowerCase()
  if (!strukturData.value) return []
  if (!q) return strukturData.value
  return strukturData.value.filter((item: any) =>
    item.nama?.toLowerCase().includes(q) ||
    item.jabatan1?.toLowerCase().includes(q) ||
    item.jabatan2?.toLowerCase().includes(q) ||
    item.jabatan3?.toLowerCase().includes(q)
  )
})

const totalPoin = computed(() => {
  if (!filteredList.value) return 0
  return filteredList.value.reduce((sum: number, item: any) => sum + (item.jumlahPoin || 0), 0)
})

const recalcPoin = () => {
  const f = editForm.value
  f.poin1 = f.jabatan1?.trim() ? 10 : 0
  f.poin2 = f.jabatan2?.trim() ? 10 : 0
  f.poin3 = f.jabatan3?.trim() ? 10 : 0
  f.jumlahPoin = f.poin1 + f.poin2 + f.poin3
}

const openEdit = (item: any) => {
  editForm.value = {
    pegawaiId: item.pegawaiId,
    nama: item.nama,
    jabatan1Id: item.jabatan1Id,
    jabatan1: item.jabatan1 || '',
    poin1: item.poin1 || 0,
    jabatan2Id: item.jabatan2Id,
    jabatan2: item.jabatan2 || '',
    poin2: item.poin2 || 0,
    jabatan3Id: item.jabatan3Id,
    jabatan3: item.jabatan3 || '',
    poin3: item.poin3 || 0,
    jumlahPoin: item.jumlahPoin || 0,
  }
  isEditOpen.value = true
}

const closeEdit = () => { isEditOpen.value = false }

const handleSave = async () => {
  saving.value = true
  try {
    const f = editForm.value
    await $fetch(`${config.public.apiBase}/struktur/row/${f.pegawaiId}`, {
      method: 'PUT',
      body: {
        pegawaiId: f.pegawaiId,
        jabatan1Id: f.jabatan1Id,
        jabatan1: f.jabatan1 || null,
        poin1: f.poin1,
        jabatan2Id: f.jabatan2Id,
        jabatan2: f.jabatan2 || null,
        poin2: f.poin2,
        jabatan3Id: f.jabatan3Id,
        jabatan3: f.jabatan3 || null,
        poin3: f.poin3,
      }
    })
    await refresh()
    closeEdit()
  } catch (e) {
    alert('Gagal menyimpan data')
  } finally {
    saving.value = false
  }
}
</script>

<style scoped>
#tbl-struktur {
  border-collapse: collapse;
  width: 100%;
  min-width: 900px;
}

#tbl-struktur th,
#tbl-struktur td {
  border: 1px solid var(--border);
  padding: 10px 12px;
  font-size: 13px;
  vertical-align: middle;
}

#tbl-struktur thead th {
  background: #FCE4D6;
  font-weight: 700;
  text-transform: uppercase;
  font-size: 11px;
  letter-spacing: 0.4px;
  text-align: center;
}

.header-group {
  background: #FCE4D6;
  text-align: center;
  font-weight: 800;
  font-size: 12px !important;
  color: #c0392b;
  letter-spacing: 0.5px;
}

.col-no { width: 44px; }
.col-nama { width: 220px; text-align: left !important; }
.col-jabatan { width: 180px; text-align: center; }
.col-poin { width: 60px; text-align: center; }
.col-total { width: 80px; text-align: center; }
.col-aksi { width: 60px; text-align: center; }

.center { text-align: center; }
.right { text-align: right; }
.nama-cell { text-align: left; white-space: nowrap; }
.jabatan-cell { text-align: center; font-size: 12px; color: var(--text); }
.poin-cell { text-align: center; }
.total-poin { background: #f0f4ff; }

.poin-badge {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 32px;
  height: 26px;
  background: #e0f2fe;
  color: #0369a1;
  border-radius: 6px;
  font-weight: 700;
  font-size: 13px;
  padding: 0 8px;
}

.total-badge {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 36px;
  height: 28px;
  background: #dbeafe;
  color: #1d4ed8;
  border-radius: 8px;
  font-weight: 800;
  font-size: 14px;
  padding: 0 10px;
  box-shadow: 0 1px 4px rgba(29,78,216,0.1);
}

.zero-badge {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 32px;
  height: 26px;
  background: var(--bg-level2);
  color: var(--text-muted);
  border-radius: 6px;
  font-size: 13px;
  padding: 0 8px;
}

tfoot .total-row td {
  background: #FFF2CC;
  font-weight: 700;
  font-size: 13px;
  border-top: 2px solid #f39c12;
}

.info-chip {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 6px 14px;
  background: #eff6ff;
  border: 1px solid #bfdbfe;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 600;
  color: #1d4ed8;
}
.info-chip svg { width: 14px; height: 14px; }

/* Action Button */
.action-btn {
  width: 30px; height: 30px; border-radius: 6px;
  border: 1px solid var(--border);
  background: #fff; display: flex; align-items: center; justify-content: center;
  cursor: pointer; transition: all .2s; color: var(--text-muted);
}
.action-btn:hover.edit { border-color: var(--accent-blue); color: var(--accent-blue); background: #eff6ff; }
.action-btn svg { width: 14px; height: 14px; }

/* Modal */
.modal-overlay {
  position: fixed; inset: 0; background: rgba(0,0,0,0.5); z-index: 1000;
  display: flex; align-items: center; justify-content: center;
}
.modal-card {
  background: var(--bg); border-radius: 16px; width: 580px; max-width: 96vw;
  box-shadow: 0 20px 60px rgba(0,0,0,0.3); overflow: hidden;
}
.modal-header {
  padding: 20px 24px; border-bottom: 1px solid var(--border);
  display: flex; align-items: flex-start; justify-content: space-between; gap: 12px;
}
.modal-header h3 { margin: 0; font-size: 16px; font-weight: 700; }
.modal-subhead { margin: 4px 0 0; font-size: 13px; color: var(--accent-blue); font-weight: 600; }
.modal-close { background: none; border: none; font-size: 24px; cursor: pointer; color: var(--text-muted); line-height: 1; flex-shrink: 0; }
.modal-body { padding: 20px 24px; display: flex; flex-direction: column; gap: 16px; }
.modal-footer { padding: 16px 24px; border-top: 1px solid var(--border); display: flex; gap: 10px; justify-content: flex-end; }

/* Jabatan group in modal */
.jabatan-edit-group {
  border: 1px solid var(--border);
  border-radius: 10px;
  padding: 14px;
  background: var(--bg-level2);
}
.jabatan-label {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 12px;
  font-size: 12px;
  font-weight: 700;
  color: var(--text-secondary);
  text-transform: uppercase;
  letter-spacing: 0.5px;
}
.jabatan-num {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 22px; height: 22px;
  background: var(--accent-blue);
  color: white;
  border-radius: 50%;
  font-size: 12px;
  font-weight: 800;
  flex-shrink: 0;
}
.jabatan-inputs { display: flex; gap: 12px; align-items: flex-end; }
.flex-1 { flex: 1; }
.poin-input-group { width: 80px; }
.form-group { display: flex; flex-direction: column; gap: 5px; }
.form-group label { font-size: 12px; font-weight: 600; color: var(--text-secondary); }
.form-input { padding: 8px 10px; border: 1px solid var(--border); border-radius: 8px; background: var(--bg); color: var(--text); font-size: 13px; outline: none; width: 100%; box-sizing: border-box; }
.form-input:focus { border-color: var(--accent-blue); box-shadow: 0 0 0 3px rgba(59,130,246,.1); }
.form-input:disabled { opacity: 0.45; cursor: not-allowed; }

.total-poin-display {
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: #dbeafe;
  border: 1px solid #93c5fd;
  border-radius: 10px;
  padding: 12px 18px;
}
.total-label { font-size: 13px; font-weight: 700; color: #1d4ed8; }
.total-value { font-size: 22px; font-weight: 900; color: #1d4ed8; }

.btn { padding: 10px 20px; border-radius: 8px; font-size: 14px; font-weight: 600; cursor: pointer; border: none; transition: all .2s; }
.btn.primary { background: var(--accent-blue); color: white; }
.btn.secondary { background: var(--bg-level2); color: var(--text); border: 1px solid var(--border); }
</style>
