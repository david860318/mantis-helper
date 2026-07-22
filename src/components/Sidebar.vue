<template>
  <aside class="sidebar">

    <div class="brand">
      <h2>Mantis Helper</h2>
      <span>每日通知系統</span>
    </div>

    <nav class="menu">
      <RouterLink to="/notification">
        <span class="icon">📋</span>
        <span>每日通知</span>
      </RouterLink>

      <RouterLink to="/statistics">
        <span class="icon">📊</span>
        <span>統計分析</span>
      </RouterLink>
    </nav>

  </aside>
</template>

<style scoped>
.sidebar {
  width:240px;
  height:100vh;
  flex-shrink:0;

  display:flex;
  flex-direction:column;

  padding:24px 16px;

  background:#fff;
  border-right:1px solid #eeeeee;
}

.brand {
  padding:0 12px 20px;
  margin-bottom:16px;

  border-bottom:1px solid #f1f5f9;
}

.brand h2 {
  margin:0;

  font-size:18px;
  font-weight:700;

  color:#202124;
}

.brand span {
  display:block;

  margin-top:4px;

  font-size:12px;
  color:#94a3b8;
}

.menu {
  display:flex;
  flex-direction:column;
  gap:6px;
}

.menu a {
  display:flex;
  align-items:center;

  gap:10px;

  padding:10px 12px;

  border-radius:8px;

  color:#64748b;

  text-decoration:none;

  font-size:14px;
  font-weight:500;

  transition:.2s;
}

.icon {
  width:22px;
  text-align:center;
}

.menu a:hover {
  background:#f8fafc;
  color:#2563eb;
}

.menu a.router-link-active {
  background:#eff6ff;
  color:#2563eb;
  font-weight:600;
}
</style>