import './globals.css'
import { AuthProvider } from '@/contexts/AuthContext'

export const metadata = {
    title: 'WashSync - Smart Washing Machine Management',
    description: 'Intelligent washing machine management system for PGs, hostels, and apartment complexes',
}

export default function RootLayout({ children }) {
    return (
        <html lang="en">
            <body>
                <AuthProvider>
                    {children}
                </AuthProvider>
            </body>
        </html>
    )
}
