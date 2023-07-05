import styles from './Button.module.scss';

export default function Button({ text, onClick, disabled, buttonType }: { text: string; onClick: any; disabled: boolean; buttonType: string }) {
  return (
    <button onClick={onClick()} disabled={disabled} className={styles[buttonType]}>
      {text}
    </button>
  );
}
