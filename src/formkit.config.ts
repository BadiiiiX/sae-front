// @ts-nocheck

import {fr} from '@formkit/i18n'
import {DefaultConfigOptions} from '@formkit/vue'
import {createFloatingLabelsPlugin} from '@formkit/addons'
import {genesisIcons} from '@formkit/icons'
import { createProPlugin, datepicker, taglist} from '@formkit/pro'

import '@formkit/themes/genesis'
import '@formkit/addons/css/floatingLabels'
import '@formkit/pro/genesis'


export const config: DefaultConfigOptions = {
    locales: {fr},
    locale: 'fr',
    theme: 'genesis',
    icons: {
        ...genesisIcons
    },
    plugins: [
        createFloatingLabelsPlugin({
        useAsDefault: true, // defaults to false
    }),
        createProPlugin(import.meta.env.VITE_FORM_KIT, {
            datepicker,
            taglist
        })
    ]
}