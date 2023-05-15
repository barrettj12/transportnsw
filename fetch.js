import fetch from 'node-fetch';

const DEP_STATION = "YAS"
const ARR_STATION = "MEL"
const START_DATE = new Date("18 May 2023")
const END_DATE = new Date("19 May 2023")

// Get traveler ID
const r = await fetch("https://transportnsw.info/api/trainlink/travelers", {
  "body": "[{\"travelerType\":\"ADULT\"}]", "method": "POST"
});
const data = await r.json()
const TRAVELER_ID = data["data"]["travelerIds"][0]["id"]
console.log(`got traveler ID ${TRAVELER_ID}`)

console.log(DEP_STATION, '=>', ARR_STATION)

for (var DATE = START_DATE; DATE <= END_DATE; DATE.setDate(DATE.getDate() + 1)){
  const r = await fetch("https://transportnsw.info/api/trainlink/search", {
    "body": "{\"searchCriteria\":{\"travelerIds\":[\"" + TRAVELER_ID + "\"],\"departureStationCode\":\"" + DEP_STATION + "\",\"arrivalStationCode\":\"" + ARR_STATION + "\",\"departureDateTime\":\"" + printDate(DATE) + "T00:00:00\",\"travelers\":[{\"travelerType\":\"ADULT\"}],\"isReturnOffer\":false}}",
    "method": "POST",
  });
  const data = await r.json()

  const prices = new Map()

  for (const offer of Object.values(data.included.offer)) {
    const id = offer.itineraryId
    const amt = parseFloat(offer.totalPrice.amount)

    if (!prices.has(id) || amt < prices.get(id)) {
      prices.set(id, amt)
    }
  }

  // Print results to terminal
  const trips = data.dictionaries.itinerary
  for (const [id, price] of prices) {
    const tripInfo = trips[id]
    // const depStation = tripInfo.departureStation.stationCode
    const depDate = new Date(tripInfo.departureStation.departureDateTime)
    // const arrStation = tripInfo.arrivalStation.stationCode
    const arrDate = new Date(tripInfo.arrivalStation.arrivalDateTime)

    console.log('$' + price, depDate.toDateString(), time(depDate), '=>', time(arrDate))
  }
}

function printT(obj) {
  console.log(obj, ":", typeof obj)
}

function time(date) {
  return printNum(date.getHours(), 2) + ':' + printNum(date.getMinutes(), 2)
}

function printDate(date) {
  return date.getFullYear() + '-' + printNum(date.getMonth()+1, 2) + '-' + printNum(date.getDate(), 2)
}

function printNum(num, digits) {
  return num.toLocaleString('en-US', {minimumIntegerDigits: digits, useGrouping:false})
}
