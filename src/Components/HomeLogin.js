/* eslint-disable jsx-a11y/anchor-is-valid */
import React from 'react'
import { Link } from 'react-router-dom';
import image1 from "../Assets/plywood.jpg"

function HomeLogin() {
    return (
        <div class="relative">
            <img src={image1} alt="Background" class="absolute inset-0 w-full h-full object-cover brightness-50" />
            <div class="absolute inset-0 bg-gradient-to-b from-black to-transparent"></div>

            <div className="flex items-center justify-center relative h-screen z-20">
                <div className="container">
                    <div className="rounded-lg p-5 md:p-20 mx-2">
                        <div className="text-center">
                            <h2
                                className="text-4xl tracking-tight leading-10 font-extrabold text-gray-200 sm:text-5xl sm:leading-none md:text-6xl">
                                Employee<span className="text-indigo-600">-Management</span> System
                            </h2>
                            <h3 className='text-xl md:text-3xl mt-10 text-gray-300'>Simplifies the management of your workforce</h3>
                            <p className="text-md md:text-xl mt-10 max-w-2xl mx-auto text-gray-400"><a className="hover:underline" href="#">Easily</a>  create and manage employee schedules to ensure optimal coverage for every shift, enhancing productivity and minimizing downtime.</p>
                        </div>
                        <div className="flex flex-wrap mt-10 justify-center">
                            <div className="m-3">
                                <Link to={`/login`}
                                    className="md:w-32 bg-white tracking-[2px] text-blue-500 font-extrabold rounded border-2 border-blue-600 hover:border-blue-600 hover:bg-blue-600 hover:transition hover:scale-95 hover:text-white shadow-md py-2 px-6 inline-flex items-center">
                                    <span className="mx-auto">Login</span>
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default HomeLogin