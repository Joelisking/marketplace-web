export enum InputTypes {
  SWITCH = 'switch',
  TEXT = 'text',
  LABEL = 'label',
  OTP = 'otp',
  EMAIL = 'email',
  MULTIPLE = 'multiple',
  NUMBER = 'number',
  PASSWORD = 'password',
  PHONE = 'phone',
  SELECT = 'select',
  ASYNC_SELECT = 'async-select',
  SPACE = 'space',
  PAGINATED_SELECT = 'paginated-select',
  MULTI = 'multi',
  DATE = 'date',
  RANGE = 'daterange',
  RADIO = 'radio',
  CHECKBOX = 'checkbox',
  TEXTAREA = 'textarea',
  RICHTEXT = 'richtext',
  UPLOAD = 'upload',
  DRAGNDROP = 'drag-n-drop',
  MOMENT = 'moment',
  TIME = 'time',
  IMAGE = 'image',
  BUTTON = 'button',
  SUBMIT = 'submit',
  COLOR = 'color',
  SPECIAL_SELECT = 'special-select',
}
export const bucketName = process.env.AWS_S3_BUCKET_NAME;
export const region = process.env.AWS_REGION;

export interface Option {
  label: string;
  value: string;
}

export enum TimeType {
  Time = 'time',
  Moment = 'moment',
}

export enum IsYesorNo {
  Yes = 1,
  No = 0,
}

export enum ECategory {
  Driver,
  Vehicle,
}

export const routes = {
  home: () => '/home',
  signin: () => '/signin',
  signout: () => '/signout',
  profile: () => '/profile',
  addDriver: () => `/admin/fleet-management/drivers/create`,
  resetPassword: () => '/reset-password',
  forgotPassword: () => '/forgot-password',
  setPassword: () => '/set-password',
  otpValidation: (params: { telephone: string }) =>
    `/otp/${params.telephone}`,
  settings: () => '/settings',
  newObservation: () => '/observations/create',
  newIncident: () => '/incidents/create',
  categories: () => 'categories',
  schedules: () => 'schedules',
  newSchedule: () => 'schedules/create',
  viewSchedule: (id: string) => `schedules/${id}/details`,
  planning: () => 'plannings',
  newPlanning: () => 'plannings/create',
  viewPlanning: (id: string) => `plannings/${id}/details`,
  editPlanning: (id: string) =>
    `/production/plannings/${id}/edit/bom`,
  editPlanningBom: () => `bom`,
  editPlanningInfo: () => `info`,
  editPlanningPackaging: () => `packaging`,
  editPlanningProcedure: () => `procedure`,
  editPackingOrder: () => `packing-order`,
  rawMaterials: () => '/warehouse/materials',
  viewMaterial: (id: string) => `/warehouse/materials/${id}/details`,
  vendors: () => `/procurement/vendors`,
  editVendor: (id: string) => `/procurement/vendors/${id}/edit`,
  viewScheduleRequisition: (scheduleId: string, productId: string) =>
    `/production/schedules/${scheduleId}/product/${productId}/requisition`,

  createChecklist: (id: string) =>
    `/warehouse/receiving-area/${id}/create-checklist`,
  createPackagingChecklist: (id: string) =>
    `/warehouse/packaging-receiving-area/${id}/create-checklist`,
  finishedProducts: () => 'finished-products',
  newEmployee: () => '/resource/employees/create',
  newRegulation: () => '/compliance/external/regulations/create',
  newInspection: () => '/inspections/create',
  newAudit: () => '/audits/create',
  certifications: () => '/compliance/internal/certifications',
  newCertification: () =>
    '/compliance/internal/certifications/create',
  observations: () => '/observations',
  inspections: () => '/inspections',
  regulations: () => '/compliance/external/regulations',
  newStockRequisition: () => 'stock-requisition/create',
  newRequisition: () => 'requisition/create',
  productionSchedules: () => '/production/schedules',
  audits: () => '/audits',
  findings: () => '/findings',
  editEmployee: (params: { id: string }) =>
    `/resource/employees/edit/${params.id}`,
  viewChecklist: (id: string) =>
    `/warehouse/receiving-area/${id}/view-checklist`,
  viewFinalPacking: (id: string) =>
    `/production/activities/${id}/final-packing`,
  viewBoard: (id: string) => `/production/activities/${id}/board`,
};

export const formatClock = (
  hours: number,
  minutes: number,
  light: boolean
) => {
  const result = `${hours.toString().padStart(2, '0')}:${minutes
    .toString()
    .padStart(2, '0')} ${light ? 'AM' : 'PM'}`;
  return result.trim(); // Ensure there are no extra spaces
};

