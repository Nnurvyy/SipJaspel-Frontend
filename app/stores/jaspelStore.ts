import { reactive, ref } from 'vue';

const bulanList = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];

const unitData = reactive({
  'ugd': { title: 'UGD', pad: 896400, tl: 537840, l: 358560, staf: [
    {no: 1, nama: 'dr. Rafi Rizki', peran: 'Dokter', bobot: '20%', nonkap: 0, pad: 71712, total: 71712},
    {no: 2, nama: 'Eva Evianti, AMAK', peran: 'Staf', bobot: '0%', nonkap: 0, pad: 0, total: 0},
    {no: 3, nama: 'H. Otong Memet', peran: 'Pejabat BLUD', bobot: '10%', nonkap: 0, pad: 35856, total: 35856},
    {no: 4, nama: 'Cicih Ratnaningsih', peran: 'Perawat', bobot: '70%', nonkap: 0, pad: 250992, total: 250992},
  ]},
  'poli-umum': { title: 'Poli Umum', pad: 1791000, tl: 1074600, l: 716400, staf: [
    {no: 1, nama: 'dr. Rafi Rizki', peran: 'Dokter', bobot: '0%', nonkap: 0, pad: 0, total: 0},
    {no: 2, nama: 'H. Otong Memet', peran: 'Pejabat BLUD', bobot: '10%', nonkap: 0, pad: 71640, total: 71640},
    {no: 3, nama: 'Staf Perawat', peran: 'Perawat', bobot: '60%', nonkap: 0, pad: 429840, total: 429840},
  ]},
  'kia': { title: 'KIA (Kesehatan Ibu & Anak)', pad: 642000, tl: 385200, l: 256800, staf: [
    {no: 1, nama: 'drg. Bertha Ayu SKS.', peran: 'Dokter', bobot: '30%', nonkap: 158400, pad: 77040, total: 235440},
    {no: 2, nama: 'Hj. Wawa Suswati, SST.', peran: 'Bidan', bobot: '60%', nonkap: 316800, pad: 154080, total: 470880},
    {no: 3, nama: 'H. Otong Memet', peran: 'Pejabat BLUD', bobot: '10%', nonkap: 52800, pad: 25680, total: 78480},
  ]}
});

