import { BillState, Item, ItemSplit, Person, StoredBillState } from '../types'
import { DEFAULT_TAX_PRESET_ID, TAX_PRESETS } from '../constants'

const CURRENT_STORAGE_VERSION = 2

const DEFAULT_TAX_PRESET =
  TAX_PRESETS.find((preset) => preset.id === DEFAULT_TAX_PRESET_ID) || TAX_PRESETS[0]
const DEFAULT_TAX_RATE = DEFAULT_TAX_PRESET?.rate ?? 0
const DEFAULT_PROVINCE_ID = DEFAULT_TAX_PRESET?.id ?? DEFAULT_TAX_PRESET_ID

function normalizeItems(items: any[], fallbackTaxRate: number): Item[] {
  return (items || []).map((item: any) => {
    if (item?.splits?.length) {
      return {
        id: item.id,
        name: item.name,
        amount: item.amount,
        splits: item.splits,
        taxRate: item.taxRate ?? fallbackTaxRate,
      }
    }

    if (item?.assignedTo) {
      return {
        id: item.id,
        name: item.name,
        amount: item.amount,
        splits: [{ personId: item.assignedTo, percentage: 100 }],
        taxRate: item.taxRate ?? fallbackTaxRate,
      }
    }

    return {
      id: item.id,
      name: item.name,
      amount: item.amount,
      splits: [],
      taxRate: item.taxRate ?? fallbackTaxRate,
    }
  })
}

// Generate unique ID for items
export function generateId(): string {
  return Math.random().toString(36).substring(2) + Date.now().toString(36)
}

// Default initial state
export function getInitialBillState(): BillState {
  return {
    people: [],
    items: [],
    taxRate: DEFAULT_TAX_RATE,
    selectedProvinceId: DEFAULT_PROVINCE_ID,
    tipMode: 'proportional',
    tipPercentage: 0.18,
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
  const personHasItems = state.items.some((item) =>
    item.splits.some((split) => split.personId === personId)
  )

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
  splits: ItemSplit[],
  taxRate?: number
): BillState {
  // Validate all person IDs exist
  const allPersonsExist = splits.every((split) =>
    state.people.some((p) => p.id === split.personId)
  )
  if (!allPersonsExist) {
    console.warn('Cannot add item: one or more assigned persons do not exist')
    return state
  }

  // Validate percentages sum to 100
  const totalPercentage = splits.reduce((sum, split) => sum + split.percentage, 0)
  if (Math.abs(totalPercentage - 100) > 0.01) {
    console.warn(`Cannot add item: splits must sum to 100%, got ${totalPercentage}%`)
    return state
  }

  const newItem: Item = {
    id: generateId(),
    name,
    amount,
    splits,
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
    items: state.items.map((item) => (item.id === itemId ? { ...item, ...updates } : item)),
  }
}

// Reassign item to different splits
export function reassignItem(
  state: BillState,
  itemId: string,
  newSplits: ItemSplit[]
): BillState {
  const allPersonsExist = newSplits.every((split) =>
    state.people.some((p) => p.id === split.personId)
  )
  if (!allPersonsExist) {
    console.warn('Cannot reassign item: one or more assigned persons do not exist')
    return state
  }

  const totalPercentage = newSplits.reduce((sum, split) => sum + split.percentage, 0)
  if (Math.abs(totalPercentage - 100) > 0.01) {
    console.warn(`Cannot reassign item: splits must sum to 100%, got ${totalPercentage}%`)
    return state
  }

  return updateItem(state, itemId, { splits: newSplits })
}

// Tax and tip operations
export function setTaxRate(state: BillState, taxRate: number): BillState {
  return {
    ...state,
    taxRate: Math.max(0, taxRate),
  }
}

export function setSelectedProvinceId(
  state: BillState,
  provinceId: string
): BillState {
  return {
    ...state,
    selectedProvinceId: provinceId,
  }
}

export function setTipMode(
  state: BillState,
  tipMode: 'equal' | 'proportional'
): BillState {
  return {
    ...state,
    tipMode,
  }
}

export function setTipPercentage(state: BillState, tipPercentage: number): BillState {
  return {
    ...state,
    tipPercentage: Math.max(0, tipPercentage),
  }
}

// Batch operations
export function removePersonAndReassignItems(
  state: BillState,
  personId: string,
  reassignToPersonId: string
): BillState {
  const targetPersonExists = state.people.some((p) => p.id === reassignToPersonId)
  if (!targetPersonExists) {
    console.warn(
      `Cannot reassign items: target person with ID ${reassignToPersonId} does not exist`
    )
    return state
  }

  return {
    ...state,
    people: state.people.filter((person) => person.id !== personId),
    items: state.items.map((item) => {
      const hasSplitForPerson = item.splits.some((split) => split.personId === personId)
      if (!hasSplitForPerson) return item

      const oldSplit = item.splits.find((split) => split.personId === personId)
      const targetSplit = item.splits.find((split) => split.personId === reassignToPersonId)

      const newSplits = item.splits
        .filter((split) => split.personId !== personId)
        .map((split) =>
          split.personId === reassignToPersonId
            ? { ...split, percentage: split.percentage + (oldSplit?.percentage || 0) }
            : split
        )

      if (!targetSplit && oldSplit) {
        newSplits.push({ personId: reassignToPersonId, percentage: oldSplit.percentage })
      }

      return { ...item, splits: newSplits }
    }),
  }
}

// Storage migrations
export function migrateStoredState(stored: any): BillState {
  if (!stored || typeof stored !== 'object') {
    return getInitialBillState()
  }

  const { version } = stored

  if (version === CURRENT_STORAGE_VERSION) {
    return stored as BillState
  }

  if (version === 1) {
    const migratedItems = normalizeItems(stored.items || [], stored.taxRate ?? DEFAULT_TAX_RATE)
    const tipPercentage =
      stored.tipMode === 'percentage' ? Math.max(0, (stored.tipAmount || 0) / 100) : 0

    return {
      people: stored.people || [],
      items: migratedItems,
      taxRate: stored.taxRate ?? DEFAULT_TAX_RATE,
      selectedProvinceId: stored.selectedProvinceId || DEFAULT_PROVINCE_ID,
      tipMode: 'proportional',
      tipPercentage,
    }
  }

  if (version === 0 || version === undefined) {
    const migratedItems = normalizeItems(stored.items || [], stored.taxRate ?? DEFAULT_TAX_RATE)

    return {
      people: stored.people || [],
      items: migratedItems,
      taxRate: stored.taxRate ?? DEFAULT_TAX_RATE,
      selectedProvinceId: DEFAULT_PROVINCE_ID,
      tipMode: 'proportional',
      tipPercentage: 0,
    }
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
