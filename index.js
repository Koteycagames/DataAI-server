const brain = require('brain.js');
const admin = require('firebase-admin');

// Сюда мы потом вставим конфиг, а пока просто скелет
const net = new brain.recurrent.LSTM();

console.log("🚀 Сервер обучения запущен!");

// Функция будет запускаться сама при старте
async function startTraining() {
    console.log("📡 Связываюсь с облаком...");
    // Тут будет логика скачивания твоих данных 0.8 и само обучение
}

startTraining();
