export type ServiceAvailability = {
  dayOfWeek: 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday' | 'sunday';
  startTime: string;
  endTime: string;
};

export type ServiceFormFields = {
  name: boolean;
  email: boolean;
  phone: boolean;
  additionalParticipants: boolean;
};

export type ServiceAdvancedSettings = {
  requireConfirmation: boolean;
  allowRescheduling: boolean;
  sendReminders: boolean;
  collectPaymentUpfront: boolean;
};

export type Service = {
  title: string;
  description: string;
  slug: string;
  duration: number;
  price: number;
  location: string;
  status: 'active' | 'disabled';
  availability: ServiceAvailability[];
  formFields: ServiceFormFields;
  advancedSettings: ServiceAdvancedSettings;
}; 