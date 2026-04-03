<template>
  <div class="page">
    <div class="section-header">
      <h1>{{ unitConfig.title }}</h1>
      <p>Input Tindakan &amp; Kinerja — Januari 2026</p>
    </div>

    <div v-if="pending" style="padding:40px;text-align:center;color:var(--text-muted)">Memuat data...</div>
    <div v-else-if="error" class="alert error" style="margin-top:20px">Gagal mengambil data. Pastikan backend berjalan.</div>

    <div class="card" v-else>
      <div class="card-header">
        <div class="card-title">{{ unitConfig.title }} — Distribusi Jaspel Langsung (2026-01)</div>
        <div class="card-subtitle">Isi jumlah tindakan dan poin per pegawai. Total dihitung otomatis.</div>
      </div>

      <div class="table-scroll">
        <table :id="`tbl-unit-${unitId}`">
          <thead>
            <!-- Row 1: Group headers -->
            <tr>
              <th rowspan="2">No</th>
              <th rowspan="2">Nama</th>
              <th rowspan="2">Bobot</th>
              <th colspan="3" v-for="group in unitConfig.groups" :key="group.label" class="group-th">{{ group.label }}</th>
              <th colspan="3" class="group-th pengelola">Pengelola BLUD</th>
              <th rowspan="2" class="total-th">Total Jaspel<br>Non Kap</th>
              <th rowspan="2" class="total-th">Total Jaspel<br>PAD Murni</th>
              <th rowspan="2" class="total-th">Total<br>Jaspel</th>
              <th rowspan="2">Aksi</th>
            </tr>
            <!-- Row 2: Sub-headers -->
            <tr>
              <template v-for="group in unitConfig.groups" :key="group.label + '_sub'">
                <th>Jumlah<br>{{ group.subLabel }}</th>
                <th>Adjusted</th>
                <th>{{ group.jaspelLabel }}</th>
              </template>
              <th>Point<br>Pengelola</th>
              <th>Adjusted</th>
              <th>Jaspel<br>Pengelola</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(item, idx) in rows" :key="item.pegawaiId">
              <td>{{ idx + 1 }}</td>
              <td style="white-space:nowrap"><strong>{{ item.nama }}</strong></td>
              <td class="right">{{ item.bobot || '-' }}</td>
              <!-- Dynamic group columns -->
              <template v-for="(group, gi) in unitConfig.groups" :key="gi">
                <td class="right">{{ item[group.jumlahField] || '-' }}</td>
                <td class="right">{{ computeAdjusted(item[group.jumlahField], item.bobot) }}</td>
                <td class="right" style="color:var(--accent-teal)">{{ formatRp(item[group.jaspelField]) }}</td>
              </template>
              <!-- Pengelola -->
              <td class="right">{{ item.pointPengelolaBlud || '-' }}</td>
              <td class="right">{{ computeAdjusted(item.pointPengelolaBlud, item.bobot) }}</td>
              <td class="right" style="color:var(--accent-teal)">{{ formatRp(item.jaspelPengelola) }}</td>
              <!-- Totals -->
              <td class="right total-cell">{{ formatRp(item.totalNonKap) }}</td>
              <td class="right total-cell">{{ formatRp(item.totalPadMurni) }}</td>
              <td class="right total-cell grand">{{ formatRp(item.totalJaspel) }}</td>
              <!-- Aksi -->
              <td>
                <button class="action-btn edit" title="Edit" @click="openEdit(item, idx)">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/></svg>
                </button>
              </td>
            </tr>
            <tr v-if="rows.length === 0">
              <td :colspan="3 + (unitConfig.groups.length * 3) + 7" style="text-align:center;padding:20px;color:var(--text-muted)">
                Tidak ada data pegawai. Tambahkan pegawai di Data Dasar terlebih dahulu.
              </td>
            </tr>
            <!-- Subtotal row -->
            <tr v-if="rows.length > 0" style="background:var(--bg-level2);font-weight:700;">
              <td colspan="3" style="text-align:right">TOTAL</td>
              <template v-for="(group, gi) in unitConfig.groups" :key="gi + '_tot'">
                <td></td><td></td>
                <td class="right">{{ formatRp(colTotals[group.jaspelField]) }}</td>
              </template>
              <td></td><td></td>
              <td class="right">{{ formatRp(colTotals.jaspelPengelola) }}</td>
              <td class="right">{{ formatRp(colTotals.totalNonKap) }}</td>
              <td class="right">{{ formatRp(colTotals.totalPadMurni) }}</td>
              <td class="right" style="color:var(--accent-blue)">{{ formatRp(colTotals.totalJaspel) }}</td>
              <td></td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Edit Modal -->
    <div v-if="isEditOpen" class="modal-overlay" @click.self="closeEdit">
      <div class="modal-card">
        <div class="modal-header">
          <h3>Edit Input Kinerja — {{ editForm.nama }}</h3>
          <button class="modal-close" @click="closeEdit">×</button>
        </div>
        <div class="modal-body">
          <div class="form-group">
            <label>Bobot Pegawai</label>
            <input v-model.number="editForm.bobot" type="number" step="0.01" class="form-input" placeholder="0" />
          </div>
          <template v-for="group in unitConfig.groups" :key="group.label + '_edit'">
            <div class="form-group">
              <label>Jumlah {{ group.subLabel }}</label>
              <input v-model.number="editForm[group.jumlahField]" type="number" class="form-input" placeholder="0" />
            </div>
            <div class="form-group">
              <label>{{ group.jaspelLabel }} (Rp)</label>
              <input v-model.number="editForm[group.jaspelField]" type="number" class="form-input" placeholder="0" />
            </div>
          </template>
          <div class="form-group">
            <label>Point Pengelola BLUD</label>
            <input v-model.number="editForm.pointPengelolaBlud" type="number" step="0.01" class="form-input" placeholder="0" />
          </div>
          <div class="form-group">
            <label>Jaspel Pengelola (Rp)</label>
            <input v-model.number="editForm.jaspelPengelola" type="number" class="form-input" placeholder="0" />
          </div>
          <div class="form-group">
            <label>Total Jaspel Non Kapitasi (Rp)</label>
            <input v-model.number="editForm.totalNonKap" type="number" class="form-input" placeholder="0" />
          </div>
          <div class="form-group">
            <label>Total Jaspel PAD Murni (Rp)</label>
            <input v-model.number="editForm.totalPadMurni" type="number" class="form-input" placeholder="0" />
          </div>
        </div>
        <div class="modal-footer">
          <button class="btn secondary" @click="closeEdit">Batal</button>
          <button class="btn primary" @click="saveEdit" :disabled="saving">{{ saving ? 'Menyimpan...' : 'Simpan' }}</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { useRoute } from 'vue-router'

