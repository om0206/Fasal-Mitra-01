import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { MaterialCommunityIcons } from '@expo/vector-icons';

interface InputFormProps {
  crops: string[];
  onSubmit: (cropType: string, growthStage: string) => void;
  loading: boolean;
}

const GROWTH_STAGES = [
  'seedling',
  'vegetative',
  'flowering',
  'fruiting',
  'maturation',
];

export const InputForm: React.FC<InputFormProps> = ({ crops, onSubmit, loading }) => {
  const [selectedCrop, setSelectedCrop] = useState<string>(crops[0] || '');
  const [selectedStage, setSelectedStage] = useState<string>('vegetative');

  useEffect(() => {
    if (crops.length > 0 && !selectedCrop) {
      setSelectedCrop(crops[0]);
    }
  }, [crops]);

  const handleSubmit = () => {
    if (selectedCrop && selectedStage) {
      onSubmit(selectedCrop, selectedStage);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.section}>
        <Text style={styles.label}>Select Crop Type</Text>
        {crops.length > 0 ? (
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={selectedCrop}
              onValueChange={(itemValue) => setSelectedCrop(itemValue)}
              style={styles.picker}
            >
              {crops.map((crop) => (
                <Picker.Item key={crop} label={crop} value={crop} />
              ))}
            </Picker>
          </View>
        ) : (
          <Text style={styles.loadingText}>Loading crops...</Text>
        )}
      </View>

      <View style={styles.section}>
        <Text style={styles.label}>Growth Stage</Text>
        <View style={styles.stageContainer}>
          {GROWTH_STAGES.map((stage) => (
            <TouchableOpacity
              key={stage}
              style={[
                styles.stageButton,
                selectedStage === stage && styles.stageButtonActive,
              ]}
              onPress={() => setSelectedStage(stage)}
            >
              <Text
                style={[
                  styles.stageButtonText,
                  selectedStage === stage && styles.stageButtonTextActive,
                ]}
              >
                {stage.charAt(0).toUpperCase() + stage.slice(1)}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <TouchableOpacity
        style={[styles.submitButton, loading && styles.submitButtonDisabled]}
        onPress={handleSubmit}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <>
            <MaterialCommunityIcons name="send" size={18} color="#fff" />
            <Text style={styles.submitButtonText}>Get Advisory</Text>
          </>
        )}
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginVertical: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  section: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#2c3e50',
    marginBottom: 10,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: '#bdc3c7',
    borderRadius: 8,
    overflow: 'hidden',
    backgroundColor: '#ecf0f1',
  },
  picker: {
    height: 50,
    color: '#2c3e50',
  },
  loadingText: {
    fontSize: 12,
    color: '#7f8c8d',
    fontStyle: 'italic',
  },
  stageContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  stageButton: {
    flex: 0.45,
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderWidth: 1.5,
    borderColor: '#bdc3c7',
    borderRadius: 8,
    backgroundColor: '#ecf0f1',
    alignItems: 'center',
    justifyContent: 'center',
  },
  stageButtonActive: {
    backgroundColor: '#3498db',
    borderColor: '#3498db',
  },
  stageButtonText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#2c3e50',
  },
  stageButtonTextActive: {
    color: '#fff',
  },
  submitButton: {
    backgroundColor: '#27ae60',
    paddingVertical: 14,
    borderRadius: 8,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
    marginTop: 10,
  },
  submitButtonDisabled: {
    backgroundColor: '#95a5a6',
    opacity: 0.6,
  },
  submitButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
});
