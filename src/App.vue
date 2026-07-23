<script setup lang="ts">
import Sidebar from './components/Sidebar.vue'
</script>

<template>
  <div class="app-layout">

    <Sidebar />

    <div class="main-layout">

      <!-- <header class="topbar">
        <div class="title-group">
          <h1>Mantis Helper</h1>
          <span>每日通知系統</span>
        </div>
      </header> -->

      <main class="content">
        <RouterView />
      </main>

    </div>

  </div>
</template>

<style scoped>

/* Theme */
.app-layout {
  --background:#fafafa;
  --border:#eeeeee;
  --text:#202124;
  --sub-text:#8a8f98;
}


/* Layout */
.app-layout {
  display:flex;
  width:100%;
  height:100dvh;
  overflow:hidden;
  background:var(--background);
}


.main-layout {
  flex:1;
  min-width:0;
  display:flex;
  flex-direction:column;
}


/* Header */
.topbar {
  height:64px;
  display:flex;
  align-items:center;
  padding:0 32px;

  background:#fff;
  border-bottom:1px solid var(--border);
}


.title-group {
  display:flex;
  flex-direction:column;
  gap:2px;
}


.title-group h1 {
  margin:0;

  font-size:20px;
  font-weight:600;

  color:var(--text);
}


.title-group span {
  font-size:12px;
  color:var(--sub-text);
}


/* Content */
.content {
  flex:1;
  overflow:auto;

  padding:32px;

  background:#fafafa;
}


/* Scrollbar */
.content::-webkit-scrollbar {
  width:6px;
}

.content::-webkit-scrollbar-thumb {
  background:#dcdfe4;
  border-radius:20px;
}

.content::-webkit-scrollbar-track {
  background:transparent;
}


/* Mobile */
@media(max-width:768px){

  .app-layout{
    flex-direction:column;
  }

  .topbar{
    height:56px;
    padding:0 20px;
  }

  .content{
    padding:16px;
  }

  .title-group h1{
    font-size:18px;
  }

}

</style>