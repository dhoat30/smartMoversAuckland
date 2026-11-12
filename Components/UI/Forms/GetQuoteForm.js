"use client";

import React, { useState, useEffect, useRef, useId } from "react";
import Input from "./InputFields/Input";
import { getQuoteFormData } from "@/utils/getQuoteFormData";
import { servicePropertyMap } from "@/utils/getQuoteFormData"; // Import the service mapping
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import axios from "axios";
import Alert from "@mui/material/Alert";
import Container from "@mui/material/Container";
import { usePathname, useRouter } from "next/navigation";
import Typography from "@mui/material/Typography";
import GoogleAutocomplete from "@/Components/GoogleMaps/GoogleAutoComplete";
import styles from "./FormStyle.module.scss";
import dayjs from "dayjs";
import { useClickIds } from "@/hooks/useClickIds";
import {
  buildMoverMateMetadata,
  getMoverMateLeadSource,
} from "@/utils/clickIds";
import LocalPhoneIcon from "@mui/icons-material/LocalPhone";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import MoveTypeStep from "./MoveTypeStep";
import { quoteMoveTypes } from "@/utils/quoteMoveTypes";
import Script from "next/script";
import {
  getCitySlugFromPathname,
  getPhoneLinkForCity,
} from "@/utils/phoneNumbers";


