import { ref, nextTick, computed } from 'vue';
import * as Papa from 'papaparse';
const nameMap = {
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
};
const outputText = ref('');
const pendingRelease = ref([]);
const outputRef = ref(null);
/* ===== UX computed（避免 split 重算） ===== */
const lineCount = computed(() => outputText.value.split('\n').length);
/* ===== safe getter ===== */
function get(row, key) {
    return (row?.[key] ?? '').toString().trim();
}
/* ===== CSV parse（不動邏輯） ===== */
function parseRows(rows) {
    const important = {};
    const urgent = {};
    pendingRelease.value = [];
    rows.forEach((row) => {
        const rawAssignee = get(row, '分配給');
        const name = nameMap[rawAssignee] || rawAssignee;
        const issueId = get(row, '\ufeff編號') ||
            get(row, '編號') ||
            '00000';
        const reportDate = get(row, '回報日期');
        const status = get(row, '狀態');
        const priority = get(row, '優先權');
        const severity = get(row, '嚴重性');
        const type = get(row, 'HAPCS_問題屬性');
        const summary = get(row, '摘要');
        const text = `${issueId} (回報日 ${reportDate})`;
        if (status === '已分配' &&
            priority === '一般' &&
            severity === '重要' &&
            type === 'BUG') {
            if (!important[name])
                important[name] = [];
            important[name].push(text);
        }
        if (status === '已分配' &&
            ['立即', '緊急'].includes(priority) &&
            type === 'BUG') {
            if (!urgent[name])
                urgent[name] = [];
            urgent[name].push(text);
        }
        if (status === '待測試') {
            pendingRelease.value.push([
                issueId,
                severity,
                status,
                '',
                summary,
            ]);
        }
    });
    buildText(important, urgent);
}
/* ===== build text V2（更穩 + 不跑版） ===== */
function buildText(important, urgent) {
    const blocks = [];
    blocks.push('=========== 重要單 ===========');
    blocks.push('以下重要單請在中午前修改完成，無法完成請主動回報');
    blocks.push('');
    if (Object.keys(important).length) {
        Object.keys(important).forEach((p) => {
            blocks.push(`@${p}`);
            blocks.push(...important[p]);
            blocks.push('');
        });
    }
    else {
        blocks.push('無重要單', '');
    }
    blocks.push('=========== 緊急立即單 ===========');
    blocks.push('以下緊急立即單請在中午前修改完成，無法完成請主動回報');
    blocks.push('');
    if (Object.keys(urgent).length) {
        Object.keys(urgent).forEach((p) => {
            blocks.push(`@${p}`);
            blocks.push(...urgent[p]);
            blocks.push('');
        });
    }
    else {
        blocks.push('無緊急立即單');
    }
    outputText.value = blocks.join('\n').trim();
}
/* ===== upload ===== */
function upload(e) {
    const file = e.target.files?.[0];
    if (!file)
        return;
    Papa.parse(file, {
        header: true,
        skipEmptyLines: true,
        complete: (res) => parseRows(res.data),
    });
}
/* ===== download CSV（完全不動） ===== */
function downloadCSV() {
    const headers = ['編號', '嚴重性', '狀態', '慢組驗測', '摘要'];
    const rows = pendingRelease.value.map((r) => r.join(','));
    const csv = [headers.join(','), ...rows].join('\n');
    const blob = new Blob(['\uFEFF' + csv], {
        type: 'text/csv;charset=utf-8',
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = '待上版.csv';
    a.click();
    URL.revokeObjectURL(url);
}
/* ===== copy V2 ===== */
const copied = ref(false);
function copyOutput() {
    const text = outputText.value || '';
    navigator.clipboard.writeText(text);
    copied.value = true;
    setTimeout(() => {
        copied.value = false;
    }, 1500);
}
/* ===== scroll lock V2 ===== */
async function scrollToBottom() {
    await nextTick();
    if (outputRef.value) {
        outputRef.value.scrollTop = outputRef.value.scrollHeight;
    }
}
const __VLS_ctx = {
    ...{},
    ...{},
};
let __VLS_components;
let __VLS_intrinsics;
let __VLS_directives;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "page" },
});
/** @type {__VLS_StyleScopedClasses['page']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "topbar" },
});
/** @type {__VLS_StyleScopedClasses['topbar']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "title" },
});
/** @type {__VLS_StyleScopedClasses['title']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.h1, __VLS_intrinsics.h1)({});
__VLS_asFunctionalElement1(__VLS_intrinsics.p, __VLS_intrinsics.p)({});
__VLS_asFunctionalElement1(__VLS_intrinsics.section, __VLS_intrinsics.section)({
    ...{ class: "card step" },
});
/** @type {__VLS_StyleScopedClasses['card']} */ ;
/** @type {__VLS_StyleScopedClasses['step']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "step-header" },
});
/** @type {__VLS_StyleScopedClasses['step-header']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({
    ...{ class: "step-no" },
});
/** @type {__VLS_StyleScopedClasses['step-no']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.h2, __VLS_intrinsics.h2)({});
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "step-body" },
});
/** @type {__VLS_StyleScopedClasses['step-body']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.input)({
    ...{ onChange: (__VLS_ctx.upload) },
    type: "file",
});
__VLS_asFunctionalElement1(__VLS_intrinsics.section, __VLS_intrinsics.section)({
    ...{ class: "card output-card" },
});
/** @type {__VLS_StyleScopedClasses['card']} */ ;
/** @type {__VLS_StyleScopedClasses['output-card']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "output-header" },
});
/** @type {__VLS_StyleScopedClasses['output-header']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "left" },
});
/** @type {__VLS_StyleScopedClasses['left']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({
    ...{ class: "step-no" },
});
/** @type {__VLS_StyleScopedClasses['step-no']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.h2, __VLS_intrinsics.h2)({});
__VLS_asFunctionalElement1(__VLS_intrinsics.button, __VLS_intrinsics.button)({
    ...{ onClick: (__VLS_ctx.copyOutput) },
    ...{ class: "btn copy-btn" },
    ...{ class: ({ copied: __VLS_ctx.copied }) },
});
/** @type {__VLS_StyleScopedClasses['btn']} */ ;
/** @type {__VLS_StyleScopedClasses['copy-btn']} */ ;
/** @type {__VLS_StyleScopedClasses['copied']} */ ;
(__VLS_ctx.copied ? '✔ 已複製' : '複製內容');
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "output-box" },
});
/** @type {__VLS_StyleScopedClasses['output-box']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "line-numbers" },
});
/** @type {__VLS_StyleScopedClasses['line-numbers']} */ ;
for (const [n] of __VLS_vFor((__VLS_ctx.lineCount))) {
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        key: (n),
    });
    (n);
    // @ts-ignore
    [upload, copyOutput, copied, copied, lineCount,];
}
__VLS_asFunctionalElement1(__VLS_intrinsics.pre, __VLS_intrinsics.pre)({
    ...{ class: "output-content" },
    ref: "outputRef",
});
/** @type {__VLS_StyleScopedClasses['output-content']} */ ;
(__VLS_ctx.outputText);
__VLS_asFunctionalElement1(__VLS_intrinsics.section, __VLS_intrinsics.section)({
    ...{ class: "card step" },
});
/** @type {__VLS_StyleScopedClasses['card']} */ ;
/** @type {__VLS_StyleScopedClasses['step']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "step-header" },
});
/** @type {__VLS_StyleScopedClasses['step-header']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({
    ...{ class: "step-no" },
});
/** @type {__VLS_StyleScopedClasses['step-no']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.h2, __VLS_intrinsics.h2)({});
__VLS_asFunctionalElement1(__VLS_intrinsics.button, __VLS_intrinsics.button)({
    ...{ onClick: (__VLS_ctx.downloadCSV) },
    ...{ class: "btn" },
});
/** @type {__VLS_StyleScopedClasses['btn']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "table-wrap" },
});
/** @type {__VLS_StyleScopedClasses['table-wrap']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.table, __VLS_intrinsics.table)({});
__VLS_asFunctionalElement1(__VLS_intrinsics.thead, __VLS_intrinsics.thead)({});
__VLS_asFunctionalElement1(__VLS_intrinsics.tr, __VLS_intrinsics.tr)({});
__VLS_asFunctionalElement1(__VLS_intrinsics.th, __VLS_intrinsics.th)({});
__VLS_asFunctionalElement1(__VLS_intrinsics.th, __VLS_intrinsics.th)({});
__VLS_asFunctionalElement1(__VLS_intrinsics.th, __VLS_intrinsics.th)({});
__VLS_asFunctionalElement1(__VLS_intrinsics.th, __VLS_intrinsics.th)({});
__VLS_asFunctionalElement1(__VLS_intrinsics.th, __VLS_intrinsics.th)({});
__VLS_asFunctionalElement1(__VLS_intrinsics.tbody, __VLS_intrinsics.tbody)({});
for (const [item, i] of __VLS_vFor((__VLS_ctx.pendingRelease))) {
    __VLS_asFunctionalElement1(__VLS_intrinsics.tr, __VLS_intrinsics.tr)({
        key: (i),
    });
    __VLS_asFunctionalElement1(__VLS_intrinsics.td, __VLS_intrinsics.td)({});
    (item[0]);
    __VLS_asFunctionalElement1(__VLS_intrinsics.td, __VLS_intrinsics.td)({});
    (item[1]);
    __VLS_asFunctionalElement1(__VLS_intrinsics.td, __VLS_intrinsics.td)({});
    (item[2]);
    __VLS_asFunctionalElement1(__VLS_intrinsics.td, __VLS_intrinsics.td)({});
    __VLS_asFunctionalElement1(__VLS_intrinsics.td, __VLS_intrinsics.td)({
        ...{ class: "summary" },
    });
    /** @type {__VLS_StyleScopedClasses['summary']} */ ;
    (item[4]);
    // @ts-ignore
    [outputText, downloadCSV, pendingRelease,];
}
// @ts-ignore
[];
const __VLS_export = (await import('vue')).defineComponent({});
export default {};
