import { Connection, createConnection, getConnectionOptions } from 'typeorm';
import config from 'config';

export default async function connectDb(): Promise<Connection> {
  const connectionOptions = await getConnectionOptions();

  Object.assign(connectionOptions, {
    host: config.get('db.host'),
    database: config.get('db.name'),
    port: config.get('db.port'),
    username: config.get('db.username'),
    password: config.get('db.password'),
  });

  return createConnection(connectionOptions);
}
