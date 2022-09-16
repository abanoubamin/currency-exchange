import React from 'react';
import {TouchableOpacity, Text, StyleSheet} from 'react-native';

import {Colors} from '../../theme';

export const Category = ({isSelected, onPress, label}) => {
  return (
    <TouchableOpacity
      activeOpacity={0.7}
      style={[styles.period, isSelected && styles.selectedPeriod]}
      onPress={onPress}>
      <Text
        style={[styles.periodText, isSelected && styles.selectedPeriodText]}>
        {label}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  period: {
    justifyContent: 'center',
    alignItems: 'center',
    margin: 5,
    paddingHorizontal: 15,
    paddingVertical: 5,
    backgroundColor: Colors.lightGray,
    borderWidth: 1,
    borderColor: Colors.charcoal,
    borderRadius: 20,
  },
  selectedPeriod: {
    backgroundColor: Colors.fountainBlue,
    borderWidth: 2,
    borderColor: Colors.darkFountainBlue,
  },
  periodText: {fontSize: 20, color: Colors.charcoal},
  selectedPeriodText: {color: Colors.white},
});
