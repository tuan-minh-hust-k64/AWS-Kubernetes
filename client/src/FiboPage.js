import React, { useEffect, useState } from 'react';
import axios from 'axios';

const FiboPage = () => {
    const [seenIndex, setSeenIndex] = useState([]);
    const [values, setValues] = useState({});
    const [index, setIndex] = useState('');
    useEffect(() => {
        axios.get('/api/getAll', {
            withCredentials: true
        })
            .then((response) => {
                setSeenIndex(response.data)
            })
        axios.get('/api/getRedis', {
            withCredentials: true
        })
            .then((response) => {
                setValues(response.data);
            })
    }, [])
    const handleSubmit =async () => {
        await axios.post('/api/caculFibo', {index}, {
            withCredentials: true
        })
        setIndex('');
    }
    const renderSeenIndex = () => {
        const entry = [];
        for(let key in values){
            entry.push(
                <div key={key}>
                    For index {key} cacul: {values[key]}
                </div>
            )
        }
        return entry;
    }
    return (
        <div>
            <div>
                <input value={index} onChange={(e) => setIndex(e.target.value)} />
                <button onClick={handleSubmit} >Submit</button>
            </div>
            <hr />
            <h3>Index cacul before:</h3>
            {
                seenIndex.map(({number}) => number).join(', ')
            }
            <hr />
            <h3>Index and value recenly:</h3>
            {
                renderSeenIndex()
            }
        </div>
    )
};
export default FiboPage;