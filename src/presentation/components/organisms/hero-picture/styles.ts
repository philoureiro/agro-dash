import styled from 'styled-components';

export const HeroContainer = styled.div<{ $isDark: boolean; $hasPhoto: boolean }>`
  width: 100%;
  height: ${({ $hasPhoto }) => ($hasPhoto ? '200px' : '120px')};
  border-radius: 12px;
  overflow: hidden;
  margin-bottom: 1.5rem;
  border: 2px solid
    ${({ $isDark }) => ($isDark ? 'rgba(55, 203, 131, 0.3)' : 'rgba(55, 203, 131, 0.2)')};
  background: ${({ $isDark }) => ($isDark ? 'rgba(45, 52, 64, 0.5)' : 'rgba(248, 250, 252, 0.5)')};
  transition: all 0.3s ease;
  position: relative;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(55, 203, 131, 0.2);
  }
`;

export const PhotoImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;

  &:hover {
    transform: scale(1.05);
  }
`;

export const PlaceholderContent = styled.div<{ $isDark: boolean }>`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  color: ${({ $isDark }) => ($isDark ? 'rgba(255,255,255,0.6)' : 'rgba(0,0,0,0.6)')};
  font-size: 0.9rem;

  .icon {
    font-size: 2rem;
    margin-bottom: 0.5rem;
  }
`;

export const PhotoOverlay = styled.div<{ $isDark: boolean }>`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(
    135deg,
    ${({ $isDark }) => ($isDark ? 'rgba(0,0,0,0.3)' : 'rgba(255,255,255,0.3)')},
    transparent
  );
  display: flex;
  align-items: flex-end;
  padding: 1rem;
  opacity: 0;
  transition: opacity 0.3s ease;

  ${HeroContainer}:hover & {
    opacity: 1;
  }
`;

export const PhotoLabel = styled.span<{ $isDark: boolean }>`
  background: ${({ $isDark }) => ($isDark ? 'rgba(0,0,0,0.7)' : 'rgba(255,255,255,0.9)')};
  color: ${({ $isDark }) => ($isDark ? '#fff' : '#2c3e50')};
  padding: 0.5rem 1rem;
  border-radius: 6px;
  font-size: 0.8rem;
  font-weight: 500;
`;
