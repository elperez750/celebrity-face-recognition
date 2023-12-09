import React, { Component } from "react";
import "./App.css";
import Navigation from "./components/navigation/navigation";
import Logo from "./components/logo/logo";
import ImageLinkForm from "./components/imageLinkForm/imageLinkForm";
import Rank from "./components/rank/rank";
import Particles from "react-particles";
import { loadSlim } from "tsparticles-slim";
import FaceRecognition from "./components/faceRecognition/faceRecognition";
import SignIn from "./components/SignIn/SignIn";
import Register from "./components/register/Register";

class App extends Component {
  constructor() {
    super();
    this.state = {
      input: "",
      imageUrl: "",
      nameOne: "",
      ratingOne: "",
      nameTwo: "",
      ratingTwo: "",
      nameThree: "",
      ratingThree: "",
      route: "signin",
      isSignedIn: false,
    };
    this.particlesInit = this.particlesInit.bind(this);
    this.particlesLoaded = this.particlesLoaded.bind(this);
  }

  onInputChange = (event) => {
    this.setState({ input: event.target.value });
  };

  onButtonSubmit = () => {
    console.log("clicked!");
    this.setState({ imageUrl: this.state.input });

    const PAT = "997c83386e7348c093811352783c7dd9";
    const USER_ID = "clarifai";
    const APP_ID = "main";
    const MODEL_ID = "celebrity-face-recognition";

    const raw = JSON.stringify({
      user_app_id: {
        user_id: USER_ID,
        app_id: APP_ID,
      },
      inputs: [
        {
          data: {
            image: {
              url: this.state.input,
            },
          },
        },
      ],
    });

    const requestOptions = {
      method: "POST",
      headers: {
        Accept: "application/json",
        Authorization: "Key " + PAT,
      },
      body: raw,
    };

    fetch(
      "https://api.clarifai.com/v2/models/" + MODEL_ID + "/outputs",
      requestOptions
    )
      .then((response) => response.text())
      .then((result) => {
        const parsedResult = JSON.parse(result);
        const concepts = parsedResult.outputs[0].data.concepts;

        this.setState({
          nameOne: concepts[0].name,
          ratingOne: concepts[0].value,
        });
        this.setState({
          nameTwo: concepts[1].name,
          ratingTwo: concepts[1].value,
        });
        this.setState({
          nameThree: concepts[2].name,
          ratingThree: concepts[2].value,
        });

        const highestConfidenceName = concepts[0].name;
        const highestConfidenceValue = concepts[0].value;

        console.log(highestConfidenceName, highestConfidenceValue);
      });
  };

  async particlesInit(engine) {
    console.log(engine);
    await loadSlim(engine);
  }

  async particlesLoaded(container) {
    console.log(container);
  }

  onRouteChange = (route) => {
    if (route === "signout") {
      this.setState({ isSignedIn: false });
    } else if (route === "home") {
      this.setState({ isSignedIn: true });
    }

    this.setState({ route: route });
  };

  render() {
    const {
      isSignedIn,
      imageUrl,
      route,
      nameOne,
      ratingOne,
      nameTwo,
      ratingTwo,
      nameThree,
      ratingThree,
    } = this.state;

    return (
      <div className="App">
        <Particles
          className="particles"
          id="tsparticles"
          init={this.particlesInit}
          loaded={this.particlesLoaded}
          options={{
            particles: {
              number: {
                value: 200,
                density: {
                  enable: true,
                  value_area: 800,
                },
              },
              line_linked: {
                enable: true,
                distance: 150,
                color: "#ffffff",
                opacity: 0.4,
                width: 1,
              },
              move: {
                enable: true,
                speed: 6,
                direction: "none",
                random: false,
                straight: false,
                out_mode: "out",
                bounce: false,
                attract: {
                  enable: false,
                  rotateX: 600,
                  rotateY: 1200,
                },
              },
              // ... other particle options
            },
            // ... other options like interactivity, modes, etc.
          }}
        />
        <Navigation
          isSignedIn={isSignedIn}
          onRouteChange={this.onRouteChange}
        />

        {route === "home" ? (
          <>
            <Logo />
            <Rank />
            <ImageLinkForm
              onInputChange={this.onInputChange}
              onButtonSubmit={this.onButtonSubmit}
            />
            {imageUrl ? (
              <FaceRecognition
                text={"The top three matches are..."}
                imageUrl={imageUrl}
                nameOne={nameOne}
                ratingOne={ratingOne}
                nameTwo={nameTwo}
                ratingTwo={ratingTwo}
                nameThree={nameThree}
                ratingThree={ratingThree}
              />
            ) : null}
          </>
        ) : route === "signin" ? (
          <SignIn onRouteChange={this.onRouteChange} />
        ) : (
          <Register onRouteChange={this.onRouteChange} />
        )}
      </div>
    );
  }
}

export default App;
