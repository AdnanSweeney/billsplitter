export interface Person {
  id: string
  name: string
}

export interface ItemSplit {
  personId: string
  percentage: number
}

export interface Item {
  id: string
  name: string
  amount: number
  splits: ItemSplit[]
  taxRate: number
}

export interface TaxTipSettings {
  taxRate: number
  selectedProvinceId: string
  tipPercentage: number
  tipMode: 'equal' | 'proportional'
}

export interface BillState extends TaxTipSettings {
  people: Person[]
  items: Item[]
}

export interface StoredBillState extends BillState {
  version: number
}

export interface PersonBillShare {
  personId: string
  name: string
  subtotal: number
  tax: number
  tip: number
  total: number
}

export interface BillTotals {
  subtotal: number
  tax: number
  tip: number
  grandTotal: number
}

export interface BillSummary {
  perPerson: PersonBillShare[]
  totals: BillTotals
}
