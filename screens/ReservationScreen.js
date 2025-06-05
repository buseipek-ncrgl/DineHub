import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Modal,
  ScrollView,
  Dimensions,
  Image,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Ionicons } from '@expo/vector-icons';
import { insertReservation, isTableBooked } from '../database';
import AsyncStorage from '@react-native-async-storage/async-storage';

const { width, height } = Dimensions.get('window');

const ReservationScreen = () => {
  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [people, setPeople] = useState('');
  const [time, setTime] = useState('');
  const [tableNumber, setTableNumber] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [peopleModalVisible, setPeopleModalVisible] = useState(false);
  const [tableModalVisible, setTableModalVisible] = useState(false);

  const timeSlots = Array.from({ length: 13 }, (_, i) => `${11 + i}:00`);
  const peopleOptions = Array.from({ length: 10 }, (_, i) => (i + 1).toString());
  const tableOptions = Array.from({ length: 10 }, (_, i) => (i + 1).toString());

  const handleReservation = async () => {
    if (!people || !time || !tableNumber) {
      Alert.alert('Error', 'Please fill in all fields.');
      return;
    }

    const email = await AsyncStorage.getItem('loggedInUserEmail');
    const dateStr = date.toISOString().split('T')[0];

    const alreadyBooked = await isTableBooked(dateStr, time, tableNumber);
    if (alreadyBooked) {
      Alert.alert('Table Unavailable', 'This table is already booked at that time.');
      return;
    }

    try {
      await insertReservation(email, dateStr, time, people, tableNumber);
      Alert.alert('Success', 'Reservation created!');
      setPeople('');
      setTime('');
      setTableNumber('');
    } catch (err) {
      Alert.alert('Database Error', err.message);
    }
  };

  return (
    <View style={styles.root}>
      <Image
        source={require('../assets/images/frame1.12.png')}
        style={styles.topWave}
        resizeMode="stretch"
      />

      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>Make a Reservation</Text>

        {/* DATE PICKER */}
        <TouchableOpacity
          style={styles.inputRow}
          onPress={() => setShowDatePicker(true)}
        >
          <Ionicons name="calendar-outline" size={20} color="#FF7A00" />
          <Text style={styles.inputText}>{date.toDateString()}</Text>
        </TouchableOpacity>

        {showDatePicker && (
          <DateTimePicker
            value={date}
            mode="date"
            display="default"
            onChange={(event, selectedDate) => {
              if (selectedDate) setDate(selectedDate);
              setShowDatePicker(false);
            }}
          />
        )}

        {/* PEOPLE SELECT */}
        <TouchableOpacity
          style={styles.inputRow}
          onPress={() => setPeopleModalVisible(true)}
        >
          <Ionicons name="person-outline" size={20} color="#FF7A00" />
          <Text style={styles.inputText}>
            {people ? `People: ${people}` : 'Select Number of People'}
          </Text>
        </TouchableOpacity>

        <Modal visible={peopleModalVisible} animationType="slide" transparent={true}>
          <View style={styles.modalView}>
            <Text style={styles.modalTitle}>Select Number of People</Text>
            {peopleOptions.map((num, index) => (
              <TouchableOpacity
                key={index}
                style={styles.timeSlot}
                onPress={() => {
                  setPeople(num);
                  setPeopleModalVisible(false);
                }}
              >
                <Text style={styles.timeSlotText}>{num}</Text>
              </TouchableOpacity>
            ))}
            <TouchableOpacity onPress={() => setPeopleModalVisible(false)}>
              <Text style={{ color: '#FF7A00', marginTop: 10 }}>Close</Text>
            </TouchableOpacity>
          </View>
        </Modal>

        {/* TIME SELECT */}
        <TouchableOpacity
          style={styles.inputRow}
          onPress={() => setModalVisible(true)}
        >
          <Ionicons name="time-outline" size={20} color="#FF7A00" />
          <Text style={styles.inputText}>
            {time ? `Selected: ${time}` : 'Select Time Slot'}
          </Text>
        </TouchableOpacity>

        <Modal visible={modalVisible} animationType="slide" transparent={true}>
          <View style={styles.modalView}>
            <Text style={styles.modalTitle}>Select Time</Text>
            {timeSlots.map((slot, index) => (
              <TouchableOpacity
                key={index}
                style={styles.timeSlot}
                onPress={() => {
                  setTime(slot);
                  setModalVisible(false);
                }}
              >
                <Text style={styles.timeSlotText}>{slot}</Text>
              </TouchableOpacity>
            ))}
            <TouchableOpacity onPress={() => setModalVisible(false)}>
              <Text style={{ color: '#FF7A00', marginTop: 10 }}>Close</Text>
            </TouchableOpacity>
          </View>
        </Modal>

        {/* TABLE SELECT */}
        <TouchableOpacity
          style={styles.inputRow}
          onPress={() => setTableModalVisible(true)}
        >
          <Ionicons name="restaurant-outline" size={20} color="#FF7A00" />
          <Text style={styles.inputText}>
            {tableNumber ? `Table: ${tableNumber}` : 'Select Table Number'}
          </Text>
        </TouchableOpacity>

        <Modal visible={tableModalVisible} animationType="slide" transparent={true}>
          <View style={styles.modalView}>
            <Text style={styles.modalTitle}>Select Table Number</Text>
            {tableOptions.map((num, index) => (
              <TouchableOpacity
                key={index}
                style={styles.timeSlot}
                onPress={() => {
                  setTableNumber(num);
                  setTableModalVisible(false);
                }}
              >
                <Text style={styles.timeSlotText}>Table {num}</Text>
              </TouchableOpacity>
            ))}
            <TouchableOpacity onPress={() => setTableModalVisible(false)}>
              <Text style={{ color: '#FF7A00', marginTop: 10 }}>Close</Text>
            </TouchableOpacity>
          </View>
        </Modal>

        <TouchableOpacity style={styles.button} onPress={handleReservation}>
          <Text style={styles.buttonText}>Book Now</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#FFFFFF',
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
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 20,
    textAlign: 'center',
  },
  inputRow: {
    backgroundColor: '#f2f2f2',
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    borderRadius: 8,
    marginBottom: 20,
  },
  inputText: {
    marginLeft: 10,
    fontSize: 16,
    color: '#444',
  },
  button: {
    backgroundColor: '#FF7A00',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 16,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  modalView: {
    backgroundColor: '#fff',
    padding: 20,
    marginTop: 'auto',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  timeSlot: {
    padding: 12,
    borderBottomWidth: 1,
    borderColor: '#eee',
  },
  timeSlotText: {
    fontSize: 16,
  },
});

export default ReservationScreen;
