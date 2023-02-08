import { useEffect, useState } from "react";
import axios from "axios";
import phonebookService from "./services/Phonebook";

const Filter = ({ filterValue, handleFilterValueChange }) => {
    return (
        <div>
            Filter shown with: <input value={filterValue} onChange={handleFilterValueChange} />
        </div>
    );
};

const AddEntry = (props) => {
    return (
        <div>
            <h2>Add New Contact</h2>
            <form>
                <div>
                    name: <input value={props.newName} onChange={props.handleNameChange} />
                </div>
                <br />
                <div>
                    number: <input value={props.newNumber} onChange={props.handleNumberChange} />
                </div>
                <div>
                    <button type="submit" onClick={props.handleNewAddition}>
                        add
                    </button>
                </div>
            </form>
        </div>
    );
};

const DisplayNames = ({ persons, filterValue, handlePersonDelete }) => {
    return (
        <div>
            {persons.map((person, index) => {
                if (person.name.toLowerCase().includes(filterValue.toLowerCase())) {
                    return (
                        <>
                            <p key={person.name}>
                                {person.name} {person.number}{" "}
                                <button onClick={() => handlePersonDelete(index)}>Delete</button>
                            </p>
                        </>
                    );
                }
            })}
        </div>
    );
};

const App = () => {
    const [persons, setPersons] = useState([]);
    const [newName, setNewName] = useState("");
    const [newNumber, setNewNumber] = useState("");
    const [filterValue, setFilterValue] = useState("");

    useEffect(() => {
        phonebookService
            .getAll()
            .then((persons) => setPersons(persons))
            .catch((error) => console.error(error));
    }, []);

    const handleNewAddition = (event) => {
        event.preventDefault();

        const existsAlready = persons.find((person) => person.name === newName.toLowerCase());

        if (existsAlready && existsAlready.number === newNumber) {
            alert(`${newName} is already added to phonebook`);
            setNewName("");
            setNewNumber("");
            return;
        }

        if (existsAlready) {
            if (window.confirm(`${existsAlready.name} is added already to the phonebook. Update number?`)) {
                const changedPerson = { ...existsAlready, number: newNumber };
                phonebookService
                    .update(existsAlready.id, changedPerson)
                    .then((response) =>
                        setPersons(persons.map((person) => (person.id !== existsAlready.id ? person : response)))
                    )
                    .catch((error) => console.error(error));
                setNewName("");
                setNewNumber("");
            }
            return;
        }

        const newPerson = { name: newName, number: newNumber };
        phonebookService
            .create(newPerson)
            .then((response) => {
                setPersons(persons.concat(response.data));
                setNewName("");
                setNewNumber("");
            })
            .catch((error) => console.error(error));
        return;
    };

    const handlePersonDelete = (id) => {
        console.log(id);
        let deleteUser = window.confirm(`Delete ${persons[id].name}?`);
        if (deleteUser) {
            phonebookService
                .deletePerson(id + 1)
                .then((_) => {
                    setPersons(persons.filter((person) => person.id !== id + 1));
                })
                .catch((error) => console.error(error));
        }
    };

    const handleNameChange = (event) => {
        console.log(event.target.value);
        setNewName(event.target.value);
    };

    const handleNumberChange = (event) => {
        console.log(event.target.value);
        setNewNumber(event.target.value);
    };

    const handleFilterValueChange = (event) => {
        setFilterValue(event.target.value);
    };

    return (
        <div>
            <h2>Phonebook</h2>
            <Filter filterValue={filterValue} handleFilterValueChange={handleFilterValueChange} />
            <AddEntry
                newName={newName}
                newNumber={newNumber}
                handleNameChange={handleNameChange}
                handleNumberChange={handleNumberChange}
                handleNewAddition={handleNewAddition}
            />
            <h2>Numbers</h2>
            <DisplayNames persons={persons} filterValue={filterValue} handlePersonDelete={handlePersonDelete} />
        </div>
    );
};

export default App;
