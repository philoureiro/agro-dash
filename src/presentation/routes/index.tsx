// src/routes.tsx
import { Navigate, Route, Routes } from 'react-router-dom';

import { AddFarmer, Dashboard, EditFarmer, Markdown, Search } from '@pages';

export const AppRoutes = () => (
  <Routes>
    {/* Página inicial redireciona para /docs */}
    <Route path="/" element={<Navigate to="/docs" />} />

    {/* Rotas principais */}
    <Route path="/docs" element={<Markdown />} />
    <Route path="/dashboard" element={<Dashboard />} />
    <Route path="/pesquisar" element={<Search />} />
    <Route path="/cadastrar" element={<AddFarmer />} />
    <Route path="/editar" element={<EditFarmer />} />

    <Route path="*" element={<div>Página não encontrada</div>} />
  </Routes>
);
