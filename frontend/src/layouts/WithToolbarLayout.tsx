import './App.css'
import { Outlet } from 'react-router'
import Header from '../components/Header/Header'

function WithToolbarLayout() {

  return (
    <div>
      <Header />
      <main>
        <Outlet/>
      </main>
    </div>
  )
}

export default WithToolbarLayout
