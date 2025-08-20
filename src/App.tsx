import { BrowserRouter, Routes, Route, Outlet, Navigate } from "react-router-dom"
import { Toaster } from "react-hot-toast"
import AuthLayout from "./layouts/auth"
import SignInPage from "./pages/auth/signin"
import SignUpPage from "./pages/auth/signup"
import IndexPage from "./pages"
import AuthListener from "./components/AuthListener"
import MessageUserPage from "./pages/message"
import ChatsPage from "./pages/chats"
import { useAuthStore } from "./store/useAuthStore"
import MessagesPage from "./pages/messages"
import Header from "./components/Header"
import Footer from "./components/Footer"

const AppLayout = () => {
  return (
    <main className="flex flex-col w-full min-h-screen bg-background">
      <Header />
      <div className="flex-grow">
        <Outlet />
      </div>
      <Footer />
    </main>
  );
};

const ChatLayout = () => {
  return (
    <main className="flex flex-col w-full min-h-screen bg-background">
      <div className="flex flex-grow">
        <Outlet />
      </div>
      <Footer />
    </main>
  );
};


function App() {
  const ProtectedRoute = () => {
    const { user, isAuthReady } = useAuthStore();
    if (!isAuthReady) {
      return <div></div>
    }

    return user ? <Outlet /> : <Navigate to={"/auth/signin"} replace />
  }
  const GeustRoute = () => {
    const { user, isAuthReady } = useAuthStore();
    if (!isAuthReady) {
      return <div></div>
    }
    return user ? <Navigate to={"/"} replace /> : <Outlet />
  }
  return (
    <BrowserRouter>
      <AuthListener />
      <Routes>
        <Route element={<GeustRoute />}>
          <Route path="/auth" element={<AuthLayout />}>
            <Route path="/auth/signin" element={<SignInPage />} />
            <Route path="/auth/signup" element={<SignUpPage />} />
          </Route>
        </Route>
        <Route path="/message" element={<AuthLayout />}>
          <Route path="/message/:username" element={<MessageUserPage />} />
        </Route>
        <Route element={<ProtectedRoute />}>
          <Route element={<AppLayout />}>
            <Route path="/" element={<IndexPage />} />
            <Route path="/messages" element={<MessagesPage />} />
          </Route>
          <Route element={<ChatLayout />}>
            <Route path="/chats" element={<ChatsPage />} />
          </Route>
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
