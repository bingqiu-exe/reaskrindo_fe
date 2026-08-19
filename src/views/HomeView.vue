<template>
  <div class="auto-mapping-container">
    <!-- Header Page -->
    <header class="page-header">
      <h1 class="page-title">Guide Import Konversi ke SOA</h1>
      <p class="page-subtitle">
        Panduan standarisasi penamaan kolom untuk mempermudah proses automapping data.
      </p>
    </header>

    <!-- Guide Workflow Card -->
    <div class="card instruction-card">
      <div class="card-header instruction-header">
        <InfoIcon class="alert-icon text-primary" />
        <h2 class="card-title">Langkah-langkah Import Data</h2>
      </div>
      <div class="card-body">
        <div class="steps-grid">
          <div v-for="(step, idx) in guideSteps" :key="idx" class="step-item">
            <span class="step-number">{{ idx + 1 }}</span>
            <p class="step-text">{{ step }}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Main Workspace Area -->
    <div class="workspace-layout">
      <!-- Tabs Selector -->
      <div class="tabs-bar">
        <button 
          v-for="tab in tabs" 
          :key="tab.id"
          class="tab-btn" 
          :class="{ active: activeTab === tab.id }"
          @click="activeTab = tab.id"
        >
          <LayersIcon class="tab-icon" />
          {{ tab.label }}
        </button>
      </div>

      <!-- Mapping Table Sheet Container -->
      <div class="card table-card">
        <div class="card-header table-header-meta">
          <div class="meta-title-group">
            <h3 class="card-title text-capitalize">
              Format Kolom: {{ activeTabLabel }}
            </h3>
            <span class="badge-hint">Cocokkan dengan nama alternatif di bawah</span>
          </div>
        </div>

        <div class="table-responsive">
          <table class="mapping-table">
            <thead>
              <tr>
                <th style="width: 20%;">Target Kolom SOA</th>
                <th style="width: 40%;">Alternatif Kolom: Premi</th>
                <th style="width: 40%;">Alternatif Kolom: Klaim</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="field in currentFields" :key="field.target">
                <td class="font-semibold text-dark">{{ field.target }}</td>
                <!-- Premi Column -->
                <td>
                  <div class="token-container">
                    <template v-if="getTokens(field, 'premi').length > 0">
                      <span 
                        v-for="token in getTokens(field, 'premi')" 
                        :key="token" 
                        class="token-chip premium"
                      >
                        {{ token }}
                      </span>
                    </template>
                    <span v-else class="token-chip disabled">(Tidak diperlukan)</span>
                  </div>
                </td>
                <!-- Klaim Column -->
                <td>
                  <div class="token-container">
                    <template v-if="getTokens(field, 'klaim').length > 0">
                      <span 
                        v-for="token in getTokens(field, 'klaim')" 
                        :key="token" 
                        class="token-chip claim"
                      >
                        {{ token }}
                      </span>
                    </template>
                    <span v-else class="token-chip disabled">(Tidak diperlukan)</span>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const activeTab = ref('asum')

const tabs = [
  { id: 'map', label: 'Mapping UY dan COB' },
  { id: 'asum', label: 'Asum Table Terms' },
  { id: 'finance', label: 'Finance Table Terms' }
]

const activeTabLabel = computed(() => {
  const found = tabs.find(t => t.id === activeTab.value)
  return found ? found.label : activeTab.value
})

const guideSteps = [
  'Klik dropdown opsi asum atau finance, pilih antara klaim atau premi.',
  'Masukan dataset referensi (Bisa didownload langsung atau dari lokal jika sudah ada). Catatan: File referensi mungkin outdated.',
  'Masukan dataset utama. Perhatikan tipe file yang dikonversi agar sesuai dengan target SOA.',
  'Klik start data processing. Konversi membutuhkan waktu beberapa menit.',
  'Klik download hasil (.xlsx atau .csv). Proses unduh dapat memakan waktu beberapa menit.',
  'SOA siap digunakan. Periksa kelengkapan data sebelum diproses lebih lanjut.'
]

// Helper method to safely access tokens regardless of structure
const getTokens = (field, type) => {
  if (field[type] && Array.isArray(field[type])) {
    return field[type]
  }
  // Fallback if 'term' is used instead of 'premi'/'klaim'
  if (field.term && Array.isArray(field.term)) {
    return field.term
  }
  return []
}

