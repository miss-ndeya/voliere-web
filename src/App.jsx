import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from './context/AuthContext'
import { ToastProvider } from './context/ToastContext'
import Login from './pages/auth/Login'
import Dashboard from './pages/Dashboard'
import Pigeons from './pages/pigeons/Pigeons'
import PigeonHistorique from './pages/pigeons/PigeonHistorique'
import Couples from './pages/couples/Couples'
import CoupleHistorique from './pages/couples/CoupleHistorique'
import Reproductions from './pages/reproductions/Reproductions'
import GenealogyTree from './pages/reproductions/GenealogyTree'
import Sorties from './pages/sorties/Sorties'
import Cages from './pages/cages/Cages'
import Visualisation from './pages/cages/Visualisation'
import CageHistorique from './pages/cages/CageHistorique'
import Layout from './components/Layout'

// Route protégée
const PrivateRoute = ({ children }) => {
    const { token, loading } = useAuth()
    
    if (loading) {
        return (
            <div className="flex items-center justify-center h-screen bg-background">
                <div className="text-center">
                    <div className="w-16 h-16 border-4 border-accent border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-muted-foreground">Chargement...</p>
                </div>
            </div>
        )
    }
    
    return token ? children : <Navigate to="/login" />
}

function App() {
    return (
        <ToastProvider>
            <Routes>
                <Route path="/login" element={<Login />} />
                
                <Route path="/" element={
                    <PrivateRoute>
                        <Layout />
                    </PrivateRoute>
                }>
                    <Route index element={<Dashboard />} />
                    <Route path="pigeons" element={<Pigeons />} />
                    <Route path="pigeons/:id/historique" element={<PigeonHistorique />} />
                <Route path="couples" element={<Couples />} />
                <Route path="couples/:id/historique" element={<CoupleHistorique />} />
                <Route path="reproductions" element={<Reproductions />} />
                <Route path="genealogie" element={<GenealogyTree />} />
                <Route path="sorties" element={<Sorties />} />
                <Route path="cages" element={<Cages />} />
                <Route path="visualisation" element={<Visualisation />} />
                <Route path="cages/:id/historique" element={<CageHistorique />} />
            </Route>
        </Routes>
        </ToastProvider>
    )
}

export default App