export function DefaultButton({children, className, active}: {children: React.ReactNode, className?: string, active?: boolean}) {
    return (
            <button className={className}>{children}</button>
    )
}