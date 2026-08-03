<template>
  <div class="page-wrapper">
    <!-- Main Content Body -->
    <div class="asum-container">
      <!-- Header Section -->
      <header class="page-header">
        <div class="header-content">
          <h1 class="page-title">Import Data {{ formattedMode }} Asum</h1>
          <div class="mode-selector">
            <label for="mode-select" class="mode-label">Tipe:</label>
            <div class="select-wrapper">
              <select id="mode-select" v-model="selectedMode" @change="handleModeChange" class="custom-select">
                <option value="premi">Premi</option>
                <option value="klaim">Klaim</option>
                <option value="subrograsi">Subrograsi</option>
              </select>
            </div>
          </div>
        </div>
      </header>

      <!-- Main Workspace (Two-Column Layout) -->
      <main class="workspace-grid">
        <!-- Left Column: File Upload Box -->
        <section class="card upload-card">
          <div class="card-header">
            <h2 class="card-title">Silakan import data {{ selectedMode }} disini</h2>
          </div>
          <div class="card-body">
            <div class="dropzone-wrapper">
              <h3 class="zone-title">Upload file</h3>
              
              <!-- Reference File Dropzone -->
              <div 
                class="drop-box" 
                :class="{ 'is-dragging': isDraggingRef, 'has-file': refFile }"
                @dragover.prevent="isDraggingRef = true"
                @dragleave.prevent="isDraggingRef = false"
                @drop.prevent="handleDrop($event, 'ref')"
                @click="$refs.refInput.click()"
              >
                <input 
                  ref="refInput" 
                  type="file" 
                  accept=".xlsx, .xls, .csv" 
                  class="hidden-input" 
                  @change="handleFileSelect($event, 'ref')" 
                />
                <div class="box-content">
                  <template v-if="!refFile">
                    <UploadCloudIcon class="box-icon" />
                    <span class="box-label">Upload dataset referensi disini</span>
                  </template>
                  <template v-else>
                    <FileSpreadsheetIcon class="box-icon file-active" />
                    <div class="file-info">
                      <span class="file-name">{{ refFile.name }}</span>
                      <span class="file-meta">{{ formatFileSize(refFile.size) }}</span>
                    </div>
                    <button type="button" class="remove-btn" @click.stop="refFile = null; resetPreview()">
                      <XIcon class="btn-icon" />
                    </button>
                  </template>
                </div>
              </div>

              <!-- Main File Dropzone -->
              <div 
                class="drop-box" 
                :class="{ 'is-dragging': isDraggingMain, 'has-file': mainFile }"
                @dragover.prevent="isDraggingMain = true"
                @dragleave.prevent="isDraggingMain = false"
                @drop.prevent="handleDrop($event, 'main')"
                @click="$refs.mainInput.click()"
              >
                <input 
                  ref="mainInput" 
                  type="file" 
                  accept=".xlsx, .xls, .csv" 
                  class="hidden-input" 
                  @change="handleFileSelect($event, 'main')" 
                />
                <div class="box-content">
                  <template v-if="!mainFile">
                    <UploadCloudIcon class="box-icon" />
                    <span class="box-label">Upload dataset utama disini</span>
                  </template>
                  <template v-else>
                    <FileSpreadsheetIcon class="box-icon file-active" />
                    <div class="file-info">
                      <span class="file-name">{{ mainFile.name }}</span>
                      <span class="file-meta">{{ formatFileSize(mainFile.size) }}</span>
                    </div>
                    <button type="button" class="remove-btn" @click.stop="mainFile = null; resetPreview()">
                      <XIcon class="btn-icon" />
                    </button>
                  </template>
                </div>
              </div>

              <p class="file-hint">File yang diperbolehkan .xlsx dan .csv</p>
            </div>

            <!-- Action Button -->
            <div class="action-bar">
              <button 
                type="button" 
                class="btn btn-primary" 
                :disabled="!canProcess || isProcessing" 
                @click="processFiles"
              >
                <Loader2Icon v-if="isProcessing" class="btn-icon spin" />
                <PlayIcon v-else class="btn-icon" />
                <span>{{ isProcessing ? 'Memproses Data...' : 'Proses Data Spreading' }}</span>
              </button>
            </div>

            <!-- Error Alert -->
            <div v-if="errorMessage" class="alert alert-error">
              <AlertCircleIcon class="alert-icon" />
              <div class="alert-content">{{ errorMessage }}</div>
            </div>
          </div>
        </section>

        <!-- Right Column: SOA Preview Box -->
        <section class="card preview-card">
          <div class="card-header">
            <h2 class="card-title">SOA preview</h2>
          </div>
          <div class="card-body preview-body">
            <!-- Empty State -->
            <div v-if="!hasPreviewData && !isProcessing" class="empty-state">
              <div class="empty-icon-wrapper">
                <InfoIcon class="empty-icon" />
              </div>
              <h3 class="empty-title">Belum ada preview</h3>
              <p class="empty-subtitle">Import data terlebih dahulu!</p>
            </div>

            <!-- Loading State -->
            <div v-else-if="isProcessing" class="loading-state">
              <Loader2Icon class="spinner-icon spin" />
              <p>Sedang mengolah data spreading...</p>
            </div>

            <!-- Data Preview Result View -->
            <div v-else class="preview-results">
              <div class="file-summary-cards">
                <div class="summary-chip">
                  <FileSpreadsheetIcon class="chip-icon excel" />
                  <div class="chip-text">
                    <span class="chip-title">reaskrindo_soa_{{ selectedMode }}_result.xlsx</span>
                    <span class="chip-sub">{{ parsedData.length }} Record(s)</span>
                  </div>
                </div>
                <div class="summary-chip">
                  <FileTextIcon class="chip-icon csv" />
                  <div class="chip-text">
                    <span class="chip-title">reaskrindo_soa_{{ selectedMode }}_result.csv</span>
                    <span class="chip-sub">{{ parsedData.length }} Record(s)</span>
                  </div>
                </div>
              </div>

              <!-- Table Section -->
              <div class="table-container">
                <table class="data-table">
                  <thead>
                    <tr>
                      <th v-for="col in tableColumns" :key="col.key" :class="[col.align === 'right' ? 'text-right' : 'text-left']">
                        {{ col.label }}
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="(row, idx) in paginatedData" :key="idx">
                      <td 
                        v-for="col in tableColumns" 
                        :key="col.key"
                        :class="[
                          col.align === 'right' ? 'text-right' : 'text-left',
                          { 'font-semibold': col.bold }
                        ]"
                      >
                        {{ formatColumnValue(row[col.key], col.type) }}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <!-- Pagination -->
              <div class="pagination" v-if="totalPages > 1">
                <button 
                  class="btn-page" 
                  :disabled="currentPage === 1" 
                  @click="currentPage--"
                >
                  Sebelumnya
                </button>
                <span class="page-info">Halaman {{ currentPage }} dari {{ totalPages }}</span>
                <button 
                  class="btn-page" 
                  :disabled="currentPage === totalPages" 
                  @click="currentPage++"
                >
                  Selanjutnya
                </button>
              </div>
            </div>
          </div>

          <!-- Card Footer Downloads -->
          <div class="card-footer download-footer">
            <button 
              type="button" 
              class="btn-download" 
              :disabled="!hasPreviewData" 
              @click="downloadFile('excel')"
            >
              <DownloadIcon class="download-icon" />
              <span>Download as Excel</span>
            </button>
            <button 
              type="button" 
              class="btn-download" 
              :disabled="!hasPreviewData" 
              @click="downloadFile('csv')"
            >
              <DownloadIcon class="download-icon" />
              <span>Download as CSV</span>
            </button>
          </div>
        </section>
      </main>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, onMounted, computed } from 'vue'
