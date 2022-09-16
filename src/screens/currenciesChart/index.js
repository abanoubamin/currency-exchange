import React, {useState, useEffect} from 'react';
import {ScrollView, View, StyleSheet, Dimensions} from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';
import moment from 'moment';
import {LineChart} from 'react-native-gifted-charts';

import {getCurrencies, getCurrenciesHistory} from '../../services';
import {Category} from '../../components';
import {Colors} from '../../theme';

const screenWidth = Dimensions.get('window').width;

const CurrenciesChart = () => {
  const [openFromDropDown, setFromOpenDropDown] = useState(false);
  const [firstCurrencyValue, setFirstCurrencyValue] = useState(false);
  const [openToDropDown, setToOpenDropDown] = useState(false);
  const [secondCurrencyValue, setSecondCurrencyValue] = useState(false);
  const [currencies, setCurrencies] = useState([]);
  const dateFormat = 'YYYY-MM-DD';
  const periods = [
    {label: '1D', value: moment().subtract(1, 'days').format(dateFormat)},
    {label: '1M', value: moment().subtract(1, 'months').format(dateFormat)},
    {label: '3M', value: moment().subtract(3, 'months').format(dateFormat)},
    {label: '1Y', value: moment().subtract(1, 'years').format(dateFormat)},
    {label: '5Y', value: moment().subtract(5, 'years').format(dateFormat)},
  ];
  const [selectedPeriod, setSelectedPeriod] = useState(periods[0]);
  const [currenciesRates, setCurrenciesRates] = useState({});
  const lineChartData = Object.values(currenciesRates)?.map((rate, index) => ({
    label: Object.keys(currenciesRates)[index],
    value: Object.values(rate)[0],
  }));

  useEffect(() => {
    (async function () {
      const currenciesResponse = await getCurrencies().catch(err =>
        console.error(err),
      );
      if (currenciesResponse && !!Object.keys(currenciesResponse)?.length) {
        setCurrencies(Object.keys(currenciesResponse));
      }
    })();
  }, []);

  useEffect(() => {
    (async function () {
      if (firstCurrencyValue && secondCurrencyValue) {
        const currenciesHistoryResponse = await getCurrenciesHistory({
          fromDate: selectedPeriod.value,
          toDate: moment().format(dateFormat),
          fromCurrency: firstCurrencyValue,
          toCurrency: secondCurrencyValue,
        }).catch(err => console.error(err));
        currenciesHistoryResponse?.rates &&
          setCurrenciesRates(currenciesHistoryResponse.rates);
      }
    })();
  }, [firstCurrencyValue, secondCurrencyValue, selectedPeriod]);

  const renderCharts = () => {
    if (firstCurrencyValue && secondCurrencyValue) {
      return (
        <>
          <View style={styles.row}>
            {periods.map(per => {
              const isSelected = per.label === selectedPeriod.label;
              return (
                <Category
                  isSelected={isSelected}
                  onPress={() => setSelectedPeriod(per)}
                  label={per.label}
                />
              );
            })}
          </View>
          <View style={styles.lineChartContainer}>
            <LineChart
              isAnimated
              width={screenWidth - 100}
              data={lineChartData}
              xAxisLabelTextStyle={styles.xAxisLabelTextStyle}
            />
          </View>
        </>
      );
    }
  };

  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      contentContainerStyle={styles.container}>
      <DropDownPicker
        style={styles.dropDown}
        dropDownContainerStyle={styles.dropDown}
        placeholder="From"
        placeholderStyle={styles.dropDownPlaceholder}
        searchable={!!currencies?.length}
        searchPlaceholder="Type currency..."
        open={openFromDropDown}
        setOpen={setFromOpenDropDown}
        items={currencies
          .filter(cur => cur !== secondCurrencyValue)
          .map(cur => ({label: cur, value: cur}))}
        value={firstCurrencyValue}
        setValue={setFirstCurrencyValue}
        zIndex={2}
      />
      <DropDownPicker
        style={styles.dropDown}
        dropDownContainerStyle={styles.dropDown}
        placeholder="To"
        placeholderStyle={styles.dropDownPlaceholder}
        searchable={!!currencies?.length}
        searchPlaceholder="Type currency..."
        open={openToDropDown}
        setOpen={setToOpenDropDown}
        items={currencies
          .filter(cur => cur !== firstCurrencyValue)
          .map(cur => ({label: cur, value: cur}))}
        value={secondCurrencyValue}
        setValue={setSecondCurrencyValue}
        zIndex={1}
      />
      {renderCharts()}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {flex: 1, paddingTop: 50},
  dropDown: {
    alignSelf: 'center',
    width: '80%',
    marginTop: 10,
    borderColor: Colors.lineGrey,
    borderRadius: 10,
  },
  dropDownPlaceholder: {color: Colors.grey},
  row: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    flexWrap: 'wrap',
    marginVertical: 30,
  },
  lineChartContainer: {
    marginTop: 50,
    paddingHorizontal: 10,
  },
  xAxisLabelTextStyle: {
    fontSize: 10,
    color: Colors.black,
    transform: [{rotateX: '-45deg'}, {rotateZ: '-45deg'}],
  },
});

export default CurrenciesChart;
