import { z } from "zod";

export const agencySchema = z.object({
  // Step 1: Basics
  // Note: officialEmail and officialNumber removed as they are handled by backend session
  companyName: z.string().min(3, "Company name is required"),
  
  // Step 2: Legal & Branding
  licenseNumber: z.string().min(1, "License number is required"),
  city: z.string().min(1, "City is required"),
  officeAddress: z.string().min(5, "Address is required"),
  companyLogo: z.string().url("Please upload a logo"),
  
  // yearEstablished (Coerced to number for input safety)
  yearEstablished: z.coerce
    .number()
    .min(1800, "Invalid year")
    .max(new Date().getFullYear(), "Year cannot be in the future")
    .optional(),

  // companyBio
  companyBio: z.string().min(10, "Bio should be at least 10 characters").optional(),

  // Step 3: Owner
  ownerName: z.string().min(3, "Owner name is required"),
  ownerCNIC: z.string().regex(/^\d{5}-\d{7}-\d{1}$/, "Format: 00000-0000000-0"),
  ownerCNICFrontUrl: z.string().url("Upload CNIC Front"),
  ownerCNICBackUrl: z.string().url("Upload CNIC Back"),

  // Step 4: Verification
  // whatsappNumber (Optional field)
  whatsappNumber: z.string().min(10, "Valid WhatsApp number required").optional(),
  
  utilityBillUrl: z.string().url("Upload a utility bill for verification"),
  registrationCertificateUrl: z.string().url("Please upload your registration certificate"),
});