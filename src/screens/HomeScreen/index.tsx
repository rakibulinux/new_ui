import * as React  from "react";
import { Link } from "react-router-dom";
import {MarketsTableScreen} from '../../containers/MarketsTableScreen';

import {Row, Col } from 'react-bootstrap';
import Slider from "react-slick";

import { eventFetch, selectEvents } from "../../modules";
import { useDispatch, useSelector } from "react-redux";
import {
  AppleFilled,
  AndroidFilled
} from '@ant-design/icons';

import './style.css';

const settingEvents = {
  dots: true,
  infinite: true,
  speed: 500,
  autoplay : true,
  autoplaySpeed : 2500,
  slidesToShow: 3,
  slidesToScroll: 3,
  adaptiveHeight: true,
  initialSlide: 0,
      responsive: [
        {
          breakpoint: 1000,
          settings: {
            slidesToShow: 2,
            slidesToScroll: 2,
            infinite: true,
            dots: true
          }
        },
        {
          breakpoint: 600,
          settings: {
            slidesToShow: 2,
            slidesToScroll: 2,
            initialSlide: 2
          }
        },
        {
          breakpoint: 480,
          settings: {
            slidesToShow: 1,
            slidesToScroll: 1
          }
        }
      ]
};

export const HomeScreen: React.FC<any> = (props: any) => {

  const dispatch = useDispatch();
  const dispatchFetchEvents = () => dispatch(eventFetch());

  React.useEffect(() => {
    dispatchFetchEvents();

  }, []);

  const events = useSelector(selectEvents);

  const renderBanner = ()  => {
    return (
      <div className="landing-page__banner">
        <div className="container">
          <div className="landing-page__banner-wrapper">
            <Row className="landing-page__banner__top">
              <Col lg={12} className="landing-page__banner__top-title">
                <div className="landing-page__banner__top__new">
                  <h2>CircleEx Crypto Exchange</h2>
                  <p className="banner-tit-small">Trade Bitcoin, Ethereum and other cryptos instantly</p>
                  <div className="pc-otc-box">
                    <div className="pc-otc-buy-box">
                      <div className="pc-otc-input-box">
                        <input className="pc-otc-input" type="text" placeholder="Email Address/Mobile Number"/>
                      </div>
                      <Link className="pc-otc-buy-btn" to="/signup">Register now</Link>
                    </div>
                  </div>
                </div>
              </Col>
            </Row>
            <div >
               <Slider {...settingEvents}>
                { 
                [...events.payload].map(event => {
                  return (
                      <a key={event.event_id} href={event.ref_link} target="_blank">
                        <img src={event.image_link} style={{width: '100%', height: '100%'}}></img>
                      </a>
                  )
                })}
               </Slider>
            </div>
          </div>
        </div>  
      </div>
    );
  }

    const renderMarket = () => {
      return (
        <div className="home-page__markets">
          <div className="container">
            <div className="row">
              <div className="col-12">
              <MarketsTableScreen />
              </div>
            </div>
          </div>
        </div>
      ) 
    }
    
    const renderAboutUs = () => {
      const IMG1 = require("./Home/Roadmap/img1.png");
      const IMG2 = require("./Home/Roadmap/img2.png");
      const IMG3 = require("./Home/Roadmap/img3.png");

      return(
        <div className="home-page__about-us">
          <div className="container">
            <h2 className="about-us-title">Secure, Efficient, Innovative</h2>
            <p className="sub-title">We provide secure and trusted digital asset trading services for users from over 100 countries and regions around the globe.</p>
            <ul className="feature">
              <li>
                <img src={IMG1}></img>
                <h3>Various Digital Asset Services</h3>
                <p>Support instant crypto purchase, spot trading, derivatives trading and a complex of investment choices. Give you the key to access the digital world.</p>
              </li>
              <li>
                <img src={IMG2}></img>
                <h3>Multi-layer Protection</h3>
                <p>Multi-cluster network security structure. Multi-layer risk control and real time alerting system. Protect your asset security all day long.</p>
              </li>
              <li>
                <img src={IMG3}></img>
                <h3>User-oriented Design</h3>
                <p>User friendly product design. Multi-platform supported. Speedy memory matching system. All for the most stable and efficient user experience.</p>
              </li>
            </ul>
          </div>
        </div>
      );
    }
    // 
    const renderFeature = () => {
      const Image = require("./Home/feature.png");
     return (
        <div className="homepage__feature" style={{paddingBottom: '72px'}}>
          <div className="container">
            <div className="pc-index-downlod-title">
              <h3 className="pc-index-download-tit">Trade anytime, anywhere.</h3>
              <div className="pc-index-download-con">
                <p>Download the CircleEx App, start your trading journey today.</p>
              </div>
            </div>
            <div className="pc-index-download">
              <div className="pc-index-download-pic" style={{backgroundImage: 'url(' + Image + ')', backgroundRepeat: 'no-repeat'}}></div>
              <div className="download-box">
                <div className="title title-active">iOS</div>
                <div className="download-ios">
                  <div className="download-btn-ios download-appstore-active">
                    <AppleFilled />
                    <div className="download-ios-title">
                      <p>Download on the</p>
                      <p>Apple Store</p>
                    </div>
                  </div>
                  <div className="download-btn-ios download-btn-right download-active">
                    <AppleFilled />
                    <div className="download-ios-title">
                      <p>Download for</p>
                      <p>iOS</p>
                    </div>
                  </div>
                </div>
                <div className="title">Android</div>
                  <div className="download-Android">
                    <div className="download-btn-android download-btn-googlePlay">
                      <AndroidFilled />
                      <div className="download-ios-title">
                        <p>GET IT ON</p>
                        <p>Google play</p>
                      </div>
                    </div>
                    <div className="download-btn-android download-btn-right download-active">
                      <AndroidFilled />
                      <div className="download-ios-title">
                        <p>Download for</p>
                        <p>Android</p>
                      </div>
                    </div>
                  </div>
              </div>
            </div>
          </div>
        </div>
     );
    }
    return (
        <div className="home-page">
           {renderBanner()}
           {renderMarket()}
           {renderAboutUs()}
           {renderFeature()}
        </div>
    );
}

