import { Outlet } from 'react-router'
import Header from '../components/Header/Header'
import styles from './WithToolbarLayout.module.scss'

function WithToolbarLayout() {
  return (
    <div className={styles.layout}>
      <Header />
      <main className={styles.main}>
        <div className={styles.container}>
          <Outlet />
        </div>
      </main>
    </div>
  )
}

export default WithToolbarLayout
