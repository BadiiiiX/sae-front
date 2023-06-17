import { createApp } from 'vue'
// @ts-ignore
import App from './App.vue'
import './assets/css/style.css'
import {defaultConfig, plugin} from "@formkit/vue";
import {config} from "./formkit.config.ts";

createApp(App).use(plugin, defaultConfig(config)).mount('#app')
