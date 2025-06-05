import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  FlatList,
  Modal,
  Pressable,
  Dimensions,
} from 'react-native';

const { width, height } = Dimensions.get('window');

const menuData = [
  // 🥗 Appetizers
  {
    name: 'Bruschetta',
    price: '$5.00',
    description: 'Toasted bread with tomato and basil.',
    category: 'Appetizer',
    image: require('../assets/images/d7.png'),
  },
  {
    name: 'Tabbouleh',
    price: '$4.50',
    description: 'Fresh parsley salad with bulgur and lemon.',
    category: 'Appetizer',
    image: require('../assets/images/taboule.jpg'),
  },
  {
    name: 'Fried Samosa',
    price: '$4.80',
    description: 'Crispy pastry filled with vegetables.',
    category: 'Appetizer',
    image: require('../assets/images/frit.jpg'),
  },
  {
    name: 'Caramelized Onions',
    price: '$4.00',
    description: 'Grilled sweet onions in herbs.',
    category: 'Appetizer',
    image: require('../assets/images/olive.jpg'),
  },
  {
    name: 'Stuffed Cauliflower',
    price: '$5.20',
    description: 'Roasted cauliflower stuffed with spices.',
    category: 'Appetizer',
    image: require('../assets/images/cit.jpg'),
  },

  // 🍝 Mains
  {
    name: 'Penne Pesto',
    price: '$9.00',
    description: 'Penne pasta in creamy pesto sauce with beans.',
    category: 'Main',
    image: require('../assets/images/d4.jpg'),
  },
  {
    name: 'Beef Steak',
    price: '$14.50',
    description: 'Juicy grilled steak with rosemary butter.',
    category: 'Main',
    image: require('../assets/images/d2.jpg'),
  },
  {
    name: 'Gratin Cauliflower',
    price: '$10.00',
    description: 'Baked cauliflower in creamy cheese sauce.',
    category: 'Main',
    image: require('../assets/images/cit.jpg'),
  },
  {
    name: 'Meatballs & Risotto',
    price: '$11.50',
    description: 'Risotto served with seasoned meatballs.',
    category: 'Main',
    image: require('../assets/images/ris.jpg'),
  },
  {
    name: 'Grilled Chicken',
    price: '$12.00',
    description: 'Chicken breast grilled in garlic sauce.',
    category: 'Main',
    image: require('../assets/images/poul.jpg'),
  },
  {
    name: 'Vegetable Quiche',
    price: '$9.50',
    description: 'Savory pie with eggs and vegetables.',
    category: 'Main',
    image: require('../assets/images/quiche.jpg'),
  },

  // 🍰 Desserts
  {
    name: 'Chocolate Lava Cake',
    price: '$4.50',
    description: 'Molten chocolate cake with soft center.',
    category: 'Dessert',
    image: require('../assets/images/mars.jpg'),
  },
  {
    name: 'Chocolate Cake',
    price: '$3.90',
    description: 'Warm chocolate cake with gooey molten center.',
    category: 'Dessert',
    image: require('../assets/images/mo.jpg'),
  },
  {
    name: 'Strawberry Éclair',
    price: '$4.80',
    description: 'Eclair topped with fresh strawberries.',
    category: 'Dessert',
    image: require('../assets/images/frai.jpg'),
  },
  {
    name: 'Pistachio Semifreddo',
    price: '$5.00',
    description: 'Frozen nougat dessert with pistachios.',
    category: 'Dessert',
    image: require('../assets/images/noug.jpg'),
  },
  {
    name: 'Chocolate Mousse',
    price: '$4.70',
    description: 'Rich and airy dark chocolate mousse.',
    category: 'Dessert',
    image: require('../assets/images/mou.jpg'),
  },

  // 🥤 Drinks
  {
    name: 'Avocado Smoothie',
    price: '$3.50',
    description: 'Creamy smoothie made from avocado and milk.',
    category: 'Drink',
    image: require('../assets/images/avoca.jpg'),
  },
  {
    name: 'Berry Smoothie',
    price: '$3.60',
    description: 'Mixed berry smoothie with yogurt.',
    category: 'Drink',
    image: require('../assets/images/milk.jpg'),
  },
  {
    name: 'Oreo Milkshake',
    price: '$4.00',
    description: 'Milkshake with Oreo cookie crumbles.',
    category: 'Drink',
    image: require('../assets/images/oreo.jpg'),
  },
  {
    name: 'Kiwi Green Smoothie',
    price: '$3.80',
    description: 'Refreshing kiwi smoothie with chia.',
    category: 'Drink',
    image: require('../assets/images/spi.jpg'),
  },
  {
    name: 'Vanilla Cream Puff',
    price: '$4.20',
    description: 'Choux pastry filled with vanilla cream.',
    category: 'Drink',
    image: require('../assets/images/van.jpg'),
  },
  {
    name: 'Strawberry Milkshake',
    price: '$3.70',
    description: 'Classic strawberry milkshake.',
    category: 'Drink',
    image: require('../assets/images/peach.jpg'),
  },
];



