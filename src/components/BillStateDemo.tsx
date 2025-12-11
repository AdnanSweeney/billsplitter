import styled from 'styled-components'
import { useBillStateContext } from '../hooks'

const DemoContainer = styled.div`
  padding: 20px;
  background: white;
  border-radius: 8px;
  max-width: 600px;
`

const Section = styled.div`
  margin-bottom: 20px;
`

const Title = styled.h3`
  margin-top: 0;
  color: #333;
`

const PersonList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 10px 0;
`

const PersonItem = styled.li`
  padding: 8px;
  margin: 4px 0;
  background: #f5f5f5;
  border-radius: 4px;
`

const ItemList = styled(PersonList)``

const ItemEntry = styled.li`
  padding: 8px;
  margin: 4px 0;
  background: #fffbf0;
  border-radius: 4px;
  font-size: 0.9rem;
`

const Button = styled.button`
  padding: 8px 16px;
  margin: 4px;
  background: #667eea;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;

  &:hover {
    background: #764ba2;
  }
`

/**
 * BillStateDemo - Demonstrates the bill state management system
 * This component shows all CRUD operations and state management features
 */
export function BillStateDemo() {
  const {
    state,
    addPerson,
    removePerson,
    addItem,
    removeItem,
    setTaxRate,
    setTipMode,
    setTipAmount,
  } = useBillStateContext()

  const handleAddDemoPerson = () => {
    addPerson(`Person ${state.people.length + 1}`)
  }

  const handleAddDemoItem = () => {
    if (state.people.length > 0) {
      const randomPerson = state.people[0]
      addItem(
        `Item ${state.items.length + 1}`,
        Math.random() * 50,
        randomPerson.id,
        state.taxRate
      )
    }
  }

  return (
    <DemoContainer>
      <Section>
        <Title>People ({state.people.length})</Title>
        {state.people.length === 0 ? (
          <p>No people added yet</p>
        ) : (
          <PersonList>
            {state.people.map((person) => (
              <PersonItem key={person.id}>
                {person.name}
                <Button onClick={() => removePerson(person.id)}>Remove</Button>
              </PersonItem>
            ))}
          </PersonList>
        )}
        <Button onClick={handleAddDemoPerson}>Add Person</Button>
      </Section>

      <Section>
        <Title>Items ({state.items.length})</Title>
        {state.items.length === 0 ? (
          <p>No items added yet</p>
        ) : (
          <ItemList>
            {state.items.map((item) => {
              const person = state.people.find((p) => p.id === item.assignedTo)
              return (
                <ItemEntry key={item.id}>
                  {item.name} - ${item.amount.toFixed(2)} (Assigned to:{' '}
                  {person?.name || 'Unknown'})
                  <Button onClick={() => removeItem(item.id)}>Remove</Button>
                </ItemEntry>
              )
            })}
          </ItemList>
        )}
        {state.people.length > 0 && (
          <Button onClick={handleAddDemoItem}>Add Item to First Person</Button>
        )}
      </Section>

      <Section>
        <Title>Settings</Title>
        <div>
          <label>
            Tax Rate ({(state.taxRate * 100).toFixed(1)}%):
            <input
              type="number"
              step="0.01"
              value={state.taxRate}
              onChange={(e) => setTaxRate(parseFloat(e.target.value))}
            />
          </label>
        </div>
        <div>
          <label>
            Tip Mode:
            <select
              value={state.tipMode}
              onChange={(e) =>
                setTipMode(
                  e.target.value as 'none' | 'fixed' | 'percentage'
                )
              }
            >
              <option value="none">None</option>
              <option value="fixed">Fixed</option>
              <option value="percentage">Percentage</option>
            </select>
          </label>
        </div>
        <div>
          <label>
            Tip Amount: ${state.tipAmount.toFixed(2)}
            <input
              type="number"
              step="0.01"
              value={state.tipAmount}
              onChange={(e) => setTipAmount(parseFloat(e.target.value))}
            />
          </label>
        </div>
      </Section>

      <Section>
        <Title>State Preview</Title>
        <pre
          style={{
            background: '#f5f5f5',
            padding: '10px',
            borderRadius: '4px',
            fontSize: '0.8rem',
            maxHeight: '200px',
            overflow: 'auto',
          }}
        >
          {JSON.stringify(state, null, 2)}
        </pre>
      </Section>
    </DemoContainer>
  )
}
