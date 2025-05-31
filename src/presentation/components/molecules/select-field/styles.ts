import { colors } from '@theme';
import styled from 'styled-components';

export const SelectField = styled.select`
  padding: 10px;
  border: 1px solid #444;
  border-radius: 8px;
  background-color: #222;
  color: #fff;
  font-size: 14px;
  outline: none;
  height: 40px;

  &:focus {
    border-color: ${colors.activeGreen};
  }
`;
export const FieldContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
`;

export const InputLabel = styled.label`
  font-size: 14px;
  margin-bottom: 4px;
  color: #ccc;
`;
