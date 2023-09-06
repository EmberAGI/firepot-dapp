import useTokenImageProvider from './useTokenImageProvider';
import styles from "./TokenImage.module.css";
import { useState, useEffect, useRef } from 'react';

interface Props {
  symbol: string;
}

export default function TokenImage({ symbol }: Props): JSX.Element {
    // @ts-ignore
    const [tokenImage, setTokenImage] = useState<string>();
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const imgAlt = `${symbol} logo`;
  
    const handleLoad = () => {
      setIsLoading(false);
    };
  
    const tokenImageRef = useRef<HTMLImageElement>(null);
    const imageSrc = useTokenImageProvider(symbol);
  
    useEffect(() => {
      
      if (tokenImageRef.current && imageSrc) {
        tokenImageRef.current.src = imageSrc;
      }
    }, [symbol]);
  
    if (!tokenImage) {
      return <div>{imgAlt}</div>;
    }
  
    return (
      <div className={styles.iconWrapper}>
        {isLoading && <div className={styles.iconPlaceholder} />}
        <img
          ref={tokenImageRef}
          loading="lazy"
          alt={imgAlt}
          className={styles.iconVector}
          onLoad={handleLoad}
          style={{ display: isLoading ? 'none' : 'block' }}
        />
      </div>
    );
  };
