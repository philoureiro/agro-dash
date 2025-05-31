// src/routes.tsx
import { Navigate, Route, Routes } from 'react-router-dom';

import { Page1, Page2, Page3 } from '@pages';

import Page4 from '../pages/Page4';

// Importe suas páginas aqui (muda para os paths corretos do seu projeto)

// EXEMPLO: caso use lazy loading (recomendado em app real)
// const Dashboard = React.lazy(() => import('@pages/Dashboard'));

export const AppRoutes = () => (
  <Routes>
    {/* Página inicial redireciona para dashboard */}
    <Route path="/" element={<Navigate to="/dashboard" />} />

    {/* Rotas principais */}
    <Route path="/dashboard" element={<Page1 />} />
    <Route path="/pesquisar" element={<Page2 />} />
    <Route path="/cadastrar" element={<Page3 />} />
    <Route path="/editar" element={<Page4 />} />

    {/* 404 - Rota não encontrada */}
    <Route path="*" element={<div>Página não encontrada</div>} />
  </Routes>
);
