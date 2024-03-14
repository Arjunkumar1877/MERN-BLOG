import { Footer } from 'flowbite-react'
import React from 'react'
import { Link } from 'react-router-dom'
import {BsFacebook, BsInstagram, BsGithub, BsTwitter, BsDribbble } from 'react-icons/bs'

function FooterComponent() {
    return (
        <Footer className='border border-t-8 border-teal-500 p-4'>

            <div className="w-full max-w-7xl mx-auto">
                <div className="grid w-full justify-between sm:flex md: grid-cols-1">
                    <div className="mt-5">
                        <Link to="/" className='self-center whitespace-nowrap text-lg sm:text-xl font-semibold  dark:text-white'>
                            <span className='px-2 py-1 rounded-lg  bg-gradient-to-r from-indigo-500  via-purple-500 to-pink-500 text-white'>Arjun's</span>
                            Blog
                        </Link>
                    </div>
                    <div className="grid grid-cols-2 gap-8 mt-4 sm:grid-cols-3 sm:gap-6">
                        <div className="">
                            <Footer.Title title="About" />
                            <Footer.LinkGroup col>
                                <Footer.Link href='' target='_blank' rel='noopener noreferrer'>
                                    80 JS projects
                                </Footer.Link>

                                <Footer.Link href='/about' target='/about' rel='noopener noreferrer'>
                                    About
                                </Footer.Link>

                                <Footer.Link href='/' target='_blank' rel='noopener noreferrer'>
                                   Arjun's Blog
                                </Footer.Link>
                            </Footer.LinkGroup>
                        </div>

                        <div className="">
                            <Footer.Title title="About" />
                            <Footer.LinkGroup col>
                                <Footer.Link href='' target='_blank' rel='noopener noreferrer'>
                                   Github
                                </Footer.Link>

                                <Footer.Link href='#' target='/about' rel='noopener noreferrer'>
                                    Discord
                                </Footer.Link>

                                <Footer.Link href='/' target='_blank' rel='noopener noreferrer'>
                                   Arjun's Blog
                                </Footer.Link>
                            </Footer.LinkGroup>
                        </div>

                        <div className="">
                            <Footer.Title title="Follow us" />
                            <Footer.LinkGroup col>
                                <Footer.Link href='#' target='_blank' rel='noopener noreferrer'>
                                   Privacy Policy
                                </Footer.Link>

                                <Footer.Link href='/about' target='/about' rel='noopener noreferrer'>
                                    Terms and condition
                                </Footer.Link>

                                <Footer.Link href='/' target='_blank' rel='noopener noreferrer'>
                                   Arjun's Blog
                                </Footer.Link>
                            </Footer.LinkGroup>
                        </div>

                    </div>
                </div>

                <Footer.Divider/>
                <div className="w-full sm:flex sm:items-center sm:justify-between">
                    <Footer.Copyright href='#' by="Arjun's blog" year={new Date().getFullYear()}  />
                    <div className="flex gap-6 sm:mt-0 mt-4 sm:justify-center">
                        <Footer.Icon href='#' icon={BsFacebook}/>
                        <Footer.Icon href='#' icon={BsInstagram}/>
                        <Footer.Icon href='#' icon={BsTwitter}/>
                        <Footer.Icon href='#' icon={BsGithub}/>
                        <Footer.Icon href='#' icon={BsDribbble}/>
                    </div>
                </div>
            </div>

        </Footer>
    )
}

export default FooterComponent