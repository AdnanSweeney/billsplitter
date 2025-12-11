export interface TaxPreset {
  id: string
  label: string
  rate: number // stored as decimal (e.g., 0.13 === 13%)
}

export const DEFAULT_TAX_PRESET_ID = 'ON'
export const CUSTOM_TAX_PRESET_ID = 'custom'

export const TAX_PRESETS: TaxPreset[] = [
  { id: 'AB', label: 'Alberta (5%)', rate: 0.05 },
  { id: 'BC', label: 'British Columbia (12%)', rate: 0.12 },
  { id: 'MB', label: 'Manitoba (12%)', rate: 0.12 },
  { id: 'NB', label: 'New Brunswick (15%)', rate: 0.15 },
  { id: 'NL', label: 'Newfoundland & Labrador (15%)', rate: 0.15 },
  { id: 'NS', label: 'Nova Scotia (15%)', rate: 0.15 },
  { id: 'NT', label: 'Northwest Territories (5%)', rate: 0.05 },
  { id: 'NU', label: 'Nunavut (5%)', rate: 0.05 },
  { id: 'ON', label: 'Ontario (13%)', rate: 0.13 },
  { id: 'PE', label: 'Prince Edward Island (15%)', rate: 0.15 },
  { id: 'QC', label: 'Quebec (14.975%)', rate: 0.14975 },
  { id: 'SK', label: 'Saskatchewan (11%)', rate: 0.11 },
  { id: 'YT', label: 'Yukon (5%)', rate: 0.05 },
]
