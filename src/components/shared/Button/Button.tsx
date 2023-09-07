import styles from './button.module.scss';
import { ReactComponent as PasskeyIcon } from '../../../assets/passkey.svg';
import { ReactComponent as SettingsIcon } from '../../../assets/settings-icon.svg';
import { ReactComponent as Loading } from '../../../assets/oval.svg';

export interface ButtonProps {
  label: string;
  onClick: () => void;
  disabled: boolean;
  buttonType?: string;
  icon?: string;
  showActivityIndicator?: boolean;
}

export default function Button({ label, onClick, disabled, buttonType, icon, showActivityIndicator }: ButtonProps) {
  return (
    <button onClick={onClick} disabled={disabled} className={styles[buttonType ?? 'primary']}>
      {!showActivityIndicator && icon === 'passkey' && <PasskeyIcon width={24} height={24} />}
      {!showActivityIndicator && icon === 'settings' && <SettingsIcon width={24} height={24} />}
      {showActivityIndicator && <Loading width={20} height={20} />}
      {label}
    </button>
  );
}
