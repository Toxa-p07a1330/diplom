import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import SocketDataDisplayer from "./components/SocketDataDisplayer";

export default function App() {
  return (
    <View style={styles.container}>
      <Text>Terminal emulation for jTMS testing</Text>
      <SocketDataDisplayer/>
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
