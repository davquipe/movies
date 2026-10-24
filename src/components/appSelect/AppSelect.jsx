/* eslint-disable react/prop-types */
import Select, { components } from 'react-select'
import './AppSelect.scss'

const Control = ({ children, ...props }) => {
	const Icon = props.selectProps.icon
	return <components.Control {...props}>{Icon && <span className="appSelect__controlIcon" aria-hidden="true"><Icon /> </span>}{children}</components.Control>
}

const IndicatorSeparator = () => null

const defaultOptionLabel = (option, { context }) => (
	<span className="appSelect__option">
		{context === 'menu' && option.icon && <option.icon aria-hidden="true" />}
		{context === 'menu' && option.image && <img src={option.image} alt="" />}
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
		styles={{
			container: (base) => ({ ...base, minWidth: 0, width: '100%' }),
			menuPortal: (base) => ({ ...base, zIndex: 100 }),
			...props.styles,
		}}
	/>
)

export default AppSelect
