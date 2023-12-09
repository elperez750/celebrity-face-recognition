import React from "react";

const FaceRecognition = ({
  imageUrl,
  nameOne,
  ratingOne,
  nameTwo,
  ratingTwo,
  nameThree,
  ratingThree,
  text
}) => {
  return (
    <div className="center ma">
      <div className="absolute mt2">
        <img src={imageUrl} width="500px" height="auto" />
        <div>
            
          <h1>{text}</h1>
            
          <h2>
            {nameOne} {ratingOne}
          </h2>
          <h2>
            {nameTwo} {ratingTwo}
          </h2>
          <h2>
            {nameThree} {ratingThree}
          </h2>
        </div>

        <h1></h1>
      </div>
    </div>
  );
};

export default FaceRecognition;
