import { boot } from 'quasar/wrappers'

export default boot(() => {
  window.addEventListener('beforeinstallprompt', (event) => {
    event.preventDefault()
    window.__oradoClubInstallPrompt = event
    window.dispatchEvent(new CustomEvent('orado-club:pwa-install-ready'))
  })

  window.addEventListener('appinstalled', () => {
    window.__oradoClubInstallPrompt = null
    window.dispatchEvent(new CustomEvent('orado-club:pwa-installed'))
  })
})
