// src/presentation/components/BottomBar.tsx
import React from 'react';
import { FiPlusCircle } from 'react-icons/fi';
import { MdOutlineEditLocation } from 'react-icons/md';
import { TbLayoutDashboardFilled } from 'react-icons/tb';
import { TbMapSearch } from 'react-icons/tb';
import { useLocation, useNavigate } from 'react-router-dom';

import { BarItem, GlassBar, Label } from './styles';

const NAV_ITEMS = [
  { label: 'Dashboard', icon: <TbLayoutDashboardFilled />, path: '/dashboard' },
  { label: 'Pesquisar', icon: <TbMapSearch />, path: '/pesquisar' },
  { label: 'Cadastrar', icon: <FiPlusCircle />, path: '/cadastrar' },
  { label: 'Editar', icon: <MdOutlineEditLocation />, path: '/editar' },
];

interface BottomBarProps {
  themeMode?: string;
}

export const BottomBar: React.FC<BottomBarProps> = ({ themeMode }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const currentTab = NAV_ITEMS.findIndex((item) => location.pathname.startsWith(item.path));

  return (
    <GlassBar themeMode={themeMode}>
      {NAV_ITEMS.map((item, idx) => (
        <BarItem key={item.label} active={currentTab === idx} onClick={() => navigate(item.path)}>
          {item.icon}
          <Label>{item.label}</Label>
        </BarItem>
      ))}
    </GlassBar>
  );
};
