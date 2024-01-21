import { useState } from "react";
import { useEffect } from "react";
import { Nutrition } from "./Nutrition";
import { LoaderPage } from "./LoaderPage";
import './App.css';
import video from './Video.mp4'


function App() {
// ? какая разница между useState() и useState('')-это текст string
  const [mySearch, setMySearch] = useState(""); //состояние что вводит пользлватель в инпуте
  const [wordSubmitted, setWordSubmitted] = useState("");//состояние чтобы запрос отправлялся только если нажали на кнопку поиска
  const [myNutrition, setMyNutrition] = useState(""); // состояние при запросе к серверу
  const [stateLoader, setStateLoader] = useState(false); //false первоначальное состояние, иначе при загрузке страницы сразу будет лоадер на странице. Лоадер должен включаться только при нажатии кнопки "search" и ожидании ответа от сервера.

  const APP_ID = '02e0d2c5';
  const APP_KEY = '1b8d76c35de95aadbb266fd853e4a114';
  const APP_URL = 'https://api.edamam.com/api/nutrition-details'

const fetchData = async (ingr) => {
  setStateLoader(true);

    const response = await fetch(`${APP_URL}?app_id=${APP_ID}&app_key=${APP_KEY}`, {
      method: "POST",
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ ingr: ingr })
    })

    if(response.ok) {
      setStateLoader(false);
      const data = await response.json();
      //console.log(data);
      setMyNutrition(data); //отображаем состояние, которое получили от сервера
    } else {
      setStateLoader(false);
      alert('ingredients entered incorrectly');
    }
  }

  const myRecipeSearch = e => {
    setMySearch(e.target.value);
  }

  const finalSearch = e => {
    e.preventDefault(); //чтобы страница не перезагружалась
    setWordSubmitted(mySearch);
  }
//hook UseEffect вызывается сразу как только загружается страница, или меняем состояние. Содержит два аргумента: первый-функция, второй-пустой массив []. Если мы хотим чтобы useEffect был вызван, когда меняется состояниие, то вместо пустого массива как второго аргумента, указываем конкретное состояние например: [title].
  useEffect(() => {
    if (wordSubmitted !== '') {
      // строка превращается в новый массив, (/[,,;,\n,\r]/) "\n" - когда функция видит символ новой строки, она разделяет строку на подстроки.
      let ingr = wordSubmitted.split(/[,,;,\n,\r]/);
      fetchData(ingr);
    }
  }, [wordSubmitted])


  return (
    <div className="App">
      {stateLoader && <LoaderPage />}
  
      <div className="container">
        <video autoPlay muted loop> <source src={video} type="video/mp4"/></video>
        <h1>Nutrition Analysis</h1>
      </div>

{/*прописываем атрибут onSubmit и прирывниваем к finalSearch*/}
      <form onSubmit={finalSearch}>
    {/* атрибут onChange так хотим иметь доступ к тому, что вводит пользователь*/}
        <input className="search" placeholder="Search..." onChange={myRecipeSearch}/>
        <button type="submit"><img width="48" height="48" src="https://img.icons8.com/color/48/search--v1.png" alt="search--v1"/></button>
      </form>

      <div>
        {myNutrition && <p className="par">{myNutrition.calories} kcal</p>}
        {myNutrition && Object.values(myNutrition.totalNutrients) //преобразование из объекта в массив
            .map(({index, label, quantity, unit }) =>
              <Nutrition key={index}
                label={label}
                quantity={quantity}
                unit={unit}/>
            )
        }
      </div>

    </div>
  );
}

export default App;




