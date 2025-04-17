function getGridClasses(widgetCount) {
    if (widgetCount === 1) return "grid-cols-1 grid-rows-1";
    if (widgetCount === 2) return "grid-cols-2 grid-rows-1";
    if (widgetCount === 3) return "grid-cols-2 grid-rows-2";
    if (widgetCount === 4) return "grid-cols-2 grid-rows-2";
    if (widgetCount === 5) return "grid-cols-2 grid-rows-3";
    if (widgetCount === 6) return "grid-cols-3 grid-rows-2";
    return "grid-cols-3 grid-rows-3";
  }
export default getGridClasses  