export function downloadCSV(data: any[]) {

  const headers = ['編號', '嚴重性', '狀態', '摘要']

  const rows = data.map(d => [
    d.issueId,
    d.severity,
    d.status,
    d.summary
  ])

  const csv = [
    headers.join(','),
    ...rows.map(r => r.join(','))
  ].join('\n')

  const blob = new Blob(['\uFEFF' + csv], {
    type: 'text/csv'
  })

  const url = URL.createObjectURL(blob)

  const a = document.createElement('a')
  a.href = url
  a.download = '待上版.csv'
  a.click()

  URL.revokeObjectURL(url)
}