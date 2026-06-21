interface MenuConfig {
    behaviour: "hide" | "show" 
}

interface ClassNames {
    menu?: string
    item?: string
    link?: string
    active?: string
    inactive?: string
}

interface MenuItems {
    label: string
    href: string
}

interface DefaultMenuProps {
    mapping: object
    menuItems: MenuItems[]   
    config: MenuConfig
    classNames: ClassNames
}

export function DefaultMenu({ mapping, config, menuItems }: DefaultMenuProps) {
    return <div className="bg-red-500">Default Menu</div>
}