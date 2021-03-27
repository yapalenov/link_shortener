const dotenv = require('dotenv');

dotenv.config();

const DEBUG_SQL = process.env.DEBUG_SQL_QUERY_LOG === 'true';
const BASE_DIR = process.env.TYPEORM_BASE_DIR || 'src';

module.exports = {
  type: 'postgres',
  host: process.env.TYPEORM_HOST,
  port:
    process.env.NODE_ENV === 'test'
      ? +process.env.TYPEORM_TESTS_PORT
      : +process.env.TYPEORM_PORT,
  username: process.env.TYPEORM_USERNAME,
  password: process.env.TYPEORM_PASSWORD,
  database: process.env.TYPEORM_DATABASE,
  entities: [`${BASE_DIR}/database/**/*.entity{.ts,.js}`],
  migrationsTableName: 'typeorm_migrations',
  migrations: [`${BASE_DIR}/database/migrations/*{.ts,.js}`],
  cli: {
    migrationsDir: `${BASE_DIR}/database/migrations`,
  },
  logging: DEBUG_SQL,
};
