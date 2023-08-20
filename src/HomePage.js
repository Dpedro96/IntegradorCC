import './HomePage.css'
import i1 from './img1.jpg'
import i3 from './img3.jpg'
import i4 from './img4.jpg'
import i5 from './img5.jpg'
import {Carousel} from 'react-bootstrap'

function HomePage(){
    return( 
      <section className='background'>
        <Carousel>
          <Carousel.Item>
            <img src={i1} alt="First slide" className='img'/>
            <Carousel.Caption>
              <h2>Controle Total</h2>
              <p>Com o PoupAqui você consegue controlar seus gastos de maneira muita mais eficeiente e organizada</p>
              <input type="button" classeName= "bt_comecar" value="Comece agora!"/>
            </Carousel.Caption>
          </Carousel.Item>

          <Carousel.Item>
          <img src={i3} alt="First slide" className='img'/>

            <Carousel.Caption>
              <h2>Maior Praticidade</h2>
              <p>Controle suas contas de um jeitp muito mais no confortavel</p>
              <input type="button" classeName= "bt_comecar" value="Comece agora!"/>
            </Carousel.Caption>
          </Carousel.Item>
          <Carousel.Item>
          <img src={i4} alt="First slide" className='img'/>

            <Carousel.Caption>
              <h2>Sem Sofrimento</h2>
              <p>Junte-se a nós e faça o seus controle financeiro de forma facil e pratica</p>
              <input type="button" classeName= "bt_comecar" value="Comece agora!"/>
            </Carousel.Caption>
          </Carousel.Item>
          <Carousel.Item>
          <img src={i5} alt="First slide" className='img'/>
            <Carousel.Caption>
              <h2>Gestão Conciente</h2>
              <p>Faça seus planejamentos futuros de uma forma inovadora</p>
              <input type="button" classeName= "bt_comecar" value="Comece agora!"/>
            </Carousel.Caption>
          </Carousel.Item>
          
        </Carousel>
      </section>
    )
}

export default HomePage
/*

*/