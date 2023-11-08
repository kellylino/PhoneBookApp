const Persons = (props) => {
    return(
      <div>
        {props.newPersons.map 
          (person => 
            <div key={person.id}>
              {person.name} 
              {person.number}
              <button onClick={() => props.deleteName(person.id, person.name) }>delete</button>
            </div>
          )
        }
      </div>
    )
  }

  export default Persons