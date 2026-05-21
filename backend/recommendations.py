def create_recommendations(aqi, temperature, uv_index):
    safe_outside = aqi <= 100 and temperature < 35 and uv_index < 8
    needs_mask = aqi > 100
    high_heat = temperature >= 34
    high_uv = uv_index >= 7

    return [
        {
            "title": "Outdoor Safety",
            "value": "Safe with normal care" if safe_outside else "Limit long outdoor exposure",
            "detail": "Air and weather conditions are comfortable for most people."
            if safe_outside
            else "Prefer indoor plans or short outdoor breaks today.",
        },
        {
            "title": "Mask Recommendation",
            "value": "Wear an N95 mask outside" if needs_mask else "Mask optional",
            "detail": "Pollution levels may irritate lungs, eyes, and throat."
            if needs_mask
            else "Current AQI does not require a mask for healthy adults.",
        },
        {
            "title": "Sunscreen",
            "value": "SPF 50 recommended" if high_uv else "SPF 30 is enough",
            "detail": "UV levels are high. Reapply sunscreen if you stay outside."
            if high_uv
            else "Basic sun protection is suitable for short outdoor activity.",
        },
        {
            "title": "Water Intake",
            "value": "Drink 3 to 4 liters" if high_heat else "Drink 2 to 3 liters",
            "detail": "Heat stress risk is higher. Hydrate before you feel thirsty."
            if high_heat
            else "Keep steady hydration through the day.",
        },
        {
            "title": "Activity Suggestion",
            "value": "Great for outdoor workouts"
            if aqi <= 50
            else "Light outdoor activity"
            if aqi <= 100
            else "Indoor exercise preferred",
            "detail": "Choose the activity intensity based on breathing comfort.",
        },
        {
            "title": "Sensitive Groups",
            "value": "Extra caution needed" if aqi > 100 or high_heat else "Normal caution",
            "detail": "Children, older adults, and people with asthma should watch symptoms closely.",
        },
    ]
