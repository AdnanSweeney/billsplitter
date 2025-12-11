import { useState } from 'react'
import styled from 'styled-components'
import { useBillStateContext } from '../hooks'
import { ItemSplit } from '../types'

const FormContainer = styled.div`
  background: white;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 600px;
`

const FormTitle = styled.h2`
  font-size: 1.5rem;
  margin-bottom: 20px;
  color: #333;
`

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 16px;
  margin-bottom: 24px;
`

const FormRow = styled.div`
  display: flex;
  gap: 12px;
  flex-wrap: wrap;

  @media (max-width: 600px) {
    flex-direction: column;
  }
`

const Input = styled.input`
  flex: 1;
  padding: 12px;
  font-size: 1rem;
  border: 2px solid #e0e0e0;
  border-radius: 8px;
  transition: border-color 0.2s;
  min-width: 150px;

  &:focus {
    outline: none;
    border-color: #667eea;
  }

  &:invalid {
    border-color: #e74c3c;
  }
`

const Label = styled.label`
  font-size: 0.875rem;
  font-weight: 600;
  color: #555;
  margin-bottom: 4px;
  display: block;
`

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
  min-width: 150px;
`

const SplitsSection = styled.div`
  border: 2px solid #e0e0e0;
  border-radius: 8px;
  padding: 16px;
  background-color: #f9f9f9;
`

const SplitsTitle = styled.h3`
  font-size: 1rem;
  margin-bottom: 12px;
  color: #555;
`

const SplitRow = styled.div`
  display: flex;
  gap: 8px;
  align-items: center;
  margin-bottom: 8px;

  @media (max-width: 600px) {
    flex-wrap: wrap;
  }
`

const SplitName = styled.span`
  flex: 1;
  min-width: 120px;
  font-weight: 500;
  color: #333;
`

const PercentageInput = styled(Input)`
  max-width: 100px;
  min-width: 80px;
`

const TotalPercentage = styled.div<{ isValid: boolean }>`
  margin-top: 12px;
  padding: 12px;
  background-color: ${(props) => (props.isValid ? '#d4edda' : '#f8d7da')};
  color: ${(props) => (props.isValid ? '#155724' : '#721c24')};
  border-radius: 6px;
  font-weight: 600;
  text-align: center;
`

const Button = styled.button<{ variant?: 'primary' | 'danger' }>`
  padding: 12px 24px;
  font-size: 1rem;
  font-weight: 600;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease-in-out;
  background-color: ${(props) => {
    if (props.variant === 'danger') return '#e74c3c'
    return '#667eea'
  }};
  color: white;

  &:hover:not(:disabled) {
    opacity: 0.9;
    transform: translateY(-2px);
  }

  &:active:not(:disabled) {
    transform: translateY(0);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`

const ItemsList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
`

const ItemElement = styled.li`
  padding: 16px;
  border-bottom: 1px solid #e0e0e0;
  transition: background-color 0.2s;

  &:hover {
    background-color: #f5f5f5;
  }

  &:last-child {
    border-bottom: none;
  }
`

const ItemHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
`

const ItemName = styled.span`
  font-size: 1.1rem;
  font-weight: 600;
  color: #333;
`

const ItemAmount = styled.span`
  font-size: 1.1rem;
  font-weight: 600;
  color: #667eea;
`

const ItemSplitsDisplay = styled.div`
  font-size: 0.875rem;
  color: #666;
  margin-bottom: 8px;
`

const ErrorMessage = styled.p`
  color: #e74c3c;
  font-size: 0.875rem;
  margin-top: 8px;
  margin-bottom: 0;
`

const EmptyState = styled.p`
  color: #999;
  font-style: italic;
  text-align: center;
  padding: 20px;
`

const ActionButtons = styled.div`
  display: flex;
  gap: 8px;
`

