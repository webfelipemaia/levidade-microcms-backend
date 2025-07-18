// jest.setup.js
jest.setTimeout(20000);


const sequelize = require('./config/database.js');

beforeAll(async () => {
  await sequelize.sync({ force: true });
}, 20000);

beforeEach(async () => {
  const tables = Object.keys(sequelize.models);
  for (let table of tables) {
    await sequelize.models[table].destroy({ where: {}, force: true });
  }
});

afterAll(async () => {
  await sequelize.close();
});
