import React, { useEffect, useRef } from 'react';

import { ChartCard } from '../styles';

export function ChartCardComponent(props) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const timer = setTimeout(
      () => {
        ref.current?.classList.add('animated-done');
      },
      800 + (props.delay || 0),
    ); // tempo da animação + delay
    return () => clearTimeout(timer);
  }, [props.delay]);

  return (
    <ChartCard ref={ref} delay={props.delay}>
      {props.children}
    </ChartCard>
  );
}
