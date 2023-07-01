import './App.css';
// import AudioChat from './Components/Home Page/FeaturePage/AudioChat';
import UserVideoChat from './Components/Home Page/FeaturePage/UserVideoChat';
import Header from './Components/Home Page/Header';
import UtilNavbar from './Components/Home Page/UtilNavbar';
// import Test from './UtilFunctions/Test';


function App() {

  
  return (
    <div className="App">
     <Header />
     <UtilNavbar />
     <UserVideoChat />
     {/* <AudioChat /> */}
     {/* <Test /> */}
    </div>
  );
}

export default App;
