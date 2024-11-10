import logo from './cupid-logo.png'
import { Link } from 'react-router-dom'
import '../../App.css'

const Navbar = ({show}) => {
    return (
        <div className={show ? 'sidenav active' : 'sidenav'}>
            <img src={logo} alt="logo" className='logo' />
            <ul>
                <li>
                    <Link to="/" >Home</Link>
                </li>
                <li>
                    <Link to="/album">Album</Link>
                </li>
            </ul>
        </div>
    )
}
export default Navbar