import { useRoute } from 'vue-router';
import axios from 'axios'
import * as XLSX from 'xlsx'
import { 
  UploadCloudIcon, 
  FileUpIcon, 
  FileSpreadsheetIcon, 
  XIcon, 
  InfoIcon, 
  PlayIcon, 
  Loader2Icon, 
  FileTextIcon, 
  AlertCircleIcon, 
  DownloadIcon 
} from 'lucide-vue-next'

// --- State ---
const selectedMode = ref('premi')

const refFile = ref(null)
const mainFile = ref(null)
const refInput = ref(null)
const mainInput = ref(null)

const isDraggingRef = ref(false)
const isDraggingMain = ref(false)

const isProcessing = ref(false)
const hasPreviewData = ref(false)
const errorMessage = ref('')

const parsedData = ref([])
const currentPage = ref(1)
const pageSize = ref(10)

const route = useRoute();

const API_BASE_URL = 'http://127.0.0.1:8000'
const IMPORT_PLACEMENT_API = `${API_BASE_URL}/asum/api/import-soa-asum/`

const syncModeWithRoute = () => {
  const mode = route.params.mode?.toLowerCase();
  if (mode && ['premi', 'klaim', 'subrograsi'].includes(mode)) {
    selectedMode.value = mode;
  } else {
    selectedMode.value = 'premi';
  }
};

