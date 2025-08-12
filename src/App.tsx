import { BrowserRouter, Routes, Route } from "react-router-dom"
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
    </BrowserRouter>
  )
}

export default App
