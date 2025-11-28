// Đường dẫn tùy project của bạn
import { Toaster } from 'react-hot-toast';
import './globals.css';
import AuthProvider from './lib/component/AuthProvider';
import StoreProvider from './lib/redux/provider';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css"></link>
      </head>
      <body suppressHydrationWarning={true}>
        <StoreProvider>
          <AuthProvider> 
             {children}
             <Toaster 
               position="bottom-right" 
               reverseOrder={false} 
               toastOptions={{
                 duration: 5000,
                 style: {
                   background: '#333',
                   color: '#fff',
                 },
               }}
             />
          </AuthProvider>
        </StoreProvider>
      </body>
    </html>
  );
}