// ASUM Mappings derived directly from backend service
const asumFields = [
  {
    target: 'NO REGISTRASI / CERTIFICATE',
    premi: ['certificate no', 'certificate_no', 'no. certificate', 'no_certificate', 'no_sertifikat', 'sertifikat_no'],
    klaim: ['policyref no', 'policyref_no', 'policy_refno', 'ref_no', 'no_ref', 'no. reg', 'no_reg', 'reg_no']
  },
  {
    target: 'NO POLIS',
    premi: ['policy_no', 'policy_number', 'policy number', 'policy', 'polis', 'nopolis'],
    klaim: ['policy_no', 'policy_number', 'policy number', 'policy', 'polis', 'nopolis', 'claimno']
  },
  {
    target: 'INSURED',
    premi: ['insured_name', 'insured name', 'nama tertanggung', 'the insured', 'insured', 'nama_debitur'],
    klaim: ['insured_name', 'insured name', 'nama tertanggung', 'the insured', 'insured', 'nama_debitur']
  },
  {
    target: 'COB',
    premi: ['cob_treaty', 'cob eng', 'cob', 'cob_group', 'class_of_business', 'kode', 'product_name'],
    klaim: ['cob_treaty', 'cob eng', 'cob', 'cob_group', 'class_of_business', 'kode', 'product_name']
  },
  {
    target: 'INCEPTION',
    premi: ['inception', 'tgl_awal', 'tanggal_awal', 'start_date', 'period of ins. awal'],
    klaim: ['inception', 'tgl_awal', 'tanggal_awal', 'start_date', 'period of ins. awal']
  },
  {
    target: 'EXPIRY',
    premi: ['expiry', 'tgl_akhir', 'tanggal_akhir', 'end_date', 'period of ins. akhir'],
    klaim: ['expiry', 'tgl_akhir', 'tanggal_akhir', 'end_date', 'period of ins. akhir']
  },
  {
    target: 'DOL',
    premi: [],
    klaim: ['dol_date', 'dol final', 'dol', 'tgl_agenda', 'tanggal_agenda', 'report_date']
  },
  {
    target: 'CURRENCY',
    premi: ['currency', 'curr', 'valuta'],
    klaim: ['currency', 'curr', 'valuta']
  },
  {
    target: 'UY',
    premi: ['uy_final', 'uy', 'uw_year', 'uw year', 'uw', 'underwriting_year', 'ay', 'py'],
    klaim: ['uy_final', 'uy', 'uw_year', 'uw year', 'uw', 'underwriting_year', 'ay', 'py']
  },
  {
    target: 'CLAIM AMOUNT',
    premi: [],
    klaim: ['claim_amount', 'claim amount', 'claim_amount_idr', 'gross', 'amt_claim_set', 'gross os klaim']
  },
  {
    target: 'QUOTA SHARE',
    premi: ['quota_share', 'quota share', 'quota_share_set', 'qs', 'reas_qs', 'pct_qs', 'sor_qs'],
    klaim: ['quota_share', 'quota share', 'quota_share_set', 'qs', 'reas_qs', 'pct_qs', 'sor_qs']
  },
  {
    target: 'SURPLUS',
    premi: ['surplus', 'surplus_set', 'sp', 'spl', 'reas_sp', 'pct_sp', 'sor_sp'],
    klaim: ['surplus', 'surplus_set', 'sp', 'spl', 'reas_sp', 'pct_sp', 'sor_sp']
  }
]

