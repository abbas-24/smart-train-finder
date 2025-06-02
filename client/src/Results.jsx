export default function Results({ results, onSelectOutbound, onSelectInbound, selectedOutbound, selectedInbound }) {
  // function to render list of trips
  const renderTripList = (label, trips, onSelect, selectedTrip) => (
    <div className="mb-8">
      <h3 className="text-lg font-semibold mb-4 text-blue-800">{label} Trips</h3>
      {trips.length > 0 ? (
        <div className="space-y-3">
          {trips.map((trip, idx) => {
            const isSelected = trip === selectedTrip;
            return (
              <div
                key={`${label}-${idx}`}
                className={`border p-4 rounded-xl shadow-sm cursor-pointer transition-colors ${
                  isSelected
                    ? 'bg-blue-100 border-blue-400'
                    : 'hover:bg-gray-50 bg-white'
                }`}
                onClick={() => onSelect(trip)}
              >
                <p className="font-medium text-blue-600">Option #{idx + 1}</p>
                <p><strong>Departure:</strong> {trip.departure}</p>
                <p><strong>Arrival:</strong> {trip.arrival}</p>
                <p><strong>Duration:</strong> {trip.duration}</p>
                <p><strong>Price:</strong> €{trip.price}</p>
                <p><strong>Changes:</strong> {trip.changes}</p>
                <p><strong>Carrier:</strong> {trip.carrier}</p>
              </div>
            );
          })}
        </div>
      ) : (
        <p className="text-gray-600">No {label.toLowerCase()} trips found.</p>
      )}
    </div>
  );

  return (
    <div className="mt-6">
      <h2 className="text-2xl font-semibold mb-4 text-center text-blue-700">Search Results</h2>
      {results.outbound &&
        renderTripList('Outbound', results.outbound, onSelectOutbound, selectedOutbound)}
      {results.inbound &&
        renderTripList('Inbound', results.inbound, onSelectInbound, selectedInbound)}
    </div>
  );
}