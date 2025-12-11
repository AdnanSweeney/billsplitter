import { useState } from 'react'
import styled from 'styled-components'
import { useBillStateContext } from '../hooks'

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
  gap: 12px;
  margin-bottom: 24px;
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
  min-width: 200px;

  &:focus {
    outline: none;
    border-color: #667eea;
  }

  &:invalid {
    border-color: #e74c3c;
  }
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

const PeopleList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
`

const PersonItem = styled.li`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px;
  border-bottom: 1px solid #e0e0e0;
  transition: background-color 0.2s;

  &:hover {
    background-color: #f5f5f5;
  }

  &:last-child {
    border-bottom: none;
  }
`

const PersonName = styled.span`
  font-size: 1rem;
  color: #333;
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
    <FormContainer>
      <FormTitle>People</FormTitle>

      <Form onSubmit={handleSubmit}>
        <Input
          type="text"
          placeholder="Enter person's name"
          value={personName}
          onChange={(e) => setPersonName(e.target.value)}
          aria-label="Person name"
          required
        />
        <Button type="submit" disabled={!personName.trim()}>
          Add Person
        </Button>
      </Form>

      {error && <ErrorMessage role="alert">{error}</ErrorMessage>}

      {state.people.length === 0 ? (
        <EmptyState>No people added yet. Add someone to start splitting bills!</EmptyState>
      ) : (
        <PeopleList>
          {state.people.map((person) => (
            <PersonItem key={person.id}>
              <PersonName>{person.name}</PersonName>
              <Button
                variant="danger"
                onClick={() => handleRemove(person.id)}
                aria-label={`Remove ${person.name}`}
              >
                Remove
              </Button>
            </PersonItem>
          ))}
        </PeopleList>
      )}
    </FormContainer>
  )
}
