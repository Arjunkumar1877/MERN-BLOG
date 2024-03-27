import { Avatar, Button, Dropdown, Navbar, TextInput } from 'flowbite-react'
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { AiOutlineSearch } from 'react-icons/ai'
import { FaMoon, FaSun } from 'react-icons/fa';
import { useDispatch, useSelector } from 'react-redux';
import { toggleTheme } from '../redux/theme/themeSlice';
import { signoutSuccess } from '../redux/user/userSlice';
import { useEffect, useState } from 'react';


function Header() {
    const dispatch = useDispatch();
    const path = useLocation().pathname;
    const location = useLocation()
    const navigate = useNavigate();
    const { currentUser } = useSelector(state => state.user);
    const { theme } = useSelector(state => state.theme);
    const [searchTerm, setSearchTerm] = useState('');

console.log(searchTerm)
    useEffect(()=>{
        const urlParams = new URLSearchParams(location.search);
        const searchTermFromUrl = urlParams.get('searchTerm');
        if(searchTermFromUrl){
            setSearchTerm(searchTermFromUrl);
        }
    }, [location.search])

    const handleSignout = async()=>{
        try {
          const res = await fetch("/api/user/signout", {
            method: "POST"
          });
    
          const data = await res.json()
    
          if(!res.ok){
            console.log(data.message);
          }else{
            dispatch(signoutSuccess())
          }
    
        } catch (error) {
          console.log(error.message)
        }
      }

    const handleSubmit = (e)=>{
        e.preventDefault();
        const urlParams = new URLSearchParams(location.search);
        urlParams.set('searchTerm', searchTerm);
        const serachQuery = urlParams.toString();
        navigate(`/search?${serachQuery}`);
    }
    return (
        <Navbar className='border-b-2 '>
            <Link to="/" className='self-center whitespace-nowrap text-sm sm:text-xl font-semibold  dark:text-white'>
                <span className='px-2 py-1 rounded-lg  bg-gradient-to-r from-indigo-500  via-purple-500 to-pink-500 text-white'>Arjun's</span>
                Blog
            </Link>
            <form  onSubmit={handleSubmit}>
                <TextInput type='text' value={searchTerm} onChange={(e)=> setSearchTerm(e.target.value)} placeholder='Search...' rightIcon={AiOutlineSearch} className='hidden lg:inline' />
            </form>
            <Button className='w-12 h-10 lg:hidden' pill color='gray'>
                <AiOutlineSearch />
            </Button>
            <div className="flex gap-2 md:order-2">
                <Button className='w-12 h-10 hidden sm:inline' color='gray' pill  onClick={()=> dispatch(toggleTheme())}>
                   {
                    theme === 'dark' ?  <FaMoon  /> : <FaSun />
                   }
                </Button>
                {
                    currentUser ? (
                        <Dropdown arrowIcon={false}
                            inline
                            label={
                                <Avatar alt='user' img={currentUser.profilePicture} rounded />
                            }
                        >
                            <Dropdown.Header>
                                <span className='block text-sm'>@{currentUser.username}</span>
                                <span className='block text-sm font-medium truncate'>{currentUser.email}</span>
                            </Dropdown.Header>
                            <Link to={'/dashboard?tab=profile'}>
                                <Dropdown.Item>Profile</Dropdown.Item>
                            </Link>
                            <Dropdown.Divider />
                            <Link to={"/sign-out"}>
                                <Dropdown.Item onClick={handleSignout}>Sign out</Dropdown.Item>
                            </Link>
                        </Dropdown>
                    ) : (
                        <Link to='/sign-in'>
                            <Button gradientDuoTone='purpleToBlue' outline>
                                Sign in
                            </Button>
                        </Link>
                    )
                }
                <Navbar.Toggle />
            </div>
            <Navbar.Collapse>
                <Navbar.Link active={path === '/'} as={'div'}>
                    <Link to='/'>Home</Link>
                </Navbar.Link>

                <Navbar.Link active={path === '/about'} as={'div'}>
                    <Link to='/about'>
                        About
                    </Link>
                </Navbar.Link>

                <Navbar.Link active={path === '/projects'} as={'div'}>
                    <Link to='/projects'>
                        Projects
                    </Link>
                </Navbar.Link>
            </Navbar.Collapse>

        </Navbar>
    )
}

export default Header