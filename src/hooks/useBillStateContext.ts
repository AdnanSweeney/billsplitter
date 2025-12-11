import { useContext } from 'react'
import { BillStateContext } from '../context/BillStateContext'
import { BillStateContextType } from '../context/billStateContextTypes'

export function useBillStateContext(): BillStateContextType {
  const context = useContext(BillStateContext)
  if (!context) {
    throw new Error('useBillStateContext must be used within BillStateProvider')
  }
  return context
}
