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

const Notification = ({ successMessage, errorMessage }) => {
    if (successMessage !== "" && errorMessage !== "")
        return (
            <div className={`message ${successMessage ? "success" : "error"}`}>
                {successMessage ? successMessage : errorMessage}
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
            {persons
                .filter((person) => {
                    if (person) return person.name.toLowerCase().includes(filterValue.toLowerCase());
                })
                .map((filteredPerson, index) => {
                    if (filteredPerson) {
                        return (
                            <>
                                <p key={filteredPerson.name}>
                                    {filteredPerson.name} {filteredPerson.number}{" "}
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
    const [successMessage, setSuccessMessage] = useState("");
    const [errorMessage, setErrorMessage] = useState("");

    useEffect(() => {
        phonebookService
            .getAll()
            .then((persons) => setPersons(persons))
            .catch((error) => console.error(error));
    }, []);

    const handleNewAddition = async (event) => {
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
                await phonebookService
                    .update(existsAlready.id, changedPerson)
                    .then((response) => {
                        setPersons(persons.map((person) => (person.id !== existsAlready.id ? person : response)));

                        setNewName("");
                        setNewNumber("");

                        setSuccessMessage("Successfully Changed!");
                        setTimeout(() => {
                            setSuccessMessage("");
                        }, 5000);
                    })
                    .catch((error) => {
                        setErrorMessage(`Information of ${changedPerson.name} has already been removed from server`);
                        setTimeout(() => {
                            setErrorMessage("");
                        }, 5000);
                        setPersons(persons.filter((p) => p.id !== id));
                        setNewName("");
                        setNewNumber("");
                    });
            }
            return;
        }

        const newPerson = { name: newName, number: newNumber };
        await phonebookService
            .create(newPerson)
            .then((response) => {
                console.log(response);
                setPersons(persons.concat(response));
                setSuccessMessage("Successfully Added!");
                setTimeout(() => {
                    setSuccessMessage("");
                }, 5000);
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
        // console.log(event.target.value);
        setNewName(event.target.value);
    };

    const handleNumberChange = (event) => {
        // console.log(event.target.value);
        setNewNumber(event.target.value);
    };

    const handleFilterValueChange = (event) => {
        setFilterValue(event.target.value);
    };

    return (
        <div>
            <h1>Phonebook</h1>
            <Notification successMessage={successMessage} errorMessage={errorMessage} />
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
