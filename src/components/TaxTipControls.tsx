import { ChangeEvent } from 'react'
import styled from 'styled-components'
import { CUSTOM_TAX_PRESET_ID, TAX_PRESETS } from '../constants'
import { useBillStateContext } from '../hooks'

const Panel = styled.div`
  background: white;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 600px;
`

const Title = styled.h2`
  font-size: 1.5rem;
  margin-bottom: 20px;
  color: #333;
`

const FieldGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-bottom: 16px;
`

const Label = styled.label`
  font-size: 0.875rem;
  font-weight: 600;
  color: #555;
`

const Select = styled.select`
  padding: 12px;
  border: 2px solid #e0e0e0;
  border-radius: 8px;
  font-size: 1rem;
  transition: border-color 0.2s;

  &:focus {
    outline: none;
    border-color: #667eea;
  }
`

const Input = styled.input`
  padding: 12px;
  border: 2px solid #e0e0e0;
  border-radius: 8px;
  font-size: 1rem;
  transition: border-color 0.2s;

  &:focus {
    outline: none;
    border-color: #667eea;
  }
`

const HelperText = styled.p`
  font-size: 0.85rem;
  color: #777;
  margin: 0;
`

const ModeToggle = styled.div`
  display: flex;
  gap: 12px;
`

const ToggleButton = styled.button<{ $active: boolean }>`
  flex: 1;
  padding: 12px;
  border-radius: 8px;
  border: none;
  cursor: pointer;
  font-weight: 600;
  background: ${(props) => (props.$active ? '#667eea' : '#f1f1f5')};
  color: ${(props) => (props.$active ? '#fff' : '#555')};
  transition: background 0.2s ease, transform 0.2s ease;

  &:hover {
    transform: translateY(-1px);
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
      <Title>Tax & Tip Settings</Title>

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
