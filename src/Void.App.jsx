import { useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";

import { db } from "./firebase";

import Header from "./components/Header";
import Home from "./pages/Home";
import Search from "./pages/Search";
import Reader from "./pages/Reader";
import Journal from "./pages/Journal";
import About from "./pages/About";

export default function App() {
  useEffect(() => {
    async function testFirebase() {
      try {
        const snap = await getDoc(doc(db, "test", "welcome"));

        if (snap.exists()) {
          console.log("Firebase connected:", snap.data());
        } else {
          console.log("Firebase connected, but document not found.");
        }
      } catch (err) {
        console.error("Firebase error:", err);
      }
    }

    testFirebase();
  }, []);

  return (
    <>
      <Header />
      <main className="app-main">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/search" element={<Search />} />
          <Route path="/reader/:id" element={<Reader />} />
          <Route path="/journal" element={<Journal />} />
          <Route path="/about" element={<About />} />
        </Routes>
      </main>
    </>
  );
}        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/search" element={<Search />} />
          <Route path="/reader/:id" element={<Reader />} />
          <Route path="/journal" element={<Journal />} />
          <Route path="/about" element={<About />} />
        </Routes>
      </main>
    </>
  );
}        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/search" element={<Search />} />
          <Route path="/reader/:id" element={<Reader />} />
          <Route path="/journal" element={<Journal />} />
          <Route path="/about" element={<About />} />
        </Routes>
      </main>
    </>
  );
}  return (
    <>
      <Header />
      <main className="app-main">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/search" element={<Search />} />
          <Route path="/reader/:id" element={<Reader />} />
          <Route path="/journal" element={<Journal />} />
          <Route path="/about" element={<About />} />
        </Routes>
      </main>
    </>
  );
}