definePageMeta({ layout: 'main' })

const route = useRoute()
const config = useRuntimeConfig()
const unitId = computed(() => route.params.id as string)

// Unit column configs
const UNIT_CONFIGS: Record<string, any> = {
  'ugd': {
    title: 'UGD',
    groups: [
      { label: 'Dokter', subLabel: 'Tindakan', jumlahField: 'jumlahTindakanDokter', jaspelField: 'jaspelDokter', jaspelLabel: 'Jaspel Dokter' },
      { label: 'Perawat', subLabel: 'Tindakan', jumlahField: 'jumlahTindakanPerawat', jaspelField: 'jaspelPerawat', jaspelLabel: 'Jaspel Perawat' },
    ]
  },
  'one-day-care': {
    title: 'One Day Care',
    groups: [
      { label: 'Dokter', subLabel: 'Tindakan', jumlahField: 'jumlahTindakanDokter', jaspelField: 'jaspelDokter', jaspelLabel: 'Jaspel Dokter' },
      { label: 'Perawat', subLabel: 'Tindakan', jumlahField: 'jumlahTindakanPerawat', jaspelField: 'jaspelPerawat', jaspelLabel: 'Jaspel Perawat' },
    ]
  },
  'poned': {
    title: 'PONED',
    groups: [
      { label: 'Dokter', subLabel: 'Konsultasi', jumlahField: 'jumlahKonsultasiDokter', jaspelField: 'jaspelDokter', jaspelLabel: 'Jaspel Dokter' },
      { label: 'Bidan Jaga', subLabel: 'Jaga', jumlahField: 'jumlahJaga', jaspelField: 'jaspelBidanJaga', jaspelLabel: 'Jaspel Bidan' },
      { label: 'Asal Bulin', subLabel: 'Bulin', jumlahField: 'jumlahBulin', jaspelField: 'jaspelBidanAsalBulin', jaspelLabel: 'Jaspel Asal Bulin' },
      { label: 'Rujukan', subLabel: 'Rujukan', jumlahField: 'jumlahRujukan', jaspelField: 'jaspelPendampingRujukan', jaspelLabel: 'Jaspel Rujukan' },
      { label: 'Persalinan', subLabel: 'Persalinan', jumlahField: 'jumlahPersalinan', jaspelField: 'jaspelPenolongPersalinan', jaspelLabel: 'Jaspel Persalinan' },
      { label: 'Manajemen PONED', subLabel: 'Manajemen', jumlahField: 'jumlahManajemenPoned', jaspelField: 'jaspelManajemenPoned', jaspelLabel: 'Jaspel Manajemen PONED' },
    ]
  },
  'konseling': {
    title: 'Konseling',
    groups: [
      { label: 'Dokter', subLabel: 'Konsultasi', jumlahField: 'jumlahKonsultasiDokter', jaspelField: 'jaspelDokter', jaspelLabel: 'Jaspel Dokter' },
      { label: 'Petugas', subLabel: 'Konsultasi', jumlahField: 'jumlahKonsultasiPetugas', jaspelField: 'jaspelPetugas', jaspelLabel: 'Jaspel Petugas' },
    ]
  },
  'haji': {
    title: 'Haji',
    groups: [
      { label: 'Dokter', subLabel: 'Tindakan', jumlahField: 'jumlahTindakanDokter', jaspelField: 'jaspelDokter', jaspelLabel: 'Jaspel Dokter' },
      { label: 'Perawat/Bidan', subLabel: 'Tindakan', jumlahField: 'jumlahTindakanPerawat', jaspelField: 'jaspelPerawat', jaspelLabel: 'Jaspel Perawat/Bidan' },
    ]
  },
  'kia': {
    title: 'KIA',
    groups: [
      { label: 'Dokter', subLabel: 'Tindakan', jumlahField: 'jumlahTindakanDokter', jaspelField: 'jaspelDokter', jaspelLabel: 'Jaspel Dokter' },
      { label: 'Perawat/Bidan', subLabel: 'Tindakan', jumlahField: 'jumlahTindakanPerawat', jaspelField: 'jaspelPerawat', jaspelLabel: 'Jaspel Perawat/Bidan' },
    ]
  },
  'usg': {
    title: 'USG',
    groups: [
      { label: 'Dokter', subLabel: 'Tindakan', jumlahField: 'jumlahTindakanDokter', jaspelField: 'jaspelDokter', jaspelLabel: 'Jaspel Dokter' },
      { label: 'Perawat/Bidan', subLabel: 'Tindakan', jumlahField: 'jumlahTindakanPerawat', jaspelField: 'jaspelPerawat', jaspelLabel: 'Jaspel Perawat/Bidan' },
    ]
  },
  'kb': {
    title: 'KB',
    groups: [
      { label: 'Dokter', subLabel: 'Tindakan', jumlahField: 'jumlahTindakanDokter', jaspelField: 'jaspelDokter', jaspelLabel: 'Jaspel Dokter' },
      { label: 'Perawat/Bidan', subLabel: 'Tindakan', jumlahField: 'jumlahTindakanPerawat', jaspelField: 'jaspelPerawat', jaspelLabel: 'Jaspel Perawat/Bidan' },
    ]
  },
  'lab': {
    title: 'LAB',
    groups: [
      { label: 'Dokter', subLabel: 'Tindakan', jumlahField: 'jumlahTindakanDokter', jaspelField: 'jaspelDokter', jaspelLabel: 'Jaspel Dokter' },
      { label: 'ATLM', subLabel: 'Tindakan', jumlahField: 'jumlahTindakanPerawat', jaspelField: 'jaspelAtlm', jaspelLabel: 'Jaspel ATLM' },
    ]
  },
  'poli-umum': {
    title: 'Poli Umum',
    groups: [
      { label: 'Dokter', subLabel: 'Tindakan', jumlahField: 'jumlahTindakanDokter', jaspelField: 'jaspelDokter', jaspelLabel: 'Jaspel Dokter' },
      { label: 'ATLM', subLabel: 'Tindakan', jumlahField: 'jumlahTindakanPerawat', jaspelField: 'jaspelAtlm', jaspelLabel: 'Jaspel ATLM' },
    ]
  },
  'gigi': {
    title: 'Gigi',
    groups: [
      { label: 'Dokter', subLabel: 'Tindakan', jumlahField: 'jumlahTindakanDokter', jaspelField: 'jaspelDokter', jaspelLabel: 'Jaspel Dokter' },
      { label: 'Perawat', subLabel: 'Tindakan', jumlahField: 'jumlahTindakanPerawat', jaspelField: 'jaspelPerawat', jaspelLabel: 'Jaspel Perawat' },
    ]
  },
  'ambulans': {
    title: 'Ambulans',
    groups: [
      { label: 'Perawat/Bidan', subLabel: 'Tindakan', jumlahField: 'jumlahTindakanDokter', jaspelField: 'jaspelPerawat', jaspelLabel: 'Jaspel Perawat/Bidan' },
      { label: 'Perawat', subLabel: 'Tindakan', jumlahField: 'jumlahTindakanPerawat', jaspelField: 'jaspelAtlm', jaspelLabel: 'Jaspel Perawat' },
    ]
  },
}

