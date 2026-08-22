export const officeContacts = [
  {
    label: "Auckland",
    phone: process.env.NEXT_PUBLIC_PHONE_NUMBER || "09 873 4212",
    email: process.env.NEXT_PUBLIC_AUCKLAND_EMAIL,
    address: process.env.NEXT_PUBLIC_AUCKLAND_ADDRESS,
    addressUrl: process.env.NEXT_PUBLIC_AUCKLAND_ADDRESS_URL,
  },
  {
    label: "Wellington",
    phone: process.env.NEXT_PUBLIC_PHONE_NUMBER_WELLINGTON || "04 887 2270",
    email: process.env.NEXT_PUBLIC_WELLINGTON_EMAIL,
    address: process.env.NEXT_PUBLIC_WELLINGTON_ADDRESS,
    addressUrl: process.env.NEXT_PUBLIC_WELLINGTON_ADDRESS_URL,
  },
  {
    label: "Christchurch",
    phone: process.env.NEXT_PUBLIC_PHONE_NUMBER_CHRISTCHURCH || "03 667 2254",
    email: process.env.NEXT_PUBLIC_CHRISTCHURCH_EMAIL,
    address: process.env.NEXT_PUBLIC_CHRISTCHURCH_ADDRESS,
    addressUrl: process.env.NEXT_PUBLIC_CHRISTCHURCH_ADDRESS_URL,
  },
  {
    label: "Hamilton",
    phone: process.env.NEXT_PUBLIC_PHONE_NUMBER_HAMILTON,
    email: process.env.NEXT_PUBLIC_HAMILTON_EMAIL,
    address: process.env.NEXT_PUBLIC_HAMILTON_ADDRESS,
    addressUrl: process.env.NEXT_PUBLIC_HAMILTON_ADDRESS_URL,
  },
];

export function getPhoneHref(phoneNumber) {
  return phoneNumber ? `tel:${phoneNumber.replace(/[^\d+]/g, "")}` : undefined;
}
