"use client";

import React, { useState, useEffect } from "react";
import Input from "./InputFields/Input";
import { getQuoteFormData } from "@/utils/getQuoteFormData";
import { servicePropertyMap } from "@/utils/getQuoteFormData"; // Import the service mapping
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import axios from "axios";
import Alert from "@mui/material/Alert";
import Container from "@mui/material/Container";
import { useRouter } from "next/navigation";
import Typography from "@mui/material/Typography";
import GoogleMapsLoader from "@/Components/GoogleMaps/GoogleMapsLoader";
import GoogleAutocomplete from "@/Components/GoogleMaps/GoogleAutoComplete";
import styles from "./FormStyle.module.scss";
import dayjs from "dayjs";

export default function GetQuoteForm({
  className,
  formName = "Get a Quote Form",
  title = "Please fill out a form",
  hideTitle = false,
}) {
  const router = useRouter();
  const [formData, setFormData] = useState({
    firstname: "", // Default empty string to make it controlled
    email: "",
    phone: "",
    address: "",
    pickUpAddress: "",
    dropOffAddress: "",
    propertyType: "",
    date: null,
    service: [],
    message: "",
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState(false);
  const [newSubmission, setNewSubmission] = useState(false);
  const [mapsLoaded, setMapsLoaded] = useState(false);

console.log(formData)

  const handleChange = (id, value, isSelectMultiple) => {
    let newValue = value.target ? value.target.value : value;

    setFormData((prevFormData) => ({
      ...prevFormData,
      [id]: newValue,
    }));

    // Reset errors on change
    if (errors[id]) {
      setErrors({ ...errors, [id]: false });
    }
  };

  const handleBlur = (id, validationFunction) => {
    if (!validationFunction(formData[id])) {
      setErrors({ ...errors, [id]: true });
    }
  };

  // Submit handler
  const submitHandler = (e) => {
    e.preventDefault(); // Prevent default form submission if using form tag

    let allFieldsValid = true;
    const newErrors = {};

    // Loop through each field to check if it's required and valid
    getQuoteFormData.forEach((field) => {
      if (field.required) {
        if (field.type === "chip") {
          if (!formData[field.id] || formData[field.id].length === 0) {
            newErrors[field.id] = true;
            allFieldsValid = false;
          }
        } else if (
          !formData[field.id] ||
          !field.validation(formData[field.id])
        ) {
          newErrors[field.id] = true;
          allFieldsValid = false;
        }
      }
    });

    setErrors(newErrors);
    // If any required field is invalid, stop and don't make API calls
    if (!allFieldsValid) {
      return; // Stop the function if any field is invalid o  r empty
    }
    let formattedDate = dayjs(formData.datePicker).valueOf() 


    const dataPayload = {
      email: formData.email,
      formName: formName,
      message: `First Name: ${formData.firstname} \nEmail: ${
        formData.email
      } \nPhone Number: ${formData.phone} \n Pick Up Address: ${
        formData.pickUpAddress
      }\n Drop Off Address: ${
        formData.dropOffAddress
      }
      \nProperty Type: ${
        formData.propertyType
      }
       \nMove Date: ${
        formattedDate
      }
       \nServices Required: ${formData["service"].join(", ")} \n Message: ${
        formData.message
      } `,
      portalID: "49166221",
      hubspotFormID: "e5261de6-f0a5-4071-99e7-a95890d23d08",
      hubspotFormObject: [
        { name: "firstname", value: formData.firstname },
        { name: "email", value: formData.email },
        { name: "phone", value: formData.phone },
        { name: "pick_up_address", value: formData.pickUpAddress },
        { name: "drop_off_address", value: formData.dropOffAddress },
        { name: "property_type", value: formData.propertyType },
        { name: "move_date", value: formattedDate }, 
        { name: "services_required", value: formData["service"].join(", ") },
        { name: "message", value: formData.message },
      ],
    };
    console.log("Date: ", formattedDate);
console.log(dataPayload)
    setIsLoading(true);
  
    // Hubspot config
    var configHubspot = {
      method: "post",
      url: "/api/submit-hubspot-form",
      headers: { "Content-Type": "application/json" },
      data: dataPayload,
    };
    // Mailgun config
    var configSendMail = {
      method: "post",
      url: "/api/sendmail",
      headers: { "Content-Type": "application/json" },
      data: dataPayload,
    };

    // const facebookData = {
    //     method: 'post',
    //     url: '/api/facebook-conversion-api',
    //     headers: { 'Content-Type': 'application/json' },
    //     data: {
    //         data: {
    //         event: "Lead",
    //         firstName: formData.firstname,
    //         email: formData.email,
    //         phone: formData.phone,
    //         county: "Bay of Plenty",
    //         eventSourceUrl: window.location.href,
    //         serviceRequested: formData['service'].join(", ")
    //     }

    //     }
    // }

    Promise.all([axios(configHubspot), axios(configSendMail)])
      .then(function (response) {
        console.log(response);
        if (response[0].status === 200) {
          setIsLoading(false);
          setIsSuccess(true);
          setNewSubmission(false);
          setError(false);
          router.push("/form-submitted/thank-you");
        } else {
          setIsLoading(false);
          setIsSuccess(false);
          setError(true);
          setNewSubmission(true);
        }
      })
      .catch(function (error) {
        console.log(error);
        setIsLoading(false);
        setIsSuccess(false);
        setError(true);
        setNewSubmission(true);
      });
  };

  // Get the filtered service options based on propertyType
  const getFilteredServiceOptions = () => {
    if (formData.propertyType && servicePropertyMap[formData.propertyType]) {
      return servicePropertyMap[formData.propertyType];
    }
    return [];
  };

  // Initialize Google Maps script
  const handleLoad = () => {
    setMapsLoaded(true);
  };
  // is address field
  const isAddressField = (id) => {
    return ["address", "pickUpAddress", "dropOffAddress"].includes(id);
  };

  const formInputs = getQuoteFormData.map((field, index) => {
    if (field.id === "service") {
      const filteredOptions = getFilteredServiceOptions();
      return (
        <Input
          lightTheme={true}
          key={index}
          label={field.label}
          type={field.type}
          value={formData[field.id]}
          onChange={(newValue) =>
            handleChange(field.id, newValue, field.multiple)
          }
          onBlur={
            field.required ? () => handleBlur(field.id, field.validation) : null
          }
          required={field.required}
          autoComplete={field.autoComplete}
          isInvalid={errors[field.id]}
          errorMessage={field.errorMessage}
          options={filteredOptions}
          multipleValue={field.multiple}
        />
      );
    } else if (isAddressField(field.id)) {
      return (
        <React.Fragment key={field.id}>
          {!mapsLoaded && <GoogleMapsLoader onLoad={handleLoad} />}
          {mapsLoaded && (
            <GoogleAutocomplete
              className="mt-16"
              label={field.label}
              value={formData[field.id]} // pickUpAddress / dropOffAddress / address
              onChange={(value) => handleChange(field.id, value, false)}
              onSelect={(selectedAddress) => {
                // When user selects an address from suggestions
                setFormData((prevData) => ({
                  ...prevData,
                  [field.id]: selectedAddress,
                }));
                // Reset errors if any
                if (errors[field.id]) {
                  setErrors({ ...errors, [field.id]: false });
                }
              }}
              required={field.required}
              autoComplete={field.autoComplete}
              error={errors[field.id]}
              helperText={
                errors[field.id] ? "Please enter a valid address" : ""
              }
            />
          )}
        </React.Fragment>
      );
    } else {
      return (
        <Input
          lightTheme={true}
          key={index}
          label={field.label}
          type={field.type}
          value={formData[field.id]}
          onChange={
            field.type === "chip"
              ? (newValue) => handleChange(field.id, newValue, field.multiple)
              : (e) => handleChange(field.id, e, field.multiple)
          }
          onBlur={
            field.required ? () => handleBlur(field.id, field.validation) : null
          }
          required={field.required}
          autoComplete={field.autoComplete}
          isInvalid={errors[field.id]}
          errorMessage={field.errorMessage}
          options={field.options}
          multipleValue={field.multiple}
          min={field.range && field.range.min}
          max={field.range && field.range.max}
          note={field.note && field.note}
          id={field.id}
        />
      );
    }
  });

  return (
    <>
      <Container
        variant="div"
        className={`${className} ${styles.container}`}
        maxWidth="xl"
      >
        <Box sx={{ width: "100%" }}>
          <React.Fragment>
            <div className={ `${styles.inputWrapper}`}>
              {!hideTitle && (
                <Typography variant="h4" component="h1" className="title mt-8 mb-8">
                  {title}
                </Typography>
              )}

              {formInputs}
            
              <Button
                // newSubmission={newSubmission}
                onClick={submitHandler}
                loading={isLoading}
                // isSuccess={isSuccess}
              variant="contained"
              className="mt-16"
              >
                Submit now
              </Button>
              {error && (
                <Alert sx={{ margin: "8px 0" }} severity="error">
                  Something went wrong. Please Try again
                </Alert>
              )}
            </div>
          </React.Fragment>
        </Box>
      </Container>
    </>
  );
}
