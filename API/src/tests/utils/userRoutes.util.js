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

const mockUserId = 'bc172425-d18a-4da5-a861-d3ed7cc2c794';
const correctMockUser = {
  username: generatePseudoRandomUsername(),
  password: 'jpoez1i@1213323!',
  email: `jpezi345${uuidv4()}@gmaiil.com`,
  firstName: 'Juan Pablo',
  lastName: 'Vergara Lobos',
  phone: generateRandomPhone(),
  cash: 1000000,
};
const incorrectMockUser = {};

module.exports = {
  mockUserId,
  correctMockUser,
  incorrectMockUser,
};
