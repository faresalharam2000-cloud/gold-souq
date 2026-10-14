export const metadata = {
  title: 'منصة الذهب',
  description: 'منصة عرض أسعار الذهب للصاغة',
}

export default function RootLayout({ children }) {
  return (
    <html lang="ar" dir="rtl">
      <body style={{ margin: 0, fontFamily: 'system-ui, sans-serif' }}>
        {children}
      </body>
    </html>
  )
}
