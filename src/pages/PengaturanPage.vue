<template>
  <q-page class="settings-page">
    <main class="settings-content">
      <div class="page-heading">
        <q-btn
          round
          flat
          icon="arrow_back"
          color="white"
          aria-label="Kembali"
          @click="router.push('/')"
        />
        <div>
          <span>PENGATURAN CLUB</span>
          <h1>Pengaturan</h1>
        </div>
      </div>

      <section class="settings-card">
        <button type="button" class="setting-item" @click="router.push('/pengaturan/biaya-iuran')">
          <span class="setting-icon"><q-icon name="payments" /></span>
          <span class="setting-copy"
            ><strong>Setting Biaya Iuran</strong
            ><small>Atur nominal iuran anggota per bulan.</small></span
          >
          <q-icon name="chevron_right" color="grey-6" />
        </button>
      </section>
    </main>
  </q-page>
</template>

<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()
</script>

<style scoped>
.settings-page {
  min-height: calc(100vh - 58px);
  padding: 16px 14px 36px;
  background: linear-gradient(180deg, #006b4f 0, #007354 180px, #eef6f2 180px);
}
.settings-content {
  max-width: 500px;
  margin: auto;
}
.page-heading {
  display: grid;
  grid-template-columns: 46px 1fr;
  align-items: center;
  gap: 10px;
  min-height: 104px;
  color: #fff;
}
.page-heading :deep(.q-btn) {
  background: rgba(255, 255, 255, 0.12);
}
.page-heading span {
  font-size: 9px;
  font-weight: 800;
  letter-spacing: 1px;
  opacity: 0.72;
}
.page-heading h1 {
  margin: 4px 0 0;
  font-size: 25px;
  line-height: 1.05;
}
.settings-card {
  overflow: hidden;
  border: 1px solid #d8e9e2;
  border-radius: 18px;
  background: #fff;
  box-shadow: 0 14px 30px rgba(3, 73, 53, 0.12);
}
.setting-item {
  display: flex;
  width: 100%;
  align-items: center;
  gap: 12px;
  padding: 16px;
  border: 0;
  color: inherit;
  background: transparent;
  text-align: left;
  cursor: pointer;
}
.setting-item:active {
  background: #f1faf5;
}
.setting-icon {
  display: grid;
  width: 42px;
  height: 42px;
  flex: 0 0 42px;
  place-items: center;
  border-radius: 13px;
  color: #08a849;
  background: #e4f8ea;
  font-size: 22px;
}
.setting-copy {
  display: flex;
  flex: 1;
  flex-direction: column;
  gap: 3px;
}
.setting-copy strong {
  color: #174c3d;
  font-size: 14px;
}
.setting-copy small {
  color: #789087;
  font-size: 10px;
}
</style>
