import React from "react";
import { useState } from "react";

export default function Grade(props: {
    name: string,
    score: number,
    total: number
}) {
    const [score, setScore] = useState(props.score);
    const [total, setTotal] = useState(props.total);

    return (
        <div className="grade">
            <p className="name">{props.name}</p>
            <input className="score" min={0} type="number" value={score} onChange={e => setScore(parseInt(e.target.value))}></input>/
            <input className="total" min={0} type="number" value={total} onChange={e => setTotal(parseInt(e.target.value))}></input>
        </div>
    )
}