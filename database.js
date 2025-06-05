import { openDatabaseSync } from 'expo-sqlite';

const db = openDatabaseSync('restaurant_v2.db');

// Veritabanı başlatma
export const initDatabase = async () => {
  try {
    // Kullanıcılar tablosu
    await db.execAsync(`
      CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        email TEXT NOT NULL UNIQUE,
        password TEXT NOT NULL
      );
    `);

    // Rezervasyonlar tablosu
    await db.execAsync(`
      CREATE TABLE IF NOT EXISTS reservations (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_email TEXT NOT NULL,
        date TEXT NOT NULL,
        time TEXT NOT NULL,
        people INTEGER NOT NULL,
        table_number INTEGER NOT NULL
      );
    `);

    console.log('✅ Tablolar başarıyla oluşturuldu');
  } catch (error) {
    console.log('❌ Veritabanı oluşturma hatası:', error);
  }
};

//
// KULLANICI İŞLEMLERİ
//
export const insertUser = async (name, email, password) => {
  try {
    const result = await db.runAsync(
      'INSERT INTO users (name, email, password) VALUES (?, ?, ?);',
      [name, email, password]
    );
    return result;
  } catch (error) {
    throw error;
  }
};

export const getUser = async (email, password) => {
  try {
    const result = await db.getAllAsync(
      'SELECT * FROM users WHERE email = ? AND password = ?;',
      [email, password]
    );
    return result[0];
  } catch (error) {
    throw error;
  }
};

export const getUserByEmail = async (email) => {
  try {
    const result = await db.getAllAsync(
      'SELECT * FROM users WHERE email = ?;',
      [email]
    );
    return result[0];
  } catch (error) {
    throw error;
  }
};

//
// REZERVASYON İŞLEMLERİ
//
export const insertReservation = async (email, date, time, people, tableNumber) => {
  try {
    const result = await db.runAsync(
      `INSERT INTO reservations (user_email, date, time, people, table_number)
       VALUES (?, ?, ?, ?, ?);`,
      [email, date, time, parseInt(people), parseInt(tableNumber)]
    );
    return result;
  } catch (error) {
    throw error;
  }
};

export const isTableBooked = async (date, time, tableNumber) => {
  try {
    const result = await db.getAllAsync(
      `SELECT * FROM reservations WHERE date = ? AND time = ? AND table_number = ?;`,
      [date, time, parseInt(tableNumber)]
    );
    return result.length > 0;
  } catch (error) {
    throw error;
  }
};

export const getReservationsByUser = async (email) => {
  try {
    const result = await db.getAllAsync(
      `SELECT * FROM reservations WHERE user_email = ? ORDER BY date DESC, time ASC;`,
      [email]
    );
    return result;
  } catch (error) {
    throw error;
  }
};

// 🔴 REZERVASYON SİLME (ID'ye göre)
export const deleteReservationById = async (id) => {
  try {
    const result = await db.runAsync(`DELETE FROM reservations WHERE id = ?`, [id]);
    return result;
  } catch (error) {
    throw error;
  }
};

export default db;
