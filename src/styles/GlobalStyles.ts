import { createGlobalStyle } from 'styled-components'

const GlobalStyles = createGlobalStyle`
  @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&display=swap');

  :root {
    --color-app-bg: #f3f5ff;
    --color-heading: #0f172a;
    --color-text: #1e2433;
    --color-text-muted: #475467;
    --color-border: rgba(15, 23, 42, 0.08);
    --color-border-strong: rgba(15, 23, 42, 0.16);
    --color-surface: #ffffff;
    --color-surface-muted: #f4f5fb;
    --color-primary: #6c5ce7;
    --color-primary-strong: #5a46d6;
    --color-primary-soft: rgba(108, 92, 231, 0.12);
    --color-danger: #ef4444;
    --color-danger-strong: #dc2626;
    --color-success: #16a34a;
    --color-success-soft: #e8f8ef;
    --color-error-soft: #fdecef;
    --color-focus-ring: rgba(108, 92, 231, 0.35);
    --shadow-card: 0 24px 60px rgba(15, 23, 42, 0.08);
    --shadow-button: 0 18px 35px rgba(108, 92, 231, 0.3);
    --shadow-button-danger: 0 18px 35px rgba(239, 68, 68, 0.25);
  }

  *, *::before, *::after {
    box-sizing: border-box;
  }

  body {
    margin: 0;
    min-height: 100vh;
    font-family: 'Space Grotesk', 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
    background:
      radial-gradient(circle at 15% 20%, rgba(236, 72, 153, 0.15), transparent 40%),
      radial-gradient(circle at 80% 0%, rgba(59, 130, 246, 0.15), transparent 42%),
      var(--color-app-bg);
    color: var(--color-text);
    line-height: 1.6;
    letter-spacing: -0.01em;
    -webkit-font-smoothing: antialiased;
  }

  #root {
    min-height: 100vh;
  }

  h1, h2, h3, h4, h5, h6 {
    color: var(--color-heading);
    line-height: 1.2;
    font-weight: 600;
  }

  p {
    margin: 0;
  }

  ul, ol {
    margin: 0;
    padding: 0;
  }

  button, input, select, textarea {
    font: inherit;
    color: inherit;
  }

  :focus-visible {
    outline-color: var(--color-primary);
    outline-offset: 2px;
  }

  ::selection {
    background: var(--color-primary);
    color: #fff;
  }

  @media (prefers-reduced-motion: reduce) {
    *, *::before, *::after {
      animation-duration: 0.01ms !important;
      animation-iteration-count: 1 !important;
      transition-duration: 0.01ms !important;
      scroll-behavior: auto !important;
    }
  }
`

export default GlobalStyles
