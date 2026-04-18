// Используем чистую JS версию без нативных модулей
const brain = require('brain.js/dist/index.js'); 
const admin = require('firebase-admin');

const serviceAccount = JSON.parse(process.env.FIREBASE_CONFIG);

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://pizdun-fefbc-default-rtdb.firebaseio.com"
});

const db = admin.database();
const net = new brain.recurrent.LSTM();

async function trainModel() {
    console.log("🚀 Чистый JS-движок запущен!");
    try {
        const snapshot = await db.ref('training_data/08').once('value');
        const data = snapshot.val();

        if (!data) {
            console.log("❌ Данные не найдены!");
            return;
        }

        console.log("🧠 Обучение пошло...");
        net.train(data, {
            iterations: 1000,
            log: (d) => console.log(d),
            logPeriod: 50
        });

        const weights = JSON.stringify(net.toJSON());
        await db.ref('models/DataAI_0_8').set({ weights });
        console.log("✅ Успех! Модель в облаке.");
        process.exit(0);
    } catch (err) {
        console.error("💥 Ошибка:", err);
        process.exit(1);
    }
}

trainModel();
