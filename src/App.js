import logo from './logo.svg';
import './App.css';
import MainBoard from './components/MainBoard';
import { makeResponsive } from 'react-responsive-background';
import MenuBackground from './images/back_Im_4.jpg'
import SinglePlayerArea from './components/SinglePlayerArea';
import SinglePlayerAreaL2 from './components/SinglePlayerAreaL2';
import VsIAPlayerL1 from './components/VsIAPlayerL1'
import { BrowserRouter, Route, Routes } from "react-router-dom";
const sizes = '';
 
const Component = ({ children }) => (
  <div
    style={{
      // set our styles
      backgroundRepeat: 'repeat-x-y',
      backgroundPosition: 'center center',

 
      // set background image
      backgroundImage:'url('+MenuBackground+')'
    }}
  >
   {children}
  </div>
);
 
const WrappedComponent = makeResponsive({
  sizes,
})(Component);

function App() {
  return (
    
    <div className="App">
       <WrappedComponent>
        <div style={{display:'flex',justifyContent:'center',alignItems:'center' }}> 
        <div style={{backgroundColor: 'rgba(0,0,0,0.5)' ,width:'80vh',height:"100vh",display:'flex',justifyContent:'center',alignItems:'center'}} >
          <div>
         
            <Routes>
                <Route path='/' element={<MainBoard/>} />
                <Route path='/LocalMultiplayer/L1' element={<SinglePlayerArea/>}  />
                <Route path='/LocalMultiplayer/L2' element={<SinglePlayerAreaL2/>}  />
                <Route path='/VsIAPlayer/L1' element={<VsIAPlayerL1/>} />
             
            </Routes>
        
          </div>
             
        </div>
        </div>
      </WrappedComponent>
    </div>
  
  );
}

export default App;
