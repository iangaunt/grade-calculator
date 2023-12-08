import "../css/style.css";

import React from "react";
import { createRoot } from "react-dom/client";

import Category from "./components/Category"
import Grade from "./components/Grade"
import Title from "./components/Title"

function buildGradeChart() {
    const input: HTMLInputElement = document.getElementById("course-input") as HTMLInputElement;
    const inputValue: string = input.value;

    let lexerArr = [];
    let str = "";

    // Prunes all tab characters from the input.
    for (let i = 0; i < inputValue.length; i++) {
        let c = inputValue.charAt(i);
        if (c == '\t') {
            lexerArr.push(str);
            str = "";
        } else {
            str += c;
        }
    }

    lexerArr.push(str);
    console.log(lexerArr);

    // Builds the list of assignments based on the lexed input string.
    let currentCategory = "";
    let currentAssignment = "";

    let key = 0;

    let elementArray: Array<JSX.Element> = [];
    let categoryArray: Array<JSX.Element> = [];

    for (let i = 0; i < lexerArr.length; i++) {
        // If the string is empty, ignore its contents.
        if (lexerArr[i].length == 0) continue;
        if ((currentAssignment != "" && (lexerArr[i].charAt(0) != " ") && !(i == lexerArr.length - 1))) continue;

        // Check to see if we have a new category.
        if (currentCategory == "" || lexerArr[i].indexOf("BACK TO TOP") > -1) {
            if (lexerArr[i].indexOf("/") == -1) {
                if (lexerArr[i].indexOf("BACK TO TOP") > -1) lexerArr[i] = lexerArr[i].substring(lexerArr[i].indexOf("BACK TO TOP") + 12)
                let running = "";

                elementArray.push(<Category elements={categoryArray} />);
                categoryArray = [];

                for (let j = 0; j < lexerArr[i].length; j++) {
                    if (lexerArr[i][j] == " ") {
                        categoryArray.push(<Title name={running} key={key}/>);
                        currentCategory = running;
                        key++;
                        
                        break;
                    } else {
                        running += lexerArr[i][j];
                    }
                }
                i += 3;
                continue;
            }
        }

        // Build assignments by fetching the name, then moving down two elements to skip due dates.
        if (currentAssignment == "") {
            if (lexerArr[i].indexOf("Notes ") == 0) lexerArr[i] = lexerArr[i].substring(6);
            currentAssignment = lexerArr[i];

            if (currentAssignment.length > 25) currentAssignment = currentAssignment.substring(0, 24) + "...";
            continue;
        } else {
            lexerArr[i] = lexerArr[i].substring(1);

            let grade = lexerArr[i].substring(0, lexerArr[i].indexOf(" "));
            if (i == lexerArr.length - 1) grade = lexerArr[i];
            
            const score = grade.substring(0, lexerArr[i].indexOf("/"));
            const total = grade.substring(lexerArr[i].indexOf("/") + 1);

            categoryArray.push(<Grade name={currentAssignment} score={score} total={total} key={key} />);
            currentAssignment = "";
            key++;

            lexerArr[i] = lexerArr[i].substring(lexerArr[i].indexOf(" "));
            i--;
        }
    }

    elementArray.push(<Category elements={categoryArray} />);
    categoryArray = [];

    createRoot(document.getElementById("grade-contents")).render(<Category elements={elementArray} />);
}

function Header() {
    return (
        <div className="container">
            <header id="title-box">
                <h1>Ian's Grade Calculator</h1>
                <hr></hr>
                <h2>
                    This website will convert Blackbaud point totals into editable grades which you
                    can use to calculate your future grade instead of doing it by hand.
                </h2>
            </header>
            <div id="warning"></div>
            <div id="input">
                <div id="instructions">
                    <h2>Copy and paste your <b>entire</b> Blackbaud grade page in this box, starting from your top-most category, such as "Test" or "Classwork":</h2>
                </div>
                
                <input id="course-input" type="text"></input>
                <button onClick={() => buildGradeChart()}>Calculate</button>
            </div>
            <div id="grade-contents">
                
            </div>
            <div id="results"></div>
        </div>
    )
}

createRoot(document.getElementById("main")).render(Header());