onMounted(() => {
  syncModeWithRoute();
});

watch(
  () => route.params.mode,
  () => {
    syncModeWithRoute();
    resetPreview();
  }
);


const premiColumns = [
  { key: 'Policy No.', label: 'Policy No.', bold: true },
  { key: 'Insured Name', label: 'Insured Name' },
  { key: 'COB', label: 'COB' },
  { key: 'Inception', label: 'Inception' },
  { key: 'Expiry', label: 'Expiry' },
  { key: 'Currency', label: 'Curr' },
  { key: 'UY', label: 'UY' },
  { key: 'TSI Share', label: 'TSI Share', align: 'right', type: 'currency' },
  { key: 'broker_used', label: 'Broker' },
  { key: 'security_used', label: 'Security' },
  { key: 'komisi_qs', label: 'Komisi QS', align: 'right', type: 'currency' },
  { key: 'komisi_sp', label: 'Komisi SP', align: 'right', type: 'currency' }
]

const klaimColumns = [
  { key: 'POLICY NUMBER', label: 'Policy No.', bold: true },
  { key: 'POLICYREF NUMBER', label: 'Policy Ref. No.', bold: true },
  { key: 'THE INSURED', label: 'Insured Name' },
  { key: 'COB', label: 'COB' },
  { key: 'INCEPTION', label: 'Inception' },
  { key: 'EXPIRY', label: 'Expiry' },
  { key: 'DOL', label: 'DOL_DATE' },
  { key: 'CURRENCY', label: 'Curr' },
  { key: 'UW YEAR', label: 'UY' },
  { key: 'CLAIM AMOUNT', label: 'Claim Amount', align: 'right', type: 'currency' },
  { key: 'QS', label: 'Quota Share', align: 'right', type: 'currency' },
  { key: 'SPL', label: 'Surplus', align: 'right', type: 'currency' },
  { key: 'broker_used', label: 'Broker' },
  { key: 'security_used', label: 'Security' },
  { key: 'share_qs_panel_of_share_reas', label: 'QS Share', align: 'right', type: 'percent' },
  { key: 'share_sp_panel_of_share_reas', label: 'SP Share', align: 'right', type: 'percent' },
  { key: 'multiplied_quota_share', label: 'QS Share Amt', align: 'right', type: 'currency' },
  { key: 'multiplied_surplus', label: 'SP Share Amt', align: 'right', type: 'currency' }
]

const subrograsiColumns = [...klaimColumns]

// --- Computeds ---
const formattedMode = computed(() => {
  if (!selectedMode.value) return ''
  return selectedMode.value.toUpperCase()
})

const canProcess = computed(() => Boolean(refFile.value && mainFile.value))

const tableColumns = computed(() => {
  const mode = selectedMode.value.toLowerCase()
  if (mode === 'klaim') return klaimColumns
  if (mode === 'subrograsi') return subrograsiColumns
  return premiColumns
})

const totalPages = computed(() => {
  return Math.ceil(parsedData.value.length / pageSize.value) || 1
})

const paginatedData = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value
  return parsedData.value.slice(start, start + pageSize.value)
})

// --- Helper & Reset Methods ---
const resetPreview = () => {
  hasPreviewData.value = false
  parsedData.value = []
  errorMessage.value = ''
  currentPage.value = 1
}

const handleModeChange = () => {
  resetPreview()
}

