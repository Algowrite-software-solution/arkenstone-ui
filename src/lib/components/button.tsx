export function Button({children, className}: {children: React.ReactNode, className?: string}) {
    return (
        <div className="px-10 py-5 rounded-full">
            <h3>Button Field</h3>
            <button className={className}>{children}</button>
            <p>description</p>
        </div>
    )
}