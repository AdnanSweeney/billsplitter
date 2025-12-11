import styled from 'styled-components'
import { PeopleForm, ItemForm } from './components'

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
  max-width: 600px;
  margin-bottom: 40px;
`

const FormsContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
  width: 100%;
  max-width: 1200px;
  align-items: center;

  @media (min-width: 1024px) {
    flex-direction: row;
    align-items: flex-start;
  }
`

function App() {
  return (
    <AppContainer>
      <Title>BillSplitter</Title>
      <Subtitle>Split bills with different tax rates applied to different charges</Subtitle>

      <FormsContainer>
        <PeopleForm />
        <ItemForm />
      </FormsContainer>
    </AppContainer>
  )
}

export default App
