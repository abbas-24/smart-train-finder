import { useState } from 'react';
import SearchForm from './SearchForm';
import Results from './Results';

export default function App() {
  // state for storing trips returned from backend
  const [searchResults, setSearchResults] = useState({});

  // state to track which trips the user selects
  const [selectedOutbound, setSelectedOutbound] = useState(null);
  const [selectedInbound, setSelectedInbound] = useState(null);

  // triggered when form is submitted
  const handleSearch = async ({ tripType, departureDate, returnDate, overnightStays, filter, direction }) => {
    const response = await fetch('https://smart-train-finder.onrender.com/api/search', {
    //const response = await fetch('http://localhost:4000/api/search', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        tripType,
        departureDate,
        returnDate,
        overnightStays,
        filter,
        direction
      }),
    });

    if (response.ok) {
      const data = await response.json();
      setSearchResults(data);
      // reset selections after new search
      setSelectedOutbound(null);
      setSelectedInbound(null);
    } else {
      console.error("Search failed.");
    }
  };

  // total trip cost based on selected options
  const totalPrice = (selectedOutbound?.price || 0) + (selectedInbound?.price || 0);

  return (
    <div className="min-h-screen bg-gray-100 py-10 px-4">
      <div className="bg-white rounded-2xl shadow-lg p-6 max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-6 text-center text-blue-700">Train Trip Finder</h1>
        <SearchForm onSearch={handleSearch} />
        <Results
          results={searchResults}
          onSelectOutbound={setSelectedOutbound}
          onSelectInbound={setSelectedInbound}
          selectedOutbound={selectedOutbound}
          selectedInbound={selectedInbound}
        />
        {(selectedOutbound || selectedInbound) && (
          <div className="mt-8 p-6 border rounded-lg shadow bg-blue-50">
            <h2 className="text-xl font-semibold mb-4 text-blue-800">Your Selected Trips</h2>
            {selectedOutbound && (
              <div className="mb-2">
                <strong>Outbound:</strong> {selectedOutbound.departure} → {selectedOutbound.arrival}, €{selectedOutbound.price}
              </div>
            )}
            {selectedInbound && (
              <div className="mb-2">
                <strong>Inbound:</strong> {selectedInbound.departure} → {selectedInbound.arrival}, €{selectedInbound.price}
              </div>
            )}
            <p className="font-bold mt-3 text-lg">Total Cost: €{totalPrice.toFixed(2)}</p>
          </div>
        )}
      </div>
    </div>
  );
}
