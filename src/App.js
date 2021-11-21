import React, {useState, useEffect} from 'react'
import axios from 'axios'
import './App.css';

function App() {

  const baseUrl = "http://localhost:8080"

  const [todos, setTodos] = useState([]);
  const [input, setInput] = useState("");

  useEffect(() => {
    getTodos();
  }, [])  // [] 리액트 열렸을 때 한번만 실행하는 게 하는 것!

  async function getTodos(){
    await axios             // 다 받을 때까지 기다리는 것
      .get(baseUrl + "/todo")   
      .then((res) => {
        console.log(res.data)
        setTodos(res.data)
      })
      .catch((err) => {
        console.log(err)
      })
  }

  function insertTodo(e){
    e.preventDefault()

    const insertTodo = async() => {
      await axios
            .post(baseUrl + "/todo", {
              title: input
            })
            .then((res) => {
              console.log(res.data)
              setInput("")
              getTodos()
            })
            .catch((err) => {
              console.log(err)
            })
    }
    insertTodo()
    console.log("할일이 추가되었습니다.")
  }

  function updateTodo(id){
    const updateTodo = async() => {
      await axios
            .put(baseUrl + "/todo/" + id, {})
            .then((res) => {
              console.log(res.data)
              // getTodos()   굳이 db에 더 조회하지 말자!
              // 화면에서 바꾸자
              setTodos(
                todos.map((todo) => 
                  todo.id === id ? {...todo, completed: !todo.completed} : todo
                )
              )
            })
            .catch((err) => {
              console.log(err)
            })
    }
    updateTodo()
  }

  function deleteTodo(id){
    const deleteTodo = async() => {
      await axios
            .delete(baseUrl + "/todo/" + id, {})
            .then((res) => {
              console.log(res.data)

              setTodos(
                todos.filter((todo) => todo.id !== id)
              )
            })
            .catch((err) => {
              console.log(err)
            })
    }
    deleteTodo()
  }

  function changeText(e){
    e.preventDefault()
    setInput(e.target.value)
    console.log(input)
  }



  return (
    <div className="App">
      <h1>TODO LIST</h1>
      <form onSubmit={insertTodo}>
        <label>
          Todo &nbsp;
          <input type="text" required={true} value={input} onChange={changeText}/>
        </label>
        <input type="submit" value="Create" />
      </form>
      {
        todos
        ? todos.map((todo) => {
          return (
            <div className="todo" key={todo.id}>
              <h3>
                <label 
                  className= {todo.completed ? "completed" : null}
                  onClick={() => updateTodo(todo.id)}>
                {todo.title}
                </label>
                <label onClick={() => deleteTodo(todo.id)}>&nbsp;❌</label>
              </h3>
            </div>
          )
        })
        : null
      }
    </div>
  );
}

export default App;
