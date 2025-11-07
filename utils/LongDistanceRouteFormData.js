export const servicePropertyMap = {
    Residential: [

        { value: "Apartment", label: "Apartment", price: 0 },
        { value: "3 Bedroom House", label: "3 Bedroom", price: 0 },
        { value: "4+ Bedroom House", label: "Last-Minute Movers", price: 0 },
        { value: "Storage Move", label: "Storage Move", price: 0 },
        { value: "Piano", label: "Piano", price: 0 },
        
        { value: "Senior Citizen Move", label: "Senior Citizen Move", price: 0 },
    ],
    Commercial: [
               { value: "Small Office Move", label: "Small Office Move", price: 0 },
               { value: "Large Office Move", label: "Large Office Move", price: 0 },
               { value: "Warehouse Move", label: "Warehouse Move", price: 0 },
                { value: "Inventory Move", label: "Inventory Move", price: 0 },
        // Add more commercial services as needed
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
