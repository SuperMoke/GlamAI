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
import { analyzeFaceWithAI } from "../../utils/aiService";
import { useWindowDimensions } from "react-native";
import { StatusBar } from "react-native";
import ProductSuggestion from "../../components/ProductSuggestion";
import TutorialStep from "../../components/TutorialStep";
import Header from "../../components/Header";

const FaceAnalysisScreen = () => {
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
        aspect: [3, 4],
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
      const analysisResults = await analyzeFaceWithAI(image.base64);
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
        <Text style={styles.title}>GlamAI Face Analysis</Text>

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
              <Icon name="face-recognition" size={80} color="#c5c5c5" />
              <Text style={styles.placeholderText}>
                Select or capture an image
              </Text>
            </View>
          )}

          <View style={styles.imageButtonContainer}>
            <Button
              mode="contained"
              onPress={() => selectImage(false)}
              icon="image"
              style={styles.imageButton}
            >
              Gallery
            </Button>
            <Button
              mode="contained"
              onPress={() => selectImage(true)}
              icon="camera"
              style={styles.imageButton}
            >
              Camera
            </Button>
          </View>

          <Button
            mode="contained"
            onPress={analyzeImage}
            disabled={!image || loading}
            icon="face-recognition"
            style={styles.analyzeButton}
          >
            Analyze Face
          </Button>
        </View>

        {/* Loading Indicator */}
        {loading && (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={MD3Colors.primary60} />
            <Text style={styles.loadingText}>
              Analyzing your image with AI...
            </Text>
          </View>
        )}

        {/* Results Section */}
        {results && (
          <View style={styles.resultsContainer}>
            <Card style={styles.card}>
              <Card.Title
                title="Face Analysis"
                left={(props) => <Icon {...props} name="face-scan" size={24} />}
              />
              <Card.Content>
                <Text style={styles.analysisText}>{results.faceAnalysis}</Text>
              </Card.Content>
            </Card>

            <Card style={styles.card}>
              <Card.Title
                title="Product Suggestions"
                left={(props) => <Icon {...props} name="shopping" size={24} />}
              />
              <Card.Content>
                <View style={styles.productContainer}>
                  {results.productSuggestions.map((product, index) => (
                    <ProductSuggestion key={index} product={product} />
                  ))}
                </View>
              </Card.Content>
            </Card>

            <Card style={styles.card}>
              <Card.Title
                title="Application Tips"
                left={(props) => <Icon {...props} name="brush" size={24} />}
              />
              <Card.Content>
                <View style={styles.tutorialContainer}>
                  {results.applicationTips.map((tip, index) => (
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
  // Styles remain unchanged
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
  },
  imageContainer: {
    alignItems: "center",
    marginBottom: 20,
  },
  image: {
    height: 300,
    borderRadius: 12,
  },
  placeholderImage: {
    height: 300,
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
  },
  resultsContainer: {
    marginTop: 16,
  },
  card: {
    marginBottom: 16,
    elevation: 2,
  },
  analysisText: {
    fontSize: 16,
    lineHeight: 24,
  },
  productContainer: {
    gap: 12,
  },
  tutorialContainer: {
    gap: 16,
  },
});

export default FaceAnalysisScreen;
