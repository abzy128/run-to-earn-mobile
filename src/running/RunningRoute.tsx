import {
  initialize,
  requestPermission,
  readRecords,
} from 'react-native-health-connect';
import React from 'react';
import {ToastAndroid, View} from 'react-native';
import {Button, Text} from 'react-native-paper';

function RunningRoute() {
  const [isSessionActive, setIsSessionActive] = React.useState(false);
  const [startTime, setStartTime] = React.useState<Date | null>(null);
  const [endTime, setEndTime] = React.useState<Date | null>(null);
  const [steps, setSteps] = React.useState<number | null>(null);

  async function readSampleData(start: Date) {
    await initialize();
    await requestPermission([{accessType: 'read', recordType: 'Steps'}]);
    readRecords('Steps', {
      timeRangeFilter: {
        operator: 'after',
        startTime: start.toISOString(),
      },
    }).then(({records}) => {
      let stepResult = records.reduce((acc, record) => acc + record.count, 0);
      setSteps(stepResult);
      ToastAndroid.show(`Total steps: ${stepResult}`, ToastAndroid.SHORT);
    });
  }

  function startSession() {
    setIsSessionActive(true);
    setStartTime(new Date());
    setSteps(null);
  }

  function stopSession() {
    setIsSessionActive(false);
    setEndTime(new Date());
  }

  function testSteps() {
    setStartTime(new Date(2024, 8, 20));
    readSampleData(new Date(2024, 8, 20));
  }

  React.useEffect(() => {
    let stepInterval: NodeJS.Timeout;
    let writeInterval: NodeJS.Timeout;
    if (isSessionActive) {
      stepInterval = setInterval(async () => {
        await readSampleData(startTime!);
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
  }, [isSessionActive, startTime]);

  return (
    <View>
      {!isSessionActive && (
        <Button mode="contained" onPress={testSteps}>
          Test Steps
        </Button>
      )}
      {!isSessionActive && (
        <Button mode="contained" onPress={startSession}>
          Start Session
        </Button>
      )}
      {isSessionActive && (
        <Button mode="contained" onPress={stopSession}>
          Stop Session
        </Button>
      )}
      {startTime !== null && <Text>Start Time: {startTime.toString()}</Text>}
      {endTime !== null && <Text>End Time: {endTime.toString()}</Text>}
      {steps !== null && <Text key="stepCounter">Steps: {steps}</Text>}
    </View>
  );
}

export default RunningRoute;
