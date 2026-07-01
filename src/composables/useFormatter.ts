export function useFormatter() {

  function formatOutput({
    importantData,
    urgentData,
  }: {
    importantData: Record<string, string[]>
    urgentData: Record<string, string[]>
  }) {

    let output = ''

    // =======================
    // 重要單
    // =======================
    output += '=========== 重要單 ===========\n'
    output += '以下重要單請在中午前修改完成，無法完成請主動在群組回報\n'

    const importantKeys = Object.keys(importantData)

    if (importantKeys.length > 0) {

      importantKeys.forEach(person => {
        output += `@${person}\n`
        output += importantData[person].join('\n')
        output += '\n'
      })

    } else {
      output += '無重要單\n'
    }

    output += '\n'

    // =======================
    // 緊急立即單
    // =======================
    output += '=========== 緊急立即單 ===========\n'
    output += '以下緊急立即單請在中午前修改完成，無法完成請主動在群組回報\n'

    const urgentKeys = Object.keys(urgentData)

    if (urgentKeys.length > 0) {

      urgentKeys.forEach(person => {
        output += `@${person}\n`
        output += urgentData[person].join('\n')
        output += '\n\n'
      })

    } else {
      output += '無緊急立即單\n\n'
    }

    // =======================
    // 待上版（你 Python 是寫 CSV）
    // =======================
    output += '=========== 待上版 ===========\n'
    output += '已自動產生：待上版.csv\n'

    return output.trim()
  }

  return { formatOutput }
}