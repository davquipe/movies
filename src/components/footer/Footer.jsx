import { FaFacebookF, FaInstagram, FaTwitter, FaLinkedin } from 'react-icons/fa'

import ContentWrapper from '../contentWrapper/ContentWrapper'

import './Footer.scss'

const Footer = () => {
	return (
		<footer className="footer">
			<ContentWrapper>
				<ul className="menuItems">
					<li className="menuItem">Terms Of Use</li>
					<li className="menuItem">Privacy-Policy</li>
					<li className="menuItem">About</li>
					<li className="menuItem">Blog</li>
					<li className="menuItem">FAQ</li>
				</ul>
				<div className="infoText">
					Movies App is a product of{' '}
					<a
						href="https://github.com/davquipe"
						target="_blank"
						rel="noreferrer">
						David Condori
					</a>
					<br />
					All rights reserved &copy; {new Date().getFullYear()}
				</div>
				<div className="socialIcons">
					<span className="icon">
						<FaFacebookF />
					</span>
					<span className="icon">
						<FaInstagram />
					</span>
					<span className="icon">
						<FaTwitter />
					</span>
					<span className="icon">
						<FaLinkedin />
					</span>
				</div>
			</ContentWrapper>
		</footer>
	)
}

export default Footer
