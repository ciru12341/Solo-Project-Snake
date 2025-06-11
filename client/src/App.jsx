import { useState, useEffect, useRef } from 'react'
import './App.css'
import Canvas from './Canvas/Canvas'
import music from './assets/music.mp3'

function App() {

  const [leaderboard, setLeaderboard] = useState([]);
  const [showLeaderboard, setShowLeaderboard] = useState(false);
  const [muted, setMuted] = useState(false);
  const audioRef = useRef(null);

  const fetchData = async () => {
    try {
      const res = await fetch('http://localhost:3001/Leaderboard');
      const data = await res.json();
      setLeaderboard(data);
      setShowLeaderboard(true);
    } catch (error) {
      console.log('Error fetching leaderboard', error);
    }
  };


  const startMusic = () => {
    if (!audioRef.current) {
      const audio = new Audio(music);
      audio.loop = true;
      audio.volume = 0.3;
      audio.muted = muted;
      audioRef.current = audio;

      audio.play()
        .catch((e) => console.log('Playback failed:', e));
    }
  };

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.muted = muted;
    }
  }, [muted]);

  const toggleMute = () => {
    setMuted(prev => !prev);
  };


  return (
    <div id='main'>
      <h1>Snakesss</h1>
      <Canvas width='500' height='400' style={{background: 'black'}}
      fetchData={fetchData}
      showLeaderboard={showLeaderboard}
      leaderboard={leaderboard}
      hideLeaderboard={() => setShowLeaderboard(false)}
      toggleMute={toggleMute}
      muted={muted}
      startMusic={startMusic}
      />
    </div>
  )
}

export default App