// FINANCE Mappings derived directly from backend service
const financeFields = [
  {
    target: 'NO_SERTIFIKAT',
    premi: ['certificate no', 'certificate_no', 'certificate no.', 'no. certificate', 'no_certificate', 'no certificate', 'no_sertifikat', 'sertifikat_no', 'no. sertifikat', 'sertifikat no', 'no sertifikat'],
    klaim: ['certificate no', 'certificate_no', 'certificate no.', 'no. certificate', 'no_certificate', 'no certificate', 'no_sertifikat', 'sertifikat_no', 'no. sertifikat', 'sertifikat no', 'no sertifikat']
  },
  {
    target: 'NO_KLAIM',
    premi: [],
    klaim: ['no_klaim', 'no klaim', 'no. klaim', 'claim_no', 'claim no.', 'claimno']
  },
  {
    target: 'NAMA DEBITUR',
    premi: ['insured_name', 'nama tertanggung', 'the insured', 'insured', 'nama_debitur', 'debitur', 'nm_debitur'],
    klaim: ['insured_name', 'nama tertanggung', 'the insured', 'insured', 'nama_debitur', 'debitur', 'nm_debitur']
  },
  {
    target: 'COB',
    premi: ['cob_treaty', 'cob eng', 'cob', 'cob_group', 'class_of_business', 'kode', 'product_name', 'COB_treaty', 'product'],
    klaim: ['cob_treaty', 'cob eng', 'cob', 'cob_group', 'class_of_business', 'kode', 'product_name', 'COB_treaty', 'product']
  },
  {
    target: 'PRODUCT_ID',
    premi: ['product_id'],
    klaim: ['product_id']
  },
  {
    target: 'TANGGAL_AWAL',
    premi: ['inception', 'tgl_awal', 'tanggal_awal', 'start_date', 'period of ins. awal'],
    klaim: ['inception', 'tgl_awal', 'tanggal_awal', 'start_date', 'period of ins. awal']
  },
  {
    target: 'TANGGAL_AKHIR',
    premi: ['expiry', 'tgl_akhir', 'tanggal_akhir', 'end_date', 'period of ins. akhir'],
    klaim: ['expiry', 'tgl_akhir', 'tanggal_akhir', 'end_date', 'period of ins. akhir']
  },
  {
    target: 'DOL_DATE',
    premi: [],
    klaim: ['dol_date', 'dol final', 'dol', 'tgl_agenda', 'tanggal_agenda', 'report_date', 'tanggal agenda']
  },
  {
    target: 'CURRENCY',
    premi: ['currency', 'curr', 'valuta'],
    klaim: ['currency', 'curr', 'valuta']
  },
  {
    target: 'UY_FINAL',
    premi: ['uy_final', 'uy', 'underwriting_year', 'uw_year', 'uw year', 'uw', 'underwriting_year', 'ay', 'py', 'tahun'],
    klaim: ['uy_final', 'uy', 'underwriting_year', 'uw_year', 'uw year', 'uw', 'underwriting_year', 'ay', 'py', 'tahun']
  },
  {
    target: 'CLAIM_AMOUNT',
    premi: [],
    klaim: ['claim_amount', 'claim amount', 'claim_amount_idr', 'gross', 'amt_claim_set', 'gross os klaim', 'amt_outstanding', 'klaim_total (idr)', 'klaim (ori)', 'nil_klaim', 'nilai_klaim', 'total_claim']
  },
  {
    target: 'QUOTA_SHARE',
    premi: ['quota_share', 'quota share', 'quota_share_set', 'qs', 'reas_qs', 'pct_qs', 'sor_qs'],
    klaim: ['quota_share', 'quota share', 'quota_share_set', 'qs', 'reas_qs', 'pct_qs', 'sor_qs']
  },
  {
    target: 'SURPLUS',
    premi: ['surplus', 'surplus_set', 'sp', 'spl', 'reas_sp', 'pct_sp', 'sor_sp', 'sp share', 'sp_share', 'klaim_sp'],
    klaim: ['surplus', 'surplus_set', 'sp', 'spl', 'reas_sp', 'pct_sp', 'sor_sp', 'sp share', 'sp_share', 'klaim_sp']
  },
  {
    target: 'KUPERA',
    premi: ['kupera'],
    klaim: []
  },
  {
    target: 'TENOR',
    premi: ['tenor', 'tenor_bulan', 'jangka_waktu'],
    klaim: []
  },
  {
    target: 'CASHLOSS',
    premi: ['cashloss', 'cash_loss', 'info3 CC', 'cc', 'cash_call', 'cashcall'],
    klaim: []
  },
  {
    target: 'ND',
    premi: ['nd', 'info2 ND'],
    klaim: []
  },
  {
    target: 'KOMISI_QS',
    premi: ['komisi_qs', 'qs_komisi'],
    klaim: []
  },
  {
    target: 'PREMI_QS',
    premi: ['premi_qs', 'qs_premi'],
    klaim: ['premi_qs', 'qs_premi']
  },
  {
    target: 'KLAIM_QS',
    premi: ['klaim_qs', 'qs_klaim'],
    klaim: ['klaim_qs', 'qs_klaim']
  },
  {
    target: 'KOMISI_SP',
    premi: ['komisi_sp', 'sp_komisi'],
    klaim: []
  },
  {
    target: 'PREMI_SP',
    premi: ['premi_sp', 'sp_premi'],
    klaim: ['premi_sp', 'sp_premi']
  },
  {
    target: 'KLAIM_SP',
    premi: ['klaim_sp', 'sp_klaim'],
    klaim: ['klaim_sp', 'sp_klaim']
  },
  {
    target: 'RECOVERIES_QS',
    premi: ['recoveries_qs', 'qs_recoveries', 'qs_recovery', 'recovery_qs'],
    klaim: []
  },
  {
    target: 'RECOVERIES_SP',
    premi: ['recoveries_sp', 'sp_recoveries', 'sp_recovery', 'recovery_sp'],
    klaim: []
  },
  {
    target: 'TREATY_SCHEME_ID',
    premi: ['treaty_scheme_id', 'treaty_scheme', 'scheme_id', 'treaty id'],
    klaim: ['treaty_scheme_id', 'treaty_scheme', 'scheme_id', 'treaty id']
  }
]

