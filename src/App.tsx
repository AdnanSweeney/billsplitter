import styled from 'styled-components'

const AppContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
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
`

function App() {
  return (
    <AppContainer>
      <Title>BillSplitter</Title>
      <Subtitle>Split bills with different tax rates applied to different charges</Subtitle>
    </AppContainer>
  )
}

export default App
