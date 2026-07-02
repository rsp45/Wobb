import { lazy, Suspense } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";

const LandingPage = lazy(() =>
  import("@/pages/LandingPage").then((module) => ({
    default: module.LandingPage,
  }))
);
const SearchPage = lazy(() =>
  import("@/pages/SearchPage").then((module) => ({
    default: module.SearchPage,
  }))
);
const ProfileDetailPage = lazy(() =>
  import("@/pages/ProfileDetailPage").then((module) => ({
    default: module.ProfileDetailPage,
  }))
);
const SelectedListPage = lazy(() =>
  import("@/pages/SelectedListPage").then((module) => ({
    default: module.SelectedListPage,
  }))
);

function App() {
  return (
    <BrowserRouter>
      <Suspense
        fallback={
          <div className="min-h-screen flex items-center justify-center text-slate-500">
            Loading Wobb...
          </div>
        }
      >
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/discover" element={<SearchPage />} />
          <Route path="/profile/:username" element={<ProfileDetailPage />} />
          <Route path="/selected" element={<SelectedListPage />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}

export default App;
