import React, { useState, useEffect } from "react";
import { StatusBar } from "expo-status-bar";
import { StyleSheet, ActivityIndicator, View } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { Provider as PaperProvider } from "react-native-paper"; // Import PaperProvider
import GLAMAITheme from "./src/utils/Theme";

// Import your screens
import LoginScreen from "./src/screens/Authentication_Screen/LoginScreen";
import RegisterScreen from "./src/screens/Authentication_Screen/RegisterScreen";
import HomeScreen from "./src/screens/User_Screen/HomeScreen"; // Add this import
import FaceAnalysisScreen from "./src/screens/User_Screen/FaceAnalysisScreen"; // Update path if needed
import BodyStyleAnalysisScreen from "./src/screens/User_Screen/BodyStyleAnalysisScreen"; // Update path if needed

// Import auth service
import { authService, pocketbaseClient } from "./src/utils/pocketbaseService";

const Stack = createStackNavigator();

// Updated AppStack to include HomeScreen as the initial route
const AppStack = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="FaceAnalysis" component={FaceAnalysisScreen} />
      <Stack.Screen
        name="BodyStyleAnalysis"
        component={BodyStyleAnalysisScreen}
      />
    </Stack.Navigator>
  );
};

const AuthStack = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Register" component={RegisterScreen} />
    </Stack.Navigator>
  );
};

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check initial auth state when the app loads
    const checkAuth = () => {
      setIsAuthenticated(authService.isAuthenticated());
      setIsLoading(false);
    };

    checkAuth();

    // Listen for auth changes (optional but recommended)
    const unsubscribe = pocketbaseClient.authStore.onChange((token, model) => {
      console.log("Auth changed:", !!model);
      setIsAuthenticated(!!model); // Update state based on whether a user model exists
    }, true); // 'true' calls the listener immediately with the current state

    // Cleanup listener on unmount
    return () => unsubscribe();
  }, []);

  if (isLoading) {
    // Show a loading indicator while checking auth state
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <PaperProvider theme={GLAMAITheme}>
      <NavigationContainer>
        {isAuthenticated ? <AppStack /> : <AuthStack />}
        <StatusBar style="auto" />
      </NavigationContainer>
    </PaperProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  loaderContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
