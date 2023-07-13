import React from 'react'
import Header from './components/Header'
import { Container } from 'react-bootstrap'
import Footer from './components/Footer'
import HomeScreen from './screens/HomeScreen'
import { Outlet } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

const App = () => {
  return (
    <div>
      <Header />
      <main className='py-30 mt-20'>
        <Container>
          {/* <h1>What the fuck is going on!!!!</h1>
          <HomeScreen /> */}
          <Outlet />
        </Container>
      </main>
      <Footer />
      <ToastContainer/>
    </div>
  )
}

export default App