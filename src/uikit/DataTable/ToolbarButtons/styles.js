import { styleComponent } from 'components/Utils';
import ChevronIcon from 'icons/ChevronIcon';
import DownloadIcon from 'icons/DownloadIcon';

import './ToolbarButtons.css';

export const ToolbarItem = styleComponent('div', 'tableToolbar-toolbarItem');
export const ToolbarButton = styleComponent('button', 'tableToolbar-toolbarButton');
export const ColumnIcon = styleComponent(ChevronIcon, 'tableToolbar-chevronIcon');
export const FileDownloadIcon = styleComponent(DownloadIcon, 'FileDownloadIcon');
export const DropdownHeader = styleComponent('div', 'tableToolbar-dropdownHeader');
export const DropdownContent = styleComponent('div', 'tableToolbar-dropdownContent');
