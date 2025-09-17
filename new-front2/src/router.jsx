// src/router.jsx
import { createBrowserRouter, redirect } from "react-router-dom";

// Layouts
import RootLayout from "./components/layout/RootLayout";
import AuthLayout from "./components/layout/AuthLayout";

// Páginas
import WelcomePage from "./pages/WelcomePage";
import MyArea from "./pages/MyArea";
import PersonalData from "./pages/PersonalData";
import AddItem from "./pages/AddItem";
import Item from "./pages/Item";
import Login from "./pages/Login";
import CatalogPage from "./pages/CatalogPage";

// Helpers
const isAuthenticated = () => {
  try { return !!localStorage.getItem("authToken"); } catch { return false; }
};

const toLogin = (request) => {
  const url = new URL(request.url);
  const from = url.pathname + url.search;
  return redirect(`/login?from=${encodeURIComponent(from)}`);
};

function RouteError() {
  return <div style={{ padding: 16 }}>Ops! Houve um erro ao carregar esta rota.</div>;
}

function NotFound() {
  return <div style={{ padding: 16 }}>Página não encontrada (404).</div>;
}

const router = createBrowserRouter(
  [
    // --------- PÚBLICO ---------
    {
      element: <AuthLayout />,
      errorElement: <RouteError />,
      children: [
        { index: true, element: <WelcomePage /> },

        {
          path: "login",
          element: <Login />,
          loader: () => (isAuthenticated() ? redirect("/my-area") : null),
        },

        {
          path: "signup",
          element: <PersonalData mode="signup" />,
          loader: () => (isAuthenticated() ? redirect("/my-area") : null),
        },

        // Catálogo (param opcional evita duplicação)
        { path: "catalogo/:categoria?", element: <CatalogPage /> },

        // Rotas legadas
        { path: "itens", loader: () => redirect("/catalogo") },
        {
          path: "categorias/:categoria",
          loader: ({ params }) => redirect(`/catalogo/${params.categoria}`),
        },

        // Logout como action (mutação sem loader)
        {
          path: "logout",
          action: async () => {
            try { localStorage.removeItem("authToken"); } catch {}
            return redirect("/login");
          },
        },
      ],
    },

    // --------- PROTEGIDO ---------
    {
      element: <RootLayout />,
      errorElement: <RouteError />,
      loader: ({ request }) => (!isAuthenticated() ? toLogin(request) : null),
      children: [
        { path: "my-area", element: <MyArea /> },
        { path: "personal-data", element: <PersonalData mode="profile" /> },
        { path: "add-item", element: <AddItem /> },
        { path: "item/:id", element: <Item /> },
      ],
    },

    // --------- 404 ---------
    { path: "*", element: <NotFound /> },
  ],
  {
    // opcional: útil se publicar em subpasta (ex: /rtic_ecobarter/)
    basename: import.meta.env.VITE_ROUTER_BASENAME || "/",
  }
);

export default router;
