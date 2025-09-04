import { FaFacebookF, FaInstagram, FaTwitter, FaLinkedin } from 'react-icons/fa'
import ContentWrapper from '../contentWrapper/ContentWrapper'
import './Footer.scss'

const menuItems = ['Terms Of Use', 'Privacy Policy', 'About', 'Blog', 'FAQ']

const Footer = () => {
	return (
		<footer className="footer">
			<ContentWrapper>
				<nav aria-label="Footer menu">
					<ul className="menuItems">
						{menuItems.map((label) => (
							<li key={label} className="menuItem">
								<span>{label}</span>
							</li>
						))}
					</ul>
				</nav>

				<div className="infoText">
					Movies App is developed by{' '}
					<a
						href="https://github.com/davquipe"
						target="_blank"
						rel="noreferrer">
						David Condori
					</a>
				</div>

				<small className="infoText">
					All rights reserved &copy; {new Date().getFullYear()}
				</small>

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
