import {
  initialize,
  requestPermission,
  readRecords,
} from 'react-native-health-connect';
import React from 'react';
import {View, Alert} from 'react-native';
import {Button, Text} from 'react-native-paper';
import {UpdateEndLocation, UpdateStartLocation} from '../map/MapPins';
import './RunningRouteStyles.ts';
import {styles} from './RunningRouteStyles.ts';

export let stepStatus = false;
export let globalSteps = 0;

function RunningRoute() {
  const [isSessionActive, setIsSessionActive] = React.useState(false);
  const [startTime, setStartTime] = React.useState<Date | null>(null);
  const [endTime, setEndTime] = React.useState<Date | null>(null);
  const [steps, setSteps] = React.useState<number | null>(null);
  const [totalCalories, setTotalCalories] = React.useState<number | null>(null);
  const [distance, setDistance] = React.useState<number | null>(null);

  async function readSampleData(start: Date) {
    await initialize();
    await requestPermission([
      {accessType: 'read', recordType: 'Steps'},
      {accessType: 'read', recordType: 'TotalCaloriesBurned'},
      {accessType: 'read', recordType: 'Distance'},
    ]);

    readRecords('Steps', {
      timeRangeFilter: {
        operator: 'after',
        startTime: start.toISOString(),
      },
    }).then(({records}) => {
      let result = records.reduce((acc, record) => acc + record.count, 0);
      setSteps(result);
    });

    readRecords('TotalCaloriesBurned', {
      timeRangeFilter: {
        operator: 'after',
        startTime: start.toISOString(),
      },
    }).then(({records}) => {
      let result = records.reduce(
        (acc, record) => acc + record.energy.inKilocalories,
        0,
      );
      setTotalCalories(result);
    });

    readRecords('Distance', {
      timeRangeFilter: {
        operator: 'after',
        startTime: start.toISOString(),
      },
    }).then(({records}) => {
      let result = records.reduce(
        (acc, record) => acc + record.distance.inMeters,
        0,
      );
      setDistance(result);
    });
  }

  function startSession() {
    if (promptRecordErase() === false) {
      return;
    }
    setIsSessionActive(true);
    setStartTime(new Date());
    setSteps(null);
    UpdateStartLocation();
  }

  function stopSession() {
    setIsSessionActive(false);
    setEndTime(new Date());
    UpdateEndLocation();
  }

  function testSteps() {
    if (promptRecordErase() === false) {
      return;
    }
    setIsSessionActive(true);
    setStartTime(new Date(2024, 8, 20));
    readSampleData(new Date(2024, 8, 20));
  }

  function promptRecordErase(): boolean {
    let allowRecording: boolean = true;
    if (steps !== null && !isSessionActive) {
      Alert.alert(
        'Steps are recorded',
        'Starting new session removes current record. Do you want to start a new session?',
        [
          {
            text: 'No',
            onPress: () => {
              allowRecording = false;
            },
            style: 'cancel',
          },
          {
            text: 'Yes',
            onPress: () => {
              allowRecording = true;
            },
            style: 'destructive',
          },
        ],
      );
    }
    return allowRecording;
  }

  React.useEffect(() => {
    globalSteps = steps || 0;
    stepStatus = isSessionActive;
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
  }, [isSessionActive, startTime, steps]);

  return (
    <View style={styles.runningContainer}>
      <View style={styles.runningContainer}>
        {steps !== null && (
          <View style={styles.stepsContainer}>
            <Text style={styles.stepsText}>{steps}</Text>
            <Text>Steps</Text>
          </View>
        )}
        {!isSessionActive && (
          <Button mode="contained" style={styles.button} onPress={startSession}>
            Start Session
          </Button>
        )}
        {isSessionActive && (
          <Button mode="contained" style={styles.button} onPress={stopSession}>
            Stop Session
          </Button>
        )}
        {startTime !== null && (
          <Text>Start Time: {startTime.toLocaleString()}</Text>
        )}
        {endTime !== null && <Text>End Time: {endTime.toLocaleString()}</Text>}
        {totalCalories !== null && (
          <Text key="caloriesCounter">
            Calories: {totalCalories.toFixed(0)}
          </Text>
        )}
        {distance !== null && (
          <Text key="distanceCounter">
            Distance: {distance.toFixed(0)} meters
          </Text>
        )}
      </View>
      <View style={styles.demoContainer}>
        {!isSessionActive && (
          <Button mode="contained" style={styles.button} onPress={testSteps}>
            Demo
          </Button>
        )}
      </View>
    </View>
  );
}

export default RunningRoute;
