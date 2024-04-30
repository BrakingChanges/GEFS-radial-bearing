import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './output.css'
import "leaflet.geodesic"
import {
  createBrowserRouter,
  RouterProvider
} from 'react-router-dom'
import { Root } from './Root.tsx'


const router  = createBrowserRouter([
  {
    path: '/',
    children: [
      {
        path: '/',
        element: <App />
      }
    ],
    element: <Root />
  },
])

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
)