const unitConfig = computed(() => {
  return UNIT_CONFIGS[unitId.value] || { title: unitId.value, groups: [] }
})

// Reactive rows — loaded from API then editable locally
const rows = ref<any[]>([])
const isEditOpen = ref(false)
const editForm = ref<any>({})
const editIdx = ref(-1)
const saving = ref(false)
const pending = ref(true)
const error = ref(false)

const loadData = async () => {
  try {
    pending.value = true
    error.value = false
    const data: any = await $fetch(`${config.public.apiBase}/unit-kinerja/${unitId.value}/2026-01`)
    rows.value = (data.pegawai || []).map((p: any) => ({
      ...p,
      jumlahTindakanDokter: p.jumlahTindakanDokter || 0,
      jumlahTindakanPerawat: p.jumlahTindakanPerawat || 0,
      jumlahKonsultasiDokter: p.jumlahKonsultasiDokter || 0,
      jumlahJaga: p.jumlahJaga || 0,
      jumlahBulin: p.jumlahBulin || 0,
      jumlahRujukan: p.jumlahRujukan || 0,
      jumlahPersalinan: p.jumlahPersalinan || 0,
      jumlahManajemenPoned: p.jumlahManajemenPoned || 0,
      jumlahKonsultasiPetugas: p.jumlahKonsultasiPetugas || 0,
      totalNonKap: 0,
      totalPadMurni: 0,
      totalJaspel: 0,
    }))
  } catch (e) {
    error.value = true
  } finally {
    pending.value = false
  }
}

