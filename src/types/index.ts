// Person model
export interface Person {
  id: string
  name: string
}

// Item assignment model
export interface Item {
  id: string
  name: string
  amount: number
  assignedTo: string // Person ID
  taxRate: number
}

// Tax and tip settings
export interface TaxTipSettings {
  taxRate: number
  tipMode: 'none' | 'fixed' | 'percentage'
  tipAmount: number
}

// Complete bill state
export interface BillState {
  people: Person[]
  items: Item[]
  taxRate: number
  tipMode: 'none' | 'fixed' | 'percentage'
  tipAmount: number
}

// Storage version for migrations
export interface StoredBillState extends BillState {
  version: number
}
