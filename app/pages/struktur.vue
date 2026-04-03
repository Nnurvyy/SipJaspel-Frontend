<template>
  <div class="page">
    <div class="section-header">
      <h1>Struktur Organisasi</h1>
      <p>UPTD Puskesmas Majalengka — Manajemen Jabatan &amp; Pejabat</p>
    </div>

    <div class="card">
      <div class="table-toolbar">
        <div class="search-box">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
          <input type="text" v-model="searchQuery" placeholder="Cari jabatan atau nama...">
        </div>
        <button class="export-btn" @click="openCreate" style="background:var(--accent-teal)">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
          Tambah Jabatan
        </button>
      </div>

      <div v-if="pending" style="padding: 40px; text-align: center; color: var(--text-muted)">Memuat data struktur...</div>
      <div v-else-if="error" class="alert error" style="margin:20px">Gagal memuat data.</div>
      <div class="table-scroll" v-else>
        <table id="tbl-struktur">
          <thead>
            <tr>
              <th>No</th>
              <th>Jabatan</th>
              <th>Nama Pejabat</th>
              <th>Aksi</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(item, idx) in filteredList" :key="item.id">
              <td>{{ idx + 1 }}</td>
              <td><strong>{{ item.jabatan }}</strong></td>
              <td style="color:var(--accent-blue)">{{ item.namaPejabatResolved }}</td>
              <td>
                <div style="display:flex;gap:6px">
                  <button @click="openEdit(item)" class="action-btn edit" title="Edit">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/></svg>
                  </button>
                  <button @click="handleDelete(item)" class="action-btn delete" title="Hapus">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
                  </button>
                </div>
              </td>
            </tr>
            <tr v-if="filteredList.length === 0">
              <td colspan="4" style="text-align:center;padding:20px;color:var(--text-muted)">Belum ada data jabatan. Klik "Tambah Jabatan" untuk memulai.</td>
            </tr>
          </tbody>
        </table>
      </div>
      <div class="pagination" v-if="!pending && filteredList.length > 0">
        <div class="pagination-info">{{ filteredList.length }} jabatan terdaftar</div>
      </div>
    </div>

    <!-- Modal -->
    <div v-if="isModalOpen" class="modal-overlay" @click.self="closeModal">
      <div class="modal-card">
        <div class="modal-header">
          <h3>{{ isEdit ? 'Edit Jabatan' : 'Tambah Jabatan Baru' }}</h3>
          <button class="modal-close" @click="closeModal">×</button>
        </div>
        <div class="modal-body">
          <div class="form-group">
            <label>Nama Jabatan *</label>
            <input v-model="form.jabatan" type="text" placeholder="contoh: Kepala Puskesmas" class="form-input" required />
          </div>
          <div class="form-group">
            <label>Nama Pejabat</label>
            <div class="search-dropdown-wrap">
              <input
                v-model="pegawaiSearch"
                type="text"
                placeholder="Ketik nama petugas untuk mencari..."
                class="form-input"
                @input="onPegawaiSearch"
                @focus="showDropdown = true"
              />
              <div v-if="showDropdown && filteredPegawai.length > 0" class="dropdown-list">
                <div
                  v-for="p in filteredPegawai"
                  :key="p.id"
                  class="dropdown-item"
                  @mousedown.prevent="selectPegawai(p)"
                >
                  <strong>{{ p.nama }}</strong>
                  <span style="font-size:11px;color:var(--text-muted);margin-left:8px">{{ p.jabatan || p.jenisKetenagaan }}</span>
                </div>
              </div>
              <div v-if="showDropdown && pegawaiSearch.length >= 2 && filteredPegawai.length === 0" class="dropdown-list">
                <div class="dropdown-item" style="color:var(--text-muted)">Tidak ditemukan</div>
              </div>
            </div>
            <div v-if="form.pegawaiId" class="selected-chip">
              <span>{{ pegawaiSearch }}</span>
              <button @click="clearPegawai" style="background:none;border:none;cursor:pointer;color:var(--accent-red);font-size:16px;line-height:1">×</button>
            </div>
          </div>
          <div class="form-group">
            <label>Urutan Tampil</label>
            <input v-model.number="form.urutan" type="number" class="form-input" placeholder="0" />
          </div>
        </div>
        <div class="modal-footer">
          <button class="btn secondary" @click="closeModal">Batal</button>
          <button class="btn primary" @click="handleSave" :disabled="saving">
            {{ saving ? 'Menyimpan...' : (isEdit ? 'Update' : 'Simpan') }}
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
const isModalOpen = ref(false)
const isEdit = ref(false)
const saving = ref(false)
const pegawaiSearch = ref('')
const showDropdown = ref(false)

const form = ref({ id: '', jabatan: '', pegawaiId: '', namaPejabat: '', urutan: 0 })

const { data: strukturData, pending, error, execute: refresh } = await useApi<any[]>('/struktur')
const { data: allPegawai } = await useApi<any[]>('/pegawai')

const filteredList = computed(() => {
  const q = searchQuery.value.toLowerCase()
  if (!strukturData.value) return []
  if (!q) return strukturData.value
  return strukturData.value.filter((item: any) =>
    item.jabatan?.toLowerCase().includes(q) ||
    item.namaPejabatResolved?.toLowerCase().includes(q)
  )
})

const filteredPegawai = computed(() => {
  if (!allPegawai.value || pegawaiSearch.value.length < 2) return []
  const q = pegawaiSearch.value.toLowerCase()
  return allPegawai.value.filter((p: any) => p.nama.toLowerCase().includes(q)).slice(0, 8)
})

