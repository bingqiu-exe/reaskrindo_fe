<template>
  <div class="auto-mapping-container">
    <!-- Header Section -->
    <header class="page-header">
      <div class="header-content">
        <h1 class="page-title">Mapping UY dan COB</h1>
        <p class="page-subtitle">Upload dataset utama dan referensi untuk otomatisasi mapping data.</p>
      </div>
    </header>

    <!-- Global Success Alert -->
    <Transition name="fade">
      <div v-if="successMessage" class="alert alert-success">
        <CheckCircle2Icon class="alert-icon text-success" />
        <div class="alert-content">{{ successMessage }}</div>
        <button type="button" class="alert-close" @click="successMessage = ''">
          <XIcon class="close-icon" />
        </button>
      </div>
    </Transition>

    <!-- Global Error Alert -->
    <Transition name="fade">
      <div v-if="errorMessage" class="alert alert-error">
        <AlertCircleIcon class="alert-icon text-error" />
        <div class="alert-content">{{ errorMessage }}</div>
        <button type="button" class="alert-close" @click="errorMessage = ''">
          <XIcon class="close-icon" />
        </button>
      </div>
    </Transition>

    <!-- Main Workspace Grid -->
    <div class="workspace-grid">
      
      <!-- Left Card: Upload Inputs -->
      <section class="card upload-card">
        <div class="card-header">
          <h2 class="card-title">Import Data ASUM / Finance</h2>
        </div>
        
        <div class="card-body">
          <div class="dropzone-wrapper">
            <span class="zone-title">Upload Files</span>
            
            <!-- Reference File Dropzone -->
            <div 
              class="drop-box" 
              :class="{ 'is-dragging': isDraggingRef, 'has-file': referenceFile }"
              @dragover.prevent="isDraggingRef = true"
              @dragleave.prevent="isDraggingRef = false"
              @drop.prevent="handleDrop($event, 'ref')"
              @click="triggerFileInput('refInput')"
            >
              <input 
                ref="refInput" 
                type="file" 
                accept=".xlsx, .xls, .csv" 
                class="hidden-input" 
                @change="handleFileChange($event, 'ref')" 
              />
              <div class="box-content">
                <template v-if="!referenceFile">
                  <UploadCloudIcon class="box-icon" />
                  <div class="label-group">
                    <span class="box-label">Dataset Referensi</span>
                    <span class="box-sublabel">Klik atau tarik file ke sini (Opsional)</span>
                    
                    <div class="template-download-links" @click.stop>
                      <small class="text-hint">Unduh Referensi Default: </small>
                      <a href="#" class="link-download-ref" @click.prevent="downloadRefTemplate('xlsx')">Excel</a>
                      <span class="divider"> | </span>
                      <a href="#" class="link-download-ref" @click.prevent="downloadRefTemplate('csv')">CSV</a>
                    </div>
                  </div>
                </template>
                <template v-else>
                  <FileSpreadsheetIcon class="box-icon file-active" />
                  <div class="file-info">
                    <span class="file-name">{{ referenceFile.name }}</span>
                    <span class="file-meta">{{ formatFileSize(referenceFile.size) }}</span>
                  </div>
                  <button type="button" class="remove-btn" @click.stop="removeFile('ref')">
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
              @click="triggerFileInput('mainInput')"
            >
              <input 
                ref="mainInput" 
                type="file" 
                accept=".xlsx, .xls, .csv" 
                class="hidden-input" 
                @change="handleFileChange($event, 'main')" 
              />
              <div class="box-content">
                <template v-if="!mainFile">
                  <UploadCloudIcon class="box-icon" />
                  <div class="label-group">
                    <span class="box-label">Dataset Utama</span>
                    <span class="box-sublabel">Klik atau tarik file ke sini (Wajib)</span>
                  </div>
                </template>
                <template v-else>
                  <FileSpreadsheetIcon class="box-icon file-active" />
                  <div class="file-info">
                    <span class="file-name">{{ mainFile.name }}</span>
                    <span class="file-meta">{{ formatFileSize(mainFile.size) }}</span>
                  </div>
                  <button type="button" class="remove-btn" @click.stop="removeFile('main')">
                    <XIcon class="btn-icon" />
                  </button>
                </template>
              </div>
            </div>

            <p class="file-hint">Format yang didukung: .xlsx, .xls, .csv</p>
          </div>

          <!-- Primary Key Option Toggle -->
          <div class="option-wrapper">
            <label class="toggle-option">
              <input type="checkbox" v-model="usePrimaryKey" />
              <span class="toggle-slider"></span>
              <div class="toggle-text">
                <span class="toggle-title">Gunakan Primary Key (PRODUCT_ID-UY)</span>
                <span class="toggle-sub">Contoh Format: <code>KUS-2023</code></span>
              </div>
            </label>
          </div>

          <!-- Action Button -->
          <div class="action-bar">
            <button 
              type="button" 
              class="btn btn-primary" 
              :disabled="!canProcess || isLoading" 
              @click="processMapping"
            >
              <Loader2Icon v-if="isLoading" class="btn-icon spin" />
              <PlayIcon v-else class="btn-icon" />
              <span>{{ isLoading ? 'Memproses Data...' : 'Proses Data Mapping' }}</span>
            </button>
          </div>
        </div>
      </section>

      <!-- Right Card: Preview & Results -->
      <section class="card preview-card">
        <div class="card-header flex justify-between items-center">
          <h3 class="card-title">Preview Mapping</h3>
          <span v-if="isProcessed" class="badge-status">
            Total: {{ previewData.total_rows }} baris | Unmapped: {{ previewData.unmapped_count }}
          </span>
        </div>

        <div class="preview-body" :class="{ 'has-data': isProcessed }">
          <!-- Loading State -->
          <div v-if="isLoading" class="state-container">
            <Loader2Icon class="spinner-icon spin" />
            <p class="state-title">Menganalisis dan memproses data...</p>
            <p class="state-sub">Mohon tunggu sebentar, proses ini memerlukan beberapa detik.</p>
          </div>

          <!-- Empty State -->
          <div v-else-if="!isProcessed" class="state-container">
            <div class="empty-icon-wrapper">
              <InfoIcon class="empty-icon" />
            </div>
            <h4 class="state-title">Belum ada data diproses</h4>
            <p class="state-sub">Upload file dataset utama lalu klik "Proses Data Mapping".</p>
          </div>

          <!-- Results Preview Data Table -->
          <div v-else class="preview-results">
            <div class="preview-info-bar">
              <small class="text-subtle">
                Menampilkan top {{ previewData.results.length }} baris dari total {{ previewData.total_rows }} data:
              </small>
            </div>
            
            <div class="table-responsive table-container">
              <table class="data-table">
                <thead>
                  <tr>
                    <th v-for="col in previewData.columns" :key="col">{{ col }}</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(row, rowIndex) in previewData.results" :key="rowIndex">
                    <td v-for="col in previewData.columns" :key="col" :data-label="col">
                      <span class="cell-value">{{ row[col] !== "" && row[col] !== null ? row[col] : '-' }}</span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <!-- Download Buttons Footer -->
        <div class="download-footer">
          <button 
            type="button"
            class="btn-download" 
            :disabled="!isProcessed || isDownloading" 
            @click="downloadFile('xlsx')"
          >
            <Loader2Icon v-if="isDownloading" class="download-icon spin" />
            <DownloadIcon v-else class="download-icon" />
            <span>Download Excel</span>
          </button>

          <button 
            type="button"
            class="btn-download btn-secondary-download" 
            :disabled="!isProcessed || isDownloading" 
            @click="downloadFile('csv')"
          >
            <Loader2Icon v-if="isDownloading" class="download-icon spin" />
            <DownloadIcon v-else class="download-icon" />
            <span>Download CSV</span>
          </button>
        </div>
      </section>

    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import axios from 'axios'
