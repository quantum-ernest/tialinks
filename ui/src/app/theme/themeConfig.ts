import type { ThemeConfig } from 'antd'

const themeConfig: ThemeConfig = {
  token: {
    colorPrimary: '#7C3AED',
    colorLink: '#7C3AED',
    borderRadius: 8,
    fontFamily: 'Inter, sans-serif',
  },
  components: {
    Button: {
      borderRadius: 8,
      controlHeight: 40,
    },
    Input: {
      borderRadius: 8,
      controlHeight: 50,
    },
    Card: {
      borderRadius: 12,
    },
  },
}

export default themeConfig
