import * as tf from '@tensorflow/tfjs';
import '@tensorflow/tfjs-react-native';

// Load TensorFlow.js model from a local file or URL
export const loadModel = async (modelPath) => {
  await tf.ready(); // Ensure TensorFlow.js is ready
  return await tf.loadGraphModel(modelPath);
};
