import { reactive } from 'vue';
const nameMap = {
    'david.chen': '陳哲',
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
    'Alex.Lu': '崇道',
};
export function useMantisParser() {
    const importantData = reactive({});
    const urgentData = reactive({});
    const pendingReleaseData = reactive([]);
    function clear(obj) {
        for (const k in obj)
            delete obj[k];
    }
    function parseRows(rows) {
        clear(importantData);
        clear(urgentData);
        pendingReleaseData.length = 0;
        const get = (row, key) => (row[key] ?? '').toString().trim();
        rows.forEach(row => {
            const rawAssignee = get(row, '分配給');
            const displayName = nameMap[rawAssignee] || rawAssignee;
            const issueId = get(row, '\ufeff編號') ||
                get(row, '編號') ||
                '00000';
            const reportDate = get(row, '回報日期');
            const status = get(row, '狀態');
            const priority = get(row, '優先權');
            const severity = get(row, '嚴重性');
            const type = get(row, 'HAPCS_問題屬性');
            const summary = get(row, '摘要');
            const issueText = `${issueId} (回報日 ${reportDate})`;
            // 重要
            if (status === '已分配' &&
                priority === '一般' &&
                severity === '重要' &&
                type === 'BUG') {
                if (!importantData[displayName]) {
                    importantData[displayName] = [];
                }
                importantData[displayName].push(issueText);
            }
            // 緊急
            if (status === '已分配' &&
                ['立即', '緊急'].includes(priority) &&
                type === 'BUG') {
                if (!urgentData[displayName]) {
                    urgentData[displayName] = [];
                }
                urgentData[displayName].push(issueText);
            }
            // 待上版
            if (status === '待測試') {
                pendingReleaseData.push({
                    issueId,
                    severity,
                    status,
                    summary,
                });
            }
        });
    }
    return {
        importantData,
        urgentData,
        pendingReleaseData,
        parseRows,
    };
}
