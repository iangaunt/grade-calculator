import React from "react";

import Title from "./Title"
import Grade from "./Grade"

function showElements(id: string) {
    let elem = document.getElementById(id);
    let scoreElements: Array<HTMLInputElement> = Array.from(elem.getElementsByClassName("score")) as Array<HTMLInputElement>;
    let totalElements: Array<HTMLInputElement> = Array.from(elem.getElementsByClassName("total")) as Array<HTMLInputElement>;

    let score: number = 0, total: number = 0;
    for (let i = 0; i < scoreElements.length; i++) {
        score += parseInt(scoreElements[i].value);
        total += parseInt(totalElements[i].value);
    }

    elem.getElementsByClassName("percentage")[0].innerHTML = Math.round((score / total) * 10000) / 100 + "%";
}

export default function Category(props: {
    elements: Array<JSX.Element>,
    id: string
}) {
    return (
        <div id={props.id} className="category" onClick={() => showElements(props.id)} onLoad={() => showElements(props.id)}>
            {props.elements}
        </div>
    )
}