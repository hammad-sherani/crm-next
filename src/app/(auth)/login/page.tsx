'use client'
import React from 'react'
import toast from 'react-hot-toast'



function LoginPage() {
  return (
    <div onClick={() => toast('Login Page Clicked')}>
      Login
    </div>
  )
}

export default LoginPage
