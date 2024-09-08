import React, { useRef, useState, useEffect } from 'react';
import { View, Button, StyleSheet, PanResponder, Alert } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import axios from 'axios';
import { captureRef } from 'react-native-view-shot';  // For capturing SVG as image

const HandwritingCanvas = ({ noteId, initialPaths }) => {
  const [paths, setPaths] = useState(initialPaths || []);
  const currentPath = useRef('');
  const svgRef = useRef(null);  // Reference to the SVG component

  useEffect(() => {
    setPaths(initialPaths || []);
  }, [initialPaths]);

  useEffect(() => {
    if (paths.length > 0) {
      savePathsToDatabase(paths, noteId);
    }
  }, [paths]);

  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: () => true,
      onPanResponderGrant: (event) => {
        const { locationX, locationY } = event.nativeEvent;
        currentPath.current = `M${locationX},${locationY}`;
      },
      onPanResponderMove: (event) => {
        const { locationX, locationY } = event.nativeEvent;
        currentPath.current += ` L${locationX},${locationY}`;
      },
      onPanResponderRelease: () => {
        const newPath = currentPath.current;
        setPaths((prevPaths) => [...prevPaths, newPath]);
        currentPath.current = '';
      },
    })
  ).current;

  const savePathsToDatabase = async (updatedPaths, noteId) => {
    try {
      await axios.post(`http://127.0.0.1:3000/notes/${noteId}/savePaths`, { paths: updatedPaths });
    } catch (error) {
      console.error('Error saving paths:', error);
    }
  };

  const clearCanvas = async () => {
    setPaths([]);
    await clearPathsInDatabase(noteId);
  };

  const clearPathsInDatabase = async (noteId) => {
    try {
      await axios.post(`http://127.0.0.1:3000/notes/${noteId}/clearPaths`);
    } catch (error) {
      console.error('Error clearing paths:', error);
    }
  };

  const recognizeHandwriting = async () => {
    try {
      const uri = await captureRef(svgRef, {
        format: 'png',
        quality: 0.8,
        result: 'tmpfile', // Use 'tmpfile' for temporary storage (iOS) or 'base64' if you need the base64 string
      });
  
      const formData = new FormData();
      formData.append('file', {
        uri: uri,
        type: 'image/png',
        name: 'image.png'
      });
  
      const response = await axios.post('http://127.0.0.1:5000/predict', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
  
      Alert.alert('Recognized Text', response.data.text);
    } catch (error) {
      console.error('Error recognizing handwriting:', error.response?.data || error.message);
      Alert.alert('Error', 'Failed to recognize handwriting. Please try again.');
    }
  };
  

  return (
    <View style={styles.container}>
      <Svg style={styles.canvas} ref={svgRef}>
        {paths.map((path, index) => (
          <Path key={index} d={path} stroke="black" strokeWidth="3" fill="none" />
        ))}
      </Svg>
      <View style={styles.touchableArea} {...panResponder.panHandlers} />
      <View style={styles.buttonContainer}>
        <Button title="Clear Canvas" onPress={clearCanvas} />
        <Button title="Recognize Handwriting" onPress={recognizeHandwriting} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  canvas: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  touchableArea: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  buttonContainer: {
    position: 'absolute',
    bottom: 20,
    left: 0,
    right: 0,
    alignItems: 'center',
  },
});

export default HandwritingCanvas;
