import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Dimensions,
  Alert,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';

const { width, height } = Dimensions.get('window');

export default function ProfileScreen({ navigation }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [profileImage, setProfileImage] = useState(null);

  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    try {
      const storedEmail = await AsyncStorage.getItem('loggedInUserEmail');
      const storedName = await AsyncStorage.getItem('loggedInUserName');
      const storedImage = await AsyncStorage.getItem('profileImage');

      if (storedEmail) setEmail(storedEmail);
      if (storedName) setName(storedName);
      if (storedImage) setProfileImage(storedImage);
    } catch (error) {
      console.log('Kullanıcı verisi alınamadı:', error);
    }
  };

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.7,
    });

    if (!result.canceled) {
      const localUri = result.assets[0].uri;
      setProfileImage(localUri);
      await AsyncStorage.setItem('profileImage', localUri);
    }
  };

  const handleLogout = async () => {
    await AsyncStorage.clear();
    Alert.alert('Logged out', 'You have been logged out.');
    navigation.replace('Login');
  };

  return (
    <View style={styles.container}>
      <Image source={require('../assets/images/frame1.12.png')} style={styles.topWave} resizeMode="stretch" />

      <Text style={styles.title}>My Profile</Text>

      <View style={styles.profileSection}>
        <View style={styles.imageContainer}>
          <Image
            source={profileImage ? { uri: profileImage } : require('../assets/icons/profile.jpg')}
            style={styles.avatar}
          />
          <TouchableOpacity style={styles.editIcon} onPress={pickImage}>
            <Image source={require('../assets/icons/pen.png')} style={{ width: 22, height: 22 }} />
          </TouchableOpacity>
        </View>

        <Text style={styles.name}>{name}</Text>
        <Text style={styles.email}>{email}</Text>

        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Text style={styles.logoutText}>Log out</Text>
        </TouchableOpacity>
      </View>

      <Image source={require('../assets/images/frame1.11.png')} style={styles.bottomWave} resizeMode="stretch" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', alignItems: 'center' },
  topWave: { position: 'absolute', top: 0, left: 0, width, height: height * 0.2 },
  bottomWave: { position: 'absolute', bottom: 0, left: 0, width, height: height * 0.2 },
  title: { fontSize: 26, fontWeight: 'bold', marginTop: 130, color: '#333' },
  profileSection: { marginTop: 40, alignItems: 'center' },
  imageContainer: { position: 'relative', marginBottom: 20 },
  avatar: { width: 120, height: 120, borderRadius: 60, borderWidth: 2, borderColor: '#FF7A00' },
  editIcon: {
    position: 'absolute',
    right: 0,
    bottom: 0,
    backgroundColor: '#fff',
    padding: 6,
    borderRadius: 12,
    elevation: 2,
  },
  name: { fontSize: 22, fontWeight: 'bold', marginBottom: 6 },
  email: { fontSize: 16, color: '#888', marginBottom: 30 },
  logoutButton: {
    backgroundColor: '#FF7A00',
    paddingVertical: 12,
    paddingHorizontal: 60,
    borderRadius: 8,
  },
  logoutText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
});
