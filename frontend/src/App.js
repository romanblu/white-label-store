import React from 'react'
import Header from './components/Header'
import { Container } from 'react-bootstrap'
import Footer from './components/Footer'
import { Outlet } from 'react-router-dom'

const App = () => {
  return (
    <>
      <Header />
      <main className='py-3'>
        <Container>
          <h1>Welcome To Alternatif Scents</h1>
            <Outlet />
        </Container>
        <Footer />
      </main>
    </>
  )
}

export default App