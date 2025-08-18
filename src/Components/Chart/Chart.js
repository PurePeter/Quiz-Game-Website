import React from 'react';
import './Chart.css';

const Chart = ({ data, correctIndex, shapes }) => {
    const colors = ['#e74c3c', '#3498db', '#f1c40f', '#27ae60'];
    const max = Math.max(...data, 1);
    return (
        <div className="chart-bar-demo">
            {data.map((value, idx) => (
                <div className={`chart-bar-col ${idx === correctIndex ? 'correct' : ''}`} key={idx}>
                    <div className="chart-bar-value" style={{ color: colors[idx] }}>
                        {idx === correctIndex && <span style={{ fontSize: 20, marginRight: 2 }}>✔</span>}
                        {value}
                    </div>
                    <div
                        className="chart-bar-rect"
                        style={{
                            height: `${Math.max(40, (value / max) * 120)}px`,
                            background: colors[idx],
                        }}
                    ></div>
                    <div className="chart-bar-shape">
                        <Shape type={shapes[idx]} />
                    </div>
                </div>
            ))}
        </div>
    );
};

const Shape = ({ type }) => {
    return <div className={`chart-bar-shape-${type}`}></div>;
};

export default Chart;
