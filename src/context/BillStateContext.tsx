import { createContext } from 'react'
import { BillStateContextType } from './billStateContextTypes'

export const BillStateContext = createContext<BillStateContextType | undefined>(
  undefined
)
