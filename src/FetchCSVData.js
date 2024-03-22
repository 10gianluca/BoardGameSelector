import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './FetchCSVData.css'
export default function FetchCSVData() {
    const [csvData, setCsvData] = useState([]);
    const [gameType, setGameType] = useState('Any');
    const [numPlayer, setNumPlayer] = useState(null);
    const [played, setPlayed] = useState('Both');
    const [gameList, setGameList] = useState([]);
    const [randomGame, setRandomGame] = useState();

    useEffect(() => {
        const fetchCSVData = async () => {
            try {
                const response = await axios.get('https://docs.google.com/spreadsheets/d/e/2PACX-1vTkXMemEet2NxDvA0wod6cJA-6qPFPg4gFrbKdmcvVLXXzsWaRBH_Q9-D9jHPeDroONUiOBmLniOhzM/pub?output=csv');
                const data = response.data.split(/\r?\n/).map(row => row.split(','));
                const headers = data.shift();
                const formattedData = data.map(row => headers.reduce((acc, header, index) => ({ ...acc, [header]: row[index] }), {}));
                setCsvData(formattedData);
            } catch (error) {
                console.error('Error fetching CSV data:', error);
            }
        };
        fetchCSVData();
    }, []);

    function game() {
        const numPlayerInt = parseInt(numPlayer);
        let filteredGames = csvData.filter(game => {
            const numPlayerMin = parseInt(game.MIN);
            const numPlayerMax = parseInt(game.MAX);
            return numPlayerInt >= numPlayerMin && numPlayerInt <= numPlayerMax;
        });
        if (gameType !== 'Any') {
            filteredGames = filteredGames.filter(game => game.TYPE === gameType);
        }
        if (played !== 'Both') {
            filteredGames = filteredGames.filter(game => game.PLAYED === played);
        }
        if (filteredGames.length > 0) {
            setGameList(filteredGames);
            const randomIndex = Math.floor(Math.random() * filteredGames.length);
            setRandomGame(filteredGames[randomIndex]);
        } else {
            alert('No games found for the specified options');
            setGameList([]);
            setRandomGame(null);
        }
    }

    return (
        <div>
            <form>
                <input id="playerCountInput" type='number' placeholder='How Many Players' onChange={e => setNumPlayer(e.target.value)} value={numPlayer}></input>
                <select name="TYPE" onChange={e => setGameType(e.target.value)} value={gameType}>
                    <option value="Any">Any</option>
                    <option value="Individual">Individual</option>
                    <option value="Solo">Solo</option>
                    <option value="Cooperative">Cooperative</option>
                    <option value="Team">Team</option>
                </select>
                <select name="TYPE" onChange={e => setPlayed(e.target.value)} value={played}>
                    <option value="Both">Both</option>
                    <option value="Y">Played</option>
                    <option value="N">New</option>
                </select>
                <button type="button" id="gameButton" onClick={game}>Give Me Game</button>
            </form>
            {randomGame && (
                <div>
                    <h1>Game Details:</h1>
                    {Object.entries(randomGame).map(([key, value]) => (
                        <p key={key}><strong>{key}:</strong> {value}</p>
                    ))}
                </div>
            )}
        </div>
    );
}