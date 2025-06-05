import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  Image,
  Dimensions,
  Alert,
  TouchableOpacity,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getReservationsByUser, deleteReservationById } from '../database';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import { useCallback } from 'react';

const { width, height } = Dimensions.get('window');

const MyReservationsScreen = () => {
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchReservations = async () => {
    try {
      const email = await AsyncStorage.getItem('loggedInUserEmail');
      if (email) {
        const data = await getReservationsByUser(email);
        setReservations(data);
      }
    } catch (error) {
      console.log('❌ Rezervasyonlar çekilirken hata:', error);
    } finally {
      setLoading(false);
    }
  };

  // 👇 Ekran odaklandığında veri yenile
  useFocusEffect(
    useCallback(() => {
      setLoading(true);
      fetchReservations();
    }, [])
  );

  const handleDelete = (id) => {
    Alert.alert(
      'Confirm',
      'Are you sure you want to delete this reservation?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          onPress: async () => {
            try {
              await deleteReservationById(id);
              Alert.alert('Deleted', 'Reservation has been removed.');
              fetchReservations();
            } catch (error) {
              Alert.alert('Error', 'Failed to delete reservation.');
            }
          },
          style: 'destructive',
        },
      ]
    );
  };

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <View style={{ flex: 1 }}>
        <Text style={styles.cardTitle}>🪑 Table {item.table_number}</Text>
        <Text style={styles.cardDetail}>📅 {item.date}</Text>
        <Text style={styles.cardDetail}>⏰ {item.time}</Text>
        <Text style={styles.cardDetail}>👥 {item.people} people</Text>
      </View>
      <TouchableOpacity onPress={() => handleDelete(item.id)}>
        <Ionicons name="trash" size={24} color="#ff3b30" />
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <Image
        source={require('../assets/images/frame1.12.png')}
        style={styles.topWave}
        resizeMode="stretch"
      />
      <Text style={styles.title}>My Reservations</Text>

      {loading ? (
        <ActivityIndicator size="large" color="#FF7A00" />
      ) : reservations.length === 0 ? (
        <Text style={styles.noData}>You have no reservations yet.</Text>
      ) : (
        <FlatList
          data={reservations}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderItem}
          contentContainerStyle={styles.list}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop: height * 0.15,
    paddingHorizontal: 24,
  },
  topWave: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: width,
    height: height * 0.2,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 50,
    marginTop: 50,
    textAlign: 'center',
  },
  list: {
    paddingBottom: 100,
  },
  card: {
    backgroundColor: '#FFF5E5',
    padding: 16,
    borderRadius: 10,
    marginBottom: 12,
    elevation: 2,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 6,
    color: '#FF7A00',
  },
  cardDetail: {
    fontSize: 14,
    color: '#444',
  },
  noData: {
    textAlign: 'center',
    fontSize: 16,
    color: '#999',
    marginTop: 40,
  },
});

export default MyReservationsScreen;
