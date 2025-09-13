import React from 'react'
import AuthGuard from '@/components/AuthGuard'

export const metadata = {
  title: 'Buyer Lead Management',
  description: 'Manage buyer leads efficiently',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="bg-white text-black">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="font-sans min-h-screen">
        <AuthGuard>{children}</AuthGuard>
      </body>
    </html>
  )
}
