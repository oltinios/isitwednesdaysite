import React from "react";
import "./style/App.css";

export default function NotWednesday() {

    const messages = [
        "MongoDB incoming",
        "soon",
        "it is",
        "wednesday my dudes",
        "ooooohh yeahhhhh"
    ]

    return (
    <div className="page">
        <div className="top-bar">
            <div className="ticker"> 
                {messages.concat(messages).map((msg, i) => (
                    <div className="box" key={i}>
                    {msg}
                    </div>
            ))}
            </div>
        </div>
        <h1>It is NOT Wednesday 😔</h1>
        <p>Come back when it is Wednesday my dudes.</p>
    </div>
    );
}