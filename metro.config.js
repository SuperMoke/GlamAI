// Learn more https://docs.expo.dev/guides/customizing-metro
const { getDefaultConfig } = require("expo/metro-config");

/** @type {import('expo/metro-config').MetroConfig} */
const config = getDefaultConfig(__dirname);

// Add 'glb' and 'gltf' to asset extensions
config.resolver.assetExts = config.resolver.assetExts
  ? [...config.resolver.assetExts, "glb", "gltf"].filter(
      (ext, index, self) => self.indexOf(ext) === index
    ) // Add and ensure unique
  : ["glb", "gltf"]; // Or initialize if somehow undefined

module.exports = config;
