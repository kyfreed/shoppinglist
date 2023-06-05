import { createApp } from 'vue'
import App from './App.vue'
import ListItem from './components/ListItem.vue'
import {Tabs, Tab} from 'vue3-tabs-component'

const app = createApp(App)
app.component("list-item", ListItem)
app.component("tabs", Tabs)
app.component("tab", Tab)
app.mount("#app")
