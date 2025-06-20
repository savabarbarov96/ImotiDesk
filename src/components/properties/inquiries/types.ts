export interface InquiryFormData {
  name: string;
  email: string;
  phone: string;
  message: string;
  preferred_contact_time?: string;
}

export interface InquirySubmissionProps {
  propertyId: string;
  propertyTitle: string;
}
