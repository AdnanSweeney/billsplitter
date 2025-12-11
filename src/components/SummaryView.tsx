import { useMemo } from 'react'
import styled from 'styled-components'
import { useBillStateContext } from '../hooks'
import { calculateBillSummary } from '../utils'

const Panel = styled.div`
  background: white;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 600px;
`

const Title = styled.h2`
  font-size: 1.5rem;
  margin-bottom: 20px;
  color: #333;
`

const SummaryList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-bottom: 24px;
`

const PersonCard = styled.div`
  border: 1px solid #ececf5;
  border-radius: 10px;
  padding: 16px;
  background: #f9f9ff;
`

const PersonName = styled.h3`
  margin: 0 0 12px 0;
  font-size: 1.1rem;
  color: #444;
`

const StatRow = styled.div`
  display: flex;
  justify-content: space-between;
  font-size: 0.95rem;
  padding: 4px 0;
  color: #555;
`

const TotalValue = styled.span`
  font-weight: 600;
  color: #333;
`

const OverallTotals = styled.div`
  border-top: 1px solid #ececf5;
  padding-top: 16px;
  display: flex;
  flex-direction: column;
  gap: 8px;
`

const GrandTotal = styled.div`
  display: flex;
  justify-content: space-between;
  font-size: 1.1rem;
  font-weight: 700;
  color: #222;
`

const EmptyState = styled.p`
  color: #777;
  text-align: center;
  margin: 0;
`

const Meta = styled.p`
  font-size: 0.85rem;
  color: #777;
  margin: 0 0 16px;
`

const formatCurrency = (value: number) => `$${value.toFixed(2)}`

export function SummaryView() {
  const { state } = useBillStateContext()

  const summary = useMemo(() => calculateBillSummary(state), [state])
  const tipPercentDisplay = (state.tipPercentage * 100).toFixed(1)
  const taxPercentDisplay = (state.taxRate * 100).toFixed(1)

  return (
    <Panel>
      <Title>Summary</Title>
      <Meta>
        Tax {taxPercentDisplay}% · Tip {tipPercentDisplay}% · {state.tipMode === 'equal' ? 'Equal tip split' : 'Proportional tip split'}
      </Meta>

      {summary.perPerson.length === 0 ? (
        <EmptyState>Add people (and items) to see how the bill is split.</EmptyState>
      ) : (
        <SummaryList>
          {summary.perPerson.map((person) => (
            <PersonCard key={person.personId}>
              <PersonName>{person.name}</PersonName>
              <StatRow>
                <span>Subtotal</span>
                <TotalValue>{formatCurrency(person.subtotal)}</TotalValue>
              </StatRow>
              <StatRow>
                <span>Tax</span>
                <TotalValue>{formatCurrency(person.tax)}</TotalValue>
              </StatRow>
              <StatRow>
                <span>Tip</span>
                <TotalValue>{formatCurrency(person.tip)}</TotalValue>
              </StatRow>
              <StatRow>
                <span>Total owed</span>
                <TotalValue>{formatCurrency(person.total)}</TotalValue>
              </StatRow>
            </PersonCard>
          ))}
        </SummaryList>
      )}

      <OverallTotals>
        <StatRow>
          <span>Group subtotal</span>
          <TotalValue>{formatCurrency(summary.totals.subtotal)}</TotalValue>
        </StatRow>
        <StatRow>
          <span>Total tax</span>
          <TotalValue>{formatCurrency(summary.totals.tax)}</TotalValue>
        </StatRow>
        <StatRow>
          <span>Total tip</span>
          <TotalValue>{formatCurrency(summary.totals.tip)}</TotalValue>
        </StatRow>
        <GrandTotal>
          <span>Grand total</span>
          <span>{formatCurrency(summary.totals.grandTotal)}</span>
        </GrandTotal>
      </OverallTotals>
    </Panel>
  )
}
