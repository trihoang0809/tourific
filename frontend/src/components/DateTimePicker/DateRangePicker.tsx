// import { DateRangePickerProps } from "@/types";
// import React, { useCallback, useState } from "react";
// import { View, Text } from "react-native";
// import { Button } from 'react-native-paper';
// import { DatePickerModal } from 'react-native-paper-dates';
// import { SafeAreaProvider } from "react-native-safe-area-context";

// export default function DateRangePicker({ onSelectRange }: DateRangePickerProps) {
//   const [range, setRange] = useState({ startDate: undefined, endDate: undefined });
//   const [open, setOpen] = useState(false);

//   const onDismiss = useCallback(() => {
//     setOpen(false);
//   }, [setOpen]);

//   const onConfirm = React.useCallback(
//     ({ startDate, endDate }: any) => {
//       setOpen(false);
//       setRange({ startDate, endDate });
//       onSelectRange(startDate, endDate);
//     },
//     [onSelectRange, setOpen, setRange]
//   );

//   return (
//     <SafeAreaProvider>
//       <View style={{ justifyContent: 'center', flex: 1, alignItems: 'center' }}>
//         <Text>{range.startDate} - {range.endDate}</Text>
//         <Button onPress={() => setOpen(true)} uppercase={false} mode="outlined">
//           Pick range
//         </Button>
//         <DatePickerModal
//           locale="en"
//           mode="range"
//           visible={open}
//           onDismiss={onDismiss}
//           startDate={range.startDate}
//           endDate={range.endDate}
//           onConfirm={onConfirm}
//           disableStatusBarPadding
//           startYear={2023}
//           endYear={2024}
//         />
//       </View>
//     </SafeAreaProvider>
//   );
// }