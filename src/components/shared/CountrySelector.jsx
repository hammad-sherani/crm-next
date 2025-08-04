"use client";

import countries from "world-countries";

interface Props {
  value: string;
  onChange: (value: string) => void;
}

const formattedCountries = countries.map((country) => ({
  label: country.name.common,
  value: country.cca2, // Use 2-letter ISO code
  flag: country.flags.svg,
}));

export default function CountrySelect({ value, onChange }: Props) {
  return (
    <select
      className="w-full border rounded-md p-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
      value={value}
      onChange={(e) => onChange(e.target.value)}
    >
      <option value="">Select Country</option>
      {formattedCountries.map((country) => (
        <option key={country.value} value={country.value}>
          {country.label}
        </option>
      ))}
    </select>
  );
}
