/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: ['class'],
  theme: {
    extend: {
      colors: {
        background: 'var(--color-background)',
        foreground: 'var(--color-foreground)',
        card: {
          DEFAULT: 'var(--color-card)',
          foreground: 'var(--color-card-foreground)',
        },
        popover: {
          DEFAULT: 'var(--color-popover)',
          foreground: 'var(--color-popover-foreground)',
        },
        primary: {
          DEFAULT: 'var(--color-primary)',
          foreground: 'var(--color-primary-foreground)',
        },
        secondary: {
          DEFAULT: 'var(--color-secondary)',
          foreground: 'var(--color-secondary-foreground)',
        },
        muted: {
          DEFAULT: 'var(--color-muted)',
          foreground: 'var(--color-muted-foreground)',
        },
        accent: {
          DEFAULT: 'var(--color-accent)',
          foreground: 'var(--color-accent-foreground)',
        },
        destructive: {
          DEFAULT: 'var(--color-destructive)',
          foreground: 'var(--color-destructive-foreground)',
        },
        success: {
          DEFAULT: 'var(--color-success)',
          foreground: 'var(--color-success-foreground)',
        },
        border: 'var(--color-border)',
        input: 'var(--color-input)',
        ring: 'var(--color-ring)',
        cage: {
          free: 'var(--color-cage-free)',
          'free-foreground': 'var(--color-cage-free-foreground)',
          'free-soft': 'var(--color-cage-free-soft)',
          'free-border': 'var(--color-cage-free-border)',
          single: 'var(--color-cage-single)',
          'single-foreground': 'var(--color-cage-single-foreground)',
          'single-soft': 'var(--color-cage-single-soft)',
          'single-border': 'var(--color-cage-single-border)',
          couple: 'var(--color-cage-couple)',
          'couple-foreground': 'var(--color-cage-couple-foreground)',
          'couple-soft': 'var(--color-cage-couple-soft)',
          'couple-border': 'var(--color-cage-couple-border)',
        },
        sidebar: {
          DEFAULT: 'var(--color-sidebar)',
          foreground: 'var(--color-sidebar-foreground)',
          primary: 'var(--color-sidebar-primary)',
          'primary-foreground': 'var(--color-sidebar-primary-foreground)',
          accent: 'var(--color-sidebar-accent)',
          'accent-foreground': 'var(--color-sidebar-accent-foreground)',
          border: 'var(--color-sidebar-border)',
          ring: 'var(--color-sidebar-ring)',
        },
        logo: {
          bg: 'var(--color-logo-bg)',
          ring: 'var(--color-logo-ring)',
        },
      },
      borderRadius: {
        sm: 'var(--radius-sm)',
        md: 'var(--radius-md)',
        lg: 'var(--radius-lg)',
        xl: 'var(--radius-xl)',
        '2xl': 'var(--radius-2xl)',
      },
      fontFamily: {
        sans: ['var(--font-sans)'],
        display: ['var(--font-display)'],
      },
      backgroundImage: {
        'gradient-primary': 'var(--gradient-primary)',
        'gradient-aurora': 'var(--gradient-aurora)',
      },
    },
  },
  plugins: [],
}
