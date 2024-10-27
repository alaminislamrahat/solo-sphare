import { Swiper, SwiperSlide } from 'swiper/react';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';

import bg1 from '../assets/images/carousel1.jpg'
import bg2 from '../assets/images/carousel2.jpg'
import bg3 from '../assets/images/carousel3.jpg'

const bgs = [{ image : bg1, text : 'apply to the job'}
  ,{ image : bg2 , text : 'enjoy the job'}
  , {image : bg3, text : 'be Pationate about your job'}
]



// import required modules
import { Autoplay, Pagination, Navigation } from 'swiper/modules';
import Slide from './Slide';


const Caurosel = () => {
  return (
    <div className='container mx-auto px-6 py-10'>
      <Swiper
        spaceBetween={30}
        centeredSlides={true}
        loop={true}
        autoplay={{
          delay: 2500,
          disableOnInteraction: false,
        }}
        pagination={{
          clickable: true,
        }}
        navigation={true}
        modules={[Autoplay, Pagination, Navigation]}
        className="mySwiper"
      >
        {/* <SwiperSlide>
                <Slide image={bg1} text='get your job and enjoy'/>
            </SwiperSlide>
            <SwiperSlide>
                <Slide image={bg2} text='get your job and enjoy'/>
            </SwiperSlide>
            <SwiperSlide>
                <Slide image={bg3} text='get your job and enjoy'/>
            </SwiperSlide> */}

        {
          bgs.map((bg, index )=> <SwiperSlide key={index}><Slide bg={bg} key={index}></Slide></SwiperSlide>)
        }


      </Swiper>
    </div>
  );
}

export default Caurosel;