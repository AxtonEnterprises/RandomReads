import { useEffect } from "react";
import { db } from "./firebase";
import { doc, getDoc } from "firebase/firestore";

function App() {

  useEffect(() => {
    async function testFirebase() {
      try {
        const snap = await getDoc(doc(db, "test", "welcome"));

        if (snap.exists()) {
          console.log("Firebase:", snap.data());
        } else {
          console.log("Document not found");
        }
      } catch (err) {
        console.error(err);
      }
    }

    testFirebase();
  }, []);

  return (
    <div>
      Random Reads
    </div>
  );
}

export default App;}

export default App;

export default function App() {
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
}
