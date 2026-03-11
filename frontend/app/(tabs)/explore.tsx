import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, ScrollView, ActivityIndicator, Alert, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';

import { apiService } from '@/services/api';

interface Advisory {
  id: number;
  crop_type: string;
  growth_stage: string;
  advisory_text: string;
  weather_condition: string;
  created_at: string;
}

interface RiskAlert {
  id: number;
  crop_type: string;
  alert_type: string;
  severity: string;
  message: string;
  created_at: string;
}

export default function HistoryScreen() {
  const [advisories, setAdvisories] = useState<Advisory[]>([]);
  const [alerts, setAlerts] = useState<RiskAlert[]>([]);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'advisories' | 'alerts'>('advisories');
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadData();
  }, [activeTab]);

  const loadData = async () => {
    try {
      setLoading(true);
      
      if (activeTab === 'advisories') {
        const data = await apiService.getAdvisoryHistory();
        setAdvisories(data);
      } else {
        const data = await apiService.getAlertHistory();
        setAlerts(data);
      }
    } catch (error) {
      console.error('Error loading data:', error);
      Alert.alert('Error', 'Failed to load history data');
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  };

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
    } catch {
      return dateString;
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity.toLowerCase()) {
      case 'high':
        return '#e74c3c';
      case 'medium':
        return '#f39c12';
      case 'low':
        return '#f1c40f';
      default:
        return '#95a5a6';
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <MaterialCommunityIcons name="history" size={28} color="#3498db" />
        <Text style={styles.titleText}>History</Text>
      </View>

      {/* Tab Selector */}
      <View style={styles.tabContainer}>
        <View
          style={[
            styles.tabButton,
            activeTab === 'advisories' && styles.tabButtonActive,
          ]}
        >
          <Text
            style={[
              styles.tabText,
              activeTab === 'advisories' && styles.tabTextActive,
            ]}
            onPress={() => setActiveTab('advisories')}
          >
            Advisories
          </Text>
        </View>
        <View
          style={[
            styles.tabButton,
            activeTab === 'alerts' && styles.tabButtonActive,
          ]}
        >
          <Text
            style={[
              styles.tabText,
              activeTab === 'alerts' && styles.tabTextActive,
            ]}
            onPress={() => setActiveTab('alerts')}
          >
            Alerts
          </Text>
        </View>
      </View>

      {/* Content */}
      {loading ? (
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color="#3498db" />
        </View>
      ) : (
        <ScrollView
          style={styles.content}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          showsVerticalScrollIndicator={false}
        >
          {activeTab === 'advisories' ? (
            // Advisories List
            advisories.length > 0 ? (
              advisories.map((advisory) => (
                <View key={advisory.id} style={styles.card}>
                  <View style={styles.cardHeader}>
                    <View>
                      <Text style={styles.cardTitle}>{advisory.crop_type}</Text>
                      <Text style={styles.cardSubtitle}>
                        Stage: {advisory.growth_stage}
                      </Text>
                    </View>
                    <MaterialCommunityIcons name="seed" size={24} color="#27ae60" />
                  </View>

                  <Text style={styles.dateText}>{formatDate(advisory.created_at)}</Text>

                  <View style={styles.cardDivider} />

                  <Text style={styles.cardContent} numberOfLines={3}>
                    {advisory.advisory_text}
                  </Text>

                  <Text style={styles.weatherText}>{advisory.weather_condition}</Text>
                </View>
              ))
            ) : (
              <View style={styles.emptyState}>
                <MaterialCommunityIcons name="history" size={48} color="#bdc3c7" />
                <Text style={styles.emptyText}>No advisories yet</Text>
              </View>
            )
          ) : (
            // Alerts List
            alerts.length > 0 ? (
              alerts.map((alert) => (
                <View key={alert.id} style={styles.alertCard}>
                  <View style={styles.alertHeader}>
                    <View style={styles.alertTitleContainer}>
                      <Text style={styles.alertTitle}>{alert.alert_type}</Text>
                      <View
                        style={[
                          styles.severityBadge,
                          { backgroundColor: getSeverityColor(alert.severity) },
                        ]}
                      >
                        <Text style={styles.severityText}>
                          {alert.severity.toUpperCase()}
                        </Text>
                      </View>
                    </View>
                    <MaterialCommunityIcons name="alert-circle" size={24} color={getSeverityColor(alert.severity)} />
                  </View>

                  <Text style={styles.dateText}>{formatDate(alert.created_at)}</Text>
                  <Text style={styles.cropInfo}>
                    {alert.crop_type} • {alert.growth_stage}
                  </Text>

                  <View style={styles.cardDivider} />

                  <Text style={styles.cardContent} numberOfLines={4}>
                    {alert.message}
                  </Text>
                </View>
              ))
            ) : (
              <View style={styles.emptyState}>
                <MaterialCommunityIcons name="alert-circle-outline" size={48} color="#bdc3c7" />
                <Text style={styles.emptyText}>No alerts yet</Text>
              </View>
            )
          )}

          <View style={{ height: 30 }} />
        </ScrollView>
      )}
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f7fa',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#ecf0f1',
  },
  titleText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginLeft: 12,
  },
  tabContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#ecf0f1',
  },
  tabButton: {
    flex: 1,
    paddingVertical: 10,
    marginHorizontal: 4,
    borderRadius: 6,
    backgroundColor: '#ecf0f1',
    alignItems: 'center',
  },
  tabButtonActive: {
    backgroundColor: '#3498db',
  },
  tabText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#7f8c8d',
  },
  tabTextActive: {
    color: '#fff',
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 12,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 14,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2c3e50',
  },
  cardSubtitle: {
    fontSize: 12,
    color: '#7f8c8d',
    marginTop: 4,
  },
  dateText: {
    fontSize: 11,
    color: '#95a5a6',
    marginBottom: 8,
  },
  cardDivider: {
    height: 1,
    backgroundColor: '#ecf0f1',
    marginVertical: 10,
  },
  cardContent: {
    fontSize: 13,
    color: '#34495e',
    lineHeight: 18,
    marginBottom: 8,
  },
  weatherText: {
    fontSize: 12,
    color: '#3498db',
    fontWeight: '500',
    marginTop: 6,
  },
  alertCard: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 14,
    marginBottom: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#e74c3c',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  alertHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  alertTitleContainer: {
    flex: 1,
    marginRight: 8,
  },
  alertTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2c3e50',
  },
  severityBadge: {
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 4,
    marginTop: 6,
    alignSelf: 'flex-start',
  },
  severityText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#fff',
  },
  cropInfo: {
    fontSize: 12,
    color: '#7f8c8d',
    marginBottom: 8,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 80,
  },
  emptyText: {
    fontSize: 14,
    color: '#95a5a6',
    marginTop: 12,
  },
});
