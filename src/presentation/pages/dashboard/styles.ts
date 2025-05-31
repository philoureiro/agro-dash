import { DefaultTheme as StyledDefaultTheme } from 'styled-components';
import styled, { keyframes } from 'styled-components';

// Extend DefaultTheme to include 'palette'
interface Palette {
  divider?: string;
  background: { paper: string };
  text: { primary: string; secondary: string };
  primary: { main: string; light?: string };
  secondary?: { main: string; light?: string };
  warning?: { main: string };
}

export interface DefaultTheme extends StyledDefaultTheme {
  palette: Palette;
}

const fadeUp = keyframes`
  0% { opacity: 0; transform: translateY(20px);}
  100% { opacity: 1; transform: translateY(0);}
`;

export const DashboardContainer = styled.section<{ theme: DefaultTheme }>`
  width: 100%;
  padding: 2.5rem 1.2rem 3rem;
  min-height: 100vh;
  color: ${({ theme }) => theme.palette?.text?.primary || '#fff'};
  background: ${({ theme }) => theme.palette?.background || '#151f1b'};
  transition:
    background 0.2s,
    color 0.2s;
  h1 {
    font-size: 2.5rem;
    margin-bottom: 2.2rem;
    font-weight: 700;
    letter-spacing: -1.5px;
    text-align: left;
    color: ${({ theme }) => theme.palette?.primary?.main || '#37cb83'};
    background: linear-gradient(
      90deg,
      ${({ theme }) => theme.palette?.primary?.main || '#37cb83'},
      ${({ theme }) => theme.palette?.secondary?.main || '#5ad0ff'},
      ${({ theme }) => theme.palette?.warning?.main || '#ffa63b'} 60%
    );
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

export const CardKpi = styled.div<{ theme: DefaultTheme }>`
  background: ${({ theme }) => theme.palette?.background?.paper || 'rgba(43, 90, 62, 0.18)'};
  border: 1.5px solid
    ${({ theme }) =>
      theme.palette?.primary?.main ? `${theme.palette.primary.main}22` : 'rgba(85,255,150,0.10)'};
  box-shadow: 0 8px 32px 0
    ${({ theme }) =>
      theme.palette?.primary?.main ? `${theme.palette.primary.main}30` : 'rgba(44,208,137,0.15)'};
  border-radius: 1.7rem;
  padding: 2.2rem 1.6rem;
  min-height: 128px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
  animation: ${fadeUp} 0.65s ease forwards;
  opacity: 1;
  transition:
    background 0.18s,
    box-shadow 0.18s;
  &:hover {
    background: ${({ theme }) =>
      theme.palette?.primary?.main ? `${theme.palette.primary.main}13` : 'rgba(55,203,131,0.18)'};
    box-shadow: 0 12px 48px 0
      ${({ theme }) =>
        theme.palette?.primary?.main ? `${theme.palette.primary.main}40` : 'rgba(44,208,137,0.23)'};
    transform: translateY(-4px) scale(1.03);
  }
`;

export const KpiTitle = styled.span<{ isDark?: boolean }>`
  font-size: 1.16rem;
  color: ${({ theme, isDark }) =>
    isDark
      ? theme.palette?.primary?.light || 'rgb(18, 227, 53)'
      : theme.palette?.secondary?.main || 'rgb(15, 59, 38)'};
  letter-spacing: 0.04em;
  margin-bottom: 0.38rem;
  font-weight: 500;
`;

export const KpiValue = styled.span<{ isDark?: boolean }>`
  font-size: 2.7rem;
  font-weight: 700;
  color: ${({ theme, isDark }) =>
    isDark
      ? theme.palette?.primary?.light || 'rgb(18, 227, 53)'
      : theme.palette?.secondary?.main || 'rgb(15, 59, 38)'};
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
export const ChartCard = styled.div<{ theme: DefaultTheme; isDark?: boolean }>`
  background: ${({ theme, isDark }) =>
    isDark
      ? theme.palette?.background?.paper || '#23272f'
      : theme.palette?.background
        ? `${theme.palette.background}CC`
        : 'rgb(236, 236, 236)'};
  border: 1.5px solid
    ${({ theme, isDark }) =>
      isDark
        ? theme.palette?.primary?.main
          ? `${theme.palette.primary.main}33`
          : 'rgba(55,203,131,0.18)'
        : theme.palette?.secondary?.main
          ? `${theme.palette.secondary.main}22`
          : 'rgba(90,208,55,0.13)'};
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
    background: ${({ theme, isDark }) =>
      isDark
        ? theme.palette?.primary?.main
          ? `${theme.palette.primary.main}18`
          : '#263a2e'
        : theme.palette?.secondary?.light
          ? `${theme.palette.secondary.light}18`
          : 'rgba(55,203,131,0.18)'};
    box-shadow: 0 12px 48px 0
      ${({ theme }) =>
        theme.palette?.primary?.main ? `${theme.palette.primary.main}40` : 'rgba(44,208,137,0.23)'};
  }
  @media (max-width: 600px) {
    min-height: 170px;
    padding: 0.5rem 0.2rem;
  }
`;

export const ChartTitle = styled.span<{ theme: DefaultTheme }>`
  font-size: 1.25rem;
  font-weight: 600;
  color: ${({ theme }) => theme.palette?.secondary?.main || '#ffa63b'};
  margin-bottom: 1.2rem;
  letter-spacing: 0.02em;
  align-self: flex-start;
  margin-left: 15px;
  margin-top: 15px;
`;
