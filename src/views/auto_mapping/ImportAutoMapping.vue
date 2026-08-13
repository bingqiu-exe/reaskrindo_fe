<template>
  <div class="auto-mapping-container">
    <!-- Header Section -->
    <header class="page-header">
      <div class="header-content">
        <h1 class="page-title">Mapping UY dan COB</h1>
        <p class="page-subtitle">Upload dataset utama dan referensi untuk otomatisasi mapping data.</p>
      </div>
    </header>

    <!-- Global Error Alert -->
    <Transition name="fade">
      <div v-if="errorMessage" class="alert alert-error">
        <AlertCircleIcon class="alert-icon" />
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
                    
                    <!-- TAMBAHKAN DISINI: Tautan unduh template bawaan -->
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
        <div class="card-header">
          <h3 class="card-title">Preview Mapping</h3>
        </div>

        <div class="preview-body">
          <!-- Loading State -->
          <div v-if="isLoading" class="state-container">
            <Loader2Icon class="spinner-icon spin" />
            <p class="state-title">Menganalisis dan memproses data...</p>
            <p class="state-sub">Mohon tunggu sebentar, proses ini memerlukan beberapa detik.</p>
          </div>

          <!-- Empty State (UBAH DISINI: dari !processedBlob menjadi !isProcessed) -->
          <div v-else-if="!isProcessed" class="state-container">
            <div class="empty-icon-wrapper">
              <InfoIcon class="empty-icon" />
            </div>
            <h4 class="state-title">Belum ada data diproses</h4>
            <p class="state-sub">Upload file dataset utama lalu klik "Proses Data Mapping".</p>
          </div>

          <!-- Results Ready State (UBAH DISINI: otomatis mendeteksi jika isProcessed true) -->
          <div v-else class="preview-results">
            <div class="file-summary-cards">
              <div class="summary-chip">
                <FileSpreadsheetIcon class="chip-icon excel" />
                <div class="chip-text">
                  <span class="chip-title">{{ resultFilename }}.xlsx</span>
                  <span class="chip-sub">Siap diunduh</span>
                </div>
              </div>

              <div class="summary-chip">
                <FileTextIcon class="chip-icon csv" />
                <div class="chip-text">
                  <span class="chip-title">{{ resultFilename }}.csv</span>
                  <span class="chip-sub">Siap diunduh</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Download Buttons Footer -->
        <div class="download-footer">
          <!-- UBAH DISINI: ganti :disabled="!processedBlob" menjadi :disabled="!isProcessed" -->
          <button 
            type="button"
            class="btn-download" 
            :disabled="!isProcessed" 
            @click="downloadFile('xlsx')"
          >
            <DownloadIcon class="download-icon" />
            <span>Download Excel</span>
          </button>

          <!-- UBAH DISINI: ganti :disabled="!processedBlob" menjadi :disabled="!isProcessed" -->
          <button 
            type="button"
            class="btn-download btn-secondary-download" 
            :disabled="!isProcessed" 
            @click="downloadFile('csv')"
          >
            <DownloadIcon class="download-icon" />
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
  FileTextIcon, 
  AlertCircleIcon, 
  DownloadIcon 
} from 'lucide-vue-next'

const API_BASE_URL = 'http://127.0.0.1:8000'
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
const errorMessage = ref('')

const processedBlob = ref(null)
const resultFilename = ref('')

// Computed Property to enable/disable button safely
const canProcess = computed(() => !!mainFile.value)

// Trigger File Pickers
const triggerFileInput = (inputRef) => {
  if (inputRef === 'mainInput' && mainInput.value) mainInput.value.click()
  if (inputRef === 'refInput' && refInput.value) refInput.value.click()
}

// Event Handlers
const handleFileChange = (event, type) => {
  const file = event.target.files[0]
  if (file) setFile(file, type)
}

const handleDrop = (event, type) => {
  if (type === 'main') isDraggingMain.value = false
  if (type === 'ref') isDraggingRef.value = false

  const file = event.dataTransfer.files[0]
  if (file) setFile(file, type)
}

const setFile = (file, type) => {
  errorMessage.value = ''
  if (type === 'main') mainFile.value = file
  if (type === 'ref') referenceFile.value = file
  resetPreview()
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

const resetPreview = () => {
  processedBlob.value = null
  resultFilename.value = ''
}

const formatFileSize = (bytes) => {
  if (!bytes) return '0 Bytes'
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i]
}

// Backend API Call
// Change state storage to hold raw response properties or a success flag
const isProcessed = ref(false)

