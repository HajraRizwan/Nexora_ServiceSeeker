import React, { useEffect, useState } from 'react';
import {
  Modal,
  TextInput,
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  Linking,
  Dimensions,
} from 'react-native';
import { useRouter } from 'expo-router';
import * as Location from 'expo-location';
import { Calendar, Clock, Plus, ArrowRight, MapPin, Phone, X } from 'lucide-react-native';

const { width } = Dimensions.get('window');

export default function HomeScreen() {
  const router = useRouter();
  const [showLocationModal, setShowLocationModal] = useState(false);
  const [manualLocation, setManualLocation] = useState('');
  const [currentAddress, setCurrentAddress] = useState('Fetching your location...');

  // 📍 Auto-fetch location
  useEffect(() => {
    fetchCurrentLocation();
  }, []);

  const fetchCurrentLocation = async () => {
    try {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setCurrentAddress('Permission denied');
        return;
      }

      let location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Highest,
      });

      let addressResponse = await Location.reverseGeocodeAsync({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      });

      if (addressResponse.length > 0) {
        let addr = addressResponse[0];
        let fullAddress = `${addr.name || ''}, ${addr.city || ''}, ${addr.region || ''}, ${addr.country || ''}`;
        setCurrentAddress(fullAddress);
      } else {
        setCurrentAddress('Unable to get address');
      }
    } catch (error) {
      console.log(error);
      setCurrentAddress('Error fetching location');
    }
  };

  const scheduledJobs = [
    { id: 1, service: 'Plumbing', time: '2:00 PM', date: 'Today', status: 'confirmed', provider: 'Ahmad Ali', phone: '+92 300 1234567' },
    { id: 2, service: 'Cleaning', time: '10:00 AM', date: 'Tomorrow', status: 'pending', provider: 'Sara Khan', phone: '+92 301 9876543' },
  ];

  const ongoingJobs = [
    { id: 1, service: 'Electrical Work', provider: 'Ahmad Ali', status: 'arriving', time: '5 mins away', phone: '+92 300 1234567' },
  ];

  // ✅ Manual location set
  const handleManualLocationSubmit = () => {
    if (!manualLocation.trim()) {
      Alert.alert('Error', 'Please enter a location');
      return;
    }
    setShowLocationModal(false);
    setCurrentAddress(manualLocation);
    Alert.alert('Location Set', `Location set to: ${manualLocation}`, [
      { text: 'OK', onPress: () => router.push('/services') },
    ]);
    setManualLocation('');
  };

  // 📞 Contact provider
  const handleContactProvider = (phone, providerName) => {
    Alert.alert(`Contact ${providerName}`, `Phone: ${phone}`, [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Call', onPress: () => Linking.openURL(`tel:${phone}`) },
    ]);
  };

  // 📍 Ask user: current or manual
  const handleShareLocation = async () => {
    Alert.alert('Select Location', 'How would you like to set your location?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Use Current Location',
        onPress: async () => {
          await fetchCurrentLocation();
          router.push('/services');
        },
      },
      { text: 'Enter Manually', onPress: () => setShowLocationModal(true) },
    ]);
  };

  return (
    <View style={styles.container}>
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Greeting */}
        <View style={styles.greetingSection}>
          <Text style={styles.greetingLine}>
            Good Morning <Text style={styles.userName}>John Doe</Text>
          </Text>
        </View>

        {/* 📍 Location Section */}
        <View style={styles.section}>
          <View style={styles.locationHeader}>
            <Text style={styles.sectionTitle}>Location</Text>
            <TouchableOpacity style={styles.changeLocationBtn} onPress={handleShareLocation}>
              <Text style={styles.changeLocationText}>Change</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.mapContainer}>
            <View style={styles.mockMap}>
              <View style={styles.locationMarker}>
                <MapPin size={20} color="#fff" />
              </View>
              <View style={styles.locationInfo}>
                <Text style={styles.locationText}>{currentAddress}</Text>
                <Text style={styles.locationSubtext}>Current Location</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Ongoing Jobs */}
        {ongoingJobs.length > 0 && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Ongoing Jobs</Text>
              <TouchableOpacity onPress={() => router.push('/job-tracking')}>
                {/* <ArrowRight size={20} color="#666" /> */}
              </TouchableOpacity>
            </View>

            {ongoingJobs.map((job) => (
              <TouchableOpacity key={job.id} style={styles.jobCard}>
                <View style={styles.jobInfo}>
                  <Text style={styles.jobService}>{job.service}</Text>
                  <Text style={styles.jobProvider}>Provider: {job.provider}</Text>
                  <View style={styles.jobStatus}>
                    <View style={[styles.statusDot, { backgroundColor: '#ff6b35' }]} />
                    <Text style={styles.statusText}>{job.status} • {job.time}</Text>
                  </View>
                </View>
                <TouchableOpacity
                  style={styles.contactButton}
                  onPress={() => handleContactProvider(job.phone, job.provider)}
                >
                  <Phone size={16} color="#05f51d" />
                </TouchableOpacity>
              </TouchableOpacity>
            ))}
          </View>
        )}

        {/* Scheduled Jobs */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Scheduled Jobs</Text>
            <TouchableOpacity onPress={() => router.push('/(tabs)/scheduled')}>
              <ArrowRight size={20} color="#666" />
            </TouchableOpacity>
          </View>
          {scheduledJobs.map((job) => (
            <TouchableOpacity key={job.id} style={styles.jobCard}>
              <View style={styles.jobInfo}>
                <Text style={styles.jobService}>{job.service}</Text>
                <Text style={styles.jobTime}>{job.time} • {job.date}</Text>
                <View style={styles.jobStatus}>
                  <View style={[styles.statusDot, { backgroundColor: '#05f51d' }]} />
                  <Text style={styles.statusText}>{job.status}</Text>
                </View>
              </View>
              <TouchableOpacity
                style={styles.contactButton}
                onPress={() => handleContactProvider(job.phone, job.provider)}
              >
                <Phone size={16} color="#05f51d" />
              </TouchableOpacity>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>

      {/* ✅ Book Service Button */}
      <View style={styles.bottomSection}>
        <TouchableOpacity style={styles.bookServiceButton} onPress={handleShareLocation}>
          <Plus size={24} color="#19034d" />
          <Text style={styles.bookServiceText}>Book Service</Text>
        </TouchableOpacity>
      </View>

      {/* Manual Location Modal */}
      <Modal visible={showLocationModal} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Enter Location</Text>
              <TouchableOpacity onPress={() => setShowLocationModal(false)}>
                <X size={24} color="#666" />
              </TouchableOpacity>
            </View>
            <View style={styles.locationForm}>
              <View style={styles.locationInputGroup}>
                <MapPin size={20} color="#666" />
                <TextInput
                  style={styles.locationInput}
                  value={manualLocation}
                  onChangeText={setManualLocation}
                  placeholder="Enter your address"
                  placeholderTextColor="#999"
                  multiline
                />
              </View>
            </View>
            <TouchableOpacity style={styles.submitLocationButton} onPress={handleManualLocationSubmit}>
              <Text style={styles.submitLocationText}>Set Location</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

// ---------- Styles ----------
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  content: { flex: 1 },
  greetingSection: { paddingHorizontal: 24, paddingTop: 20, paddingBottom: 24 },
  greetingLine: { fontSize: 18, color: '#19034d', fontWeight: '600' },
  userName: { fontSize: 16, fontWeight: '600', color: '#19034d' },
  section: { marginBottom: 32, paddingHorizontal: 24 },
  sectionTitle: { fontSize: 18, fontWeight: '600', color: '#19034d' },
  locationHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  changeLocationBtn: { backgroundColor: '#05f51d', paddingVertical: 4, paddingHorizontal: 10, borderRadius: 8 },
  changeLocationText: { color: '#19034d', fontWeight: '600', fontSize: 12 },
  mapContainer: { height: 200, borderRadius: 12, overflow: 'hidden', marginTop: 12 },
  mockMap: { flex: 1, backgroundColor: '#f0fff1', justifyContent: 'flex-end', padding: 16 },
  locationMarker: { position: 'absolute', top: '50%', left: '50%', width: 40, height: 40, backgroundColor: '#19034d', borderRadius: 20, justifyContent: 'center', alignItems: 'center', marginTop: -20, marginLeft: -20 },
  locationInfo: { alignItems: 'center', gap: 4 },
  locationText: { fontSize: 16, fontWeight: '600', color: '#19034d', textAlign: 'center' },
  locationSubtext: { fontSize: 14, color: '#05f51d' },
  jobCard: { backgroundColor: '#f8f9fa', padding: 16, borderRadius: 12, marginBottom: 12, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  jobInfo: { flex: 1 },
  jobService: { fontSize: 16, fontWeight: '600', color: '#19034d' },
  jobProvider: { fontSize: 14, color: '#666', marginBottom: 4 },
  jobTime: { fontSize: 14, color: '#666', marginBottom: 8 },
  jobStatus: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  statusDot: { width: 8, height: 8, borderRadius: 4 },
  statusText: { fontSize: 12, color: '#666' },
  contactButton: { width: 36, height: 36, backgroundColor: '#fff', borderRadius: 18, justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: '#05f51d' },
  bottomSection: { paddingHorizontal: 24, paddingBottom: 32, paddingTop: 16 },
  bookServiceButton: { flexDirection: 'row', backgroundColor: '#05f51d', paddingVertical: 16, borderRadius: 16, alignItems: 'center', justifyContent: 'center', gap: 12 },
  bookServiceText: { fontSize: 18, fontWeight: '700', color: '#19034d' },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0, 0, 0, 0.5)', justifyContent: 'center', alignItems: 'center' },
  modalContent: { backgroundColor: '#fff', borderRadius: 20, padding: 24, width: '90%', maxWidth: 400 },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 },
  modalTitle: { fontSize: 18, fontWeight: '600', color: '#19034d' },
  locationForm: { marginBottom: 24 },
  locationInputGroup: { flexDirection: 'row', alignItems: 'flex-start', backgroundColor: '#f8f9fa', borderRadius: 12, paddingHorizontal: 16, paddingVertical: 12, borderWidth: 1, borderColor: '#e5e5e5' },
  locationInput: { flex: 1, fontSize: 16, color: '#333', marginLeft: 12, minHeight: 60, textAlignVertical: 'top' },
  submitLocationButton: { backgroundColor: '#05f51d', paddingVertical: 16, borderRadius: 12, alignItems: 'center' },
  submitLocationText: { fontSize: 16, fontWeight: '600', color: '#19034d' },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
});
