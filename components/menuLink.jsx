

import Link from 'next/link'
import styles from '../styles/menuLink.module.css'


const MenuLink = ({item}) => {

 // const pathname = usePathname()

  return (
    <Link href={item.path} className={styles.container}>
      {item.icon}
      {item.title}
    </Link>
  )
}

export default MenuLink