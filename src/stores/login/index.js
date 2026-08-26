import { defineStore } from 'pinia'
import { Notify } from 'quasar'
import { api } from '@/boot/axios'

export const useLoginStore = defineStore('login', {
  state: () => ({
    loading: false,
    user: null,
    showPassword: false,
    form: {
      email: '',
      password: '',
      remember: false,
    },
  }),
  actions: {
    async login() {
      this.loading = true
      try {
        const response = await api.post('/v2/auth/login', {
          login: this.form.email,
          password: this.form.password,
          device_name: 'orado-club',
        })
        const data = response.data?.data
        this.clearSession()
        window.localStorage.setItem('orado_club_token', String(data.token))
        window.localStorage.setItem('orado_club_user', JSON.stringify(data.user))
        this.user = data.user
        this.form.password = ''
        Notify.create({ type: 'positive', message: response.data?.message || 'Login berhasil.' })
        return true
      } catch (error) {
        Notify.create({
          type: 'negative',
          message:
            error.response?.data?.errors?.login?.[0] ||
            error.response?.data?.message ||
            'Tidak dapat terhubung ke server.',
        })
        return false
      } finally {
        this.loading = false
      }
    },

    async logout() {
      try {
        await api.post('/v2/auth/logout')
      } catch (error) {
        console.error(error)
      } finally {
        this.clearSession()
      }
    },

    async getUser() {
      try {
        const response = await api.get('/v2/auth/me')
        this.user = response.data?.data ?? null
        window.localStorage.setItem('orado_club_user', JSON.stringify(this.user))
        return this.user
      } catch {
        this.clearSession()
        return null
      }
    },

    clearSession() {
      localStorage.removeItem('orado_club_token')
      sessionStorage.removeItem('orado_club_token')
      localStorage.removeItem('orado_club_user')
      sessionStorage.removeItem('orado_club_user')
      this.user = null
    },
  },
})