const pegawaiList = reactive([
  { id: 1, nama: 'H. Otong Memet, S.Kkep., Ners., MM', nip: '19680618 198903 1 007', jabatan: 'Kepala Puskesmas', gol: 'IV/C', jenis: 'S2 Kes', bank: 'BJB', rek: '0163210169782', pj: 'Kepala Puskesmas', rekap: { nonKap: 158998, padMurni: 302905, jaspelTl: 461903, nonKapLgsg: 87360, padLgsg: 166428, jaspelLgsg: 253788, total: 715691, pphVal: 15, pphRp: 107354, bersih: 608337 } },
  { id: 2, nama: 'drg. Bertha Ayu SKS.', nip: '197510272006042013', jabatan: 'Dokter Gigi Madya', gol: 'IV/C', jenis: 'Dokter Gigi', bank: 'BJB', rek: '0064558870100', pj: 'PPTK, PJ UKM, Gigi UKP', rekap: { nonKap: 127199, padMurni: 242324, jaspelTl: 369522, nonKapLgsg: 8736, padLgsg: 216443, jaspelLgsg: 225179, total: 594701, pphVal: 15, pphRp: 89205, bersih: 505496 } },
  { id: 3, nama: 'Hj. Wawa Suswati, SST.', nip: '196605151987032006', jabatan: 'Bidan Madya', gol: 'IV/C', jenis: 'S1 Kes', bank: 'BJB', rek: '0064561030100', pj: 'Ibu UKM, Ibu Hamil UKP, Koor Bidkor', rekap: { nonKap: 74199, padMurni: 141356, jaspelTl: 215555, nonKapLgsg: 0, padLgsg: 0, jaspelLgsg: 0, total: 215555, pphVal: 15, pphRp: 32333, bersih: 183222 } },
  { id: 4, nama: 'Hj. Ida Siswati, S.Tr.Keb.', nip: '196910051993032006', jabatan: 'Bidan Ahli Madya', gol: 'IV/A', jenis: 'S1 Kes', bank: 'BJB', rek: '0011338186100', pj: 'KB UKM, KB UKP, PMKP', rekap: { nonKap: 74199, padMurni: 141356, jaspelTl: 215555, nonKapLgsg: 0, padLgsg: 0, jaspelLgsg: 0, total: 215555, pphVal: 0, pphRp: 0, bersih: 215555 } },
  { id: 5, nama: 'Nenden Dewi Irmayanti, S.IP., M.Si.', nip: '197504152008012007', jabatan: 'Ka. Sub Bagian TU', gol: 'III/C', jenis: 'S1 Non Kes', bank: 'BJB', rek: '0005357500100', pj: 'PJ Jejaring, Koor Keuangan', rekap: { nonKap: 91583, padMurni: 174473, jaspelTl: 266056, nonKapLgsg: 34944, padLgsg: 66571, jaspelLgsg: 101515, total: 367571, pphVal: 5, pphRp: 18379, bersih: 349193 } },
  { id: 6, nama: 'Hj. Siti Jamilah, S.Tr.Keb.', nip: '197001151990122001', jabatan: 'Bidan Ahli Muda', gol: 'III/D', jenis: 'S1 Kes', bank: 'BJB', rek: '0090858467101', pj: 'Hepatitis, Kecacingan', rekap: { nonKap: 74199, padMurni: 141356, jaspelTl: 215555, nonKapLgsg: 0, padLgsg: 0, jaspelLgsg: 0, total: 215555, pphVal: 5, pphRp: 10778, bersih: 204777 } },
  { id: 7, nama: 'Yayah Rokayah, Am.Keb.', nip: '197301151993012002', jabatan: 'Bidan Penyelia', gol: 'III/D', jenis: 'D3 Kes', bank: 'BJB', rek: '0064561960100', pj: 'Haji, Poned', rekap: { nonKap: 60066, padMurni: 114431, jaspelTl: 174497, nonKapLgsg: 0, padLgsg: 0, jaspelLgsg: 0, total: 174497, pphVal: 5, pphRp: 8725, bersih: 165772 } },
  { id: 8, nama: 'Cicih Ratnaningsih, A.Md.Kep.', nip: '19710316 1993032004', jabatan: 'Perawat Penyelia', gol: 'III/D', jenis: 'D3 Kes', bank: 'BJB', rek: '0011424181100', pj: 'Pustu', rekap: { nonKap: 57663, padMurni: 109853, jaspelTl: 167517, nonKapLgsg: 0, padLgsg: 0, jaspelLgsg: 0, total: 167517, pphVal: 5, pphRp: 8376, bersih: 159141 } },
  { id: 9, nama: 'Eva Evianti, AMAK, S.K.M.', nip: '198209212007012001', jabatan: 'Pranata Lab. Kes. Penyelia', gol: 'III/D', jenis: 'S1 Kes', bank: 'BJB', rek: '0005975999100', pj: 'Bend. Penerimaan, Laboratorium', rekap: { nonKap: 81266, padMurni: 154818, jaspelTl: 236084, nonKapLgsg: 17472, padLgsg: 1000126, jaspelLgsg: 1017598, total: 1253681, pphVal: 5, pphRp: 62684, bersih: 1190997 } },
  { id: 10, nama: 'Ai Apriliani S., S.K.M.', nip: '198204092008012004', jabatan: 'Sanitarian Penyelia', gol: 'III/D', jenis: 'D3 Kes', bank: 'BJB', rek: '0030217381100', pj: 'Kesling, DBD, Zoonosis, Malaria', rekap: { nonKap: 60000, padMurni: 110000, jaspelTl: 170000, nonKapLgsg: 0, padLgsg: 0, jaspelLgsg: 0, total: 170000, pphVal: 5, pphRp: 8500, bersih: 161500 } },
  { id: 11, nama: 'Yuliana, S.Gz.', nip: '198606082010012015', jabatan: 'Nutrisionis Muda', gol: 'III/D', jenis: 'S1 Kes', bank: 'BJB', rek: '0021691682100', pj: 'Gizi UKP, Gizi UKM, Konseling', rekap: { nonKap: 60000, padMurni: 110000, jaspelTl: 170000, nonKapLgsg: 0, padLgsg: 0, jaspelLgsg: 0, total: 170000, pphVal: 5, pphRp: 8500, bersih: 161500 } },
  { id: 12, nama: 'dr. Rafi Rizki', nip: '—', jabatan: 'Dokter Umum', gol: '—', jenis: 'Dokter Umum', bank: 'BJB', rek: '—', pj: 'Poli Umum, UGD', rekap: { nonKap: 107412, padMurni: 204629, jaspelTl: 312041, nonKapLgsg: 569520, padLgsg: 709512, jaspelLgsg: 1279032, total: 1591073, pphVal: 5, pphRp: 79554, bersih: 1511519 } },
  { id: 13, nama: 'Apt. Herlina, S.Farm.', nip: '—', jabatan: 'Apoteker', gol: '—', jenis: 'Apoteker', bank: 'BJB', rek: '—', pj: 'Bendahara Pengeluaran', rekap: { nonKap: 93279, padMurni: 177704, jaspelTl: 270983, nonKapLgsg: 26208, padLgsg: 49928, jaspelLgsg: 76136, total: 347120, pphVal: 5, pphRp: 17356, bersih: 329764 } },
]);

