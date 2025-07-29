import React, { useState, useEffect } from 'react';
import './CountDown.css';

const CountDown = ({ initialCount = 3, onFinish }) => {
    const [count, setCount] = useState(initialCount);

    useEffect(() => {
        if (count === 'Go!') {
            const timer = setTimeout(() => {
                if (onFinish) onFinish();
            }, 2000);
            return () => clearTimeout(timer);
        }
        if (count > 0) {
            const timer = setTimeout(() => {
                setCount(count - 1);
            }, 1000);
            return () => clearTimeout(timer);
        }
        if (count === 0) {
            setCount('Go!');
        }
    }, [count, onFinish]);

    return (
        <div className="countdown-container">
            <div className={`countdown-text ${count === 'Go!' ? 'go-text' : ''}`} key={count}>
                {count}
            </div>
        </div>
    );
};

export default CountDown;
