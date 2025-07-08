const axios = require('axios');
const { odata_url, login, password } = require('../config/onec.json');

/**
 * Добавляет новые показания в регистр ПоказанияСчетчиков
 */
async function addMeterReadingTo1C({ userId, meterValue, date = new Date() }) {
  await axios.post(
    `${odata_url}ПоказанияСчетчиков`,
    {
      Владелец_Key: userId, // Ref_Key пользователя (владельца участка или лицевого счета)
      Дата: date.toISOString(),
      Значение: meterValue
    },
    { auth: { username: login, password } }
  );
}

/**
 * Обновляет или создает запись в регистре ПоследниеПоказанияСчетчиковМобильноеПриложениеСНТ
 */
async function setLatestMeterReading1C({ userId, meterValue, date = new Date() }) {
  // 1. Попробовать найти текущую запись
  const res = await axios.get(
    `${odata_url}ПоследниеПоказанияСчетчиковМобильноеПриложениеСНТ?$filter=Владелец_Key eq guid'${userId}'`,
    { auth: { username: login, password } }
  );
  if (res.data.value.length > 0) {
    // Обновляем существующую запись (обычно в OData 1С нельзя PATCH, но можно DELETE+POST или использовать обработку)
    const recKey = res.data.value[0].Ref_Key;
    await axios.delete(
      `${odata_url}ПоследниеПоказанияСчетчиковМобильноеПриложениеСНТ(guid'${recKey}')`,
      { auth: { username: login, password } }
    );
  }
  // Создаём новую запись
  await axios.post(
    `${odata_url}ПоследниеПоказанияСчетчиковМобильноеПриложениеСНТ`,
    {
      Владелец_Key: userId,
      Дата: date.toISOString(),
      Значение: meterValue
    },
    { auth: { username: login, password } }
  );
}

module.exports = { addMeterReadingTo1C, setLatestMeterReading1C };