# transportnsw

I did some reverse engineering of the NSW TrainLink API, so I could find the cheapest day to travel. This repo contains the script I used to do this.

The core ingredients are all here, but it's not super user-friendly - you will have to do a bit of hacking to get it working. Here is what I suggest:
1. Go to [the NSW TrainLink booking page](https://transportnsw.info/regional-bookings/) and fill out *any* search you like.
2. On the next page, open Developer Tools > Network tab, and hit reload.
3. You should see a request made to https://transportnsw.info/api/trainlink/search. If you look at the request payload, you'll see a `travelerIds` field.
4. Copy the ID here and paste it as the value of `TRAVELER_ID` in `fetch.js`.
5. Set the `DEP_STATION`, `ARR_STATION`, `START_DATE` and `END_DATE` constants to your desired values. `START_DATE` and `END_DATE` determine the date range which will be queried.
6. Run the script with `node`.

I welcome any improvements to make this script more robust/flexible/user-friendly.
