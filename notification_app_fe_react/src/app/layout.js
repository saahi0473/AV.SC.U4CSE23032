import './globals.css';
import ThemeRegistry from '@/components/ThemeRegistry';
import Navigation from '@/components/Navigation';

export const metadata = {
  title: 'Campus Notifications Microservice',
  description: 'Campus notifications platform for students',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <ThemeRegistry>
          <Navigation />
          <main style={{ padding: '24px', maxWidth: '1200px', margin: '0 auto' }}>
            {children}
          </main>
        </ThemeRegistry>
      </body>
    </html>
  );
}
