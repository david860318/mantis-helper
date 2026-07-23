<script setup lang="ts">
import { ref, computed } from 'vue'
import Papa from 'papaparse'


interface Statistic {
  分配給:string
  新問題:number
  今日完成:number
  累積未完成:number
  重要未處理:number
  外部未處理:number
}

const statistics = ref<Statistic[]>([])
const fileName = ref('')
const testingCount = ref(0)

const totalRow = computed(() =>
  statistics.value.find(x => x.分配給 === '總計')
)

function uploadCSV(e:Event){
  const file = (e.target as HTMLInputElement).files?.[0]
  if(!file) return

  fileName.value = file.name

  Papa.parse(file,{
    header:true,
    skipEmptyLines:true,
    complete(result){
      generateStatistics(result.data as any[])
    }
  })
}

function isIgnoreOwner(owner:string){
  return owner === '未分配' || owner.toLowerCase().startsWith('cdc')
}

function generateStatistics(rows:any[]){
  const map:Record<string,Statistic> = {}
  const today = new Date().toISOString().substring(0,10)
  let waitTest = 0

  rows.forEach(row => {
    if(row['狀態'] === '待測試'){
      waitTest++
    }

    const owner = row['分配給']?.trim() || '未分配'

    if(isIgnoreOwner(owner)) return

    if(!map[owner]){
      map[owner] = {
        分配給:owner,
        新問題:0,
        今日完成:0,
        累積未完成:0,
        重要未處理:0,
        外部未處理:0
      }
    }

    const updateDate = formatDate(row['已更新'])
    const status = row['狀態']
    const severity = row['嚴重性']
    const project = row['專案']

    if(updateDate === today && status === '已分配'){
      map[owner].新問題++
    }

    if(
      updateDate === today &&
      ['待測試','已測試','已確認'].includes(status)
    ){
      map[owner].今日完成++
    }

    if(status === '已分配'){
      map[owner].累積未完成++
    }

    if(
      status === '已分配' &&
      severity === '重要'
    ){
      map[owner].重要未處理++
    }

    if(
      status === '已分配' &&
      severity === '重要' &&
      project === 'HAPCS疾管署_愛滋追管系統'
    ){
      map[owner].外部未處理++
    }
  })

  const result = Object.values(map)

  const total:Statistic = {
    分配給:'總計',
    新問題:0,
    今日完成:0,
    累積未完成:0,
    重要未處理:0,
    外部未處理:0
  }

  result.forEach(item => {
    total.新問題 += item.新問題
    total.今日完成 += item.今日完成
    total.累積未完成 += item.累積未完成
    total.重要未處理 += item.重要未處理
    total.外部未處理 += item.外部未處理
  })

  statistics.value = [...result,total]
  testingCount.value = waitTest
}

function formatDate(value:string){
  if(!value) return ''

  return value
    .substring(0,10)
    .replaceAll('/','-')
}

const todayText = computed(() => {
  const date = new Date()

  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2,'0')
  const d = String(date.getDate()).padStart(2,'0')

  return `${y}/${m}/${d}`
})
</script>

<template>
<div class="page">

  <header class="header">
    <h1>每日QA回報</h1>
    <p>每日問題追蹤與人員工作量分析</p>
  </header>

  <section class="card upload">
    <input
      type="file"
      accept=".csv"
      @change="uploadCSV"
    />

    <span>{{fileName}}</span>
  </section>

  <section
    v-if="totalRow"
    class="kpi"
  >
    <div class="card">
      <span>新問題</span>
      <strong>{{totalRow.新問題}}</strong>
    </div>

    <div class="card">
      <span>今日完成</span>
      <strong>{{totalRow.今日完成}}</strong>
    </div>

    <div class="card">
      <span>累積未完成</span>
      <strong>{{totalRow.累積未完成}}</strong>
    </div>

    <div class="card">
      <span>重要未處理</span>
      <strong>{{totalRow.重要未處理}}</strong>
    </div>
  </section>

  <section class="card table-card">

    <!-- <h2>每日QA回報</h2> -->

    <table>
      <thead>
        <tr>
          <th>{{todayText}}</th>
          <th>新問題</th>
          <th>今日完成</th>
          <th>累積未完成</th>
          <th>重要未處理</th>
          <th>外部未處理</th>
        </tr>
      </thead>

      <tbody>
        <tr
          v-for="item in statistics"
          :key="item.分配給"
          :class="{total:item.分配給==='總計'}"
        >
          <td>{{item.分配給}}</td>
          <td>{{item.新問題}}</td>
          <td>{{item.今日完成}}</td>
          <td>{{item.累積未完成}}</td>
          <td>{{item.重要未處理}}</td>
          <td>{{item.外部未處理}}</td>
        </tr>
      </tbody>
    </table>

  </section>

  <section class="testing-card">
    <span>待測試案件</span>
    <strong>{{testingCount}}</strong>
  </section>

</div>
</template>

<style scoped>
.page{
  max-width:1100px;
}

.header{
  margin-bottom:18px;
}

.header h1{
  margin:0;
  font-size:22px;
}

.header p{
  margin:5px 0 0;
  color:#94a3b8;
  font-size:13px;
}

.card{
  background:#fff;
  border:1px solid #eee;
  border-radius:10px;
  padding:14px;
}

.upload{
  display:flex;
  align-items:center;
  gap:12px;
  margin-bottom:16px;
}

button:disabled{
  background:#cbd5e1;
}

.kpi{
  display:grid;
  grid-template-columns:repeat(4,1fr);
  gap:12px;
  margin-bottom:16px;
}

.kpi span{
  color:#64748b;
  font-size:12px;
}

.kpi strong{
  display:block;
  margin-top:6px;
  font-size:24px;
}

.table-card h2{
  margin:0 0 10px;
  font-size:15px;
}

.table-card{
  /* width:100%; */
}

table{
  width:30%;
  table-layout:fixed;
  border-collapse:collapse;
}



th{
  background:#f8fafc;
  font-weight:600;
}

th,td{
  padding:7px 8px;
  border-bottom:1px solid #eee;
  text-align:center;
}

.total{
  background:#eff6ff;
  font-weight:700;
}

.testing-card{
  margin-top:14px;
  width:160px;
  display:flex;
  justify-content:space-between;
  align-items:center;
  background:#fff;
  border:1px solid #eee;
  border-radius:10px;
  padding:12px 14px;
}

.testing-card span{
  font-size:13px;
  color:#6473b8;
}

.testing-card strong{
  font-size:22px;
  color:#2563eb;
}

@media(max-width:768px){
  .kpi{
    grid-template-columns:1fr;
  }
}
</style>