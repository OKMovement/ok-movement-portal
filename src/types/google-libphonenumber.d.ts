declare module "google-libphonenumber" {
  export class PhoneNumberUtil {
    static getInstance(): PhoneNumberUtil;
    parseAndKeepRawInput(phoneNumber: string): unknown;
    isValidNumber(phoneNumber: unknown): boolean;
  }
}
