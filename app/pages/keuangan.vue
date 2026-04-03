<template>
  <div class="page">
    <div class="section-header">
      <h1>Data Keuangan &amp; Parameter</h1>
      <p>Realisasi pendapatan BLUD dan parameter perhitungan Jaspel — Januari 2026</p>
    </div>

    <div v-if="pending" style="padding:40px;text-align:center;color:var(--text-muted)">Memuat data keuangan...</div>

    <template v-else>
      <!-- Summary Cards -->
      <div class="metrics-grid" style="margin-bottom:20px">
        <div class="metric-card blue">
          <div class="metric-label">Total Pendapatan BLUD</div>
          <div class="metric-value small">Rp {{ formatRp(totalPendapatan) }}</div>
          <div class="metric-sub">Non Kap + PAD Murni</div>
        </div>
        <div class="metric-card teal">
          <div class="metric-label">Total Jaspel (60%)</div>
          <div class="metric-value small">Rp {{ formatRp(totalPendapatan * 0.6) }}</div>
        </div>
        <div class="metric-card green">
          <div class="metric-label">Tidak Langsung (60%)</div>
          <div class="metric-value small">Rp {{ formatRp(totalPendapatan * 0.6 * 0.6) }}</div>
        </div>
        <div class="metric-card amber">
          <div class="metric-label">Langsung (40%)</div>
          <div class="metric-value small">Rp {{ formatRp(totalPendapatan * 0.6 * 0.4) }}</div>
        </div>
      </div>

      <div class="card">
        <div class="card-header">
          <div class="card-title">Rincian Pendapatan per Jenis Layanan — Januari 2026</div>
          <div class="card-subtitle">Parameter: Jaspel=60%, Operasional=40%, TL=60% dari Jaspel, L=40% dari Jaspel</div>
        </div>
        <div class="card-body" style="padding:0">
          <div style="overflow-x:auto">
            <table id="tbl-keuangan">
              <thead>
                <tr>
                  <th>Jenis Pendapatan</th>
                  <th>Pendapatan</th>
                  <th class="right">Jumlah Pendapatan BLUD</th>
                  <th class="right">Jaspel (60%)</th>
                  <th class="right">Operasional (40%)</th>
                  <th class="right">Tidak Langsung (60%)</th>
                  <th class="right">Langsung (40%)</th>
                </tr>
              </thead>
              <tbody>
                <!-- NON KAPITASI HEADER -->
                <tr class="group-header">
                  <td colspan="7" class="group-label non-kap">NON KAPITASI</td>
                </tr>
                <!-- Non Kap Rows -->
                <tr v-for="row in nonKapRows" :key="row.key">
                  <td class="muted">Non Kapitasi</td>
                  <td>{{ row.label }}</td>
                  <td class="right mono">{{ row.nilai > 0 ? 'Rp ' + formatRp(row.nilai) : 'Rp -' }}</td>
                  <td class="right">{{ row.nilai > 0 ? 'Rp ' + formatRp(row.nilai * 0.6) : 'Rp -' }}</td>
                  <td class="right">{{ row.nilai > 0 ? 'Rp ' + formatRp(row.nilai * 0.4) : 'Rp -' }}</td>
                  <td class="right">{{ row.nilai > 0 ? 'Rp ' + formatRp(row.nilai * 0.6 * 0.6) : 'Rp -' }}</td>
                  <td class="right">{{ row.nilai > 0 ? 'Rp ' + formatRp(row.nilai * 0.6 * 0.4) : 'Rp -' }}</td>
                </tr>
                <!-- Total Non Kap -->
                <tr class="subtotal-row non-kap-total">
                  <td colspan="2"><strong>Total N. Kapitasi</strong></td>
                  <td class="right mono"><strong>Rp {{ formatRp(totalNonKap) }}</strong></td>
                  <td class="right"><strong>Rp {{ formatRp(totalNonKap * 0.6) }}</strong></td>
                  <td class="right"><strong>Rp {{ formatRp(totalNonKap * 0.4) }}</strong></td>
                  <td class="right"><strong>Rp {{ formatRp(totalNonKap * 0.6 * 0.6) }}</strong></td>
                  <td class="right"><strong>Rp {{ formatRp(totalNonKap * 0.6 * 0.4) }}</strong></td>
                </tr>

                <!-- PAD MURNI HEADER -->
                <tr class="group-header">
                  <td colspan="7" class="group-label pad-murni">PAD MURNI</td>
                </tr>
                <!-- PAD Rows -->
                <tr v-for="row in padMurniRows" :key="row.key">
                  <td class="muted">PAD Murni</td>
                  <td>{{ row.label }}</td>
                  <td class="right mono">{{ row.nilai > 0 ? 'Rp ' + formatRp(row.nilai) : 'Rp -' }}</td>
                  <td class="right">{{ row.nilai > 0 ? 'Rp ' + formatRp(row.nilai * 0.6) : 'Rp -' }}</td>
                  <td class="right">{{ row.nilai > 0 ? 'Rp ' + formatRp(row.nilai * 0.4) : 'Rp -' }}</td>
                  <td class="right">{{ row.nilai > 0 ? 'Rp ' + formatRp(row.nilai * 0.6 * 0.6) : 'Rp -' }}</td>
                  <td class="right">{{ row.nilai > 0 ? 'Rp ' + formatRp(row.nilai * 0.6 * 0.4) : 'Rp -' }}</td>
                </tr>
                <!-- Total PAD Murni -->
                <tr class="subtotal-row pad-total">
                  <td colspan="2"><strong>Total PAD Murni</strong></td>
                  <td class="right mono"><strong>Rp {{ formatRp(totalPadMurni) }}</strong></td>
                  <td class="right"><strong>Rp {{ formatRp(totalPadMurni * 0.6) }}</strong></td>
                  <td class="right"><strong>Rp {{ formatRp(totalPadMurni * 0.4) }}</strong></td>
                  <td class="right"><strong>Rp {{ formatRp(totalPadMurni * 0.6 * 0.6) }}</strong></td>
                  <td class="right"><strong>Rp {{ formatRp(totalPadMurni * 0.6 * 0.4) }}</strong></td>
                </tr>

                <!-- Grand Total -->
                <tr class="grand-total">
                  <td colspan="2">TOTAL PAD</td>
                  <td class="right mono">Rp {{ formatRp(totalPendapatan) }}</td>
                  <td class="right">Rp {{ formatRp(totalPendapatan * 0.6) }}</td>
                  <td class="right">Rp {{ formatRp(totalPendapatan * 0.4) }}</td>
                  <td class="right">Rp {{ formatRp(totalPendapatan * 0.6 * 0.6) }}</td>
                  <td class="right">Rp {{ formatRp(totalPendapatan * 0.6 * 0.4) }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useApi } from '../composables/useApi';

