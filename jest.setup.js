process.env.NODE_ENV = 'test';

const db = require('./helpers/db.js');

beforeAll(async () => {
  await db.sequelize.sync({ force: true });
});

beforeEach(async () => {
  const tables = Object.keys(db.sequelize.models);
  for (let table of tables) {
    await db.sequelize.models[table].destroy({ where: {}, force: true });
  }
});