// Mapping UY dan COB fields
const mapFields = [
  {
    target: 'TANGGAL_AWAL',
    premi: ['inception', 'tgl_awal', 'tanggal_awal', 'start_date', 'period of ins. awal', 'tanggal awal', 'inception date', 'eff_date', 'effective_date', 'tgl_efektif', 'uw_date', 'date'],
    klaim: ['inception', 'tgl_awal', 'tanggal_awal', 'start_date', 'period of ins. awal', 'tanggal awal', 'inception date', 'eff_date', 'effective_date', 'tgl_efektif', 'uw_date', 'date']
  },
  {
    target: 'TANGGAL_AKHIR',
    premi: ['expiry', 'tgl_akhir', 'tanggal_akhir', 'end_date', 'period of ins. akhir', 'tanggal akhir', 'expiry date'],
    klaim: ['expiry', 'tgl_akhir', 'tanggal_akhir', 'end_date', 'period of ins. akhir', 'tanggal akhir', 'expiry date']
  },
  {
    target: 'UY',
    premi: ['uy', 'underwriting_year', 'uw_year', 'uw year', 'uy_final', 'year', 'tahun'],
    klaim: ['uy', 'underwriting_year', 'uw_year', 'uw year', 'uy_final', 'year', 'tahun']
  },
  {
    target: 'COB',
    premi: ['product', 'product_name', 'produk', 'nama_produk', 'cob', 'class_of_business', 'toc', 'type_of_cover', 'line_of_business', 'lob', 'nama produk'],
    klaim: ['product', 'product_name', 'produk', 'nama_produk', 'cob', 'class_of_business', 'toc', 'type_of_cover', 'line_of_business', 'lob', 'nama produk']
  },
  {
    target: 'PRODUCT_ID',
    premi: ['cob_treaty', 'treaty_cob', 'cob reas', 'target_cob', 'cob_group', 'group_cob', 'cob_final', 'product_name'],
    klaim: ['cob_treaty', 'treaty_cob', 'cob reas', 'target_cob', 'cob_group', 'group_cob', 'cob_final', 'product_name']
  },
  {
    target: 'COB_TREATY',
    premi: ['cob_treaty', 'treaty_cob', 'cob reas', 'target_cob', 'cob_group', 'group_cob', 'cob_final', 'product_name'],
    klaim: ['cob_treaty', 'treaty_cob', 'cob reas', 'target_cob', 'cob_group', 'group_cob', 'cob_final', 'product_name']
  }
]

// Dynamic lookup based on selected active tab
const currentFields = computed(() => {
  switch (activeTab.value) {
    case 'finance':
      return financeFields
    case 'map':
      return mapFields
    case 'asum':
    default:
      return asumFields
  }
})
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');

