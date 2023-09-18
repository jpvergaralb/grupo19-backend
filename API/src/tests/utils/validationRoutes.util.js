const sellerMockId = 0;

const groupMockId = 13;

const statusMock = true;

const correctValidationMock = {
  request_id: '8a04cb0b-9c2a-4895-1e5c-95626ad9d1f0',
  group_id: '13',
  seller: 0,
  valid: 'true',
};

const missingFieldValidationMock = {
  request_id: '63fe8daa-4f94-11ee-be56-0242ac120002',
  group_id: '13',
  seller: 0,
};

module.exports = {
  sellerMockId,
  groupMockId,
  statusMock,
  correctValidationMock,
  missingFieldValidationMock,
};
