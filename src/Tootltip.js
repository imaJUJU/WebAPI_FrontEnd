import { OverlayTrigger, Tooltip } from 'react-bootstrap';
import "./Tooltip.css"

export function TooltipWrapper(parentprops) {
    return ( <>
        <OverlayTrigger
          delay={{ hide: 250, show: 200 }}
          transition={false}
          overlay={(props) => (
            <>{parentprops.text !== undefined && parentprops.text !== ""?<Tooltip id={"tooltip-mpview-white"} {...props}>{parentprops.text}</Tooltip>:<></>}</>
          )} placement={parentprops.placement?parentprops.placement:"auto"}>
            {parentprops.children}
        </OverlayTrigger>
    </>);
}