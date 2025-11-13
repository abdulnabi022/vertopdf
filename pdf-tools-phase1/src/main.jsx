import React from 'react'
import { createRoot } from 'react-dom/client'
import { RouterProvider } from 'react-router-dom'
import './index.css'
import { router } from './App.jsx'

const root = createRoot(document.getElementById('root'))
root.render(<RouterProvider router={router} />)