const formatFileSize = (bytes) => {
  if (!bytes) return '0 Bytes'
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

const formatColumnValue = (val, type) => {
  if (val === null || val === undefined || val === 'nan' || val === '') return '-'
  if (type === 'currency' && !isNaN(val)) {
    return Number(val).toLocaleString('id-ID', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
  }
  return val
}

// --- File Handling Methods ---
const handleFileSelect = (event, type) => {
  const files = event.target.files
  if (files && files.length > 0) {
    if (type === 'ref') refFile.value = files[0]
    if (type === 'main') mainFile.value = files[0]
    resetPreview()
  }
  event.target.value = ''
}

const handleDrop = (event, type) => {
  const files = event.dataTransfer.files
  if (!files || files.length === 0) return

  if (type === 'ref') {
    isDraggingRef.value = false
    refFile.value = files[0]
  } else if (type === 'main') {
    isDraggingMain.value = false
    mainFile.value = files[0]
  }
  resetPreview()
}

// --- API Processing ---
const processFiles = async () => {
  if (!canProcess.value || isProcessing.value) return

  isProcessing.value = true
  errorMessage.value = ''

  const formData = new FormData()
  formData.append('main_file', mainFile.value)
  formData.append('reference_file', refFile.value)
  
  // Backend expects 'jenis_soa' ('PREMI' or 'KLAIM')
  formData.append('jenis_soa', selectedMode.value.toUpperCase())
  formData.append('export_format', 'json')

  try {
    const response = await axios.post(IMPORT_PLACEMENT_API, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      timeout: 120000, // Increase to 2 minutes for large datasets
      responseType: 'json', // or 'blob' if downloading Excel directly
    })

    if (response.data && Array.isArray(response.data.results)) {
      parsedData.value = response.data.results
    } else if (Array.isArray(response.data)) {
      parsedData.value = response.data
    } else {
      parsedData.value = []
    }

    hasPreviewData.value = true
    currentPage.value = 1
  } catch (err) {
    console.error('Error importing ASUM data:', err)
    errorMessage.value = err.response?.data?.error || err.response?.data?.message || 'Gagal memproses file. Pastikan format file sesuai.'
    hasPreviewData.value = false
  } finally {
    isProcessing.value = false
  }
}

// --- Dynamic File Download (Backend or Client Fallback) ---
const downloadFile = async (format) => {
  if (!canProcess.value) return

  try {
    const formData = new FormData()
    formData.append('main_file', mainFile.value)
    formData.append('reference_file', refFile.value)
    formData.append('jenis_soa', selectedMode.value.toUpperCase())
    
    const response = await axios.post(
      `${IMPORT_PLACEMENT_API}?export_format=${format}`, 
      formData, 
      {
        responseType: 'blob',
        headers: { 'Content-Type': 'multipart/form-data' }
      }
    )

    const blob = new Blob([response.data], {
      type: format === 'excel' 
        ? 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' 
        : 'text/csv'
    })

    const link = document.createElement('a')
    link.href = window.URL.createObjectURL(blob)
    const dateStr = new Date().toISOString().slice(0, 10)
    link.download = `ASUM_Spreading_${formattedMode.value}_${dateStr}.${format === 'excel' ? 'xlsx' : 'csv'}`
    link.click()
    window.URL.revokeObjectURL(link.href)

  } catch (err) {
    console.warn('Backend download failed, rendering client sheet...', err)
    
    if (!parsedData.value.length) return
    const worksheet = XLSX.utils.json_to_sheet(parsedData.value)
    const workbook = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(workbook, worksheet, `SOA_${formattedMode.value}`)

    const fileExt = format === 'excel' ? 'xlsx' : 'csv'
    const dateStr = new Date().toISOString().slice(0, 10)
    const filename = `SOA_Spreading_${formattedMode.value}_${dateStr}.${fileExt}`

    if (format === 'excel') {
      XLSX.writeFile(workbook, filename)
    } else {
      XLSX.writeFile(workbook, filename, { bookType: 'csv' })
    }
  }
}
</script>
<style scoped>
/* Modern Resets & Base Variables */
.asum-container {
  --primary-color: #1e3a8a;
  --primary-hover: #1d4ed8;
  --bg-light-blue: #f0f4f9;
  --bg-light-orange: #fff8f0;
  --border-blue: #cbd5e1;
  --border-orange: #ffedd5;
  --accent-orange: #ea580c;
  --text-main: #1e293b;
  --text-muted: #64748b;
  
  max-width: 1200px;
  margin: 0 auto;
  padding: 24px;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
  color: var(--text-main);
}

/* Header Section */
.page-header {
  margin-bottom: 24px;
}
.header-content {
  display: flex;
  flex-direction: column;
  gap: 12px;
}
.page-title {
  font-size: 1.75rem;
  font-weight: 700;
  color: #0f172a;
  margin: 0;
}
.mode-selector {
  display: flex;
  align-items: center;
  gap: 12px;
}
.mode-label {
  font-weight: 600;
  font-size: 0.95rem;
  color: var(--text-main);
}
.select-wrapper select {
  padding: 6px 36px 6px 14px;
  border: 1px solid #cbd5e1;
  border-radius: 6px;
  background-color: #ffffff;
  font-size: 0.95rem;
  font-weight: 500;
  color: #334155;
  outline: none;
  cursor: pointer;
  transition: border-color 0.2s, box-shadow 0.2s;
}
.select-wrapper select:focus {
  border-color: var(--primary-hover);
  box-shadow: 0 0 0 3px rgba(29, 78, 216, 0.15);
}

/* Main Grid Layout */
.workspace-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 24px;
  align-items: stretch;
}

