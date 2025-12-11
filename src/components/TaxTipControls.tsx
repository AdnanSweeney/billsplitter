import { ChangeEvent } from 'react'
import styled from 'styled-components'
import {
  Card,
  SectionTitle,
  SectionDescription,
  HelperText,
  controlStyles,
  buttonStyles,
} from '../styles/primitives'
import { CUSTOM_TAX_PRESET_ID, TAX_PRESETS } from '../constants'
import { useBillStateContext } from '../hooks'

const Panel = styled(Card)`
  gap: 1.5rem;
`

const Intro = styled.header`
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
`

const Title = styled(SectionTitle)``

const Description = styled(SectionDescription)`
  color: var(--color-text-muted);
`

const FieldGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`

const Label = styled.label`
  font-size: 0.9rem;
  font-weight: 600;
  color: var(--color-text-muted);
`

const Select = styled.select`
  ${controlStyles}
  appearance: none;
  background-image: linear-gradient(45deg, transparent 50%, var(--color-text-muted) 50%),
    linear-gradient(135deg, var(--color-text-muted) 50%, transparent 50%);
  background-position: calc(100% - 18px) calc(50% - 2px), calc(100% - 13px) calc(50% - 2px);
  background-size: 5px 5px, 5px 5px;
  background-repeat: no-repeat;
  padding-right: 2.5rem;
`

const Input = styled.input`
  ${controlStyles}
`

const ModeToggle = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
  gap: 0.75rem;
`

const ToggleButton = styled.button<{ $active: boolean }>`
  ${buttonStyles}
  min-height: 2.75rem;
  border: 1px solid ${({ $active }) => ($active ? 'transparent' : 'var(--color-border-strong)')};
  background: ${({ $active }) => ($active ? 'var(--color-primary)' : 'var(--color-surface)')};
  color: ${({ $active }) => ($active ? '#fff' : 'var(--color-heading)')};
  box-shadow: ${({ $active }) => ($active ? 'var(--shadow-button)' : 'none')};

  &:hover:not(:disabled) {
    transform: translateY(-1px);
    box-shadow: ${({ $active }) => ($active ? 'var(--shadow-button)' : 'var(--shadow-card)')};
  }
`

export function TaxTipControls() {
  const { state, setSelectedProvinceId, setTaxRate, setTipMode, setTipPercentage } =
    useBillStateContext()

  const provinceExists = TAX_PRESETS.some((preset) => preset.id === state.selectedProvinceId)
  const provinceValue = provinceExists ? state.selectedProvinceId : CUSTOM_TAX_PRESET_ID

  const handleProvinceChange = (event: ChangeEvent<HTMLSelectElement>) => {
    const nextProvince = event.target.value
    setSelectedProvinceId(nextProvince)

    const preset = TAX_PRESETS.find((option) => option.id === nextProvince)
    if (preset) {
      setTaxRate(preset.rate)
    }
  }

  const handleCustomTaxChange = (event: ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(event.target.value)
    const normalized = Number.isNaN(value) ? 0 : value
    setTaxRate(Math.max(0, normalized) / 100)
  }

  const handleTipChange = (event: ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(event.target.value)
    const normalized = Number.isNaN(value) ? 0 : value
    setTipPercentage(Math.max(0, normalized) / 100)
  }

  return (
    <Panel>
      <Intro>
        <Title>Tax &amp; Tip Settings</Title>
        <Description>Fine-tune regional tax presets and how tips are distributed across people.</Description>
      </Intro>

      <FieldGroup>
        <Label htmlFor="province">Province preset</Label>
        <Select id="province" value={provinceValue} onChange={handleProvinceChange}>
          {TAX_PRESETS.map((preset) => (
            <option key={preset.id} value={preset.id}>
              {preset.label}
            </option>
          ))}
          <option value={CUSTOM_TAX_PRESET_ID}>Custom rate</option>
        </Select>
        <HelperText>
          Applies {Math.round(state.taxRate * 1000) / 10}% tax to any new items you add.
        </HelperText>
      </FieldGroup>

      {provinceValue === CUSTOM_TAX_PRESET_ID && (
        <FieldGroup>
          <Label htmlFor="customTax">Custom tax rate (%)</Label>
          <Input
            id="customTax"
            type="number"
            min="0"
            step="0.1"
            value={(state.taxRate * 100).toFixed(1)}
            onChange={handleCustomTaxChange}
          />
        </FieldGroup>
      )}

      <FieldGroup>
        <Label>Tip mode</Label>
        <ModeToggle>
          <ToggleButton
            type="button"
            $active={state.tipMode === 'proportional'}
            onClick={() => setTipMode('proportional')}
          >
            Proportional
          </ToggleButton>
          <ToggleButton
            type="button"
            $active={state.tipMode === 'equal'}
            onClick={() => setTipMode('equal')}
          >
            Equal split
          </ToggleButton>
        </ModeToggle>
        <HelperText>
          Proportional splits tip based on each person&apos;s subtotal. Equal split divides it evenly between
          participants.
        </HelperText>
      </FieldGroup>

      <FieldGroup>
        <Label htmlFor="tipPercent">Tip percentage</Label>
        <Input
          id="tipPercent"
          type="number"
          min="0"
          step="0.5"
          value={(state.tipPercentage * 100).toFixed(1)}
          onChange={handleTipChange}
        />
        <HelperText>The total tip is calculated as a percentage of the pre-tax subtotal.</HelperText>
      </FieldGroup>
    </Panel>
  )
}