import { 
  UploadCloudIcon, 
  FileSpreadsheetIcon, 
  XIcon, 
  InfoIcon, 
  PlayIcon, 
  Loader2Icon, 
  AlertCircleIcon, 
  CheckCircle2Icon,
  DownloadIcon 
} from 'lucide-vue-next'

// Configuration & API Endpoints
const rawBaseUrl = process.env.VUE_APP_API_BASE_URL 
  || import.meta.env?.VITE_API_BASE_URL 
  || 'https://reaskrindo-six.vercel.app';

const API_BASE_URL = rawBaseUrl.replace(/\/+$/, '');
const IMPORT_PLACEMENT_API = `${API_BASE_URL}/auto-mapping/api/process/`
const DOWNLOAD_REF_API = `${API_BASE_URL}/auto-mapping/api/download-reference/`

// State Definitions
const mainFile = ref(null)
const referenceFile = ref(null)
const mainInput = ref(null)
const refInput = ref(null)

const isDraggingMain = ref(false)
const isDraggingRef = ref(false)

const isLoading = ref(false)
const isDownloading = ref(false)
const errorMessage = ref('')
const successMessage = ref('')
const isProcessed = ref(false)

const usePrimaryKey = ref(true)

// Holds backend response structure
const previewData = ref({
  columns: [],
  results: [],
  total_rows: 0,
  unmapped_count: 0
})

// --- Computeds ---
const canProcess = computed(() => Boolean(mainFile.value))

// --- Helpers ---
const formatFileSize = (bytes) => {
  if (!bytes) return '0 Bytes'
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i]
}