.auto-mapping-container {
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  max-width: 1200px;
  margin: 0 auto;
  padding: 32px 24px;
  color: #1e293b;
}

.page-header {
  margin-bottom: 28px;
}

.page-title {
  font-size: 1.75rem;
  font-weight: 700;
  color: #0f172a;
  margin: 0 0 6px 0;
}

.page-subtitle {
  font-size: 0.95rem;
  color: #64748b;
  margin: 0;
}

/* Card General */
.card {
  background: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.04);
  margin-bottom: 24px;
  overflow: hidden;
}

.card-header {
  padding: 16px 24px;
  border-bottom: 1px solid #f1f5f9;
  display: flex;
  align-items: center;
  gap: 12px;
}

.card-title {
  font-size: 1rem;
  font-weight: 600;
  color: #0f172a;
  margin: 0;
}

.card-body {
  padding: 24px;
}

/* Instructions Setup */
.instruction-card {
  background-color: #f8fafc;
  border-left: 4px solid #1e3a8a;
}

.instruction-header {
  background-color: transparent;
  border-bottom: none;
  padding-bottom: 0;
}

.text-primary {
  color: #1e3a8a;
}

.steps-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 16px;
  margin-top: 12px;
}

.step-item {
  display: flex;
  gap: 12px;
  align-items: flex-start;
}

.step-number {
  background-color: #1e3a8a;
  color: #ffffff;
  font-size: 0.75rem;
  font-weight: 700;
  width: 22px;
  height: 22px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.step-text {
  font-size: 0.85rem;
  line-height: 1.5;
  color: #475569;
  margin: 0;
}

/* Navigation Tabs */
.tabs-bar {
  display: flex;
  gap: 8px;
  border-bottom: 2px solid #e2e8f0;
  margin-bottom: 16px;
  padding-bottom: 2px;
}

.tab-btn {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 10px 20px;
  border: none;
  background: transparent;
  font-size: 0.9rem;
  font-weight: 600;
  color: #64748b;
  cursor: pointer;
  border-bottom: 2px solid transparent;
  margin-bottom: -4px;
  transition: all 0.2s ease;
}

.tab-btn:hover {
  color: #1e3a8a;
}

.tab-btn.active {
  color: #1e3a8a;
  border-bottom-color: #1e3a8a;
}

.tab-icon {
  width: 16px;
  height: 16px;
}

/* Data Table Grid */
.table-card {
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);
}

.table-header-meta {
  justify-content: space-between;
  background-color: #f8fafc;
}

.badge-hint {
  font-size: 0.75rem;
  background-color: #eff6ff;
  color: #2563eb;
  padding: 4px 10px;
  border-radius: 12px;
  font-weight: 500;
  margin-left: 8px;
}

.text-capitalize {
  text-transform: capitalize;
}

.table-responsive {
  width: 100%;
  overflow-x: auto;
}

.mapping-table {
  width: 100%;
  border-collapse: collapse;
  text-align: left;
  font-size: 0.875rem;
}

.mapping-table th {
  background-color: #f1f5f9;
  color: #475569;
  font-weight: 600;
  padding: 14px 20px;
  border-bottom: 1px solid #e2e8f0;
}

.mapping-table td {
  padding: 16px 20px;
  border-bottom: 1px solid #f1f5f9;
  vertical-align: top;
}

.mapping-table tr:hover td {
  background-color: #f8fafc;
}

.font-semibold {
  font-weight: 600;
}

.text-dark {
  color: #0f172a;
  padding-top: 4px;
}

/* Chips/Token badges styling */
.token-container {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

.token-chip {
  display: inline-block;
  padding: 4px 8px;
  border-radius: 6px;
  font-size: 0.775rem;
  font-family: monospace;
  font-weight: 500;
  border: 1px solid transparent;
}

.token-chip.premium {
  background-color: #f0fdf4;
  color: #16a34a;
  border-color: #bbf7d0;
}

.token-chip.claim {
  background-color: #f0f9ff;
  color: #0369a1;
  border-color: #bae6fd;
}

.token-chip.disabled {
  background-color: #f1f5f9;
  color: #94a3b8;
  border-color: #e2e8f0;
  font-family: sans-serif;
  font-style: italic;
}
</style>