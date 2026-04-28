
export function generateWhatsAppLeadURL(property) {
  const adminNumber = process.env.NEXT_PUBLIC_ADMIN_WHATSAPP_NUMBER;
  const siteURL = process.env.NEXT_PUBLIC_SITE_URL;

  const propertyURL = `${siteURL}/properties/${property._id}`;

  const message = [
    `Hi! I'm interested in *${property.title}* listed on Leads to Keys.`,
    ``,
    propertyURL,
    ``,
    `*Kindly do not edit this message to ensure your inquiry is received correctly.*`,
  ].join("\n");

  const encoded = encodeURIComponent(message);

  return `https://api.whatsapp.com/send/?phone=${adminNumber}&text=${encoded}&type=phone_number&app_absent=0`;
}