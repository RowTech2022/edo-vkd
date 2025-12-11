import { FC, memo } from "react";
import styles from "./styles.module.scss";

const snowTypes = ["❅", "❆", "❄"];

const getRandomSnow = () => {
  const idx = Math.round(Math.random() * 2);
  return snowTypes[idx];
};

interface ISnowFlake {
  count?: number;
}
export const SnowFlake: FC<ISnowFlake> = memo(({ count = 25 }) => {
  return (
    <div className={styles.snowflake}>
      {Array.from({ length: count }).map((item, idx) => (
        <span key={idx} className={styles.snow}>
          {getRandomSnow()}
        </span>
      ))}
    </div>
  );
});
