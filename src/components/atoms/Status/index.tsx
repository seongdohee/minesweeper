import styles from './index.module.scss';

interface Props {
  value: number;
}

const Status = ({ value } : Props) => {
  return (
    <div className={styles.wrapper}>
      {value.toString().padStart(3, '0').split('').map((item, index) => (
        <div key={index} className={styles.item}>{item}</div>
      ))}
    </div>
  )
}

export default Status;