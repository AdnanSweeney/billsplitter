import { useMemo } from 'react'
import styled from 'styled-components'
import { useBillStateContext } from '../hooks'
import { calculateBillSummary } from '../utils'
import { Card, SectionTitle, SectionDescription, HelperText } from '../styles/primitives'

const Panel = styled(Card)`
  gap: 1.5rem;
`

const Intro = styled.header`
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
`

const Title = styled(SectionTitle)``

const Description = styled(SectionDescription)`
  color: var(--color-text-muted);
`

const SummaryList = styled.div`
  display: grid;
  gap: 1rem;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
`

const PersonCard = styled.div`
  border: 1px solid var(--color-border);
  border-radius: 1rem;
  padding: 1rem;
  background: var(--color-surface-muted);
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
`

const PersonName = styled.h3`
  margin: 0 0 0.35rem;
  font-size: 1.05rem;
  color: var(--color-heading);
`

const StatRow = styled.div`
  display: flex;
  justify-content: space-between;
  font-size: 0.95rem;
  color: var(--color-text-muted);
`

const TotalValue = styled.span`
  font-weight: 600;
  color: var(--color-heading);
`

const OverallTotals = styled.div`
  border-top: 1px solid var(--color-border);
  padding-top: 1rem;
  display: flex;
  flex-direction: column;
  gap: 0.65rem;
`

const GrandTotal = styled.div`
  display: flex;
  justify-content: space-between;
  font-size: 1.1rem;
  font-weight: 700;
  color: var(--color-heading);
`

const EmptyState = styled.p`
  border: 1px dashed var(--color-border-strong);
  border-radius: 1rem;
  padding: 1.25rem;
  text-align: center;
  color: var(--color-text-muted);
  font-style: italic;
  background: var(--color-surface-muted);
`

const Meta = styled(HelperText)`
  font-size: 0.9rem;
`

const formatCurrency = (value: number) => `$${value.toFixed(2)}`

export function SummaryView() {
  const { state } = useBillStateContext()

  const summary = useMemo(() => calculateBillSummary(state), [state])
  const tipPercentDisplay = (state.tipPercentage * 100).toFixed(1)
  const taxPercentDisplay = (state.taxRate * 100).toFixed(1)

  return (
    <Panel>
      <Intro>
        <Title>Summary</Title>
        <Description>See the full breakdown per person with tax and tip applied.</Description>
        <Meta>
          Tax {taxPercentDisplay}% · Tip {tipPercentDisplay}% ·{' '}
          {state.tipMode === 'equal' ? 'Equal tip split' : 'Proportional tip split'}
        </Meta>
      </Intro>

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
