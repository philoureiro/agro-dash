// src/pages/Dashboard/styles.ts
import styled, { keyframes } from 'styled-components';

const fadeUp = keyframes`
  0% { opacity: 0; transform: translateY(20px);}
  100% { opacity: 1; transform: translateY(0);}
`;

export const DashboardContainer = styled.section`
  width: 100%;

  padding: 2.5rem 1.2rem 3rem;
  min-height: 100vh;

  color: #fff;
  h1 {
    font-size: 2.5rem;
    margin-bottom: 2.2rem;
    font-weight: 700;
    letter-spacing: -1.5px;
    text-align: left;
    color: #37cb83;
    background: linear-gradient(90deg, #37cb83, #5ad0ff, #ffa63b 60%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }
`;

export const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(230px, 1fr));
  gap: 2rem;
  margin-bottom: 2.5rem;
  width: 100%;
`;

export const CardKpi = styled.div`
  background: rgba(43, 90, 62, 0.18);
  border: 1.5px solid rgba(85, 255, 150, 0.1);
  box-shadow: 0 8px 32px 0 rgba(44, 208, 137, 0.15);
  border-radius: 1.7rem;
  padding: 2.2rem 1.6rem;
  min-height: 128px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
  animation: ${fadeUp} 0.65s ease forwards;
  opacity: 1;
  transition: background 0.18s;
  &:hover {
    background: rgba(37, 203, 131, 0.13);
    box-shadow: 0 12px 48px 0 rgba(44, 208, 137, 0.23);
    transform: translateY(-4px) scale(1.03);
  }
`;

export const KpiTitle = styled.span`
  font-size: 1.16rem;
  color: #b7ffc3;
  letter-spacing: 0.04em;
  margin-bottom: 0.38rem;
  font-weight: 500;
`;

export const KpiValue = styled.span`
  font-size: 2.7rem;
  font-weight: 700;
  color: #37cb83;
  line-height: 1.1;
  letter-spacing: -1.5px;
`;

export const ChartsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(330px, 1fr));
  gap: 2.5rem;
  margin-top: 0.8rem;
  width: 100%;
  min-height: 0;
`;

export const ChartCard = styled.div`
  background: rgba(36, 40, 46, 0.9);
  border: 1.5px solid rgba(90, 208, 255, 0.06);
  border-radius: 1.7rem;
  padding: 1.7rem 1.2rem 1.2rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  animation: ${fadeUp} 0.85s cubic-bezier(0.23, 1, 0.32, 1);
  opacity: 1;
  min-height: 270px;
  width: 100%;
  transition:
    background 0.18s,
    box-shadow 0.12s;
  &:hover {
    background: rgba(90, 208, 255, 0.08);
    box-shadow: 0 8px 28px 0 rgba(90, 208, 255, 0.11);
    transform: translateY(-4px) scale(1.025);
  }
  @media (max-width: 600px) {
    min-height: 170px;
    padding: 0.5rem 0.2rem;
  }
`;

export const ChartTitle = styled.span`
  font-size: 1.25rem;
  font-weight: 600;
  color: #ffa63b;
  margin-bottom: 1.2rem;
  letter-spacing: 0.02em;
  align-self: flex-start;
`;