const MenuScreen = () => {
  const [selectedItem, setSelectedItem] = useState(null);

  const openModal = (item) => setSelectedItem(item);
  const closeModal = () => setSelectedItem(null);

  const categories = ['Appetizer', 'Main', 'Dessert', 'Drink'];

  return (
    <View style={styles.root}>
      {/* Üst dalga */}
      <Image
        source={require('../assets/images/frame1.12.png')}
        style={styles.topWave}
        resizeMode="stretch"
      />
      <Text style={styles.mainTitle}>Our Menu 🍽️</Text>

      {/* Scroll alanı */}
      <ScrollView
        style={styles.scrollArea}
        contentContainerStyle={{ paddingBottom: 100 }}
        showsVerticalScrollIndicator={false}
      >
        {categories.map((category) => {
          const items = menuData.filter((item) => item.category === category);
          return (
            <View key={category} style={styles.section}>
              <Text style={styles.sectionTitle}>{category}s</Text>
              <FlatList
                data={items}
                horizontal
                keyExtractor={(item) => item.name}
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{ paddingLeft: 20 }}
                renderItem={({ item }) => (
                  <Pressable onPress={() => openModal(item)} style={styles.card}>
                    <Image source={item.image} style={styles.image} />
                    <Text style={styles.cardTitle}>{item.name}</Text>
                    <Text style={styles.cardPrice}>{item.price}</Text>
                  </Pressable>
                )}
              />
            </View>
          );
        })}
      </ScrollView>

      {/* Modal */}
      {selectedItem && (
        <Modal transparent={true} animationType="fade" visible={true}>
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Image source={selectedItem.image} style={styles.modalImage} />
              <Text style={styles.modalTitle}>{selectedItem.name}</Text>
              <Text style={styles.modalPrice}>{selectedItem.price}</Text>
              <Text style={styles.modalDesc}>{selectedItem.description}</Text>
              <Pressable style={styles.modalButton} onPress={closeModal}>
                <Text style={styles.modalButtonText}>Close</Text>
              </Pressable>
            </View>
          </View>
        </Modal>
      )}
    </View>
  );
};

export default MenuScreen;

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#fff',
  },
  topWave: {
    width: width,
    height: height * 0.2,
    position: 'absolute',
    top: 0,
    zIndex: 1,
  },
  mainTitle: {
    marginTop: height * 0.13,
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    marginLeft: 20,
    marginBottom:50,
    zIndex: 2,
  },
  scrollArea: {
    flex: 1,
    backgroundColor: '#fff',
    marginTop: height * 0.02,
    paddingTop: 30,
    marginTop: -30,
  },
  section: {
    marginBottom: 30,
    color:'white',
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginLeft: 20,
    marginBottom: 20,
    color: '#FF7A00',
  },
  card: {
    width: 200,
    height: 230,
    backgroundColor: '#fff',
    borderRadius: 16,
    marginRight: 16,
    padding: 10,
    alignItems: 'center',
    borderColor: '#FF7A00',
    borderWidth: 1,
  },
  image: {
    width: 170,
    height: 150,
    borderRadius: 12,
    marginBottom: 10,
  },
  cardTitle: {
    fontSize: 15,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  cardPrice: {
    color: '#FF7A00',
    fontSize: 14,
    marginTop: 4,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '80%',
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 20,
    alignItems: 'center',
  },
  modalImage: {
    width: 180,
    height: 150,
    borderRadius: 10,
    marginBottom: 12,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 6,
  },
  modalPrice: {
    fontSize: 18,
    color: '#FF7A00',
    marginBottom: 8,
  },
  modalDesc: {
    fontSize: 14,
    color: '#444',
    textAlign: 'center',
    marginBottom: 16,
  },
  modalButton: {
    backgroundColor: '#FF7A00',
    paddingHorizontal: 30,
    paddingVertical: 10,
    borderRadius: 8,
  },
  modalButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});
