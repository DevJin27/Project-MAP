const widgetWrapper = ({ children, wide = false }) => {
    return (
      <div className={`rounded-xl p-2 shadow bg-zinc-100 ${wide ? 'aspect-[2/1]' : 'aspect-square'}`}>
        {children}
      </div>
    );
  };
  export default widgetWrapper