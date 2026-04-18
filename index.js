const brain = require('brain.js');
const admin = require('firebase-admin');

// 1. Настройка доступа через переменные (безопасно)
const serviceAccount = JSON.parse(process.env.FIREBASE_CONFIG);

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://pizdun-fefbc-default-rtdb.firebaseio.com"
});

const db = admin.database();
const net = new brain.recurrent.LSTM();

console.log("🚀 Сервер DataAI запущен и готов к обучению!");

async function trainModel() {
    try {
        console.log("📥 Получаю данные из Firebase...");
        // Путь 'training_data/08' — убедись, что в Firebase данные лежат там
        const snapshot = await db.ref('training_data/08').once('value');
        const data = snapshot.val();

        if (!data) {
            console.log("❌ Данные для обучения не найдены!");
            return;
        }

        console.log(`🧠 Начинаю жарить нейроны! (Примеров: ${data.length})`);
        
        net.train(data, {
            iterations: 1500, // Вот она, мощь сервера!
            log: (details) => console.log(details),
            logPeriod: 100
        });

        console.log("✅ Обучение окончено! Сохраняю веса...");
        const weights = JSON.stringify(net.toJSON());
        
        // Сохраняем готовую модель
        await db.ref('models/DataAI_0_8').set({
            weights: weights,
            updatedAt: admin.database.ServerValue.TIMESTAMP
        });

        console.log("🚀 Всё! Модель DataAI_0.8 теперь в облаке. Можешь проверять на телефоне!");
        process.exit(0); // Выключаем сервер после работы, чтобы не тратить лимиты
    } catch (err) {
        console.error("💥 Ошибка:", err);
    }
}

trainModel();