// Watch for route changes (navigating between units)
watch(unitId, loadData, { immediate: true })

const computeAdjusted = (jumlah: number, bobot: number) => {
  if (!jumlah || !bobot) return '-'
  return (jumlah * bobot).toFixed(2)
}

const formatRp = (n: number) => {
  if (!n) return '-'
  return Math.round(n).toLocaleString('id-ID')
}

const colTotals = computed(() => {
  const t: any = { jaspelPengelola: 0, totalNonKap: 0, totalPadMurni: 0, totalJaspel: 0 }
  unitConfig.value.groups?.forEach((g: any) => { t[g.jaspelField] = 0 })
  rows.value.forEach((r: any) => {
    unitConfig.value.groups?.forEach((g: any) => { t[g.jaspelField] += r[g.jaspelField] || 0 })
    t.jaspelPengelola += r.jaspelPengelola || 0
    t.totalNonKap += r.totalNonKap || 0
    t.totalPadMurni += r.totalPadMurni || 0
    t.totalJaspel += r.totalJaspel || 0
  })
  return t
})

const openEdit = (item: any, idx: number) => {
  editForm.value = { ...item }
  editIdx.value = idx
  isEditOpen.value = true
}

const closeEdit = () => { isEditOpen.value = false }

const saveEdit = async () => {
  saving.value = true
  try {
    // Recalculate totals
    editForm.value.totalJaspel = (editForm.value.totalNonKap || 0) + (editForm.value.totalPadMurni || 0)
    
    // Update local state
    rows.value[editIdx.value] = { ...editForm.value }
    
    // Save to backend
    await $fetch(`${config.public.apiBase}/unit-kinerja/2026-01`, {
      method: 'PUT',
      body: {
        pegawaiId: editForm.value.pegawaiId,
        unitId: `unit_${unitId.value}`,
        bobot: editForm.value.bobot,
        jumlahTindakanDokter: editForm.value.jumlahTindakanDokter,
        jumlahTindakanPerawat: editForm.value.jumlahTindakanPerawat,
        jumlahKonsultasiDokter: editForm.value.jumlahKonsultasiDokter,
        jumlahJaga: editForm.value.jumlahJaga,
        jumlahBulin: editForm.value.jumlahBulin,
        jumlahRujukan: editForm.value.jumlahRujukan,
        jumlahPersalinan: editForm.value.jumlahPersalinan,
        jumlahManajemenPoned: editForm.value.jumlahManajemenPoned,
        jumlahKonsultasiPetugas: editForm.value.jumlahKonsultasiPetugas,
        pointPengelolaBlud: editForm.value.pointPengelolaBlud,
        jaspelDokter: editForm.value.jaspelDokter,
        jaspelPerawat: editForm.value.jaspelPerawat,
        jaspelBidanJaga: editForm.value.jaspelBidanJaga,
        jaspelBidanAsalBulin: editForm.value.jaspelBidanAsalBulin,
        jaspelPendampingRujukan: editForm.value.jaspelPendampingRujukan,
        jaspelPenolongPersalinan: editForm.value.jaspelPenolongPersalinan,
        jaspelManajemenPoned: editForm.value.jaspelManajemenPoned,
        jaspelPetugas: editForm.value.jaspelPetugas,
        jaspelAtlm: editForm.value.jaspelAtlm,
        jaspelPengelola: editForm.value.jaspelPengelola,
      }
    })
    closeEdit()
  } catch (e) {
    alert('Gagal menyimpan data')
  } finally {
    saving.value = false
  }
}
</script>