export const DELIVERY_ZONES = [
  {
    id: 'A',
    name: 'Zone A',
    locations: [
      'Accra Mall',
      'Adjiringanor',
      'Airport',
      'American House',
      'Atomic Junction',
      'Bawaleshie',
      'East Legon',
      'Flowerpot',
      'Legon',
      'Ogbojo',
      'Shiashie',
      'UPSA',
    ],
  },
  {
    id: 'B',
    name: 'Zone B',
    locations: [
      '37',
      'Airport Hills',
      'Avenor',
      'Burma Camp',
      'Cantonments',
      'Dzorwulu',
      'East Airport',
      'Haatso',
      'Kisseiman',
      'Madina',
      'Manet Junction',
      'North Industrial Area',
      'Sankara',
      'Trassaco',
      'West Legon',
    ],
  },
  {
    id: 'C',
    name: 'Zone C',
    locations: [
      'Abeka',
      'Abelemkpe',
      'Achimota',
      'Adenta',
      'Agbogba',
      'Akweteyman',
      'Alajo',
      'Alhaji',
      'Ashale Botwe',
      'Borteyman',
      'Christian Village',
      'Circle',
      'Gimpa',
      'Kanda',
      'Kokomlemle',
      'Kotobabi',
      'Labadi',
      'Labone',
      'Lapaz',
      'Mamobi',
      'Mile 7',
      'Nanakrom',
      'Newtown',
      'Nima',
      'North Legon',
      'North Ridge',
      'Omanjor',
      'Osu',
      'Pigfarm',
      'Ridge',
      'Roman Ridge',
      'Spintex',
      'Tabora',
      'Tesano',
      'Teshie',
      'Tse Addo',
      'West Trassaco',
    ],
  },
  {
    id: 'D',
    name: 'Zone D',
    locations: [
      '18 Junction',
      'Accra Central',
      'Adabraka',
      'Adenta Frafraha',
      'Anyaa',
      'Awoshie',
      'Chantan',
      'Darkuman',
      'Dome',
      'Haatso Bohye',
      'Israel',
      'Jamestown',
      'Kaneshie',
      'Klagon',
      'Kwashieman',
      'Lakeside',
      'Makola Junction',
      'New Legon',
      'North Kaneshie',
      'Nungua',
      'Old Ashogman',
      'Pantang',
      'Santa Maria',
      'Taifa',
      'Tantra Hills',
      'Tudu',
    ],
  },
  {
    id: 'E',
    name: 'Zone E',
    locations: [
      'Abossey Okai',
      'Agbogbloshie',
      'Ashongman',
      'Ashongman Estates',
      'Dansoman',
      'East Legon Hills',
      'Korle Bu',
      'Kwabenya',
      'Lashibi',
      'Laterbiokoshie',
      'Mallam',
      'Mateheko',
      'McCarthy Hills',
      'Ofankor',
      'Pantang',
      'Sakumono',
      'Sakura',
      'Shukura',
      'Teiman',
      'Tema Comm. 18',
    ],
  },
  {
    id: 'F',
    name: 'Zone F',
    locations: [
      'Ablekuma',
      'Abokobi',
      'Agape',
      'Amrahia',
      'Ashaiman',
      'Ashaiman Lebanon',
      'Ayimensah',
      'Danfa',
      'Gbawe',
      'Glefe',
      'Mamprobi',
      'Oyarifa',
      'Pokuase',
      'SCC',
      'Santeo',
      'Sowutuom',
      'Tema Comm. 4-12',
      'Tema Comm. 22 Annex',
      'Tetegu',
      'Weija',
    ],
  },
  {
    id: 'G',
    name: 'Zone G',
    locations: [
      'Amanfrom',
      'Ashiyie',
      'Mayera',
      'Medie',
      'Michel Camp',
      'Oyibi',
      'Tema Comm. 1-3',
      'Tema Comm. 13-17',
      'Tema Comm. 19-24',
      'Tuba',
      'West Hills',
      'Weija Broadcasting',
    ],
  },
  {
    id: 'H',
    name: 'Zone H',
    locations: [
      'Afienya',
      'Amansaman',
      'Aplaku',
      'Tema Comm. 25',
      'Kasoa',
      'Kasoa Old Market',
      'Kotoku',
      'Kpone',
    ],
  },
  {
    id: 'I',
    name: 'Zone I',
    locations: [
      'Aburi',
      'Ashesi University',
      'Central University',
      'Dawhenya',
      'Doboro',
      'Dodowa',
      'Kasoa Millennium City',
      'Kokrobite',
      'New Tema',
      'Nsawam',
      'Peduase',
      'Prampram',
    ],
  },
  {
    id: 'J',
    name: 'Zone J',
    locations: ['Kumasi'],
  },
  {
    id: 'K',
    name: 'Zone K',
    locations: ['Outside Greater Accra Region'],
  },
];

export const getZoneById = (zoneId: string) => {
  return DELIVERY_ZONES.find((zone) => zone.id === zoneId);
};

export const getZoneByLocation = (location: string) => {
  return DELIVERY_ZONES.find((zone) =>
    zone.locations.some(
      (zoneLocation) =>
        zoneLocation.toLowerCase().includes(location.toLowerCase()) ||
        location.toLowerCase().includes(zoneLocation.toLowerCase())
    )
  );
};