export default function GetQuoteForm({
  className,
  formName = "Get a Quote Form",
  title = "Please fill out a form",
  hideTitle = false,
}) {
  // get phone number based on city in pathname
  const pathname = usePathname();
  const citySlug = getCitySlugFromPathname(pathname);
  const { phoneNumber, phoneHref } = getPhoneLinkForCity(citySlug);

  
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [moveType, setMoveType] = useState("");
  const selectedMoveType = quoteMoveTypes.find(
    (option) => option.value === moveType,
  );
  const stepHeadingId = useId();
  const stepHeadingRef = useRef(null);
  const previousStep = useRef(step);
  const submissionInFlight = useRef(false);

  useEffect(() => {
    if (previousStep.current !== step) {
      stepHeadingRef.current?.focus({ preventScroll: true });
      previousStep.current = step;
    }
  }, [step]);

  const selectMoveType = (value) => {
    setMoveType(value);
  };

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
  const [error, setError] = useState(false);
  const [shouldLoadMaps, setShouldLoadMaps] = useState(false);
  const [googleAdsAddress, setGoogleAdsAddress] = useState({
    pickUpAddress: {},
    dropOffAddress: {},
  }); // For Google Ads conversion tracking
  // click id
  const { clickIds } = useClickIds();
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
    e.preventDefault();

    if (step !== 2 || !selectedMoveType || submissionInFlight.current) return;

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

    const parts = formData.firstname.trim().split(/\s+/); // split by any whitespace
    const firstName = parts[0] || "";

    const formattedDate = formData.date
      ? dayjs(formData.date).format("DD MMM YYYY")
      : "Not provided";
    const servicesRequired = formData.service.length
      ? formData.service.join(", ")
      : "Not provided";
    const quoteMessage = [
      `Move Type: ${selectedMoveType.label}`,
      `First Name: ${formData.firstname}`,
      `Email: ${formData.email}`,
      `Phone Number: ${formData.phone || "Not provided"}`,
      `Pick Up Address: ${formData.pickUpAddress || "Not provided"}`,
      `Drop Off Address: ${formData.dropOffAddress || "Not provided"}`,
      `Property Type: ${formData.propertyType || "Not provided"}`,
      `Move Date: ${formattedDate}`,
      `Services Required: ${servicesRequired}`,
      `Message: ${formData.message || "Not provided"}`,
    ].join("\n");

    const dataPayload = {
      email: formData.email,
      formName: formName,
      message: quoteMessage,
      hubspotFormID: process.env.NEXT_PUBLIC_HUBSPOT_GET_QUOTE_FORM_ID,
      body: {
        // { name: "hs_google_click_id", value: clickIds.gclid || "" },
        // { name: "gbraid", value: clickIds.gbraid || "" },
        // { name: "wbraid", value: clickIds.wbraid || "" },
        // { name: "gads_campaign_id", value: clickIds.gads_campaign_id || "" },
        // { name: "gads_adgroup_id", value: clickIds.gads_adgroup_id || "" },
        // { name: "gads_ad_id", value: clickIds.gads_ad_id || "" },
        // { name: "campaign_name", value: clickIds.campaign_name || "" },
        // { name: "adgroup_name", value: clickIds.adgroup_name || "" },
        // { name: "ad_name", value: clickIds.ad_name || "" },
        // { name: "utm_term", value: clickIds.utm_term || "" },
        // { name: "utm_matchtype", value: clickIds.utm_matchtype || "" },
        // { name: "utm_network", value: clickIds.utm_network || "" },
        // { name: "utm_device", value: clickIds.utm_device || "" },
        // { name: "utm_content", value: clickIds.utm_content || "" },
        // { name: "utm_source", value: clickIds.utm_source || "" },
        // { name: "hs_facebook_click_id", value: clickIds.fbclid || "" },
        // { name: "fbp", value: clickIds.fbp || "" },
        // { name: "fbc", value: clickIds.fbc || "" },
        // { name: "fb_campaign_id", value: clickIds.fb_campaign_id || "" },
        // { name: "fb_platform", value: clickIds.fb_platform || "" },
        // { name: "fb_ad_id", value: clickIds.fb_ad_id || "" },
        // { name: "fb_adset_id", value: clickIds.fb_adset_id || "" },
        // { name: "fb_site_source", value: clickIds.fb_site_source || "" },

        firstName: formData.firstname,
        email: formData.email,
        phone: formData.phone,
        pickup: formData.pickUpAddress,
        dropoff: formData.dropOffAddress,
        propertyType: formData.propertyType,
        sendInventoryLink: true,
        source: getMoverMateLeadSource(clickIds),
        metadata: buildMoverMateMetadata(clickIds),
        // name: "services_required", value: formData["service"].join(", ") ,
        note: [`Move Type: ${selectedMoveType.label}`, formData.message]
          .filter(Boolean)
          .join("\n"),
      },
    };
    submissionInFlight.current = true;
    setIsLoading(true);
    setError(false);
    // Hubspot config
    var configHubspot = {
      method: "post",
      url: "/api/movermate",
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
        if (
          response.every(
            ({ status, data }) => status === 200 && data?.success === true,
          )
        ) {
          if (typeof window !== "undefined") {
            window.dataLayer = window.dataLayer || [];
            window.dataLayer.push({
              event: "quote_form_submission",
              formName: "Moving Quote",
              moveType: selectedMoveType.value,
              move_size: selectedMoveType.moveSize,
              formData: {
                firstName: firstName,
                email: formData.email,
                phone: formData.phone,
                street: `${googleAdsAddress.pickUpAddress.streetNumber} ${googleAdsAddress.pickUpAddress.streetName}`,
                city: googleAdsAddress.pickUpAddress.city,
                region: googleAdsAddress.pickUpAddress.region,
                postCode: googleAdsAddress.pickUpAddress.postalCode,
                gclid: clickIds.gclid,
                gbraid: clickIds.gbraid,
                wbraid: clickIds.wbraid,
                fbclid: clickIds.fbclid,
                fbc: clickIds.fbc,
                fbp: clickIds.fbp,
              },
            });
          }
          router.push("/form-submitted/thank-you");
        } else {
          submissionInFlight.current = false;
          setIsLoading(false);
          setError(true);
        }
      })
      .catch(function () {
        submissionInFlight.current = false;
        setIsLoading(false);
        setError(true);
      });
  };

  // Get the filtered service options based on propertyType
  const getFilteredServiceOptions = () => {
    if (formData.propertyType && servicePropertyMap[formData.propertyType]) {
      return servicePropertyMap[formData.propertyType];
    }
    return [];
  };

  const loadGoogleMaps = () => {
    setShouldLoadMaps(true);
  };
  // is address field
  const isAddressField = (id) => {
    return ["address", "pickUpAddress", "dropOffAddress"].includes(id);
  };

  const renderAddressField = (field) => {
    return (
      <GoogleAutocomplete
        className="mt-16"
        label={field.label}
        value={formData[field.id]} // pickUpAddress / dropOffAddress / address
        onFocus={loadGoogleMaps}
        onChange={(value) => handleChange(field.id, value, false)}
        onSelect={(selectedAddress) => {
          // When user selects an address from suggestions
          setFormData((prevData) => ({
            ...prevData,
            [field.id]: selectedAddress.formattedAddress,
          }));
          setGoogleAdsAddress((prevData) => ({
            ...prevData,
            [field.id]: selectedAddress.unformattedAddress,
          })); // Set the address for Google Ads conversion tracking
          // Reset errors if any
          if (errors[field.id]) {
            setErrors({ ...errors, [field.id]: false });
          }
        }}
        required={field.required}
        autoComplete={field.autoComplete}
        error={errors[field.id]}
        helperText={errors[field.id] ? "Please enter a valid address" : ""}
      />
    );
  };

  const addressFields = getQuoteFormData.filter((field) =>
    ["pickUpAddress", "dropOffAddress"].includes(field.id),
  );

  const formInputs = getQuoteFormData.map((field, index) => {
    if (["pickUpAddress", "dropOffAddress"].includes(field.id)) {
      return null;
    }

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
      return <React.Fragment key={field.id}>{renderAddressField(field)}</React.Fragment>;
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
      {shouldLoadMaps && (
        <Script
          id="google-maps"
          strategy="afterInteractive"
          src={`https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}&v=weekly&libraries=places`}
          onLoad={() => {
            window.dispatchEvent(new Event("gmaps-ready"));
          }}
        />
      )}
      <Container
        variant="div"
        className={`${className} ${styles.container}`}
        maxWidth="xl"
      >
        <Box sx={{ width: "100%" }}>
          <React.Fragment>
            <div className={`${styles.inputWrapper}`}>
              {!hideTitle && (
                <Typography
                  variant="h4"
                  component="h1"
                  className="title mt-8 mb-8"
                >
                  {title}
                </Typography>
              )}

              <ol className={styles.progress} aria-label="Quote progress">
                {["Move type", "Your details"].map((label, index) => (
                  <li
                    key={label}
                    aria-current={step === index + 1 ? "step" : undefined}
                  >
                    <span className={styles.stepNumber}>{index + 1}</span>
                    {label}
                  </li>
                ))}
              </ol>

              <Typography
                id={stepHeadingId}
                ref={stepHeadingRef}
                tabIndex={-1}
                component="h3"
                variant="h5"
                className={`${styles.stepHeading} ${step === 1 ? styles.moveTypeHeading : ""}`}
              >
                {step === 1 ? "What are you moving?" : "Your moving details"}
              </Typography>

              {step === 1 ? (
                <>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    className={styles.moveTypeIntro}
                  >
                    Select an option to continue.
                  </Typography>
                  <MoveTypeStep value={moveType} onSelect={selectMoveType} />
                  <Button
                    type="button"
                    variant="contained"
                    size="large"
                    className="mt-16 full-width"
                    disabled={!selectedMoveType}
                    onClick={() => {
                      if (selectedMoveType) setStep(2);
                    }}
                  >
                    Continue to details
                  </Button>
                </>
              ) : (
                <form
                  onSubmit={submitHandler}
                  noValidate
                  aria-labelledby={stepHeadingId}
                  aria-busy={isLoading}
                >
                  <div className={styles.selectedMove}>
                    <span>{selectedMoveType.label}</span>
                    <Button
                      type="button"
                      variant="text"
                      size="small"
                      className={styles.backButton}
                      startIcon={<ArrowBackIcon />}
                      disabled={isLoading}
                      onClick={() => setStep(1)}
                      aria-label="Back to move type"
                    >
                      Back
                    </Button>
                  </div>
                  <fieldset
                    className={styles.detailsFields}
                    disabled={isLoading}
                  >
                    {addressFields.length > 0 && (
                      <div className={styles.addressRow}>
                        {addressFields.map((field) => (
                          <div key={field.id} className={styles.addressField}>
                            {renderAddressField(field)}
                          </div>
                        ))}
                      </div>
                    )}

                    {formInputs}

                    <Button
                      type="submit"
                      loading={isLoading}
                      variant="contained"
                      className="mt-16 full-width"
                      size="large"
                    >
                      Get Free Quote
                    </Button>
                  </fieldset>
                  {error && (
                    <Alert sx={{ margin: "8px 0" }} severity="error">
                      Something went wrong. Please try again.
                    </Alert>
                  )}
                </form>
              )}

              <Button
                variant="text"
                className="mt-8  align-center"
                style={{
                  width: "100%",
                  display: "flex",
                  justifyContent: "center",
                }}
                href={phoneHref}
                startIcon={<LocalPhoneIcon />}
              >
                Prefer to talk? {phoneNumber}
              </Button>

              <Typography
                variant="body1"
                component="div"
                className="center-align pt-16"
                color="primary"
                style={{ borderTop: "1px solid var(--light-outline-variant)" }}
              >
                Honest advice • Free Quote • No obligation

              </Typography>
                 <Typography
                variant="body2"
                component="div"
                className="center-align pt-16"
                color="var(--light-on-surface-variant)"
              
              >
                🔒 Your details are safe & never shared

              </Typography>
            </div>
          </React.Fragment>
        </Box>
      </Container>
    </>
  );
}
