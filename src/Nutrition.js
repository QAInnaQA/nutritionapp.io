export const Nutrition = ({ index, label, quantity, unit }) => {
    return (
        <div>
            <p className="label" key={index}><b>{label}</b> - {quantity} {unit}</p>
        </div>
    )
}