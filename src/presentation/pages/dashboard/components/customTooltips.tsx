import { VictoryTooltip } from 'victory';

// 🎨 TOOLTIP CUSTOMIZADO COM COR FIXA
interface CustomTooltipProps {
  x?: number;
  y?: number;
  datum?: object; // Replace 'object' with a more specific type if known
}

export const CustomTooltip = ({ x, y, datum }: CustomTooltipProps) => (
  <VictoryTooltip
    x={x}
    y={y}
    datum={datum}
    style={{
      fill: '#000000', // 🔥 COR FIXA PRETA SEMPRE!
      fontSize: 12,
      fontWeight: 600,
      fontFamily: 'inherit',
    }}
    flyoutStyle={{
      fill: '#ffffff', // Fundo branco
      stroke: '#000000', // Borda preta
      strokeWidth: 1,
      fillOpacity: 0.95,
    }}
    cornerRadius={8}
    pointerLength={8}
    pointerWidth={10}
  />
);
