import { RegisterBranding } from '../../components/auth/RegisterBranding'
import { RegisterHeader } from '../../components/auth/RegisterHeader'
import { RegisterForm } from '../../components/auth/RegisterForm'

function Register() {
    return (
        <div className="min-h-screen flex overflow-hidden">
            {/* Section gauche - Branding */}
            <RegisterBranding />

            {/* Section droite - Formulaire */}
            <div className="flex-1 flex items-center justify-center p-6 bg-background relative overflow-hidden">
                {/* Motif décoratif subtil */}
                <div className="absolute inset-0 opacity-[0.02]">
                    <div className="absolute top-0 right-0 w-96 h-96 bg-primary rounded-full blur-3xl"></div>
                    <div className="absolute bottom-0 left-0 w-96 h-96 bg-cage-couple rounded-full blur-3xl"></div>
                </div>

                <div className="w-full max-w-md bg-white shadow p-6 rounded-md space-y-4 relative z-10">
                    <RegisterHeader />
                    <RegisterForm />
                </div>
            </div>
        </div>
    )
}

export default Register
