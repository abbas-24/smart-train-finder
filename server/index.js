const express = require('express');
const fs = require('fs');
const path = require('path');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// takes time in "XXh XXm" format and converts it into total minutes
function convertDurationToMinutes(duration) {
  const match = duration.match(/(\d+)h\s*(\d+)?m?/);
  if (!match) return 0;
  const hours = parseInt(match[1], 10);
  const minutes = match[2] ? parseInt(match[2], 10) : 0;
  return hours * 60 + minutes;
}

// reads JSON file for either direction
function loadTrips(direction) {
  const filePath = path.join(__dirname, `${direction}.json`);
  return JSON.parse(fs.readFileSync(filePath, 'utf8'));
}

// sort by departure time
function sortByDeparture(trips) {
  return trips.sort((a, b) => a.departure.localeCompare(b.departure));
}

// randomly selects up to 5 trips after sorting by departure
function getFixedSubset(trips, max = 5) {
  const sorted = sortByDeparture(trips);
  if (sorted.length <= max) return sorted;

  // randomly picks max unique indices
  const indices = new Set();
  while (indices.size < max) {
    const randIndex = Math.floor(Math.random() * sorted.length);
    indices.add(randIndex);
  }

  return Array.from(indices).map(i => sorted[i]);
}

// sort trips based on selected filter
function applyFilter(trips, filter) {
  if (filter === 'fastest') {
    return [...trips].sort((a, b) => convertDurationToMinutes(a.duration) - convertDurationToMinutes(b.duration));
  } else if (filter === 'cheapest') {
    return [...trips].sort((a, b) => a.price - b.price);
  } else if (filter === 'least_changes') {
    return [...trips].sort((a, b) => a.changes - b.changes);
  }
  return trips;
}

// "API" route
app.post('/api/search', (req, res) => {
  const { tripType, departureDate, returnDate, filter, direction } = req.body;

  try {
    // outbound trips
    const outboundTrips = loadTrips(direction);
    const outboundFiltered = outboundTrips.filter(trip => trip.date === departureDate);
    const outboundSubset = getFixedSubset(outboundFiltered);
    const outbound = applyFilter(outboundSubset, filter);

    // inbound trips
    let inbound = [];
    if (tripType === 'roundtrip' && returnDate) {
      const reverseDirection =
        direction === 'hamburg_to_amsterdam'
          ? 'amsterdam_to_hamburg'
          : 'hamburg_to_amsterdam';

      const inboundTrips = loadTrips(reverseDirection);
      const inboundFiltered = inboundTrips.filter(trip => trip.date === returnDate);
      const inboundSubset = getFixedSubset(inboundFiltered);
      inbound = applyFilter(inboundSubset, filter);
    }

    // send results to frontend
    res.json({ outbound, inbound });

  } catch (err) {
    console.error('Error loading trips:', err);
    res.status(500).json({ error: 'Could not load trip data' });
  }
});

// start server
const PORT = 4000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});