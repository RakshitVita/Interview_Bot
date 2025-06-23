import React,{useEffect,useState} from 'react'
import Conversation from './components/11LabsConvo/Conversation';
import './App.css';

const App = () => {

  const [params, setParams] = useState({
    job_id: null,
    candidate_id: null,
    agent_id: null
  });

    const [isValid, setIsValid] = useState(true);

    useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);

    const job_id = searchParams.get("job_id");
    const candidate_id = searchParams.get("candidate_id");
    const agent_id = searchParams.get("agent_id");

    setParams({ job_id, candidate_id, agent_id });

     if (job_id && candidate_id && agent_id) {
      setParams({ job_id, candidate_id, agent_id });
      setIsValid(true);
    } else {
      setIsValid(false);
    };

  }, []);

    if (!isValid) {
    return (
      <div className="InvalidParams" >
        🚫 Incorrect URL – Required parameters missing.
      </div>
    );
  }

  return (
    <>
      <Conversation  agent_id={params.agent_id} candidate_id={params.candidate_id} job_id={params.job_id}/>
    </>
  )
}

export default App
