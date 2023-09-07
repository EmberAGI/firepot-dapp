import styles from './button-bar.module.scss';
import Button, { ButtonProps } from '../Button/Button';

interface ButtonBarProps {
  leftButton: ButtonProps & { hide?: boolean };
  rightButton: ButtonProps & { hide?: boolean };
}

export default function ButtonBar({ leftButton, rightButton }: ButtonBarProps) {
  return (
    <div className={styles.buttonBar}>
      {!leftButton.hide && (
        <Button
          label={leftButton.label}
          onClick={leftButton.onClick}
          disabled={leftButton.disabled}
          buttonType={leftButton.buttonType ?? 'secondary'}
        />
      )}
      {!rightButton.hide && (
        <Button
          label={rightButton.label}
          onClick={rightButton.onClick}
          disabled={rightButton.disabled}
          buttonType={rightButton.buttonType ?? 'primary'}
        />
      )}
    </div>
  );
}
