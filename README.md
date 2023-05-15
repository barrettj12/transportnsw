# transportnsw

I did some reverse engineering of the NSW TrainLink API, so I could find the
cheapest day to travel. This repo contains the script I used to do this.

To download dependencies needed for the script:
```
npm ci
```

Open `fetch.js` and set the constants `DEP_STATION`, `ARR_STATION`,
`START_DATE`, `END_DATE` to your desired values.

To run the script:
```
node .
```

I welcome any PRs to make this script more robust/flexible/user-friendly.
