import { useEffect } from 'react'
import { Navigate, useParams } from 'react-router-dom'
import { setReferral } from '../lib/api.js'

// /ref/:code — remembers who referred this visitor, then shows the home page.
// The code is sent along when they create an account.
function RefCapture() {
  const { code } = useParams()

  useEffect(() => {
    if (code && /^[A-Za-z0-9]{4,16}$/.test(code)) setReferral(code.toUpperCase())
  }, [code])

  return <Navigate to="/" replace />
}

export default RefCapture
