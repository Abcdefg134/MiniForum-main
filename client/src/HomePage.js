import React from 'react'
import './homepage.css'
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Slider from "react-slick";
import logo from './img/Logo.png'
import Slider1 from './img/Slider1.png'
import Slider2 from './img/Slider2.png'
import Slider3 from './img/Slider3.png'
import { useHistory } from 'react-router';
export default function HomePage() {
    let history = useHistory()
    const settings = {
        dots: true,
        infinite: true,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1
    };
    const goToMainBtn = ()=>{
        history.push('/')
    }
    return (
        <div>
            <div class="container">
                <header>
                    <a href="#"><img src={logo} class="logo" alt="Logo" /></a>

                    <div class="menu">
                        <input type="checkbox" id="check" />
                        <label for="check" class="check-btn">
                            <i class="fa fa-bars"></i>
                        </label>
                        <ul>
                            <li><a href="./index.html">Home</a></li>
                            <li><a href="./about-us/index.html">About us</a></li>
                            <li><a onClick={goToMainBtn}>Forum</a></li>
                            <li><a href="./about-us/index.html">Feedback</a></li>
                        </ul>
                    </div>

                </header>

                <main>
                    <div class="slider">
                        
                            <div class="slider-inner">
                            <Slider {...settings}>
                                <div class="item" data-text="Welcome">
                                    <img src={Slider1} alt="Picture 1" />
                                    <div class="text">
                                        <h1>Welcome to Tech It Eazy</h1>
                                        <p>A forum for every Tech-lover in the world</p>
                                    </div>
                                </div>
                                <div class="item" data-text="Technology Questions">
                                    <img src={Slider2} alt="Picture 2" />
                                    <div class="text">
                                        <h1>Tech It Eazy | Q&A</h1>
                                        <p>Where every question about technology can be answered</p>
                                    </div>
                                </div>
                                <div class="item" data-text="Mordern Forum">
                                    <img src={Slider3} alt="Picture 3" />
                                    <div class="text">
                                        <h1>Tech It Eazy | Forum</h1>
                                        <p>A mordern platform that can ease anyone from the first look</p>
                                    </div>
                                </div>
                                </Slider>
                            </div>
                        
                        <div class="btn">
                            <button onClick={goToMainBtn}>Explore</button>
                        </div>

                    </div>
                    <div class="wave-line">
                        <div class="line line1"></div>
                        <div class="line line2"></div>
                        <div class="line line3"></div>
                    </div>
                </main>



            </div>

        </div>
    )
}
