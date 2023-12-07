import React, { Component } from "react";
import './App.css'
import Navigation from "./components/navigation/navigation";
import Logo from "./components/logo/logo";
import ImageLinkForm from "./components/imageLinkForm/imageLinkForm";
import Rank from "./components/rank/rank";
import Particles from "react-particles";
import { loadSlim } from "tsparticles-slim"; // if you are going to use `loadSlim`, install the "tsparticles-slim" package too.
import FaceRecognition from "./components/faceRecognition/faceRecognition";


  




    
class App extends Component {
  constructor() {
    super();
    this.state = {
        input: "",
        imageUrl: "",

    }
    this.particlesInit = this.particlesInit.bind(this);
    this.particlesLoaded = this.particlesLoaded.bind(this);
  }



  onInputChange = (event) => {
   this.setState({input: event.target.value});
  }
 

  onButtonSubmit = () => {
    console.log("clicked!");
    this.setState({imageUrl: this.state.input});
    
    const PAT = '997c83386e7348c093811352783c7dd9';
    const USER_ID = 'clarifai';       
    const APP_ID = 'main';
    // Change these to whatever model and image URL you want to use
    const MODEL_ID = 'celebrity-face-recognition';
    
    
      const raw = JSON.stringify({
        "user_app_id": {
            "user_id": USER_ID, 
            "app_id": APP_ID 
        },
        "inputs": [
            {
                "data": {
                    "image": {
                        "url": this.state.input
                    }
                }
            }
        ]
    });
 
    const requestOptions = {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Authorization': 'Key ' + PAT
        },
        body: raw
    };
 
    fetch("https://api.clarifai.com/v2/models/" + MODEL_ID + "/outputs", requestOptions)
        .then(response => response.text())
        .then(result => { const parsedResult = JSON.parse(result);
            const concepts = parsedResult.outputs[0].data.concepts;
          
            
              const highestConfidenceName = concepts[0].name;
              const highestConfidenceValue = concepts[0].value;
              
              console.log(highestConfidenceName, highestConfidenceValue);
               
        }
        )
  }
  
  

  async particlesInit(engine) {
    console.log(engine);
    // you can initiate the tsParticles instance (engine) here, adding custom shapes or presets
    await loadSlim(engine);
  }

  async particlesLoaded(container) {
    console.log(container);
  }

  render() {
    return (
      <div className="App">
        <Particles className="particles"
            id="tsparticles"
            init={this.particlesInit}
            loaded={this.particlesLoaded}
            options={{
                fpsLimit: 120,
                interactivity: {
                    events: {
                        onClick: {
                            enable: true,
                            mode: "push",
                        },
                        onHover: {
                            enable: true,
                            mode: "repulse",
                        },
                        resize: true,
                    },
                    modes: {
                        push: {
                            quantity: 4,
                        },
                        repulse: {
                            distance: 200,
                            duration: 0.4,
                        },
                    },
                },
                particles: {
                    color: {
                        value: "#ffffff",
                    },
                    links: {
                        color: "#ffffff",
                        distance: 150,
                        enable: true,
                        opacity: 0.5,
                        width: 1,
                    },
                    move: {
                        direction: "none",
                        enable: true,
                        outModes: {
                            default: "bounce",
                        },
                        random: false,
                        speed: 6,
                        straight: false,
                    },
                    number: {
                        density: {
                            enable: true,
                            area: 800,
                        },
                        value: 100,
                    },
                    opacity: {
                        value: 0.5,
                    },
                    shape: {
                        type: "circle",
                    },
                    size: {
                        value: { min: 1, max: 5 },
                    },
                },
                detectRetina: true,
            }}
        />
        <Navigation />
        <Logo />
        <Rank />
        <ImageLinkForm onInputChange={this.onInputChange} onButtonSubmit={this.onButtonSubmit} />
        <FaceRecognition imageUrl={this.state.imageUrl}/>
        
      </div>
    )

  }
  
  
  
}

export default App
