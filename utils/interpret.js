
import * as tf from '@tensorflow/tfjs';


export const interpretPrediction = (prediction) => {
  const result = prediction.argMax(-1).dataSync(); // Get index of max probability
  return result[0]; // Return the predicted digit
};
