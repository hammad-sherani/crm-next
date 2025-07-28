import ClientAuthComponent from '@/components/client/superAdmin/auth/ClientAuthComponent'
import React from 'react'

function SuperAdminAuthLayout({ children }: { children: React.ReactNode }) {
  // useEffect(() => {
  //   if()
  // },[])
  return (
    <div>
      <ClientAuthComponent />
      {children}
    </div>
  )
}

export default SuperAdminAuthLayout



