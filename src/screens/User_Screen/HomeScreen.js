import React from "react";
import {
  View,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { Text, Button, Surface, useTheme } from "react-native-paper";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { StatusBar } from "expo-status-bar";
import { authService } from "../../utils/pocketbaseService";
import Header from "../../components/Header";

const HomeScreen = ({ navigation }) => {
  const theme = useTheme();
  const user = authService.getCurrentUser();

  const handleLogout = () => {
    authService.logout();
    // Navigation will be handled by the auth state listener in App.js
  };

  const navigateToScreen = (screenName) => {
    navigation.navigate(screenName);
  };

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />

      {/* Header with logo and user info */}
      <Header />

      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.title}>What would you like to do today?</Text>

        {/* Face Analysis Card */}
        <TouchableOpacity
          onPress={() => navigateToScreen("FaceAnalysis")}
          activeOpacity={0.8}
        >
          <Surface style={styles.card}>
            <View style={styles.cardContent}>
              <View
                style={[styles.iconContainer, { backgroundColor: "#ffebee" }]}
              >
                <Icon name="face-recognition" size={40} color="#c2185b" />
              </View>
              <View style={styles.cardTextContainer}>
                <Text style={styles.cardTitle}>Face Analysis</Text>
                <Text style={styles.cardDescription}>
                  Get personalized makeup recommendations based on your facial
                  features
                </Text>
              </View>
            </View>
            <Button
              mode="contained"
              onPress={() => navigateToScreen("FaceAnalysis")}
              style={[styles.cardButton, { backgroundColor: "#c2185b" }]}
              labelStyle={styles.cardButtonLabel}
            >
              Start Analysis
            </Button>
          </Surface>
        </TouchableOpacity>

        {/* Body Style Analysis Card */}
        <TouchableOpacity
          onPress={() => navigateToScreen("BodyStyleAnalysis")}
          activeOpacity={0.8}
        >
          <Surface style={styles.card}>
            <View style={styles.cardContent}>
              <View
                style={[styles.iconContainer, { backgroundColor: "#e6eefb" }]}
              >
                <Icon name="human-greeting" size={40} color="#4a6da7" />
              </View>
              <View style={styles.cardTextContainer}>
                <Text style={styles.cardTitle}>Body Style Analysis</Text>
                <Text style={styles.cardDescription}>
                  Get clothing and style recommendations based on your body
                  shape
                </Text>
              </View>
            </View>
            <Button
              mode="contained"
              onPress={() => navigateToScreen("BodyStyleAnalysis")}
              style={[styles.cardButton, { backgroundColor: "#4a6da7" }]}
              labelStyle={styles.cardButtonLabel}
            >
              Start Analysis
            </Button>
          </Surface>
        </TouchableOpacity>

        {/* App Info Section */}
        <Surface style={styles.infoCard}>
          <Text style={styles.infoTitle}>About GlamAI</Text>
          <Text style={styles.infoText}>
            GlamAI uses advanced AI technology to analyze your facial features
            and body shape to provide personalized beauty and style
            recommendations.
          </Text>
          <Text style={styles.infoText}>
            Take a photo or select one from your gallery to get started!
          </Text>
        </Surface>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingTop: 48,
    paddingBottom: 16,
    backgroundColor: "#fff",
    elevation: 2,
  },
  logo: {
    width: 80,
    height: 40,
  },
  userContainer: {
    alignItems: "flex-end",
  },
  welcomeText: {
    fontSize: 14,
    fontWeight: "500",
    marginBottom: 4,
  },
  logoutButton: {
    flexDirection: "row",
    alignItems: "center",
  },
  logoutText: {
    fontSize: 12,
    marginLeft: 4,
  },
  content: {
    padding: 16,
    paddingBottom: 32,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 24,
    textAlign: "center",
  },
  card: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    elevation: 2,
  },
  cardContent: {
    flexDirection: "row",
    marginBottom: 16,
  },
  iconContainer: {
    width: 70,
    height: 70,
    borderRadius: 35,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  cardTextContainer: {
    flex: 1,
    justifyContent: "center",
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 8,
  },
  cardDescription: {
    fontSize: 14,
    color: "#666",
    lineHeight: 20,
  },
  cardButton: {
    borderRadius: 8,
  },
  cardButtonLabel: {
    fontSize: 14,
    fontWeight: "bold",
    paddingVertical: 2,
  },
  infoCard: {
    borderRadius: 12,
    padding: 16,
    marginTop: 8,
    backgroundColor: "#fff",
    elevation: 1,
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 8,
  },
  infoText: {
    fontSize: 14,
    color: "#666",
    marginBottom: 8,
    lineHeight: 20,
  },
});

export default HomeScreen;
