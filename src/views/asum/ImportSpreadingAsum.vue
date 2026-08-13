<template>
  <div class="page-wrapper">
    <div class="auto-mapping-container">
      <!-- Header Section -->
      <header class="page-header">
        <div class="header-content">
          <div class="title-group">
            <h1 class="page-title">Import Data {{ formattedMode }} Asum</h1>
            <p class="page-subtitle">Unggah berkas referensi dan dataset utama untuk memproses data spreading.</p>
          </div>
          <div class="mode-selector">
            <label for="mode-select" class="mode-label">Tipe Data:</label>
            <div class="select-wrapper">
              <select id="mode-select" v-model="selectedMode" @change="handleModeChange" class="custom-select">
                <option value="premi">Premi</option>
                <option value="klaim">Klaim</option>
              </select>
            </div>
          </div>
        </div>
      </header>

      <!-- Error Alert Stack -->
      <div v-if="errorMessage" class="alert alert-error">
        <AlertCircleIcon class="alert-icon" />
        <div class="alert-content">{{ errorMessage }}</div>
        <button type="button" class="alert-close" @click="errorMessage = ''">
          <XIcon class="close-icon" />
        </button>
      </div>

      <!-- Main Workspace (Two-Column Grid) -->
      <main class="workspace-grid">
        <!-- Left Column: File Upload Area -->
        <section class="card upload-card">
          <div class="card-header">
            <h2 class="card-title">Unggah Dataset ({{ selectedMode }})</h2>
          </div>
          <div class="card-body">
            <div class="dropzone-wrapper">
              <!-- Reference File Dropzone -->
              <div class="zone-group">
                <h3 class="zone-title">Dataset Referensi</h3>
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
                      <div class="label-group">
                        <span class="box-label">Upload berkas referensi disini</span>
                        <div class="template-download-links" @click.stop>
                          <span class="text-hint">Unduh default: </span>
                          <a href="#" class="link-download-ref" @click.prevent="downloadRefTemplate('xlsx')">Excel</a>
                          <span class="divider">|</span>
                          <a href="#" class="link-download-ref" @click.prevent="downloadRefTemplate('csv')">CSV</a>
                        </div>
                      </div>
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
              </div>

              <!-- Main File Dropzone -->
              <div class="zone-group">
                <h3 class="zone-title">Dataset Utama</h3>
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
                      <div class="label-group">
                        <span class="box-label">Upload berkas utama disini</span>
                        <span class="box-sublabel">Format data primer sistem</span>
                      </div>
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
              </div>

              <p class="file-hint">Format berkas yang didukung: .xlsx, .xls, .csv</p>
            </div>

            <!-- Action Trigger Button -->
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
          </div>
        </section>

        <!-- Right Column: SOA Live Data Preview Box -->
        <section class="card preview-card">
          <div class="card-header">
            <h2 class="card-title">SOA Preview Data</h2>
          </div>
          
          <div class="card-body preview-body" :class="{ 'has-data': hasPreviewData && !isProcessing }">
            <!-- Empty State Layout -->
            <div v-if="!hasPreviewData && !isProcessing" class="state-container">
              <div class="empty-icon-wrapper">
                <InfoIcon class="empty-icon" />
              </div>
              <h3 class="state-title">Belum Ada Preview</h3>
              <p class="state-sub">Silakan unggah dan selesaikan pengisian berkas di sebelah kiri terlebih dahulu.</p>
            </div>

            <!-- Pending Loading State -->
            <div v-else-if="isProcessing" class="state-container">
              <Loader2Icon class="spinner-icon spin" />
              <h3 class="state-title">Sedang Memproses</h3>
              <p class="state-sub">Harap tunggu sebentar, sistem sedang mengolah data spreading...</p>
            </div>

            <!-- Success Content View -->
            <div v-else class="preview-results">
              <div class="file-summary-cards">
                <div class="summary-chip">
                  <FileSpreadsheetIcon class="chip-icon excel" />
                  <div class="chip-text">
                    <span class="chip-title">reaskrindo_soa_{{ selectedMode }}_result.xlsx</span>
                    <span class="chip-sub">{{ parsedData.length }} Records Siap</span>
                  </div>
                </div>
                <div class="summary-chip">
                  <FileTextIcon class="chip-icon csv" />
                  <div class="chip-text">
                    <span class="chip-title">reaskrindo_soa_{{ selectedMode }}_result.csv</span>
                    <span class="chip-sub">{{ parsedData.length }} Records Siap</span>
                  </div>
                </div>
              </div>

              <!-- Data Stream Table Sheet Container -->
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
                        :data-label="col.label"
                        :class="[
                          col.align === 'right' ? 'text-right' : 'text-left',
                          { 'font-semibold': col.bold }
                        ]"
                      >
                        <span class="cell-value">{{ formatColumnValue(row[col.key], col.type) }}</span>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <!-- Embedded Small Pagination Wrapper -->
              <div class="pagination-footer" v-if="totalPages > 1">
                <button 
                  class="btn-page" 
                  :disabled="currentPage === 1" 
                  @click="currentPage--"
                >
                  Sebelumnya
                </button>
                <span class="page-info">Halaman <strong>{{ currentPage }}</strong> dari {{ totalPages }}</span>
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

          <!-- Component Interactive Action Footer Export -->
          <div class="card-footer download-footer">
            <button 
              type="button" 
              class="btn-download" 
              :disabled="!hasPreviewData || isProcessing" 
              @click="downloadFile('excel')"
            >
              <DownloadIcon class="download-icon" />
              <span>Download Excel</span>
            </button>
            <button 
              type="button" 
              class="btn-download btn-secondary-download" 
              :disabled="!hasPreviewData || isProcessing" 
              @click="downloadFile('csv')"
            >
              <DownloadIcon class="download-icon" />
              <span>Download CSV</span>
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
const DOWNLOAD_REF_API = `${API_BASE_URL}/auto-mapping/api/download-reference/`

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
  { key: 'POLICY NUMBER', label: 'Policy No.', bold: true },
  { key: 'CERTIFICATE NO', label: 'No. Sertifikat', bold: true },
  { key: 'INSURED NAME', label: 'Insured Name' },
  { key: 'COB', label: 'COB' },
  { key: 'INCEPTION', label: 'Period of Ins. AWAL' },
  { key: 'EXPIRY', label: 'Period of Ins. AKHIR' },
  { key: 'CURRENCY', label: 'Curr' },
  { key: 'UW YEAR', label: 'UY' },
  { key: 'QS', label: 'Quota Share', align: 'right', type: 'currency' },
  { key: 'SPL', label: 'Surplus', align: 'right', type: 'currency' },
  { key: 'broker_used', label: 'Broker' },
  { key: 'security_used', label: 'Security' },
  { key: 'share_qs_panel_of_share_reas', label: 'QS Share', align: 'right', type: 'percent' },
  { key: 'share_sp_panel_of_share_reas', label: 'SP Share', align: 'right', type: 'percent' },
  { key: 'komisi_qs_per_panel', label: 'Komisi QS', align: 'right', type: 'percent' },
  { key: 'komisi_sp_per_panel', label: 'Komisi SP', align: 'right', type: 'percent' },
  { key: 'multiplied_quota_share', label: 'QS Share Amt', align: 'right', type: 'currency' },
  { key: 'multiplied_surplus', label: 'SP Share Amt', align: 'right', type: 'currency' },
  { key: 'multiplied_komisi_qs', label: 'Komisi QS Share Amt', align: 'right', type: 'currency' },
  { key: 'multiplied_komisi_sp', label: 'Komisi SP Share Amt', align: 'right', type: 'currency' },
]