<style scoped>
.action-btn { width: 28px; height: 28px; border-radius: 6px; border: 1px solid var(--border); background: #fff; display: flex; align-items: center; justify-content: center; cursor: pointer; transition: all .2s; color: var(--text-muted); }
.action-btn:hover.edit { border-color: var(--accent-blue); color: var(--accent-blue); }
.action-btn svg { width: 14px; height: 14px; }
.group-th { background: #eff6ff; color: var(--accent-blue); text-align: center; font-size: 11px; border-bottom: 2px solid var(--accent-blue) !important; }
.group-th.pengelola { background: #fef9c3; color: #854d0e; border-bottom-color: #ca8a04 !important; }
.total-th { background: #f0fdf4; color: var(--accent-teal); font-size: 11px; border-bottom: 2px solid var(--accent-teal) !important; }
.total-cell { color: var(--accent-teal); }
.grand { color: var(--accent-blue) !important; font-weight: 700; }
table th { font-size: 11px; white-space: nowrap; }
.modal-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.5); z-index: 1000; display: flex; align-items: center; justify-content: center; }
.modal-card { background: var(--bg); border-radius: 16px; width: 520px; max-width: 95vw; max-height: 90vh; overflow-y: auto; box-shadow: 0 20px 60px rgba(0,0,0,0.3); }
.modal-header { padding: 20px 24px; border-bottom: 1px solid var(--border); display: flex; justify-content: space-between; align-items: center; position: sticky; top: 0; background: var(--bg); z-index: 1; }
.modal-header h3 { margin: 0; font-size: 15px; font-weight: 700; }
.modal-close { background: none; border: none; font-size: 24px; cursor: pointer; color: var(--text-muted); }
.modal-body { padding: 24px; display: flex; flex-direction: column; gap: 12px; }
.modal-footer { padding: 16px 24px; border-top: 1px solid var(--border); display: flex; justify-content: flex-end; gap: 10px; position: sticky; bottom: 0; background: var(--bg); }
.form-group { display: flex; flex-direction: column; gap: 4px; }
.form-group label { font-size: 12px; font-weight: 600; color: var(--text-secondary); }
.form-input { padding: 9px 12px; border: 1px solid var(--border); border-radius: 8px; background: var(--bg-level2); color: var(--text); font-size: 13px; outline: none; width: 100%; box-sizing: border-box; }
.form-input:focus { border-color: var(--accent-blue); }
.btn { padding: 10px 20px; border-radius: 8px; font-size: 14px; font-weight: 600; cursor: pointer; border: none; }
.btn.primary { background: var(--accent-blue); color: white; }
.btn.secondary { background: var(--bg-level2); color: var(--text); border: 1px solid var(--border); }
</style>
