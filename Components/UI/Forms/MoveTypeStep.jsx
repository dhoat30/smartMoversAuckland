import { useId } from "react";
import WeekendOutlinedIcon from "@mui/icons-material/WeekendOutlined";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import CorporateFareOutlinedIcon from "@mui/icons-material/CorporateFareOutlined";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import { quoteMoveTypes } from "@/utils/quoteMoveTypes";
import styles from "./MoveTypeStep.module.scss";

const icons = {
  single_item: WeekendOutlinedIcon,
  house: HomeOutlinedIcon,
  office: CorporateFareOutlinedIcon,
};

export default function MoveTypeStep({ value, onSelect }) {
  const id = useId();

  return (
    <div className={styles.selection}>
      <div className={styles.options}>
        {quoteMoveTypes.map((option) => {
          const Icon = icons[option.value];
          const selected = value === option.value;
          const labelId = `${id}-${option.value}-label`;
          const descriptionId = `${id}-${option.value}-description`;

          return (
            <button
              key={option.value}
              type="button"
              className={styles.option}
              aria-pressed={selected}
              aria-labelledby={labelId}
              aria-describedby={descriptionId}
              onClick={() => onSelect(option.value)}
            >
              <span className={styles.icon} aria-hidden="true">
                <Icon />
              </span>
              <span className={styles.copy}>
                <span id={labelId} className={styles.label}>
                  {option.label}
                </span>
                <span id={descriptionId} className={styles.description}>
                  {option.description}
                </span>
              </span>
              {selected && (
                <CheckCircleIcon
                  className={styles.selectionMark}
                  aria-hidden="true"
                />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
