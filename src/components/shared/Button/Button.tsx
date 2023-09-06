import styles from './button.module.scss';
import { ReactComponent as PasskeyIcon } from '../../../assets/passkey.svg';
import { ReactComponent as SettingsIcon } from '../../../assets/settings-icon.svg';
import { ReactComponent as Loading } from '../../../assets/oval.svg';

export default function Button({
  text,
  onClick,
  disabled,
  buttonType,
  icon,
  showActivityIndicator: isActivate,
}: {
  text: string;
  onClick: any;
  disabled: boolean;
  buttonType: string;
  icon?: string;
  showActivityIndicator?: boolean;
}) {
  return (
    <button onClick={onClick} disabled={disabled} className={styles[buttonType]}>
      {!isActivate && icon === 'passkey' && <PasskeyIcon width={24} height={24} />}
      {!isActivate && icon === 'settings' && <SettingsIcon width={24} height={24} />}
      {isActivate && <Loading width={20} height={20} />}
      {text}
    </button>
  );
}
