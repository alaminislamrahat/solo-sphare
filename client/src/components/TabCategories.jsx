/* eslint-disable react/prop-types */
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';
import JobCard from './JobCard';
import { useEffect, useState } from 'react';
import axios from 'axios'


const TabCategories = () => {

    const [jobs, setJobs] = useState([]);

    useEffect(()=>{
        const getData = async()=>{
            const {data} = await axios(`${import.meta.env.VITE_API_URL}/jobs`)
            setJobs(data)
        }
        getData()
    },[])

    return (
        <Tabs>
            <div className="container px-6 py-10 mx-auto">
                <h1 className="text-5xl font-bold text-center mb-5">Browse jobs by categories</h1>
                <p className=' font-semibold text-center my-5'>Lorem ipsum dolor sit amet consectetur adipisicing elit. Incidunt, quis. Lorem ipsum dolor sit amet consectetur adipisicing elit. Ea expedita suscipit eum odio voluptatibus fugit dolor amet maiores vero cupiditate!</p>
                <div className="flex items-center justify-center">
                    <TabList>
                        <Tab>Web Development</Tab>
                        <Tab>Graphics Design</Tab>
                        <Tab>Digital Marketing</Tab>
                    </TabList>
                </div>

                <TabPanel>
                    <div className='grid grid-cols-1 gap-8 mt-8 xl:mt-16 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'>
                        {
                            jobs.filter(j => j.category === 'Web Development').map(job => <JobCard key={job._id} job={job} />)
                        }
                    </div>
                </TabPanel>


                <TabPanel>
                   <div className='grid grid-cols-1 gap-8 mt-8 xl:mt-16 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'>
                        {
                            jobs.filter(j => j.category === 'Graphics Design').map(job => <JobCard key={job._id} job={job} />)
                        }
                    </div>
                </TabPanel>


                <TabPanel>
                <div className='grid grid-cols-1 gap-8 mt-8 xl:mt-16 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'>
                        {
                            jobs.filter(j => j.category === 'Digital Marketing').map(job => <JobCard key={job._id} job={job} />)
                        }
                    </div>
                </TabPanel>
            </div>
        </Tabs>
    );
};

export default TabCategories;




// export default TabCategories() => (

// );