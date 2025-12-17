import { Outlet } from 'react-router'
import styles from './WithToolbarLayout.module.scss'

interface WithToolbarLayoutProps {
  header?: React.ReactNode;
  className?: string;
}

function WithToolbarLayout({ header, className = '' }: WithToolbarLayoutProps) {
  return (
    <div className={`${styles.layout} ${className}`}>
      {header}
      <main className={styles.main}>
        <div className={styles.container}>
          <Outlet />
        </div>
      </main>
    </div>
  )
}

export default WithToolbarLayout
export type { WithToolbarLayoutProps }
