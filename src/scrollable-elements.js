import {$$} from "./selectors";

const directionPropMap = {
  y: "scrollTop",
  x: "scrollLeft"
};

function getScrollable(selectors, direction = "y", all = true) {
  const prop = directionPropMap[direction];
  const elements = $$(selectors);
  const scrollables = [];

  for ( let i = 0; i < elements.length; i++ ) {
    let el = elements[i];

    if( el[prop] > 0 ) {
      scrollables.push(el);

    } else {
      el[prop] = 1;
      if( el[prop] > 0 ) {
        scrollables.push(el);
      }
      el[prop] = 0;
    }

    if ( !all && scrollables.length > 0 ) break;
  }

  return scrollables;
}

export function scrollableFindAll(selectors, direction) {
  return getScrollable(selectors, direction, true);
}

export function scrollableFind(selectors, direction) {
  const scrollables = getScrollable(selectors, direction, false);
  return scrollables.length >= 1 ? scrollables[0] : undefined;
}