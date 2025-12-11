import { useState } from 'react'
import styled from 'styled-components'
import { useBillStateContext } from '../hooks'
import { ItemSplit } from '../types'
import {
  Card,
  SectionTitle,
  SectionDescription,
  HelperText,
  controlStyles,
  Button,
} from '../styles/primitives'

const FormCard = styled(Card)`
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

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`

const FormRow = styled.div`
  display: grid;
  gap: 1rem;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
`

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.45rem;
`

const Label = styled.label`
  font-size: 0.9rem;
  font-weight: 600;
  color: var(--color-text-muted);
`

const Input = styled.input`
  ${controlStyles}
`

const SplitsSection = styled.section`
  border: 1px solid var(--color-border-strong);
  border-radius: 1rem;
  padding: 1rem;
  background: var(--color-surface-muted);
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
`

const SplitsHeader = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;

  @media (min-width: 640px) {
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
  }
`

const SplitsHeading = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
`

const SplitsTitle = styled.h3`
  margin: 0;
  font-size: 1rem;
  color: var(--color-heading);
`

const SplitsDescription = styled(HelperText)`
  font-size: 0.85rem;
`

const SplitEvenButton = styled(Button)`
  width: fit-content;
`

const SplitRows = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`

const SplitRow = styled.div`
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(80px, 120px) auto;
  align-items: center;
  gap: 0.5rem;

  @media (max-width: 480px) {
    grid-template-columns: minmax(0, 1fr) minmax(60px, 90px) auto;
  }
`

const SplitName = styled.span`
  font-weight: 600;
  color: var(--color-heading);
`

const PercentageInput = styled(Input)`
  text-align: right;
  padding-right: 0.75rem;
`

const PercentSuffix = styled.span`
  font-size: 0.95rem;
  font-weight: 600;
  color: var(--color-text-muted);
`

const TotalPercentage = styled.div<{ $isValid: boolean }>`
  padding: 0.75rem 1rem;
  border-radius: 0.85rem;
  font-weight: 600;
  text-align: center;
  background: ${({ $isValid }) =>
    $isValid ? 'var(--color-success-soft)' : 'var(--color-error-soft)'};
  color: ${({ $isValid }) => ($isValid ? 'var(--color-success)' : 'var(--color-danger)')};
`

const SubmitButton = styled(Button)`
  align-self: flex-start;
`

const ItemsList = styled.ul`
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin: 0;
  padding: 0;
`

const ItemElement = styled.li`
  border: 1px solid var(--color-border);
  border-radius: 1rem;
  padding: 1rem;
  background: var(--color-surface-muted);
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`

const ItemHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
`

const ItemName = styled.span`
  font-weight: 600;
  font-size: 1.05rem;
  color: var(--color-heading);
`

const ItemAmount = styled.span`
  font-weight: 700;
  color: var(--color-primary);
`

const ItemSplitsDisplay = styled.p`
  color: var(--color-text-muted);
  font-size: 0.9rem;
  margin: 0;
`

const ActionButtons = styled.div`
  display: flex;
  justify-content: flex-end;
`

const RemoveButton = styled(Button)`
  min-height: 2.4rem;
  padding: 0.4rem 0.9rem;
  font-size: 0.9rem;
  border-radius: 0.85rem;
  box-shadow: none;

  &:hover:not(:disabled) {
    box-shadow: none;
  }
`

const ErrorMessage = styled.p`
  color: var(--color-danger);
  font-weight: 600;
  font-size: 0.95rem;
  margin: 0;
`

const EmptyState = styled.p`
  border: 1px dashed var(--color-border-strong);
  border-radius: 1rem;
  padding: 1.25rem;
  text-align: center;
  color: var(--color-text-muted);
  font-style: italic;
  background: var(--color-surface-muted);
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
      .filter(([, percentage]) => percentage > 0)
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
    <FormCard>
      <Intro>
        <Title>Items</Title>
        <Description>Capture every line item and decide exactly how it should be shared.</Description>
      </Intro>

      {state.people.length === 0 ? (
        <EmptyState>Add people first to start adding items!</EmptyState>
      ) : (
        <Form onSubmit={handleSubmit}>
          <FormRow>
            <FormGroup>
              <Label htmlFor="itemName">Item description</Label>
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
            <SplitsHeader>
              <SplitsHeading>
                <SplitsTitle>Split between people (%)</SplitsTitle>
                <SplitsDescription>Percentages must total 100% before you can add the item.</SplitsDescription>
              </SplitsHeading>
              <SplitEvenButton type="button" $variant="secondary" onClick={handleEvenSplit}>
                Split evenly
              </SplitEvenButton>
            </SplitsHeader>

            <SplitRows>
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
                  <PercentSuffix>%</PercentSuffix>
                </SplitRow>
              ))}
            </SplitRows>

            <TotalPercentage $isValid={isPercentageValid}>
              Total: {totalPercentage.toFixed(2)}% {isPercentageValid ? '✓' : '✗'}
            </TotalPercentage>
          </SplitsSection>

          <SubmitButton type="submit" disabled={!itemName.trim() || !itemPrice || !isPercentageValid}>
            Add item
          </SubmitButton>
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
                <RemoveButton type="button" $variant="danger" onClick={() => removeItem(item.id)}>
                  Remove
                </RemoveButton>
              </ActionButtons>
            </ItemElement>
          ))}
        </ItemsList>
      )}
    </FormCard>
  )
}
