import styles from './button.module.scss';
import { ReactComponent as PasskeyIcon } from '../../../assets/passkey.svg';

export default function Button({
  text,
  onClick,
  disabled,
  buttonType,
  icon,
}: {
  text: string;
  onClick: any;
  disabled: boolean;
  buttonType: string;
  icon?: string;
}) {
  return (
    <button onClick={onClick} disabled={disabled} className={styles[buttonType]}>
      {icon === 'passkey' && <PasskeyIcon width={24} height={24} />}
      {text}
    </button>
  );
}
