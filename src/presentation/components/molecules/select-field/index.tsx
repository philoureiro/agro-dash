import React from "react"

import { FieldContainer, SelectField, InputLabel } from "./styles"

interface SelectProps {
  label: string // Rótulo do campo
  value: string // Valor selecionado
  onChange: (value: string) => void // Função chamada ao alterar o valor
  options: { value: string; label: string }[] // Opções do select
  style?: React.CSSProperties // Estilo opcional
}

export const Select: React.FC<SelectProps> = ({
  label,
  value,
  onChange,
  options,
  style,
}) => {
  return (
    <FieldContainer style={style}>
      <InputLabel>{label}</InputLabel>
      <SelectField value={value} onChange={(e) => onChange(e.target.value)}>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </SelectField>
    </FieldContainer>
  )
}
