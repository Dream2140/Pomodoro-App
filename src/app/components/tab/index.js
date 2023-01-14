import './styles/tab.less';

import { TabController } from './scripts/tabController';
import { TabView } from './scripts/tabView';
import { TabModel } from './scripts/tabModel';

export const tabModel= new TabModel();
export const tabView = new TabView(tabModel);
export const tabController = new TabController(tabView);