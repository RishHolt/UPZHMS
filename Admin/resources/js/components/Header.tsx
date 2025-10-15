import React from "react";

type MainHeaderProps = {
  title: string;
  subtext?: string;
  className?: string;
  children?: React.ReactNode;
};

const Header: React.FC<MainHeaderProps> = ({ title, subtext, className, children }) => (
  <div className={`border-gray-200 ${className ?? ""}`}>
    <h1 className="font-bold text-primary text-2xl">{title}</h1>
    {subtext && <p className="mt-1 text-sm">{subtext}</p>}
    {children}
  </div>
);

export default Header;
