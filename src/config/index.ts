const title = 'Agro Dash';

const email = 'philipeloureiro@gmail.com';

const repository = 'https://github.com/philoureiro/agro-dash';

const dateFormat = 'MMMM DD, YYYY';

const loader = {
  // no more blinking in your app
  delay: 300, // if seu processo assíncrono acabar em 300ms, nem mostra loader
  minimumLoading: 700, // mas se aparecer, fica pelo menos 700ms
};

const defaultMetaTags = {
  image: '/icon-512.png', // Use o ícone do projeto ou um cover custom
  description:
    'Dashboard inteligente para gestão de propriedades rurais, acompanhamento de produtores e visualização de dados agrícolas em tempo real.',
};

export { loader, dateFormat, repository, email, title, defaultMetaTags };
