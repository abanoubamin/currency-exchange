import axios from 'axios';

const GeocoderAPI = (latitude, longitude) =>
  `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=18&addressdetails=1&fbclid=IwAR0mbzO4B1BGhnqa8wAWRQaWPY0mP0zmbQirFgbv9L-cbvgHsNoQzapqLiQ`;
const CurrenciesAPI = 'https://api.frankfurter.app/currencies';
const CurrenciesRatesAPI = ({fromDate, toDate, fromCurrency, toCurrency}) =>
  `https://api.frankfurter.app/${fromDate}..${toDate}?from=${fromCurrency}&to=${toCurrency}`;

export const getGeoLocation = async (latitude, longitude) => {
  const response = await axios
    .get(GeocoderAPI(latitude, longitude))
    .catch(error => {
      throw error;
    });
  return response?.data?.address;
};

export const getCurrencies = async () => {
  const response = await axios.get(CurrenciesAPI).catch(error => {
    throw error;
  });
  return response?.data;
};

export const getCurrenciesHistory = async ({
  fromDate,
  toDate,
  fromCurrency,
  toCurrency,
}) => {
  const response = await axios
    .get(CurrenciesRatesAPI({fromDate, toDate, fromCurrency, toCurrency}))
    .catch(error => {
      throw error;
    });
  return response?.data;
};
