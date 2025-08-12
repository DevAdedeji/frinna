import { BrowserRouter, Routes, Route } from "react-router-dom"
import { Toaster } from "react-hot-toast"
import AuthLayout from "./layouts/auth"
import SignInPage from "./pages/auth/signin"
import SignUpPage from "./pages/auth/signup"
import IndexPage from "./pages"

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/auth" element={<AuthLayout />}>
          <Route path="/auth/signin" element={<SignInPage />} />
          <Route path="/auth/signup" element={<SignUpPage />} />
        </Route>
        <Route path="/" element={<IndexPage />} />
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
