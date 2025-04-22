import RowSection from "./Sections/RowSection/RowSection";
import ServicesSection from "./Sections/ServicesSection/ServicesSection";
import FaqAccordionSection from "./Sections/FaqAccordionSection/FaqAccordionSection";
import FormSection from "./Sections/FormSection/FormSection";
import FormHeroSection from "./Sections/FormHeroSection/FormHeroSection";
import RegularProcess from "./Sections/Process/RegularProcess";
import USP from "../USP/USP";
import Stats from "../Stats/Stats";
import LocationsCovered from "../LocationsCovered/LocationsCovered";
import HoursCalculator from "./Sections/HoursCalculator/HoursCalculator";
import ContactSection from "./Sections/ContactSection/ContactSection";
import SpaceCalculator from "./Sections/SpaceCalculator/SpaceCalculator";
import FooterCta from "../CTA/FooterCta";
import GoogleReviewsCarousel from "../GoogleReviews/GoogleReviewsCarousel";
export default function Layout({ sections, uspData, statsData, locationsCovered, hoursCalculatorData,spaceCalculatorData,  contactInfo, socialData, servicesData, googleReviewsData }) {
  if (!sections) return null;
  console.log(sections)
  const sectionsJSX = sections.map((section, index) => {
  
   
    if (section.acf_fc_layout === "row") {
       const remappedAccordion = section.accordion.map(({ title, value }) => ({
        question: title,
        answer: value,
      }));
    
      return (
        <RowSection
          key={index}
          subtitle={section.subtitle}
          title={section.title}
          description={section.description}
          imageAlignment={section.image_alignment}
          image={section.image}
          ctaGroup={section.cta_group}
          bulletPoints={section.bullet_points}
          accordionData = {remappedAccordion}
          showBeforeAfterImages={section.show_before_after_images}
          beforeImage={
            section.show_before_after_images &&
            section.before_after_images.before_image
          }
          afterImage={
            section.show_before_after_images &&
            section.before_after_images.after_image
          }
        />
      );
    }
    if (section.acf_fc_layout === "services") {
      return (
        <ServicesSection
          key={index}
          title={section.title}
          subtitle={section.subtitle}
          description={section.description}
          cards={section.cards}
        />
      );
    }
    if (section.acf_fc_layout === "process") {
      return (
        <RegularProcess
        key={index}
        title={section.title}
        description={section.description}
        cards={section.cards}
        /> 
    
      );
    }

  
 
    // if (section.acf_fc_layout === "tabs_section") {
    //   return    <GradientTabs   key={index}
    //   title={section.section_title}
    //   description={section.section_description}
    //   cards={section.tabs}/>
    // }
    
    // if (section.acf_fc_layout === "packages") {
    //   return (
    //     <Packages
    //       key={index}
    //       serviceName={section.service_name}
    //       title={section.title}
    //       packagesArray={section.package}
    //       termsAndConditions={section.terms_conditions}
    //     />
    //   );
    // }
    if (section.acf_fc_layout === "local_faq") {
      return (
        <FaqAccordionSection
          key={index}
          title={section.section_title}
          description={section.section_description}
          qaData={section.items}
        />
      );
    }

    if (section.acf_fc_layout === "form_section") {
      return (
        <FormSection 
        key={index}
        title={section.title}
        description={section.description} 
        usp={{text_usp: section.text_usp, image_usp: section.image_usp}}
        graphic={section.graphic}
        />
      )
    }
  
  if(section.acf_fc_layout === "form_hero_section") { 
    let graphicData 
    if(section.graphic_type === "new_graphic_type") { 
      graphicData = section.new_graphic_type
    }
    if(section.graphic_type === "image") { 
      graphicData = section.image
    }
    return <FormHeroSection key={index}  title={section.title}
    subtitle={section.subtitle}
    description={section.description}
    cta={section.cta}
    graphicType={section.graphic_type}
    graphicData= {graphicData}
    uspData={section.usp}
    /> 
  }

  if(section.acf_fc_layout === "show_usp" && section.show_usp){ 
      return <USP key={index } 
      title={uspData.section_title}
      description={uspData.section_description}
      cards={uspData.items}
      showTitle={true}
      /> 
  }
  if(section.acf_fc_layout === "show_stats" && section.show_stats){ 

    return <Stats key={index} 
      statsData = {statsData}
    /> 
}
if(section.acf_fc_layout === "show_locations" && section.show_locations){ 

  return <LocationsCovered key={index}
    title={locationsCovered.title}
    description={locationsCovered.description}
    locations={locationsCovered.locations}
    image={locationsCovered.image}
  /> 
}

if(section.acf_fc_layout === "show_hours_calculator" && section.show_hours_calculator){ 
  
if(!hoursCalculatorData) return null;
  return <HoursCalculator key ={index} 
    title={hoursCalculatorData.title}
    description={hoursCalculatorData.description}
    calculatedValueLabel={hoursCalculatorData.calculated_value_label}
    furnishedLevelData = {hoursCalculatorData.furnished_level}
    price={section.price}
  /> 
}
if(section.acf_fc_layout === "show_space_calculator" && section.show_space_calculator){ 
  if(!spaceCalculatorData) return null;
    return <SpaceCalculator key={index} 
    title={spaceCalculatorData.title}
    description={spaceCalculatorData.description}
    calculatedValueLabel={spaceCalculatorData.calculated_value_label}
    furnishedLevelData = {spaceCalculatorData.furnished_level}
    price={section.price}
    /> 
  }
  if(section.acf_fc_layout === "show_services" && section.show_services){ 
    if(servicesData === undefined) return null;
   return ( <ServicesSection
          key={index}
          title={servicesData.title}
          subtitle={servicesData.subtitle}
          description={servicesData.description}
          cards={servicesData.cards}
        />
      )
     }
if(section.acf_fc_layout === "contact" )
{ 
  return <ContactSection key={index} title={section.title} description={section.description} map={section.map} uspData={section.usp} contactInfo={contactInfo} socialData={socialData}></ContactSection>
}
if(section.acf_fc_layout === "cta_section" )
  { 
    return <FooterCta key={index} title={section.title} description={section.description} cta={section.cta_link} />
  }
  if(section.acf_fc_layout === "show_reviews" && section.show_reviews && googleReviewsData)  
    { 
      return <GoogleReviewsCarousel key={index} data={googleReviewsData}/> 
    }
  });

  return <section>{sectionsJSX} </section>;
}
