import React, { useState } from "react";
import { View, Text } from "react-native";
import { Button } from 'react-native-paper';
import { DatePickerModal } from 'react-native-paper-dates';
import { DatePickerInputProps } from "react-native-paper-dates/lib/typescript/Date/DatePickerInput.shared";
import { SafeAreaProvider } from "react-native-safe-area-context";

export default function DateRangePicker({ dateRange }: any) {
  const [range, setRange] = useState(dateRange);
  const [open, setOpen] = React.useState(false);

  const onDismiss = React.useCallback(() => {
    setOpen(false);
  }, [setOpen]);

  const onConfirm = React.useCallback(
    ({ startDate, endDate }: any) => {
      setOpen(false);
      setRange({ startDate, endDate });
    },
    [setOpen, setRange]
  );

  return (
    <SafeAreaProvider>
      <View style={{ justifyContent: 'center', flex: 1, alignItems: 'center' }}>
        <Text>{range.startDate} - {range.endDate}</Text>
        <Button onPress={() => setOpen(true)} uppercase={false} mode="outlined">
          Pick range
        </Button>
        <DatePickerModal
          locale="en"
          mode="range"
          visible={open}
          onDismiss={onDismiss}
          startDate={range.startDate}
          endDate={range.endDate}
          onConfirm={onConfirm}
          disableStatusBarPadding
          startYear={2023}
          endYear={2024}
        />
      </View>
    </SafeAreaProvider>
  );
}