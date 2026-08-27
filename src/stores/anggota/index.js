import { defineStore } from 'pinia'
import { Notify } from 'quasar'
import { api } from '@/boot/axios'

export const useAnggotaStore = defineStore('anggota', {
  state: () => ({
    loading: false,
    saving: false,
    anggota: [],
    search: '',
    form: {
      name: '',
      email: '',
      nik: '',
      no_hp: '',
    },
  }),
  actions: {
    async getData() {
      this.loading = true
      try {
        const response = await api.get('/v2/club/anggota', {
          params: { search: this.search || undefined },
        })
        this.anggota = response.data?.data ?? []
      } catch (error) {
        Notify.create({
          type: 'negative',
          message: error.response?.data?.message || 'Data anggota gagal dimuat.',
        })
      } finally {
        this.loading = false
      }
    },

    async saveData() {
      this.saving = true
      try {
        const response = await api.post('/v2/club/anggota', this.form)
        Notify.create({
          type: 'positive',
          message: response.data?.message || 'Anggota berhasil disimpan.',
        })
        this.resetForm()
        return true
      } catch (error) {
        const errors = error.response?.data?.errors
        Notify.create({
          type: 'negative',
          message:
            errors?.name?.[0] ||
            errors?.email?.[0] ||
            errors?.nik?.[0] ||
            errors?.no_hp?.[0] ||
            error.response?.data?.message ||
            'Anggota gagal disimpan.',
        })
        return false
      } finally {
        this.saving = false
      }
    },

    resetForm() {
      this.form.name = ''
      this.form.email = ''
      this.form.nik = ''
      this.form.no_hp = ''
    },
  },
})
