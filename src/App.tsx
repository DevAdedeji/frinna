import { BrowserRouter, Routes, Route, Outlet, Navigate } from "react-router-dom"
import { Toaster } from "react-hot-toast"
import AuthLayout from "./layouts/auth"
import SignInPage from "./pages/auth/signin"
import SignUpPage from "./pages/auth/signup"
import IndexPage from "./pages"
import AuthListener from "./components/AuthListener"
import MessageUserPage from "./pages/message"
import { useAuthStore } from "./store/useAuthStore"

function App() {
  const ProtectedRoute = () => {
    const { user, isLoading } = useAuthStore();
    if (isLoading) {
      return <div></div>
    }

    return user ? <Outlet /> : <Navigate to={"/auth/signin"} replace />
  }
  return (
    <BrowserRouter>
      <AuthListener />
      <Routes>
        <Route path="/auth" element={<AuthLayout />}>
          <Route path="/auth/signin" element={<SignInPage />} />
          <Route path="/auth/signup" element={<SignUpPage />} />
        </Route>
        <Route path="/message" element={<AuthLayout />}>
          <Route path="/message/:username" element={<MessageUserPage />} />
        </Route>
        <Route element={<ProtectedRoute />}>
          <Route path="/" element={<IndexPage />} />
        </Route>
      </Routes>
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 5000,
          style: {
            background: '#1D2E4A',
            color: '#fff',
          },
        }}
      />
    </BrowserRouter>
  )
}

export default App
