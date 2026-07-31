<script setup>
import { ref, computed } from 'vue'
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

// --- API Endpoint Setup ---
const API_BASE_URL = 'http://127.0.0.1:8000'
const IMPORT_PLACEMENT_API = `${API_BASE_URL}/finance/api/import-soa-finance`

// --- Table Schema Configuration ---
// Matches the exact uppercase keys returned by Django service process_finance_allocation_premi
const premiColumns = [
  { key: 'Policy No.', label: 'Policy No.', bold: true },
  { key: 'Insured Name', label: 'Insured Name' },
  { key: 'COB', label: 'COB' },
  { key: 'Currency', label: 'Curr' },
  { key: 'UY', label: 'UY' },
  { key: 'TSI Share', label: 'TSI Share', align: 'right', type: 'currency' },
  { key: 'broker_used', label: 'Broker' },
  { key: 'security_used', label: 'Security' },
  { key: 'komisi_qs', label: 'Komisi QS', align: 'right', type: 'currency' },
  { key: 'komisi_sp', label: 'Komisi SP', align: 'right', type: 'currency' }
]

// Matches the exact uppercase keys returned by Django service process_finance_allocation_claim
const klaimColumns = [
  { key: 'POLICY NUMBER', label: 'Policy No.', bold: true },
  { key: 'THE INSURED', label: 'Insured Name' },
  { key: 'COB', label: 'COB' },
  { key: 'CURRENCY', label: 'Curr' },
  { key: 'UW YEAR', label: 'UY' },
  { key: 'CLAIM AMOUNT', label: 'Claim Amount', align: 'right', type: 'currency' },
  { key: 'broker_used', label: 'Broker' },
  { key: 'security_used', label: 'Security' },
  { key: 'multiplied_quota_share', label: 'QS Share', align: 'right', type: 'currency' },
  { key: 'multiplied_surplus', label: 'SP Share', align: 'right', type: 'currency' }
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
        'Content-Type': 'multipart/form-data'
      }
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
<style>
</style>