import styled from 'styled-components'
import { PeopleForm, ItemForm, TaxTipControls, SummaryView } from './components'

const Page = styled.main`
  min-height: 100vh;
  padding: clamp(1.25rem, 4vw, 3.5rem) clamp(1rem, 4vw, 3rem);
`

const PageInner = styled.div`
  width: min(1200px, 100%);
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: clamp(1.5rem, 4vw, 3rem);
`

const Header = styled.header`
  text-align: center;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
`

const Eyebrow = styled.span`
  align-self: center;
  padding: 0.35rem 0.85rem;
  border-radius: 999px;
  background: var(--color-primary-soft);
  color: var(--color-primary-strong);
  font-weight: 600;
  font-size: 0.9rem;
  letter-spacing: 0.04em;
  text-transform: uppercase;
`

const Title = styled.h1`
  margin: 0;
  font-size: clamp(2.3rem, 6vw, 3.5rem);
  letter-spacing: -0.02em;
`

const Subtitle = styled.p`
  margin: 0 auto;
  max-width: 60ch;
  font-size: clamp(1rem, 2vw, 1.2rem);
  color: var(--color-text-muted);
`

const LayoutGrid = styled.section`
  display: grid;
  gap: clamp(1rem, 3vw, 2rem);
  grid-template-columns: minmax(0, 1fr);
  align-items: start;

  @media (min-width: 900px) {
    grid-template-columns: minmax(0, 1.2fr) minmax(0, 0.8fr);
  }
`

const ColumnStack = styled.div`
  display: flex;
  flex-direction: column;
  gap: clamp(1rem, 2vw, 1.5rem);
`

function App() {
  return (
    <Page>
      <PageInner>
        <Header>
          <Eyebrow>Smart bill splitting</Eyebrow>
          <Title>BillSplitter</Title>
          <Subtitle>
            Split every item between friends, apply the right provincial tax rate, and see exactly what
            everyone owes including tax and tip.
          </Subtitle>
        </Header>

        <LayoutGrid>
          <ColumnStack>
            <PeopleForm />
            <ItemForm />
          </ColumnStack>

          <ColumnStack as="aside">
            <TaxTipControls />
            <SummaryView />
          </ColumnStack>
        </LayoutGrid>
      </PageInner>
    </Page>
  )
}

export default App
