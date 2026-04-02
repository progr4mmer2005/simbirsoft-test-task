import './ContentWrapper.css'

export default function ContentWrapper( {children}) {
    return <>
        <div className="content-wrapper">
            {children}
        </div>
    </>
    
}