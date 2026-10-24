/* eslint-disable react/prop-types */
import Select, { components } from 'react-select'
import './AppSelect.scss'

const Control = ({ children, ...props }) => {
	return <components.Control {...props}>{children}</components.Control>
}

const IndicatorSeparator = () => null

const defaultOptionLabel = (option, { context }) => (
	<span className="appSelect__option">
		{option.flagEmoji && (context === 'menu' || option.showIconInValue) && <span className="appSelect__flag" aria-hidden="true">{option.flagEmoji}</span>}
		{option.icon && (context === 'menu' || option.showIconInValue) && typeof option.icon !== 'string' && <option.icon aria-hidden="true" />}
		{option.image && (context === 'menu' || option.showImageInValue) && <img src={option.image} alt="" loading="lazy" />}
		{option.flag && (context === 'menu' || option.showImageInValue) && <img src={`https://flagcdn.com/w40/${option.flag.toLowerCase()}.png`} alt="" loading="lazy" />}
		<span>{option.label}</span>
	</span>
)

const AppSelect = ({ className = '', components: customComponents = {}, ...props }) => (
	<Select
		{...props}
		className={`appSelect ${className}`.trim()}
		classNamePrefix="app-select"
		components={{ Control, IndicatorSeparator, ...customComponents }}
		formatOptionLabel={props.formatOptionLabel || defaultOptionLabel}
		icon={null}
		styles={{
			container: (base) => ({ ...base, minWidth: 0, width: '100%' }),
			menuPortal: (base) => ({ ...base, zIndex: 100 }),
			...props.styles,
		}}
	/>
)

export default AppSelect
