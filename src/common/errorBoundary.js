import styled from "react-emotion";

export const PageContainer = styled('div')`
  background-color: #e3f6fd;
  /*bbackground-image: url(background-scene.png);
  	background-repeat: no-repeat;
  	background-position: center bottom;*/
  /*background-size: 1600px auto;*/
  font-size: 18px;
  font-family: Open Sans, sans-serif;
  line-height: 36px;
  text-align: center;
  height: 100%;
  position: absolute;
  left: 0px;
  right: 0px;
  .content-container {
    background-color: #fff;
    max-width: 780px;
    margin: 0 auto;
    padding: 40px;
    margin-top: 100px;
    border-radius: 10px;
    border: 1px solid #e0e1e6;
    box-shadow: 0px 0px 9.5px 0.5px rgba(160, 160, 163, 0.25);
    z-index: 100;
    position: relative;
  }
  .content-container p {
    padding: 10px 50px;
  }
  h1,
  h2 {
    font-family: Montserrat, sans-serif;
    font-weight: 500;
    color: #2b388f;
    font-size: 28px;
  }
  .background-img {
    /*display: block;
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;*/
    z-index: 0;
    position: fixed;
    bottom: 0;
    left: 0;
    min-width: 100%;
    min-height: 100%;
  }
  @media screen and (max-width: 1024px) {
    .background-img {
      left: 50%;
      margin-left: -512px; /* 50% */
    }
  }

  img {
    max-width: 100%;
    height: auto;
  }

  h2 {
    font-size: 24px;
  }

  a,
  a:visited,
  a:active {
    color: #90278e;
    text-decoration: underline;
  }
  a:hover {
    color: #e83a9c;
  }
  .teal-copy {
    color: #009bb8;
    font-style: italic;
  }

  ul {
    margin: 0;
    padding: 0;
    list-style: none;
  }
`;