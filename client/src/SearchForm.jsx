import { useState } from 'react';

export default function SearchForm({ onSearch }) {
  const [tripType, setTripType] = useState("oneway");
  const [departureDate, setDepartureDate] = useState("");
  const [returnDate, setReturnDate] = useState("");
  const [overnightStays, setOvernightStays] = useState("");
  const [filter, setFilter] = useState("");
  const [direction, setDirection] = useState("hamburg_to_amsterdam");

  const handleSubmit = (e) => {
    e.preventDefault();

    // basic checks for roundtrip
    if (tripType === "roundtrip") {
      if (!departureDate || !returnDate) {
        alert("Please select both departure and return dates.");
        return;
      }

      if (returnDate < departureDate) {
        alert("Return date cannot be before departure date.");
        return;
      }
    }

    // pass everything to the parent
    onSearch({ tripType, departureDate, returnDate, overnightStays, filter, direction });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 mb-8">
      <div>
        <label className="block font-medium mb-1">Trip Type</label>
        <select value={tripType} onChange={e => setTripType(e.target.value)} className="border rounded px-3 py-2 w-full">
          <option value="oneway">One-way</option>
          <option value="roundtrip">Roundtrip</option>
        </select>
      </div>

      <div>
        <label className="block font-medium mb-1">Direction</label>
        <select value={direction} onChange={e => setDirection(e.target.value)} className="border rounded px-3 py-2 w-full">
          <option value="hamburg_to_amsterdam">Hamburg → Amsterdam</option>
          <option value="amsterdam_to_hamburg">Amsterdam → Hamburg</option>
        </select>
      </div>

      <div>
        <label className="block font-medium mb-1">Departure Date</label>
        <input type="date" value={departureDate} onChange={e => setDepartureDate(e.target.value)} className="border rounded px-3 py-2 w-full" />
      </div>

      {tripType === "roundtrip" && (
        <div>
          <label className="block font-medium mb-1">Return Date</label>
          <input type="date" value={returnDate} onChange={e => setReturnDate(e.target.value)} className="border rounded px-3 py-2 w-full" />
        </div>
      )}

      <div>
        <label className="block font-medium mb-1">Filter</label>
        <select value={filter} onChange={e => setFilter(e.target.value)} className="border rounded px-3 py-2 w-full">
          <option value="">-- None --</option>
          <option value="fastest">Fastest</option>
          <option value="cheapest">Cheapest</option>
          <option value="least_changes">Least Changes</option>
        </select>
      </div>

      <button
        type="submit"
        className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
      >
        Search
      </button>
    </form>
  );
}