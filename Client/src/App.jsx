import { useState } from 'react'
import { Button } from './components/ui/button'
import { clsx } from 'clsx';
import { Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { logout,login } from './AppStore/authSlice';
import { useDispatch } from 'react-redux';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useTheme } from './components/theme-provider';
function App() {
  const dispatch = useDispatch();
  const {theme} = useTheme();
  
  return (
     <div className='w-full'>
        <ToastContainer 
        position="top-center"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={true}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme={theme}
        className="rounded-3xl"
      />
        <Outlet/>
     </div>
  )
}

export default App