const processMapping = async () => {
  if (!mainFile.value) return

  isLoading.value = true
  errorMessage.value = ''
  isProcessed.value = false

  const formData = new FormData()
  formData.append('main_file', mainFile.value)
  if (referenceFile.value) {
    formData.append('reference_file', referenceFile.value)
  }

  try {
    // Send a quick check to ensure the file runs cleanly without crashing the pipeline
    // We send format=xlsx just to verify the backend calculation works
    await axios.post(`${IMPORT_PLACEMENT_API}?format=xlsx`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
      responseType: 'blob'
    })

    isProcessed.value = true
    const rawName = mainFile.value.name.replace(/\.[^/.]+$/, "")
    resultFilename.value = `mapped_${rawName}`
  } catch (err) {
    isProcessed.value = false
    if (err.response && err.response.data instanceof Blob) {
      const text = await err.response.data.text()
      try {
        const json = JSON.parse(text)
        errorMessage.value = json.error || 'Terjadi kesalahan saat memproses data.'
      } catch {
        errorMessage.value = 'Gagal memproses file pada server.'
      }
    } else {
      errorMessage.value = err.message || 'Gagal menghubungi server.'
    }
  } finally {
    isLoading.value = false
  }
}

const downloadRefTemplate = async (format) => {
  errorMessage.value = ''
  
  try {
    // Lakukan request GET biner ke backend
    const response = await axios.get(`${DOWNLOAD_REF_API}?format=${format}`, {
      responseType: 'blob'
    })
    
    const targetFilename = format === 'csv' ? 'mapping toc ke cob.csv' : 'mapping toc ke cob.xlsx'

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

// Trigger explicit server-side conversion on click
const downloadFile = async (format) => {
  if (!isProcessed.value) return

  try {
    const formData = new FormData()
    formData.append('main_file', mainFile.value)
    if (referenceFile.value) {
      formData.append('reference_file', referenceFile.value)
    }

    // Explicitly ask for the specific structure stream
    const response = await axios.post(`${IMPORT_PLACEMENT_API}?format=${format}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
      responseType: 'blob' 
    })

    const downloadBlob = new Blob([response.data])
    const url = window.URL.createObjectURL(downloadBlob)
    const link = document.createElement('a')
    link.href = url
    link.setAttribute('download', `${resultFilename.value}.${format}`)
    document.body.appendChild(link)
    link.click()
    link.remove()
    window.URL.revokeObjectURL(url)
  } catch (err) {
    errorMessage.value = `Gagal mengunduh file format ${format.toUpperCase()}.`
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

.page-header {
  margin-bottom: 24px;
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

/* Alert Styling */
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

/* Workspace Layout */
.workspace-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 24px;
}

@media (max-width: 900px) {
  .workspace-grid {
    grid-template-columns: 1fr;
  }
}

/* Card General */
.card {
  background: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
  display: flex;
  flex-direction: column;
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
}

/* Dropzone Styling */
.dropzone-wrapper {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.zone-title {
  font-size: 0.875rem;
  font-weight: 600;
  color: #334155;
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
  border-color: #cbd5e1;
  background-color: #ffffff;
}

.box-content {
  display: flex;
  align-items: center;
  gap: 12px;
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
}

.remove-btn:hover {
  color: #ef4444;
}

.btn-icon {
  width: 18px;
  height: 18px;
}

.file-hint {
  font-size: 0.75rem;
  color: #94a3b8;
  margin: 4px 0 0 0;
}

/* Actions */
.action-bar {
  margin-top: 20px;
}

.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  width: 100%;
  padding: 10px 16px;
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

.spin {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

/* Preview Card */
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
  min-height: 240px;
}

.state-container {
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  max-width: 280px;
}

.spinner-icon {
  width: 32px;
  height: 32px;
  color: #1e3a8a;
  margin-bottom: 12px;
}

.empty-icon-wrapper {
  background-color: #f1f5f9;
  padding: 12px;
  border-radius: 50%;
  margin-bottom: 12px;
}

.empty-icon {
  width: 24px;
  height: 24px;
  color: #64748b;
}

.state-title {
  font-size: 0.95rem;
  font-weight: 600;
  color: #334155;
  margin: 0 0 4px 0;
}

.state-sub {
  font-size: 0.825rem;
  color: #64748b;
  margin: 0;
  line-height: 1.4;
}

/* Results */
.preview-results {
  width: 100%;
}

.file-summary-cards {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.summary-chip {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  background-color: #f8fafc;
}

.chip-icon {
  width: 24px;
  height: 24px;
}

.chip-icon.excel { color: #16a34a; }
.chip-icon.csv { color: #0284c7; }

.chip-text {
  display: flex;
  flex-direction: column;
}

.chip-title {
  font-size: 0.875rem;
  font-weight: 600;
  color: #1e293b;
}

.chip-sub {
  font-size: 0.75rem;
  color: #16a34a;
  font-weight: 500;
}

.template-download-links {
  margin-top: 6px;
  font-size: 0.8rem;
  z-index: 10;
}
.link-download-ref {
  color: #2563eb;
  text-decoration: underline;
  font-weight: 500;
  padding: 2px 4px;
}
.link-download-ref:hover {
  color: #1d4ed8;
}
.divider {
  color: #cbd5e1;
}
.text-hint {
  color: #64748b;
}

/* Download Footer */
.download-footer {
  padding: 16px 20px;
  border-top: 1px solid #f1f5f9;
  display: flex;
  gap: 12px;
}

.btn-download {
  flex: 1;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  padding: 10px;
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

/* Animations */
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.2s ease;
}
.fade-enter-from, .fade-leave-to {
  opacity: 0;
}
</style>