export const servicePropertyMap = {
   Residential: [
    { value: "Apartment",            label: "Apartment",                          price: 0 },
    { value: "Studio / 1 Bedroom",           label: "Studio / 1 Bedroom",                 price: 0 },
    { value: "2 Bedroom House",            label: "2 Bedroom House",                    price: 0 },
    { value: "3 Bedroom House",            label: "3 Bedroom House",                    price: 0 },
    { value: "4+ Bedroom House",       label: "4+ Bedroom House",                   price: 0 },
    { value: "Single Item",     label: "Single Item",            price: 0 },
    { value: "Storage Move",         label: "Storage Move",                        price: 0 },
    { value: "Piano Move",           label: "Piano Move",                          price: 0 },
    { value: "Pool Table Move",      label: "Pool Table Move",                     price: 0 },
    { value: "Senior Citizen Move",  label: "Senior Citizen Move",                 price: 0 },
    { value: "Partial Load / Backload",     label: "Partial Load / Backload",             price: 0 },
  ],
  Commercial: [
    { value: "Small Office (≤5 staff)",         label: "Small Office (≤5 staff)",             price: 0 },
    { value: "Medium Office (6–20 staff)",        label: "Medium Office (6–20 staff)",          price: 0 },
    { value: "Large Office (20+ staff)",         label: "Large Office (20+ staff)",            price: 0 },
    { value: "Retail / Shop Relocation",          label: "Retail / Shop Relocation",            price: 0 },
    { value: "Hospitality (Café/Restaurant/Bar)",          label: "Hospitality (Café/Restaurant/Bar)",   price: 0 },
    { value: "Medical / Clinic",       label: "Medical / Clinic",                    price: 0 },
    { value: "Warehouse / Distribution",            label: "Warehouse / Distribution",            price: 0 },
    { value: "Inventory Transfer",                  label: "Inventory Transfer",                  price: 0 },
    { value: "IT & Server Move",                    label: "IT & Server Move",                    price: 0 },
    { value: "Events / Trade Show Logistics",       label: "Events / Trade Show Logistics",       price: 0 },
    { value: "Storage Unit Relocation",             label: "Storage Unit Relocation",             price: 0 },
  ],
 
};

// utils/getQuoteFormData.js

export const LongDistanceRouteFormData = [

    {
        id: 'firstname',
        label: 'First name',
        type: 'text',
        required: true,
        autoComplete: "given-name",
        validation: value => {
            if (typeof value === 'string') {
                return value.trim().length > 2;
            }
            return false;
        },
        errorMessage: 'First name should be at least 3 characters long'
    },
   
    {
        id: 'email',
        label: 'Email address',
        type: 'email',
        required: true,
        autoComplete: "email",
        validation: value => /\S+@\S+\.\S+/.test(value),
        errorMessage: 'Enter a valid email address'
    },
    {
        id: 'phone',
        label: 'Phone number',
        type: 'tel',
        required: false,
        autoComplete: "tel",
        validation: value => {
            const cleanPhone = (value || '').replace(/[^0-9]/g, '');
            return cleanPhone.length > 6; // Matches numbers having more than 6 characters
        },
        errorMessage: 'Please enter a valid New Zealand phone number'
    },
    // {
    //     id: 'pickUpAddress',
    //     label: 'Moving from',
    //     type: 'text',
    //     required: false,
    // },
    // {
    //     id: 'dropOffAddress',
    //     label: 'Moving to',
    //     type: 'text',
    //     required: false,
    // },
  
    {
        id: 'propertyType',
        label: 'Property type',
        type: 'select', // or 'radio' for single selection
        options: [
            { value: 'Residential', label: 'Residential' },
            { value: 'Commercial', label: 'Commercial' },
        ],
        required: false,
        multiple: false
    },
    {
        id: 'moveType',
        label: 'What are you moving?',
        type: 'chip', // or 'radio' for single selection
        multiple: true,
        priceType: "fixed",
        options: [], // Will be populated dynamically
        required: false, // Make it required if necessary
    },
    {
        id: 'date',
        label: 'Preffered date of move',
        type: 'datePicker',
        required: false,
    },
    {
        id: 'message',
        label: 'Message (optional)',
        type: 'textarea',
        required: false,
    },
];
