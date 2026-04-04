export interface CheckoutDetails {
  firstName: string;
  lastName: string;
  companyName?: string;
  countryRegion: string;
  streetAddress: string;
  addressLine2?: string;
  cityDistrict?: string;
  phoneNumber: string;
  emailAddress: string;
  orderNotes?: string;
}