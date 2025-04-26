import React from "react";
import { View, StyleSheet } from "react-native";
import { Text, Surface } from "react-native-paper";

const TutorialStep = ({ step, instruction }) => {
  return (
    <Surface style={styles.container}>
      <View style={styles.stepContainer}>
        <Text style={styles.stepNumber}>{step}</Text>
      </View>
      <View style={styles.instructionContainer}>
        <Text style={styles.instruction}>{instruction}</Text>
      </View>
    </Surface>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    borderRadius: 12,
    overflow: "hidden",
    elevation: 1,
  },
  stepContainer: {
    width: 40,
    backgroundColor: "#c2185b",
    justifyContent: "center",
    alignItems: "center",
    padding: 8,
  },
  stepNumber: {
    color: "white",
    fontWeight: "bold",
    fontSize: 18,
  },
  instructionContainer: {
    flex: 1,
    padding: 12,
  },
  instruction: {
    fontSize: 15,
    lineHeight: 22,
  },
});

export default TutorialStep;
