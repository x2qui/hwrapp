import * as tflite from '@tensorflow/tfjs-tflite';
import { Alert } from 'react-native';
import * as tf from '@tensorflow/tfjs';  
import { decodePredictions } from './predictionDecoder'; 

let iamModel = null;
let mnistModel = null;

const loadModels = async () => {
    try {
        iamModel = await tflite.loadTFLiteModel('iam_cnn_model.tflite');
        mnistModel = await tflite.loadTFLiteModel('mnist_cnn_model.tflite');
    } catch (error) {
        console.error("Error loading models:", error);
        Alert.alert("Model Loading Error", "There was an error loading the models.");
    }
};

const preprocess = (pixelData) => {
    
    let imageTensor = tf.browser.fromPixels(pixelData, 1);  
    imageTensor = tf.image.resizeBilinear(imageTensor, [28, 28]);  
    imageTensor = imageTensor.expandDims(0);  
    imageTensor = tf.div(imageTensor, 255.0);  

    return imageTensor;
};

const interpretPrediction = (iamPrediction, mnistPrediction) => {
    
    const iamText = decodePredictions(iamPrediction, 'IAM');
    const mnistText = decodePredictions(mnistPrediction, 'MNIST');
    const finalText = `${iamText} ${mnistText}`; 

    return finalText;
};

const handleCanvasSave = async () => {
    try {
        const canvas = canvasRef.current;
        const pixelData = canvas.toDataURL();  
        const preprocessedData = preprocess(pixelData);

        if (!iamModel || !mnistModel) {
            await loadModels();
        }

        const iamPrediction = iamModel.predict(preprocessedData);
        const mnistPrediction = mnistModel.predict(preprocessedData);

        const predictedText = interpretPrediction(iamPrediction, mnistPrediction);

        console.log("Predicted Text:", predictedText);
        
    } catch (error) {
        console.error("Error during prediction:", error);
        Alert.alert("Prediction Error", "There was an error during the prediction process.");
    }
};


loadModels();
