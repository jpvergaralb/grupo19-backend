const {
  WebpayPlus, Options, IntegrationApiKeys, Environment, IntegrationCommerceCodes,
} = require('transbank-sdk');

const tx = new WebpayPlus.Transaction(
  new Options(IntegrationCommerceCodes.WEBPAY_PLUS, IntegrationApiKeys.WEBPAY, Environment.Integration)
);

tx.options.commerceCode = '597055555532';
tx.options.apiKey = '579B532A7440BB0C9079DED94D31EA1615BACEB56610332264630D42D0A36B1C';
tx.options.currency = 'USD';

module.exports = tx;
