<template>
  <div class="page">
    <div class="section-header">
      <h1>Bobot Staff Puskesmas</h1>
      <p>Master Data Bobot — Poin Jabatan Unit + Poin Risiko</p>
    </div>

    <div v-if="pending" style="padding:40px;text-align:center;color:var(--text-muted)">Memuat data...</div>
    <div v-else-if="error" class="alert error" style="margin-top:20px">Gagal mengambil data. Pastikan backend berjalan.</div>

    <div class="card" v-else>
      <!-- Info Legend -->
      <div class="legend-row">
        <div class="legend-group">
          <div class="legend-title">Poin Jabatan Unit</div>
          <div class="legend-items">
            <span class="badge blue">PJ = 3</span>
            <span class="badge purple">Koordinator = 2</span>
            <span class="badge gray">Tidak ada jabatan = 1</span>
          </div>
        </div>
        <div class="legend-group">
          <div class="legend-title">Poin Risiko</div>
          <div class="legend-items">
            <span class="badge red">Sangat Tinggi = 5</span>
            <span class="badge orange">Tinggi = 4</span>
            <span class="badge yellow">Sedang = 3</span>
            <span class="badge teal">Rendah = 2</span>
            <span class="badge green">Sangat Rendah = 1</span>
          </div>
        </div>
        <div class="legend-group">
          <div class="legend-title">Rumus Bobot</div>
          <div class="legend-formula">Bobot = Poin Jabatan Unit + Poin Risiko</div>
        </div>
      </div>

      <div class="table-scroll" style="margin-top:16px">
        <table id="tbl-bobot-staff">
          <thead>
            <tr>
              <th>No</th>
              <th>Nama</th>
              <th>Jabatan Unit</th>
              <th>Risiko</th>
              <th>Unit Kerja</th>
              <th>Status</th>
              <th style="text-align:center">Poin Jabatan</th>
              <th style="text-align:center">Poin Risiko</th>
              <th class="bobot-th">Bobot</th>
              <th>Aksi</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(item, idx) in rows" :key="item.pegawaiId">
              <td>{{ idx + 1 }}</td>
              <td style="white-space:nowrap"><strong>{{ item.nama }}</strong></td>
              <td>
                <span v-if="item.jabatanUnit" :class="jabatanBadgeClass(item.jabatanUnit)">
                  {{ item.jabatanUnit }}
                </span>
                <span v-else class="muted">—</span>
              </td>
              <td>
                <span v-if="item.risiko" :class="risikoBadgeClass(item.risiko)">
                  {{ item.risiko }}
                </span>
                <span v-else class="muted">—</span>
              </td>
              <td>{{ item.unitKerja || '—' }}</td>
              <td>{{ item.status || '—' }}</td>
              <td class="right">
                <span class="poin-chip">{{ item.poinJabatan }}</span>
              </td>
              <td class="right">
                <span class="poin-chip">{{ item.poinRisiko }}</span>
              </td>
              <td class="right bobot-cell">
                <strong>{{ item.bobot }}</strong>
              </td>
              <td>
                <button class="action-btn edit" title="Edit" @click="openEdit(item)">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/></svg>
                </button>
              </td>
            </tr>
            <tr v-if="rows.length === 0">
              <td colspan="10" style="text-align:center;padding:20px;color:var(--text-muted)">
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
          <h3>Edit Bobot — {{ editForm.nama }}</h3>
          <button class="modal-close" @click="closeEdit">×</button>
        </div>
        <div class="modal-body">
          <!-- Live preview bobot -->
          <div class="bobot-preview">
            <div class="preview-label">Bobot (Otomatis)</div>
            <div class="preview-value">{{ previewBobot }}</div>
            <div class="preview-formula">
              Jabatan ({{ previewPoinJabatan }}) + Risiko ({{ previewPoinRisiko }})
            </div>
          </div>

          <div class="form-group">
            <label>Jabatan Unit</label>
            <select v-model="editForm.jabatanUnit" class="form-input">
              <option value="">— Tidak ada —</option>
              <option value="PJ">PJ (3 poin)</option>
              <option value="Koordinator">Koordinator (2 poin)</option>
              <option value="Tidak memiliki jabatan struktural">Tidak memiliki jabatan struktural (1 poin)</option>
            </select>
          </div>

          <div class="form-group">
            <label>Risiko</label>
            <select v-model="editForm.risiko" class="form-input">
              <option value="">— Tidak ada —</option>
              <option value="Sangat Tinggi">Sangat Tinggi (5 poin)</option>
              <option value="Tinggi">Tinggi (4 poin)</option>
              <option value="Sedang">Sedang (3 poin)</option>
              <option value="Rendah">Rendah (2 poin)</option>
              <option value="Sangat Rendah">Sangat Rendah (1 poin)</option>
            </select>
          </div>

          <div class="form-group">
            <label>Unit Kerja</label>
            <input v-model="editForm.unitKerja" type="text" class="form-input" placeholder="Contoh: UGD, Poli Umum..." />
          </div>

          <div class="form-group">
            <label>Status</label>
            <input v-model="editForm.status" type="text" class="form-input" placeholder="Contoh: Aktif, Non-Aktif..." />
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
import { ref, computed } from 'vue'

