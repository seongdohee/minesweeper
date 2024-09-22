import React, {HTMLAttributes, PropsWithChildren} from 'react';
import styles from './index.module.scss';

const Select = ({ children, ...rest }: PropsWithChildren<HTMLAttributes<HTMLSelectElement>>) => {
  return (
    <select {...rest} className={styles.select}>
      {children}
    </select>
  );
}

export default Select;