const laporanData = reactive([
  {no: 1, nama: 'H. Otong Memet, S.Kkep., Ners., MM', total: 715691, pph: 107354, bersih: 608337},
  {no: 2, nama: 'drg. Bertha Ayu SKS.', total: 594701, pph: 89205, bersih: 505496},
  {no: 3, nama: 'dr. Rafi Rizki', total: 1591073, pph: 79554, bersih: 1511519},
  {no: 4, nama: 'Eva Evianti, AMAK, S.K.M.', total: 1253681, pph: 62684, bersih: 1190997},
]);

const pageMap = {
  'dashboard': {page: 'page-dashboard', heading: 'Dashboard', sub: 'Ringkasan visual kinerja Jaspel Puskesmas'},
  'data-dasar': {page: 'page-data-dasar', heading: 'Data Dasar & Kepegawaian', sub: 'Master data pegawai aktif'},
  'struktur': {page: 'page-struktur', heading: 'Struktur Organisasi', sub: 'Susunan organisasi UPTD Puskesmas Majalengka'},
  'keuangan': {page: 'page-keuangan', heading: 'Data Keuangan & Parameter', sub: 'Realisasi pendapatan dan parameter Jaspel'},
  'rekap-all': {page: 'page-rekap-all', heading: 'Rekapitulasi Jaspel', sub: 'Distribusi Jaspel seluruh pegawai'},
  'bobot-kapitasi': {page: 'page-bobot-kapitasi', heading: 'Bobot Kapitasi & 60%', sub: 'Skema distribusi bobot staf'},
  'print-jaspel': {page: 'page-print-jaspel', heading: 'Print Jaspel', sub: 'Cetak lembar Jaspel per kategori'},
  'laporan-bulan': {page: 'page-laporan-bulan', heading: 'Laporan Bulanan', sub: 'Realisasi Jaspel per bulan 2026'},
};

// Use an object to avoid ref unpacking issues when imported, or a ref but typed correctly.
const isAuthenticated = ref(false);

export const useJaspelStore = () => {
  const authCookie = useCookie('auth_token');
  if (authCookie.value) {
    isAuthenticated.value = true;
  }

  return { bulanList, unitData, laporanData, pageMap, pegawaiList, isAuthenticated };
};