definePageMeta({ layout: 'main' })

const config = useRuntimeConfig()
const pending = ref(true)
const error = ref(false)
const rows = ref<any[]>([])
const isEditOpen = ref(false)
const editForm = ref<any>({})
const saving = ref(false)

const loadData = async () => {
  try {
    pending.value = true
    error.value = false
    const data: any[] = await $fetch(`${config.public.apiBase}/bobot-staff`)
    rows.value = data
  } catch (e) {
    error.value = true
  } finally {
    pending.value = false
  }
}

await loadData()

// Poin helpers (mirroring backend logic)
const getPoinJabatan = (j: string) => {
  if (j === 'PJ') return 3
  if (j === 'Koordinator') return 2
  if (j === 'Tidak memiliki jabatan struktural') return 1
  return 0
}
const getPoinRisiko = (r: string) => {
  if (r === 'Sangat Tinggi') return 5
  if (r === 'Tinggi') return 4
  if (r === 'Sedang') return 3
  if (r === 'Rendah') return 2
  if (r === 'Sangat Rendah') return 1
  return 0
}

// Live preview in modal
const previewPoinJabatan = computed(() => getPoinJabatan(editForm.value.jabatanUnit || ''))
const previewPoinRisiko = computed(() => getPoinRisiko(editForm.value.risiko || ''))
const previewBobot = computed(() => previewPoinJabatan.value + previewPoinRisiko.value)

// Badge classes
const jabatanBadgeClass = (j: string) => {
  if (j === 'PJ') return 'badge blue'
  if (j === 'Koordinator') return 'badge purple'
  return 'badge gray'
}
const risikoBadgeClass = (r: string) => {
  if (r === 'Sangat Tinggi') return 'badge red'
  if (r === 'Tinggi') return 'badge orange'
  if (r === 'Sedang') return 'badge yellow'
  if (r === 'Rendah') return 'badge teal'
  if (r === 'Sangat Rendah') return 'badge green'
  return 'badge gray'
}

const openEdit = (item: any) => {
  editForm.value = { ...item }
  isEditOpen.value = true
}
const closeEdit = () => { isEditOpen.value = false }

const saveEdit = async () => {
  saving.value = true
  try {
    await $fetch(`${config.public.apiBase}/bobot-staff/${editForm.value.pegawaiId}`, {
      method: 'PUT',
      body: {
        jabatanUnit: editForm.value.jabatanUnit || '',
        risiko: editForm.value.risiko || '',
        unitKerja: editForm.value.unitKerja || '',
        status: editForm.value.status || '',
      }
    })
    // Update local state
    const idx = rows.value.findIndex(r => r.pegawaiId === editForm.value.pegawaiId)
    if (idx !== -1) {
      const poinJabatan = getPoinJabatan(editForm.value.jabatanUnit || '')
      const poinRisiko = getPoinRisiko(editForm.value.risiko || '')
      rows.value[idx] = {
        ...rows.value[idx],
        jabatanUnit: editForm.value.jabatanUnit,
        risiko: editForm.value.risiko,
        unitKerja: editForm.value.unitKerja,
        status: editForm.value.status,
        poinJabatan,
        poinRisiko,
        bobot: poinJabatan + poinRisiko,
      }
    }
    closeEdit()
  } catch (e) {
    alert('Gagal menyimpan data')
  } finally {
    saving.value = false
  }
}
</script>

<style scoped>
.legend-row {
  display: flex;
  gap: 32px;
  padding: 16px 20px;
  background: var(--bg-level2);
  border-radius: 10px;
  flex-wrap: wrap;
}
.legend-group { display: flex; flex-direction: column; gap: 8px; }
.legend-title { font-size: 11px; font-weight: 700; color: var(--text-secondary); text-transform: uppercase; letter-spacing: 0.5px; }
.legend-items { display: flex; gap: 6px; flex-wrap: wrap; }
.legend-formula { font-size: 13px; font-weight: 700; color: var(--accent-blue); padding: 6px 12px; background: rgba(59,130,246,0.1); border-radius: 8px; border: 1px solid rgba(59,130,246,0.2); }

.badge { display: inline-block; padding: 2px 8px; border-radius: 12px; font-size: 11px; font-weight: 600; }
.badge.blue { background: #dbeafe; color: #1d4ed8; }
.badge.purple { background: #ede9fe; color: #6d28d9; }
.badge.gray { background: #f1f5f9; color: #64748b; }
.badge.red { background: #fee2e2; color: #dc2626; }
.badge.orange { background: #ffedd5; color: #c2410c; }
.badge.yellow { background: #fef9c3; color: #a16207; }
.badge.teal { background: #ccfbf1; color: #0f766e; }
.badge.green { background: #dcfce7; color: #15803d; }

.poin-chip { display: inline-block; min-width: 28px; text-align: center; padding: 2px 8px; background: var(--bg-level2); border: 1px solid var(--border); border-radius: 20px; font-size: 12px; font-weight: 600; }
.bobot-th { background: #f0fdf4; color: var(--accent-teal); border-bottom: 2px solid var(--accent-teal) !important; }
.bobot-cell { color: var(--accent-teal); font-size: 15px; }

/* Using global action-btn logic from main.css */
</style>