const clearAlerts = () => {
  errorMessage.value = ''
  successMessage.value = ''
}

const resetPreview = () => {
  isProcessed.value = false
  previewData.value = { columns: [], results: [], total_rows: 0, unmapped_count: 0 }
  clearAlerts()
}

const triggerFileInput = (inputRefName) => {
  if (inputRefName === 'mainInput' && mainInput.value) {
    mainInput.value.click()
  } else if (inputRefName === 'refInput' && refInput.value) {
    refInput.value.click()
  }
}

// --- Event Handlers ---
const setFile = (file, type) => {
  if (type === 'main') mainFile.value = file
  if (type === 'ref') referenceFile.value = file
  resetPreview()
}

const handleFileChange = (event, type) => {
  const file = event.target.files?.[0]
  if (file) setFile(file, type)
  event.target.value = ''
}

const handleDrop = (event, type) => {
  if (type === 'main') isDraggingMain.value = false
  if (type === 'ref') isDraggingRef.value = false

  const file = event.dataTransfer?.files?.[0]
  if (file) setFile(file, type)
}

const removeFile = (type) => {
  if (type === 'main') {
    mainFile.value = null
    if (mainInput.value) mainInput.value.value = ''
  }
  if (type === 'ref') {
    referenceFile.value = null
    if (refInput.value) refInput.value.value = ''
  }
  resetPreview()
}

// --- API Actions ---
const processMapping = async () => {
  if (!canProcess.value || isLoading.value) return

  isLoading.value = true
  clearAlerts()

  const formData = new FormData()
  formData.append('main_file', mainFile.value)
  formData.append('use_primary_key', usePrimaryKey.value)
  if (referenceFile.value) {
    formData.append('reference_file', referenceFile.value)
  }

  try {
    const response = await axios.post(`${IMPORT_PLACEMENT_API}?export_format=json`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
      timeout: 120000
    })

    if (response.data) {
      previewData.value = {
        columns: response.data.columns || [],
        results: response.data.results || [],
        total_rows: response.data.total_rows || 0,
        unmapped_count: response.data.unmapped_count || 0
      }
      isProcessed.value = true
      successMessage.value = 'Data berhasil diproses!'
    }
  } catch (err) {
    console.error('Error processing auto-mapping:', err)
    await parseAndShowError(err, 'Gagal memproses file. Pastikan format file sesuai.')
    isProcessed.value = false
  } finally {
    isLoading.value = false
  }
}

const downloadRefTemplate = async (format) => {
  clearAlerts()
  try {
    const response = await axios.get(`${DOWNLOAD_REF_API}?format=${format}`, {
      responseType: 'blob'
    })
    
    const targetFilename = format === 'csv' 
      ? 'Reference_Template.csv' 
      : 'Reference_Template.xlsx'

    triggerBlobDownload(response.data, targetFilename)
  } catch (err) {
    await parseAndShowError(err, `Gagal mengunduh file referensi template format ${format.toUpperCase()}.`)
  }
}

