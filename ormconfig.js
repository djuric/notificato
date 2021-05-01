const rootDir = process.env.NODE_ENV === 'production' ? 'dist/' : 'src/';

module.exports = {
  type: 'mysql',
  entities: [rootDir + 'entities/**/*.{js,ts}'],
  migrations: [rootDir + 'migrations/*.{js,ts}'],
  synchronize: true,
  logging: false,
};
