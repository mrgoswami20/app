import './App.css';
import PatientDataApp from './PatientDataApp';

function App() {
  const address="0xa131AD247055FD2e2aA8b156A11bdEc81b9eAD95"
  return (
    <div className="">
      <PatientDataApp contractAddress={address}/>
    </div>
  );
}

export default App;
