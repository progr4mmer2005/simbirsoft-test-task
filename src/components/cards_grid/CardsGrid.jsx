import './CardsGrid.css'

export default function CardsGrid({children}) {
    return <>
        <div className='cards-grid'>
            {children}
        </div>
    </>
}