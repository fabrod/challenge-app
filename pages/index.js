import { useState } from 'react';
/* eslint-disable @next/next/no-img-element */

// Bootstrap styles, and components
import 'bootstrap/dist/css/bootstrap.min.css';
import Carousel from 'react-bootstrap/Carousel'
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'

// Chart.js setup
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

export default function Home() {
  // Url useState for managing the url given by the user
  const [Url, setUrl] = useState(' ');
  // A boolean value for condition rendering of the bar chart, and the carousel
  const [ShowResults, setShowResults] = useState(false);
  // Images useState is a list of images's url, later used for the carousel
  const [Images, setImages] = useState([]);
  // GraphData is a let useState, later used for the bar chart
  let [GraphData, setGraphData] = useState({
    labels: [],
    datasets: [{
      data: [],
      backgroundColor: [
        'rgba(255, 99, 132, 0.2)',
        'rgba(255, 159, 64, 0.2)',
        'rgba(255, 205, 86, 0.2)',
        'rgba(75, 192, 192, 0.2)',
        'rgba(54, 162, 235, 0.2)',
        'rgba(153, 102, 255, 0.2)',
        'rgba(201, 203, 207, 0.2)'
      ],
      borderColor: [
        'rgb(255, 99, 132)',
        'rgb(255, 159, 64)',
        'rgb(255, 205, 86)',
        'rgb(75, 192, 192)',
        'rgb(54, 162, 235)',
        'rgb(153, 102, 255)',
        'rgb(201, 203, 207)'
      ],
      borderWidth: 1
    }]
  });

  // SubmitFunc is a asynchronous function for fetching data from the api
  const SubmitFunc = async () => {
    // Setting the showResult to false for reloading of the bar chart and the carousel
    setShowResults(false)

    // Using post method, sends request with url in the body json
    let response = await fetch('/api/getUrlData', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json;charset=utf-8'
      },
      body: JSON.stringify({ url: Url })
    });

    let result = await response.json();
    // Sets the Images with fetched images response from the api
    setImages(result.images)

    // Due to the GraphData not being const, change the exact values required and then save the changes by using Set function.
    GraphData.labels = result.topTenWords
    GraphData.datasets[0].data = result.topTenWordsCount
    setGraphData(GraphData)

    // Set the showResult true after completion, to render the carousel and the bar chart
    setShowResults(true)
  }


  return (
    <>
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', paddingTop: '5rem' }}>
        <div style={{ width: '30%' }}>
          <Form.Label style={{ fontSize: '32pt' }} htmlFor='inputUrl5'>Enter the Url</Form.Label>
          <div style={{ display: 'flex' }}>
            <Form.Control
              type='url'
              id='inputUrl5'
              aria-describedby='urlHelpBlock'
              onChange={e => setUrl(e.target.value)}
            />
            <Button onClick={() => SubmitFunc()} style={{ marginLeft: '1rem' }} variant='primary'>Submit</Button>
          </div>
          <Form.Text id='urlHelpBlock' muted>
            Example :- https://fakestoreapi.com/products?limit=5
          </Form.Text>
      </div>
      </div>

      {
        ShowResults &&
      <div style={{ display: 'flex', justifyContent: 'space-around', paddingRight: '1%', paddingLeft: '1%', alignItems: 'center' }}>
        <Carousel style={{ width: '50rem', height:'50rem', marginRight: '10%' }}>
          {/* Using map to add images to the carousel */}
          {Images.map((imgSrc, index) => <Carousel.Item key={index}>
            <img
              className='d-block w-100 h-100'
              src={imgSrc}
              alt='First slide'
            />
          </Carousel.Item>)}
        </Carousel>
        <div style={{ width: '100%' }}>
          {/* Setting options to use bar chart horizontally */}
          <Bar options={{
            indexAxis: 'y',
            elements: {
              bar: {
                borderWidth: 2,
              },
            },
            responsive: true,
            plugins: {
              legend: {
                display: false,
              },
              title: {
                display: true,
                text: 'Most frequent used words',
              },
            },
          }} data={GraphData} ></Bar>
        </div>
      </div>
      }
    </>
  )
}
