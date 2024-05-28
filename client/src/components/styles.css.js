import {css} from 'lit';

export default css`
  :host {
    //display: flex;
    //flex-wrap: wrap;
    //flex-direction: row;
    //align-items: center;
    //min-width: 500px;
    //padding-top: 20px;
  }

  p {
    color: blue;
  }

  .flex-container {
    display: flex;
    flex-wrap: wrap;
    border-radius: 24px;
    border: solid 1px gray;
    align-content: center;
    margin: 0 18px;
    justify-content: center;
    position: relative;
  }

  .col-1 {
    flex-basis: 10%;
    align-content: center;
    text-align: center;
  }

  .col-2 {
    flex-basis: 20%;
    align-content: center;
    text-align: center;
  }

  .col-3 {
    flex-basis: 30%;
    align-content: center;
    text-align: center;
  }

  .col-4 {
    flex-basis: 40%;
    align-content: center;
    text-align: center;
  }

  .col-5 {
    flex-basis: 50%;
    align-content: center;
    text-align: center;
  }

  .col-6 {
    flex-basis: 60%;
    align-content: center;
    text-align: center;
  }
  
  .col-6 {
    flex-basis: 60%;
    align-content: center;
    text-align: center;
  }

  .col-6 {
    flex-basis: 60%;
    align-content: center;
    text-align: center;
  }
  
  .col-7 {
    flex-basis: 70%;
    align-content: center;
    text-align: center;
  }
  
  .col-8 {
    flex-basis: 80%;
    align-content: center;
    text-align: center;
  }
  
  .col-9 {
    flex-basis: 90%;
    align-content: center;
    text-align: center;
  }

  .col-10 {
    flex-basis: 100%;
    align-content: center;
    text-align: center;
  }
  
  .container {
    border-radius: 24px;
    border: solid 1px gray;
    display: flex;
    flex: 1;
    flex-wrap: wrap;
    align-content: center;
    margin: 0 18px;
    justify-content: center;
    position: relative;
  }`;
