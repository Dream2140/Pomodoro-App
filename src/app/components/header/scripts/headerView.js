import {
    eventBus
} from '../../../helpers/eventBus';
import {
    router
} from '../../../routes';

/**
 * @exports HeaderView
 * @description manages header events and view
 * @class HeaderView
 */
export class HeaderView {

    /**
     * @description Creates an instance of HeaderView.
     * @param {object} model instance of HeaderModel
     * @memberof HeaderView
     */
    constructor(model) {
        this.model = model;

        eventBus.subscribe('pageLoaded', () => {
            this.stickyHeader();
            this.setNavListeners();

            if (window.location.pathname === '/task-list') {
                this.addHeaderListeners();
            }
        });

        eventBus.subscribe('raise-counter', () => {

            this.checkTasksToDelete();
        });
    }


    /**
     * @description sets a click listeners on navbar for switching pages
     * @memberof HeaderView
     */
    setNavListeners() {

        const navBtn = document.querySelectorAll('.navigation__btn');

        navBtn.forEach((item) => {
            item.addEventListener('click', (elem) => {
                let temp = elem.target.parentElement;
                if (temp.dataset && temp.dataset.route) {
                    router.navigate(`/${temp.dataset.route}`);
                }
            });
        });
    }

    /**
     * @description adds event listener for scroll event
     * @memberof HeaderView
     */
    stickyHeader() {
        window.addEventListener('scroll', () => {
            const header = document.querySelector('.header');
            const content = document.querySelector('.content');

            if (window.pageYOffset >= 30) {
                content.style.paddingTop = header.offsetHeight + 'px';
                header.classList.add('header--fixed');

            } else {
                content.style.removeProperty('padding-top');
                header.classList.remove('header--fixed');
            }
        });
    }

    addHeaderListeners() {
        document.querySelector('.header__btn-showModal').addEventListener('click', () => {
            eventBus.post('open-modal');
        });

        document.querySelector('.navigation__item--plus').addEventListener('click', () => {
            eventBus.post('open-modal');
        });

        document.querySelector('.navigation__btn--delete').addEventListener('click', () => {
            const counter = document.querySelector('.navigation__counter');


            if (Number(counter.innerText) > 0) {
                const checkedTasks = [...document.querySelectorAll('.checked')];
                const ids = checkedTasks.map(task => task.id);
                eventBus.post('confirm-removing', ids);
            } else {
                eventBus.post('toggle-remove-tasks-mode');
            }
        });

    }

    /**
     * @description сhecks the number of tasks to delete and displays the number
     * @memberof HeaderView
     */
    checkTasksToDelete() {

        const tasksToDelete = document.querySelectorAll('.checked');

        if (tasksToDelete) {
            document.querySelector('.navigation__counter').classList.add('navigation__counter--active');
        } else {
            document.querySelector('.navigation__counter').classList.remove('navigation__counter--active');
        }

        document.querySelector('.navigation__counter').innerHTML = tasksToDelete.length;
    }

}