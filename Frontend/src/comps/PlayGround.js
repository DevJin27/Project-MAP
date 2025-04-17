import getGridClasses from "./getGridClasses";
const Playground = ({ widgets }) => {
    const gridLayout = getGridClasses(widgets.length);
  
    return (
      <div className={`grid gap-4 ${gridLayout}`}>
        {widgets.map((widget, idx) => {
          const isWide = widgets.length === 2 || (idx === 0 && widgets.length !== 2); // 2:1 for both widgets if widgetCount is 2
          return (
            <widgetWrapper wide={isWide}>
              <div className="text-center font-semibold">{widget.type}</div>
            </widgetWrapper>
          );
        })}
      </div>
    );
  };

export default Playground
  