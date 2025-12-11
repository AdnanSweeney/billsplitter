import { useCallback } from 'react'
import { BillState, Item, ItemSplit, Person, StoredBillState } from '../types'
import useLocalStorageWithDebounce from './useLocalStorageWithDebounce'
import {
  getInitialBillState,
  migrateStoredState,
  prepareForStorage,
  addPerson,
  removePerson,
  updatePerson,
  addItem,
  removeItem,
  updateItem,
  reassignItem,
  setTaxRate,
  setSelectedProvinceId,
  setTipMode,
  setTipPercentage,
  removePersonAndReassignItems,
} from '../utils/billStateHelpers'

const STORAGE_KEY = 'billsplitter_state'

function useBillState() {
  const [state, setState] = useLocalStorageWithDebounce<StoredBillState>(
    STORAGE_KEY,
    prepareForStorage(getInitialBillState()),
    { debounceMs: 500 }
  )

  // Migrate state if needed
  const billState: BillState = migrateStoredState(state)

  // Update state and persist
  const updateState = useCallback(
    (newState: BillState) => {
      setState(prepareForStorage(newState))
    },
    [setState]
  )

  // Person operations
  const handleAddPerson = useCallback(
    (name: string) => {
      updateState(addPerson(billState, name))
    },
    [billState, updateState]
  )

  const handleRemovePerson = useCallback(
    (personId: string) => {
      updateState(removePerson(billState, personId))
    },
    [billState, updateState]
  )

  const handleUpdatePerson = useCallback(
    (personId: string, updates: Partial<Person>) => {
      updateState(updatePerson(billState, personId, updates))
    },
    [billState, updateState]
  )

  // Item operations
  const handleAddItem = useCallback(
    (name: string, amount: number, splits: ItemSplit[], taxRate?: number) => {
      updateState(addItem(billState, name, amount, splits, taxRate))
    },
    [billState, updateState]
  )

  const handleRemoveItem = useCallback(
    (itemId: string) => {
      updateState(removeItem(billState, itemId))
    },
    [billState, updateState]
  )

  const handleUpdateItem = useCallback(
    (itemId: string, updates: Partial<Item>) => {
      updateState(updateItem(billState, itemId, updates))
    },
    [billState, updateState]
  )

  const handleReassignItem = useCallback(
    (itemId: string, newSplits: ItemSplit[]) => {
      updateState(reassignItem(billState, itemId, newSplits))
    },
    [billState, updateState]
  )

  // Tax and tip operations
  const handleSetTaxRate = useCallback(
    (taxRate: number) => {
      updateState(setTaxRate(billState, taxRate))
    },
    [billState, updateState]
  )

  const handleSetSelectedProvince = useCallback(
    (provinceId: string) => {
      updateState(setSelectedProvinceId(billState, provinceId))
    },
    [billState, updateState]
  )

  const handleSetTipMode = useCallback(
    (tipMode: 'equal' | 'proportional') => {
      updateState(setTipMode(billState, tipMode))
    },
    [billState, updateState]
  )

  const handleSetTipPercentage = useCallback(
    (tipPercentage: number) => {
      updateState(setTipPercentage(billState, tipPercentage))
    },
    [billState, updateState]
  )

  // Batch operations
  const handleRemovePersonAndReassignItems = useCallback(
    (personId: string, reassignToPersonId: string) => {
      updateState(
        removePersonAndReassignItems(billState, personId, reassignToPersonId)
      )
    },
    [billState, updateState]
  )

  return {
    // State
    state: billState,

    // Person operations
    addPerson: handleAddPerson,
    removePerson: handleRemovePerson,
    updatePerson: handleUpdatePerson,

    // Item operations
    addItem: handleAddItem,
    removeItem: handleRemoveItem,
    updateItem: handleUpdateItem,
    reassignItem: handleReassignItem,

    // Tax and tip operations
    setTaxRate: handleSetTaxRate,
    setSelectedProvinceId: handleSetSelectedProvince,
    setTipMode: handleSetTipMode,
    setTipPercentage: handleSetTipPercentage,

    // Batch operations
    removePersonAndReassignItems: handleRemovePersonAndReassignItems,
  }
}

export default useBillState