const klaimColumns = [
  { key: 'POLICY NUMBER', label: 'Policy No.', bold: true },
  { key: 'NOMOR REGISTRASI', label: 'No. Registrasi', bold: true },
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
      timeout: 120000,
      responseType: 'json',
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

const downloadRefTemplate = async (format) => {
  errorMessage.value = ''
  
  try {
    const response = await axios.get(`${DOWNLOAD_REF_API}?format=${format}`, {
      responseType: 'blob'
    })
    
    const targetFilename = format === 'csv' ? 'QRY TRATY DAN MAIN CONTRACT TREATY - used database final 20052026 - SQL.csv' : 'QRY TRATY DAN MAIN CONTRACT TREATY - used database final 20052026 - SQL.xlsx'

    const downloadBlob = new Blob([response.data])
    const url = window.URL.createObjectURL(downloadBlob)
    const link = document.createElement('a')
    link.href = url
    link.setAttribute('download', targetFilename)
    document.body.appendChild(link)
    link.click()
    link.remove()
    window.URL.revokeObjectURL(url)
  } catch (err) {
    if (err.response && err.response.data instanceof Blob) {
      const text = await err.response.data.text()
      try {
        const json = JSON.parse(text)
        errorMessage.value = json.error || 'Gagal mengunduh template referensi.'
      } catch {
        errorMessage.value = 'Template referensi tidak ditemukan pada server.'
      }
    } else {
      errorMessage.value = `Gagal mengunduh file referensi template format ${format.toUpperCase()}.`
    }
  }
}

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
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');

.auto-mapping-container {
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  max-width: 1200px;
  margin: 0 auto;
  padding: 24px;
  color: #1e293b;
}

.hidden-input {
  display: none;
}

/* Header UI Layout */
.page-header {
  margin-bottom: 24px;
  padding-bottom: 16px;
  border-bottom: 1px solid #e2e8f0;
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 20px;
  flex-wrap: wrap;
}

.page-title {
  font-size: 1.5rem;
  font-weight: 700;
  color: #0f172a;
  margin: 0 0 4px 0;
}

.page-subtitle {
  font-size: 0.875rem;
  color: #64748b;
  margin: 0;
}

.mode-selector {
  display: flex;
  align-items: center;
  gap: 10px;
  background-color: #f8fafc;
  padding: 6px 12px;
  border-radius: 8px;
  border: 1px solid #e2e8f0;
}

.mode-label {
  font-size: 0.875rem;
  font-weight: 600;
  color: #475569;
}

.custom-select {
  padding: 6px 24px 6px 10px;
  border: 1px solid #cbd5e1;
  border-radius: 6px;
  background-color: #ffffff;
  font-size: 0.875rem;
  font-weight: 500;
  color: #1e293b;
  outline: none;
  cursor: pointer;
}

.custom-select:focus {
  border-color: #1e3a8a;
}

/* Alert Notification Banner styling */
.alert {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  border-radius: 8px;
  margin-bottom: 24px;
}

.alert-error {
  background-color: #fef2f2;
  border: 1px solid #fecaca;
  color: #991b1b;
}

.alert-icon {
  width: 20px;
  height: 20px;
  flex-shrink: 0;
}

.alert-content {
  flex: 1;
  font-size: 0.875rem;
  font-weight: 500;
}

.alert-close {
  background: transparent;
  border: none;
  cursor: pointer;
  color: #991b1b;
  display: flex;
  padding: 2px;
}

.close-icon {
  width: 16px;
  height: 16px;
}

/* Workspace Layout structural grids */
.workspace-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 24px;
}

