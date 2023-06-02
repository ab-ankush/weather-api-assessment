import express from "express";
import Axios from "axios";
import path from "path";
import { fileURLToPath } from "url";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const getData = async (cities) => {
  const weather = new Object();

  if (Array.isArray(cities)) {
    const data = cities.map(async (city) => {
      const res1 = await Axios.get(
        `http://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=1&appid=bbadd8941aaa206693ec6b0efc22dc8e`
      );
      const { lat } = res1.data[0];
      const { lon } = res1.data[0];

      const res2 = await Axios.get(
        `http://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=bbadd8941aaa206693ec6b0efc22dc8e&units=metric`
      );
      return res2.data.main.temp;
    });

    const fData = await Promise.all(data);

    cities.map((city, index) => {
      weather[city] = fData[index];
    });

    return weather;
  } else {
    const weather = new Object();
    const res1 = await Axios.get(
      `http://api.openweathermap.org/geo/1.0/direct?q=${cities}&limit=1&appid=bbadd8941aaa206693ec6b0efc22dc8e`
    );
    const { lat } = res1.data[0];
    const { lon } = res1.data[0];

    const res2 = await Axios.get(
      `http://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=bbadd8941aaa206693ec6b0efc22dc8e&units=metric`
    );
    weather[cities] = res2.data.main.temp;
    return weather;
  }
  //   return weather;
};

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});

app.post("/", async (req, res) => {
  const { cities } = req.body;
  //   res.send(cities);

  const weather = await getData(cities);
  res.json(weather);
});

app.listen(5001, () => {
  console.log("serving on port 5000");
});
