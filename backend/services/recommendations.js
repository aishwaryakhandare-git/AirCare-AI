export function createRecommendations({ aqi, temperature, uvIndex }) {
  const safeOutside = aqi <= 100 && temperature < 35 && uvIndex < 8;
  const needsMask = aqi > 100;
  const highHeat = temperature >= 34;
  const highUv = uvIndex >= 7;

  return [
    {
      title: "Outdoor Safety",
      value: safeOutside ? "Safe with normal care" : "Limit long outdoor exposure",
      detail: safeOutside
        ? "Air and weather conditions are comfortable for most people."
        : "Prefer indoor plans or short outdoor breaks today."
    },
    {
      title: "Mask Recommendation",
      value: needsMask ? "Wear an N95 mask outside" : "Mask optional",
      detail: needsMask
        ? "Pollution levels may irritate lungs, eyes, and throat."
        : "Current AQI does not require a mask for healthy adults."
    },
    {
      title: "Sunscreen",
      value: highUv ? "SPF 50 recommended" : "SPF 30 is enough",
      detail: highUv
        ? "UV levels are high. Reapply sunscreen if you stay outside."
        : "Basic sun protection is suitable for short outdoor activity."
    },
    {
      title: "Water Intake",
      value: highHeat ? "Drink 3 to 4 liters" : "Drink 2 to 3 liters",
      detail: highHeat
        ? "Heat stress risk is higher. Hydrate before you feel thirsty."
        : "Keep steady hydration through the day."
    },
    {
      title: "Activity Suggestion",
      value: aqi <= 50 ? "Great for outdoor workouts" : aqi <= 100 ? "Light outdoor activity" : "Indoor exercise preferred",
      detail: "Choose the activity intensity based on breathing comfort."
    },
    {
      title: "Sensitive Groups",
      value: aqi > 100 || highHeat ? "Extra caution needed" : "Normal caution",
      detail: "Children, older adults, and people with asthma should watch symptoms closely."
    }
  ];
}