@media (max-width: 1024px) {
  .workspace-grid {
    grid-template-columns: 1fr;
  }
}

/* Unified Card Shell Elements */
.card {
  background: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
  display: flex;
  flex-direction: column;
  min-width: 0; /* Prevents flex children from bursting out of boundaries */
}

.card-header {
  padding: 16px 20px;
  border-bottom: 1px solid #f1f5f9;
}

.card-title {
  font-size: 1rem;
  font-weight: 600;
  color: #0f172a;
  margin: 0;
}

.card-body {
  padding: 20px;
  display: flex;
  flex-direction: column;
  flex: 1;
  min-width: 0;
}

/* Advanced Dropzone and File Attachment Blocks */
.dropzone-wrapper {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.zone-group {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.zone-title {
  font-size: 0.825rem;
  font-weight: 600;
  color: #475569;
  text-transform: uppercase;
  letter-spacing: 0.025em;
}

.drop-box {
  border: 2px dashed #cbd5e1;
  border-radius: 8px;
  padding: 16px;
  cursor: pointer;
  background-color: #f8fafc;
  transition: all 0.2s ease;
}

.drop-box:hover {
  border-color: #94a3b8;
  background-color: #f1f5f9;
}

.drop-box.is-dragging {
  border-color: #2563eb;
  background-color: #eff6ff;
}

.drop-box.has-file {
  border-style: solid;
  border-color: #e2e8f0;
  background-color: #ffffff;
}

.box-content {
  display: flex;
  align-items: center;
  gap: 12px;
  width: 100%;
}

.box-icon {
  width: 28px;
  height: 28px;
  color: #64748b;
  flex-shrink: 0;
}

.box-icon.file-active {
  color: #2563eb;
}

.label-group {
  display: flex;
  flex-direction: column;
  text-align: left;
}

.box-label {
  font-size: 0.875rem;
  font-weight: 500;
  color: #334155;
}

.box-sublabel {
  font-size: 0.75rem;
  color: #94a3b8;
}

.file-info {
  display: flex;
  flex-direction: column;
  flex: 1;
  overflow: hidden;
  text-align: left;
}

.file-name {
  font-size: 0.875rem;
  font-weight: 500;
  color: #0f172a;
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
  color: #94a3b8;
  padding: 4px;
  cursor: pointer;
  border-radius: 4px;
  transition: color 0.15s;
  display: flex;
  align-items: center;
}

.remove-btn:hover {
  color: #ef4444;
  background-color: #fee2e2;
}

.btn-icon {
  width: 18px;
  height: 18px;
}

.file-hint {
  font-size: 0.75rem;
  color: #94a3b8;
  margin-top: 4px;
  text-align: center;
}

/* Template download link items inside boxes */
.template-download-links {
  margin-top: 4px;
  font-size: 0.775rem;
}

.link-download-ref {
  color: #2563eb;
  text-decoration: underline;
  font-weight: 500;
  padding: 0 4px;
}

.link-download-ref:hover {
  color: #1d4ed8;
}

.divider {
  color: #cbd5e1;
  margin: 0 2px;
}

.text-hint {
  color: #64748b;
}

/* Lower Section Workspace Sub-Actions */
.action-bar {
  margin-top: 20px;
}

.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  width: 100%;
  padding: 12px 16px;
  border-radius: 8px;
  font-size: 0.875rem;
  font-weight: 600;
  border: none;
  cursor: pointer;
  transition: background-color 0.15s ease;
}

.btn-primary {
  background-color: #1e3a8a;
  color: #ffffff;
}

.btn-primary:hover:not(:disabled) {
  background-color: #1e40af;
}

.btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

/* Preview Sheet Control Blocks */
.preview-body {
  padding: 24px;
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 340px;
  background-color: #fafafa;
  min-width: 0;
}

.preview-body.has-data {
  display: block;
  padding: 20px;
  background-color: #ffffff;
}

.state-container {
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  max-width: 320px;
}

.spinner-icon {
  width: 36px;
  height: 36px;
  color: #1e3a8a;
  margin-bottom: 12px;
}

.empty-icon-wrapper {
  background-color: #f1f5f9;
  padding: 16px;
  border-radius: 50%;
  margin-bottom: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.empty-icon {
  width: 28px;
  height: 28px;
  color: #64748b;
}

.state-title {
  font-size: 0.95rem;
  font-weight: 600;
  color: #334155;
  margin: 0 0 6px 0;
}

.state-sub {
  font-size: 0.825rem;
  color: #64748b;
  margin: 0;
  line-height: 1.5;
}

/* Processed Table & Result List Section */
.preview-results {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 16px;
  min-width: 0;
}

.file-summary-cards {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
}

@media (max-width: 600px) {
  .file-summary-cards {
    grid-template-columns: 1fr;
  }
}

.summary-chip {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px 14px;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  background-color: #f8fafc;
  overflow: hidden;
}

.chip-icon {
  width: 24px;
  height: 24px;
  flex-shrink: 0;
}

.chip-icon.excel { color: #16a34a; }
.chip-icon.csv { color: #0284c7; }

.chip-text {
  display: flex;
  flex-direction: column;
  overflow: hidden;
  text-align: left;
}

.chip-title {
  font-size: 0.815rem;
  font-weight: 600;
  color: #1e293b;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.chip-sub {
  font-size: 0.725rem;
  color: #16a34a;
  font-weight: 500;
}

/* Dynamic & Constrained Datatable Elements */
.table-container {
  width: 100%;
  overflow-x: auto;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  max-height: 320px;
  background: #ffffff;
  /* Smooth internal scrolling for desktop layouts */
  -webkit-overflow-scrolling: touch; 
}

.data-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 0.815rem;
  text-align: left;
}

.data-table th, .data-table td {
  padding: 10px 14px;
  border-bottom: 1px solid #f1f5f9;
  white-space: nowrap;
}

.data-table th {
  background-color: #f8fafc;
  color: #475569;
  font-weight: 600;
  position: sticky;
  top: 0;
  z-index: 10;
  border-bottom: 1px solid #e2e8f0;
}

.text-left { text-align: left; }
.text-right { text-align: right; }
.font-semibold { font-weight: 600; }

/* Dynamic Mobile Transformation CSS (Busts Table down to Cards on Mobile Screens) */
@media (max-width: 640px) {
  .table-container {
    max-height: none; /* Let column stacks expand naturally */
    border: none;
  }

  .data-table, .data-table thead, .data-table tbody, .data-table th, .data-table td, .data-table tr {
    display: block;
  }

  .data-table thead {
    display: none; /* Hide traditional headers */
  }

  .data-table tr {
    background: #ffffff;
    border: 1px solid #e2e8f0;
    border-radius: 8px;
    margin-bottom: 12px;
    padding: 8px 12px;
    box-shadow: 0 1px 2px rgba(0, 0, 0, 0.02);
  }

  .data-table td {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 6px 0;
    border-bottom: 1px dashed #f1f5f9;
    white-space: normal; /* Wraps long text inside rows */
    text-align: right !important; /* Force data right */
  }

  .data-table td:last-child {
    border-bottom: none;
  }

  /* Insert Dynamic Labels using attribute reflection mapping */
  .data-table td::before {
    content: attr(data-label);
    font-weight: 600;
    color: #64748b;
    font-size: 0.775rem;
    text-align: left;
    padding-right: 8px;
  }
  
  .cell-value {
    max-width: 60%;
    word-break: break-word;
  }
}

/* Micro Pagination Strip */
.pagination-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 4px;
  gap: 8px;
}

.btn-page {
  background-color: #ffffff;
  border: 1px solid #cbd5e1;
  color: #475569;
  padding: 5px 12px;
  border-radius: 6px;
  font-size: 0.75rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.15s;
}

.btn-page:hover:not(:disabled) {
  background-color: #f8fafc;
  border-color: #94a3b8;
}

.btn-page:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.page-info {
  font-size: 0.775rem;
  color: #64748b;
  white-space: nowrap;
}

/* Card Final Data Export Footers */
.download-footer {
  padding: 16px 20px;
  border-top: 1px solid #f1f5f9;
  display: flex;
  gap: 12px;
  background-color: #f8fafc;
  flex-wrap: wrap;
}

.btn-download {
  flex: 1;
  min-width: 130px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  padding: 10px 14px;
  border-radius: 6px;
  font-size: 0.85rem;
  font-weight: 600;
  background-color: #16a34a;
  color: #ffffff;
  border: none;
  cursor: pointer;
  transition: background-color 0.15s;
}

.btn-download:hover:not(:disabled) {
  background-color: #15803d;
}

.btn-secondary-download {
  background-color: #0284c7;
}

.btn-secondary-download:hover:not(:disabled) {
  background-color: #0369a1;
}

.btn-download:disabled {
  background-color: #e2e8f0;
  color: #94a3b8;
  cursor: not-allowed;
}

.download-icon {
  width: 16px;
  height: 16px;
}

/* Utility Animations */
.spin {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}
</style>