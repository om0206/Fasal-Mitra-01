import React, { useState, useEffect } from 'react';
import { ScrollView, StyleSheet, View, Text, ActivityIndicator, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';

import { AdvisoryCard } from '@/components/AdvisoryCard';
import { RiskAlertBanner } from '@/components/RiskAlertBanner';
import { InputForm } from '@/components/InputForm';
import { apiService } from '@/services/api';

interface Advisory {
  advisory_text: string;
  recommendations: string;
  weather_condition: string;
  risk_alerts?: Array<{
    alert_type: string;
    severity: string;
    message: string;
    trigger_conditions: string;
  }>;
}

export default function AdvisoryScreen() {
  const [crops, setCrops] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [advisory, setAdvisory] = useState<Advisory | null>(null);
  const [selectedCrop, setSelectedCrop] = useState<string>('');
  const [selectedStage, setSelectedStage] = useState<string>('');
  const [serverConnection, setServerConnection] = useState(true);

  useEffect(() => {
    loadCrops();
    checkServerConnection();
  }, []);

  const checkServerConnection = async () => {
    try {
      await apiService.healthCheck();
      setServerConnection(true);
    } catch (error) {
      console.error('Server connection failed:', error);
      setServerConnection(false);
      Alert.alert(
        'Connection Error',
        'Could not connect to the advisory server. Please ensure the backend is running on http://localhost:8000'
      );
    }
  };

  const loadCrops = async () => {
    try {
      const cropsData = await apiService.getCrops();
      const cropNames = cropsData.map((crop: any) => crop.name);
      setCrops(cropNames);
    } catch (error) {
      console.error('Error loading crops:', error);
      Alert.alert('Error', 'Failed to load crops. Please check your connection.');
    }
  };

  const handleGetAdvisory = async (cropType: string, growthStage: string) => {
    try {
      setLoading(true);
      setSelectedCrop(cropType);
      setSelectedStage(growthStage);

      const response = await apiService.getAdvisory(cropType, growthStage);
      setAdvisory(response);
    } catch (error: any) {
      console.error('Error fetching advisory:', error);
      Alert.alert(
        'Error',
        error.response?.data?.detail || 'Failed to generate advisory. Please try again.'
      );
      setAdvisory(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <MaterialCommunityIcons name="leaf-circle" size={32} color="#27ae60" />
          <Text style={styles.titleText}>Crop Advisory</Text>
          <Text style={styles.subtitleText}>AI-Powered Agricultural Guidance</Text>
        </View>

        {/* Connection Status */}
        {!serverConnection && (
          <View style={styles.warningBanner}>
            <MaterialCommunityIcons name="alert" size={20} color="#e74c3c" />
            <Text style={styles.warningText}>
              Backend server is not connected. Please start the FastAPI server.
            </Text>
          </View>
        )}

        {/* Input Form */}
        <InputForm
          crops={crops}
          onSubmit={handleGetAdvisory}
          loading={loading}
        />

        {/* Loading Indicator */}
        {loading && (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#27ae60" />
            <Text style={styles.loadingText}>Generating advisory...</Text>
          </View>
        )}

        {/* Risk Alerts */}
        {advisory && !loading && (
          <>
            <Text style={styles.sectionHeader}>Risk Assessment</Text>
            <RiskAlertBanner alerts={advisory.risk_alerts || []} />
          </>
        )}

        {/* Advisory Card */}
        {advisory && !loading && (
          <>
            <Text style={styles.sectionHeader}>Your Advisory</Text>
            <AdvisoryCard
              cropType={selectedCrop}
              growthStage={selectedStage}
              advisoryText={advisory.advisory_text}
              recommendations={advisory.recommendations}
              weatherCondition={advisory.weather_condition}
            />
          </>
        )}

        {/* Empty State */}
        {!advisory && !loading && crops.length > 0 && (
          <View style={styles.emptyState}>
            <MaterialCommunityIcons name="information-outline" size={48} color="#95a5a6" />
            <Text style={styles.emptyStateText}>Select your crop and growth stage to get started</Text>
          </View>
        )}

        {/* Padding */}
        <View style={{ height: 30 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f7fa',
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 12,
  },
  header: {
    alignItems: 'center',
    marginBottom: 24,
    marginTop: 12,
  },
  titleText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginTop: 8,
  },
  subtitleText: {
    fontSize: 14,
    color: '#7f8c8d',
    marginTop: 4,
  },
  warningBanner: {
    backgroundColor: '#fadbd8',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    flexDirection: 'row',
    alignItems: 'center',
  },
  warningText: {
    fontSize: 12,
    color: '#c0392b',
    marginLeft: 10,
    flex: 1,
  },
  sectionHeader: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2c3e50',
    marginTop: 16,
    marginBottom: 10,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  loadingContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
  },
  loadingText: {
    fontSize: 14,
    color: '#7f8c8d',
    marginTop: 12,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyStateText: {
    fontSize: 14,
    color: '#95a5a6',
    marginTop: 12,
    textAlign: 'center',
  },
});

