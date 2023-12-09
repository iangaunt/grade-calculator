import React from "react";

export default function Title(props: {
    name: string,
    weight?: number
}) {
    return (
        <div className="title">
            <p className="arrow">{ ">" }</p><h1>{props.name}: <p className="percentage">TBA%</p></h1>
            <h2>Weight: </h2><input min="0" max="100" type="number">{props.weight}</input>
        </div>
    )
}