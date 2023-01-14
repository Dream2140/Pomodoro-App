import './styles/header.less';
import { HeaderController } from './scripts/headerController';
import { HeaderModel } from './scripts/headerModel';
import { HeaderView } from './scripts/headerView';

const headerModel = new HeaderModel();
const headerView = new HeaderView(headerModel);

/* eslint-disable no-unused-vars */
const headerController = new HeaderController(headerView, headerModel);
/* eslint-disable no-unused-vars */