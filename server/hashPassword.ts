import { hashPassword } from './utils/password';

// Quick script to generate a password hash
const password = process.argv[2] || 'pass1234';

hashPassword(password).then((hash) => {
  console.log('\n=================================');
  console.log('Password:', password);
  console.log('Hash:', hash);
  console.log('=================================\n');
  console.log('Copy this hash and update your MongoDB document:');
  console.log(
    `db.users.updateOne({ username: "test-user" }, { $set: { passwordHash: "${hash}" } })`
  );
  console.log('\n');
  process.exit(0);
});