export function ItemForm() {
  const { state, addItem, removeItem } = useBillStateContext()
  const [itemName, setItemName] = useState('')
  const [itemPrice, setItemPrice] = useState('')
  const [splits, setSplits] = useState<Record<string, number>>({})
  const [error, setError] = useState('')

  const totalPercentage = Object.values(splits).reduce((sum, val) => sum + (val || 0), 0)
  const isPercentageValid = Math.abs(totalPercentage - 100) < 0.01 && totalPercentage > 0

  const handleSplitChange = (personId: string, value: string) => {
    const numValue = parseFloat(value) || 0
    setSplits((prev) => ({
      ...prev,
      [personId]: Math.max(0, Math.min(100, numValue)),
    }))
  }

  const handleEvenSplit = () => {
    if (state.people.length === 0) return

    const evenPercentage = parseFloat((100 / state.people.length).toFixed(2))
    const newSplits: Record<string, number> = {}

    state.people.forEach((person, index) => {
      if (index === state.people.length - 1) {
        // Assign remaining to last person to ensure exactly 100%
        const assigned = evenPercentage * (state.people.length - 1)
        newSplits[person.id] = parseFloat((100 - assigned).toFixed(2))
      } else {
        newSplits[person.id] = evenPercentage
      }
    })

    setSplits(newSplits)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    const trimmedName = itemName.trim()
    const price = parseFloat(itemPrice)

    if (!trimmedName) {
      setError('Item name is required')
      return
    }

    if (!itemPrice || isNaN(price) || price <= 0) {
      setError('Valid price is required')
      return
    }

    if (state.people.length === 0) {
      setError('Add at least one person before adding items')
      return
    }

    if (!isPercentageValid) {
      setError('Split percentages must total exactly 100%')
      return
    }

    const itemSplits: ItemSplit[] = Object.entries(splits)
      .filter(([_, percentage]) => percentage > 0)
      .map(([personId, percentage]) => ({ personId, percentage }))

    if (itemSplits.length === 0) {
      setError('At least one person must be assigned to the item')
      return
    }

    addItem(trimmedName, price, itemSplits)
    setItemName('')
    setItemPrice('')
    setSplits({})
  }

  const getPersonName = (personId: string) => {
    return state.people.find((p) => p.id === personId)?.name || 'Unknown'
  }

  return (
    <FormContainer>
      <FormTitle>Items</FormTitle>

      {state.people.length === 0 ? (
        <EmptyState>Add people first to start adding items!</EmptyState>
      ) : (
        <Form onSubmit={handleSubmit}>
          <FormRow>
            <FormGroup>
              <Label htmlFor="itemName">Item Description</Label>
              <Input
                id="itemName"
                type="text"
                placeholder="e.g., Appetizers"
                value={itemName}
                onChange={(e) => setItemName(e.target.value)}
                required
              />
            </FormGroup>

            <FormGroup>
              <Label htmlFor="itemPrice">Price ($)</Label>
              <Input
                id="itemPrice"
                type="number"
                step="0.01"
                min="0.01"
                placeholder="0.00"
                value={itemPrice}
                onChange={(e) => setItemPrice(e.target.value)}
                required
              />
            </FormGroup>
          </FormRow>

          <SplitsSection>
            <SplitsTitle>Split Between People (%)</SplitsTitle>
            <Button type="button" onClick={handleEvenSplit} style={{ marginBottom: '12px' }}>
              Split Evenly
            </Button>

            {state.people.map((person) => (
              <SplitRow key={person.id}>
                <SplitName>{person.name}</SplitName>
                <PercentageInput
                  type="number"
                  step="0.01"
                  min="0"
                  max="100"
                  placeholder="0"
                  value={splits[person.id] || ''}
                  onChange={(e) => handleSplitChange(person.id, e.target.value)}
                  aria-label={`Percentage for ${person.name}`}
                />
                <span>%</span>
              </SplitRow>
            ))}

            <TotalPercentage isValid={isPercentageValid}>
              Total: {totalPercentage.toFixed(2)}% {isPercentageValid ? '✓' : '✗'}
            </TotalPercentage>
          </SplitsSection>

          <Button type="submit" disabled={!itemName.trim() || !itemPrice || !isPercentageValid}>
            Add Item
          </Button>
        </Form>
      )}

      {error && <ErrorMessage role="alert">{error}</ErrorMessage>}

      {state.items.length === 0 ? (
        <EmptyState>No items added yet.</EmptyState>
      ) : (
        <ItemsList>
          {state.items.map((item) => (
            <ItemElement key={item.id}>
              <ItemHeader>
                <ItemName>{item.name}</ItemName>
                <ItemAmount>${item.amount.toFixed(2)}</ItemAmount>
              </ItemHeader>

              <ItemSplitsDisplay>
                Split:{' '}
                {item.splits
                  .map((split) => `${getPersonName(split.personId)} (${split.percentage}%)`)
                  .join(', ')}
              </ItemSplitsDisplay>

              <ActionButtons>
                <Button variant="danger" onClick={() => removeItem(item.id)}>
                  Remove
                </Button>
              </ActionButtons>
            </ItemElement>
          ))}
        </ItemsList>
      )}
    </FormContainer>
  )
}
