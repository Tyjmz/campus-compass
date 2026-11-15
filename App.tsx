import { useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import * as Location from 'expo-location';
import {
  ActivityIndicator,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

const destinations = [
  { id: 'library', name: 'Library' },
  { id: 'student-center', name: 'Student Center' },
  { id: 'science-building', name: 'Science Building' },
  { id: 'arts-center', name: 'Arts Center' },
  { id: 'sports-center', name: 'Sports Center' },
];

const routeOptions = [
  { id: 'standard', label: 'Standard' },
  { id: 'no-stairs', label: 'Avoid stairs' },
  { id: 'no-steep', label: 'Avoid steep paths' },
  { id: 'avoid-both', label: 'Avoid stairs and steep paths' },
];

export default function App() {
  const [query, setQuery] = useState('');
  const [destination, setDestination] = useState<string | null>(null);
  const [route, setRoute] = useState('standard');
  const [message, setMessage] = useState('');
  const [requesting, setRequesting] = useState(false);
  const visibleDestinations = destinations.filter((item) =>
    item.name.toLowerCase().includes(query.trim().toLowerCase())
  );
  const selectedDestination = destinations.find((item) => item.id === destination);

  async function startRoute() {
    if (!destination || requesting) return;
    setRequesting(true);
    setMessage('');
    try {
      const permission = await Location.requestForegroundPermissionsAsync();
      setMessage(
        permission.granted
          ? 'Location permission granted. Route guidance is not available in this prototype.'
          : 'Location permission was not granted. You can enable it in your device settings to try again.'
      );
    } catch {
      setMessage('Unable to request location permission. Please check your device settings and try again.');
    } finally {
      setRequesting(false);
    }
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar style="dark" />
      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        <Text accessibilityRole="header" style={styles.title}>Campus Compass</Text>
        <Text style={styles.tagline}>Find your way through hills and stairs.</Text>

        <View style={styles.map} accessibilityLabel="Map placeholder. No map or route is available yet.">
          <Text style={styles.mapTitle}>Map placeholder</Text>
          <Text style={styles.mapText}>Your route will appear here in a future version.</Text>
        </View>
        <Text style={styles.notice}>
          Routing is a prototype and does not yet provide verified campus directions.
        </Text>

        <Text accessibilityRole="header" style={styles.heading}>Choose a destination</Text>
        <TextInput
          accessibilityLabel="Search destinations"
          style={styles.search}
          placeholder="Search buildings"
          placeholderTextColor="#596878"
          value={query}
          onChangeText={setQuery}
        />
        {selectedDestination && (
          <Text style={styles.selected}>Selected: {selectedDestination.name}</Text>
        )}
        <View accessibilityRole="radiogroup" accessibilityLabel="Destinations">
          {visibleDestinations.map((item) => (
            <Pressable
              key={item.id}
              accessibilityRole="radio"
              accessibilityState={{ checked: destination === item.id }}
              onPress={() => {
                setDestination(item.id);
                setMessage('');
              }}
              style={[styles.option, destination === item.id && styles.optionSelected]}
            >
              <Text style={styles.optionText}>
                {destination === item.id ? '● ' : '○ '}{item.name}
              </Text>
            </Pressable>
          ))}
          {visibleDestinations.length === 0 && <Text style={styles.empty}>No buildings match your search.</Text>}
        </View>

        <Text accessibilityRole="header" style={styles.heading}>Route preference</Text>
        <View accessibilityRole="radiogroup" accessibilityLabel="Route preference">
          {routeOptions.map((option) => (
            <Pressable
              key={option.id}
              accessibilityRole="radio"
              accessibilityState={{ checked: route === option.id }}
              onPress={() => setRoute(option.id)}
              style={[styles.option, route === option.id && styles.optionSelected]}
            >
              <Text style={styles.optionText}>
                {route === option.id ? '● ' : '○ '}{option.label}
              </Text>
            </Pressable>
          ))}
        </View>

        <Pressable
          accessibilityRole="button"
          accessibilityState={{ disabled: !destination || requesting, busy: requesting }}
          disabled={!destination || requesting}
          onPress={startRoute}
          style={[styles.button, (!destination || requesting) && styles.buttonDisabled]}
        >
          {requesting ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Start Route</Text>}
        </Pressable>
        {!destination && <Text style={styles.hint}>Select a destination to start.</Text>}
        {!!message && <Text accessibilityLiveRegion="polite" style={styles.message}>{message}</Text>}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#f5f7f9' },
  content: { padding: 20, paddingBottom: 40, maxWidth: 700, width: '100%', alignSelf: 'center' },
  title: { fontSize: 30, fontWeight: '700', color: '#152b3b' },
  tagline: { fontSize: 16, color: '#344c5e', marginTop: 4, marginBottom: 20 },
  map: { minHeight: 180, backgroundColor: '#e3ebee', borderWidth: 1, borderColor: '#a5b8c2', borderRadius: 12, justifyContent: 'center', alignItems: 'center', padding: 20 },
  mapTitle: { fontSize: 20, fontWeight: '700', color: '#254356', textAlign: 'center' },
  mapText: { fontSize: 15, color: '#344c5e', textAlign: 'center', marginTop: 8 },
  notice: { color: '#344c5e', fontSize: 14, lineHeight: 20, marginTop: 10 },
  heading: { color: '#152b3b', fontSize: 20, fontWeight: '700', marginTop: 24, marginBottom: 10 },
  search: { backgroundColor: '#fff', borderColor: '#718795', borderWidth: 1, borderRadius: 8, paddingHorizontal: 12, minHeight: 48, color: '#152b3b', fontSize: 16 },
  selected: { color: '#254356', fontSize: 14, marginTop: 10 },
  option: { minHeight: 48, justifyContent: 'center', paddingHorizontal: 12, marginTop: 8, borderWidth: 1, borderColor: '#a5b8c2', borderRadius: 8, backgroundColor: '#fff' },
  optionSelected: { borderColor: '#145d69', borderWidth: 2, backgroundColor: '#e5f3f1' },
  optionText: { fontSize: 16, color: '#152b3b' },
  empty: { fontSize: 15, color: '#344c5e', marginTop: 12 },
  button: { minHeight: 52, borderRadius: 8, backgroundColor: '#145d69', alignItems: 'center', justifyContent: 'center', marginTop: 24 },
  buttonDisabled: { backgroundColor: '#718795' },
  buttonText: { color: '#fff', fontSize: 16, fontWeight: '700' },
  hint: { color: '#344c5e', fontSize: 14, marginTop: 8 },
  message: { color: '#152b3b', fontSize: 15, lineHeight: 21, marginTop: 12 },
});
