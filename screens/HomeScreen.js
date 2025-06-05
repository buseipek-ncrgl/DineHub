import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  Dimensions,
  StatusBar,
  TouchableOpacity,
  Modal,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getUserByEmail, getReservationsByUser } from '../database';
import { useNavigation } from '@react-navigation/native';

const { width, height } = Dimensions.get('window');

const popularDishes = [
  { id: '1', name: 'Bruschetta', image: require('../assets/images/d7.png'), description: 'Toasted bread with tomato and basil.' },
  { id: '2', name: 'Beef Steak', image: require('../assets/images/d2.jpg'), description: 'Juicy grilled steak.' },
  { id: '3', name: 'Fried Samosa', image: require('../assets/images/frit.jpg'), description: 'Crispy pastry filled with vegetables.' },
];

const recommendedItems = [
 { id: '4', name: 'Penne Pesto', image: require('../assets/images/d4.jpg') },
  { id: '5', name: 'Chocolate Cake', image: require('../assets/images/mo.jpg') },
  { id: '6', name: 'Strawberry Milkshake', image: require('../assets/images/peach.jpg') },
];

export default function HomeScreen() {
  const [userName, setUserName] = useState('');
  const [selectedDish, setSelectedDish] = useState(null);
  const [upcomingReservation, setUpcomingReservation] = useState(null);
  const navigation = useNavigation();

  useEffect(() => {
    const fetchUserData = async () => {
      const email = await AsyncStorage.getItem('loggedInUserEmail');
      if (email) {
        const user = await getUserByEmail(email);
        if (user) setUserName(user.name);

        const reservations = await getReservationsByUser(email);
        if (reservations.length > 0) {
          const sorted = reservations.sort((a, b) =>
            `${a.date} ${a.time}`.localeCompare(`${b.date} ${b.time}`)
          );
          setUpcomingReservation(sorted[0]);
        }
      }
    };
    fetchUserData();
  }, []);

  const openDishModal = (dish) => {
    setSelectedDish(dish);
  };

  return (
    <View style={styles.root}>
      <Image source={require('../assets/images/frame1.12.png')} style={styles.topWave} resizeMode="stretch" />
      <StatusBar barStyle="dark-content" backgroundColor="#FF7A00" />

      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>Welcome, {userName} 👋</Text>
        <Text style={styles.subtitle}>What would you like to eat today?</Text>

        {/* 🍝 Popular Dishes */}
        <Text style={styles.sectionTitle}>🍝 Popular Dishes</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {popularDishes.map((dish) => (
            <TouchableOpacity key={dish.id} style={styles.popularCard} onPress={() => openDishModal(dish)}>
              <Image source={dish.image} style={styles.popularImage} />
              <Text style={styles.cardTitle}>{dish.name}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* 📅 Upcoming Reservation */}
        <Text style={styles.sectionTitle}>📅 Upcoming Reservation</Text>
        <View style={styles.reservationCard}>
          {upcomingReservation ? (
            <>
              <Text style={styles.cardDetail}>📅 {upcomingReservation.date}</Text>
              <Text style={styles.cardDetail}>⏰ {upcomingReservation.time}</Text>
              <Text style={styles.cardDetail}>🪑 Table {upcomingReservation.table_number}</Text>
              <Text style={styles.cardDetail}>👥 {upcomingReservation.people} people</Text>
            </>
          ) : (
            <Text style={styles.cardDetail}>No upcoming reservation.</Text>
          )}
        </View>
        <TouchableOpacity onPress={() => navigation.navigate('MyReservations')}>
          <Text style={styles.linkText}>See All</Text>
        </TouchableOpacity>

        {/* 🥗 Recommended Items */}
        <Text style={styles.sectionTitle}>🥗 Recommended Items</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {recommendedItems.map((item) => (
            <TouchableOpacity key={item.id} style={styles.recommendCard} onPress={() => navigation.navigate('Menu')}>
              <Image source={item.image} style={styles.recommendImage} />
              <Text style={styles.cardTitle}>{item.name}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
        <TouchableOpacity style={styles.menuButton} onPress={() => navigation.navigate('Menu')}>
          <Text style={styles.menuButtonText}>Go to Full Menu</Text>
        </TouchableOpacity>
      </ScrollView>

      {/* 🍽️ Modal for Dish Details */}
      <Modal visible={!!selectedDish} animationType="slide" transparent>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Image source={selectedDish?.image} style={styles.modalImage} />
            <Text style={styles.modalTitle}>{selectedDish?.name}</Text>
            <Text style={styles.modalDesc}>{selectedDish?.description}</Text>
            <TouchableOpacity onPress={() => setSelectedDish(null)} style={styles.closeButton}>
              <Text style={styles.closeText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#FF7A00',
  },
  topWave: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: width,
    height: height * 0.2,
    zIndex: 1,
  },
  container: {
    paddingTop: height * 0.22,
    paddingBottom: 60,
    paddingHorizontal: 24,
    backgroundColor: '#fff',
    borderTopLeftRadius: 40,
    borderTopRightRadius: 40,
    zIndex: 2,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginVertical: 12,
    color: '#FF7A00',
  },
  popularCard: {
    backgroundColor: '#f5f5f5',
    borderRadius: 16,
    padding: 10,
    marginRight: 12,
    width: 180,
    alignItems: 'center',
  },
  popularImage: {
    width: 160,
    height: 130,
    borderRadius: 12,
    marginBottom: 6,
  },
  recommendCard: {
    backgroundColor: '#fefefe',
    borderRadius: 16,
    padding: 10,
    marginRight: 12,
    width: 180,
    alignItems: 'center',
  },
  recommendImage: {
    width: 150,
    height: 120,
    borderRadius: 12,
    marginBottom: 6,
  },
  reservationCard: {
    backgroundColor: '#FFF5E5',
    padding: 16,
    borderRadius: 12,
    marginBottom: 10,
  },
  cardDetail: {
    fontSize: 14,
    color: '#444',
    marginBottom: 4,
  },
  cardTitle: {
    fontSize: 14,
    textAlign: 'center',
    color: '#333',
  },
  linkText: {
    color: '#FF7A00',
    textAlign: 'right',
    marginTop: 4,
    marginBottom: 20,
    fontWeight: 'bold',
  },
  menuButton: {
    marginTop: 12,
    padding: 10,
    backgroundColor: '#FF7A00',
    borderRadius: 8,
    alignSelf: 'flex-start',
  },
  menuButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: '#000000aa',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: width * 0.85,
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 16,
    alignItems: 'center',
  },
  modalImage: {
    width: 200,
    height: 150,
    borderRadius: 12,
    marginBottom: 10,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  modalDesc: {
    fontSize: 16,
    color: '#444',
    marginBottom: 12,
    textAlign: 'center',
  },
  closeButton: {
    backgroundColor: '#FF7A00',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  closeText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});
