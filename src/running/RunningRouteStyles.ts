import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  runningContainer: { alignItems: 'center', justifyContent: 'center', flex: 1 },
  demoContainer: { justifyContent: 'flex-end', alignItems: 'flex-end', width: '100%', padding: 5 },
  stepsContainer: {
    width: 200,
    height: 200,
    borderRadius: 100,
    borderWidth: 5,
    borderColor: 'blue',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  stepsText: { fontSize: 36 },
  button: { margin: 4 },
});
