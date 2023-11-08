import { useState, useEffect } from 'react'
import phonebookService from './ services/phonebook'
import Filter from './components/Filter'
import PersonForm from './components/PersonForm'
import Persons from './components/Persons'
import Notification from './components/Notification'

const App = () => {
  const [persons, setPersons] = useState([])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [newPersons, setNewPersons] = useState([])
  const [message, setMessage] = useState(null)
  const [className, setClassName] = useState('')

  useEffect(()=>{
    phonebookService
      .getAll()
      .then(initialData => {
        setPersons(initialData)
      })
  },[])

  const notificationFadeOut = () => {
    setTimeout(() => {
      setMessage(null)
    }, 3000);
  }

  const addName = (event) => {
    event.preventDefault()
    const newObject = {name: newName, number: newNumber}

    persons.filter((person) => person.name === newName).length > 0
    ? (() => {
        if(window.confirm(`${newName} is already added to phonebook, replace the old number with a new one?`)) {
          const id = (persons.filter(person => person.name === newName))[0].id
          phonebookService
            .update(id, newObject)
            .then(returnPhonebook => {
              setPersons(persons.map(person => person.id !== id? person : returnPhonebook))
              setNewName('')
              setNewNumber('')
              setClassName('success')
              setMessage(`${newName}'s phone number has been updated`)
              notificationFadeOut()
            })
            .catch(error => {
              setClassName('error')
              setMessage(`Information of ${newName} has already been remove from server`)
              notificationFadeOut()
            })
        } else {
          setNewName('')
          setNewNumber('')
        }
    })()
    : (() => {
        phonebookService
          .create(newObject)
          .then(returnPhonebook => {
            setPersons(persons.concat(returnPhonebook))
            setNewName('')
            setNewNumber('')
            setClassName('success')
            setMessage(`Added ${newName}`)
            notificationFadeOut()
          })
          .catch(error => {
            setClassName('error')
            setMessage(error.response.data.error)
            notificationFadeOut()
          })
      })();
  }

  const deleteName = (id, name) => {
    if(window.confirm(`Delete ${name} ?`)){
      phonebookService
        .remove(id)
        .then(() => {
          setPersons(persons.filter(person => person.id !== id))
          setNewPersons(newPersons.filter(person => person.id !== id))
          setClassName('success')
          setMessage(`Delete ${name}`) 
          notificationFadeOut()
        })
        .catch(error => {
          setClassName('error')
          setMessage(`Information of ${name} has already been remove from server`)
          notificationFadeOut()
        })
    }
  }

  const handleNameChange = (event) => {
    setNewName(event.target.value)
  }

  const handleNumberChange = (event) => {
    setNewNumber(event.target.value)
  }

  const handleFilterChange = (event) => {
    const filterValue = event.target.value.trim()
  
    if (filterValue === '') {
      setNewPersons([])
    } else {
      const filterPerson = persons.filter((person) =>
        person.name.trim().toLowerCase().includes(filterValue.toLowerCase())
      )
      setNewPersons(filterPerson)
    }
  }

  return (
    <div>
      <h2>Phonebook</h2>
      <Notification 
      message={message}
      className={className}
      />
      <br/>
      <Filter handleFilterChange={handleFilterChange}/>
      <h2>add a new</h2>
      <PersonForm 
        addName={addName}
        newName={newName} 
        newNumber={newNumber} 
        handleNameChange={handleNameChange} 
        handleNumberChange={handleNumberChange}
      />
      <h2>Numbers</h2>
      <Persons 
        newPersons={newPersons}
        deleteName={deleteName}
      />
    </div>
  )
}

export default App
