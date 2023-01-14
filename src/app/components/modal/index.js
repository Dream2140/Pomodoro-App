import './styles/modal.less';
import { ModalController } from './scripts/modalController';
import { ModalView } from './scripts/modalView';
import { ModalModel } from './scripts/modalModel';

export const modalModel= new ModalModel();
export const modalView = new ModalView();
export const modalController = new ModalController(modalView,modalModel);
