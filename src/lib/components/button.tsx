export function Button({children, className, active}: {children: React.ReactNode, className?: string, active?: boolean}) {
    return (
        <div className="px-10 py-5 rounded-full w-full bg-green-500">
            <h3 className="c-text">Button Field</h3>
            <button className={className}>{children}</button>
            {active && <p>description</p>}
        </div>
    )
}