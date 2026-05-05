import { LandingPage } from "./pages/LandingPage"
import { Routes, Route} from "react-router-dom";

function App() {

  return (
    <div className="App">
      <h1>Habit Tracker</h1>
        <Routes>
          <Route path="/" element={<LandingPage />} />
        </Routes>
    </div>
  )
}

export default App
