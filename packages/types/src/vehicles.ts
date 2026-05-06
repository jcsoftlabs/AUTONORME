export const VEHICLE_DATA = {
  Toyota: ['Hilux', 'Land Cruiser', 'RAV4', 'Corolla', '4Runner', 'Tacoma', 'Hiace', 'Prado', 'Fortuner'],
  Nissan: ['Patrol', 'Frontier', 'X-Terra', 'Navara', 'Sentra', 'Urvan', 'Pathfinder'],
  Suzuki: ['Grand Vitara', 'Jimny', 'Swift', 'Vitara', 'Alto', 'Ertiga'],
  Honda: ['CR-V', 'Civic', 'Accord', 'HR-V', 'Pilot', 'Fit'],
  Hyundai: ['Tucson', 'Santa Fe', 'Elantra', 'Accent', 'H-1', 'Creta'],
  Kia: ['Sportage', 'Sorento', 'Rio', 'Picanto', 'K2700'],
  Mitsubishi: ['L200', 'Montero', 'Pajero', 'Outlander', 'ASX', 'Canter'],
  Ford: ['Ranger', 'F-150', 'Explorer', 'Everest', 'Escape'],
  Isuzu: ['D-Max', 'MU-X', 'N-Series'],
  Mazda: ['BT-50', 'CX-5', 'CX-9', 'Mazda3'],
  Chevrolet: ['Colorado', 'Tahoe', 'Equinox', 'Silverado'],
  Jeep: ['Wrangler', 'Grand Cherokee', 'Compass'],
  Volkswagen: ['Amarok', 'Tiguan', 'Jetta'],
} as const;

export type VehicleMake = keyof typeof VEHICLE_DATA;

export const YEARS = Array.from({ length: 36 }, (_, i) => 2025 - i); // 2025 down to 1990
