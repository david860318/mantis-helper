<script setup lang="ts">
import { ref, nextTick, computed } from 'vue'
import * as Papa from 'papaparse'

const nameMap: Record<string, string> = {
  'david.chen': '陳哲',
  'JohnSon.chen': 'JohnSon.chen',
  'weiren.yang': 'Pop',
  'ema.hong': '洪',
  'Szi': '思',
  'yuwei.dee': '陳昱',
  'jiaying.cai': '佳',
  'Buzz': '巴',
  'Wilson.Tao': 'Tao',
  'Kai.lin': 'Kai',
  'brian.chou': 'Brian',
  'chiayun.lo': 'ChiaY',
  'Sylvia.Liu': 'Sylv',
  'edith.chen': 'edith.chen',
  'Alex.Lu': '崇道',
  'ben.lian': 'Yao Syua',
  'kenzie.wang': 'Kenzie',
}

const outputText = ref('')
const pendingRelease = ref<any[]>([])

const outputRef = ref<HTMLElement | null>(null)

/* ===== UX computed（避免 split 重算） ===== */
const lineCount = computed(() => outputText.value.split('\n').length)

/* ===== safe getter ===== */
function get(row: any, key: string) {
  return (row?.[key] ?? '').toString().trim()
}

/* ===== CSV parse（不動邏輯） ===== */
function parseRows(rows: any[]) {
  const important: Record<string, string[]> = {}
  const urgent: Record<string, string[]> = {}

  pendingRelease.value = []

  rows.forEach((row) => {
    const rawAssignee = get(row, '分配給')
    const name = nameMap[rawAssignee] || rawAssignee

    const issueId =
      get(row, '\ufeff編號') ||
      get(row, '編號') ||
      '00000'

    const reportDate = get(row, '回報日期')
    const status = get(row, '狀態')
    const priority = get(row, '優先權')
    const severity = get(row, '嚴重性')
    const type = get(row, 'HAPCS_問題屬性')
    const summary = get(row, '摘要')

    const text = `${issueId} (回報日 ${reportDate})`

    if (
      status === '已分配' &&
      priority === '一般' &&
      severity === '重要' &&
      type === 'BUG'
    ) {
      if (!important[name]) important[name] = []
      important[name].push(text)
    }

    if (
      status === '已分配' &&
      ['立即', '緊急'].includes(priority) &&
      type === 'BUG'
    ) {
      if (!urgent[name]) urgent[name] = []
      urgent[name].push(text)
    }

    if (status === '待測試') {
      pendingRelease.value.push([
        issueId,
        severity,
        status,
        '',
        summary,
      ])
    }
  })

  buildText(important, urgent)
}

/* ===== build text V2（更穩 + 不跑版） ===== */
function buildText(
  important: Record<string, string[]>,
  urgent: Record<string, string[]>
) {
  const blocks: string[] = []

  blocks.push('=========== 重要單 ===========')
  blocks.push('以下重要單請在中午前修改完成，無法完成請主動回報')
  blocks.push('')

  if (Object.keys(important).length) {
    Object.keys(important).forEach((p) => {
      blocks.push(`@${p}`)
      blocks.push(...important[p])
      blocks.push('')
    })
  } else {
    blocks.push('無重要單', '')
  }

  blocks.push('=========== 緊急立即單 ===========')
  blocks.push('以下緊急立即單請在中午前修改完成，無法完成請主動回報')
  blocks.push('')

  if (Object.keys(urgent).length) {
    Object.keys(urgent).forEach((p) => {
      blocks.push(`@${p}`)
      blocks.push(...urgent[p])
      blocks.push('')
    })
  } else {
    blocks.push('無緊急立即單')
  }

  // outputText.value = blocks.join('\n').trim()
}

/* ===== upload ===== */
function upload(e: Event) {
  const file = (e.target as HTMLInputElement).files?.[0]
  if (!file) return

  Papa.parse(file, {
    header: true,
    skipEmptyLines: true,
    complete: (res) => parseRows(res.data as any[]),
  })
}

/* ===== download CSV（完全不動） ===== */
function downloadCSV() {
  const headers = ['編號', '嚴重性', '狀態', '慢組驗測', '摘要']

  const rows = pendingRelease.value.map((r) => r.join(','))

  const csv = [headers.join(','), ...rows].join('\n')

  const blob = new Blob(['\uFEFF' + csv], {
    type: 'text/csv;charset=utf-8',
  })

  const url = URL.createObjectURL(blob)

  const a = document.createElement('a')
  a.href = url
  a.download = '待上版.csv'
  a.click()

  URL.revokeObjectURL(url)
}

/* ===== copy V2 ===== */
const copied = ref(false)

function copyOutput() {
  const text = outputText.value || ''

  navigator.clipboard.writeText(text)

  copied.value = true
  setTimeout(() => {
    copied.value = false
  }, 1500)
}

/* ===== scroll lock V2 ===== */
async function scrollToBottom() {
  await nextTick()
  if (outputRef.value) {
    outputRef.value.scrollTop = outputRef.value.scrollHeight
  }
}
</script>

<template>
  <div class="page">

    <!-- TOP BAR -->
    <div class="topbar">
      <div class="title">
        <h1>每日 Mantis 通知系統</h1>
        <p>CSV 自動分類 · 通知生成 · 待上版管理</p>
      </div>
    </div>

    <!-- STEP 1 -->
    <section class="card step">
      <div class="step-header">
        <span class="step-no">1</span>
        <h2>上傳 CSV</h2>
      </div>

      <div class="step-body">
        <input type="file" @change="upload" />
      </div>
    </section>

    <!-- STEP 2 OUTPUT (MAIN AREA) -->
    <section class="card output-card">

  <div class="output-header">
    <div class="left">
      <span class="step-no">2</span>
      <h2>重要 / 緊急通知</h2>
    </div>

    <button
      class="btn copy-btn"
      :class="{ copied }"
      @click="copyOutput"
    >
      {{ copied ? '✔ 已複製' : '複製內容' }}
    </button>
  </div>

  <div class="output-box">

    <div class="line-numbers">
      <div v-for="n in lineCount" :key="n">
        {{ n }}
      </div>
    </div>

    <pre class="output-content" ref="outputRef">
{{ outputText }}
    </pre>

  </div>
</section>

    <!-- STEP 3 TABLE -->
    <section class="card step">

      <div class="step-header">
        <span class="step-no">3</span>
        <h2>待上版明細</h2>

        <button class="btn" @click="downloadCSV">
          下載 CSV
        </button>
      </div>

      <div class="table-wrap">
        <table>
          <thead>
            <tr>
              <th>編號</th>
              <th>嚴重性</th>
              <th>狀態</th>
              <th>慢組驗測</th>
              <th>摘要</th>
            </tr>
          </thead>

          <tbody>
            <tr v-for="(item, i) in pendingRelease" :key="i">
              <td>{{ item[0] }}</td>
              <td>{{ item[1] }}</td>
              <td>{{ item[2] }}</td>
              <td></td>
              <td class="summary">{{ item[4] }}</td>
            </tr>
          </tbody>
        </table>
      </div>

    </section>

  </div>
</template>