import { useState } from 'react';
import styles from './bubble.module.scss';
import { LuChevronsRightLeft } from 'react-icons/lu';
import { TbAlignJustified } from 'react-icons/tb';

export default function Bubble() {
  const [show, setShow] = useState(false);
  const toggle = () => {
    setShow(!show);
  };
  return (
    <div className={`${styles.bubble}`} style={show ? { width: '96%' } : { width: '50px' }}>
      {show ? (
        <div className={styles.flex}>
          <p>Earn 27% more by switching to this new yield vault. Just let me know if you want to proceed a…</p>
          <LuChevronsRightLeft size='34px' onClick={toggle}></LuChevronsRightLeft>
        </div>
      ) : (
        <TbAlignJustified size='34px' onClick={toggle}></TbAlignJustified>
      )}
    </div>
  );
}
