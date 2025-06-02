import fs from 'fs';
import path from 'path';

function convertDurationToMinutes(duration) {
  const match = duration.match(/(\d+)h\s*(\d+)?m?/);
  if (!match) return 0;
  const hours = parseInt(match[1], 10);
  const minutes = match[2] ? parseInt(match[2], 10) : 0;
  return hours * 60 + minutes;
}

function loadTrips(direction) {
  const filePath = path.join(process.cwd(), `${direction}.json`);
  return JSON.parse(fs.readFileSync(filePath, 'utf8'));
}

function sortByDeparture(trips) {
  return trips.sort((a, b) => a.departure.localeCompare(b.departure));
}

function getFixedSubset(trips, max = 5) {
  const sorted = sortByDeparture(trips);
  if (sorted.length <= max) return sorted;

  const indices = new Set();
  while (indices.size < max) {
    const randIndex = Math.floor(Math.random() * sorted.length);
    indices.add(randIndex);
  }

  return Array.from(indices).map(i => sorted[i]);
}

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

export default function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Only POST allowed' });
  }

  const { tripType, departureDate, returnDate, filter, direction } = req.body;

  try {
    const outboundTrips = loadTrips(direction);
    const outboundFiltered = outboundTrips.filter(trip => trip.date === departureDate);
    const outboundSubset = getFixedSubset(outboundFiltered);
    const outbound = applyFilter(outboundSubset, filter);

    let inbound = [];
    if (tripType === 'roundtrip' && returnDate) {
      const reverseDirection = direction === 'hamburg_to_amsterdam'
        ? 'amsterdam_to_hamburg'
        : 'hamburg_to_amsterdam';

      const inboundTrips = loadTrips(reverseDirection);
      const inboundFiltered = inboundTrips.filter(trip => trip.date === returnDate);
      const inboundSubset = getFixedSubset(inboundFiltered);
      inbound = applyFilter(inboundSubset, filter);
    }

    res.status(200).json({ outbound, inbound });

  } catch (err) {
    console.error('Error loading trips:', err);
    res.status(500).json({ error: 'Could not load trip data' });
  }
}