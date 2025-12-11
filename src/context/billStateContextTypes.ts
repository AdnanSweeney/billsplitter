import { BillState, Item, ItemSplit, Person } from '../types'

export interface BillStateContextType {
  state: BillState
  addPerson: (name: string) => void
  removePerson: (personId: string) => void
  updatePerson: (personId: string, updates: Partial<Person>) => void
  addItem: (name: string, amount: number, splits: ItemSplit[], taxRate?: number) => void
  removeItem: (itemId: string) => void
  updateItem: (itemId: string, updates: Partial<Item>) => void
  reassignItem: (itemId: string, newSplits: ItemSplit[]) => void
  setTaxRate: (taxRate: number) => void
  setTipMode: (tipMode: 'none' | 'fixed' | 'percentage') => void
  setTipAmount: (tipAmount: number) => void
  removePersonAndReassignItems: (personId: string, reassignToPersonId: string) => void
}
