import styled from "styled-components"

export const BannerContainer = styled.div`
  position: fixed;
  bottom: 32px;
  left: 50%;
  transform: translateX(-50%);
  background: #232323;
  color: #fff;
  padding: 32px 24px 32px 24px;
  border-radius: 18px;
  z-index: 9999;
  box-shadow: 0 6px 32px #111c;
  display: flex;
  align-items: center;
  gap: 28px;
  font-size: 18px;
  max-width: 440px;
  width: 95vw;
  flex-wrap: wrap;
`

export const InstallButton = styled.button`
  background: #25d366;
  color: #222;
  font-weight: 700;
  padding: 14px 36px;
  border-radius: 12px;
  border: none;
  font-size: 18px;
  cursor: pointer;
  box-shadow: 0 2px 8px #25d36644;
`

export const CloseButton = styled.button`
  position: absolute;
  top: 2px;
  right: 8px;
  background: transparent;
  border: none;
  color: #aaa;
  font-size: 26px;
  cursor: pointer;
  font-weight: 900;
  line-height: 1;
`
