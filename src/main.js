import { createApp } from 'vue'
import App from './App.vue'
import ListItem from './components/ListItem.vue'

const app = createApp(App)
app.component("list-item", ListItem)
app.mount("#app")
