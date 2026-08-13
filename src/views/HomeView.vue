<template>
  <div class="auto-mapping-container">
    <!-- Header Page -->
    <header class="page-header">
      <h1 class="page-title">Guide Import Konversi ke SOA</h1>
      <p class="page-subtitle">Panduan standarisasi penamaan kolom untuk mempermudah proses automapping data.</p>
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
          class="tab-btn" 
          :class="{ active: activeTab === 'asum' }"
          @click="activeTab = 'asum'"
        >
          <LayersIcon class="tab-icon" />
          Asum Table Map
        </button>
        <button 
          class="tab-btn" 
          :class="{ active: activeTab === 'finance' }"
          @click="activeTab = 'finance'"
        >
          <LayersIcon class="tab-icon" />
          Finance Table Map
        </button>
        <button 
          class="tab-btn" 
          :class="{ active: activeTab === 'kp' }"
          @click="activeTab = 'kp'"
        >
          <LayersIcon class="tab-icon" />
          Kredit Program Map
        </button>
      </div>

      <!-- Mapping Table Sheet Container -->
      <div class="card table-card">
        <div class="card-header table-header-meta">
          <div class="meta-title-group">
            <h3 class="card-title text-capitalize">Format Kolom: {{ activeTab === 'kp' ? 'Kredit Program' : activeTab }}</h3>
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
              <tr v-for="field in fields" :key="field.label">
                <td class="font-semibold text-dark">{{ field.label }}</td>
                <td>
                  <div class="token-container">
                    <span 
                      v-for="token in field.premi.split(', ')" 
                      :key="token" 
                      class="token-chip premium"
                    >
                      {{ token }}
                    </span>
                  </div>
                </td>
                <td>
                  <div class="token-container">
                    <span 
                      v-for="token in field.klaim.split(', ')" 
                      :key="token"
                      class="token-chip"
                      :class="token.includes('Tidak') ? 'disabled' : 'claim'"
                    >
                      {{ token }}
                    </span>
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

            <!-- <div class="guide-asum-table">
                <table class="asum-table">
                    <tr>
                        <th>
                            Premi
                        </th>
                        <th>
                            Klaim
                        </th>
                    </tr>
                    <tr>
                        <td>
                            NO POLIS:\npolicy number, policy_number, policy_no, policy_num, no_polis, no. polis, nomor polis, nomor_polis, policynum, nopolis
                        </td>
                        <td>
                            NO POLIS:\npolicy number, policy_number, policy_no, policy_num, no_polis, no. polis, nomor polis, nomor_polis, policynum, nopolis
                        </td>
                    </tr>
                    <tr>
                        <td>
                            NO REGISTRASI:\nno_reg, no.reg, noreg, no_registrasi, no. registrasi, nomor registrasi,  nomor_registrasi, reg_no, registration_no
                        </td>
                        <td>
                            (Tidak diperlukan)
                        </td>
                    </tr>
                    <tr>
                        <td>
                            INSURED:\ninsured_name, the insured, insured, insured name
                        </td>
                        <td>
                            INSURED:\ninsured_name, the insured, insured, insured name
                        </td>
                    </tr>
                    <tr>
                        <td>
                            COB:\ncob_treaty, cob, cob treaty
                        </td>
                        <td>
                            COB:\ncob_treaty, cob, cob treaty
                        </td>
                    </tr>
                    <tr>
                        <td>
                            INCEPTION:\ninception, tgl_awal, tanggal_awal, start_date
                        </td>
                        <td>
                            INCEPTION:\ninception, tgl_awal, tanggal_awal, start_date
                        </td>
                    </tr>
                    <tr>
                        <td>
                            EXPIRY:\nexpiry, tgl_akhir, tanggal_akhir, end_date
                        </td>
                        <td>
                            EXPIRY:\nexpiry, tgl_akhir, tanggal_akhir, end_date
                        </td>
                    </tr>
                    <tr>
                        <td>
                            DOL:\ndol_date, dol
                        </td>
                        <td>
                            DOL:\ndol_date, dol
                        </td>
                    </tr>
                    <tr>
                        <td>
                            CURRENCY:\ncurrency, curr, valuta
                        </td>
                        <td>
                            CURRENCY:\ncurrency, curr, valuta
                        </td>
                    </tr>
                    <tr>
                        <td>
                            UY:\nuy_final, uy, uw_year, uw year
                        </td>
                        <td>
                            UY:\nuy_final, uy, uw_year, uw year
                        </td>
                    </tr>
                    <tr>
                        <td>
                            CLAIM AMOUNT:\nclaim_amount, claim amount, claimamount
                        </td>
                        <td>
                            TSI SHARE:\ntsi share, tsi_share, tsi
                        </td>
                    </tr>
                    <tr>
                        <td>
                            QUOTA SHARE:\nquota_share, qs, quota_share
                        </td>
                        <td>
                            QUOTA SHARE:\nquota_share, qs, quota_share
                        </td>
                    </tr>
                    <tr>
                        <td>
                            SURPLUS:\nsurplus, sp, spl
                        </td>
                        <td>
                            SURPLUS:\nsurplus, sp, spl
                        </td>
                    </tr>
                </table>
            </div>
            <div class="guide-finance-table">
                <table class="finance-table">
                    <tr>
                        <th>
                            Premi
                        </th>
                        <th>
                            Klaim
                        </th>
                    </tr>
                    <tr>
                        <td>
                            NO POLIS:\npolicy number, policy_number, policy_no, policy_num, no_polis, no. polis, nomor polis, nomor_polis, policynum, nopolis
                        </td>
                        <td>
                            NO POLIS:\npolicy number, policy_number, policy_no, policy_num, no_polis, no. polis, nomor polis, nomor_polis, policynum, nopolis
                        </td>
                    </tr>
                    <tr>
                        <td>
                            NO REGISTRASI:\nno_reg, no.reg, noreg, no_registrasi, no. registrasi, nomor registrasi,  nomor_registrasi, reg_no, registration_no
                        </td>
                        <td>
                            (Tidak diperlukan)
                        </td>
                    </tr>
                    <tr>
                        <td>
                            INSURED:\ninsured_name, the insured, insured, insured name
                        </td>
                        <td>
                            INSURED:\ninsured_name, the insured, insured, insured name
                        </td>
                    </tr>
                    <tr>
                        <td>
                            COB:\ncob_treaty, cob, cob treaty
                        </td>
                        <td>
                            COB:\ncob_treaty, cob, cob treaty
                        </td>
                    </tr>
                    <tr>
                        <td>
                            INCEPTION:\ninception, tgl_awal, tanggal_awal, start_date
                        </td>
                        <td>
                            INCEPTION:\ninception, tgl_awal, tanggal_awal, start_date
                        </td>
                    </tr>
                    <tr>
                        <td>
                            EXPIRY:\nexpiry, tgl_akhir, tanggal_akhir, end_date
                        </td>
                        <td>
                            EXPIRY:\nexpiry, tgl_akhir, tanggal_akhir, end_date
                        </td>
                    </tr>
                    <tr>
                        <td>
                            DOL:\ndol_date, dol
                        </td>
                        <td>
                            DOL:\ndol_date, dol
                        </td>
                    </tr>
                    <tr>
                        <td>
                            CURRENCY:\ncurrency, curr, valuta
                        </td>
                        <td>
                            CURRENCY:\ncurrency, curr, valuta
                        </td>
                    </tr>
                    <tr>
                        <td>
                            UY:\nuy_final, uy, uw_year, uw year
                        </td>
                        <td>
                            UY:\nuy_final, uy, uw_year, uw year
                        </td>
                    </tr>
                    <tr>
                        <td>
                            CLAIM AMOUNT:\nclaim_amount, claim amount, claimamount
                        </td>
                        <td>
                            TSI SHARE:\ntsi share, tsi_share, tsi
                        </td>
                    </tr>
                    <tr>
                        <td>
                            QUOTA SHARE:\nquota_share, qs, quota_share
                        </td>
                        <td>
                            QUOTA SHARE:\nquota_share, qs, quota_share
                        </td>
                    </tr>
                    <tr>
                        <td>
                            SURPLUS:\nsurplus, sp, spl
                        </td>
                        <td>
                            SURPLUS:\nsurplus, sp, spl
                        </td>
                    </tr>
                </table>
            </div>
            <div class="guide-kp-table">
                <table class="kp-table">
                    <tr>
                        <th>
                            Premi
                        </th>
                        <th>
                            Klaim
                        </th>
                    </tr>
                    <tr>
                        <td>
                            NO POLIS:\npolicy number, policy_number, policy_no, policy_num, no_polis, no. polis, nomor polis, nomor_polis, policynum, nopolis
                        </td>
                        <td>
                            NO POLIS:\npolicy number, policy_number, policy_no, policy_num, no_polis, no. polis, nomor polis, nomor_polis, policynum, nopolis
                        </td>
                    </tr>
                    <tr>
                        <td>
                            NO REGISTRASI:\nno_reg, no.reg, noreg, no_registrasi, no. registrasi, nomor registrasi,  nomor_registrasi, reg_no, registration_no
                        </td>
                        <td>
                            (Tidak diperlukan)
                        </td>
                    </tr>
                    <tr>
                        <td>
                            INSURED:\ninsured_name, the insured, insured, insured name
                        </td>
                        <td>
                            INSURED:\ninsured_name, the insured, insured, insured name
                        </td>
                    </tr>
                    <tr>
                        <td>
                            COB:\ncob_treaty, cob, cob treaty
                        </td>
                        <td>
                            COB:\ncob_treaty, cob, cob treaty
                        </td>
                    </tr>
                    <tr>
                        <td>
                            INCEPTION:\ninception, tgl_awal, tanggal_awal, start_date
                        </td>
                        <td>
                            INCEPTION:\ninception, tgl_awal, tanggal_awal, start_date
                        </td>
                    </tr>
                    <tr>
                        <td>
                            EXPIRY:\nexpiry, tgl_akhir, tanggal_akhir, end_date
                        </td>
                        <td>
                            EXPIRY:\nexpiry, tgl_akhir, tanggal_akhir, end_date
                        </td>
                    </tr>
                    <tr>
                        <td>
                            DOL:\ndol_date, dol
                        </td>
                        <td>
                            DOL:\ndol_date, dol
                        </td>
                    </tr>
                    <tr>
                        <td>
                            CURRENCY:\ncurrency, curr, valuta
                        </td>
                        <td>
                            CURRENCY:\ncurrency, curr, valuta
                        </td>
                    </tr>
                    <tr>
                        <td>
                            UY:\nuy_final, uy, uw_year, uw year
                        </td>
                        <td>
                            UY:\nuy_final, uy, uw_year, uw year
                        </td>
                    </tr>
                    <tr>
                        <td>
                            CLAIM AMOUNT:\nclaim_amount, claim amount, claimamount
                        </td>
                        <td>
                            TSI SHARE:\ntsi share, tsi_share, tsi
                        </td>
                    </tr>
                    <tr>
                        <td>
                            QUOTA SHARE:\nquota_share, qs, quota_share
                        </td>
                        <td>
                            QUOTA SHARE:\nquota_share, qs, quota_share
                        </td>
                    </tr>
                    <tr>
                        <td>
                            SURPLUS:\nsurplus, sp, spl
                        </td>
                        <td>
                            SURPLUS:\nsurplus, sp, spl
                        </td>
                    </tr>
                </table>
            </div> -->

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
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 20px;
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