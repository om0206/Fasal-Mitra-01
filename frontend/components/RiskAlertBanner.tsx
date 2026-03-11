import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

interface RiskAlert {
  alert_type: string;
  severity: string;
  message: string;
  trigger_conditions: string;
}

interface RiskAlertBannerProps {
  alerts: RiskAlert[];
}

export const RiskAlertBanner: React.FC<RiskAlertBannerProps> = ({ alerts }) => {
  if (!alerts || alerts.length === 0) {
    return (
      <View style={[styles.container, styles.successContainer]}>
        <MaterialCommunityIcons name="check-circle" size={24} color="#27ae60" />
        <Text style={[styles.text, styles.successText]}>
          No risks detected. Conditions are favorable!
        </Text>
      </View>
    );
  }

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

  const getSeverityIcon = (severity: string) => {
    switch (severity.toLowerCase()) {
      case 'high':
        return 'alert-circle';
      case 'medium':
        return 'alert';
      case 'low':
        return 'information';
      default:
        return 'circle';
    }
  };

  return (
    <ScrollView 
      style={styles.scrollContainer}
      scrollEnabled={alerts.length > 2}
      showsVerticalScrollIndicator={false}
    >
      {alerts.map((alert, index) => (
        <View
          key={index}
          style={[
            styles.alertContainer,
            { borderLeftColor: getSeverityColor(alert.severity) },
          ]}
        >
          <View style={styles.alertHeader}>
            <MaterialCommunityIcons
              name={getSeverityIcon(alert.severity)}
              size={20}
              color={getSeverityColor(alert.severity)}
            />
            <View style={styles.alertTitle}>
              <Text style={styles.alertType}>{alert.alert_type}</Text>
              <Text style={[styles.severity, { color: getSeverityColor(alert.severity) }]}>
                {alert.severity.toUpperCase()}
              </Text>
            </View>
          </View>

          <Text style={styles.alertMessage}>{alert.message}</Text>

          <View style={styles.triggerConditions}>
            <Text style={styles.conditionLabel}>Trigger: </Text>
            <Text style={styles.conditionText}>{alert.trigger_conditions}</Text>
          </View>
        </View>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollContainer: {
    maxHeight: 300,
  },
  container: {
    backgroundColor: '#ecf0f1',
    borderRadius: 8,
    padding: 12,
    marginVertical: 12,
    flexDirection: 'row',
    alignItems: 'center',
  },
  successContainer: {
    backgroundColor: '#d5f4e6',
  },
  text: {
    marginLeft: 12,
    fontSize: 13,
    color: '#2c3e50',
    flex: 1,
  },
  successText: {
    color: '#27ae60',
    fontWeight: '500',
  },
  alertContainer: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 12,
    marginBottom: 10,
    borderLeftWidth: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  alertHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  alertTitle: {
    marginLeft: 10,
    flex: 1,
  },
  alertType: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#2c3e50',
  },
  severity: {
    fontSize: 11,
    fontWeight: '600',
    marginTop: 2,
  },
  alertMessage: {
    fontSize: 12,
    color: '#34495e',
    lineHeight: 18,
    marginBottom: 10,
  },
  triggerConditions: {
    backgroundColor: '#f8f9fa',
    padding: 8,
    borderRadius: 6,
    flexDirection: 'row',
  },
  conditionLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: '#7f8c8d',
  },
  conditionText: {
    fontSize: 11,
    color: '#95a5a6',
    flex: 1,
  },
});
