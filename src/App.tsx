import { BrowserRouter, Routes, Route } from "react-router-dom"
import AuthLayout from "./layouts/auth"
import SignInPage from "./pages/signin"
import SignUpPage from "./pages/signup"

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/auth" element={<AuthLayout />}>
          <Route path="/auth/signin" element={<SignInPage />} />
          <Route path="/auth/signup" element={<SignUpPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
