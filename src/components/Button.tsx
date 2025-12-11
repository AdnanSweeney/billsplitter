import styled from 'styled-components'

interface ButtonProps {
  variant?: 'primary' | 'secondary'
}

const StyledButton = styled.button<ButtonProps>`
  padding: 12px 24px;
  font-size: 1rem;
  font-weight: 600;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease-in-out;
  background-color: ${(props) => (props.variant === 'secondary' ? '#6c757d' : '#007bff')};
  color: white;

  &:hover {
    opacity: 0.9;
    transform: translateY(-2px);
  }

  &:active {
    transform: translateY(0);
  }
`

export default StyledButton
