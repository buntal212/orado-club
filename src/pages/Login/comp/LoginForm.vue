<template>
  <section class="login-form-wrap">
    <div class="login-heading">
      <p class="eyebrow">Selamat datang</p>
      <h1>Login Club</h1>
      <p>Silakan masuk untuk melanjutkan ke akun club Anda.</p>
    </div>

    <q-form class="login-form" @submit="onSubmit">
      <label class="field-label" for="email">Email atau username</label>
      <q-input
        id="email"
        v-model="loginStore.form.email"
        outlined
        dense
        hide-bottom-space
        autocomplete="username"
        placeholder="Masukkan email atau username"
        :rules="[(value) => !!value || 'Email atau username wajib diisi']"
      >
        <template #prepend>
          <q-icon name="person_outline" />
        </template>
      </q-input>

      <label class="field-label field-label--password" for="password">Password</label>
      <q-input
        id="password"
        v-model="loginStore.form.password"
        outlined
        dense
        hide-bottom-space
        autocomplete="current-password"
        placeholder="Masukkan password"
        :type="loginStore.showPassword ? 'text' : 'password'"
        :rules="[(value) => !!value || 'Password wajib diisi']"
      >
        <template #prepend>
          <q-icon name="lock_outline" />
        </template>
        <template #append>
          <q-icon
            class="cursor-pointer"
            :name="loginStore.showPassword ? 'visibility_off' : 'visibility'"
            @click="loginStore.showPassword = !loginStore.showPassword"
          />
        </template>
      </q-input>

      <div class="row items-center justify-between q-mt-sm">
        <q-checkbox v-model="loginStore.form.remember" dense label="Ingat saya" color="primary" />
        <q-btn flat dense no-caps class="forgot-btn" label="Lupa password?" />
      </div>

      <button type="button" class="registration-link" @click="router.push('/pendaftaran-club')"><q-icon name="group_add" /> <span>Pendaftaran Club</span></button>

      <q-btn
        unelevated
        no-caps
        type="submit"
        color="primary"
        class="full-width login-btn"
        label="Masuk"
        :loading="loginStore.loading"
        :disable="loginStore.loading"
      />
    </q-form>

    <p class="copyright">© 2026 ORADO. Hak cipta dilindungi.</p>
    <p class="support-by">Support by CV. UDUMBARA INFORMATIKA</p>
  </section>
</template>

<script setup>
import { useRouter } from 'vue-router'
import { useLoginStore } from '@/stores/login'

const loginStore = useLoginStore()
const router = useRouter()

async function onSubmit() {
  if (await loginStore.login()) await router.replace('/')
}
</script>

<style lang="scss" scoped>
.login-form-wrap {
  position: relative;
  z-index: 3;
  width: calc(100% - 18px);
  margin-top: -38px;
  margin-right: 9px;
  margin-left: 9px;
  padding: 30px 24px 22px;
  background: #fff;
  box-sizing: border-box;
  border-radius: 28px 28px 0 0;
}

.login-heading {
  margin-bottom: 24px;
  text-align: center;
}

.eyebrow {
  margin: 0 0 3px;
  color: $primary;
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 1.5px;
  text-transform: uppercase;
}

h1 {
  margin: 0;
  color: #15362b;
  font-size: 21px;
  font-weight: 700;
  line-height: 1.3;
}

.login-heading > p:last-child {
  margin: 6px 0 0;
  color: #718079;
  font-size: 11px;
  line-height: 1.55;
}

.field-label {
  display: block;
  margin: 0 0 7px;
  color: #31483f;
  font-size: 12px;
  font-weight: 600;
}

.field-label--password {
  margin-top: 16px;
}

.login-form :deep(.q-field__control) {
  height: 48px;
  border-radius: 11px;
  color: $primary;
}

.login-form :deep(.q-field__native) {
  color: #213a31;
  font-size: 13px;
}

.login-form :deep(.q-field__prepend),
.login-form :deep(.q-field__append) {
  color: #628076;
}

.login-form :deep(.q-checkbox__label) {
  color: #596b64;
  font-size: 12px;
}

.forgot-btn {
  color: $primary;
  font-size: 12px;
  font-weight: 600;
}

.login-btn {
  min-height: 48px;
  margin-top: 22px;
  border-radius: 11px;
  box-shadow: 0 10px 22px rgba(0, 112, 72, 0.24);
  font-size: 14px;
  font-weight: 700;
  letter-spacing: 0.3px;
}

.registration-link { display: flex; align-items: center; justify-content: center; gap: 8px; width: 100%; margin-top: 18px; padding: 7px; border: 0; color: $primary; background: transparent; font: inherit; font-size: 12px; font-weight: 700; cursor: pointer; }.registration-link .q-icon { font-size: 19px; }

.copyright {
  margin: 36px 0 0;
  color: #9ca8a3;
  font-size: 10px;
  text-align: center;
}

.support-by { margin: 5px 0 0; color: #647d72; font-size: 9px; font-weight: 800; letter-spacing: .2px; text-align: center; }
</style>
