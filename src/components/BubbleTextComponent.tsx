import React from "react";
import styles from "./bubble.module.css";

interface BubbleTextProps {
  text: string;
  className?: string;
}

const BubbleText: React.FC<BubbleTextProps> = ({ text, className = "" }) => {
  return (
    <span className={className}>
      {text.split("").map((child, idx) => (
        <span className={styles.hoverText} key={idx}>
          {child}
        </span>
      ))}
    </span>
  );
};

export default BubbleText;
