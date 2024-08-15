import { Sequelize, SequelizeOptions } from 'sequelize-typescript';
import 'dotenv/config'
import Report from '../models/report.js';

// prettier-ignore
const sequelize = new Sequelize({
    host    : process.env.PG_HOST,
    database: process.env.PG_DATABASE,
    dialect : process.env.PG_DIALECT,
    username: process.env.PG_USERNAME,
    password: process.env.PG_PASSWORD,
    port    : process.env.PG_PORT,
    logging : console.log,
    models  : [
      Report
    ],
  } as SequelizeOptions);

  await sequelize.sync({ force: true })
  //await sequelize.sync();

  export default sequelize