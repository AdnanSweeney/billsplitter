import styled from 'styled-components'
import { PeopleForm, ItemForm, TaxTipControls, SummaryView } from './components'

const AppContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  min-height: 100vh;
  padding: 20px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
`

const Title = styled.h1`
  color: white;
  font-size: 3rem;
  margin-bottom: 1rem;
  text-align: center;
`

const Subtitle = styled.p`
  color: rgba(255, 255, 255, 0.9);
  font-size: 1.2rem;
  text-align: center;
  max-width: 640px;
  margin-bottom: 40px;
`

const SectionsGrid = styled.div`
  display: grid;
  width: 100%;
  max-width: 1200px;
  gap: 24px;
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
`

function App() {
  return (
    <AppContainer>
      <Title>BillSplitter</Title>
      <Subtitle>
        Split every item between friends, apply the right provincial tax rate, and see exactly what
        everyone owes including tax and tip.
      </Subtitle>

      <SectionsGrid>
        <PeopleForm />
        <ItemForm />
        <TaxTipControls />
        <SummaryView />
      </SectionsGrid>
    </AppContainer>
  )
}

export default App
