import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

interface AdvisoryCardProps {
  cropType: string;
  growthStage: string;
  advisoryText: string;
  recommendations: string;
  weatherCondition: string;
}

export const AdvisoryCard: React.FC<AdvisoryCardProps> = ({
  cropType,
  growthStage,
  advisoryText,
  recommendations,
  weatherCondition,
}) => {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <MaterialCommunityIcons name="leaf" size={24} color="#2ecc71" />
        <View style={styles.headerText}>
          <Text style={styles.cropName}>{cropType}</Text>
          <Text style={styles.growthStage}>Stage: {growthStage}</Text>
        </View>
      </View>

      <View style={styles.weatherSection}>
        <MaterialCommunityIcons name="cloud" size={20} color="#3498db" />
        <Text style={styles.weatherText}>{weatherCondition}</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Advisory</Text>
        <ScrollView style={styles.advisoryTextContainer}>
          <Text style={styles.advisoryText}>{advisoryText}</Text>
        </ScrollView>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Recommendations</Text>
        <ScrollView style={styles.recommendationsContainer}>
          <Text style={styles.recommendationsText}>{recommendations}</Text>
        </ScrollView>
      </View>
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
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#ecf0f1',
  },
  headerText: {
    marginLeft: 12,
  },
  cropName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2c3e50',
  },
  growthStage: {
    fontSize: 14,
    color: '#7f8c8d',
    marginTop: 4,
  },
  weatherSection: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ebf5fb',
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
  },
  weatherText: {
    fontSize: 13,
    color: '#2c3e50',
    marginLeft: 8,
  },
  section: {
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#2c3e50',
    marginBottom: 8,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  advisoryTextContainer: {
    maxHeight: 150,
    backgroundColor: '#f8f9fa',
    padding: 12,
    borderRadius: 8,
  },
  advisoryText: {
    fontSize: 13,
    color: '#34495e',
    lineHeight: 20,
  },
  recommendationsContainer: {
    maxHeight: 150,
    backgroundColor: '#f8f9fa',
    padding: 12,
    borderRadius: 8,
  },
  recommendationsText: {
    fontSize: 13,
    color: '#34495e',
    lineHeight: 20,
  },
});
