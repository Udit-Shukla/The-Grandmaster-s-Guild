import { Route, Routes } from 'react-router-dom'
import './App.css'
import { Game } from './screens/Game'
import { Landing } from './screens/Landing'

function App() {
   

  return (
    <div className='h-screen bg-slate-900'>
     <Routes>
      <Route path='/' element={<Landing/>}></Route>
      <Route path='/game' element={<Game/>}></Route>
     </Routes>
    </div>
  )
}

export default App
