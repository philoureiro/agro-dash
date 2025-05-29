module.exports = {
  extends: ['@commitlint/config-conventional'],
  rules: {
    // Personaliza types e scopes se quiser, mas esses já são os mais comuns e aceitos no Angular
    'type-enum': [
      2,
      'always',
      ['feat', 'fix', 'docs', 'style', 'refactor', 'perf', 'test', 'chore', 'build'],
    ],
    'scope-enum': [2, 'always', ['router', 'components', 'README', 'services', 'deps', 'tools']],
    // Outras regras podem ser adicionadas, mas assim já está seguro!
  },
};
