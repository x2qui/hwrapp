import React, { useEffect, useState } from 'react';
import { View, ActivityIndicator, Text } from 'react-native';
import axios from 'axios';
import HandwritingCanvas from './handwritingCanvas/HandwritingCanvas';

const CanvasScreen = ({ route }) => {
  const { noteId } = route.params;
  const [note, setNote] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNote = async () => {
      try {
        // Fetch the note with all paths
        const response = await axios.get(`http://127.0.0.1:3000/notes/${noteId}`);
        setNote(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching note:', error);
        setLoading(false);
      }
    };

    fetchNote();
  }, [noteId]);

  if (loading) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }

  if (!note) {
    return <Text>Note not found</Text>;
  }

  return (
    <View style={{ flex: 1 }}>
      <HandwritingCanvas noteId={noteId} initialPaths={note.paths} />
    </View>
  );
};

export default CanvasScreen;
