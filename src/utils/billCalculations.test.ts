import { describe, expect, it } from 'vitest'
import { calculateBillSummary } from './billCalculations'
import { BillState } from '../types'

describe('calculateBillSummary', () => {
  const baseState: Omit<BillState, 'people' | 'items'> = {
    taxRate: 0.13,
    selectedProvinceId: 'ON',
    tipMode: 'proportional',
    tipPercentage: 0,
  }

  it('distributes subtotals, tax, and proportional tips per person', () => {
    const state: BillState = {
      ...baseState,
      tipPercentage: 0.2,
      people: [
        { id: 'alice', name: 'Alice' },
        { id: 'bob', name: 'Bob' },
      ],
      items: [
        {
          id: 'pasta',
          name: 'Pasta',
          amount: 40,
          taxRate: 0.13,
          splits: [
            { personId: 'alice', percentage: 50 },
            { personId: 'bob', percentage: 50 },
          ],
        },
        {
          id: 'wine',
          name: 'Wine',
          amount: 30,
          taxRate: 0.13,
          splits: [{ personId: 'alice', percentage: 100 }],
        },
      ],
    }

    const summary = calculateBillSummary(state)

    expect(summary.perPerson).toEqual([
      {
        personId: 'alice',
        name: 'Alice',
        subtotal: 50,
        tax: 6.5,
        tip: 10,
        total: 66.5,
      },
      {
        personId: 'bob',
        name: 'Bob',
        subtotal: 20,
        tax: 2.6,
        tip: 4,
        total: 26.6,
      },
    ])

    expect(summary.totals).toEqual({
      subtotal: 70,
      tax: 9.1,
      tip: 14,
      grandTotal: 93.1,
    })
  })

  it('splits tips equally only across contributing diners in equal mode', () => {
    const state: BillState = {
      ...baseState,
      tipMode: 'equal',
      tipPercentage: 0.15,
      people: [
        { id: 'alice', name: 'Alice' },
        { id: 'bob', name: 'Bob' },
        { id: 'carol', name: 'Carol' },
      ],
      items: [
        {
          id: 'shared',
          name: 'Shared Dish',
          amount: 60,
          taxRate: 0.05,
          splits: [
            { personId: 'alice', percentage: 50 },
            { personId: 'bob', percentage: 50 },
          ],
        },
      ],
    }

    const summary = calculateBillSummary(state)

    expect(summary.perPerson).toEqual([
      {
        personId: 'alice',
        name: 'Alice',
        subtotal: 30,
        tax: 1.5,
        tip: 4.5,
        total: 36,
      },
      {
        personId: 'bob',
        name: 'Bob',
        subtotal: 30,
        tax: 1.5,
        tip: 4.5,
        total: 36,
      },
      {
        personId: 'carol',
        name: 'Carol',
        subtotal: 0,
        tax: 0,
        tip: 0,
        total: 0,
      },
    ])

    expect(summary.totals).toEqual({
      subtotal: 60,
      tax: 3,
      tip: 9,
      grandTotal: 72,
    })
  })

  it('respects per-item tax overrides and handles no people gracefully', () => {
    const state: BillState = {
      ...baseState,
      people: [],
      items: [
        {
          id: 'solo',
          name: 'Solo',
          amount: 10,
          taxRate: 0.07,
          splits: [],
        },
      ],
    }

    const summary = calculateBillSummary(state)

    expect(summary.perPerson).toEqual([])
    expect(summary.totals).toEqual({ subtotal: 0, tax: 0, tip: 0, grandTotal: 0 })
  })
})
