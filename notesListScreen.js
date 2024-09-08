import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, FlatList, TouchableOpacity, Modal, Pressable, Alert } from 'react-native';
import axios from 'axios';
import { Ionicons } from '@expo/vector-icons'; 
import styles from './Styles';

const NotesListScreen = ({ navigation }) => {
  const [notes, setNotes] = useState([]);
  const [filteredNotes, setFilteredNotes] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [noteSubject, setNoteSubject] = useState('');

  useEffect(() => {
    fetchNotes();
  }, []);

  const fetchNotes = async () => {
    try {
      const response = await axios.get('http://127.0.0.1:3000/notes');
      setNotes(response.data);
      setFilteredNotes(response.data); // Initially, all notes are shown
    } catch (error) {
      console.error('Error fetching notes:', error);
    }
  };

  const addNote = async () => {
    try {
      const response = await axios.post('http://127.0.0.1:3000/notes', { subject: noteSubject });
      setNotes([...notes, response.data]);
      setFilteredNotes([...notes, response.data]); // Update filtered notes as well
      setModalVisible(false);
      setNoteSubject('');
    } catch (error) {
      console.error('Error adding note:', error);
    }
  };

  const deleteNote = async (noteId) => {
    try {
      await axios.delete(`http://127.0.0.1:3000/notes/${noteId}`);
      setNotes(notes.filter(note => note._id !== noteId));
      setFilteredNotes(filteredNotes.filter(note => note._id !== noteId)); // Update filtered notes
    } catch (error) {
      console.error('Error deleting note:', error);
    }
  };

  const confirmDelete = (noteId) => {
    Alert.alert(
      "Delete Note",
      "Are you sure you want to delete this note?",
      [
        { text: "Cancel", style: "cancel" },
        { text: "OK", onPress: () => deleteNote(noteId) }
      ]
    );
  };

  const handleSearch = (query) => {
    setSearchQuery(query);
    if (query.trim() === '') {
      setFilteredNotes(notes); // Reset to all notes if the search query is empty
    } else {
      const filtered = notes.filter(note => 
        note.subject.toLowerCase().includes(query.toLowerCase()) ||
        (note.recognizedText && note.recognizedText.toLowerCase().includes(query.toLowerCase())) // Include recognizedText in the search
      );
      setFilteredNotes(filtered);
    }
  };
  

  const renderHighlightedText = (text, query) => {
    if (!query) return <Text style={styles.noteText}>{text}</Text>;

    const parts = text.split(new RegExp(`(${query})`, 'gi'));
    return (
      <Text style={styles.noteText}>
        {parts.map((part, index) => 
          part.toLowerCase() === query.toLowerCase() ? (
            <Text key={index} style={styles.highlightText}>{part}</Text>
          ) : (
            part
          )
        )}
      </Text>
    );
  };

  const renderItem = ({ item }) => (
    <View style={styles.noteItemContainer}>
      <TouchableOpacity
        style={styles.noteItem}
        onPress={() => navigation.navigate('Canvas', { noteId: item._id })}
      >
        <Text>{renderHighlightedText(item.subject, searchQuery)}</Text>
        {item.recognizedText && <Text>{renderHighlightedText(item.recognizedText, searchQuery)}</Text>}
      </TouchableOpacity>
      <TouchableOpacity onPress={() => confirmDelete(item._id)} style={styles.deleteIcon}>
        <Ionicons name="trash-outline" size={20} color="#00b894" />
      </TouchableOpacity>
    </View>
  );
  

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Text style={styles.title}>Notes</Text>
          <TouchableOpacity style={styles.addButton} onPress={() => setModalVisible(true)}>
            <Text style={styles.addButtonText}>+</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.headerRight}>
          <TouchableOpacity>
            <Ionicons name="notifications-outline" size={24} color="black" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconSpacing}>
            <Ionicons name="settings-outline" size={24} color="black" />
          </TouchableOpacity>
        </View>
      </View>
      <TextInput
        style={styles.searchBar}
        placeholder="Search"
        value={searchQuery}
        onChangeText={handleSearch}
      />
      <FlatList data={filteredNotes} renderItem={renderItem} keyExtractor={(item) => item._id} />

      {/* Modal for adding a new note */}
      <Modal animationType="slide" transparent={true} visible={modalVisible} onRequestClose={() => setModalVisible(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalView}>
            <Text style={styles.modalTitle}>What Subject is this note for?</Text>
            <TextInput
              style={styles.modalInput}
              placeholder="Insert your title here"
              value={noteSubject}
              onChangeText={setNoteSubject}
            />
            <View style={styles.modalButtonContainer}>
              <Pressable style={styles.discardButton} onPress={() => setModalVisible(false)}>
                <Text style={styles.discardButtonText}>Discard</Text>
              </Pressable>
              <Pressable style={styles.createButton} onPress={addNote}>
                <Text style={styles.createButtonText}>Create</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default NotesListScreen;