@media (max-width: 900px) {
  .workspace-grid {
    grid-template-columns: 1fr;
  }
}

/* Base Card Styling */
.card {
  border-radius: 12px;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.03);
  transition: box-shadow 0.2s;
}

.card-header {
  text-align: center;
  padding: 16px 20px 8px;
}

.card-title {
  font-size: 1.05rem;
  font-weight: 600;
  margin: 0;
  color: #1e293b;
}

/* Left Card: Import Blue Theme */
.upload-card {
  background-color: var(--bg-light-blue);
  border: 1px solid #dbeafe;
}

.dropzone-wrapper {
  padding: 16px 24px;
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.zone-title {
  font-size: 1.1rem;
  font-weight: 600;
  text-align: center;
  color: #1e3a8a;
  margin: 0 0 4px 0;
}

.drop-box {
  background-color: #ffffff;
  border: 2px dashed #94a3b8;
  border-radius: 10px;
  padding: 20px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.drop-box:hover, .drop-box.is-dragging {
  border-color: #2563eb;
  background-color: #f8fafc;
}

.drop-box.has-file {
  border-style: solid;
  border-color: #bfdbfe;
  background-color: #eff6ff;
}

.box-content {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
}

.box-icon {
  width: 24px;
  height: 24px;
  color: #64748b;
  flex-shrink: 0;
}

.box-icon.file-active {
  color: #2563eb;
}

.box-label {
  font-size: 0.95rem;
  font-weight: 500;
  color: #334155;
}

.file-info {
  display: flex;
  flex-direction: column;
  overflow: hidden;
  text-align: left;
}

.file-name {
  font-size: 0.9rem;
  font-weight: 600;
  color: #1e293b;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.file-meta {
  font-size: 0.75rem;
  color: #64748b;
}

.remove-btn {
  background: transparent;
  border: none;
  cursor: pointer;
  padding: 4px;
  margin-left: auto;
  color: #94a3b8;
  border-radius: 50%;
  display: flex;
  align-items: center;
}

.remove-btn:hover {
  color: #ef4444;
  background-color: #fee2e2;
}

.hidden-input {
  display: none;
}

.file-hint {
  font-size: 0.825rem;
  color: #64748b;
  text-align: center;
  margin: 4px 0 0 0;
}

.action-bar {
  padding: 8px 24px 20px;
}

.btn {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 10px 16px;
  border-radius: 8px;
  font-weight: 600;
  font-size: 0.95rem;
  cursor: pointer;
  border: none;
  transition: background-color 0.2s, opacity 0.2s;
}

.btn-primary {
  background-color: #1e3a8a;
  color: #ffffff;
}

.btn-primary:hover:not(:disabled) {
  background-color: #1d4ed8;
}

.btn-primary:disabled {
  background-color: #94a3b8;
  cursor: not-allowed;
  opacity: 0.7;
}

.preview-card {
  background-color: var(--bg-light-orange);
  border: 1px solid #ffedd5;
  justify-content: space-between;
}

.preview-body {
  padding: 16px;
  flex-grow: 1;
  display: flex;
  flex-direction: column;
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  min-height: 240px;
  text-align: center;
}

.empty-icon-wrapper {
  background-color: #ffedd5;
  border-radius: 50%;
  padding: 16px;
  margin-bottom: 12px;
}

.empty-icon {
  width: 36px;
  height: 36px;
  color: var(--accent-orange);
}

.empty-title {
  font-size: 1.25rem;
  font-weight: 700;
  color: var(--accent-orange);
  margin: 0 0 4px 0;
}

.empty-subtitle {
  font-size: 0.9rem;
  color: #9a3412;
  margin: 0;
}

.loading-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  min-height: 240px;
  color: var(--accent-orange);
  font-weight: 500;
}

.spinner-icon {
  width: 32px;
  height: 32px;
  margin-bottom: 8px;
}

/* Dynamic Data View in Preview Box */
.preview-results {
  display: flex;
  flex-direction: column;
  gap: 12px;
  height: 100%;
}

.file-summary-cards {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
}

.summary-chip {
  background: #ffffff;
  border: 1px solid #fed7aa;
  border-radius: 8px;
  padding: 8px 12px;
  display: flex;
  align-items: center;
  gap: 10px;
}

.chip-icon {
  width: 28px;
  height: 28px;
  flex-shrink: 0;
}

.chip-icon.excel { color: #16a34a; }
.chip-icon.csv { color: #2563eb; }

.chip-text {
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.chip-title {
  font-size: 0.8rem;
  font-weight: 600;
  color: #334155;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.chip-sub {
  font-size: 0.7rem;
  color: #64748b;
}

.table-container {
  overflow-x: auto;
  background: #ffffff;
  border-radius: 8px;
  border: 1px solid #fed7aa;
  max-height: 240px;
}

.data-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 0.8rem;
}

.data-table th, .data-table td {
  padding: 8px 12px;
  border-bottom: 1px solid #f1f5f9;
  white-space: nowrap;
}

.data-table th {
  background-color: #fff7ed;
  color: #9a3412;
  font-weight: 600;
  position: sticky;
  top: 0;
}

.text-left { text-align: left; }
.text-right { text-align: right; }
.font-semibold { font-weight: 600; }

.pagination {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: auto;
  padding-top: 8px;
}

.btn-page {
  background-color: #ffffff;
  border: 1px solid #fdba74;
  color: #c2410c;
  padding: 4px 10px;
  border-radius: 4px;
  font-size: 0.75rem;
  font-weight: 600;
  cursor: pointer;
}

.btn-page:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.page-info {
  font-size: 0.75rem;
  color: #9a3412;
}

/* Footer Export Buttons */
.download-footer {
  border-top: 1px solid #fed7aa;
  display: flex;
  flex-direction: column;
}

.btn-download {
  width: 100%;
  background-color: transparent;
  border: none;
  padding: 12px 16px;
  font-size: 0.95rem;
  font-weight: 600;
  color: var(--accent-orange);
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  cursor: pointer;
  transition: background-color 0.2s;
}

.btn-download:not(:last-child) {
  border-bottom: 1px solid #fed7aa;
}

.btn-download:hover:not(:disabled) {
  background-color: #ffedd5;
}

.btn-download:disabled {
  color: #cbd5e1;
  cursor: not-allowed;
}

.download-icon {
  width: 18px;
  height: 18px;
}

/* Alert Container */
.alert {
  margin: 0 24px 16px;
  padding: 10px 14px;
  border-radius: 6px;
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 0.85rem;
}

.alert-error {
  background-color: #fef2f2;
  border: 1px solid #fecaca;
  color: #dc2626;
}

.alert-icon {
  width: 18px;
  height: 18px;
  flex-shrink: 0;
}

/* Base Utility Animations */
.spin {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}
</style>