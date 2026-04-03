<template>
  <Teleport defer to="body">
    <div v-if="isOpen" class="modal-overlay" @click.self="close">
      <div class="modal-content">
        <div class="modal-header">
          <h2>{{ mode === 'create' ? 'Tambah Pegawai Baru' : 'Edit Pegawai' }}</h2>
          <button class="close-btn" @click="close">&times;</button>
        </div>
        
        <form @submit.prevent="submitForm">
          <div class="modal-body">
            <div class="form-grid">
              <div class="form-group">
                <label>Nama Petugas <span class="req">*</span></label>
                <input v-model="formData.nama" type="text" required placeholder="Nama lengkap dengan gelar" />
              </div>
              <div class="form-group">
                <label>NIP</label>
                <input v-model="formData.nip" type="text" placeholder="Kosongkan jika bukan PNS" />
              </div>
              
              <div class="form-group">
                <label>Nomor Rekening</label>
                <input v-model="formData.nomorRekening" type="text" />
              </div>
              <div class="form-group">
                <label>Nama Bank</label>
                <input v-model="formData.namaBank" type="text" placeholder="BJB" />
              </div>
              
              <div class="form-group">
                <label>NPWP</label>
                <input v-model="formData.npwp" type="text" />
              </div>
              <div class="form-group">
                <label>Jabatan</label>
                <input v-model="formData.jabatan" type="text" />
              </div>
              
              <div class="form-group">
                <label>Golongan <span class="req">*</span></label>
                <input v-model="formData.golongan" type="text" required placeholder="Contoh: III/A, Non-PNS" />
              </div>
              <div class="form-group">
                <label>Pangkat / Golongan</label>
                <input v-model="formData.pangkatGolongan" type="text" />
              </div>
              
              <div class="form-group">
                <label>Jenis Ketenagaan <span class="req">*</span></label>
                <input v-model="formData.jenisKetenagaan" type="text" required />
              </div>
              <div class="form-group">
                <label>Penanggung Jawab</label>
                <input v-model="formData.penanggungJawab" type="text" />
              </div>
              
              <div class="form-group">
                <label>TMT (Terhitung Mulai Tanggal)</label>
                <input v-model="formData.tmt" type="text" placeholder="Bulan-Tahun" />
              </div>
              <div class="form-group">
                <label>Lama Masa Kerja (Bulan)</label>
                <input v-model.number="formData.lamaMasaKerja" type="number" />
              </div>
            </div>
          </div>
          
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" @click="close" :disabled="isLoading">Batal</button>
            <button type="submit" class="btn btn-primary" :disabled="isLoading">
              {{ isLoading ? 'Menyimpan...' : 'Simpan Data' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'

const props = defineProps({
  isOpen: Boolean,
  mode: { type: String, default: 'create' }, // 'create' | 'edit'
  pegawaiData: { type: Object, default: () => ({}) }
})

const emit = defineEmits(['update:isOpen', 'saved'])

const config = useRuntimeConfig()
const isLoading = ref(false)

const formData = ref({
  id: '',
  nama: '',
  nip: '',
  nomorRekening: '',
  namaBank: 'BJB',
  npwp: '',
  golongan: '',
  jabatan: '',
  pangkatGolongan: '',
  jenisKetenagaan: '',
  penanggungJawab: '',
  tmt: '',
  lamaMasaKerja: 0
})

watch(() => props.isOpen, (newVal) => {
  if (newVal) {
    if (props.mode === 'edit' && props.pegawaiData) {
      formData.value = { ...formData.value, ...props.pegawaiData }
    } else {
      // Reset form
      formData.value = {
        id: '', nama: '', nip: '', nomorRekening: '', namaBank: 'BJB', 
        npwp: '', golongan: '', jabatan: '', pangkatGolongan: '', 
        jenisKetenagaan: '', penanggungJawab: '', tmt: '', lamaMasaKerja: 0
      }
    }
  }
})

const close = () => {
  emit('update:isOpen', false)
}

const submitForm = async () => {
  isLoading.value = true
  try {
    const url = props.mode === 'create' 
      ? `${config.public.apiBase}/pegawai` 
      : `${config.public.apiBase}/pegawai/${formData.value.id}`
      
    const method = props.mode === 'create' ? 'POST' : 'PUT'
    
    await $fetch(url, {
      method,
      body: formData.value
    })
    
    emit('saved')
    close()
  } catch (err) {
    console.error("Gagal menyimpan pegawai", err)
    alert("Gagal menyimpan data pegawai. Periksa console.")
  } finally {
    isLoading.value = false
  }
}
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0; left: 0; right: 0; bottom: 0;
  background: rgba(15, 23, 42, 0.4);
  backdrop-filter: blur(4px);
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;
}

.modal-content {
  background: white;
  border-radius: 12px;
  width: 90%;
  max-width: 700px;
  max-height: 90vh;
  display: flex;
  flex-direction: column;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
}

.modal-header {
  padding: 20px 24px;
  border-bottom: 1px solid #e2e8f0;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.modal-header h2 {
  margin: 0;
  font-size: 18px;
  color: #0f172a;
}

.close-btn {
  background: none; border: none;
  font-size: 24px; cursor: pointer; color: #64748b;
  line-height: 1;
}

.modal-body {
  padding: 24px;
  overflow-y: auto;
}

.form-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.form-group label {
  font-size: 13px;
  font-weight: 500;
  color: #475569;
}

.req { color: #ef4444; }

.form-group input {
  padding: 10px 12px;
  border: 1px solid #cbd5e1;
  border-radius: 6px;
  font-size: 14px;
  outline: none;
  transition: .2s;
}

.form-group input:focus {
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.modal-footer {
  padding: 16px 24px;
  border-top: 1px solid #e2e8f0;
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  background: #f8fafc;
  border-radius: 0 0 12px 12px;
}

.btn {
  padding: 10px 16px;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  border: none;
  transition: .2s;
}

.btn-secondary { background: white; border: 1px solid #cbd5e1; color: #475569; }
.btn-secondary:hover:not(:disabled) { background: #f1f5f9; }
.btn-primary { background: #3b82f6; color: white; }
.btn-primary:hover:not(:disabled) { background: #2563eb; }
.btn:disabled { opacity: 0.6; cursor: not-allowed; }
</style>
