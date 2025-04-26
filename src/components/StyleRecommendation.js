import React from "react";
import { View, StyleSheet, TouchableOpacity, Linking } from "react-native";
import { Text, Surface } from "react-native-paper";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";

const StyleRecommendation = ({ item }) => {
  const handleViewExample = () => {
    if (item.exampleUrl) {
      Linking.openURL(item.exampleUrl).catch((err) =>
        console.error("Failed to open URL:", err)
      );
    }
  };

  // Map item types to appropriate icons
  const getIconName = (itemType) => {
    const typeMap = {
      Top: "tshirt-crew",
      Tops: "tshirt-crew",
      Bottoms: "pants",
      Dress: "dress",
      Dresses: "dress",
      Outerwear: "coat",
      Jacket: "coat",
      Accessory: "necklace",
      Accessories: "necklace",
      Shoes: "shoe-heel",
      Footwear: "shoe-heel",
      Suit: "tuxedo",
      Hat: "hat-fedora",
      default: "hanger",
    };

    return typeMap[itemType] || typeMap.default;
  };

  return (
    <Surface style={styles.container}>
      <View style={styles.content}>
        <View style={styles.iconContainer}>
          <Icon name={getIconName(item.itemType)} size={24} color="#4a6da7" />
        </View>
        <View style={styles.textContainer}>
          <Text style={styles.itemType}>{item.itemType}</Text>
          <Text style={styles.itemDescription}>{item.itemDescription}</Text>
          <Text style={styles.rationale}>{item.stylingRationale}</Text>
          {item.potentialColors && (
            <Text style={styles.colors}>
              <Text style={styles.colorsLabel}>Suggested colors: </Text>
              {item.potentialColors}
            </Text>
          )}
        </View>
      </View>

      {item.exampleUrl && (
        <TouchableOpacity style={styles.viewButton} onPress={handleViewExample}>
          <Text style={styles.viewButtonText}>View Example</Text>
          <Icon name="arrow-right" size={16} color="#fff" />
        </TouchableOpacity>
      )}
    </Surface>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 12,
    padding: 12,
    elevation: 1,
    marginBottom: 12,
  },
  content: {
    flexDirection: "row",
    alignItems: "flex-start",
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#e6eefb",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  textContainer: {
    flex: 1,
  },
  itemType: {
    fontSize: 12,
    color: "#888",
  },
  itemDescription: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 2,
  },
  rationale: {
    fontSize: 14,
    color: "#555",
    marginBottom: 4,
  },
  colors: {
    fontSize: 14,
    color: "#555",
  },
  colorsLabel: {
    fontWeight: "500",
  },
  viewButton: {
    marginTop: 12,
    backgroundColor: "#4a6da7",
    borderRadius: 8,
    paddingVertical: 6,
    paddingHorizontal: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "flex-end",
  },
  viewButtonText: {
    color: "#fff",
    fontWeight: "bold",
    marginRight: 4,
  },
});

export default StyleRecommendation;