const downloadFile = async (format) => {
  if (!isProcessed.value || isDownloading.value) return

  isDownloading.value = true
  clearAlerts()

  try {
    const formData = new FormData()
    formData.append('main_file', mainFile.value)
    formData.append('use_primary_key', usePrimaryKey.value)
    if (referenceFile.value) {
      formData.append('reference_file', referenceFile.value)
    }

    const response = await axios.post(`${IMPORT_PLACEMENT_API}?format=${format}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
      responseType: 'blob' 
    })

    const finalFileName = `Mapped_Result.${format}`
    triggerBlobDownload(response.data, finalFileName)
    successMessage.value = `File ${finalFileName} berhasil diunduh.`
  } catch (err) {
    await parseAndShowError(err, `Gagal mengunduh file format ${format.toUpperCase()}.`)
  } finally {
    isDownloading.value = false
  }
}

// Utility: Trigger Browser Blob File Download
const triggerBlobDownload = (blobData, fileName) => {
  const url = window.URL.createObjectURL(new Blob([blobData]))
  const link = document.createElement('a')
  link.href = url
  link.setAttribute('download', fileName)
  document.body.appendChild(link)
  link.click()
  link.remove()
  window.URL.revokeObjectURL(url)
}

// Utility: Extract JSON message from Blob error responses
const parseAndShowError = async (err, fallbackMsg) => {
  if (err.response && err.response.data instanceof Blob) {
    try {
      const text = await err.response.data.text()
      const json = JSON.parse(text)
      errorMessage.value = json.error || json.detail || json.message || fallbackMsg
    } catch {
      errorMessage.value = fallbackMsg
    }
  } else {
    errorMessage.value = err?.response?.data?.error || err?.message || fallbackMsg
  }
}
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');

/* Base Container */
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

/* Header Section */
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

/* Alert Notification Banner */
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

.alert-success {
  background-color: #f0fdf4;
  border: 1px solid #bbf7d0;
  color: #166534;
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
  color: inherit;
  display: flex;
  padding: 2px;
}

.close-icon {
  width: 16px;
  height: 16px;
}

/* Workspace Layout */
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

/* Cards Structure */
.card {
  background: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
  display: flex;
  flex-direction: column;
  min-width: 0;
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

.badge-status {
  font-size: 0.75rem;
  font-weight: 600;
  background-color: #f1f5f9;
  color: #475569;
  padding: 4px 8px;
  border-radius: 6px;
}

.card-body {
  padding: 20px;
  display: flex;
  flex-direction: column;
  flex: 1;
  min-width: 0;
}

/* Dropzone & File Management */
.dropzone-wrapper {
  display: flex;
  flex-direction: column;
  gap: 16px;
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

/* Template Download References */
.template-download-links {
  margin-top: 6px;
  font-size: 0.775rem;
  z-index: 10;
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

/* Options / Toggle Settings */
.option-wrapper {
  margin-top: 1rem;
  padding: 0.75rem 1rem;
  background-color: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 0.5rem;
}

.toggle-option {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  cursor: pointer;
  user-select: none;
}

.toggle-option input {
  display: none;
}

.toggle-slider {
  position: relative;
  width: 36px;
  height: 20px;
  background-color: #cbd5e1;
  border-radius: 9999px;
  transition: background-color 0.2s;
  flex-shrink: 0;
}

.toggle-slider::before {
  content: '';
  position: absolute;
  top: 2px;
  left: 2px;
  width: 16px;
  height: 16px;
  background-color: white;
  border-radius: 50%;
  transition: transform 0.2s;
}

.toggle-option input:checked + .toggle-slider {
  background-color: #2563eb;
}

.toggle-option input:checked + .toggle-slider::before {
  transform: translateX(16px);
}

.toggle-text {
  display: flex;
  flex-direction: column;
}

.toggle-title {
  font-size: 0.875rem;
  font-weight: 500;
  color: #1e293b;
}

.toggle-sub {
  font-size: 0.75rem;
  color: #64748b;
}

.toggle-sub code {
  background-color: #e2e8f0;
  padding: 0.1rem 0.3rem;
  border-radius: 0.25rem;
}

/* Actions Bar */
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

/* Preview Area States */
.preview-card {
  display: flex;
  flex-direction: column;
}

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

/* Processed Table & Results */
.preview-results {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 16px;
  min-width: 0;
}

.preview-info-bar {
  margin-bottom: 8px;
}

.text-subtle {
  font-size: 0.775rem;
  color: #64748b;
}

/* Dynamic Data Table */
.table-container {
  width: 100%;
  overflow-x: auto;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  max-height: 320px;
  background: #ffffff;
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

/* Responsive Table Layout for Small Mobile Displays */
@media (max-width: 640px) {
  .table-container {
    max-height: none;
    border: none;
  }

  .data-table, .data-table thead, .data-table tbody, .data-table th, .data-table td, .data-table tr {
    display: block;
  }

  .data-table thead {
    display: none;
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
    white-space: normal;
    text-align: right !important;
  }

  .data-table td:last-child {
    border-bottom: none;
  }

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

/* Export Footer */
.download-footer {
  padding: 16px 20px;
  border-top: 1px solid #f1f5f9;
  display: flex;
  gap: 12px;
  background-color: #ffffff;
  border-bottom-left-radius: 12px;
  border-bottom-right-radius: 12px;
}

.btn-download {
  flex: 1;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 10px 14px;
  border-radius: 8px;
  font-size: 0.815rem;
  font-weight: 600;
  border: 1px solid #16a34a;
  background-color: #16a34a;
  color: #ffffff;
  cursor: pointer;
  transition: all 0.15s ease;
}

.btn-download:hover:not(:disabled) {
  background-color: #15803d;
  border-color: #15803d;
}

.btn-secondary-download {
  background-color: #ffffff;
  color: #0284c7;
  border-color: #0284c7;
}

.btn-secondary-download:hover:not(:disabled) {
  background-color: #f0f9ff;
  border-color: #0369a1;
  color: #0369a1;
}

.btn-download:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  border-color: #cbd5e1;
  background-color: #f1f5f9;
  color: #94a3b8;
}

.download-icon {
  width: 16px;
  height: 16px;
}

/* Utilities & Animations */
.spin {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

.fade-enter-active, .fade-leave-active {
  transition: opacity 0.2s ease;
}

.fade-enter-from, .fade-leave-to {
  opacity: 0;
}
</style>