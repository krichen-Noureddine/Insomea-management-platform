
import Navbar from './Navbar';
import Sidebar from './sidebar';
import styles from "../styles/dashboard.module.css"

const Layout = ({children}) => {
    return (
       <div className={styles.container}>
        <div className={styles.menu}>
          <Sidebar/>
        </div>
        <div className={styles.content}>
          <Navbar/>
          {children}
       
        </div>
      </div>
    )
  }
  
  export default Layout