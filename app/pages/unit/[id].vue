<template>
  <div class="page">
    <div class="section-header">
      <h1>{{ unitConfig.title }}</h1>
      <p>Input Tindakan & Kinerja — {{ periodeLabel }}</p>
    </div>

    <div v-if="pending" style="padding:40px;text-align:center;color:var(--text-muted)">Memuat data...</div>
    <div v-else-if="error" class="alert error" style="margin-top:20px">Gagal mengambil data. Pastikan backend berjalan.</div>

    <div v-else>
      <!-- ===== UNIT FINANCIAL SUMMARY (Refined Section) ===== -->
      <div class="card summary-card modern-summary" v-if="summaryData">
        <div class="summary-table-wrapper">
          <table class="summary-header-table">
            <thead>
              <tr>
                <th class="label-col">DESKRIPSI PENDAPATAN</th>
                <th class="data-col">NON KAPITASI (Rp)</th>
                <th class="data-col">PAD MURNI (Rp)</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td class="row-label">Jumlah Pendapatan Unit</td>
                <td class="amount-cell main-val">{{ formatRp(summaryData.nonKapitasi.total) }}</td>
                <td class="amount-cell main-val">{{ formatRp(summaryData.padMurni.total) }}</td>
              </tr>
              <tr class="sub-row">
                <td class="row-label indent">Alokasi Tidak Langsung (60%)</td>
                <td class="amount-cell secondary-val">{{ formatRp(summaryData.nonKapitasi.tidakLangsung) }}</td>
                <td class="amount-cell secondary-val">{{ formatRp(summaryData.padMurni.tidakLangsung) }}</td>
              </tr>
              <tr class="highlight-row">
                <td class="row-label indent"><strong>Jasa Pelayanan Langsung (40%)</strong></td>
                <td class="amount-cell primary-val"><strong>{{ formatRp(summaryData.nonKapitasi.langsung) }}</strong></td>
                <td class="amount-cell primary-val"><strong>{{ formatRp(summaryData.padMurni.langsung) }}</strong></td>
              </tr>
            </tbody>
            <tfoot>
               <tr>
                 <td class="row-label total">GRAND TOTAL JASPEL TERSEDIA (40%)</td>
                 <td colspan="2" class="amount-cell grand-total">
                   Rp {{ formatRp(summaryData.nonKapitasi.langsung + summaryData.padMurni.langsung) }}
                 </td>
               </tr>
            </tfoot>
          </table>
        </div>
      </div>

      <!-- ===== HEADER: Pagu Dana per Peran ===== -->
      <div class="card pagu-card modern-pagu">
        <div class="card-header">
          <div class="card-title-group">
            <div class="card-title">💰 Alokasi Pagu Dana — {{ unitConfig.title }}</div>
          </div>
          <div class="card-subtitle">Tentukan persentase (%) pembagian untuk setiap kelompok peran. Nominal (Rp) otomatis menyesuaikan.</div>
        </div>
        <div class="pagu-grid" v-if="Object.keys(pagu).length > 0">
          <div v-for="group in unitConfig.groups" :key="group.key" class="pagu-group" :style="getRoleStyle(group.key, true)">
            <div class="pagu-group-label">{{ group.label }}</div>
            <div class="pagu-inputs">
              <div class="pagu-input-wrap">
                <label>Non Kapitasi</label>
                <div class="pagu-input-combo">
                  <div class="input-with-unit">
                    <input
                      v-if="pagu[group.key]"
                      v-model.number="pagu[group.key]!.nonKap"
                      type="number"
                      class="form-input pagu-input-small"
                      placeholder="0"
                      @change="savePagu"
                    />
                    <span class="unit-label">%</span>
                  </div>
                  <div class="pagu-value-box">
                    <span class="currency">Rp</span>
                    <span class="amount">{{ formatRp(((pagu[group.key]?.nonKap || 0) / 100) * (summaryData?.nonKapitasi?.langsung || 0)) }}</span>
                  </div>
                </div>
              </div>
              <div class="pagu-input-wrap">
                <label>PAD Murni</label>
                <div class="pagu-input-combo">
                  <div class="input-with-unit">
                    <input
                      v-if="pagu[group.key]"
                      v-model.number="pagu[group.key]!.padMurni"
                      type="number"
                      class="form-input pagu-input-small"
                      placeholder="0"
                      @change="savePagu"
                    />
                    <span class="unit-label">%</span>
                  </div>
                  <div class="pagu-value-box">
                    <span class="currency">Rp</span>
                    <span class="amount">{{ formatRp(((pagu[group.key]?.padMurni || 0) / 100) * (summaryData?.padMurni?.langsung || 0)) }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- ===== TABEL KINERJA ===== -->
      <div class="card" style="margin-top:20px">
        <div class="card-header">
          <div class="card-title">{{ unitConfig.title }} — Distribusi Jaspel Langsung ({{ selectedPeriode }})</div>
          <div class="card-subtitle">
            Pembagian otomatis berdasarkan bobot dan jumlah tindakan/poin yang diinput.
          </div>
        </div>

        <div class="table-scroll">
          <table :id="`tbl-unit-${unitId}`" class="modern-table">
            <thead>
              <!-- Row 1: Group headers -->
              <tr>
                <th rowspan="2">No</th>
                <th rowspan="2">Nama</th>
                <th rowspan="2">Bobot</th>
                <th
                  v-for="group in unitConfig?.groups || []"
                  :key="group.key + '_h'"
                  colspan="4"
                  class="group-th"
                  :style="getRoleStyle(group.key)"
                >{{ group.label }}</th>
                <th rowspan="2" class="total-th">Non Kap</th>
                <th rowspan="2" class="total-th">PAD Murni</th>
                <th rowspan="2" class="total-th grand-th">TOTAL</th>
                <th rowspan="2">Aksi</th>
              </tr>
              <!-- Row 2: Sub-headers -->
              <tr>
                <template v-for="group in unitConfig?.groups || []" :key="group.key + '_sub'">
                  <th :style="getRoleSubStyle(group.key)">{{ group.inputLabel || 'Jml' }}</th>
                  <th :style="getRoleSubStyle(group.key)">Adj</th>
                  <th :style="getRoleSubStyle(group.key)">Jaspel NK</th>
                  <th :style="getRoleSubStyle(group.key)">Jaspel PAD</th>
                </template>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(item, idx) in rows" :key="item.pegawaiId">
                <td>{{ idx + 1 }}</td>
                <td style="white-space:nowrap"><strong>{{ item?.nama }}</strong></td>
                <td class="right bobot-cell">{{ item?.bobot || '—' }}</td>

                <!-- Dynamic group columns (per peran) -->
                <template v-for="group in unitConfig.groups" :key="group.key + '_' + idx">
                  <td class="right input-td">
                    {{ item?.tindakanPeran?.[group.key] || '—' }}
                  </td>
                  <td class="right adj-cell">
                    {{ fmtNum(computeItemAdjusted(item, group.key)) }}
                  </td>
                  <td class="right jaspel-cell">
                    {{ formatRp(computeJaspelNonKap(item, group.key)) }}
                  </td>
                  <td class="right jaspel-cell-pad">
                    {{ formatRp(computeJaspelPad(item, group.key)) }}
                  </td>
                </template>

                <!-- Totals -->
                <td class="right total-cell">{{ formatRp(computeTotalNonKap(item)) }}</td>
                <td class="right total-cell">{{ formatRp(computeTotalPad(item)) }}</td>
                <td class="right total-cell grand">{{ formatRp(computeTotalJaspel(item)) }}</td>

                <!-- Aksi -->
                <td>
                  <button class="action-btn edit" title="Edit" @click="openEdit(item)">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/></svg>
                  </button>
                </td>
              </tr>

              <tr v-if="rows.length === 0">
                <td :colspan="3 + unitConfig.groups.length * 4 + 4" style="text-align:center;padding:20px;color:var(--text-muted)">
                  Tidak ada data pegawai. Tambahkan pegawai di Data Dasar terlebih dahulu.
                </td>
              </tr>

              <!-- Subtotal row -->
              <tr v-if="rows.length > 0" class="total-row">
                <td colspan="3" style="text-align:right">TOTAL</td>
                <template v-for="group in unitConfig.groups" :key="group.key + '_tot'">
                  <td class="right">{{ colTotals[group.key + '_tindakan'] || '—' }}</td>
                  <td class="right">{{ fmtNum(colTotals[group.key + '_adjusted']) }}</td>
                  <td class="right">{{ formatRp(colTotals[group.key + '_nonKap']) }}</td>
                  <td class="right">{{ formatRp(colTotals[group.key + '_pad']) }}</td>
                </template>
                <td class="right total-cell">{{ formatRp(colTotals.totalNonKap) }}</td>
                <td class="right total-cell">{{ formatRp(colTotals.totalPad) }}</td>
                <td class="right total-cell grand">{{ formatRp(colTotals.totalJaspel) }}</td>
                <td></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- ===== Edit Modal ===== -->
    <div v-if="isEditOpen" class="modal-overlay" @click.self="closeEdit">
      <div class="modal-card">
        <div class="modal-header">
          <div>
            <h3>Edit Input Tindakan — {{ editForm.nama }}</h3>
            <div class="modal-bobot-badge">Bobot: {{ editForm.bobot || 0 }} <span class="modal-bobot-hint">(dari Master Bobot Staff)</span></div>
          </div>
          <button class="modal-close" @click="closeEdit">×</button>
        </div>
        <div class="modal-body">
          <template v-for="group in unitConfig.groups" :key="group.key + '_edit'">
            <div class="modal-unit-row">
              <div class="form-group">
                <label>{{ group.inputLabel || 'Jumlah' }} {{ group.subLabel }} ({{ group.label }})</label>
                <input
                  v-model.number="editTindakan[group.key]"
                  type="number"
                  class="form-input"
                  placeholder="0"
                  min="0"
                  @input="handleModalInput(group.key)"
                />
              </div>
              <div class="form-group">
                <label>Adjusted (Terhitung)</label>
                <input
                  v-model.number="editAdjusted[group.key]"
                  type="number"
                  class="form-input override-input"
                  placeholder="0"
                />
              </div>
            </div>
          </template>
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
import { ref, computed, watch, reactive } from 'vue'
import { useRoute } from 'vue-router'
import { useJaspelStore } from '~/stores/jaspelStore'

definePageMeta({ layout: 'main' })

const route = useRoute()
const config = useRuntimeConfig()
const { selectedPeriode } = useJaspelStore()
const unitId = computed(() => route.params.id as string)
const periodeLabel = computed(() => {
  const [y, m] = selectedPeriode.value.split('-')
  const bulan = ['', 'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember']
  return `${bulan[parseInt(m || '0')] || ''} ${y || ''}`
})

// ===== Unit Configs =====
const UNIT_CONFIGS: Record<string, any> = {
  'ugd': {
    title: 'UGD',
    groups: [
      { key: 'dokter', label: 'Dokter', subLabel: 'Tindakan', inputLabel: 'Jumlah', percent: 20 },
      { key: 'perawat', label: 'Perawat', subLabel: 'Tindakan', inputLabel: 'Jumlah', percent: 70 },
      { key: 'pengelola', label: 'Pejabat Pengelola BLUD', subLabel: 'Pengelola', inputLabel: 'Poin', percent: 10 },
    ]
  },
  'one-day-care': {
    title: 'One Day Care',
    groups: [
      { key: 'dokter', label: 'Dokter', subLabel: 'Tindakan', inputLabel: 'Jumlah', percent: 30 },
      { key: 'perawat', label: 'Perawat', subLabel: 'Tindakan', inputLabel: 'Jumlah', percent: 60 },
      { key: 'pengelola', label: 'Pejabat Pengelola BLUD', subLabel: 'Pengelola', inputLabel: 'Poin', percent: 10 },
    ]
  },
  'poned': {
    title: 'PONED',
    groups: [
      { key: 'dokter', label: 'Dokter', subLabel: 'Konsultasi', inputLabel: 'Jumlah', percent: 10 },
      { key: 'bidan_jaga', label: 'Bidan Jaga', subLabel: 'Jaga', inputLabel: 'Jumlah', percent: 55 },
      { key: 'bidan_asal_bulin', label: 'Bidan Asal Bulin', subLabel: 'Bulin', inputLabel: 'Jumlah', percent: 5 },
      { key: 'pendamping_rujukan', label: 'Pendamping Rujukan', subLabel: 'Rujukan', inputLabel: 'Jumlah', percent: 5 },
      { key: 'penolong_persalinan', label: 'Penolong Persalinan', subLabel: 'Persalinan', inputLabel: 'Jumlah', percent: 10 },
      { key: 'manajemen_poned', label: 'Manajemen PONED', subLabel: 'Manajemen', inputLabel: 'Poin', percent: 5 },
      { key: 'pengelola', label: 'Pejabat Pengelola BLUD', subLabel: 'Pengelola', inputLabel: 'Poin', percent: 10 },
    ]
  },
  'konseling': {
    title: 'Konseling',
    groups: [
      { key: 'dokter', label: 'Dokter', subLabel: 'Konsultasi', inputLabel: 'Jumlah', percent: 30 },
      { key: 'petugas', label: 'Petugas Konseling', subLabel: 'Konsultasi', inputLabel: 'Jumlah', percent: 60 },
      { key: 'pengelola', label: 'Pejabat Pengelola BLUD', subLabel: 'Pengelola', inputLabel: 'Poin', percent: 10 },
    ]
  },
  'haji': {
    title: 'Haji',
    groups: [
      { key: 'dokter', label: 'Dokter', subLabel: 'Tindakan', inputLabel: 'Jumlah', percent: 30 },
      { key: 'perawat_bidan', label: 'Perawat/Bidan', subLabel: 'Tindakan', inputLabel: 'Jumlah', percent: 60 },
      { key: 'pengelola', label: 'Pejabat Pengelola BLUD', subLabel: 'Pengelola', inputLabel: 'Poin', percent: 10 },
    ]
  },
  'kia': {
    title: 'KIA',
    groups: [
      { key: 'dokter', label: 'Dokter', subLabel: 'Tindakan', inputLabel: 'Jumlah', percent: 30 },
      { key: 'perawat_bidan', label: 'Perawat/Bidan', subLabel: 'Tindakan', inputLabel: 'Jumlah', percent: 60 },
      { key: 'pengelola', label: 'Pejabat Pengelola BLUD', subLabel: 'Pengelola', inputLabel: 'Poin', percent: 10 },
    ]
  },
  'usg': {
    title: 'USG',
    groups: [
      { key: 'dokter', label: 'Dokter', subLabel: 'Tindakan', inputLabel: 'Jumlah', percent: 35 },
      { key: 'perawat_bidan', label: 'Perawat/Bidan', subLabel: 'Tindakan', inputLabel: 'Jumlah', percent: 55 },
      { key: 'pengelola', label: 'Pejabat Pengelola BLUD', subLabel: 'Pengelola', inputLabel: 'Poin', percent: 10 },
    ]
  },
  'kb': {
    title: 'KB',
    groups: [
      { key: 'dokter', label: 'Dokter', subLabel: 'Tindakan', inputLabel: 'Jumlah', percent: 30 },
      { key: 'perawat_bidan', label: 'Perawat/Bidan', subLabel: 'Tindakan', inputLabel: 'Jumlah', percent: 60 },
      { key: 'pengelola', label: 'Pejabat Pengelola BLUD', subLabel: 'Pengelola', inputLabel: 'Poin', percent: 10 },
    ]
  },
  'lab': {
    title: 'LAB',
    groups: [
      { key: 'dokter', label: 'Dokter', subLabel: 'Tindakan', inputLabel: 'Jumlah', percent: 20 },
      { key: 'atlm', label: 'ATLM', subLabel: 'Tindakan', inputLabel: 'Jumlah', percent: 70 },
      { key: 'pengelola', label: 'Pejabat Pengelola BLUD', subLabel: 'Pengelola', inputLabel: 'Poin', percent: 10 },
    ]
  },
  'poli-umum': {
    title: 'Poli Umum',
    groups: [
      { key: 'dokter', label: 'Dokter', subLabel: 'Tindakan', inputLabel: 'Jumlah', percent: 30 },
      { key: 'perawat', label: 'Perawat', subLabel: 'Tindakan', inputLabel: 'Jumlah', percent: 60 },
      { key: 'pengelola', label: 'Pejabat Pengelola BLUD', subLabel: 'Pengelola', inputLabel: 'Poin', percent: 10 },
    ]
  },
  'gigi': {
    title: 'Gigi',
    groups: [
      { key: 'dokter', label: 'Dokter', subLabel: 'Tindakan', inputLabel: 'Jumlah', percent: 50 },
      { key: 'perawat', label: 'Perawat Gigi', subLabel: 'Tindakan', inputLabel: 'Jumlah', percent: 40 },
      { key: 'pengelola', label: 'Pejabat Pengelola BLUD', subLabel: 'Pengelola', inputLabel: 'Poin', percent: 10 },
    ]
  },
  'ambulans': {
    title: 'Ambulans',
    groups: [
      { key: 'perawat_bidan', label: 'Perawat/Bidan', subLabel: 'Tindakan', inputLabel: 'Jumlah', percent: 50 },
      { key: 'pengemudi', label: 'Pengemudi', subLabel: 'Penugasan', inputLabel: 'Jumlah', percent: 40 },
      { key: 'pengelola', label: 'Pejabat Pengelola BLUD', subLabel: 'Pengelola', inputLabel: 'Poin', percent: 10 },
    ]
  },
}

const unitConfig = computed(() => (UNIT_CONFIGS as any)[unitId.value] || UNIT_CONFIGS['ugd'])

const getRoleStyle = (key: string, isCard = false) => {
  let bg = '#f8fafc'
  let text = 'var(--text-primary)'
  let border = 'var(--border)'
  
  if (key === 'dokter') { 
    bg = '#eff6ff'; text = '#1e40af'; border = '#3b82f6';
  } else if (key.includes('perawat') || key.includes('atlm') || key.includes('petugas') || key === 'penolong_persalinan' || key.includes('pengemudi')) { 
    bg = '#f0fdf4'; text = '#166534'; border = '#22c55e';
  } else if (key.includes('bidan')) { 
    bg = '#fff1f2'; text = '#9f1239'; border = '#f43f5e';
  } else if (key === 'pengelola' || key === 'manajemen_poned') { 
    bg = '#fffbeb'; text = '#92400e'; border = '#f59e0b';
  } else if (key === 'pendamping_rujukan') { 
    bg = '#f5f3ff'; text = '#5b21b6'; border = '#8b5cf6';
  }

  return isCard 
    ? `background: ${bg}; border-top: 4px solid ${border};` 
    : `background: ${bg}; color: ${text}; border-bottom: 2px solid ${border}; font-weight: 700; text-align: center;`
}

const getRoleSubStyle = (key: string) => {
  let text = 'var(--text-secondary)'
  if (key === 'dokter') text = 'var(--role-dokter-text)'
  else if (key.includes('perawat') || key.includes('atlm') || key.includes('petugas') || key === 'penolong_persalinan' || key.includes('pengemudi')) text = 'var(--role-perawat-text)'
  else if (key.includes('bidan')) text = 'var(--role-bidan-text)'
  else if (key === 'pengelola' || key === 'manajemen_poned') text = 'var(--role-pengelola-text)'
  return `color: ${text}; font-size: 10px; text-transform: uppercase; letter-spacing: 0.5px; opacity: 0.8;`
}

// ===== State =====
const rows = ref<any[]>([])
const realUnitId = ref<string | null>(null)
const summaryData = ref<any>(null)
const pending = ref(true)
const error = ref(false)

// Pagu dana reactive (per peran key)
const pagu = reactive<Record<string, { nonKap: number; padMurni: number }>>({})

const initPagu = () => {
  unitConfig.value?.groups?.forEach((g: any) => {
    if (!pagu[g.key]) {
      pagu[g.key] = { 
        nonKap: g.percent || 0, 
        padMurni: g.percent || 0 
      }
    }
  })
}

// ===== Load Data =====
const loadData = async () => {
  pending.value = true
  error.value = false
  initPagu()
  try {
    // Load kinerja + bobot dari API
    const data: any = await $fetch(`${config.public.apiBase}/unit-kinerja/${unitId.value}/${selectedPeriode.value}`)
    realUnitId.value = data.unitId
    rows.value = (data.pegawai || []).map((p: any) => ({
      ...p,
      tindakanPeran: p.tindakanPeran || {},
      adjustedPeran: p.adjustedPeran || {},
    }))

    // Load pagu dari API
    const paguData: any = await $fetch(`${config.public.apiBase}/pagu-unit/${unitId.value}/${selectedPeriode.value}`)
    Object.entries(paguData || {}).forEach(([key, val]: [string, any]) => {
      if (pagu[key]) {
        pagu[key].nonKap = val.paguNonKap || 0
        pagu[key].padMurni = val.paguPadMurni || 0
      }
    })

    // Load unit summary dari API
    summaryData.value = await $fetch(`${config.public.apiBase}/jaspel-distribusi/unit-summary/${unitConfig.value.title}/${selectedPeriode.value}`)
  } catch (e) {
    error.value = true
  } finally {
    pending.value = false
  }
}

watch([unitId, selectedPeriode], loadData, { immediate: true })

// ===== Pagu Save =====
const savePagu = async () => {
  const body: any = {}
  unitConfig.value?.groups?.forEach((g: any) => {
    body[groupKey(g)] = { paguNonKap: pagu[groupKey(g)]?.nonKap || 0, paguPadMurni: pagu[groupKey(g)]?.padMurni || 0 }
  })
  try {
    const idToUse = realUnitId.value || unitId.value
    await $fetch(`${config.public.apiBase}/pagu-unit/${idToUse}/${selectedPeriode.value}`, {
      method: 'PUT',
      body
    })
  } catch (e) {
    // silent fail, pagu changes are local until confirmed
  }
}

const groupKey = (g: any) => g?.key || '';

// Adjusted = Bobot × JumlahTindakan untuk peran
const computeItemAdjusted = (item: any, groupKey: string): number => {
  // Use manual override from API if present
  let adj = item.adjustedPeran?.[groupKey]
  if (adj !== null && adj !== undefined) return adj

  // Otherwise calculate based on formulas
  const bobot = item.bobot || 0
  const jumlah = item.tindakanPeran[groupKey] || 0
  
  const isAdminRole = groupKey === 'pengelola' || groupKey === 'manajemen_poned'
  if (isAdminRole) {
      return jumlah * 10
  }
  return bobot * jumlah
}

const totalAdjustedPeran = computed(() => {
  const result: Record<string, number> = {}
  unitConfig.value.groups?.forEach((g: any) => {
    result[g.key] = rows.value.reduce((sum, item) => sum + computeItemAdjusted(item, g.key), 0)
  })
  return result
})

// Jaspel Non Kap: Bucket Sharing logic
const computeJaspelNonKap = (item: any, groupKey: string): number => {
  const tindMatch = item.tindakanPeran[groupKey] || 0
  if (!tindMatch) return 0

  // 0. Get the Adjusted value (prioritizing manual override from API)
  let adjWeight = item.adjustedPeran?.[groupKey]
  if (adjWeight === null || adjWeight === undefined) {
      const isAdminRole = groupKey === 'pengelola' || groupKey === 'manajemen_poned'
      if (isAdminRole) {
          adjWeight = tindMatch * 10
      } else {
          adjWeight = (item.bobot || 0) * tindMatch
      }
  }

  // 1. Calculate the Bucket size for this role
  const totalLangsungUnit = summaryData.value?.nonKapitasi?.langsung || 0
  const rolePercent = pagu[groupKey]?.nonKap || 0
  const bucketSize = totalLangsungUnit * (rolePercent / 100)

  // 2. Calculate this role's total adjusted weight across all employees
  let totalRoleAdjWeight = 0
  rows.value.forEach(r => {
      const actions = r.tindakanPeran[groupKey] || 0
      if (!actions) return
      
      let rAdj = r.adjustedPeran?.[groupKey]
      if (rAdj === null || rAdj === undefined) {
          const isAdminRole = groupKey === 'pengelola' || groupKey === 'manajemen_poned'
          if (isAdminRole) {
              rAdj = actions * 10
          } else {
              rAdj = (r.bobot || 0) * actions
          }
      }
      totalRoleAdjWeight += rAdj
  })

  if (totalRoleAdjWeight === 0) return 0

  // 3. Employee's share of this specific bucket
  return (adjWeight / totalRoleAdjWeight) * bucketSize
}

// Jaspel PAD Murni
const computeJaspelPad = (item: any, groupKey: string): number => {
  const tindMatch = item.tindakanPeran[groupKey] || 0
  if (!tindMatch) return 0

  // 0. Get Adjusted
  let adjWeight = item.adjustedPeran?.[groupKey]
  if (adjWeight === null || adjWeight === undefined) {
      const isAdminRole = groupKey === 'pengelola' || groupKey === 'manajemen_poned'
      if (isAdminRole) {
          adjWeight = tindMatch * 10
      } else {
          adjWeight = (item.bobot || 0) * tindMatch
      }
  }

  const totalLangsungUnit = summaryData.value?.padMurni?.langsung || 0
  const rolePercent = pagu[groupKey]?.padMurni || 0
  const bucketSize = totalLangsungUnit * (rolePercent / 100)

  let totalRoleAdjWeight = 0
  rows.value.forEach(r => {
      const actions = r.tindakanPeran[groupKey] || 0
      if (!actions) return

      let rAdj = r.adjustedPeran?.[groupKey]
      if (rAdj === null || rAdj === undefined) {
          const isAdminRole = groupKey === 'pengelola' || groupKey === 'manajemen_poned'
          if (isAdminRole) {
              rAdj = actions * 10
          } else {
              rAdj = (r.bobot || 0) * actions
          }
      }
      totalRoleAdjWeight += rAdj
  })

  if (totalRoleAdjWeight === 0) return 0

  return (adjWeight / totalRoleAdjWeight) * bucketSize
}

// Total per baris
const computeTotalNonKap = (item: any): number =>
  unitConfig.value.groups?.reduce((sum: number, g: any) => sum + computeJaspelNonKap(item, g.key), 0) || 0

const computeTotalPad = (item: any): number =>
  unitConfig.value.groups?.reduce((sum: number, g: any) => sum + computeJaspelPad(item, g.key), 0) || 0

const computeTotalJaspel = (item: any): number => computeTotalNonKap(item) + computeTotalPad(item)

// Column totals (footer row)
const colTotals = computed(() => {
  const t: any = { totalNonKap: 0, totalPad: 0, totalJaspel: 0 }
  unitConfig.value.groups?.forEach((g: any) => {
    t[g.key + '_tindakan'] = rows.value.reduce((sum, item) => sum + Number(item.tindakanPeran[g.key] || 0), 0)
    t[g.key + '_adjusted'] = rows.value.reduce((sum, item) => sum + computeItemAdjusted(item, g.key), 0)
    t[g.key + '_nonKap'] = rows.value.reduce((sum, item) => sum + computeJaspelNonKap(item, g.key), 0)
    t[g.key + '_pad'] = rows.value.reduce((sum, item) => sum + computeJaspelPad(item, g.key), 0)
  })
  t.totalNonKap = rows.value.reduce((sum, item) => sum + computeTotalNonKap(item), 0)
  t.totalPad = rows.value.reduce((sum, item) => sum + computeTotalPad(item), 0)
  t.totalJaspel = t.totalNonKap + t.totalPad
  return t
})

// ===== Formatters =====
const formatRp = (n: number) => {
  if (!n || n === 0) return '—'
  return Math.round(n).toLocaleString('id-ID')
}
const fmtNum = (n: number) => {
  if (!n || n === 0) return '—'
  return n.toFixed(2)
}

// ===== Edit Modal =====
const isEditOpen = ref(false)
const editForm = ref<any>({})
const editTindakan = ref<Record<string, number>>({})
const editAdjusted = ref<Record<string, number>>({})
const saving = ref(false)

const openEdit = (item: any) => {
  editForm.value = { ...item }
  // Clone tindakan per peran
  const t: Record<string, number> = {}
  const adj: Record<string, number> = {}
  unitConfig.value.groups?.forEach((g: any) => {
    t[g.key] = item?.tindakanPeran?.[g.key] || 0
    adj[g.key] = item?.adjustedPeran?.[g.key]
    
    // If no existing adjusted in DB, pre-calculate for modal
    if (adj[g.key] === null || adj[g.key] === undefined) {
        const isAdminRole = g.key === 'pengelola' || g.key === 'manajemen_poned'
        const b = item?.bobot || 0
        if (isAdminRole) {
            adj[g.key] = t[g.key] * 10
        } else {
            adj[g.key] = t[g.key] * b
        }
    }
  })
  editTindakan.value = t
  editAdjusted.value = adj
  isEditOpen.value = true
}

const handleModalInput = (peranKey: string) => {
    const actions = editTindakan.value[peranKey] || 0
    const bobot = editForm.value.bobot || 0
    const isAdminRole = peranKey === 'pengelola' || peranKey === 'manajemen_poned'
    if (isAdminRole) {
        editAdjusted.value[peranKey] = actions * 10
    } else {
        editAdjusted.value[peranKey] = actions * bobot
    }
}

const closeEdit = () => { isEditOpen.value = false }

const saveEdit = async () => {
  saving.value = true
  try {
    const unitDbId = realUnitId.value || `unit_${unitId.value}`
    await $fetch(`${config.public.apiBase}/unit-kinerja/${selectedPeriode.value}`, {
      method: 'PUT',
      body: {
        pegawaiId: editForm.value?.pegawaiId,
        unitId: unitDbId,
        tindakanPeran: editTindakan.value,
        adjustedPeran: editAdjusted.value
      }
    })

    // Update local rows
    const idx = rows.value.findIndex(r => r.pegawaiId === editForm.value?.pegawaiId)
    if (idx !== -1) {
      rows.value[idx] = {
        ...rows.value[idx],
        tindakanPeran: { ...editTindakan.value },
        adjustedPeran: { ...editAdjusted.value },
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
/* Summary Card Header */
/* Summary Card Header */
.card-title-group { display: flex; justify-content: space-between; align-items: center; width: 100%; margin-bottom: 8px; }
.btn-action-primary { 
  background: var(--accent-blue); 
  color: white; 
  border: none; 
  padding: 8px 16px; 
  border-radius: 8px; 
  font-size: 11px; 
  font-weight: 700; 
  cursor: pointer; 
  text-transform: uppercase;
  transition: all 0.2s;
}
.btn-action-primary:hover { background: #1e40af; transform: translateY(-1px); }
.btn-action-primary:disabled { background: var(--border); cursor: not-allowed; }

.summary-card { margin-bottom: 20px; padding: 0; overflow: hidden; background: linear-gradient(135deg, #fff 0%, #f8fafc 100%); border: 1px solid var(--border); }

.pagu-input-combo {
  display: flex;
  align-items: center;
  gap: 12px;
  background: white;
  padding: 6px;
  border-radius: 12px;
  border: 1px solid var(--border);
  transition: all 0.2s;
}
.pagu-input-combo:focus-within { border-color: var(--accent-blue); box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1); }

.input-with-unit {
  position: relative;
  display: flex;
  align-items: center;
  width: 100px;
}
.pagu-input-small {
  width: 100%;
  border: none !important;
  background: transparent !important;
  padding: 8px 30px 8px 12px !important;
  font-weight: 700;
  font-size: 16px;
  color: var(--text-dark);
  text-align: right;
}
.pagu-input-small::-webkit-inner-spin-button { opacity: 0; }
.unit-label {
  position: absolute;
  right: 12px;
  font-weight: 700;
  color: var(--text-light);
  font-size: 14px;
}

.pagu-value-box {
  flex: 1;
  display: flex;
  align-items: center;
  gap: 8px;
  background: #f0fdf4;
  padding: 10px 16px;
  border-radius: 10px;
  border: 1px solid #dcfce7;
}
.pagu-value-box .currency {
  font-size: 11px;
  font-weight: 800;
  color: var(--accent-teal);
  text-transform: uppercase;
  opacity: 0.7;
}
.pagu-value-box .amount {
  font-size: 18px;
  font-weight: 800;
  color: var(--accent-teal);
  font-family: 'JetBrains Mono', monospace;
  letter-spacing: -0.5px;
}

.override-input { background: #fffbeb !important; border-color: #fcd34d !important; color: #b45309 !important; font-weight: 700 !important; }

.summary-table-wrapper { width: 100%; overflow-x: auto; }
.modern-summary { border: none; box-shadow: var(--shadow-lg); overflow: hidden; }
.summary-header-table thead th { background: #f8fafc; color: #64748b; font-size: 10px; padding: 16px 24px; border-bottom: 2px solid #e2e8f0; }
.summary-header-table td { padding: 14px 24px; border-bottom: 1px solid #f1f5f9; }
.main-val { color: var(--text-primary); font-weight: 700; font-size: 15px; }
.secondary-val { color: var(--text-secondary); opacity: 0.8; }
.primary-val { color: var(--accent-blue); font-size: 16px; }
.highlight-row { background: #f0f9ff; }
.indent { padding-left: 40px !important; }
.grand-total { border-top: 2px solid var(--accent-blue); color: var(--accent-blue); font-size: 16px; font-weight: 800; padding: 12px 24px !important; text-align: right; }

.modern-pagu { border: none; box-shadow: none; margin-top: 10px; background: transparent; }
.pagu-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(340px, 1fr)); gap: 16px; padding: 4px; }
.pagu-group { background: #fff; border-radius: 16px; padding: 20px; border: 1px solid var(--border); box-shadow: var(--shadow); transition: all 0.2s; display: flex; flex-direction: column; }
.pagu-group-label { text-align: center; font-weight: 800; font-size: 15px; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 16px; padding-bottom: 10px; border-bottom: 1px solid rgba(0,0,0,0.05); color: inherit; }
.pagu-group:hover { transform: translateY(-3px); box-shadow: var(--shadow-lg); }

.modern-table thead th { background: #f8fafc; color: #475569; font-weight: 700; border-bottom: 2px solid #e2e8f0; }
.modern-table .group-th { border-bottom-width: 3px !important; }

.action-btn { background: #f8fafc; border: 1px solid #e2e8f0; }
.action-btn:hover { background: #eff6ff; border-color: var(--accent-blue); color: var(--accent-blue); }

.modal-card { border: none; box-shadow: 0 25px 50px -12px rgb(0 0 0 / 0.5); }
</style>
