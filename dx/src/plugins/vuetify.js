import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
import '@mdi/font/css/materialdesignicons.css'

export default createVuetify({
  components,
  directives,
  
  // 🎨 테마 설정 (추가적인 색상 포함)
  theme: {
    themes: {
      light: {
        dark: false,
        colors: {
          primary: '#222222', 
          secondary: '#0E51A0',
          accent: '#181F47',
          error: '#D32F2F',  
          info: '#20C39D',
          success: '#388E3C',
          warning: '#FFA000', 
          background: '#F5F5F5', 
          selectActive: '#FF5733' 
        }
      },
    },
  },

  // 🖼️ 아이콘 설정
  icons: {
    defaultSet: 'mdi',
  },

  // 🎨 전역 스타일 적용
  styles: {
    configFile: 'src/assets/styles/settings.scss',
  },

  // 📌 기본 컴포넌트 스타일 (`defaults`)
  defaults: {
    // 🔤 입력 필드 스타일
    VTextField: {
      variant: 'outlined', // `plain` → `outlined`로 변경 (더 명확한 입력 필드)
      density: 'comfortable',
      color: 'primary',
      class: 'custom-text-field',
      rounded: 'md',
    },

    // 🔘 버튼 스타일
    VBtn: {
      variant: 'elevated', // `flat` → `elevated`로 변경 (더 입체적인 디자인)
      rounded: 'xl', 
      elevation: 3, 
      class: 'custom-btn',
      size: 'large', 
    },

    // 🃏 카드 텍스트 스타일
    VCardText: { 
      class: 'custom-card-text',
      density: 'compact', 
    },

    // 🔽 드롭다운 (VSelect) 스타일
    VSelect: {
      variant: 'outlined', 
      density: 'comfortable',
      class: 'custom-select', 
      menuIcon: 'mdi-chevron-down',
      menuProps: { 
        offsetY: true, 
        maxHeight: '300px' ,
        contentClass: 'custom-select-menu',
      },
    },
    VMenu: {
      contentClass: 'select-menu-box', 
    }
  }
})
