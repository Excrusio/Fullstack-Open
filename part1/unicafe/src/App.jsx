import { useState } from "react";

const Statistics = (props) => {
    if (props.totalCount) {
        return (
            <div>
                <h2>Statistics</h2>
                <table>
                    <tbody>
                        <StatisticsLine name={"Good"} count={props.goodCount} />
                        <StatisticsLine name={"Neutral"} count={props.neutralCount} />
                        <StatisticsLine name={"Bad"} count={props.badCount} />
                        <StatisticsLine name={"All"} count={props.totalCount} />
                        <StatisticsLine
                            name={"Average"}
                            count={(props.goodCount - props.badCount) / props.totalCount}
                        />
                        <StatisticsLine name={"Positive"} count={(props.goodCount / props.totalCount) * 100} />
                    </tbody>
                </table>
            </div>
        );
    } else {
        return (
            <div>
                <h2>Statistics</h2>
                <h3>No Feedback Given</h3>
            </div>
        );
    }
};

const StatisticsLine = (props) => {
    return (
        <tr>
            <td>
                {props.name} {props.count} {props.name === "Positive" ? "%" : ""}
            </td>
        </tr>
    );
};

const Button = ({ text, clickHandler }) => {
    return (
        <button style={{ display: "flex", margin: "10px" }} onClick={clickHandler}>
            {text}
        </button>
    );
};

function App() {
    const [goodCount, setGoodCount] = useState(0);
    const [neutralCount, setNeutralCount] = useState(0);
    const [badCount, setBadCount] = useState(0);
    const [totalCount, setTotalCount] = useState(0);

    const handleGoodClick = () => {
        setGoodCount((count) => count + 1);
        setTotalCount((count) => count + 1);
    };

    const handleNeutralClick = () => {
        setNeutralCount((count) => count + 1);
        setTotalCount((count) => count + 1);
    };

    const handleBadClick = () => {
        setBadCount((count) => count + 1);
        setTotalCount((count) => count + 1);
    };

    return (
        <div className="App">
            <h1>Give Feedback</h1>
            <div style={{ display: "flex" }}>
                <Button text={"good"} clickHandler={handleGoodClick} />
                <Button text={"neutral"} clickHandler={handleNeutralClick} />
                <Button text={"bad"} clickHandler={handleBadClick} />
            </div>
            <Statistics goodCount={goodCount} neutralCount={neutralCount} badCount={badCount} totalCount={totalCount} />
        </div>
    );
}

export default App;
