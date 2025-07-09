
const axios = require("axios");
const { odata_url, login, password } = require("./config/onec.json");

async function getMeterReadings(userId) {
  const res = await axios.get(
    `${odata_url}ПоказанияСчетчиков?$filter=Владелец_Key eq guid'${userId}'`,
    { auth: { username: login, password } }
  );
  return res.data.value;
}

async function addMeterReading({ userId, meterValue, date = new Date() }) {
  await axios.post(
    `${odata_url}ПоказанияСчетчиков`,
    {
      Владелец_Key: userId,
      Дата: date.toISOString(),
      Значение: meterValue
    },
    { auth: { username: login, password } }
  );
}

module.exports = { getMeterReadings, addMeterReading };