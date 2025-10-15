interface MainProps {
    children: React.ReactNode;
}

const Main = ({ children }: MainProps) => {
    return (
        <div className="flex-1 bg-gray-100 p-6 overflow-y-auto text-gray-900">
            {children}
        </div>
    );
};

export default Main;