definePageMeta({ layout: "main" });

const { data: unitDataRaw, pending } = useApi<any[]>('/reports/unit-pelayanan/2026-01');

// Helper to find value by unit name from backend
const getValByName = (name: string, field: 'jumlahNonKapitasi' | 'padRanap') => {
  if (!unitDataRaw.value) return 0;
  const found = unitDataRaw.value.find((u: any) => u.unitNama === name);
  return found ? (found[field] || 0) : 0;
};

// NON KAPITASI rows per Excel layout
const nonKapRows = computed(() => [
  { key: 'persalinan', label: 'Persalinan & Pasca Persalinan', nilai: getValByName('Persalinan & Pasca Persalinan', 'jumlahNonKapitasi') },
  { key: 'prarujukan', label: 'Pra Rujukan / PONED', nilai: getValByName('Pra Rujukan / PONED', 'jumlahNonKapitasi') },
  { key: 'kb', label: 'KB', nilai: getValByName('KB', 'jumlahNonKapitasi') },
  { key: 'rawatinap', label: 'Rawat Inap', nilai: getValByName('Rawat Inap', 'jumlahNonKapitasi') },
  { key: 'anc', label: 'ANC', nilai: getValByName('ANC', 'jumlahNonKapitasi') },
  { key: 'usg_nk', label: 'USG', nilai: getValByName('USG', 'jumlahNonKapitasi') },
]);

// PAD MURNI rows per Excel layout
const padMurniRows = computed(() => [
  { key: 'ugd', label: 'UGD', nilai: getValByName('UGD', 'padRanap') },
  { key: 'rawatjalan', label: 'Rawat Jalan', nilai: getValByName('Rawat Jalan', 'padRanap') },
  { key: 'tindakanmedis', label: 'Tindakan Medis Rawat Inap', nilai: getValByName('Tindakan Medis Rawat Inap', 'padRanap') },
  { key: 'gigimulut', label: 'Gigi dan Mulut', nilai: getValByName('Gigi dan Mulut', 'padRanap') },
  { key: 'kebidanan', label: 'Kebidanan', nilai: getValByName('Kebidanan', 'padRanap') },
  { key: 'kb_pad', label: 'KB', nilai: getValByName('KB', 'padRanap') },
  { key: 'kia', label: 'KIA', nilai: getValByName('KIA', 'padRanap') },
  { key: 'tindakanrawat', label: 'Tindakan Rawat Inap', nilai: getValByName('Tindakan Rawat Inap', 'padRanap') },
  { key: 'lab', label: 'LAB', nilai: getValByName('LAB', 'padRanap') },
  { key: 'ambulans', label: 'Ambulans', nilai: getValByName('Ambulans', 'padRanap') },
  { key: 'usg_pad', label: 'USG', nilai: getValByName('USG', 'padRanap') },
  { key: 'haji', label: 'Haji', nilai: getValByName('Haji', 'padRanap') },
  { key: 'konseling', label: 'Konseling', nilai: getValByName('Konseling', 'padRanap') },
]);

const totalNonKap = computed(() => nonKapRows.value.reduce((a, r) => a + r.nilai, 0));
const totalPadMurni = computed(() => padMurniRows.value.reduce((a, r) => a + r.nilai, 0));
const totalPendapatan = computed(() => totalNonKap.value + totalPadMurni.value);

const formatRp = (num: number | undefined) => {
  if (!num || isNaN(num)) return '0';
  return new Intl.NumberFormat('id-ID').format(Math.round(num));
}
</script>

<style scoped>
#tbl-keuangan { border-collapse: collapse; width: 100%; }
#tbl-keuangan th, #tbl-keuangan td { border: 1px solid var(--border); padding: 8px 12px; font-size: 13px; }
#tbl-keuangan th { background: var(--bg-level2); font-weight: 600; }
.group-header td { padding: 6px 14px !important; }
.group-label { font-weight: 700; font-size: 12px; text-transform: uppercase; letter-spacing: 0.5px; }
.group-label.non-kap { background: #e0f2fe; color: #0369a1; }
.group-label.pad-murni { background: #dcfce7; color: #166534; }
.subtotal-row.non-kap-total { background: #dbeafe; }
.subtotal-row.pad-total { background: #d1fae5; }
.grand-total { background: #0a2540; color: #fff; font-weight: 800; }
.grand-total td { color: #7dd3fc; }
.mono { font-family: monospace; }
</style>
