<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated>
      <q-toolbar>
        <q-avatar size="30px" class="header-logo"
          ><img src="@/assets/orado/logo-white.svg" alt="ORADO"
        /></q-avatar>
        <q-toolbar-title>ORADO CLUB</q-toolbar-title>
        <q-btn flat round dense icon="notifications_none" aria-label="Notifikasi">
          <q-badge floating rounded color="red" label="3" />
        </q-btn>
      </q-toolbar>
    </q-header>

    <q-page-container>
      <router-view />
    </q-page-container>

    <q-footer class="main-footer">
      <nav class="bottom-nav" aria-label="Navigasi utama">
        <q-btn
          flat
          no-caps
          class="nav-item"
          :class="{ 'nav-item--active': route.path === '/' }"
          icon="home"
          label="Home"
          @click="router.push('/')"
        />
        <q-btn
          flat
          no-caps
          class="nav-item"
          :class="{ 'nav-item--active': route.path === '/akun' }"
          icon="person_outline"
          label="Akun"
          @click="router.push('/akun')"
        />
        <q-btn flat no-caps class="nav-item" icon="logout" label="Logout" @click="handleLogout" />
      </nav>
    </q-footer>
  </q-layout>
</template>

<script setup>
import { useRoute, useRouter } from 'vue-router'
import { useLoginStore } from '@/stores/login'

const route = useRoute()
const router = useRouter()
const loginStore = useLoginStore()

async function handleLogout() {
  await loginStore.logout()
  await router.replace('/login')
}
</script>

<style scoped>
.q-header {
  background: #006b4f;
}
.q-toolbar {
  min-height: 58px;
}
.q-toolbar-title {
  font-size: 14px;
  font-weight: 700;
}
.header-logo {
  display: grid;
  margin-left: 4px;
  place-items: center;
  background: rgba(255, 255, 255, 0.1);
}
.header-logo img {
  width: 25px;
  height: 25px;
  object-fit: contain;
}
.main-footer {
  background: #006b4f;
  box-shadow: 0 -5px 16px rgba(3, 73, 53, 0.16);
}
.bottom-nav {
  display: flex;
  justify-content: center;
  gap: 30px;
  padding: 8px 12px calc(8px + env(safe-area-inset-bottom));
}
.nav-item {
  min-width: 68px;
  min-height: 49px;
  flex-direction: column;
  gap: 2px;
  border-radius: 10px;
  color: rgba(255, 255, 255, 0.7);
  font-size: 10px;
}
.nav-item :deep(.q-icon) {
  font-size: 22px;
}
.nav-item--active {
  color: #fff;
  font-weight: 800;
  background: rgba(255, 255, 255, 0.12);
}
</style>
