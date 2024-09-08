import * as tf from '@tensorflow/tfjs';
import { decodeJpeg } from '@tensorflow/tfjs-react-native';
import * as ImageManipulator from 'expo-image-manipulator';
import { fetch as fetchPolyfill } from '@tensorflow/tfjs-react-native';

/**
 * Preprocesses an image to be fed into the model for prediction.
 * @param {string} uri - The URI of the image to preprocess.
 * @param {number} targetWidth - The target width to resize the image.
 * @param {number} targetHeight - The target height to resize the image.
 * @returns {tf.Tensor4D} - The preprocessed image tensor.
 */
export const preprocessImage = async (uri, targetWidth, targetHeight) => {
  // Step 1: Resize the image using expo-image-manipulator
  const manipResult = await ImageManipulator.manipulateAsync(
    uri,
    [{ resize: { width: targetWidth, height: targetHeight } }],
    { compress: 1, format: ImageManipulator.SaveFormat.PNG }
  );

  // Step 2: Load the image as a tensor
  const imageAssetPath = Image.resolveAssetSource(manipResult);
  const response = await fetchPolyfill(imageAssetPath.uri, {}, { isBinary: true });
  const imageData = await response.arrayBuffer();
  const imageTensor = decodeJpeg(new Uint8Array(imageData));

  // Step 3: Normalize the image tensor
  const normalizedImageTensor = tf.tidy(() => {
    // Reshape to the required model shape [1, targetWidth, targetHeight, 3]
    return imageTensor.expandDims(0).toFloat().div(tf.scalar(255.0));
  });

  return normalizedImageTensor;
};

/**
 * Cleans up tensor memory to avoid memory leaks.
 */
export const cleanupTensors = () => {
  tf.disposeVariables();
  tf.dispose();
};
