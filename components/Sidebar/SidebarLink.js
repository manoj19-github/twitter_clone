import React from 'react'

const SidebarLink = ({children,text,active}) => {
    return (
        <div className={`text-[#d9d9d9] flex items-center hoverIcon
          ${active && "font-bold"} ` }>
          {children}
          <span className={`hidden md:inline ${!active && "font-light"}`}>{text}</span>

        </div>
    )
}

export default SidebarLink
