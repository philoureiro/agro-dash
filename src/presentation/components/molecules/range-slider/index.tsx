import React from 'react';

import { CustomSlider, SliderContainer, SliderLabel, SliderValue } from './styles';

interface RangeSliderProps {
  label: string;
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
  color?: string;
  icon?: string;
  isDark: boolean;
  disabled?: boolean;
  showValue?: boolean;
  unit?: string;
}

export const RangeSlider: React.FC<RangeSliderProps> = ({
  label,
  value,
  onChange,
  min = 0,
  max = 100,
  step = 1,
  color = '#37cb83',
  icon,
  isDark,
  disabled = false,
  showValue = true,
  unit = '%',
}) => {
  const handleChange = (_event: Event, newValue: number | number[]) => {
    const val = Array.isArray(newValue) ? newValue[0] : newValue;
    onChange(val);
  };

  return (
    <SliderContainer $isDark={isDark}>
      <SliderLabel $isDark={isDark}>
        <span>
          {icon && <span style={{ marginRight: '0.5rem' }}>{icon}</span>}
          {label}
        </span>
        {showValue && (
          <SliderValue $color={color}>
            <strong>
              {value}
              {unit}
            </strong>
          </SliderValue>
        )}
      </SliderLabel>

      <CustomSlider
        $color={color}
        $isDark={isDark}
        value={value}
        onChange={handleChange}
        min={min}
        max={max}
        step={step}
        disabled={disabled}
        valueLabelDisplay="auto"
        valueLabelFormat={(val) => `${val}${unit}`}
        aria-label={label}
      />
    </SliderContainer>
  );
};
