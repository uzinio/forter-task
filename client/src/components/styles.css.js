import {css} from 'lit';

export default css`
  
  body {
    min-height: 75rem;
    padding-top: 4.5rem;
  }
  
  .question {
    border: solid 4px gray;
    text-align: center;
    border-radius: 20px;
    margin-top: 10px;
    min-height: 200px;
  }

  .question-suggested {
    border: solid 4px green;
    text-align: center;
    border-radius: 20px;
    margin-top: 10px;
    min-height: 200px;
  }
  
  
  .answers-container {
    max-height: 300px;
    overflow-y: auto;
  }
  
  date {
    font-size: 12px;
    padding: 4px;
  }
  
  .my-nav {
    min-height: 20%;
    min-width: 100%;
    //position: fixed;
    border: solid 4px gray;
  }
  
`;
