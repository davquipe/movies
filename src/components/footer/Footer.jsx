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

			</ContentWrapper>
		</footer>
	)
}

export default Footer
