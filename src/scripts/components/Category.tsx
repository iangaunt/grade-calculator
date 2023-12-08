import React from "react";

import Title from "./Title"
import Grade from "./Grade"

function showElements(elements: Array<JSX.Element>) {
    for (let i = 1; i < elements.length; i++) {
        let grade = elements[i];
        let score = grade.props.score;

        console.log(grade.key);
    }
}

export default function Category(props: {
    elements: Array<JSX.Element>
}) {
    return (
        <div className="category" onMouseDown={() => showElements(props.elements)}>
            {props.elements}
        </div>
    )
}