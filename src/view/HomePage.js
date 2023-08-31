import '../CSS/HomePage.css'
import i1 from '../Img/img1.jpg'
import i3 from '../Img/img3.jpg'
import i4 from '../Img/img4.jpg'
import i5 from '../Img/img5.jpg'
import imgRelatorios from '../Img/WhatsApp_Image_2023-08-20_at_16.42.37-removebg-preview.png'
import imgCofrinho from '../Img/WhatsApp_Image_2023-08-20_at_16.51.58__2_-removebg-preview-removebg-preview.png'
import imgRenda from '../Img/WhatsApp_Image_2023-08-20_at_17.08.13-removebg-preview.png'
import imgGastos from '../Img/WhatsApp_Image_2023-08-20_at_21.18.55-removebg-preview.png'
//import {Link} from 'react-router-dom';
import {Carousel,Card,Button} from 'react-bootstrap'


function HomePage(){
  return( 
    <section className='background'>
<Carousel>
  <Carousel.Item>
    <img src={i1} alt="First slide" className='img'/>
    <Carousel.Caption>
      <div className='carousel-text'>
        <h2>Controle Total</h2>
        <p>Com o PoupAqui você consegue controlar seus gastos de maneira muita mais eficeiente e organizada</p>
      </div>
    </Carousel.Caption>
  </Carousel.Item>
  <Carousel.Item>
  <img src={i3} alt="First slide" className='img'/>
    <Carousel.Caption>
      <div className='carousel-text'>
        <h2>Maior Praticidade</h2>
        <p>Controle suas contas de um jeito muito mais no confortavel</p>
      </div>
    </Carousel.Caption>
  </Carousel.Item>
  <Carousel.Item>
  <img src={i4} alt="First slide" className='img'/>
    <Carousel.Caption>
      <div className='carousel-text'>
        <h2>Sem Sofrimento</h2>
        <p>Junte-se a nós e faça o seus controle financeiro de forma facil e pratica</p>
      </div>
    </Carousel.Caption>
  </Carousel.Item>
  <Carousel.Item>
  <img src={i5} alt="First slide" className='img'/>
    <Carousel.Caption>
      <div className='carousel-text'>
        <h2>Gestão Conciente</h2>
        <p>Faça seus planejamentos futuros de uma forma inovadora</p>
      </div>
    </Carousel.Caption>
  </Carousel.Item>
</Carousel>
<div className="container mt-5">
  <div className="row justify-content-center">
      <div className="col-md-3">
        <Card className="mb-4" bg="success">
          <Card.Img className="imge" variant="top" src={imgGastos} />
          <Card.Body>
            <Card.Title>Gastos</Card.Title>
            <Card.Text>
              Gerencie seus gastos de forma simples e fácil.
            </Card.Text>
            <Button variant="primary">Go somewhere</Button>
          </Card.Body>
        </Card>
      </div>
      <div className="col-md-3">
        <Card className="mb-4" bg="success">
          <Card.Img className='imge img1'  src={imgRenda} />
          <Card.Body>
            <Card.Title>Renda</Card.Title>
            <Card.Text>
              Gerencie seus gastos de forma simples e fácila
            </Card.Text>
            <Button variant="primary">Go somewhere</Button>
          </Card.Body>
        </Card>
      </div>
      <div className="col-md-3">
        <Card className="mb-4" bg="success">
          <Card.Img className='imge img1' variant="top" src={imgCofrinho} />
          <Card.Body>
            <Card.Title>Gastos</Card.Title>
            <Card.Text>
              Gerencie seus gastos de forma simples e fácila
            </Card.Text>
            <Button variant="primary">Go somewhere</Button>
          </Card.Body>
        </Card>
      </div>
      <div className="col-md-3">
        <Card className="mb-4" bg="success">
          <Card.Img className='imge' variant="top" src={imgRelatorios} />
          <Card.Body>
            <Card.Title>Gastos</Card.Title>
            <Card.Text>
              Gerencie seus gastos de forma simples e fácila
            </Card.Text>
            <Button variant="primary">Go somewhere</Button>
          </Card.Body>
        </Card>
      </div>
    </div>
  </div> 
  <div className="container mt-5">
    <div className="row featurette">
      <hr class="featurette-divider"/>
      <div class="col-md-7">
        <h2 class="featurette-heading fw-normal lh-1">Gastos </h2>
        <p class="lead">Some great placeholder content for the first featurette here. Imagine some exciting prose here.</p>
      </div>
      <div class="col-md-5">
        <img className='imgGastos'src={imgGastos}/>
      </div>
    </div>
    <div class="row featurette">
      <hr class="featurette-divider"/>
      <div class="col-md-7 order-md-2">
        <h2 class="featurette-heading fw-normal lh-1">Renda</h2>
        <p class="lead renda">Another featurette? Of course. More placeholder content here to give you an idea of how this layout would work with some actual real-world content in place.</p>
      </div>
      <div class="col-md-5 order-md-1">
       <img className='imgRenda' src={imgRenda}/>
      </div>
    </div>
    <div class="row featurette">
      <hr class="featurette-divider"/>
      <div class="col-md-7">
        <h2 class="featurette-heading fw-normal lh-1">Cofrinho</h2>
        <p class="lead">And yes, this is the last block of representative placeholder content. Again, not really intended to be actually read, simply here to give you a better view of what this would look like with some actual content. Your content.</p>
      </div>
      <div class="col-md-5">
       <img className='imgCofre' src={imgCofrinho} />
      </div>
    </div>
    <div class="row featurette ">
      <hr class="featurette-divider"/>
      <div class="col-md-7 order-md-2">
        <h2 class="featurette-heading fw-normal lh-1">Relatórios</h2>
        <p class="lead">And yes, this is the last block of representative placeholder content. Again, not really intended to be actually read, simply here to give you a better view of what this would look like with some actual content. Your content.</p>
      </div>
      <div class="col-md-5 order-md-1">
       <img className='imgRelato'src={imgRelatorios} />
      </div>
    </div>
    <hr class="featurette-divider barra"/>
  </div>
    </section>
  )
}

export default HomePage
