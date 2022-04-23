import fetch from 'node-fetch';

const TRAVELER_ID = "5f5a27f2-a19e-4098-9829-827388e2ab1a"
const DEP_STATION = "YAS"
const ARR_STATION = "MEL"
const START_DATE = new Date()
const END_DATE = new Date(2022,6,1)

console.log(DEP_STATION, '=>', ARR_STATION)

for (var DATE = START_DATE; DATE < END_DATE; DATE.setDate(DATE.getDate() + 1)){
  // console.log(printDate(DATE))

  const r = await fetch("https://transportnsw.info/api/trainlink/search", {
    "headers": {
      "accept": "application/json",
      "accept-language": "en-GB,en-US;q=0.9,en;q=0.8",
      "content-type": "application/json",
      "sec-fetch-dest": "empty",
      "sec-fetch-mode": "cors",
      "sec-fetch-site": "same-origin",
      "sec-gpc": "1"
    },
    "referrer": "https://transportnsw.info/regional-bookings/select-trip?from=MEL&to=YAS&dateTime=2022-04-28T00:00:00&P_0_PT=A",
    "referrerPolicy": "strict-origin-when-cross-origin",
    "body": "{\"searchCriteria\":{\"travelerIds\":[\"" + TRAVELER_ID + "\"],\"departureStationCode\":\"" + DEP_STATION + "\",\"arrivalStationCode\":\"" + ARR_STATION + "\",\"departureDateTime\":\"" + printDate(DATE) + "T00:00:00\",\"travelers\":[{\"travelerType\":\"ADULT\"}],\"isReturnOffer\":false}}",
    "method": "POST",
    "mode": "cors",
    "credentials": "omit"
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
// const thing = 

// console.log(thing)

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