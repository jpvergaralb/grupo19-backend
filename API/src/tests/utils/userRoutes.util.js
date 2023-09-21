const { v4: uuidv4 } = require('uuid');

const generateRandomPhone = () => {
  let phone = '';
  for (let i = 0; i < 11; i += 1) {
    phone += Math.floor(Math.random() * 10).toString();
  }
  return phone;
};

const generatePseudoRandomUsername = () => {
  const random = Math.floor(Math.random() * 10000000);
  return `jpoezi5${random}`;
};

const mockUserId = '8a04cb0b-9c2a-4895-8e5c-95626ad9d1f0';
const correctMockUser = {
  username: generatePseudoRandomUsername(),
  auth0Id: "auth0|6140a0b1e2b9d4006a3f0b1f",
  password: 'jpoez1i@1213323!',
  email: `jpezi345${uuidv4()}@gmaiil.com`,
  firstName: 'Juan Pablo',
  lastName: 'Vergara Lobos',
  phone: generateRandomPhone(),
  cash: 1000000,
};
const incorrectMockUser = {};

const mockUserMoney = 1000.69;

module.exports = {
  mockUserId,
  mockUserMoney,
  correctMockUser,
  incorrectMockUser,
};
