"""
Quick script to mock train trip data between Hamburg and Amsterdam.
Generates data for one year and saves it to JSON files.
"""

import json
import random
from datetime import datetime, timedelta

def generate_trip(departure_time, direction, date):
    changes = random.randint(0, 2)
    
    # Duration based on number of changes
    if changes == 0:
        base_duration_minutes = random.randint(300, 360)  # 5h–6h
    else:
        base_duration_minutes = random.randint(360, 540)  # 6h–9h

    price = round(random.uniform(29.99, 99.99), 2)
    carrier = random.choice(["NS", "DB", "NS/DB", "NS Intercity"])
    
    departure_dt = datetime.strptime(f"{date} {departure_time}", "%Y-%m-%d %H:%M")
    arrival_dt = departure_dt + timedelta(minutes=base_duration_minutes)
    
    duration = f"{base_duration_minutes // 60}h {base_duration_minutes % 60}m"
    
    return {
        "duration": duration,
        "price": price,
        "changes": changes,
        "departure": departure_dt.strftime("%H:%M"),
        "arrival": arrival_dt.strftime("%H:%M"),
        "carrier": carrier,
        "date": date
    }

def generate_trips_for_direction(direction, filename):
    start_date = datetime(2025, 6, 1)
    end_date = datetime(2026, 6, 1)
    delta = timedelta(days=1)
    trips = []

    while start_date < end_date:
        num_trips = random.randint(6, 7)
        departure_times = random.sample(
            ["06:00", "07:15", "08:30", "10:00", "11:30", "13:00", "15:00", "16:45", "18:00", "19:30", "21:45"],
            num_trips
        )
        for dep_time in departure_times:
            trips.append(generate_trip(dep_time, direction, start_date.strftime("%Y-%m-%d")))
        start_date += delta

    with open(filename, "w") as f:
        json.dump(trips, f, indent=2)

# Generate both directions
generate_trips_for_direction("hamburg_to_amsterdam", "hamburg_to_amsterdam.json")
generate_trips_for_direction("amsterdam_to_hamburg", "amsterdam_to_hamburg.json")

print("Generated mock data for both directions.")