import React, { useState, useEffect } from "react";
import {
  View,
  ScrollView,
  Image,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  Alert,
  Platform,
} from "react-native";
import { Text, Button, Card, Divider, MD3Colors } from "react-native-paper";
import * as ImagePicker from "expo-image-picker";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { analyzeBodyStyleWithAI } from "../../utils/aiService";
import { useWindowDimensions } from "react-native";
import { StatusBar } from "react-native";
import StyleRecommendation from "../../components/StyleRecommendation";
import TutorialStep from "../../components/TutorialStep";
import Header from "../../components/Header";

const BodyStyleAnalysisScreen = () => {
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState(null);
  const { width } = useWindowDimensions();
  const [hasPermission, setHasPermission] = useState(false);

  useEffect(() => {
    requestPermissions();
  }, []);

  const requestPermissions = async () => {
    if (Platform.OS !== "web") {
      const { status: cameraStatus } =
        await ImagePicker.requestCameraPermissionsAsync();
      const { status: libraryStatus } =
        await ImagePicker.requestMediaLibraryPermissionsAsync();

      if (cameraStatus === "granted" && libraryStatus === "granted") {
        setHasPermission(true);
      } else {
        Alert.alert(
          "Permissions Required",
          "Camera and media library permissions are required to use this feature.",
          [{ text: "OK" }]
        );
      }
    }
  };

  const selectImage = async (useCamera = false) => {
    try {
      let result;
      const options = {
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [3, 5],
        quality: 0.8,
        base64: true,
      };

      if (useCamera) {
        result = await ImagePicker.launchCameraAsync(options);
      } else {
        result = await ImagePicker.launchImageLibraryAsync(options);
      }

      console.log("Image picker result:", result);

      if (!result.canceled && result.assets && result.assets.length > 0) {
        const selectedAsset = result.assets[0];

        // If base64 isn't included in the result, we need to get it separately
        let base64Image = selectedAsset.base64;
        if (!base64Image) {
          // For Expo, you might need to handle getting base64 data differently
          // This is a simplified approach and might need adjustment
          const response = await fetch(selectedAsset.uri);
          const blob = await response.blob();
          const reader = new FileReader();
          reader.readAsDataURL(blob);
          base64Image = await new Promise((resolve) => {
            reader.onloadend = () => {
              // Remove data:image/jpeg;base64, prefix
              const base64Data = reader.result.split(",")[1];
              resolve(base64Data);
            };
          });
        }

        setImage({
          uri: selectedAsset.uri,
          base64: base64Image,
          width: selectedAsset.width,
          height: selectedAsset.height,
        });

        setResults(null); // Clear previous results
      }
    } catch (error) {
      console.error("Image selection error:", error);
      Alert.alert(
        "Error",
        `Failed to select image: ${error.message || "Unknown error"}`,
        [{ text: "OK" }]
      );
    }
  };

  const analyzeImage = async () => {
    if (!image) {
      Alert.alert("Error", "Please select an image first");
      return;
    }

    setLoading(true);
    try {
      const analysisResults = await analyzeBodyStyleWithAI(image.base64);
      setResults(analysisResults);
    } catch (error) {
      console.error("Analysis error:", error);
      Alert.alert("Error", "Failed to analyze image. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Header />

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.title}>StyleSavvy AI Analysis</Text>

        {/* Image Selection Area */}
        <View style={styles.imageContainer}>
          {image ? (
            <Image
              source={{ uri: image.uri }}
              style={[styles.image, { width: width * 0.8 }]}
              resizeMode="cover"
            />
          ) : (
            <View style={[styles.placeholderImage, { width: width * 0.8 }]}>
              <Icon name="human-greeting" size={80} color="#c5c5c5" />
              <Text style={styles.placeholderText}>
                Select or capture a full-body image
              </Text>
            </View>
          )}

          <View style={styles.imageButtonContainer}>
            <Button
              mode="contained"
              onPress={() => selectImage(false)}
              icon="image"
              style={styles.imageButton}
              buttonColor="#4a6da7"
            >
              Gallery
            </Button>
            <Button
              mode="contained"
              onPress={() => selectImage(true)}
              icon="camera"
              style={styles.imageButton}
              buttonColor="#4a6da7"
            >
              Camera
            </Button>
          </View>

          <Button
            mode="contained"
            onPress={analyzeImage}
            disabled={!image || loading}
            icon="tshirt-crew"
            style={styles.analyzeButton}
            buttonColor="#4a6da7"
          >
            Analyze Style
          </Button>
        </View>

        {/* Loading Indicator */}
        {loading && (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#4a6da7" />
            <Text style={styles.loadingText}>
              Analyzing your body style with AI...
            </Text>
          </View>
        )}

        {/* Results Section */}
        {results && (
          <View style={styles.resultsContainer}>
            <Card style={styles.card}>
              <Card.Title
                title="Body Analysis"
                left={(props) => (
                  <Icon
                    {...props}
                    name="human-greeting"
                    size={24}
                    color="#4a6da7"
                  />
                )}
              />
              <Card.Content>
                <Text style={styles.analysisText}>
                  {results.bodyAnalysisSummary}
                </Text>
              </Card.Content>
            </Card>

            <Card style={styles.card}>
              <Card.Title
                title="Style Recommendations"
                left={(props) => (
                  <Icon {...props} name="hanger" size={24} color="#4a6da7" />
                )}
              />
              <Card.Content>
                <View style={styles.recommendationsContainer}>
                  {results.styleRecommendations.map((item, index) => (
                    <StyleRecommendation key={index} item={item} />
                  ))}
                </View>
              </Card.Content>
            </Card>

            <Card style={styles.card}>
              <Card.Title
                title="Styling Tips"
                left={(props) => (
                  <Icon
                    {...props}
                    name="lightbulb-outline"
                    size={24}
                    color="#4a6da7"
                  />
                )}
              />
              <Card.Content>
                <View style={styles.tipsContainer}>
                  {results.generalStylingTips.map((tip, index) => (
                    <TutorialStep
                      key={index}
                      step={index + 1}
                      instruction={tip}
                    />
                  ))}
                </View>
              </Card.Content>
            </Card>
          </View>
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 30,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 16,
    textAlign: "center",
    color: "#4a6da7",
  },
  imageContainer: {
    alignItems: "center",
    marginBottom: 20,
  },
  image: {
    height: 400, // Taller than face analysis to show full body
    borderRadius: 12,
  },
  placeholderImage: {
    height: 400, // Taller than face analysis to show full body
    borderRadius: 12,
    backgroundColor: "#e0e0e0",
    justifyContent: "center",
    alignItems: "center",
  },
  placeholderText: {
    marginTop: 8,
    color: "#888",
  },
  imageButtonContainer: {
    flexDirection: "row",
    marginTop: 12,
  },
  imageButton: {
    marginHorizontal: 8,
  },
  analyzeButton: {
    marginTop: 16,
    paddingHorizontal: 24,
  },
  loadingContainer: {
    alignItems: "center",
    marginVertical: 24,
  },
  loadingText: {
    marginTop: 8,
    fontSize: 16,
    color: "#4a6da7",
  },
  resultsContainer: {
    marginTop: 16,
  },
  card: {
    marginBottom: 16,
    elevation: 2,
    borderRadius: 12,
  },
  analysisText: {
    fontSize: 16,
    lineHeight: 24,
    color: "#333",
  },
  recommendationsContainer: {
    gap: 12,
  },
  tipsContainer: {
    gap: 16,
  },
});

export default BodyStyleAnalysisScreen;
