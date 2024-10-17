import {
  initialize,
  requestPermission,
  readRecords,
} from 'react-native-health-connect';
import React from 'react';
import {View, ToastAndroid} from 'react-native';
import {Button, Text} from 'react-native-paper';

async function readSampleData(startTime: Date) {
  await initialize();
  await requestPermission([{accessType: 'read', recordType: 'Steps'}]);
  const result = await readRecords('Steps', {
    timeRangeFilter: {
      operator: 'between',
      startTime: startTime.toISOString(),
      endTime: new Date().toISOString(),
    },
  });
  return result;
}

function RunningRoute() {
  const [startTime, setStartTime] = React.useState<Date | null>(null);
  const [steps, setSteps] = React.useState<number | null>(null);

  function startSession() {
    if (!startTime) {
      const someTimeAgo = new Date(2024, 10, 18, 2, 0, 0);
      let message = `startTime: ${someTimeAgo.toISOString()}`;
      ToastAndroid.show(message, ToastAndroid.SHORT);
      setStartTime(someTimeAgo);
    } else {
      setStartTime(null);
    }
  }

  React.useEffect(() => {
    let interval: NodeJS.Timeout;
    if (startTime) {
      interval = setInterval(async () => {
        const result = await readSampleData(startTime);
        let message = `records: ${result.records.length}`;
        ToastAndroid.show(message, ToastAndroid.SHORT);
        const totalSteps = result.records.reduce(
          (acc, record) => acc + record.count,
          0,
        );
        setSteps(totalSteps);
      }, 1000);
    }

    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [startTime]);

  return (
    <View>
      <Button mode="contained" onPress={startSession}>Start Session</Button>
      {steps !== null && <Text key="stepCounter">Steps: {steps}</Text>}
    </View>
  );
}

export default RunningRoute;
