import { ReactNode } from 'react'
import useBillState from '../hooks/useBillState'
import { BillStateContext } from './BillStateContext'

interface BillStateProviderProps {
  children: ReactNode
}

export function BillStateProvider({ children }: BillStateProviderProps) {
  const billState = useBillState()

  return (
    <BillStateContext.Provider value={billState}>
      {children}
    </BillStateContext.Provider>
  )
}
