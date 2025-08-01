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
