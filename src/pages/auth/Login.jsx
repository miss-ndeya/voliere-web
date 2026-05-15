import { LoginBranding } from '../../components/auth/LoginBranding'
import { LoginHeader } from '../../components/auth/LoginHeader'
import { LoginForm } from '../../components/auth/LoginForm'

function Login() {
    return (
        <div className="min-h-screen flex overflow-hidden">
            {/* Section gauche - Branding */}
            <LoginBranding />

            {/* Section droite - Formulaire */}
            <div className="flex-1 flex items-center justify-center p-6 bg-background relative overflow-hidden">
                {/* Motif décoratif subtil */}
                <div className="absolute inset-0 opacity-[0.02]">
                    <div className="absolute top-0 right-0 w-96 h-96 bg-primary rounded-full blur-3xl"></div>
                    <div className="absolute bottom-0 left-0 w-96 h-96 bg-cage-couple rounded-full blur-3xl"></div>
                </div>

                <div className="w-full max-w-md bg-white shadow p-6 rounded-md space-y-6 relative z-10">
                    <LoginHeader />
                    <LoginForm />
                </div>
            </div>
        </div>
    )
}

export default Login
