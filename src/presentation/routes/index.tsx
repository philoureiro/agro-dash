// src/routes.tsx
import { Navigate, Route, Routes } from 'react-router-dom';

import { AddFarmer, Dashboard, EditFarmer, Search } from '@pages';

export const AppRoutes = () => (
  <Routes>
    {/* Página inicial redireciona para dashboard */}
    <Route path="/" element={<Navigate to="/dashboard" />} />

    {/* Rotas principais */}
    <Route path="/dashboard" element={<Dashboard />} />
    <Route path="/pesquisar" element={<Search />} />
    <Route path="/cadastrar" element={<AddFarmer />} />
    <Route path="/editar" element={<EditFarmer />} />

    {/* 404 - Rota não encontrada */}
    <Route path="*" element={<div>Página não encontrada</div>} />
  </Routes>
);
