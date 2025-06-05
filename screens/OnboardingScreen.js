import React, { useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import Swiper from 'react-native-swiper';

const { width, height } = Dimensions.get('window');

const slides = [
  {
    key: '1',
    title: 'Book a Table Instantly',
    text: 'Reserve your seat in just a few taps.',
    image: require('../assets/images/onboarding1.png'),
  },
  {
    key: '2',
    title: 'No More Waiting',
    text: 'Walk in and skip the lines easily.',
    image: require('../assets/images/onboarding2.jpg'),
  },
  {
    key: '3',
    title: 'Enjoy Your Meal',
    text: 'Relax and focus on your dining experience.',
    image: require('../assets/images/onboarding3.jpg'),
  },
];

export default function OnboardingScreen({ navigation }) {
  const swiperRef = useRef(null);

  return (
    <Swiper
      loop={false}
      dotStyle={styles.dot}
      activeDotStyle={styles.activeDot}
      paginationStyle={styles.pagination}
      ref={swiperRef}
    >
      {slides.map((slide, index) => (
        <View key={slide.key} style={styles.slide}>
          <Image source={slide.image} style={styles.image} resizeMode="cover" />

          {/* DALGA görseli artık her slide içinde */}
          <Image
            source={require('../assets/images/1.png')}
            style={styles.backgroundWave}
            resizeMode="stretch"
          />

          <View style={styles.contentContainer}>
            <Text style={styles.title}>{slide.title}</Text>
            <Text style={styles.text}>{slide.text}</Text>

            {index === slides.length - 1 ? (
              <TouchableOpacity
                style={styles.nextButton}
                onPress={() => navigation.replace('Login')}
              >
                <Text style={styles.nextButtonText}>Get Started</Text>
              </TouchableOpacity>
            ) : (
              <View style={styles.buttonRow}>
                <TouchableOpacity onPress={() => navigation.replace('Login')}>
                  <Text style={styles.skip}>Skip step</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.nextButton}
                  onPress={() => swiperRef.current.scrollBy(1)}
                >
                  <Text style={styles.nextButtonText}>Next</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        </View>
      ))}
    </Swiper>
  );
}

const styles = StyleSheet.create({
  slide: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  image: {
    width: width,
    height: height * 0.82,
    position: 'absolute',
    top: 0,
    left: 0,
    zIndex: 0,
  },
  backgroundWave: {
  position: 'absolute',
  bottom: 0,               // taşıma olmasın diye sıfırla
  left: 0,                 // sola kaydırma kaldır
  width: width,            // tam ekran genişlik
  height: height * 0.45,   // dikey oran korunsun
  zIndex: 1,
},

  contentContainer: {
    position: 'absolute',
    bottom: 80,
    zIndex: 2,
    width: '100%',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#23233C',
    marginBottom: 2,
    textAlign: 'center',
  },
  text: {
    fontSize: 14,
    color: '#8D8D8D',
    textAlign: 'center',
    marginBottom: 10,
    paddingHorizontal: 10,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '90%',
    alignItems: 'center',
  },
  skip: {
    fontSize: 14,
    color: '#bbb',
  },
  nextButton: {
    backgroundColor: '#FF7A00',
    paddingVertical: 12,
    paddingHorizontal: 40,
    borderRadius: 18,
  },
  nextButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  dot: {
    backgroundColor: '#ccc',
    width: 8,
    height: 8,
    borderRadius: 4,
    marginHorizontal: 4,
  },
  activeDot: {
    backgroundColor: '#FF7A00',
    width: 10,
    height: 10,
    borderRadius: 5,
    marginHorizontal: 4,
  },
  pagination: {
    bottom: height * 0.28,
  },
});
