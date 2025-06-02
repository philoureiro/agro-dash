import styled, { keyframes } from "styled-components"

export const Container = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100vh;
`

export const LoadingWrapper = styled(Container)`
  flex-direction: column;
  gap: 1rem;
`

const spin = keyframes`
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
`

export const Spinner = styled.div`
  border: 4px solid #f3f3f3;
  border-top: 4px solid #25d366;
  border-radius: 50%;
  width: 48px;
  height: 48px;
  animation: ${spin} 1s linear infinite;
`
