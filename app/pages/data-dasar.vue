<template>
  <div class="page">
    <div class="section-header">
      <h1>Data Dasar & Kepegawaian</h1>
      <p>UPTD Puskesmas Majalengka — Master data pegawai</p>
    </div>
    
    <div v-if="error" class="alert error" style="margin-bottom: 20px;">
      Gagal mengambil data dari server. Pastikan backend lokal berjalan.
    </div>

    <div class="card" v-else>
      <div class="table-toolbar">
        <div class="search-box">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
          <input type="text" v-model="searchQuery" placeholder="Cari nama, NIP...">
        </div>
        <div class="filter-btn">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/></svg> Filter
        </div>
        <button class="export-btn" @click="openCreateModal" style="background:var(--accent-teal)">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg> Tambah Pegawai
        </button>
      </div>
      
      <div v-if="pending" style="padding: 40px; text-align: center; color: var(--text-muted)">
        Memuat data pegawai...
      </div>
      
      <div class="table-scroll" v-else>
        <table id="tbl-dasar">
          <thead>
            <tr>
              <th>No</th>
              <th>Nama Petugas</th>
              <th>Nomor Rekening</th>
              <th>Nama Bank</th>
              <th>NPWP</th>
              <th>NIP</th>
              <th>Golongan</th>
              <th>Jabatan</th>
              <th>Jenis Ketenagaan</th>
              <th>Penanggung Jawab</th>
              <th>Aksi</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(item, idx) in filteredData" :key="item.id">
              <td>{{ idx + 1 }}</td>
              <td style="white-space:nowrap"><strong>{{ item.nama }}</strong></td>
              <td class="muted" style="font-family:monospace">{{ item.nomorRekening || '-' }}</td>
              <td>{{ item.namaBank || '-' }}</td>
              <td class="muted" style="font-family:monospace">{{ item.npwp || '-' }}</td>
              <td class="muted" style="font-family:monospace;font-size:11.5px">{{ item.nip || '-' }}</td>
              <td><span class="badge blue">{{ item.golongan }}</span></td>
              <td>{{ item.jabatan || '-' }}</td>
              <td><span class="badge purple">{{ item.jenisKetenagaan }}</span></td>
              <td>{{ item.penanggungJawab || '-' }}</td>
              <td>
                <div style="display:flex;gap:6px">
                  <button @click="openEditModal(item)" class="action-btn edit" title="Edit">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/></svg>
                  </button>
                  <button @click="handleDelete(item)" class="action-btn delete" title="Hapus">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
                  </button>
                </div>
              </td>
            </tr>
            <tr v-if="filteredData.length === 0">
              <td colspan="11" style="text-align:center;padding:20px;color:var(--text-muted)">Tidak ada data ditemukan</td>
            </tr>
          </tbody>
        </table>
      </div>
      
      <div class="pagination" v-if="!pending && filteredData.length > 0">
        <div class="pagination-info">Menampilkan {{ filteredData.length }} pegawai terdaftar</div>
      </div>
    </div>
    
    <PegawaiModal 
      v-model:is-open="isModalOpen" 
      :mode="modalMode" 
      :pegawai-data="selectedPegawai"
      @saved="refreshData"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useApi } from '../composables/useApi';
import PegawaiModal from '../components/PegawaiModal.vue';

definePageMeta({ layout: 'main' })

const config = useRuntimeConfig()
const searchQuery = ref('')

const isModalOpen = ref(false)
const modalMode = ref('create')
const selectedPegawai = ref<Record<string, any>>({})

const { data: pegawaiData, pending, error, execute: fetchPegawai } = await useApi<any[]>('/pegawai')

const filteredData = computed(() => {
  const q = searchQuery.value.toLowerCase()
  if (!pegawaiData.value) return [];
  if (!q) return pegawaiData.value
  return pegawaiData.value.filter(item => 
    item.nama.toLowerCase().includes(q) || 
    item.nip?.includes(q) ||
    item.jabatan?.toLowerCase().includes(q)
  )
})

const openCreateModal = () => {
  modalMode.value = 'create'
  selectedPegawai.value = {}
  isModalOpen.value = true
}

const openEditModal = (item: any) => {
  modalMode.value = 'edit'
  selectedPegawai.value = item
  isModalOpen.value = true
}

const handleDelete = async (item: any) => {
  if (confirm(`Apakah Anda yakin ingin menghapus data ${item.nama}? Data akan dihapus dari semua lembar/halaman.`)) {
    try {
      await $fetch(`${config.public.apiBase}/pegawai/${item.id}`, {
        method: 'DELETE'
      })
      refreshData()
    } catch (err) {
      alert("Gagal menghapus data pegawai")
    }
  }
}

const refreshData = () => {
  fetchPegawai()
}
</script>

<style scoped>
.action-btn {
  width: 28px; height: 28px;
  border-radius: 6px;
  border: 1px solid var(--border);
  background: #fff;
  display: flex; align-items: center; justify-content: center;
  cursor: pointer;
  transition: all .2s;
  color: var(--text-muted);
}
.action-btn:hover.edit { border-color: var(--accent-blue); color: var(--accent-blue); }
.action-btn:hover.delete { border-color: var(--accent-red); color: var(--accent-red); }
.action-btn svg { width: 14px; height: 14px; }

#tbl-dasar th {
  white-space: nowrap;
}
</style>
