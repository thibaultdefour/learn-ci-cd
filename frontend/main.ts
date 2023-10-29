import { createApp } from 'vue'
import 'vuetify/styles/main.css'
import { createVuetify } from 'vuetify'
// eslint-disable-next-line import/extensions
import * as components from 'vuetify/components'
// eslint-disable-next-line import/extensions
import * as directives from 'vuetify/directives'
import App from './App.vue'
import '@mdi/font/css/materialdesignicons.css'

const vuetify = createVuetify({
    components,
    directives,
    icons: {
        defaultSet: 'mdi'
    }
})

createApp(App).use(vuetify).mount('#app')
