import React from 'react'
import OwlCarousel from 'react-owl-carousel';
import 'owl.carousel/dist/assets/owl.carousel.css';  
import 'owl.carousel/dist/assets/owl.theme.default.css'; 
import banner1 from '../images/banner-1.png'
import banner2 from '../images/banner-2.jpg'
import banner3 from '../images/banner-3.jpg'

const items = [
    {
        src: banner1,
        altText: 'Feeds Hub',
        caption: 'always bloggings!'
    },
    {
        src: banner2,
        altText: 'Express',
        caption: 'Write your own blog'
    },
    {
        src: banner3,
        altText: 'Explore',
        caption: 'Search from wide range of blogs'
    }
];

const HomeCarousel = () => {
    return (
        <OwlCarousel 
        items={1}  
        className="owl-theme home-carousel"  
        loop  
        margin={8}
        navSpeed={1000}
        autoplaySpeed={1000}
        autoplayTimeout={3000}
        animateOut="fadeOut"
        autoplay={false} >  
            {items.map((item, index) => {
                return (
                <div key={index}>
                    <img className="w-100" src={item.src} alt={item.altText} />  
                    <div className="carousel-text">  
                        <div>
                            <h1>{item.altText}</h1>
                            <p>{item.caption}</p>
                        </div>
                    </div>
                </div> 
                )
            })}
        </OwlCarousel>  
    )
}

export default HomeCarousel