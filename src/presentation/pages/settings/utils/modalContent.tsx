export const MODAL_CONTENT = {
  resetSystem: {
    icon: '🗑️',
    title: 'Reset Completo do Sistema',
    subtitle: 'Você está prestes a apagar absolutamente tudo!',
    message: (
      <div style={{ width: '100%', padding: 0 }}>
        <ul
          style={{
            width: '100%',
            margin: 0,
            padding: '0 0 16px 32px',
            listStyle: 'disc',
            fontSize: '1.07rem',
            lineHeight: 1.9,
            color: '#ff5252',
            fontWeight: 500,
          }}
        >
          <li>📊 Todas as fazendas, produtores e culturas</li>
          <li>⚙️ Todas as configurações e preferências</li>
          <li>📈 Todas as estatísticas de uso</li>
          <li>🗂️ Todo o cache e dados temporários</li>
        </ul>
        <div
          style={{
            width: '100%',
            textAlign: 'center',
            padding: 5,
            border: '2px solid #ff5252',
            borderRadius: 12,
            fontSize: 18,
            fontWeight: 700,
            letterSpacing: 0.2,
            margin: '0 auto',
            boxShadow: '0 2px 12px 0 rgba(255,82,82,0.08)',
          }}
        >
          ⚠️ O sistema será completamente reiniciado!
        </div>
      </div>
    ),
    confirmText: 'Sim, Resetar Tudo',
    cancelText: 'Cancelar',
  },
  resetData: {
    icon: '📊',
    title: 'Reset dos Dados',
    subtitle: 'Você está prestes a apagar todos os dados do negócio!',
    message: (
      <div style={{ width: '100%', padding: 0 }}>
        <ul
          style={{
            width: '100%',
            margin: 0,
            padding: '0 0 16px 32px',
            listStyle: 'disc',
            fontSize: '1.07rem',
            lineHeight: 1.9,
            color: '#ff5252',
            fontWeight: 500,
          }}
        >
          <li>🏡 Todas as fazendas cadastradas</li>
          <li>👥 Todos os produtores</li>
          <li>🌾 Todas as culturas</li>
          <li>📋 Cache do dashboard</li>
        </ul>
        <div
          style={{
            width: '100%',
            textAlign: 'center',
            padding: 5,
            border: '2px solid #ff5252',
            borderRadius: 12,
            fontSize: 18,
            fontWeight: 700,
            letterSpacing: 0.2,
            margin: '0 auto',
            boxShadow: '0 2px 12px 0 rgba(255,82,82,0.08)',
          }}
        >
          ⚠️ Todos os dados do negócio serão apagados!
        </div>
      </div>
    ),
    confirmText: 'Sim, Resetar Dados',
    cancelText: 'Cancelar',
  },
  resetConfig: {
    icon: '⚙️',
    title: 'Reset das Configurações',
    subtitle: 'Você está prestes a resetar apenas as configurações!',
    message: (
      <div style={{ width: '100%', padding: 0 }}>
        <ul
          style={{
            width: '100%',
            margin: 0,
            padding: '0 0 16px 32px',
            listStyle: 'disc',
            fontSize: '1.07rem',
            lineHeight: 1.9,
            color: '#ff5252',
            fontWeight: 500,
          }}
        >
          <li>🎨 Tema volta para o padrão do dispositivo</li>
          <li>📱 Modo compacto desativado</li>
          <li>✨ Animações ativadas</li>
          <li>💾 Auto-save ativado</li>
          <li>🔔 Notificações ativadas</li>
        </ul>
        <div
          style={{
            width: '100%',
            textAlign: 'center',
            padding: 5,
            border: '2px solid #ff5252',
            borderRadius: 12,
            fontSize: 18,
            fontWeight: 700,
            letterSpacing: 0.2,
            margin: '0 auto',
            boxShadow: '0 2px 12px 0 rgba(255,82,82,0.08)',
          }}
        >
          ⚠️ Suas configurações serão redefinidas!
        </div>
      </div>
    ),
    confirmText: 'Sim, Resetar Configurações',
    cancelText: 'Cancelar',
  },
};
