import React from "react";
import { View, StyleSheet, TouchableOpacity, Linking } from "react-native";
import { Text, Surface } from "react-native-paper";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";

const ProductSuggestion = ({ product }) => {
  const handleBuyNow = () => {
    if (product.url) {
      Linking.openURL(product.url).catch((err) =>
        console.error("Failed to open URL:", err)
      );
    }
  };

  return (
    <Surface style={styles.container}>
      <View style={styles.content}>
        <View style={styles.iconContainer}>
          <Icon
            name={
              product.category === "Foundation"
                ? "face-powder"
                : product.category === "Lipstick"
                ? "lipstick"
                : product.category === "Eyeshadow"
                ? "eye"
                : "makeup"
            }
            size={24}
            color="#a55"
          />
        </View>
        <View style={styles.textContainer}>
          <Text style={styles.category}>{product.category}</Text>
          <Text style={styles.name}>{product.name}</Text>
          <Text style={styles.description}>{product.description}</Text>
        </View>
      </View>

      {product.url && (
        <TouchableOpacity style={styles.buyButton} onPress={handleBuyNow}>
          <Text style={styles.buyButtonText}>Buy Now</Text>
          <Icon name="cart" size={16} color="#fff" />
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
  },
  content: {
    flexDirection: "row",
    alignItems: "center",
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#ffebee",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  textContainer: {
    flex: 1,
  },
  category: {
    fontSize: 12,
    color: "#888",
  },
  name: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 2,
  },
  description: {
    fontSize: 14,
    color: "#555",
  },
  buyButton: {
    marginTop: 12,
    backgroundColor: "#c2185b",
    borderRadius: 8,
    paddingVertical: 6,
    paddingHorizontal: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "flex-end",
  },
  buyButtonText: {
    color: "#fff",
    fontWeight: "bold",
    marginRight: 4,
  },
});

export default ProductSuggestion;
