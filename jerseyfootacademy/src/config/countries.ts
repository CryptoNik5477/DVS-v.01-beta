/** Display names for the destination countries we ship to (grouped by zone). */
export const countryNames: Record<string, string> = {
  TH: "Thailand", SG: "Singapore", MY: "Malaysia", VN: "Vietnam", ID: "Indonesia",
  PH: "Philippines", JP: "Japan", KR: "South Korea", CN: "China", HK: "Hong Kong",
  TW: "Taiwan", IN: "India", AE: "UAE", SA: "Saudi Arabia",
  FR: "France", DE: "Germany", ES: "Spain", IT: "Italy", GB: "United Kingdom",
  PT: "Portugal", NL: "Netherlands", BE: "Belgium", CH: "Switzerland", SE: "Sweden",
  NO: "Norway", PL: "Poland", AT: "Austria", IE: "Ireland",
  US: "United States", CA: "Canada", MX: "Mexico",
  BR: "Brazil", AR: "Argentina", CL: "Chile", CO: "Colombia", PE: "Peru", UY: "Uruguay",
  ZA: "South Africa", NG: "Nigeria", EG: "Egypt", MA: "Morocco", GH: "Ghana",
  SN: "Senegal", CI: "Côte d'Ivoire", CM: "Cameroon", DZ: "Algeria", TN: "Tunisia",
  AU: "Australia", NZ: "New Zealand", FJ: "Fiji",
};

export const countryOptions = Object.entries(countryNames)
  .map(([code, name]) => ({ code, name }))
  .sort((a, b) => a.name.localeCompare(b.name));
