// src/presentation/components/BottomBar.tsx
import React from 'react';
import { FiEdit, FiHome, FiPlusCircle, FiUser } from 'react-icons/fi';
import { useLocation, useNavigate } from 'react-router-dom';

import { BarItem, GlassBar, Label } from './styles';

const NAV_ITEMS = [
  { label: 'Dashboard', icon: <FiHome />, path: '/dashboard' },
  { label: 'Cadastrar', icon: <FiPlusCircle />, path: '/cadastrar' },
  { label: 'Editar', icon: <FiEdit />, path: '/editar' },
  { label: 'Perfil', icon: <FiUser />, path: '/perfil' },
];

interface BottomBarProps {
  themeMode?: string;
}

const BottomBar: React.FC<BottomBarProps> = ({ themeMode }) => {
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

export default BottomBar;
