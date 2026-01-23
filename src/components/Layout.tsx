import { Outlet } from 'react-router-dom'
import Header from './Header'
import Navigation from './Navigation'
import { BaseContainer } from './ui/Layout'

function Layout() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <Navigation />
      <main className="py-8">
        <BaseContainer>
          <Outlet />
        </BaseContainer>
      </main>
    </div>
  )
}

export default Layout
