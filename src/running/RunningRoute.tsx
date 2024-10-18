import {
  initialize,
  requestPermission,
  readRecords,
  insertRecords,
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
  console.log('readSampleData', result);
  return result;
}

async function writeRecords(steps: number) {
  await initialize();
  await requestPermission([{accessType: 'write', recordType: 'Steps'}]);

  const writeResult = await insertRecords([
    {
      recordType: 'Steps',
      count: steps,
      startTime: new Date().toISOString(),
      endTime: new Date().toISOString(),
    },
  ]);
  return writeResult;
}

function RunningRoute() {
  const [startTime, setStartTime] = React.useState<Date | null>(null);
  const [steps, setSteps] = React.useState<number | null>(null);
  const [isWriteSteps, setIsWriteSteps] = React.useState(false);

  function startSession() {
    if (!startTime) {
      const someTimeAgo = new Date(2024, 9, 19);
      let message = `startTime: ${someTimeAgo.toISOString()}`;
      ToastAndroid.show(message, ToastAndroid.SHORT);
      setStartTime(someTimeAgo);
    } else {
      setStartTime(null);
    }
  }
  function writeSteps() {
    isWriteSteps ? setIsWriteSteps(false) : setIsWriteSteps(true);
  }

  React.useEffect(() => {
    let stepInterval: NodeJS.Timeout;
    let writeInterval: NodeJS.Timeout;
    if (startTime) {
      stepInterval = setInterval(async () => {
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
    if (isWriteSteps) {
      writeInterval = setInterval(async () => {
        const result = await writeRecords(1);
        let message = `writeResult: ${result}`;
        ToastAndroid.show(message, ToastAndroid.SHORT);
      }, 1000);
    }

    return () => {
      if (stepInterval) {
        clearInterval(stepInterval);
      }
      if (writeInterval) {
        clearInterval(writeInterval);
      }
    };
  }, [startTime, isWriteSteps]);

  return (
    <View>
      <Button mode="contained" onPress={writeSteps}>
        Test Write
      </Button>
      <Button mode="contained" onPress={startSession}>
        Start Session
      </Button>
      <Text>Step Data: </Text>
      {steps !== null && <Text key="stepCounter">Steps: {steps}</Text>}
    </View>
  );
}

export default RunningRoute;
