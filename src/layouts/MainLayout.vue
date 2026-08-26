<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated>
      <q-toolbar>
        <q-avatar size="30px" class="header-logo"><img src="@/assets/orado/logo-white.svg" alt="ORADO" /></q-avatar>
        <q-toolbar-title>ORADO CLUB</q-toolbar-title>
        <q-btn flat round dense icon="notifications_none" aria-label="Notifikasi">
          <q-badge floating rounded color="red" label="3" />
        </q-btn>
      </q-toolbar>
    </q-header>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<style scoped>
.q-header { background: #006b4f; }
.q-toolbar { min-height: 58px; }
.q-toolbar-title { font-size: 14px; font-weight: 700; }
.header-logo { display: grid; margin-left: 4px; place-items: center; background: rgba(255,255,255,.1); }
.header-logo img { width: 25px; height: 25px; object-fit: contain; }
</style>
