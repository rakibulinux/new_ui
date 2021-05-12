
import * as React from 'react';
import { useState } from 'react';

import { useHistory ,Link } from "react-router-dom";

 import styled from "styled-components";
import { FaPhoneAlt, FaTelegram, FaTwitter ,FaFacebook ,  FaEnvelope, FaGlobe } from "react-icons/fa";
 
 const Logo = require('../../assets/images/logo.svg'); 


 


const FooterStyle = styled.div`
  background: #313445;
  color: white;
  font-size:15px;
  margin-bottom:-20px;

  .container-footer {
    margin: 0 20px;
    color: aliceblue;
  }

  

  .footer {
    padding-top: 70px;
    padding-bottom: 45px;

    &__logo {

      &__img {
         &:hover{

           img{
             transform: translateY(10px);
            transition : all 0.5s;
           }
        }
      }

      
      &__desc {
        padding-top: 20px;
        max-width: 250px;
        color:  rgba(255 , 255 , 255 ,0.7);
      }
    }

    &__info {
      &__title {
        font-size: 18px;
        letter-spacing: 0.5px;
        font-weight: 500;
      }

      &__item {
        
        &__icon{
           margin-right: 10px;
        }

        a , Link{
          color:  rgba(255 , 255 , 255 ,0.7);

          &:hover{
          color:white;
          transition:all 0.4s;
          }
        }

         


        padding-bottom:2px;

        

        color:  rgba(255 , 255 , 255 ,0.7);

        &:hover{
          color:white;
          transition:all 0.4s;
        }
      }
    }

    &__news {
      &__title {
        font-size: 18px;
        letter-spacing: 0.5px;
        font-weight: 500;
      }

      &__take-email {
        &__label {
          color:  rgba(255 , 255 , 255 ,0.7);
        }
        &__input {
          &::placeholder {
            color: white;
            opacity: 0.7;
          }
          padding-left: 10px;
          color: white;
          background-color: rgb(72, 74, 90);
          height: 40px;
          width: 200px;
          outline: none;
          border: 0.5px solid white;
          border-radius: 10px;
        }
        &__btn {
          cursor: pointer;
          margin-left: 15px;
          padding: 9.5px;
          background: rgb(47, 182, 126);
          border-radius: 7px;

          &:hover{
            background: rgb(27, 226, 143);
            transition: all 0.3 ease-out;
          }
        }
      }

      &__list-icon {
        display: flex;
        flex-direction: row;
        justify-content: start;
        align-items: center;

        a {
          outline: none;
          text-decoration: none;
        }

        &__item {

          a {
          outline: none;
          text-decoration: none;
          color : white;
          }
          padding-right: 20px;
          font-size: 40px;
          
          &:hover{
            transform:translateY(10px);
            transition:all  0.4s ease-out;
          }
          
        }
      }
    }

    &__copyright {
      text-align: center;
      padding-top: 30px;
      padding-bottom: 30px;
       
      font-size:18px;

      a{
        text-decoration:underline;
        outline:none;
        color : white;
        font-size:18px;
      }
    }
  }

  

  .white-line {
    border-bottom:0.1px solid white;
  }


  // responsive
  @media screen and (min-width: 1200px){
    
    .container-footer {
      margin: 0 10%;
      color: aliceblue;
    }
    
  } 
  @media screen and (max-width: 900px){
    
    font-size:14px;
    .footer__info__title{
      font-size:17px;
    }
    .footer__news__title{
      font-size:17px;
    }
    .footer__news__take-email__input{
      width:120px;
      padding-left: 5px;
    }

    .footer__news__list-icon__item{
      font-size:30px;
    }
    
  } 

  @media screen and (max-width: 800px){
    
    font-size:12px;
    .footer__info__title{
      font-size:15px;
    }
    .footer__news__title{
      font-size:15px;
    }
    .footer__news__take-email__input{
      width:100px;
       
    }
    
  } 
`;

 


export const Footer :React.FC = (Props) => {

  let history = useHistory();

  const [emailAddress, setemailAddress] = useState("");

  const inputEmail = (e: any) => {
    setemailAddress(e.target.value);
  };

  const sendEmail = () => {
    const valueEmail = emailAddress;
    // do something
    console.log("đã gửi", valueEmail);
    setemailAddress("");
  };

  if( history.location.pathname.startsWith('/confirm')) {
      
          return <React.Fragment />;
        }
    
      return (
        <React.Fragment >
            { renderFooterDesktop(inputEmail,sendEmail ,emailAddress)}
          </React.Fragment >
        );
}

const renderFooterDesktop = (inputEmail, sendEmail ,emailAddress ) => {

  const valueInput: string = emailAddress;
  return (
    <FooterStyle>
      <div className="container-footer">
        <div className="footer d-flex flex-row justify-content-between ">
          <div className="footer__logo">

           
            <a className="footer__logo__img" href="/">
              <img src={Logo} alt=""  />
            </a>

            <p className="footer__logo__desc">
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Magni, quibusdam nesciunt voluptatem fugit saepe soluta obcaecati et assumenda 
            </p>
          </div>

          <div className="footer__info">
            <p className="footer__info__title">CONTACT</p>
            <p className="footer__info__item">
              <FaPhoneAlt className="footer__info__item__icon"/> 0905333999
            </p>
            <p className="footer__info__item">
                <FaEnvelope className="footer__info__item__icon"/>  liting@cx.finance
            </p>
            <p className="footer__info__item footer__info__item--default">
              <FaGlobe className="footer__info__item__icon"/>  www.litingcx.finance
            </p>
          </div>

          <div className="footer__info">
            <p className="footer__info__title">SERVICE SUPPORT</p>
            <p className="footer__info__item">
            <Link   to="/fee">Asset Fee </Link>
            </p>
            <p className="footer__info__item">
            <a href="#"   target="blank">Listing Token</a>
            </p>
            <p className="footer__info__item">
            <a href="https://api.cx.finance"  target="blank">API Documentation</a>
            </p>
          </div>

          <div className="footer__news">
            <p className="footer__news__title">RECEIVE NEWS</p>

            <div className="footer__news__take-email">
              <div className="footer__news__take-email__label">Your email</div>
              <input
                className="footer__news__take-email__input"
                placeholder="enter your email"
                type="email"
                value={valueInput}
                onChange={(e) => inputEmail(e)}
              />
              <a
                className="footer__news__take-email__btn"
                onClick={() => sendEmail()}
              >
                Send
              </a>
            </div>

            <div className="footer__news__list-icon ">
              <div className="footer__news__list-icon__item  ">
                <a href="https://twitter.com/exchange_circle">
                  <FaTwitter/>
                </a>
              </div>

              <div className="footer__news__list-icon__item  ">
                <a href="https://circleex.medium.com/">
                  <FaFacebook/>
                </a>
              </div>
              <div className="footer__news__list-icon__item  ">
                <a href="https://t.me/circleex">
                  <FaTelegram/>
                </a>
              </div>
            </div>
          </div>
          
        </div>

       
      </div>

        <div>
            
           <div className="white-line">

           </div>

         <p className="footer__copyright">© 2020 Copyright : <a href="https://cx.finance/"> cx.finance </a></p>
        </div>
      

    </FooterStyle>
  );
}




 