const onPegawaiSearch = () => { showDropdown.value = true }

const selectPegawai = (p: any) => {
  form.value.pegawaiId = p.id
  form.value.namaPejabat = p.nama
  pegawaiSearch.value = p.nama
  showDropdown.value = false
}

const clearPegawai = () => {
  form.value.pegawaiId = ''
  form.value.namaPejabat = ''
  pegawaiSearch.value = ''
}

const openCreate = () => {
  isEdit.value = false
  form.value = { id: '', jabatan: '', pegawaiId: '', namaPejabat: '', urutan: 0 }
  pegawaiSearch.value = ''
  showDropdown.value = false
  isModalOpen.value = true
}

const openEdit = (item: any) => {
  isEdit.value = true
  form.value = { id: item.id, jabatan: item.jabatan, pegawaiId: item.pegawaiId || '', namaPejabat: item.namaPejabat || '', urutan: item.urutan || 0 }
  pegawaiSearch.value = item.namaPejabatResolved || ''
  showDropdown.value = false
  isModalOpen.value = true
}

const closeModal = () => { isModalOpen.value = false; showDropdown.value = false }

const handleSave = async () => {
  if (!form.value.jabatan.trim()) return alert('Nama jabatan wajib diisi')
  saving.value = true
  try {
    const payload = {
      jabatan: form.value.jabatan,
      pegawaiId: form.value.pegawaiId || null,
      namaPejabat: form.value.namaPejabat || null,
      urutan: form.value.urutan,
    }
    if (isEdit.value) {
      await $fetch(`${config.public.apiBase}/struktur/${form.value.id}`, { method: 'PUT', body: payload })
    } else {
      await $fetch(`${config.public.apiBase}/struktur`, { method: 'POST', body: payload })
    }
    await refresh()
    closeModal()
  } catch (e) {
    alert('Gagal menyimpan data')
  } finally {
    saving.value = false
  }
}

const handleDelete = async (item: any) => {
  if (!confirm(`Hapus jabatan "${item.jabatan}"?`)) return
  try {
    await $fetch(`${config.public.apiBase}/struktur/${item.id}`, { method: 'DELETE' })
    await refresh()
  } catch (e) {
    alert('Gagal menghapus data')
  }
}
</script>

<style scoped>
.action-btn {
  width: 28px; height: 28px; border-radius: 6px; border: 1px solid var(--border);
  background: #fff; display: flex; align-items: center; justify-content: center;
  cursor: pointer; transition: all .2s; color: var(--text-muted);
}
.action-btn:hover.edit { border-color: var(--accent-blue); color: var(--accent-blue); }
.action-btn:hover.delete { border-color: #ef4444; color: #ef4444; }
.action-btn svg { width: 14px; height: 14px; }

.modal-overlay {
  position: fixed; inset: 0; background: rgba(0,0,0,0.5); z-index: 1000;
  display: flex; align-items: center; justify-content: center;
}
.modal-card {
  background: var(--bg); border-radius: 16px; width: 500px; max-width: 95vw;
  box-shadow: 0 20px 60px rgba(0,0,0,0.3); overflow: hidden;
}
.modal-header {
  padding: 20px 24px; border-bottom: 1px solid var(--border);
  display: flex; align-items: center; justify-content: space-between;
}
.modal-header h3 { margin: 0; font-size: 16px; font-weight: 700; }
.modal-close { background: none; border: none; font-size: 24px; cursor: pointer; color: var(--text-muted); line-height: 1; }
.modal-body { padding: 24px; display: flex; flex-direction: column; gap: 16px; }
.modal-footer { padding: 16px 24px; border-top: 1px solid var(--border); display: flex; gap: 10px; justify-content: flex-end; }
.form-group { display: flex; flex-direction: column; gap: 6px; }
.form-group label { font-size: 13px; font-weight: 600; color: var(--text-secondary); }
.form-input { padding: 10px 12px; border: 1px solid var(--border); border-radius: 8px; background: var(--bg-level2); color: var(--text); font-size: 14px; outline: none; width: 100%; box-sizing: border-box; }
.form-input:focus { border-color: var(--accent-blue); box-shadow: 0 0 0 3px rgba(59,130,246,.1); }
.btn { padding: 10px 20px; border-radius: 8px; font-size: 14px; font-weight: 600; cursor: pointer; border: none; transition: all .2s; }
.btn.primary { background: var(--accent-blue); color: white; }
.btn.secondary { background: var(--bg-level2); color: var(--text); border: 1px solid var(--border); }
.search-dropdown-wrap { position: relative; }
.dropdown-list { position: absolute; top: 100%; left: 0; right: 0; background: white; border: 1px solid var(--border); border-radius: 8px; box-shadow: 0 8px 24px rgba(0,0,0,0.12); z-index: 100; max-height: 200px; overflow-y: auto; margin-top: 4px; }
.dropdown-item { padding: 10px 14px; cursor: pointer; font-size: 13px; border-bottom: 1px solid var(--border); }
.dropdown-item:last-child { border-bottom: none; }
.dropdown-item:hover { background: var(--bg-level2); }
.selected-chip { margin-top: 6px; display: inline-flex; align-items: center; gap: 6px; background: #eff6ff; border: 1px solid #bfdbfe; border-radius: 20px; padding: 4px 12px; font-size: 13px; color: var(--accent-blue); }
</style>
