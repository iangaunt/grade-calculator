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

    // Builds the list of assignments based on the lexed input string.
    let currentCategory = "";
    let currentAssignment = "";

    // Strings to remove from Assignment names.
    let removedNoteWords = ["Absent", "Excused", "Late", "Due", "Missing"];

    // Key for labeling React elements.
    let key = 0;

    // Arrays for storing all categories, and for building categories.
    let elementArray: Array<JSX.Element> = [];
    let categoryArray: Array<JSX.Element> = [];

    for (let i = 0; i < lexerArr.length; i++) {
        // If the string is empty, ignore its contents.
        if (lexerArr[i].length == 0) continue;

        // If we are looking for a score string, ignore strings without the initial space identifier.
        if ((currentAssignment != "" && (lexerArr[i].charAt(0) != " ") && !(i == lexerArr.length - 1))) continue;

        // Check to see if we have a new category.
        if (currentCategory == "" || lexerArr[i].indexOf("BACK TO TOP") > -1) {
            if (lexerArr[i].indexOf("/") == -1) {
                if (lexerArr[i].indexOf("BACK TO TOP") > -1) lexerArr[i] = lexerArr[i].substring(lexerArr[i].indexOf("BACK TO TOP") + 12)
                let running = "";

                // If we have a new category, append the completed Category to the main array.
                elementArray.push(<Category elements={categoryArray} id={currentCategory.toLowerCase()} />);
                categoryArray = [];

                // Find the title of the category.
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
                
                // Skip 3 labels (Assignments, Notes, etc.) for accurate scraping.
                i += 3;
                continue;
            }
        }

        // Build assignments by fetching the name and then ignoring due dates.
        if (currentAssignment == "") {
            if (lexerArr[i].indexOf("Notes ") == 0) lexerArr[i] = lexerArr[i].substring(6);
            currentAssignment = lexerArr[i];

            // Removes all notable note keywords from the assignment name.
            for (let i = 0; i < removedNoteWords.length; i++) {
                while (currentAssignment.indexOf(removedNoteWords[i]) > -1) {
                    currentAssignment = currentAssignment.replace(removedNoteWords[i], "");
                }
            }

            // Cuts down longer assignment names.
            if (currentAssignment.length > 25) currentAssignment = currentAssignment.substring(0, 24) + "...";
            continue;
        } else {
            // Snips the substring for finding the score and totals.
            lexerArr[i] = lexerArr[i].substring(1);

            let grade = lexerArr[i].substring(0, lexerArr[i].indexOf(" "));
            if (i == lexerArr.length - 1) grade = lexerArr[i];
            
            const score = grade.substring(0, lexerArr[i].indexOf("/"));

            let cutoff = lexerArr[i].length;
            if (lexerArr[i].substring(lexerArr[i].indexOf("/")).indexOf(" ") > -1) cutoff = lexerArr[i].indexOf(" ");

            const total = grade.substring(lexerArr[i].indexOf("/") + 1, cutoff);

            // Adds a new Grade to the current Category.
            categoryArray.push(<Grade name={currentAssignment} score={score} total={total} key={key} />);
            currentAssignment = "";
            key++;

            // Backtracks to check if a new Category is on the same line.
            lexerArr[i] = lexerArr[i].substring(lexerArr[i].indexOf(" "));
            i--;
        }
    }

    // Push all the completed categories to the website and render.
    elementArray.push(<Category elements={categoryArray} id={currentCategory.toLowerCase()} />);
    categoryArray = [];

    createRoot(document.getElementById("grade-contents")).render(elementArray);
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