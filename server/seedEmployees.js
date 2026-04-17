const { sequelize, User } = require('./models');
const bcrypt = require('bcrypt');

async function seed() {
  await sequelize.sync();
  console.log('Seeding 10 employees...');
  
  for (let i = 1; i <= 10; i++) {
    const email = `employee${i}@sunseating.com`;
    const existing = await User.findOne({ where: { email } });
    if (!existing) {
      await User.create({
        name: `Test Employee ${i}`,
        email: email,
        password_hash: 'emp123', // hooks will trigger hash
        role: 'employee'
      });
      console.log(`Created: ${email} / emp123`);
    } else {
      console.log(`Already exists: ${email}`);
    }
  }
  console.log('Done seeding employees!');
  process.exit();
}

seed();
