import styles from "./Logo.module.scss";

export const Logo = () => {
  return (
    <div className={styles.logo}>
      <img
        src="/logo_3.jpg"
        alt="Национальный герб Республики Таджикистан"
        className={styles.logo__emblem}
      />
      <span className="tw-text-primary tw-font-medium tw-flex tw-flex-col tw-items-center">
        <div>Вазорати корҳои дохилии</div>

        <strong>Ҷумҳурии Тоҷикистон</strong>
      </span>
    </div>
  );
};
