import { BillState, BillSummary, PersonBillShare } from '../types'

const roundCurrency = (value: number) => Math.round(value * 100) / 100

export function calculateBillSummary(state: BillState): BillSummary {
  const personMap = new Map<string, PersonBillShare>()

  state.people.forEach((person) => {
    personMap.set(person.id, {
      personId: person.id,
      name: person.name,
      subtotal: 0,
      tax: 0,
      tip: 0,
      total: 0,
    })
  })

  state.items.forEach((item) => {
    const itemTaxRate = item.taxRate ?? state.taxRate
    item.splits.forEach((split) => {
      const personEntry = personMap.get(split.personId)
      if (!personEntry) return
      const shareAmount = (item.amount * split.percentage) / 100
      personEntry.subtotal += shareAmount
      personEntry.tax += shareAmount * itemTaxRate
    })
  })

  const perPersonValues = Array.from(personMap.values())
  const totalSubtotal = perPersonValues.reduce((sum, person) => sum + person.subtotal, 0)
  const totalTip = totalSubtotal * state.tipPercentage

  if (totalTip > 0 && perPersonValues.length > 0) {
    if (state.tipMode === 'equal') {
      const contributors = perPersonValues.filter((person) => person.subtotal > 0)
      const recipients = contributors.length > 0 ? contributors : perPersonValues
      const divisor = recipients.length || 1

      perPersonValues.forEach((person) => {
        person.tip = recipients.includes(person) ? totalTip / divisor : 0
      })
    } else {
      perPersonValues.forEach((person) => {
        person.tip = totalSubtotal === 0 ? 0 : (person.subtotal / totalSubtotal) * totalTip
      })
    }
  }

  const perPerson = perPersonValues.map((person) => {
    const subtotal = roundCurrency(person.subtotal)
    const tax = roundCurrency(person.tax)
    const tip = roundCurrency(person.tip)
    const total = roundCurrency(subtotal + tax + tip)

    return {
      ...person,
      subtotal,
      tax,
      tip,
      total,
    }
  })

  const totals = perPerson.reduce(
    (acc, person) => ({
      subtotal: roundCurrency(acc.subtotal + person.subtotal),
      tax: roundCurrency(acc.tax + person.tax),
      tip: roundCurrency(acc.tip + person.tip),
      grandTotal: 0,
    }),
    { subtotal: 0, tax: 0, tip: 0, grandTotal: 0 }
  )
  totals.grandTotal = roundCurrency(totals.subtotal + totals.tax + totals.tip)

  return {
    perPerson,
    totals,
  }
}
