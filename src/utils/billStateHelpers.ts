import { BillState, Item, Person, StoredBillState } from '../types'

const CURRENT_STORAGE_VERSION = 1

// Generate unique ID for items
export function generateId(): string {
  return Math.random().toString(36).substring(2) + Date.now().toString(36)
}

// Default initial state
export function getInitialBillState(): BillState {
  return {
    people: [],
    items: [],
    taxRate: 0,
    tipMode: 'none',
    tipAmount: 0,
  }
}

// Person CRUD operations
export function addPerson(state: BillState, name: string): BillState {
  const newPerson: Person = {
    id: generateId(),
    name,
  }
  return {
    ...state,
    people: [...state.people, newPerson],
  }
}

export function removePerson(state: BillState, personId: string): BillState {
  const personHasItems = state.items.some((item) => item.assignedTo === personId)

  if (personHasItems) {
    console.warn(
      `Cannot delete person with ID ${personId}: they have items assigned to them`
    )
    return state
  }

  return {
    ...state,
    people: state.people.filter((person) => person.id !== personId),
  }
}

export function updatePerson(
  state: BillState,
  personId: string,
  updates: Partial<Person>
): BillState {
  return {
    ...state,
    people: state.people.map((person) =>
      person.id === personId ? { ...person, ...updates } : person
    ),
  }
}

// Item CRUD operations
export function addItem(
  state: BillState,
  name: string,
  amount: number,
  assignedTo: string,
  taxRate?: number
): BillState {
  const personExists = state.people.some((p) => p.id === assignedTo)
  if (!personExists) {
    console.warn(`Cannot add item: person with ID ${assignedTo} does not exist`)
    return state
  }

  const newItem: Item = {
    id: generateId(),
    name,
    amount,
    assignedTo,
    taxRate: taxRate ?? state.taxRate,
  }
  return {
    ...state,
    items: [...state.items, newItem],
  }
}

export function removeItem(state: BillState, itemId: string): BillState {
  return {
    ...state,
    items: state.items.filter((item) => item.id !== itemId),
  }
}

export function updateItem(
  state: BillState,
  itemId: string,
  updates: Partial<Item>
): BillState {
  return {
    ...state,
    items: state.items.map((item) =>
      item.id === itemId ? { ...item, ...updates } : item
    ),
  }
}

// Reassign item to different person
export function reassignItem(
  state: BillState,
  itemId: string,
  newPersonId: string
): BillState {
  const personExists = state.people.some((p) => p.id === newPersonId)
  if (!personExists) {
    console.warn(
      `Cannot reassign item: person with ID ${newPersonId} does not exist`
    )
    return state
  }

  return updateItem(state, itemId, { assignedTo: newPersonId })
}

// Tax and tip operations
export function setTaxRate(state: BillState, taxRate: number): BillState {
  return {
    ...state,
    taxRate: Math.max(0, taxRate),
  }
}

export function setTipMode(
  state: BillState,
  tipMode: 'none' | 'fixed' | 'percentage'
): BillState {
  return {
    ...state,
    tipMode,
  }
}

export function setTipAmount(state: BillState, tipAmount: number): BillState {
  return {
    ...state,
    tipAmount: Math.max(0, tipAmount),
  }
}

// Batch operations
export function removePersonAndReassignItems(
  state: BillState,
  personId: string,
  reassignToPersonId: string
): BillState {
  const targetPersonExists = state.people.some(
    (p) => p.id === reassignToPersonId
  )
  if (!targetPersonExists) {
    console.warn(
      `Cannot reassign items: target person with ID ${reassignToPersonId} does not exist`
    )
    return state
  }

  return {
    ...state,
    people: state.people.filter((person) => person.id !== personId),
    items: state.items.map((item) =>
      item.assignedTo === personId
        ? { ...item, assignedTo: reassignToPersonId }
        : item
    ),
  }
}

// Storage migrations
export function migrateStoredState(stored: StoredBillState): BillState {
  const { version, people, items, taxRate, tipMode, tipAmount } = stored

  if (version === CURRENT_STORAGE_VERSION) {
    return { people, items, taxRate, tipMode, tipAmount }
  }

  if (version === 0 || version === undefined) {
    // Migration from version 0 to 1: no changes needed for now
    // This is a placeholder for future migrations
    return { people, items, taxRate, tipMode, tipAmount }
  }

  console.warn(`Unknown storage version: ${version}. Using initial state.`)
  return getInitialBillState()
}

export function prepareForStorage(state: BillState): StoredBillState {
  return {
    ...state,
    version: CURRENT_STORAGE_VERSION,
  }
}
