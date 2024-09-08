const [searchResults, setSearchResults] = useState([]);

const handleSearch = (query) => {
    const results = searchInDatabase(query);
    setSearchResults(results);
};

return (
    <View>
        <TextInput 
            placeholder="Search..."
            onChangeText={handleSearch}
        />
        <FlatList
            data={searchResults}
            renderItem={({ item }) => (
                <Text>{item.text} - {item.associatedData.timestamp.toLocaleString()}</Text>
            )}
            keyExtractor={(item, index) => index.toString()}
        />
    </View>
);
