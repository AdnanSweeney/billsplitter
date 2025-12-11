# BillSplitter State Management

This document describes the state management and persistence layer for the BillSplitter application.

## Architecture Overview

The state management system is built on several core layers:

1. **TypeScript Models** (`src/types/index.ts`) - Define the data structures
2. **State Helpers** (`src/utils/billStateHelpers.ts`) - Pure functions for state mutations
3. **Custom Hooks** - React hooks for state management and persistence
4. **React Context** (`src/context/`) - Provide state across the application

## Data Models

### Person
```typescript
interface Person {
  id: string
  name: string
}
```

### Item
```typescript
interface Item {
  id: string
  name: string
  amount: number
  assignedTo: string // Person ID
  taxRate: number
}
```

### BillState
```typescript
interface BillState {
  people: Person[]
  items: Item[]
  taxRate: number
  tipMode: 'none' | 'fixed' | 'percentage'
  tipAmount: number
}
```

## Hooks

### useBillState
Main hook for managing bill state with localStorage persistence.

**Usage:**
```typescript
const {
  state,
  addPerson,
  removePerson,
  addItem,
  removeItem,
  setTaxRate,
  setTipMode,
  setTipAmount,
  // ... other methods
} = useBillState()
```

### useBillStateContext
Hook to access the bill state from any component within the BillStateProvider.

**Usage:**
```typescript
const billState = useBillStateContext()
billState.addPerson('John')
```

### useLocalStorageWithDebounce
Enhanced localStorage hook with debounce support (500ms default).

**Features:**
- Hydrates initial state from localStorage
- Debounces writes to reduce performance impact
- Error handling for storage quota exceeded
- Automatic cleanup on unmount

## State Helper Functions

### Person Operations

#### addPerson
```typescript
addPerson(state, 'John Doe')
```
Creates a new person with auto-generated ID.

#### removePerson
```typescript
removePerson(state, personId)
```
Removes a person. **Fails if person has items assigned** to prevent data loss.

#### updatePerson
```typescript
updatePerson(state, personId, { name: 'Jane' })
```
Updates person properties.

### Item Operations

#### addItem
```typescript
addItem(state, 'Appetizers', 25.00, personId, 0.08)
```
Adds a new item. **Fails if assigned person doesn't exist**.

#### removeItem
```typescript
removeItem(state, itemId)
```
Removes an item.

#### updateItem
```typescript
updateItem(state, itemId, { amount: 30.00 })
```
Updates item properties.

#### reassignItem
```typescript
reassignItem(state, itemId, newPersonId)
```
Assigns item to a different person.

### Tax and Tip Operations

#### setTaxRate
```typescript
setTaxRate(state, 0.08) // 8% tax
```

#### setTipMode
```typescript
setTipMode(state, 'percentage') // 'none', 'fixed', or 'percentage'
```

#### setTipAmount
```typescript
setTipAmount(state, 20) // $20 or 20% depending on tipMode
```

### Batch Operations

#### removePersonAndReassignItems
```typescript
removePersonAndReassignItems(state, personId, reassignToPersonId)
```
Removes a person and reassigns all their items to another person.

## LocalStorage Persistence

### Automatic Hydration
State is automatically loaded from localStorage on app initialization:
```typescript
const key = 'billsplitter_state'
// Initial state is loaded from storage if available
```

### Debounced Writes
State changes are debounced (500ms) to reduce localStorage write frequency:
- Improves performance
- Reduces wear on storage
- Still captures all changes

### Storage Format
State is stored with versioning for future migrations:
```typescript
interface StoredBillState extends BillState {
  version: number // Current: 1
}
```

## Data Migrations

### Migration System
The `migrateStoredState()` function handles version-based migrations:

```typescript
export function migrateStoredState(stored: StoredBillState): BillState {
  if (stored.version === CURRENT_STORAGE_VERSION) {
    // No migration needed
    return state
  }
  
  if (stored.version === 0) {
    // Apply migration logic here
    return migratedState
  }
  
  // Unknown version, use initial state
  return getInitialBillState()
}
```

**Future migrations:**
- Add new fields with defaults
- Transform existing data structures
- Remove deprecated fields

## Edge Cases

### Deleting People with Items
The system prevents deletion of people who have items assigned to avoid orphaned items:

```typescript
// This fails silently and logs a warning
removePerson(state, personId) // If person has items

// Solution: Use batch operation
removePersonAndReassignItems(state, personId, newPersonId)
```

### Invalid Person References
Adding items to non-existent people fails safely:

```typescript
// This fails if person doesn't exist
addItem(state, name, amount, invalidPersonId)
```

### Tax Rate Validation
Negative tax rates are prevented:

```typescript
setTaxRate(state, -5) // Converted to 0
```

## Usage in Components

### Wrapping App with Provider
```typescript
// src/main.tsx
import { BillStateProvider } from './context/BillStateProvider'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <BillStateProvider>
    <App />
  </BillStateProvider>
)
```

### Using in Components
```typescript
import { useBillStateContext } from '../hooks'

function MyComponent() {
  const { state, addPerson, addItem } = useBillStateContext()
  
  return (
    <div>
      <button onClick={() => addPerson('New Person')}>Add Person</button>
      {state.people.map(person => (
        <div key={person.id}>{person.name}</div>
      ))}
    </div>
  )
}
```

## Performance Considerations

1. **Debounced Storage Writes** - 500ms default debounce prevents excessive writes
2. **Context Consumer Optimization** - Only components using `useBillStateContext()` re-render on state changes
3. **Immutable Updates** - All state updates create new objects, enabling React's diffing
4. **Lazy State Initialization** - localStorage is read lazily, not blocking initial render

## Error Handling

All operations include error handling:
- localStorage failures logged to console
- Invalid operations fail silently with warnings
- Always returns current state on failure
- Never throws exceptions

## Future Enhancements

- [ ] Undo/redo functionality using state history
- [ ] Export/import bill data as JSON
- [ ] Multi-device sync via server
- [ ] Offline-first approach with Service Workers
- [ ] Advanced migration system for complex schema changes
