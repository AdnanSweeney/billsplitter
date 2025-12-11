import styled, { css } from 'styled-components'

export const cardStyles = css`
  width: 100%;
  background: var(--color-surface);
  border-radius: clamp(1rem, 2vw, 1.35rem);
  border: 1px solid var(--color-border);
  padding: clamp(1.25rem, 4vw, 2rem);
  box-shadow: var(--shadow-card);
`

export const Card = styled.section`
  ${cardStyles}
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
`

export const sectionTitleStyles = css`
  font-size: clamp(1.2rem, 2vw, 1.5rem);
  font-weight: 600;
  letter-spacing: -0.01em;
  color: var(--color-heading);
  margin: 0;
`

export const SectionTitle = styled.h2`
  ${sectionTitleStyles}
`

export const helperTextStyles = css`
  margin: 0;
  font-size: 0.95rem;
  color: var(--color-text-muted);
`

export const SectionDescription = styled.p`
  ${helperTextStyles}
`

export const HelperText = styled.p`
  ${helperTextStyles}
  font-size: 0.9rem;
`

export const controlStyles = css`
  width: 100%;
  padding: 0.85rem 1rem;
  border-radius: 0.85rem;
  border: 1.5px solid var(--color-border-strong);
  background: var(--color-surface-muted);
  font-size: 1rem;
  line-height: 1.4;
  color: var(--color-text);
  transition:
    border-color 0.2s ease,
    box-shadow 0.2s ease,
    background 0.2s ease,
    color 0.2s ease;

  &:focus-visible {
    outline: none;
    border-color: var(--color-primary);
    box-shadow: 0 0 0 3px var(--color-focus-ring);
    background: #fff;
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`

export const buttonStyles = css`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.35rem;
  padding: 0.85rem 1.35rem;
  border-radius: 999px;
  border: none;
  font-weight: 600;
  font-size: 1rem;
  cursor: pointer;
  min-height: 3rem;
  transition:
    transform 0.2s ease,
    box-shadow 0.2s ease,
    background 0.2s ease,
    color 0.2s ease;

  &:focus-visible {
    outline: none;
    box-shadow: 0 0 0 3px var(--color-focus-ring);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    transform: none;
    box-shadow: none;
  }
`

type ButtonVariant = 'primary' | 'secondary' | 'danger'

const variantBackground: Record<ButtonVariant, string> = {
  primary: 'var(--color-primary)',
  secondary: 'var(--color-surface-muted)',
  danger: 'var(--color-danger)',
}

const variantHoverBackground: Record<ButtonVariant, string> = {
  primary: 'var(--color-primary-strong)',
  secondary: '#fff',
  danger: 'var(--color-danger-strong)',
}

const variantColor: Record<ButtonVariant, string> = {
  primary: '#fff',
  secondary: 'var(--color-heading)',
  danger: '#fff',
}

const variantShadow: Record<ButtonVariant, string> = {
  primary: 'var(--shadow-button)',
  secondary: 'none',
  danger: 'var(--shadow-button-danger)',
}

export const Button = styled.button<{ $variant?: ButtonVariant }>`
  ${buttonStyles}
  background: ${({ $variant = 'primary' }) => variantBackground[$variant]};
  color: ${({ $variant = 'primary' }) => variantColor[$variant]};
  border: ${({ $variant = 'primary' }) =>
    $variant === 'secondary' ? '1px solid var(--color-border-strong)' : 'none'};
  box-shadow: ${({ $variant = 'primary' }) => variantShadow[$variant]};

  &:hover:not(:disabled) {
    transform: translateY(-1px);
    background: ${({ $variant = 'primary' }) => variantHoverBackground[$variant]};
    color: ${({ $variant = 'primary' }) => variantColor[$variant]};
    box-shadow: ${({ $variant = 'primary' }) =>
      $variant === 'secondary' ? 'var(--shadow-card)' : variantShadow[$variant]};
  }
`
