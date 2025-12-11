import { useState } from 'react'
import styled from 'styled-components'
import { useBillStateContext } from '../hooks'
import {
  Card,
  SectionTitle,
  SectionDescription,
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
  flex-wrap: wrap;
  gap: 0.75rem;
  width: 100%;

  @media (min-width: 640px) {
    flex-wrap: nowrap;
  }
`

const TextInput = styled.input`
  ${controlStyles}
  flex: 1;
  min-width: min(16rem, 100%);
`

const SubmitButton = styled(Button)`
  width: 100%;

  @media (min-width: 640px) {
    width: auto;
  }
`

const PeopleList = styled.ul`
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  margin: 0;
  padding: 0;
`

const PersonItem = styled.li`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.75rem;
  padding: 0.85rem 1rem;
  border-radius: 0.95rem;
  border: 1px solid var(--color-border);
  background: var(--color-surface-muted);
  transition: transform 0.15s ease, border-color 0.15s ease;

  &:hover {
    transform: translateY(-2px);
    border-color: var(--color-border-strong);
  }
`

const PersonName = styled.span`
  font-weight: 600;
  color: var(--color-heading);
`

const RemoveButton = styled(Button)`
  min-height: 2.4rem;
  padding: 0.35rem 0.9rem;
  font-size: 0.9rem;
  border-radius: 0.8rem;
  box-shadow: none;

  &:hover:not(:disabled) {
    box-shadow: none;
  }
`

const ErrorMessage = styled.p`
  color: var(--color-danger);
  font-weight: 600;
  font-size: 0.95rem;
  margin: -0.5rem 0 0;
`

const EmptyState = styled.p`
  border: 1px dashed var(--color-border-strong);
  border-radius: 0.95rem;
  padding: 1rem;
  text-align: center;
  color: var(--color-text-muted);
  font-style: italic;
  background: var(--color-surface-muted);
`

export function PeopleForm() {
  const { state, addPerson, removePerson } = useBillStateContext()
  const [personName, setPersonName] = useState('')
  const [error, setError] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    const trimmedName = personName.trim()

    if (!trimmedName) {
      setError('Name is required')
      return
    }

    if (trimmedName.length < 2) {
      setError('Name must be at least 2 characters')
      return
    }

    if (state.people.some((p) => p.name.toLowerCase() === trimmedName.toLowerCase())) {
      setError('A person with this name already exists')
      return
    }

    addPerson(trimmedName)
    setPersonName('')
  }

  const handleRemove = (personId: string) => {
    const person = state.people.find((p) => p.id === personId)
    const hasItems = state.items.some((item) =>
      item.splits.some((split) => split.personId === personId)
    )

    if (hasItems) {
      setError(`Cannot remove ${person?.name || 'person'} - they have items assigned`)
      return
    }

    removePerson(personId)
    setError('')
  }

  return (
    <FormCard>
      <Intro>
        <Title>People</Title>
        <Description>Add everyone sharing the bill so you can split each item intentionally.</Description>
      </Intro>

      <Form onSubmit={handleSubmit}>
        <TextInput
          type="text"
          placeholder="Enter person's name"
          value={personName}
          onChange={(e) => setPersonName(e.target.value)}
          aria-label="Person name"
          required
        />
        <SubmitButton type="submit" disabled={!personName.trim()}>
          Add person
        </SubmitButton>
      </Form>

      {error && <ErrorMessage role="alert">{error}</ErrorMessage>}

      {state.people.length === 0 ? (
        <EmptyState>No people added yet. Add someone to start splitting bills!</EmptyState>
      ) : (
        <PeopleList>
          {state.people.map((person) => (
            <PersonItem key={person.id}>
              <PersonName>{person.name}</PersonName>
              <RemoveButton
                type="button"
                $variant="danger"
                onClick={() => handleRemove(person.id)}
                aria-label={`Remove ${person.name}`}
              >
                Remove
              </RemoveButton>
            </PersonItem>
          ))}
        </PeopleList>
      )}
    </FormCard>
  )
}
