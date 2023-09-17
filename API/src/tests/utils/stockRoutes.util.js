// eslint-disable-next-line
const correctMockStock = `{"stocks": "[{\\"symbol\\": \\"GOOGL\\",\
\\"shortName\\": \\"Alphabet Inc.\\", \\"price\\": 2753.1,\
\\"currency\\": \\"USD\\", \\"source\\": \\"NASDAQ\\"}]"}`;

const noStockMockStock = '{}';

// eslint-disable-next-line
const missingFieldsMockStock = `{"stocks": "[{\\"symbol\\": \\"GOOGL\\",\
\\"shortName\\": \\"Alphabet Inc.\\", \\"price\\": 2753.1,\
\\"currency\\": \\"USD\\"}]"}`;

// eslint-disable-next-line
const wrongDataTypesMockStock = `{"stocks": "[{\\"symbol\\": 777,\
\\"shortName\\": \\"Alphabet Inc.\\", \\"price\\": 2753.1,\
\\"currency\\": \\"USD\\", \\"source\\": \\"NASDAQ\\"}]"}`;

module.exports = {
  correctMockStock,
  noStockMockStock,
  missingFieldsMockStock,
  wrongDataTypesMockStock,
};
