import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, Modal } from 'react-native';

interface CategoryPickerProps {
    categories: string[];
    onCategorySelect: (category: string) => void;
    initialCategory?: string;
}

const CategoryPicker: React.FC<CategoryPickerProps> = ({ categories, onCategorySelect, initialCategory }) => {
    const [selectedCategory, setSelectedCategory] = useState(initialCategory || categories[0]);
    const [modalVisible, setModalVisible] = useState(false);

    const handleCategoryPress = (category: string) => {
        setSelectedCategory(category);
        onCategorySelect(category);
        setModalVisible(false);
    };

    return (
        <View style={styles.container}>
            <TouchableOpacity style={styles.selectedCategory} onPress={() => setModalVisible(true)}>
                <Text>{selectedCategory}</Text>
            </TouchableOpacity>

            <Modal
                animationType="fade"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => {
                    setModalVisible(false);
                }}
            >
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <FlatList
                            data={categories}
                            keyExtractor={(item) => item}
                            renderItem={({ item }) => (
                                <TouchableOpacity style={styles.categoryItem} onPress={() => handleCategoryPress(item)}>
                                    <Text>{item}</Text>
                                </TouchableOpacity>
                            )}
                        />
                        <TouchableOpacity style={styles.closeButton} onPress={() => setModalVisible(false)}>
                            <Text style={styles.closeButtonText}>Close</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
        marginBottom: 10,
        padding: 10,
    },
    selectedCategory: {
        // Style for the currently selected category display
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContent: {
        backgroundColor: 'white',
        padding: 20,
        borderRadius: 10,
        width: '80%',
    },
    categoryItem: {
        padding: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
    },
    closeButton: {
        marginTop: 20,
        alignItems: 'center',
    },
    closeButtonText: {
        color: 'blue',
        fontSize: 16,
    },
});

export default CategoryPicker;