import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router, { updateRoutes } from './router'

const app = createApp(App)


app.use(createPinia())

const initializeApp = async () => {

  //dynamic import stores
  const { useDataStore } = await import('./stores/FormDataStore')
  const store = useDataStore()

  const { useConfigStore } = await import('./stores/ConfigStore')
  const configStore = useConfigStore()

  await store.loadFormData()

  // Update routes with loaded data
  if (store.formJsonData) {

    updateRoutes(store.formJsonData)

    configStore.setLanguage(store.formJsonData.properties.language || 'en-GB') // Set default language from form data
    configStore.setCurrency(store.formJsonData.properties.currency || 'EUR') // Set default currency from form data
    configStore.setRenderMode(store.formJsonData.properties.renderMode || 'pagination')// Set default renderMode from form data

    // Wait for router to be ready before mounting
    router.isReady().then(() => {
      // Get current path to check if it's valid
      const currentPath = window.location.pathname
      const availableRoutes = router.getRoutes().map(r => r.path)

      //console.log('Available routes:', availableRoutes)
      //console.log('Current path:', currentPath)

      // If current path isn't in available routes, redirect to root
      if (!availableRoutes.includes(currentPath) && currentPath !== '/') {
        console.log('Redirecting to root from invalid path:', currentPath)
        router.replace('/')
      }


    })
    app.use(router)
    // Mount the app
    app.mount('#app')

  } else {
    console.error('Failed to load form data')
    app.use(router)
    app.mount('#app')
  }
}
initializeApp()

