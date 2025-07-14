import React from 'react'

function AuthLayout({children }: {children: React.ReactNode}) {
  return (
    <div>
      <h1>Login Header</h1>
      {children}
      <h1>Login Footer</h1>
    </div>
  )
}

export default AuthLayout
