const { User } = require('./models');
User.update({ name: 'Admin' }, { where: { email: 'admin@sunseating.com' } }).then(() => {
  console.log('Name updated from Super Admin to Admin');
  process.exit();
});
