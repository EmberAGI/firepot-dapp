import { To, useNavigate } from 'react-router-dom';
import styles from './headerBackButton.module.scss';
import { PropsHeader } from '../../interface/header.interface';

/**
 *
 * @param props: PropsHeader
 * @description: This component is used to create a header with a back button,
 * @returns
 */
export default function HeaderBackButton(props: PropsHeader) {
  const navigate = useNavigate();
  const icon = props.icon ? props.icon : 'public/assets/back.svg';
  return (
    <header className={styles.headerBox}>
      <img src={icon} loading='lazy' alt='' onClick={() => navigate((props.url ?? -1) as To)} />
      <span>{props.title}</span>
    </header>
  );
}
