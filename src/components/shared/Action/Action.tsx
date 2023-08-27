import styles from './action.module.scss';

export default function Action({ text, onClick, disabled }: { text: string; onClick: any; disabled: boolean }) {
  return (
    <button onClick={onClick} disabled={disabled} className={styles.action}>
      {text}
    </button>
  );
}
