import styled, { keyframes } from "styled-components"

export const spinZap = keyframes`
  0% { transform: rotate(0deg);}
  100% { transform: rotate(360deg);}
`

export const ZapidinhoButton = styled.button<{ loading?: boolean }>`
  background: linear-gradient(90deg, #25d366 0%, #2aff78 100%);
  border: none;
  border-radius: 12px;
  width: 200px;
  color: #181818;
  font-size: 1.2rem;
  font-weight: 800;
  padding: 14px 36px;
  letter-spacing: 1.5px;
  box-shadow: 0 6px 24px 0 #25d36644, 0 2px 4px 0 #2aff7830;
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  cursor: pointer;
  outline: none;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  text-transform: none;
  opacity: ${({ loading }) => (loading ? 0.8 : 1)};
  pointer-events: ${({ loading }) => (loading ? "none" : "auto")};

  &:hover:not(:disabled):not(.loading) {
    background: linear-gradient(90deg, #2aff78 0%, #25d366 100%);
    box-shadow: 0 2px 10px 0 #2aff7833, 0 1px 6px 0 #25d36622;
    transform: translateY(-2px) scale(1.025);
  }

  &:active:not(:disabled):not(.loading) {
    transform: scale(0.98);
  }

  &.loading,
  &:disabled {
    background: linear-gradient(90deg, #b3ffd9 0%, #a1ffb6 100%);
    color: #888;
    cursor: not-allowed;
    box-shadow: none;
    opacity: 0.8;
  }
`

export const LoaderWrapper = styled.span`
  display: flex;
  align-items: center;
`

export const ZapidinhoSpinner = styled.span`
  width: 1.3em;
  height: 1.3em;
  border: 3px solid #25d36666;
  border-top: 3px solid #25d366;
  border-radius: 50%;
  animation: ${spinZap} 1s linear infinite;
  display: inline-block;
`
