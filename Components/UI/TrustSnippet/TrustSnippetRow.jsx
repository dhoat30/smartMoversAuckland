import GoogleReviewSnippet from "@/Components/UI/GoogleReviews/GoogleReviewCard/GoogleReviewSnippet";
import TrustSnippet from "./TrustSnippet";
import styles from "./TrustSnippetRow.module.scss";

const defaultTrustItems = [
  {
    iconSrc: "/shield-icon.png",
    iconAlt: "NZ Owned",
    title: "NZ Owned",
    description: "Professional Team",
  },
  {
    iconSrc: "/winz-logo.png",
    iconAlt: "WINZ",
    title: "WINZ",
    description: "Approved",
  },
];

export default function TrustSnippetRow({
  googleReviewSnippetText,
  reviewerPics,
  trustItems = defaultTrustItems,
  className = "",
  priority = false,
}) {
  return (
    <div
      className={`${styles.trustRow} ${className} flex align-center gap-24 flex-wrap`}
    >
  

      {trustItems.map((item) => (
        <TrustSnippet
          key={`${item.title}-${item.description}`}
          icon={item.icon}
          iconSrc={item.iconSrc}
          iconAlt={item.iconAlt}
          iconSize={item.iconSize}
          title={item.title}
          description={item.description}
          priority={item.priority ?? priority}
        />
      ))}
          <GoogleReviewSnippet
        reviewTitle={googleReviewSnippetText}
        reviewerPics={reviewerPics}
        leftAligned={true}
        showBorder={false}
        hidePics={true}
      />
    </div>
  );
}
