const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const { getMeterReadings, addMeterReading } = require('./backend_services_onec');

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Получить показания
app.get('/api/meters/:userId', async (req, res) => {
  try {
    const readings = await getMeterReadings(req.params.userId);
    res.json(readings);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// Добавить показание
app.post('/api/meters', async (req, res) => {
  try {
    const { userId, meterValue } = req.body;
    await addMeterReading({ userId, meterValue });
    res.json({ status: 'ok' });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// Запуск сервера
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Backend started on port ${PORT}`));
