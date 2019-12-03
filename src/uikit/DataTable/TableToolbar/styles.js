import Row from 'uikit/Row';
import { styleComponent } from 'components/Utils';

import './TableToolbar.css';

export const Toolbar = styleComponent(Row, 'tableToolbar-toolbar');
export const ToolbarGroup = styleComponent(Row, 'toolbar-group');
export const ToolbarSelectionCount = styleComponent('div', 'toolbar-selectionCount');
export const ToolbarDownload = styleComponent('div', 'toolbarDownload');
